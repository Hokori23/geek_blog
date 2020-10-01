import { MailAccepter } from '@vo';
import moment from 'moment';
import NodeMailer from 'nodemailer';
moment.locale('zh-cn');

import template from './template';

// 通用设置
const MAILER_OPTIONS = {
  secure: true,
  pool: true,
  maxConnections: 10,
  maxTryCount: 3,
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: 'hokori23@qq.com',
    pass: ''
  }
};
// 发送者设置
const SENDER_OPTIONS = {
  from: {
    name: '无情小尘埃_Hokori',
    address: 'hokori23@qq.com'
  }
};

// 接收邮件的邮箱列表
const ACCEPTERS = [
  {
    to: {
      name: '无情小尘埃_Hokori',
      address: 'hokori23@qq.com'
    }
  }
];

/**
 * @param { string } subject 邮件标题
 * @param { string } html 邮件模板
 * @param { Array<MailAccepter> } accepters 邮件接收者
 * @description 广播邮件
 */
const broadcast = (
  subject: string,
  html: string,
  accepters: Array<MailAccepter>
) => {
  const promiseArr = accepters.map((accepter) => {
    const transporter = NodeMailer.createTransport(MAILER_OPTIONS);

    // 添加to, subject, HTML文本内容属性
    const sendOptions = Object.assign(SENDER_OPTIONS, accepter, {
      subject,
      html
    });

    return new Promise(async (resolve, reject) => {
      try {
        const res = await transporter.sendMail(sendOptions);
        resolve(res);
      } catch (e) {
        send(subject, html, accepter)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            reject(e);
          });
      }
    });
  });
  return Promise.all(promiseArr);
};

/**
 * @param { string } subject 邮件标题
 * @param { string } html 邮件模板
 * @param { MailAccepter } accepter 接收人
 * @param { Number } count 错误次数
 * @param { Error } e
 * @description 发送单封邮件
 */
const send = (
  subject: string,
  html: string,
  accepter: MailAccepter,
  count: number = 1,
  e = null
) => {
  return new Promise(async (resolve, reject) => {
    if (count > MAILER_OPTIONS.maxTryCount) {
      console.log(`
邮件发送失败，时间：${moment().format('llll')}
            `);
      reject(e);
      return;
    }
    console.log(
      `${accepter.name} <${accepter.address}>: 第 ${count} 次尝试重发邮件...`
    );
    const transporter = NodeMailer.createTransport(MAILER_OPTIONS);
    // 添加to, subject, HTML文本内容属性
    const sendOptions = Object.assign(SENDER_OPTIONS, accepter, {
      subject,
      html
    });
    try {
      const res = await transporter.sendMail(sendOptions);
      resolve(res);
    } catch (e) {
      count++;
      send(subject, html, accepter, count, e)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

export { broadcast, send, template };
export default {
  broadcast,
  send,
  template
};

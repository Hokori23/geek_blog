import { MailAccepterAction as Action } from '@action';
import { Restful, cipherCrypto } from '@public';
import { MailAccepter } from '@vo';
import { broadcast, send, template } from '@mailer';
import { blogConfig, serverConfig } from '@config';

const { SubscribeConfirmTemplate } = template;
const { password } = serverConfig.crypto;

/**
 * 发送确认订阅邮件
 * @param { MailAccepter } mailAccepter
 */
const SendSubscribeConfirmEmail = async (
  mailAccepter: MailAccepter
): Promise<Restful> => {
  try {
    const { name, address } = mailAccepter;
    const existedMailAccepter = await Action.Retrieve__ByNameOrAddress(
      name,
      address
    );
    if (existedMailAccepter) {
      return name === existedMailAccepter.name &&
        address === existedMailAccepter.address
        ? new Restful(1, '发送订阅确认邮件失败，订阅者名字和邮箱已存在')
        : name === existedMailAccepter.name
        ? new Restful(2, '发送订阅确认邮件失败，订阅者名字已存在')
        : new Restful(3, '发送订阅确认邮件失败，订阅者邮箱已存在');
    }
    const SubscribeConfirmAttributes = {
      title: `是否确认订阅${blogConfig.blogName}的最新消息`,
      accepter: mailAccepter,
      subscribeUrl: `${
        blogConfig.publicPath
      }/mail/subscribe-confirm?name=${cipherCrypto(
        name,
        password
      )}&address=${cipherCrypto(address, password)}`
    };
    // 设置：邮件过期时间
    await send(
      `是否确认订阅${blogConfig.blogName}的最新消息`,
      await SubscribeConfirmTemplate(SubscribeConfirmAttributes),
      mailAccepter
    );
    return new Restful(0, '发送订阅确认邮件成功', {
      ...mailAccepter.toJSON(),
      subscribeInfo: SubscribeConfirmAttributes
    });
  } catch (e) {
    return new Restful(99, `发送订阅确认邮件失败, ${e.message}`);
  }
};

/**
 * 广播邮件
 * @param { string } subject  邮件标题
 * @param { string } html 邮件模板
 * @param { Array<MailAccepter> | null } mailAccepters  邮件接收者
 */
const Broadcast = async (
  subject: string,
  html: string,
  mailAccepters: Array<MailAccepter> | null = null
): Promise<Restful> => {
  try {
    // 默认值为mail_accepter表内所有订阅者
    mailAccepters = mailAccepters || (await Action.Retrieve__All());
    await broadcast(subject, html, mailAccepters);
    return new Restful(0, '广播邮件成功');
  } catch (e) {
    return new Restful(99, `广播邮件失败, ${e.message}`);
  }
};

/**
 * 订阅
 * @param mailAccepter
 */
const Subscribe = async (mailAccepter: MailAccepter): Promise<Restful> => {
  try {
    const { name, address } = mailAccepter;
    const existedMailAccepter = await Action.Retrieve__ByNameOrAddress(
      name,
      address
    );
    if (existedMailAccepter) {
      return name === existedMailAccepter.name
        ? new Restful(1, '订阅失败，订阅者名字已存在')
        : new Restful(2, '订阅失败，订阅者邮箱已存在');
    }
    mailAccepter = await Action.Create(mailAccepter);
    return new Restful(0, '订阅成功', mailAccepter);
  } catch (e) {
    return new Restful(99, `订阅失败, ${e.message}`);
  }
};

/**
 * 取消订阅
 * @param { number } id
 */
const Unsubscribe = async (id: number): Promise<Restful> => {
  try {
    const deleteRows = await Action.Delete(id);
    return deleteRows > 0
      ? new Restful(0, '取消订阅成功')
      : new Restful(1, '取消订阅失败');
  } catch (e) {
    return new Restful(99, `取消订阅失败, ${e.message}`);
  }
};

export default {
  SendSubscribeConfirmEmail,
  Broadcast,
  Subscribe,
  Unsubscribe
};

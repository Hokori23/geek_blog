import { MailAccepterAction as Action } from '@action';
import { Restful, cipherCrypto } from '@public';
import { MailAccepter } from '@vo';
import { broadcast, send, template } from '@mailer';
import { blogConfig, serverConfig } from '@config';

const { SubscribeConfirmTemplate } = template;
const { password } = serverConfig.crypto;

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
    console.log(SubscribeConfirmAttributes);
    // 设置：邮件过期时间
    await send(
      `是否确认订阅${blogConfig.blogName}的最新消息`,
      SubscribeConfirmTemplate(SubscribeConfirmAttributes),
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
 * 通过name或address查询订阅者
 * @param { string } name
 * @param { string } address
 */
const Retrieve__ByNameOrAddress = async (
  name: string,
  address: string
): Promise<Restful> => {
  return new Restful(
    0,
    '查询成功',
    await Action.Retrieve__ByNameOrAddress(name, address)
  );
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
  Subscribe,
  Unsubscribe
};

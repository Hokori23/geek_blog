import moment from 'moment';

import {
  MailAccepterAction as Action,
  SettingAction,
  PostCommentAction
} from '@action';
import { Restful, isUndef, cipherCrypto, decipherCrypto } from '@public';
import { MailAccepter, Setting, Post, PostComment } from '@vo';
import { broadcast, send, template } from '@mailer';
import { blogConfig, serverConfig } from '@config';

const {
  SubscribeConfirmTemplate,
  UnsubcribeConfirmTemplate,
  NewPostTemplate
} = template;
const { password } = serverConfig.crypto;

/**
 *
 * *** 设置 ***
 *
 */
interface MailSettingJSON {
  accepter_new_subscriber: boolean; // 接受新的订阅者
  broadcast_when_newPost: boolean; // 当新帖子发布时广播邮件
  send_mail_when_reply_comment: boolean; // 当评论有回复时邮件(全局)
  subscribe_confirm_email_expire_time: number; // 订阅确认邮件过期时间(天)
  unsubscribe_need_confirm: boolean; // 取消订阅时是否需要发送确认邮件
}
const settingName = 'mail_setting';

/**
 * 初始化邮箱设置
 */
const InitSetting = async (): Promise<Setting | boolean> => {
  // 默认初始化设置
  const mailSettingJSON: MailSettingJSON = {
    accepter_new_subscriber: true,
    broadcast_when_newPost: true,
    send_mail_when_reply_comment: true,
    subscribe_confirm_email_expire_time: 1,
    unsubscribe_need_confirm: false
  };
  return SettingAction.Init(
    Setting.build({
      name: settingName,
      setting_json: JSON.stringify(mailSettingJSON)
    })
  );
};

/**
 * 更新邮箱设置
 * @param { MailSettingJSON } newMailSettingJSON
 */
const UpdateSetting = async (newMailSettingJSON: MailSettingJSON) => {
  const existedMailSetting = await Setting.findOne({
    where: { name: settingName }
  });
  if (!existedMailSetting) {
    return false;
  }
  const newMailSetting: any = Setting.build({
    name: settingName,
    setting_json: newMailSettingJSON
  }).toJSON();
  return SettingAction.Update(existedMailSetting, newMailSetting);
};

/**
 * 删除邮箱设置
 */
const DeleteSetting = async () => {
  return SettingAction.Delete(settingName);
};

/**
 *
 * *** 业务 ***
 *
 */

/**
 * 发送确认订阅邮件
 * @param { MailAccepter } mailAccepter
 */
const SendSubscribeConfirmEmail = async (
  mailAccepter: MailAccepter
): Promise<Restful> => {
  try {
    // 检查设置
    const setting = await SettingAction.Retrieve__ByName(settingName);
    if (!setting) {
      return new Restful(4, '发送订阅确认邮件失败，设置项不存在');
    }
    const setting_json = <MailSettingJSON>JSON.parse(setting.setting_json);
    if (!setting_json.accepter_new_subscriber) {
      return new Restful(5, '发送订阅确认邮件失败，现在不接受邮件订阅');
    }

    const { name, address } = mailAccepter;
    const existedMailAccepter: any = (
      await Action.Retrieve__ByNameOrAddress(name, address)
    )?.toJSON();
    if (existedMailAccepter) {
      return name === existedMailAccepter.name &&
        address === existedMailAccepter.address
        ? new Restful(1, '发送订阅确认邮件失败，订阅者名字和邮箱已存在')
        : name === existedMailAccepter.name
        ? new Restful(2, '发送订阅确认邮件失败，订阅者名字已存在')
        : new Restful(3, '发送订阅确认邮件失败，订阅者邮箱已存在');
    }

    const encryptedName = cipherCrypto(name, password);
    const encryptedAddress = cipherCrypto(address, password);
    const encryptedTime = cipherCrypto(String(Date.now()), password);

    const SubscribeConfirmInfo = {
      title: `确认订阅${blogConfig.blogName}`,
      accepter: mailAccepter,
      subscribeUrl: `${blogConfig.publicPath}/mail/subscribe?name=${encryptedName}&address=${encryptedAddress}&time=${encryptedTime}`
    };

    await send(
      `是否确认订阅${blogConfig.blogName}的最新消息`,
      await SubscribeConfirmTemplate(SubscribeConfirmInfo),
      mailAccepter
    );
    mailAccepter.isActived = false;
    await Action.Create(mailAccepter);
    return new Restful(0, '发送订阅确认邮件成功', {
      ...mailAccepter.toJSON(),
      subscribeInfo: SubscribeConfirmInfo
    });
  } catch (e) {
    return new Restful(99, `发送订阅确认邮件失败, ${e.message}`);
  }
};

/**
 * 订阅
 * @param { MailAccepter } mailAccepter
 * @param { string } sentTime 邮件发送的时间
 */
const Subscribe = async (
  mailAccepter: MailAccepter,
  sentTime: string
): Promise<Restful> => {
  try {
    // 检查设置
    const setting = await SettingAction.Retrieve__ByName(settingName);
    if (!setting) {
      return new Restful(3, '确认订阅失败，设置项不存在');
    }
    const setting_json = <MailSettingJSON>JSON.parse(setting.setting_json);
    if (!setting_json.accepter_new_subscriber) {
      return new Restful(4, '确认订阅失败，现在不接受邮件订阅');
    }

    // 解密时间并验证合法性
    const expiredTime = moment(Number(decipherCrypto(sentTime, password))).add(
      setting_json.subscribe_confirm_email_expire_time,
      'days'
    );
    if (moment().isBefore(expiredTime)) {
      return new Restful(5, '该确认邮件已过期');
    }

    // 解密name和address
    mailAccepter.name = <string>decipherCrypto(mailAccepter.name, password);
    mailAccepter.address = <string>(
      decipherCrypto(mailAccepter.address, password)
    );
    const { name, address } = mailAccepter;
    const existedMailAccepter = await Action.Retrieve__ByNameAndAddress(
      name,
      address
    );
    if (existedMailAccepter) {
      if (existedMailAccepter.isActived) {
        return new Restful(1, '邮箱已订阅');
      }
      mailAccepter.isActived = true;
      mailAccepter = await Action.Update(existedMailAccepter, mailAccepter);
      return new Restful(0, '订阅成功', mailAccepter.toJSON());
    } else {
      return new Restful(2, '该订阅邮件对应的请求不存在');
    }
  } catch (e) {
    return new Restful(99, `订阅失败, ${e.message}`);
  }
};

/**
 * 发送确认取消订阅邮件
 * @param { MailAccepter } mailAccepter
 */
const SendUnsubscribeConfirmEmail = async (
  mailAccepter: MailAccepter
): Promise<Restful> => {
  try {
    // 检查设置
    const setting = await SettingAction.Retrieve__ByName(settingName);
    if (!setting) {
      return new Restful(4, '发送取消订阅邮件失败，设置项不存在');
    }
    const setting_json = <MailSettingJSON>JSON.parse(setting.setting_json);

    const { name, address } = mailAccepter;
    const encryptedName = cipherCrypto(name, password);
    const encryptedAddress = cipherCrypto(address, password);

    if (!setting_json.unsubscribe_need_confirm) {
      // 不需要发送确认邮件, 直接取消订阅
      return Unsubscribe(MailAccepter.build({ name, address }));
    }

    const UnsubscribeConfirmInfo = {
      title: `确认取消订阅${blogConfig.blogName}`,
      accepter: mailAccepter,
      unsubscribeUrl: `${blogConfig.publicPath}/mail/unsubscribe-confirm?name=${encryptedName}&address=${encryptedAddress}`
    };

    await send(
      `是否取消订阅${blogConfig.blogName}的最新消息`,
      await UnsubcribeConfirmTemplate(UnsubscribeConfirmInfo),
      mailAccepter
    );
    return new Restful(0, '发送取消订阅邮件成功', {
      ...mailAccepter.toJSON(),
      subscribeInfo: UnsubscribeConfirmInfo
    });
  } catch (e) {
    return new Restful(99, `发送取消订阅邮件失败, ${e.message}`);
  }
};

/**
 * 取消订阅
 * @param { MailAccepter } mailAccepter
 */
const Unsubscribe = async (mailAccepter: MailAccepter): Promise<Restful> => {
  try {
    // 解密name和address
    mailAccepter.name = <string>decipherCrypto(mailAccepter.name, password);
    mailAccepter.address = <string>(
      decipherCrypto(mailAccepter.address, password)
    );
    const { name, address } = mailAccepter;
    const existedMailAccepter = await Action.Retrieve__ByNameAndAddress(
      name,
      address
    );
    if (!existedMailAccepter) {
      return new Restful(1, '该订阅者不存在');
    }

    const deleteRows = await Action.Delete(<number>existedMailAccepter.id);
    return deleteRows > 0
      ? new Restful(0, '取消订阅成功')
      : new Restful(2, '取消订阅失败');
  } catch (e) {
    return new Restful(99, `取消订阅失败, ${e.message}`);
  }
};

/**
 * 遍历订阅者
 */
const Retrieve__All = async (): Promise<Restful> => {
  return new Restful(0, '查询成功', await Action.Retrieve__All());
};

/**
 * 编辑订阅者
 * @param { MailAccepter } mailAccepter
 * @param { number } userPower
 */
const Edit = async (
  mailAccepter: MailAccepter,
  userPower: number
): Promise<Restful> => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(1, `编辑失败, 权限不足`);
    }
    const existedMailAccepter = await Action.Retrieve__ByID(
      <number>mailAccepter.id
    );
    if (!existedMailAccepter) {
      return new Restful(2, '订阅者不存在');
    }
    const newMailAccepter = await Action.Update(
      existedMailAccepter,
      mailAccepter
    );
    return new Restful(0, '编辑成功', newMailAccepter.toJSON());
  } catch (e) {
    return new Restful(99, `编辑失败, ${e.message}`);
  }
};

/**
 * 删除订阅者
 * @param { number } id
 * @param { number } userPower
 */
const Delete = async (id: number, userPower: number) => {
  try {
    if (isUndef(userPower) || userPower > 1) {
      return new Restful(2, `删除失败, 权限不足`);
    }
    const existedMailAccepter = await Action.Retrieve__ByID(id);
    if (!existedMailAccepter) {
      return new Restful(1, '订阅者不存在');
    }
    const deleteRow = await Action.Delete(id);
    return deleteRow > 0
      ? new Restful(0, '删除成功')
      : new Restful(3, '删除失败');
  } catch (e) {
    return new Restful(99, `删除失败, ${e.message}`);
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
    // 默认值为mail_accepter表内所有已激活的订阅者
    mailAccepters = mailAccepters || (await Action.Retrieve__All__IsActived());
    await broadcast(subject, html, mailAccepters);
    return new Restful(0, '广播邮件成功');
  } catch (e) {
    return new Restful(99, `广播邮件失败, ${e.message}`);
  }
};

/**
 * 当发布帖子时广播邮件
 * @param { Post } post
 */
const Broadcast__WhenNewPost = async (post: Post): Promise<Restful> => {
  // 检查设置
  const setting = await SettingAction.Retrieve__ByName(settingName);
  if (!setting) {
    return new Restful(2, '发送订阅确认邮件失败，设置项不存在');
  }
  const setting_json = <MailSettingJSON>JSON.parse(setting.setting_json);
  if (!setting_json.broadcast_when_newPost) {
    return new Restful(1, '发送订阅确认邮件失败，设置为禁止广播邮件');
  }

  const subject = `你关注的博主 ${blogConfig.blogger} 更新啦 -- 来自${blogConfig.blogName}`;

  const newPostInfo = {
    title: subject,
    postTitle: <string>post.title,
    newPostUrl: `${blogConfig.publicPath}/post/${post.id}`
  };

  return Broadcast(subject, await NewPostTemplate(newPostInfo));
};

/**
 * 回复评论时广播给父评论（勾选了`有回复时是否接受邮件`选项）
 * @param { Post } post
 * @param { PostComment} postComment
 */
const Broadcast__WhenReply = async (
  post: Post,
  postComment: PostComment
): Promise<Restful> => {
  const parentID = <number>postComment.parent_id;
  const promises: Array<Promise<any>> = [
    PostCommentAction.Retrieve__ByID(parentID),
    PostCommentAction.Retrieve__ChildrenComments__ByID(parentID)
  ];
  const promiseValues = await Promise.all(promises);
  const mailAccepters: Array<MailAccepter> = [
    promiseValues[0],
    ...promiseValues[1]
  ]
    .filter(
      (existedPostComment) =>
        existedPostComment.id !== postComment.id &&
        existedPostComment.receive_reply_mail
    )
    .map((postComment) => {
      return MailAccepter.build({
        name: postComment.username,
        address: postComment.email
      });
    });

  // TODO 临时模板
  console.log(mailAccepters);
  const subject = ``;
  const html = ``;
  return Broadcast(subject, html, mailAccepters);
};

export default {
  InitSetting,
  UpdateSetting,
  DeleteSetting,
  SendSubscribeConfirmEmail,
  Subscribe,
  SendUnsubscribeConfirmEmail,
  Unsubscribe,
  Retrieve__All,
  Edit,
  Delete,
  Broadcast,
  Broadcast__WhenNewPost,
  Broadcast__WhenReply
};

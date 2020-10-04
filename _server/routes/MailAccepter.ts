import EXPRESS from 'express';

import { MailAccepterService as Service } from '@service';
import { MailAccepter } from '@vo';
import { Restful } from '@public';
const ROUTER = EXPRESS.Router();

/**
 * 初始化邮箱设置
 */
Service.InitSetting();

/**
 * 由前端发送订阅确认邮件
 * @path /subscribe-confirm
 */
ROUTER.post('subscribe-confirm', async (req, res, next) => {
  const mailAccepter = MailAccepter.build(req.body);

  try {
    if (!MailAccepter.checkIntegrity(['name', 'address'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res
        .status(200)
        .json(await Service.SendSubscribeConfirmEmail(mailAccepter));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 订阅
 * @path /subscribe
 */
ROUTER.get('/subscribe', async (req, res, next) => {
  // 参数负载在订阅确认邮件生成的url上
  const mailAccepter: any = MailAccepter.build(req.query).toJSON();

  try {
    if (!MailAccepter.checkIntegrity(['name', 'address'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Subscribe(mailAccepter));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 取消订阅
 * @path /unsubscribe
 */
ROUTER.get('/unsubscribe', async (req, res, next) => {
  // 参数负载在每封订阅邮件生成的url上
  const mailAccepter: any = MailAccepter.build(req.query).toJSON();

  try {
    if (!MailAccepter.checkIntegrity(['name', 'address'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Unsubscribe(mailAccepter));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

export default ROUTER;

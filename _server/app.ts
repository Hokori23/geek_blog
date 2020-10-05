import {
  Home as HomeRouter,
  User as UserRouter,
  Post as PostRouter,
  PostTag as PostTagRouter,
  MailAccepter as MailAccepterRouter
} from '@routes';
import { MailAccepterService } from '@service';

import {
  JWTFilter,
  SkipOptions,
  LoggerStart,
  LoggerMiddle,
  LoggerEnd
} from './middleware';

const EXPRESS = require('express');
// const PATH = require("path");
// const LOGGER = require("morgan");

const APP = EXPRESS();

//parse application/x-www-form-urlencoded
APP.use(EXPRESS.urlencoded({ extended: true }));
//parse application/json
APP.use(EXPRESS.json());

// 中间件
APP.use(SkipOptions);
APP.use(LoggerStart);
APP.use(JWTFilter);
APP.use(LoggerMiddle); // 如果JWTFilter已给出响应，整个中间件链在此提前结束

// APP.use(LOGGER("dev"));
// app.use(express.static(PATH.join(__dirname, 'public')));

/**
 * Initial
 */
(async () => {
  console.log('Start to init');
  const promises = [MailAccepterService.InitSetting()];
  await Promise.all(promises);
  console.log('Inited successfully');
})();

APP.use('/', HomeRouter);
APP.use('/user', UserRouter);
APP.use('/post', PostRouter);
APP.use('/post-tag', PostTagRouter);
APP.use('/mail', MailAccepterRouter);

// 中间件
APP.use(LoggerEnd);

module.exports = APP;

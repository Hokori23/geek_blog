# npm 命令汇总

## npm run dev

开发模式下启动服务器

## npm run serve

生产模式下启动服务器

## npm run build

typescript 一次编译

## npm run build:watch

typescript 监听变动进行编译

# 文件目录

## database

数据库连接

## public

公共函数库

## vo

VO 类，用于定义类

## action

Action 层，基本的 CRUD

## service

Service 层，组合 Action 层的 CRUD 完成不同的业务功能

## middleware

中间件层，JWT、Logger 等

## bin

存放的 www.ts 用于启动服务器监听端口

## app.ts

express 处理层

## routes

express 路由层，即 Listen 层

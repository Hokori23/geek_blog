import { PostService as Service } from '@service';
import { Post } from '@vo';
import { Restful, isDef, isUndef } from '@public';
const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

/**
 * 单个查询
 * @path /retrieve-id
 */
ROUTER.get('/retrieve-id', async (req, res, next) => {
  const { id } = req.query;
  try {
    if (isUndef(id)) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Retrieve__ByID(id));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 分页查询
 * @path /retrieve
 */
ROUTER.get('/retrieve', async (req, res, next) => {
  const { page, capacity } = req.query;
  try {
    if (isUndef(page) && isUndef(capacity) && page < 0 && capacity < 0) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Retrieve__Page(page, capacity));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 模糊查询
 * @path /retrieve-fuzzy
 */
ROUTER.get('/retrieve-fuzzy', async (req, res, next) => {
  const { content } = req.query;
  try {
    if (isUndef(content)) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Retrieve__Fuzzy(content));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 发布帖子
 * @path /create
 */
ROUTER.post('/create', async (req, res, next) => {
  const post: Post = Post.clone(req.body);

  try {
    if (!post.checkIntegrity(['id', 'content'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Create(post));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 编辑
 * @path /edit
 */
ROUTER.post('/edit', async (req, res, next) => {
  const post: Post = Post.clone(req.body);

  try {
    if (!post.checkIntegrity(['id', 'content'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Edit(post));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 删除
 * @path /delete
 */
ROUTER.post('/delete', async (req, res, next) => {
  const { id } = req.body;
  try {
    if (isUndef(id)) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Delete(id));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

export default ROUTER;

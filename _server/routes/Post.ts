import { PostService as Service } from '@service';
import { Post } from '@vo';
import { Restful, isDef, isUndef } from '@public';
const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

/**
 * 发布帖子
 * @path /create
 */
ROUTER.post('/create', async (req, res, next) => {
  const post = Post.build(req.body);
  const { post_tag_names } = req.body;
  const { userPower, userAccount } = res.locals;

  try {
    if (!Post.checkIntegrity(['content'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res
        .status(200)
        .json(
          await Service.Create(post, post_tag_names, userPower, userAccount)
        );
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

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
  const { page, capacity, isASC } = req.query;
  try {
    if (isUndef(page) || isUndef(capacity) || page < 0 || capacity < 0) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res
        .status(200)
        .json(await Service.Retrieve__Page(page, capacity, Boolean(isASC)));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 分页模糊查询
 * @path /retrieve-fuzzy
 */
ROUTER.get('/retrieve-fuzzy', async (req, res, next) => {
  const { page, capacity, content, isASC } = req.query;
  try {
    if (
      isUndef(page) ||
      isUndef(capacity) ||
      page < 0 ||
      capacity < 0 ||
      isUndef(content)
    ) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res
        .status(200)
        .json(
          await Service.Retrieve__Fuzzy(page, capacity, content, Boolean(isASC))
        );
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
  const post: any = Post.build(req.body).toJSON();
  const { userPower, userAccount } = res.locals;

  try {
    if (!Post.checkIntegrity(['id', 'content'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Edit(post, userPower, userAccount));
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
      res.status(200).json(await Service.Delete(id, res.locals.userPower));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

export default ROUTER;

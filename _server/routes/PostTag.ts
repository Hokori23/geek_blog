import EXPRESS from 'express';

import { PostTagService as Service } from '@service';
import { PostTag } from '@vo';
import { Restful, isUndef, checkIntegrity } from '@public';

const ROUTER = EXPRESS.Router();

/**
 * 新建帖子标签
 * @path /create
 */
ROUTER.post('/create', async (req, res, next) => {
  const postTag: PostTag = PostTag.build(req.body);

  try {
    if (!checkIntegrity(postTag, ['name', 'slug'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Create(postTag, res.locals.userPower));
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end();
  }
  next();
});

/**
 * 通过标签名查找帖子（分页）
 * @path /retrieve
 * @description 返回的是帖子数组
 */
ROUTER.get('/retrieve-slug', async (req, res, next) => {
  const { slug, page, capacity } = req.query;
  try {
    if (
      isUndef(slug) &&
      isUndef(page) &&
      isUndef(capacity) &&
      page < 0 &&
      capacity < 0
    ) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res
        .status(200)
        .json(await Service.Retrieve__BySlug(slug, page, capacity));
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
  const postTag: any = PostTag.build(req.body).toJSON();

  try {
    if (!checkIntegrity(postTag, ['id', 'name', 'slug'])) {
      res.status(200).json(new Restful(1, '参数错误'));
    } else {
      res.status(200).json(await Service.Edit(postTag, res.locals.userPower));
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

import { serverConfig } from '@config';
const crytpoConfig = serverConfig.crytpo;
import moment from 'moment';
import CRYPTO from 'crypto';

/**
 * 常量
 */
const QUERY_METHODS = ['GET', 'DELETE'];
const BODY_METHODS = ['POST', 'PUT'];

/**
 * 判断变量是否已定义
 * @param { object } v
 */
const isDef = (v: any): boolean => {
  return v !== undefined && v !== null;
};

/**
 * 判断变量是否未定义
 * @param { object } v
 */
const isUndef = (v: any): boolean => {
  return v === undefined || v === null;
};

/**
 * 获取报错位置
 * @param { Error } e
 */
const emailErrorLocation = (e: Error): void => {
  console.log(e.stack);
};

/**
 * 格式化成数据库接受的格式
 * @param { number } timeStamp
 */
const timeFormat = (timeStamp?: number | string): string => {
  if (timeStamp) {
    return moment(timeStamp).format('YYYY-MM-DD HH:mm:ss');
  }
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

/**
 * @param { Array<Object> } objArr
 */
const mixin = (attrs: Array<Object>): any => {
  if (isUndef(attrs)) {
    throw new ReferenceError('参数错误: [ attrs: Array, flag?: Boolean ]');
  }
  // 检查传参类型
  for (let i = attrs.length - 1; i > 0; i--) {
    if (
      typeof attrs[i] !== 'object' ||
      attrs[i].toString() !== '[object Object]'
    ) {
      throw new TypeError('参数类型错误: [ attrs: Array<Object> ]');
    }
    Object.keys(attrs[i]).forEach((v: string): void => {
      if (isDef(attrs[i][v])) {
        attrs[i - 1][v] = attrs[i][v];
      }
    });
  }
  return attrs[0];
};

/**
 * 加密函数
 * @param { string } v 加密字段
 */
const crypto = (v: string | null) => {
  if (v === null) {
    return v;
  }

  const { onceCryptLength, cryptCount, digest } = crytpoConfig;
  const md5 = CRYPTO.createHash('md5');
  const vLength = v.length;
  // 每次分段加密的字符串最大长度
  if (isDef(onceCryptLength) && onceCryptLength > 0) {
    while (v) {
      const tempV = v.slice(0, onceCryptLength);
      v = v.slice(onceCryptLength);
      md5.update(`${tempV} - `);
    }
    return md5.digest(digest);
  }
  // 一次加密至多分段几次加密
  if (isDef(cryptCount) && cryptCount > 0) {
    if (vLength <= cryptCount) {
      return md5.update(v).digest(digest);
    } else {
      const onceCryptLength = ~~(vLength / cryptCount);
      while (v) {
        const tempV = v.slice(0, onceCryptLength);
        v = v.slice(onceCryptLength);
        md5.update(`${tempV} - `);
      }
      return md5.digest(digest);
    }
  }
  throw new ReferenceError(
    'geekblog.config.js缺少字段serverConfig: [ onceCryptLength: Number > 0, cryptCount: Number > 0 ]'
  );
};

/**
 * Restful API类声明
 */
interface Restful {
  code: number;
  message: string;
  data?: any;
}
class Restful {
  code: number;
  message: string;
  data?: any;
  constructor(code: number, message: string, data: any = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
  static initWithError(e: any) {
    return new Restful(e.errno, e.message);
  }
}

export {
  QUERY_METHODS,
  BODY_METHODS,
  isDef,
  isUndef,
  emailErrorLocation,
  timeFormat,
  mixin,
  crypto,
  Restful
};
export default {
  QUERY_METHODS,
  BODY_METHODS,
  isDef,
  isUndef,
  emailErrorLocation,
  timeFormat,
  mixin,
  crypto,
  Restful
};

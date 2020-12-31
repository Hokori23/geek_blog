import { blogConfig } from '@config';

const dev = process.env.NODE_ENV === 'development';
/**
 * 预请求快速结束中间件函数
 * @param req
 * @param res
 * @param next
 */
const SkipOptions = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': dev ? '*' : blogConfig.publicPath,
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Expose-Headers': 'Authorization'
  });
  if (req.method === 'OPTIONS') {
    // 预请求快速结束
    return res.status(200).end();
  }
  next();
};

export default SkipOptions;

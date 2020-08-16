module.exports = {
  /**
   *
   * 前端配置
   *
   */
  clientConfig: {
    /** 部署时的公共路径 */
    publicPath: 'https://hokori.online',

  },

  /**
   *
   * 后端配置
   *
   */
  serverConfig: {
    port: '8080',
    crytpo: {
      // 每次分段加密的字符串最大长度（优先度高于cryptCount字段）
      onceCryptLength: 5,
      // 一次加密至多分段几次加密
      cryptCount: 5,
      // 返回值格式
      // 如果提供了 encoding，则返回字符串，否则返回 Buffer
      // 可选值：['hex', 'Base64', ...]
      digest: 'hex'
    },
    // 主机
    host: 'https://api.hokori.online',
    // 完整URL为： nginx配置下的转发路径 `${location}`
    baseURL: '/geekblog'
  },
  /** 数据库配置 */
  dataBaseConfig: {
    // 主机，如IP 或 'localhost'
    host: '101.201.239.229',

    // 数据库名
    database: 'geek_blog',

    // 数据库账号
    user: 'geek_blog',

    // 密码
    password: 'kMS43Mk243KLWrmi',

    // 端口
    // MySQL默认端口3306
    port: '3306',

    // 字符集
    charset: 'utf8mb4'
  }
}

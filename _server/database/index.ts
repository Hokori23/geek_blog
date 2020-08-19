const { dataBaseConfig } = require('../../geekblog.config');
const MYSQL2 = require('mysql2');

const DB = async () => {
  try {
    const connection = await MYSQL2.createConnection(dataBaseConfig);
    await connection.connect((err: Error) => {
      if (err) {
        Promise.reject(err);
      }
    });
    return connection;
  } catch (e) {
    console.log('连接数据库失败');
    Promise.reject(e);
  }
};
export default DB;

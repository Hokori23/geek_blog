const { dataBaseConfig } = require('../../geekblog.config');
import { Sequelize } from 'sequelize';

const { database, user, password, options } = dataBaseConfig;
const DB = new Sequelize(database, user, password, {
  ...options,
  logging: process.env.NODE_ENV === 'development' ? console.log : false // 是否输出数据库日志
});

(async () => {
  try {
    // await DB.authenticate();
    // console.log('Connection has been established successfully.');
    await DB.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    throw new Error(`Unable to connect to the database: ${error}`);
  }
})();

export default DB;

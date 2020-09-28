const { dataBaseConfig } = require('../../geekblog.config');
import { Sequelize } from 'sequelize';

const { database, user, password, options} = dataBaseConfig;

const DB = new Sequelize(database, user, password, options);

(async () => {
  try {
    await DB.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    throw new Error(`Unable to connect to the database: ${error}`);
  }
})();

export default DB;

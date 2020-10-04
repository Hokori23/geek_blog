import { Op } from 'sequelize';

import { MailAccepter } from '@vo';

/**
 * 订阅
 * @param { MailAccepter } mailAccepter
 */
const Create = async (mailAccepter: MailAccepter): Promise<MailAccepter> => {
  return mailAccepter.save();
};

/**
 * 通过name或address查询订阅者
 * @param { string } name
 * @param { string } address
 */
const Retrieve__ByNameOrAddress = async (
  name: string,
  address: string
): Promise<any | null> => {
  return MailAccepter.findOne({
    where: {
      [Op.or]: {
        name,
        address
      }
    }
  });
};

/**
 * 通过name和address查询订阅者
 * @param { string } name
 * @param { string } address
 */
const Retrieve__ByNameAndAddress = async (
  name: string,
  address: string
): Promise<MailAccepter | null> => {
  return MailAccepter.findOne({
    where: {
      name,
      address
    }
  });
};

/**
 * 通过ID查询
 * @param { number } id
 */
const Retrieve__ByID = async (id: number): Promise<MailAccepter | null> => {
  return MailAccepter.findOne({
    where: {
      id
    }
  });
};

/**
 * 遍历订阅者
 */
const Retrieve__All = (): Promise<Array<MailAccepter>> => {
  return MailAccepter.findAll();
};

/**
 * 遍历已激活的订阅者
 */
const Retrieve__All__IsActived = (): Promise<Array<MailAccepter>> => {
  return MailAccepter.findAll({
    where: {
      isActived: true
    }
  });
};

/**
 * 编辑
 */
const Update = async (
  oldMailAccepter: MailAccepter,
  newMailAccepter: MailAccepter
): Promise<MailAccepter> => {
  return Object.assign(oldMailAccepter, newMailAccepter).save();
};

/**
 * 取消订阅
 * @param { number } id
 */
const Delete = async (id: number): Promise<number> => {
  return MailAccepter.destroy({
    where: {
      id
    }
  });
};

export default {
  Create,
  Retrieve__ByNameOrAddress,
  Retrieve__ByNameAndAddress,
  Retrieve__ByID,
  Retrieve__All,
  Retrieve__All__IsActived,
  Update,
  Delete
};

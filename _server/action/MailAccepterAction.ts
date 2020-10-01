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
): Promise<MailAccepter | null> => {
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
  Delete
};

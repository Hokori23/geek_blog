import { Setting } from '@vo';

/**
 * 初始化设置
 */
const Init = async (setting: Setting): Promise<Setting | boolean> => {
  const { name, setting_json } = setting;
  const existedInitSetting = await Setting.findOne({
    where: {
      name
    }
  });
  if (existedInitSetting) {
    return false;
  }
  return Setting.create({
    name,
    setting_json
  });
};

/**
 * 遍历设置
 */
const Retrieve__All = async (): Promise<Array<Setting>> => {
  return Setting.findAll({
    order: [['id', 'ASC']]
  });
};

/**
 * 通过设置名查找设置
 * @param { string } name
 */
const Retrieve__ByName = async (name: string): Promise<Setting | null> => {
  return Setting.findOne({
    where: {
      name
    }
  });
};

/**
 * 更新设置
 */
const Update = async (
  oldSetting: Setting,
  newSetting: Setting
): Promise<Setting | boolean> => {
  const { name } = oldSetting;
  const existedInitSetting = await Setting.findOne({
    where: {
      name
    }
  });
  if (!existedInitSetting) {
    return false;
  }
  return Object.assign(oldSetting, newSetting).save();
};

/**
 * 删除设置
 */
const Delete = async (name: string): Promise<number> => {
  return Setting.destroy({
    where: {
      name
    }
  });
};

export default {
  Init,
  Retrieve__All,
  Retrieve__ByName,
  Update,
  Delete
};

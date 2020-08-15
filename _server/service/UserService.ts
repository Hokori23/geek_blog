import { UserAction as Action } from '@action';
import { User } from '@vo';
import { Restful } from '@public';

/**
 * 注册
 * @param { User } user
 */
const Register = async (user: User) => {
  let restful: Restful;
  try {
    const res: Array<any> = await Action.Create(user);
    if (res.length) {
      restful = new Restful(1, '账号已存在');
    } else {
      restful = new Restful(0, 'OK');
    }
  } catch (e) {
    restful = Restful.initWithError(e);
  }
  return restful;
};

const Login = async (account: string, password: string) => {
  let restful: Restful;
  try {
    const res: Array<any> = await Action.Retrieve(account);
    if (!res.length) {
      restful = new Restful(1, '账号不存在');
    } else {
      
    }
  } catch (e) {
    restful = Restful.initWithError(e);
  }
};

export { Register };

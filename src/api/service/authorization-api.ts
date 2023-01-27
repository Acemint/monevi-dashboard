import moneviAxios from '../configuration/monevi-axios';
import { MoneviPath } from '../path/path';

export interface AuthorizationApi {
  login(username: string, password: string): any;
  forgetPassword(email: string): any;
}

export class AuthorizationApiImpl implements AuthorizationApi {
  async login(username: string, password: string): Promise<any> {
    var body = {} as { username: string; password: string };
    body.username = username;
    body.password = password;

    return await moneviAxios.post(MoneviPath.LOGIN_PATH, body);
  }

  async forgetPassword(email: string): Promise<any> {
    var params = {} as { email: string };
    params.email = email;

    return await moneviAxios.get(MoneviPath.REQUEST_RESET_PASSWORD_PATH, {
      params: params,
      paramsSerializer: {
        indexes: null,
      },
    });
  }
}

let authorizationApi = new AuthorizationApiImpl();
export { authorizationApi };

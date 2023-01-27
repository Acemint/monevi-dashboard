import moneviAxios from '../configuration/monevi-axios';
import { MoneviPath } from '../path/path';

export interface AuthorizationApi {
  forgetPassword(email: string): any;
}

export class AuthorizationApiImpl implements AuthorizationApi {
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

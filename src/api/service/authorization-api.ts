import moneviAxios from '../configuration/monevi-axios';
import type { MoneviBodyRegisterStudent } from '../model/monevi-config';
import { MoneviPath } from '../path/path';

export interface AuthorizationApi {
  login(username: string, password: string): any;
  register(
    nim: string,
    fullName: string,
    email: string,
    password: string,
    periodMonth: number,
    periodYear: number,
    organizationName: string,
    regionName: string,
    role: string
  ): any;
  forgetPassword(email: string): any;
  resetPassword(token: string, newPassword: string, confirmationPassword: string): any;
}

export class AuthorizationApiImpl implements AuthorizationApi {
  async login(username: string, password: string): Promise<any> {
    var body = {} as { username: string; password: string };
    body.username = username;
    body.password = password;

    return await moneviAxios.post(MoneviPath.LOGIN_PATH, body);
  }

  async register(
    nim: string,
    fullName: string,
    email: string,
    password: string,
    periodMonth: number,
    periodYear: number,
    organizationName: string,
    regionName: string,
    role: string
  ): Promise<any> {
    var body = {} as MoneviBodyRegisterStudent;
    body.nim = nim;
    body.fullName = fullName;
    body.email = email;
    body.password = password;
    body.periodMonth = periodMonth;
    body.periodYear = periodYear;
    body.organizationName = organizationName;
    body.regionName = regionName;
    body.role = role;

    return await moneviAxios.post(MoneviPath.REGISTER_STUDENT_PATH, body);
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

  async resetPassword(token: string, newPassword: string, confirmationPassword: string): Promise<any> {
    var params = {} as { token: string };
    var body = {} as { newPassword: string; confirmationPassword: string };
    params.token = token;
    body.newPassword = newPassword;
    body.confirmationPassword = confirmationPassword;

    return await moneviAxios.post(MoneviPath.RESET_PASSWORD_PATH, body, {
      params,
      paramsSerializer: {
        indexes: null,
      },
    });
  }
}

let authorizationApi = new AuthorizationApiImpl();
export { authorizationApi };

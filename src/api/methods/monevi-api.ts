import MoneviAxios from '@/api/configuration/monevi-axios';
import type { Region, Organization, BaseErrorResponse } from '@/api/model/monevi-model';
import { MoneviCookieHandler } from './monevi-cookie-handler';

class MoneviAPI {
  async logout(): Promise<void> {
    MoneviCookieHandler.deleteCookie('id');
    MoneviCookieHandler.deleteCookie('fullname');
    MoneviCookieHandler.deleteCookie('username');
    MoneviCookieHandler.deleteCookie('email');
    MoneviCookieHandler.deleteCookie('role');
    MoneviCookieHandler.deleteCookie('jwt');
    MoneviCookieHandler.deleteCookie('type');
    MoneviCookieHandler.deleteCookie('organizationRegionId');
    MoneviCookieHandler.deleteCookie('regionId');
  }
}

export { MoneviAPI };

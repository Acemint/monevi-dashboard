import { FrontendRouteName } from '@/constants/path';
import { router } from '@/route';
import axios from 'axios';
import { MoneviCookieHandler } from '../methods/monevi-cookie-handler';
import { MONEVI_BASE_URL } from '../path/path';
import { authorizationApi } from '../service/authorization-api';

const moneviAxiosLogin = axios.create({
  baseURL: MONEVI_BASE_URL,
});

const moneviAxios = axios.create({
  baseURL: MONEVI_BASE_URL,
});

const moneviAxiosFile = axios.create({
  baseURL: MONEVI_BASE_URL,
});

moneviAxios.interceptors.request.use(async (config) => {
  var token = MoneviCookieHandler.getUserData();
  if (token.accessToken != '' && token.accessToken != undefined) {
    config.headers = {
      Authorization: `${token.type} ${token.accessToken}`,
    };
  }
  return config;
});

moneviAxios.interceptors.response.use(undefined, (error) => {
  if (error.response.status == 401) {
    alert('Session has expired, please re-login');
    authorizationApi.logout();
    router.push({ name: FrontendRouteName.LOGIN });
  } else {
    return Promise.reject(error);
  }
});

export { moneviAxios, moneviAxiosFile, moneviAxiosLogin };

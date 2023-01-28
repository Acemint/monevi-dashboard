import { FrontendRouteName } from '@/constants/path';
import { router } from '@/route';
import axios from 'axios';
import { MoneviCookieHandler } from '../methods/monevi-cookie-handler';
import { MONEVI_BASE_URL } from '../path/path';
import { authorizationApi } from '../service/authorization-api';

const moneviAxios = axios.create({
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

moneviAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      alert('Session has expired, please re-login');
      authorizationApi.logout();
      router.push({ name: FrontendRouteName.LOGIN });
    }
  }
);

moneviAxios.interceptors.request.use((request) => {
  // console.log('Starting Request', JSON.stringify(request, null, 2))
  console.log('REQ', JSON.stringify(request, null, 2));
  console.log('Starting Request Params', JSON.stringify(request.params, null, 2));
  console.log('Starting Request Body', JSON.stringify(request.data, null, 2));
  return request;
});

moneviAxios.interceptors.response.use((response) => {
  console.log('Response:', JSON.stringify(response.data, null, 2));
  return response;
});

export { moneviAxios };

import { FrontendRouteName } from '@/constants/path';
import { router } from '@/route';
import axios from 'axios';
import { MONEVI_BASE_URL } from '../path/path';
import { authorizationApi } from '../service/authorization-api';

const moneviAxios = axios.create({
  baseURL: MONEVI_BASE_URL,
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
export { moneviAxios };

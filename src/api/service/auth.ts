import { MoneviCookieHandler } from '../methods/monevi-cookie-handler';
import { MONEVI_BASE_URL } from '../path/path';

export function getAuthorizationCredentialForAxios() {
  var userData = MoneviCookieHandler.getUserData();
  if (userData.id) {
    console.log('USER DATA EXIST');
    return {
      Authorization: 'Bearer ' + userData.accessToken,
    };
  } else {
    console.log('USER DATA DOESNT EXIST');
    return {};
  }
}

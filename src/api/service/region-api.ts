import moneviAxios from '../configuration/monevi-axios';
import { getAuthorizationCredentialForAxios } from '../configuration/monevi-axios-helper';
import { MoneviPath } from '../path/path';

export interface RegionApi {
  getRegions(): any;
}

export class RegionApiImpl implements RegionApi {
  async getRegions(): Promise<any> {
    return await moneviAxios.get(MoneviPath.GET_REGIONS_PATH, { headers: getAuthorizationCredentialForAxios() });
  }
}

let regionApi = new RegionApiImpl();
export { regionApi };

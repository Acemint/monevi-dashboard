import moneviAxios from '../configuration/monevi-axios';
import { MoneviPath } from '../path/path';

export interface RegionApi {
  getRegions(): any;
}

export class RegionApiImpl implements RegionApi {
  async getRegions(): Promise<any> {
    return await moneviAxios.get(MoneviPath.GET_REGIONS_PATH);
  }
}

let regionApi = new RegionApiImpl();
export { regionApi };

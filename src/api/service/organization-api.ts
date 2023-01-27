import moneviAxios from '../configuration/monevi-axios';
import { MoneviPath } from '../path/path';

export interface OrganizationApi {
  getOrganizations(regionName: string): any;
}

export class OrganizationApiImpl implements OrganizationApi {
  async getOrganizations(regionName: string): Promise<any> {
    var params = {} as { regionName: string };
    params.regionName = regionName;

    return await moneviAxios.get(MoneviPath.GET_ORGANIZATIONS_PATH, { params: params });
  }
}

let organizationApi = new OrganizationApiImpl();
export { organizationApi };

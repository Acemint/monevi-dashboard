import moneviAxios from '../configuration/monevi-axios';
import { MoneviPath } from '../path/path';

export interface OrganizationApi {
  getOrganizations(regionName: string | null, searchTerm: string | null): any;
}

export class OrganizationApiImpl implements OrganizationApi {
  async getOrganizations(regionName: string | null = null, searchTerm: string | null = null): Promise<any> {
    var params = {} as { regionName: string; searchTerm: string };
    if (regionName != null && regionName != '') {
      params.regionName = regionName;
    }
    if (searchTerm != null) {
      params.searchTerm = searchTerm;
    }
    return await moneviAxios.get(MoneviPath.GET_ORGANIZATIONS_PATH, {
      params: params,
    });
  }
}

let organizationApi = new OrganizationApiImpl();
export { organizationApi };

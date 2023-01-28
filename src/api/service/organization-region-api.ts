import { moneviAxios } from '../configuration/monevi-axios';
import type { MoneviParamsGetOrganizationRegion } from '@/api/model/monevi-config';
import { MoneviPath } from '../path/path';

export interface OrganizationRegionApi {
  getOrganization(organizationRegionId: string): any;
}

export class OrganizationRegionApiImpl implements OrganizationRegionApi {
  async getOrganization(organizationRegionId: string): Promise<any> {
    var params = {} as MoneviParamsGetOrganizationRegion;
    params.id = organizationRegionId;

    return await moneviAxios
      .get(MoneviPath.GET_ORGANIZATION_REGION_PATH, { params })
      .then((response) => {
        return response.data.value;
      })
      .catch((error) => {
        return null;
      });
  }
}

let organizationRegionApi = new OrganizationRegionApiImpl();
export { organizationRegionApi };

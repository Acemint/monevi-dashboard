import MoneviAxios from '@/api/configuration/monevi-axios';
import { GET_ORGANIZATIONS_PATH, GET_REGIONS_PATH } from "@/api/path/path";
import type { Region, Organization } from '@/api/model/monevi-model';

class MoneviAPI {

    async getRegions(): Promise<Array<Region>> {
        return MoneviAxios
            .get(GET_REGIONS_PATH)
            .then(response => {
                return response.data.values;
            })
            .catch(errorResponse => {
                console.log(errorResponse);
            });
    };

    async getOrganizations(regionName: string): Promise<Array<Organization>> {
        return MoneviAxios
            .get(GET_ORGANIZATIONS_PATH, {
                params: {
                    regionName: regionName,
                    page: 0,
                    size: 1000,
                    sortBy: "name",
                    isAscending: "true"
                },
                paramsSerializer: {
                    indexes: null
                }
            })
            .then(response => {
                return response.data.values;
            })
            .catch(errorResponse => {
                console.log(errorResponse);
            });
    };
}

export {
    MoneviAPI
};
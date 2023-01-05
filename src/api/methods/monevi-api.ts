import MoneviAxios from '@/api/configuration/monevi-axios';
import { GET_ORGANIZATIONS_PATH, GET_REGIONS_PATH, REGISTER_STUDENT_PATH } from "@/api/path/path";
import type { Region, Organization, UserAccount } from '@/api/model/monevi-model';

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

    async registerStudent(nim: string, fullName: string, email: string, password: string, periodMonth: number, periodYear: number, regionName: string, organizationName: string, role: string): Promise<UserAccount> {
        console.log(nim, fullName, email, password, periodMonth, periodYear, regionName, organizationName, role);
        return MoneviAxios
            .post(REGISTER_STUDENT_PATH, {
                nim: nim,
                fullName: fullName,
                email: email,
                password: password,
                periodMonth: periodMonth,
                periodYear: periodYear,
                organizationName: organizationName,
                regionName: regionName,
                role: role.toUpperCase()
            })
            .then(response => {
                console.log(response);
                return response.data.values;
            })
            .catch(errorResponse => {
                console.log(errorResponse);
            });
    }
}

export {
    MoneviAPI
};
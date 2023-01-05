import MoneviAxios from '@/api/configuration/monevi-axios';
import { GET_ORGANIZATIONS_PATH, GET_REGIONS_PATH, LOGIN_PATH, REGISTER_STUDENT_PATH } from "@/api/path/path";
import type { Region, Organization, UserAccount, BaseErrorResponse } from '@/api/model/monevi-model';
import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';

class MoneviAPI {

    async getRegions(): Promise<Array<Region>> {
        return MoneviAxios
            .get(GET_REGIONS_PATH)
            .then(response => {
                return response.data.values;
            })
            .catch(error => {
                const baseError: BaseErrorResponse = error.response.data;
                console.log(baseError);
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
            .catch(error => {
                const baseError: BaseErrorResponse = error.response.data;
                console.log(baseError);
            });
    };

    async registerStudent(nim: string, fullName: string, email: string, password: string, periodMonth: number, periodYear: number, regionName: string, organizationName: string, role: string): Promise<UserAccount> {
        return MoneviAxios
            .post(REGISTER_STUDENT_PATH, {
                nim: nim,
                fullName: fullName,
                email: email,
                password: password,
                periodMonth: periodMonth,
                periodYear: periodYear,
                organizationName: organizationName,
                regionName: MoneviEnumConverter.convertUserAccountRole(regionName),
                role: role.toUpperCase()
            })
            .then(response => {
                return response.data.values;
            })
            .catch(error => {
                const baseError: BaseErrorResponse = error.response.data;
                console.log(baseError);
            });
    }
}

export {
    MoneviAPI
};
import MoneviAxios from '@/api/configuration/monevi-axios';
import { CREATE_NEW_PROGRAM_PATH, GET_ORGANIZATIONS_PATH, GET_REGIONS_PATH, LOGIN_PATH, REGISTER_STUDENT_PATH, GET_PROGRAMS_PATH } from "@/api/path/path";
import type { Region, Organization, UserAccount, BaseErrorResponse, MoneviToken, Program } from '@/api/model/monevi-model';
import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';
import { MoneviCookieHandler } from './monevi-cookie-handler';
import { MoneviDateFormatter } from './monevi-date-formatter';
import { MoneviMoneyFormatter } from './monevi-money-formatter';

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
                regionName: regionName,
                role:  MoneviEnumConverter.convertUserAccountRole(role.toUpperCase())
            })
            .then(response => {
                return response.data.value;
            })
            .catch(error => {
                const baseError: BaseErrorResponse = error.response.data;
                console.log(baseError);
            });
    };

    async login(username: string, password: string): Promise<MoneviToken> {
        // Cache, if already logged in just return from cookie
        const token = MoneviCookieHandler.getCachedLogin();
        if (token != undefined) return token;
        return MoneviAxios
            .post(LOGIN_PATH, {
                username: username,
                password: password,
            })
            .then(response => {
                const user: MoneviToken = response.data.value;
                console.log(user);
                MoneviCookieHandler.setCookie("id", user.id);
                MoneviCookieHandler.setCookie("fullname", user.fullname);
                MoneviCookieHandler.setCookie("username", user.username);
                MoneviCookieHandler.setCookie("email", user.email);
                MoneviCookieHandler.setCookie("role", user.role);
                MoneviCookieHandler.setCookie("jwt", user.accessToken);
                MoneviCookieHandler.setCookie("type", user.accessToken);
                MoneviCookieHandler.setCookie("organizationRegionId", user.organizationRegionId);
                MoneviCookieHandler.setCookie("regionId", user.regionId);
                return response.data.value;
            })
            .catch(error => {
                const baseError: BaseErrorResponse = error.response.data;
                console.log(baseError);
            })
    }

    async logout(): Promise<void> {
        MoneviCookieHandler.deleteCookie("id");
        MoneviCookieHandler.deleteCookie("fullname");
        MoneviCookieHandler.deleteCookie("username");
        MoneviCookieHandler.deleteCookie("email");
        MoneviCookieHandler.deleteCookie("role");
        MoneviCookieHandler.deleteCookie("jwt");
        MoneviCookieHandler.deleteCookie("type");
        MoneviCookieHandler.deleteCookie("organizationRegionId");
        MoneviCookieHandler.deleteCookie("regionId");
    }

    async getPrograms(organizationRegionId: string): Promise<Array<Program>> {
        return MoneviAxios
            .get(GET_PROGRAMS_PATH, {
                params: {
                    organizationRegionId: organizationRegionId,
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
                for (let value of response.data.values ) {
                    value.budget = MoneviMoneyFormatter.toRupiah(value.budget);
                    value.subsidy = MoneviMoneyFormatter.toRupiah(value.subsidy);
                    value.startDate = MoneviDateFormatter.epochToDate(value.startDate);
                    value.endDate = MoneviDateFormatter.epochToDate(value.endDate);
                }
                return response.data.values;
            })
            .catch(error => {
                const baseError: BaseErrorResponse = error.response.data;
                console.log(baseError);
            });
    }

    async createNewProgram(organizationRegionId: string, programName: string, budget: number, subsidy: number, startDate: string, endDate: string): Promise<Program> {
        return MoneviAxios.
            post(CREATE_NEW_PROGRAM_PATH, {
                organizationRegionId: organizationRegionId,
                programName: programName,
                budget: budget,
                subsidy: subsidy,
                startDate: startDate,
                endDate: endDate
            })
            .then(response => {
                return response.data.value;
            });
    }

}

export {
    MoneviAPI
};
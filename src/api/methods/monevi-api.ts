import MoneviAxios from "@/api/configuration/monevi-axios"
import {
    GET_ORGANIZATIONS_PATH,
    GET_REGIONS_PATH,
} from "@/api/path/path"
import type {
    Region,
    Organization,
    BaseErrorResponse
} from "@/api/model/monevi-model"
import { MoneviCookieHandler } from "./monevi-cookie-handler"

class MoneviAPI {
    async getRegions(): Promise<Array<Region>> {
        return MoneviAxios.get(GET_REGIONS_PATH)
            .then((response) => {
                return response.data.values
            })
            .catch((error) => {
                const baseError: BaseErrorResponse = error.response.data
                console.log(baseError)
            })
    }

    async getOrganizations(regionName: string): Promise<Array<Organization>> {
        return MoneviAxios.get(GET_ORGANIZATIONS_PATH, {
            params: {
                regionName: regionName,
                page: 0,
                size: 1000,
                sortBy: "name",
                isAscending: "true",
            },
            paramsSerializer: {
                indexes: null,
            },
        })
            .then((response) => {
                return response.data.values
            })
            .catch((error) => {
                const baseError: BaseErrorResponse = error.response.data
                console.log(baseError)
            })
    }

    async logout(): Promise<void> {
        MoneviCookieHandler.deleteCookie("id")
        MoneviCookieHandler.deleteCookie("fullname")
        MoneviCookieHandler.deleteCookie("username")
        MoneviCookieHandler.deleteCookie("email")
        MoneviCookieHandler.deleteCookie("role")
        MoneviCookieHandler.deleteCookie("jwt")
        MoneviCookieHandler.deleteCookie("type")
        MoneviCookieHandler.deleteCookie("organizationRegionId")
        MoneviCookieHandler.deleteCookie("regionId")
    }

}

export { MoneviAPI }

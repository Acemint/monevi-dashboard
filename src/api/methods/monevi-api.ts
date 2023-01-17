import MoneviAxios from "@/api/configuration/monevi-axios"
import {
    GET_ORGANIZATIONS_PATH,
    GET_REGIONS_PATH,
    GET_PROGRAMS_PATH,
} from "@/api/path/path"
import type {
    Region,
    Organization,
    BaseErrorResponse,
    Program,
} from "@/api/model/monevi-model"
import { MoneviCookieHandler } from "./monevi-cookie-handler"
import { MoneviDateFormatter } from "./monevi-date-formatter"
import { MoneviDisplayFormatter } from "./monevi-display-formatter"

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

    async getPrograms(organizationRegionId: string): Promise<Array<Program>> {
        return MoneviAxios.get(GET_PROGRAMS_PATH, {
            params: {
                organizationRegionId: organizationRegionId,
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
                for (let value of response.data.values) {
                    value.budget = MoneviDisplayFormatter.toRupiah(value.budget)
                    value.subsidy = MoneviDisplayFormatter.toRupiah(
                        value.subsidy
                    )
                    value.startDate = MoneviDateFormatter.formatDate(
                        value.startDate
                    )
                    value.endDate = MoneviDateFormatter.formatDate(
                        value.endDate
                    )
                }
                return response.data.values
            })
            .catch((error) => {
                const baseError: BaseErrorResponse = error.response.data
                console.log(baseError)
            })
    }
}

export { MoneviAPI }

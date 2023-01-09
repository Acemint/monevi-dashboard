export type Region = {
    id: string,
    name: string 
}

export type Organization = {
    id: string,
    name: string,
    abbreviation: string,
    regionNames: Array<string>
}

export type UserAccount = {
    id: string,
    nim: string,
    fullName: string,
    email: string,
    role: string,
    periodMonth: number,
    periodYear: number,
    lockedAccount: boolean
}

class MoneviToken {

    id: string;
    fullname: string;
    username: string;
    email: string;
    role: string;
    accessToken: string;
    type: string;
    organizationRegionId: string;
    regionId: string;

    constructor(id: string, fullname: string, username: string, email: string, role: string, accessToken: string, type: string, organizationRegionId: string, regionId: string) {
        this.id = id;
        this.fullname = fullname;
        this.username = username;
        this.email = email;
        this.role = role;
        this.accessToken = accessToken; 
        this.type = type;
        this.organizationRegionId = organizationRegionId;
        this.regionId = regionId;
    }
}

export { MoneviToken };

export type Program = {
    id: string,
    name: string,
    budget: number,
    subsidy: number,
    startDate: number,
    endDate: number
}

export type BaseErrorResponse = {
    
    errorCode: string,
    errorMessage: string,
    errorFields: Map<string, string | undefined>

}
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

export type BaseErrorResponse = {
    
    errorCode: string,
    errorMessage: string,
    errorFields: Map<string, string | undefined>

}
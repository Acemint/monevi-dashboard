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

export type UserAccountDetails = {
    id: string,
    nim: string,
    fullname: string,
    email: string,
    orgName: string,
    orgAbbreviation: string,
    regionName: string,
    role: string,
    periodMonth: number,
    periodYear: number,
    lockedAccount: boolean
}

export type OrganizationWithProgram = {

    organizationAbbreviation: string,
    organizationName: string,
    organizationRegionId: string,
    periodYear: number

}

export type OrganizationWithReport = {

    reportId: string
    organizationAbbreviation: string,
    organizationName: string,
    organizationRegionId: string,
    periodDate: number
    reportStatus: string

}

export type Program = {
    id: string,
    name: string,
    budget: number,
    subsidy: number,
    startDate: number,
    endDate: number
}

class Transaction {

    id: string;
    name: string;
    transactionDate: number;
    amount: number;
    entryPosition: string;
    type: string;
    generalLedgerAccountType: string;
    description: string;
    proof: string;

    constructor(id: string = "", name: string = "", transactionDate: number = 0, amount: number = 0, entryPosition: string = "", type: string = "", generalLedgerAccountType: string = "", description: string = "", proof: string = "") {
        this.id = id;
        this.name = name;
        this.transactionDate = transactionDate;
        this.amount = amount;
        this.entryPosition = entryPosition;
        this.type = type;
        this.generalLedgerAccountType = generalLedgerAccountType;
        this.description = description;
        this.proof = proof;
    }

}

export { Transaction };

export type BaseErrorResponse = {
    
    errorCode: string,
    errorMessage: string,
    errorFields: Map<string, string | undefined>

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

class MoneviReportSummary {

    reportId: string;
    reportStatus: string;
    cash: GeneralLedgerData;
    bank: GeneralLedgerData;

    constructor() {
        this.reportId = "";
        this.reportStatus = "";
        this.cash = new GeneralLedgerData();
        this.bank = new GeneralLedgerData();
    }

    values(): Array<GeneralLedgerDataIdentifier> {
        return new Array<GeneralLedgerDataIdentifier>(
            {
                identifier: "Kas",
                data: this.cash
            },
            {
                identifier: "Bank",
                data: this.bank
            }
        )
    }
}

export class MoneviOrganizationRegion {

    id: string;
    regionName: string;
    organizationName: string;

    constructor() {
        this.id = "";
        this.regionName = "";
        this.organizationName = "";
    }

}

type GeneralLedgerDataIdentifier = { identifier: string, data: GeneralLedgerData }

class GeneralLedgerData {

    previousMonthAmount: number
    opnameAmount: number
    income: EntryPositionData
    expense: EntryPositionData

    constructor() {
        this.previousMonthAmount = 0;
        this.opnameAmount = 0;
        this.income = new EntryPositionData();
        this.expense = new EntryPositionData();
    }
    
    values(): Array<EntryPositionDataIdentifier> {
        return new Array<EntryPositionDataIdentifier>(
            {
                identifier: "Pemasukan",
                data: this.income
            },
            {
                identifier: "Pengeluaran",
                data: this.expense
            }
        )
    }
}

type EntryPositionDataIdentifier = { identifier: string, data: EntryPositionData }

class EntryPositionData {

    daily: CategoryData;
    nonDaily: CategoryData;

    constructor() {
        this.daily = new CategoryData();
        this.nonDaily = new CategoryData();
    }

    getByName(name: string): CategoryData {
        if (name === 'Rutin') {
            return this.daily;
        } else {
            return this.nonDaily;
        }
    }

    values(): Array<CategoryDataIdentifier> {
        return new Array<CategoryDataIdentifier>(
            {
                index: 1,
                identifier: "Rutin",
                data: this.daily
            },
            {
                index: 2,
                identifier: "Non Rutin",
                data: this.nonDaily
            }
        )
    }
}

type CategoryDataIdentifier = { index: number, identifier: string, data: CategoryData };

class CategoryData {

    amount: number;

    constructor() {
        this.amount = 0;
    }

}

class MoneviReport {

    id: string;
    periodDate: number;
    status: string;
    commentedBy: string;
    comment: string;
    generalLedgerAccountValues: Array<any>;

    constructor(id: string = "", periodDate: number = 0, status: string = "", commentedBy: string = "", comment: string = ""){
        this.id = id;
        this.periodDate = periodDate; 
        this.status = status;
        this.commentedBy = commentedBy;
        this.comment = comment;
        this.generalLedgerAccountValues = new Array<Object>();
    }

}

export { MoneviToken, MoneviReportSummary, MoneviReport };

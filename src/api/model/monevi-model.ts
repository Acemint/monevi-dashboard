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

export type Program = {
    id: string,
    name: string,
    budget: number,
    subsidy: number,
    startDate: number,
    endDate: number
}

export type Transaction = {

    id: string,
    name: string,
    transactionDate: number,
    amount: number,
    entryPosition: string,
    type: string,
    generalLedgerAccountType: string,
    description: string,
    proof: string;

}

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

type TransactionTypeMapIdentifier = {

    identifier: string,
    value: object

}

class TransactionTypeMap {

    DAILY: { amount: 0 }
    NON_DAILY: { amount: 0 }

    
    constructor() {
        this.DAILY = { amount: 0 };
        this.NON_DAILY = { amount: 0 };

    }

    getByName(name: string) {
        if (name == 'RUTIN') {
            return this.DAILY;
        }
        else {
            return this.NON_DAILY;
        }
    }

    values(): Array<TransactionTypeMapIdentifier> {
        return new Array<TransactionTypeMapIdentifier>(
            { 
                identifier: "Rutin", 
                value: this.DAILY
            }, 
            { 
                identifier: "Non Rutin",
                value: this.NON_DAILY
            });
    }

}


type EntryPositionMapIdentifier = {

    identifier: string,
    holder: string
    value: TransactionTypeMap

}

class EntryPositionMap {
    
    DEBIT: TransactionTypeMap
    CREDIT: TransactionTypeMap
    previousMonthAmount: number
    opnameAmount: number
    

    constructor() {
        this.DEBIT = new TransactionTypeMap();
        this.CREDIT = new TransactionTypeMap();
        this.previousMonthAmount = 0;
        this.opnameAmount = 0;
    }

    getByName(name: string) {
        if (name == 'DEBIT') {
            return this.DEBIT;
        }
        else {
            return this.CREDIT;
        }
    }

    values(): Array<EntryPositionMapIdentifier> {
        return new Array<EntryPositionMapIdentifier>(
            { 
                identifier: "Pemasukan", 
                holder: "DEBIT",
                value: this.DEBIT
            }, 
            { 
                identifier: "Pengeluaran",
                holder: "CREDIT",
                value: this.CREDIT
            });
    }

}

type GeneralLedgerAccountMapIdentifier = {

    identifier: String,
    value: EntryPositionMap

}

class GeneralLedgerAccountMap {

    CASH: EntryPositionMap
    BANK: EntryPositionMap
    
    constructor() {
        this.CASH = new EntryPositionMap();
        this.BANK = new EntryPositionMap();
    }

    values(): Array<GeneralLedgerAccountMapIdentifier> {
        return new Array<GeneralLedgerAccountMapIdentifier>(
            { 
                identifier: "Kas", 
                value: this.CASH
            }, 
            { 
                identifier: "Bank",
                value: this.BANK
            });
    }

}

class MoneviReportSummary {

    reportId: string;
    cash: GeneralLedgerData;
    bank: GeneralLedgerData;

    constructor() {
        this.reportId = "";
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


export { MoneviToken, MoneviReportSummary };

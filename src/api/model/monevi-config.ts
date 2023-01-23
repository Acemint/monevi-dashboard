type MoneviParamsGetOrganizations = {

  regionName: string,
  searchTerm: string
  page: number,
  size: number, 
  sortBy: Array<string>, 
  isAscending: Array<string>

}

type MoneviBodyCreateOrganization = {

  name: string,
  abbreviation: string,
  regionNames: Array<string>

}

type MoneviParamsGetOrganizationsWithPrograms = {

  regionId: string,

}

type MoneviParamsGetOrganizationsWithReports = {
  
  regionId: string

}

type MoneviParamsGetOrganizationRegion = {

  id: string

}

type MoneviParamsGetStudents = {

  studentName: string
  organizationName: string
  regionId: string
  periodMonth: number
  periodYear: number
  studentRole: string
  lockedAccount: boolean

}

type MoneviParamsAcceptStudent = {

  studentId: string

}

type MoneviParamsDeclineStudent = {

  studentId: string

}


type MoneviParamsRequestResetPassword = {

  email: string

}

type MoneviBodyResetPassword = {

  newPassword: string,
  confirmationPassword: string  

}

type MoneviParamsResetPassword = {

  token: string,

}

type MoneviBodyRegisterStudent = {

  nim: string,
  fullName: string,
  email: string,
  password: string,
  periodMonth: number,
  periodYear: number,
  organizationName: string,
  regionName: string,
  role: string

}

type MoneviBodyLoginUserAccount = {

  username: string,
  password: string 

}

type MoneviBodyRejectReport = {

  reportId: string,
  userId: string,
  comment: string

}

type MoneviBodyApproveReport = {

  reportId: string,
  userId: string

}


type MoneviBodySubmitReport = {

  organizationRegionId: string,
  date: string,
  opnameData: {
    CASH: number,
    BANK: number
  }

}

type MoneviParamsGetReports = {

  regionId: string,
  organizationRegionId: string,
  startDate: string,
  endDate: string,
  reportStatus: string

}

type MoneviParamsSummarizeReport = {

  organizationRegionId: string,
  date: string

}

type MoneviParamsGetTransactions = {

  organizationRegionId: string | null, 
  regionId: string | null,
  generalLedgerAccountType: string | null,
  entryPosition: string | null,
  transactionType: string | null,
  startDate: string, 
  endDate: string, 
  page: number,
  size: number, 
  sortBy: Array<string>, 
  isAscending: Array<string>

}

type MoneviBodyCreateTransaction = {

  organizationRegionId: string, 
  name: string, 
  transactionDate: string,
  amount: number, 
  entryPosition: string, 
  type: string, 
  generalLedgerAccountType: string, 
  description: string, 
  proof: string | ArrayBuffer | null

}

type MoneviParamsDeleteTransaction = {

  transactionId: string

}

type MoneviParamsEditTransaction = {

  transactionId: string

}

type MoneviBodyEditTransaction = {

  name: string,
  transactionDate: string,
  amount: number,
  entryPosition: string,
  type: string,
  generalLedgerAccountType: string,
  description: string,
  proof: string | ArrayBuffer | null,
  programId: string

}

type MoneviBodyCreateProgram = {

  organizationRegionId: string,
  programName: string,
  budget: number,
  subsidy: number,
  startDate: string,
  endDate: string
  userId: string

}

type MoneviParamsGetPrograms = {

  organizationRegionId: string,
  page: number,
  size: number,
  sortBy: Array<string>,
  isAscending: Array<string>

}

export type {

  MoneviParamsGetOrganizations,
  MoneviBodyCreateOrganization,
  MoneviParamsGetOrganizationsWithPrograms,
  MoneviParamsGetOrganizationsWithReports,
  MoneviParamsGetOrganizationRegion,

  MoneviParamsAcceptStudent,
  MoneviParamsDeclineStudent,
  MoneviParamsGetStudents,

  MoneviParamsRequestResetPassword,
  
  MoneviBodyResetPassword,
  MoneviParamsResetPassword,

  MoneviBodyRegisterStudent,
  MoneviBodyLoginUserAccount,

  MoneviBodyApproveReport,
  MoneviBodyRejectReport,
  MoneviBodySubmitReport,
  MoneviParamsGetReports,
  MoneviParamsSummarizeReport,

  MoneviParamsGetTransactions,
  MoneviBodyCreateTransaction,
  MoneviParamsDeleteTransaction,
  MoneviParamsEditTransaction,
  MoneviBodyEditTransaction,

  MoneviBodyCreateProgram,
  MoneviParamsGetPrograms

}
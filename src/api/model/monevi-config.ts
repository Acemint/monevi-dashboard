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
export type {

  MoneviParamsGetOrganizations,
  MoneviBodyCreateOrganization,

  MoneviParamsAcceptStudent,
  MoneviParamsDeclineStudent,
  MoneviParamsGetStudents,

  MoneviParamsRequestResetPassword,
  
  MoneviBodyResetPassword,
  MoneviParamsResetPassword,

  MoneviBodyRegisterStudent,
  MoneviBodyLoginUserAccount,

}
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

export type {

  MoneviParamsAcceptStudent,
  MoneviParamsDeclineStudent,
  MoneviParamsGetStudents,

  MoneviParamsRequestResetPassword,
  
  MoneviBodyResetPassword,
  MoneviParamsResetPassword,

  MoneviBodyRegisterStudent

}
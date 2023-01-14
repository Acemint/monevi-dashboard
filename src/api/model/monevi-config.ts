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

  MoneviParamsRequestResetPassword,
  
  MoneviBodyResetPassword,
  MoneviParamsResetPassword,

  MoneviBodyRegisterStudent

}
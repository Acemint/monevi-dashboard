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

export type {

  MoneviParamsRequestResetPassword,
  
  MoneviBodyResetPassword,
  MoneviParamsResetPassword

}
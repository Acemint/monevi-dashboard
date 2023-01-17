const INDEX = "/";
const DASHBOARD = "/dashboard";
const REGISTER = "/register";
const LOGIN = "/login";
const FORGOT_PASSWORD = "/forgot-password";
const STUDENT_MANAGEMENT = "/student-management";
const PROGRAM = "/program-kerja";
const REPORT = "/report";
const ORGANIZATION = '/organization';

const NOT_FOUND = "/:pathMatch(.*)*";
const UNAUTHORIZED = "/403-unauthorized";

export default {
  INDEX: INDEX,
  DASHBOARD: DASHBOARD,
  REGISTER: REGISTER,
  LOGIN: LOGIN,
  FORGOT_PASSWORD: FORGOT_PASSWORD,
  PROGRAM: PROGRAM,
  REPORT: REPORT,
  ORGANIZATION: ORGANIZATION,
  STUDENT_MANAGEMENT: STUDENT_MANAGEMENT,
  NOT_FOUND: NOT_FOUND,
  UNAUTHORIZED: UNAUTHORIZED
}

class FrontendPath {

  static LOGIN = "/login";
  static RESET_PASSSWORD = "/reset-password";
  static TRANSACTION = "/transaction";
  static REPORT = "/report";
  static ORGANIZATION = "/organization";

}

class FrontendRouteName {

  static LOGIN = "login";
  static RESET_PASSWORD = "reset-password";
  static TRANSACTION = "transaction";
  static REPORT = "report";
  static STUDENT_MANAGEMENT = "student-management";
  static ORGANIZATION = "organization";

}

export { FrontendPath, FrontendRouteName }
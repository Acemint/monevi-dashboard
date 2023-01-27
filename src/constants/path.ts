const INDEX = '/';
const DASHBOARD = '/dashboard';
const REGISTER = '/register';
const LOGIN = '/login';
const FORGOT_PASSWORD = '/forgot-password';
const STUDENT_MANAGEMENT = '/student-management';
const REPORT = '/report';
const ORGANIZATION = '/organization';

const NOT_FOUND = '/:pathMatch(.*)*';
const UNAUTHORIZED = '/403-unauthorized';

export default {
  INDEX: INDEX,
  DASHBOARD: DASHBOARD,
  REGISTER: REGISTER,
  LOGIN: LOGIN,
  FORGOT_PASSWORD: FORGOT_PASSWORD,
  REPORT: REPORT,
  ORGANIZATION: ORGANIZATION,
  STUDENT_MANAGEMENT: STUDENT_MANAGEMENT,
  NOT_FOUND: NOT_FOUND,
  UNAUTHORIZED: UNAUTHORIZED,
};

class FrontendPath {
  static LOGIN = '/login';
  static RESET_PASSSWORD = '/reset-password';
  static ORGANIZATION = '/organization';

  static Transaction = class MoneviTransactionPath {
    static ROOT = '/transaksi';
  };

  static Report = class MoneviReportPath {
    static ROOT = '/laporan';
    static DETAILS = 'details';
  };

  static Program = class MoneviProgramPath {
    static ROOT = '/program-kerja';
    static DETAILS = 'details';
  };
}

class FrontendRouteName {
  static INDEX = 'index';
  static DASHBOARD = 'dashboard';
  static LOGIN = 'login';
  static REGISTER = 'register';
  static FORGOT_PASSWORD = 'forgot-password';
  static RESET_PASSWORD = 'reset-password';
  static STUDENT_MANAGEMENT = 'student-management';
  static ORGANIZATION = 'organization';

  static Error = class FrontendErrorRouteName {
    static ERROR_404 = '404';
    static ERROR_403 = '403';
  };

  static Transaction = class FrontendRouteNameTransaction {
    static ROOT = 'transaction';
  };

  static Report = class FrontendRouteNameReport {
    static ROOT = 'report';
    static DETAILS = 'report-details';
  };

  static Program = class FrontendRouteNameProgram {
    static ROOT = 'program';
    static DETAILS = 'progrma-details';
  };
}

export { FrontendPath, FrontendRouteName };

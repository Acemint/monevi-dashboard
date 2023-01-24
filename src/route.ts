import { createRouter, createWebHistory, type LocationQuery, type LocationQueryValue, type RouteLocationNormalized } from 'vue-router';
import { nextTick } from 'vue';

import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import StudentManagement from '@/views/StudentManagement.vue';
import ProgramDetails from '@/views/ProgramDetails.vue';
import ProgramSelect from '@/views/ProgramSelect.vue';
import Transaction from '@/views/Transaction.vue';
import ReportSelect from '@/views/ReportSelect.vue';
import ReportDetails from '@/views/ReportDetails.vue';
import Organization from '@/views/Organization.vue';
import Error403 from '@/views/error/Error403.vue';
import Error404 from '@/views/error/Error404.vue';
import Path, { FrontendPath, FrontendRouteName } from '@/constants/path';
import Role from '@/constants/role';
import ResetPassword from '@/views/ResetPassword.vue';
import type { MoneviToken } from './api/model/monevi-model';


// Define category of pages
const NON_LOGGED_IN_PATHS: string[] = [ Path.LOGIN, Path.REGISTER, Path.FORGOT_PASSWORD, FrontendPath.RESET_PASSSWORD ];
const ROLE_SPECIFIC_PATHS: { [key: string]: string[] } = 
  {
    supervisor: [ Path.STUDENT_MANAGEMENT, FrontendPath.ORGANIZATION, FrontendPath.Program.ROOT, FrontendPath.Report.ROOT ],
    chairman: [  ],
    treasurer: [  ]
  };


const router = createRouter({
  history: createWebHistory(),
  routes: [ 
      // {
      //   path: Path.INDEX,
      //   component: Index,
      //   meta: { title: 'Homepage' }
      // },
      { 
        path: Path.DASHBOARD, 
        component: Dashboard, 
        name: FrontendRouteName.DASHBOARD,
        meta: { title: 'Dashboard' }
      },
      { 
        path: Path.LOGIN, 
        component: Login, 
        name: FrontendRouteName.LOGIN,
        meta: { title: 'Login' } 
      },
      {
        path: Path.FORGOT_PASSWORD,
        component: ForgotPassword,
        name: FrontendRouteName.FORGOT_PASSWORD,
        meta: { title: 'Forgot Password' }
      },
      {
        path: FrontendPath.RESET_PASSSWORD,
        component: ResetPassword,
        name: FrontendRouteName.RESET_PASSWORD,
        meta: { title: 'Reset Password' }
      },
      { 
        path: Path.REGISTER, 
        component: Register, 
        name: FrontendRouteName.REGISTER,
        meta: { title: 'Register' } 
      },
      {
        path: FrontendPath.Program.ROOT,
        meta: { title: 'Program' },
        children: [
          {
            path: "",
            name: FrontendRouteName.Program.ROOT,
            component: ProgramSelect
          },
          {
            path: FrontendPath.Program.DETAILS,
            name: FrontendRouteName.Program.DETAILS,
            component: ProgramDetails,
          }
        ],
      },
      {
        path: Path.STUDENT_MANAGEMENT,
        component: StudentManagement,
        name: FrontendRouteName.STUDENT_MANAGEMENT,
        meta: { title: 'Student Management' }
      },
      {
        path: FrontendPath.ORGANIZATION, 
        component: Organization,
        name: FrontendRouteName.ORGANIZATION,
        meta: { title: 'Organization' }
      },
      {
        path: FrontendPath.Transaction.ROOT + '/:period?',
        meta: { title: 'Transaction' },
        children: [
          {
            path: "",
            name: FrontendRouteName.Transaction.ROOT,
            component: Transaction
          }
        ]
      },
      {
        path: FrontendPath.Report.ROOT + '/:period?' + '/:organization?',
        meta: { title: 'Report' },
        children: [
          {
            path: "",
            name: FrontendRouteName.Report.ROOT,
            component: ReportSelect,
          },
          {
            path: FrontendPath.Report.DETAILS,
            name: FrontendRouteName.Report.DETAILS,
            component: ReportDetails
          }

        ]
      },
      {
        path: Path.UNAUTHORIZED,
        name: FrontendRouteName.Error.ERROR_403,
        component: Error403, 
        meta: { title: 'Unauthorized' }
      },
      {
        path: "/:pathMatch(.*)*",
        component: Error404,
        name: FrontendRouteName.Error.ERROR_404,
        meta: { title: 'Not Found' }
      }
  ]
});


router.beforeEach((to, from, next) => {
  const loggedIn = MoneviCookieHandler.getCachedLogin();
  if (!loggedIn) {
    if (isUserAccessLoggedInPage(to.path)) {
      return next(Path.LOGIN);
    }
  }
  else {
    if (isUserAccessNotLoggedInPage(to.path)) {
      return next(Path.DASHBOARD);
    }
    if (isRoleNotAllowedToAccessTargetPage(loggedIn.role, to.path)) {
      return next( {name: FrontendRouteName.Error.ERROR_403 });
    }
    // if (isQueryParamsNotAllowedForRole(loggedIn, to.query.organization)) {
    //   return next( LOGIN_PATH );
    // }
  }
  next();
});

function isUserAccessLoggedInPage(targetPath: string): boolean {
  if (!NON_LOGGED_IN_PATHS.includes(targetPath)) {
        return true;
  }
  return false;
}

function isUserAccessNotLoggedInPage(targetPath: string): boolean {
  if (NON_LOGGED_IN_PATHS.includes(targetPath)) {
    return true;
  }
  return false;
}

function isQueryParamsNotAllowedForRole(loginData: MoneviToken, organizationRegionId: string): boolean {
  if (organizationRegionId != loginData.organizationRegionId) {
    return true;
  }
  return false;
}

function isRoleNotAllowedToAccessTargetPage(role: string, targetPath: string): boolean {
  if (ROLE_SPECIFIC_PATHS.chairman.includes(targetPath) && !(role === Role.CHAIRMAN)) {
    return true;
  }
  else if (ROLE_SPECIFIC_PATHS.supervisor.includes(targetPath) && !(role === Role.SUPERVISOR)) {
    return true
  }
  else if (ROLE_SPECIFIC_PATHS.treasurer.includes(targetPath) && !(role === Role.TREASURER)) {
    return true;
  }
  return false;
}


router.afterEach((to, from, next) => {

  // assign title after moving between page
  nextTick(() => {
      if (typeof(to.meta.title) === 'string') {
          document.title = to.meta.title || "Monevi";
      }
  })

});


export {
  router
}
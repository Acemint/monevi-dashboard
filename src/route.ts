import { createRouter, createWebHistory, type RouteRecordName } from 'vue-router';
import { nextTick } from 'vue';

import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Index from '@/views/Index.vue';
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

// Define category of pages
const NON_LOGGED_IN_ROUTE_NAMES: string[] = [
  FrontendRouteName.INDEX,
  FrontendRouteName.LOGIN,
  FrontendRouteName.REGISTER,
  FrontendRouteName.FORGOT_PASSWORD,
  FrontendRouteName.RESET_PASSWORD,
];

const SUPERVISOR_ONLY_ROUTE_NAME: string[] = [
  FrontendRouteName.STUDENT_MANAGEMENT,
  FrontendRouteName.ORGANIZATION,
  FrontendRouteName.Program.ROOT,
  FrontendRouteName.Report.ROOT,
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: Path.INDEX,
      alias: ['/home', '/index'],
      component: Index,
      name: FrontendRouteName.INDEX,
      meta: { title: 'Homepage' },
    },
    {
      path: Path.DASHBOARD,
      component: Dashboard,
      name: FrontendRouteName.DASHBOARD,
      meta: { title: 'Dashboard' },
    },
    {
      path: Path.LOGIN,
      component: Login,
      name: FrontendRouteName.LOGIN,
      meta: { title: 'Login' },
    },
    {
      path: Path.FORGOT_PASSWORD,
      component: ForgotPassword,
      name: FrontendRouteName.FORGOT_PASSWORD,
      meta: { title: 'Forgot Password' },
    },
    {
      path: FrontendPath.RESET_PASSSWORD,
      component: ResetPassword,
      name: FrontendRouteName.RESET_PASSWORD,
      meta: { title: 'Reset Password' },
    },
    {
      path: Path.REGISTER,
      component: Register,
      name: FrontendRouteName.REGISTER,
      meta: { title: 'Register' },
    },
    {
      path: FrontendPath.Program.ROOT,
      meta: { title: 'Program' },
      children: [
        {
          path: '',
          name: FrontendRouteName.Program.ROOT,
          component: ProgramSelect,
        },
        {
          path: FrontendPath.Program.DETAILS,
          name: FrontendRouteName.Program.DETAILS,
          component: ProgramDetails,
        },
      ],
    },
    {
      path: Path.STUDENT_MANAGEMENT,
      component: StudentManagement,
      name: FrontendRouteName.STUDENT_MANAGEMENT,
      meta: { title: 'Student Management' },
    },
    {
      path: FrontendPath.ORGANIZATION,
      component: Organization,
      name: FrontendRouteName.ORGANIZATION,
      meta: { title: 'Organization' },
    },
    {
      path: FrontendPath.Transaction.ROOT,
      meta: { title: 'Transaction' },
      children: [
        {
          path: '',
          name: FrontendRouteName.Transaction.ROOT,
          component: Transaction,
        },
      ],
    },
    {
      path: FrontendPath.Report.ROOT,
      meta: { title: 'Report' },
      children: [
        {
          path: '',
          name: FrontendRouteName.Report.ROOT,
          component: ReportSelect,
        },
        {
          path: FrontendPath.Report.DETAILS,
          name: FrontendRouteName.Report.DETAILS,
          component: ReportDetails,
        },
      ],
    },
    {
      path: Path.UNAUTHORIZED,
      component: Error403,
      name: FrontendRouteName.Error.ERROR_403,
      meta: { title: 'Unauthorized' },
    },
    {
      path: '/:pathMatch(.*)*',
      component: Error404,
      name: FrontendRouteName.Error.ERROR_404,
      meta: { title: 'Not Found' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const loggedIn = MoneviCookieHandler.getCachedLogin();
  if (to.name == undefined || to.name == null) {
    console.error('Unknown route');
    return next({ name: FrontendRouteName.Error.ERROR_404 });
  }
  // Not logged in user cannot access logged in route
  if (!loggedIn) {
    if (isUserAccessLoggedInPage(to.name)) {
      return next({ name: FrontendRouteName.LOGIN });
    }
  }
  // Logged in user cannot access non-logged in route
  else {
    if (!isUserAccessLoggedInPage(to.name)) {
      return next({ name: FrontendRouteName.DASHBOARD });
    }
    console.log(isRoleUnallowedToAccessDestinationRoute(loggedIn.role, to.path));
    if (isRoleUnallowedToAccessDestinationRoute(loggedIn.role, to.name)) {
      return next({ name: FrontendRouteName.Error.ERROR_403 });
    }
  }
  return next();
});

function isUserAccessLoggedInPage(destinationRouteName: RouteRecordName | null | undefined): boolean {
  if (!NON_LOGGED_IN_ROUTE_NAMES.includes(destinationRouteName!.toString())) {
    return true;
  }

  return false;
}

function isRoleUnallowedToAccessDestinationRoute(
  role: string,
  destinationRouteName: RouteRecordName | null | undefined
): boolean {
  if (SUPERVISOR_ONLY_ROUTE_NAME.includes(destinationRouteName!.toString()) && role != Role.SUPERVISOR) {
    return true;
  }
  return false;
}

router.afterEach((to, from, next) => {
  // assign title to web after moving between page
  nextTick(() => {
    document.title = to.meta.title!.toString() || 'Monevi';
  });
});

export { router };

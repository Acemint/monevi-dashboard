import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { nextTick } from 'vue';

import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import StudentManagement from '@/views/StudentManagement.vue';
import Error403 from '@/views/error/Error403.vue';
import Error404 from '@/views/error/Error404.vue';
import Path from '@/constants/path';
import Role from '@/constants/role';
import Program from './views/Program.vue';
import type { MoneviToken } from './api/model/monevi-model';


// Define category of pages
const NON_LOGGED_IN_PATHS: string[] = [ Path.LOGIN, Path.REGISTER, Path.FORGOT_PASSWORD ];
const ROLE_SPECIFIC_PATHS: { [key: string]: string[] } = 
  {
    supervisor: [ Path.STUDENT_MANAGEMENT ],
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
        meta: { title: 'Dashboard' }
      },
      { 
        path: Path.LOGIN, 
        component: Login, 
        meta: { title: 'Login' } 
      },
      {
        path: Path.FORGOT_PASSWORD,
        component: ForgotPassword,
        meta: { title: 'Forgot Password' }
      },
      { 
        path: Path.REGISTER, 
        component: Register, 
        meta: { title: 'Register' } 
      },
      {
        path: Path.PROGRAM,
        component: Program,
        meta: { title: 'Program' }
      },
      {
        path: Path.STUDENT_MANAGEMENT,
        component: StudentManagement,
        meta: { title: 'Student Management' }
      },
      {
        path: Path.UNAUTHORIZED,
        component: Error403, 
        meta: { title: 'Unauthorized' }
      },
      {
        path: "/:pathMatch(.*)*",
        component: Error404,
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
      return next(Path.UNAUTHORIZED);
    }
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
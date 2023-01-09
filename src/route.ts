import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { nextTick } from 'vue';

import { MoneviCookieHandler } from '@/api/methods/monevi-cookie-handler';
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import Path from '@/constants/path';
import Program from './views/Program.vue';


// Define category of pages
const PUBLIC_PATHS = [ Path.INDEX ];
const LOGGED_IN_PATHS = [ Path.DASHBOARD, Path.PROGRAM ];
const NON_LOGGED_IN_PATHS = [ Path.LOGIN, Path.REGISTER, Path.FORGOT_PASSWORD ];


const router = createRouter({
  history: createWebHistory(),
  routes: [ 
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
      }
  ]
});


router.beforeEach((to, from, next) => {
  const loggedIn = MoneviCookieHandler.getCookie('username');
  
  if (loggedIn && NON_LOGGED_IN_PATHS.includes(to.path)) {
    return next(Path.DASHBOARD);
  }

  if (!loggedIn && LOGGED_IN_PATHS.includes(to.path)) {
      return next(Path.LOGIN);
  }

  next();
});


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
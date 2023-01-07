import { createApp, nextTick } from 'vue'
import { createRouter, createWebHistory, type RouteLocationNormalized }  from 'vue-router'
import { MoneviCookieHandler } from './api/methods/monevi-cookie-handler';
import LoadScript from "vue-plugin-load-script";

import App from './App.vue';
import Dashboard from './pages/Dashboard.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';

// Set the paths to certain page
const router = createRouter({
    history: createWebHistory(),
    routes: [
        // { path: '/index', component: Index }, 
        { path: '/dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
        { path: '/login', component: Login, meta: { title: 'Login' } },
        { path: '/register', component: Register, meta: { title: 'Register'} }
    ]
});

// If a user tries to access the non-public pages, they will be redirected to login
router.beforeEach((to, from, next) => {
    const publicPages = ['/index', '/login', '/register'];
    const loggedIn = MoneviCookieHandler.getCookie('username');
    
    if (loggedIn && (to.path === "/login" || to.path === "/register") ) {
        return next('/dashboard');
    }

    if (!loggedIn && !publicPages.includes(to.path)) {
        return next('/login');
    }
    next();
})

// Assign name to title
router.afterEach((to, from, next) => {

    // assign title after moving between page
    nextTick(() => {
        console.log(to)
        if (typeof(to.meta.title) === 'string') {
            document.title = to.meta.title || "Monevi";
        }
    })
})

const app = createApp(App);
app.use(router);
app.use(LoadScript);
router.isReady().then(() => app.mount('#app'));


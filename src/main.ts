import { createApp } from 'vue'
import { createRouter, createWebHistory }  from 'vue-router'
import { MoneviCookieHandler } from './api/methods/monevi-cookie-handler';

import App from './App.vue';
import Dashboard from './pages/Dashboard.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';

// Set the paths to certain page
const router = createRouter({
    history: createWebHistory(),
    routes: [
        // { path: '/index', component: Index }, 
        { path: '/dashboard', component: Dashboard },
        { path: '/login', component: Login },
        { path: '/register', component: Register }
    ]
});

// If a user tries to access the non-public pages, they will be redirected to login
router.beforeEach((to, from, next) => {
    const publicPages = ['/index', '/login', '/register'];
    const loggedIn = MoneviCookieHandler.getCookie('username');
    
    if (loggedIn && to.path == "/login") {
        return next('/dashboard');
    }

    if (!loggedIn && !publicPages.includes(to.path)) {
        return next(to.path);
    }
    next();
})

const app = createApp(App);
app.use(router);
router.isReady().then(() => app.mount('#app'));


import { createApp } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory }  from 'vue-router'

import App from './App.vue'
import Index from './pages/Index.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Index },
        { path: '/login', component: Login },
        { path: '/register', component: Register }
    ]
})

const app = createApp(App)
app.use(router)
router.isReady().then(() => app.mount('#app'))


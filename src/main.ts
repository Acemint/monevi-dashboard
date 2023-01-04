import { createApp } from 'vue'
import { createRouter, createWebHashHistory }  from 'vue-router'

import App from './App.vue'
import Index from './pages/Index.vue'
import Login from './pages/Login.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Index },
        { path: '/login', component: Login }
    ]
})

const app = createApp(App)
app.use(router)
router.isReady().then(() => app.mount('#app'))


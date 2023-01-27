import { createApp } from 'vue';
import LoadScript from 'vue-plugin-load-script';

import { router } from '@/route';
import App from '@/App.vue';

const app = createApp(App);
app.use(router);
app.use(LoadScript);
router.isReady().then(() => {
  app.mount('#app');
});

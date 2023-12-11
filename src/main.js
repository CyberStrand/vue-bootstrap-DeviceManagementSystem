import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'

const app=createApp(App).use(router).mount('#app')
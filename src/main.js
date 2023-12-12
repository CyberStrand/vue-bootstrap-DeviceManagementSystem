import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

<<<<<<< HEAD
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount("#app")
=======
const app=createApp(App).use(router).mount('#app')
>>>>>>> 813947f68dcbb0177198d89e104e551088952c21

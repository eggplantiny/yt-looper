import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@/routes'

import './assets/main.scss'
import '@vueform/slider/themes/default.css'
import 'mosha-vue-toastify/dist/style.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

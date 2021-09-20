import { createApp } from 'vue'
import App from './App.vue'
import Notifications from '@kyvg/vue3-notification'
import { router } from '@/routes'

import './assets/main.scss'
import '@vueform/slider/themes/default.css'

const app = createApp(App)

app.use(router)
app.use(Notifications)

app.mount('#app')

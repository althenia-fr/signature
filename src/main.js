import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import FontAwesomeIcon from './plugins/fontawesome'
import './assets/css/main.css'

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)

import DefaultLayout from './layouts/DefaultLayout.vue'
app.component('DefaultLayout', DefaultLayout)

app.use(router)
app.mount('#app')

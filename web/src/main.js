import { createApp } from 'vue'
import App from '@/App.vue'
import router from "@/config/router";
import store from '@/config/store'

//css
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-select/dist/vue-select.css'
import '@/assets/css/style.css'

//js
import 'bootstrap/dist/js/bootstrap'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')

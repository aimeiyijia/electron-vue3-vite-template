import 'uno.css'
import './style.css'
import './samples/node-api'

import { createApp } from 'vue'

import router from '@/router'
import store from '@/store'

import App from './App.vue'

const app = createApp(App)

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })

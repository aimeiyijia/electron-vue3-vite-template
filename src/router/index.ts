import { createRouter, createWebHashHistory } from 'vue-router'

import TestPage from '@/views/test-test.vue'
const routes = [
  {
    path: '/',
    component: () => TestPage
  }
]

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import testMap from '@/views/testMap/testMap.vue'
import olTestMap from '@/views/testMap/olTestMap.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: testMap
    },
    {
      path: '/ol',
      name: 'home',
      component: olTestMap
    }
  ]
})

export default router

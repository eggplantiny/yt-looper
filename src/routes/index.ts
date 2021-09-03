import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import defaultLayout from '@/layouts/default.vue'
import dynamicVideoId from '@/pages/_videoId.vue'
import Home from '@/pages/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/:videoId',
    name: 'VideoPlayer',
    component: defaultLayout,
    children: [
      {
        path: '',
        component: dynamicVideoId
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: defaultLayout,
    children: [
      {
        path: '',
        component: Home
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

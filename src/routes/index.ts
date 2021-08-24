import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

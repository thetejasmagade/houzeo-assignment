import { createRouter, createWebHistory } from 'vue-router'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: (to, from, next) => {
        if (cookies.get('request_token')) {
          next()
        } else {
          next('/auth')
        }
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      beforeEnter: (to, from, next) => {
        if (cookies.get('request_token')) {
          next('/')
        } else {
          next()
        }
      },
    },
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: { name: 'error', query: { type: 'invalid-token' } }
  },
  {
    path: '/start/:token',
    name: 'signing',
    component: () => import('@/pages/SigningPage.vue'),
    meta: { layout: 'DefaultLayout' },
    beforeEnter: (to, from, next) => {
      const token = to.params.token
      const tokenRegex = /^(p1|p2)-.+/i

      if (tokenRegex.test(token)) {
        next()
      } else {
        next({ name: 'error', query: { type: 'invalid-token' } })
      }
    }
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/pages/ErrorPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/ErrorPage.vue'),
    meta: { layout: 'DefaultLayout' },
    beforeEnter: (to, from, next) => {
      next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

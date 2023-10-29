import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import ReadingsManager from '@/components/ReadingsManager'
import { authenticationGuard } from '../authentication-guard'
const CallbackPage = () => import('@/pages/callback-page.vue')

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/readings-manager',
      name: 'ReadingsManager',
      component: ReadingsManager,
      meta: {
        requiresAuth: true
      },
      beforeEnter: authenticationGuard
    },
    {
      path: '/callback',
      name: 'callback',
      component: CallbackPage
    }
  ]
})

export default router

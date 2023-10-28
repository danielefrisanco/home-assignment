import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import ReadingsManager from '@/components/ReadingsManager'
// import OktaVue, { LoginCallback } from '@okta/okta-vue'
// import { OktaAuth } from '@okta/okta-auth-js'

console.log('SPOSTARE issuer e clientid in env')
// const oktaAuth = new OktaAuth({
//   issuer: 'https://dev-25906436.okta.com/oauth2/default/oauth2/default',
//   clientId: '0oacxman6qNc03DxC5d7',
//   redirectUri: window.location.origin + '/callback',
//   scopes: ['openid', 'profile', 'email']
// })

Vue.use(Router)
// Vue.use(OktaVue, { oktaAuth })

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    // {
    //   path: '/callback',
    //   component: LoginCallback
    // },
    {
      path: '/readings-manager',
      name: 'ReadingsManager',
      component: ReadingsManager,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

export default router

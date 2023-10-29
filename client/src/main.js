// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import i18n from './i18n'
import uuid from '@estudioliver/vue-uuid-v4'

import { Auth0Plugin } from './auth0-plugin'

Vue.use(Auth0Plugin, {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  redirectUri: process.env.AUTH0_CALLBACK_URL,
  audience: process.env.AUTH0_AUDIENCE,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetPath
        ? appState.targetPath
        : window.location.pathname
    )
  }
})

Vue.use(uuid)
Vue.use(BootstrapVue)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  i18n,
  components: { App }
})

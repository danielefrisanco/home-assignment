<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <img class="logo" src="@/assets/logo.png">
      <b-navbar-brand to="/">Home Assignment</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/">{{ $t("home") }}</b-nav-item>
          <b-nav-item to="/readings-manager">{{ $t("reading.manager") }}</b-nav-item>
          <div class="nav__end">
            <LocaleSwitcher />
          </div>
          <template v-if="!$auth0.isAuthenticated">
            <SignupButton />
            <LoginButton />
          </template>
          <template v-if="$auth0.isAuthenticated">
            <LogoutButton />
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Notifications :ws-room="wsRoom"/>
    <!-- routes will be rendered here -->
    <router-view :ws-room="wsRoom" :active-user="activeUser"/>
  </div>
</template>

<script>

import LoginButton from '@/components/buttons/login-button.vue'
import LogoutButton from '@/components/buttons/logout-button.vue'
import SignupButton from '@/components/buttons/signup-button.vue'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import Notifications from '@/components/Notifications'
export default {
  name: 'app',
  data () {
    return {
      activeUser: null,
      wsRoom: this.$uuidKey() // Maybe should be a value given from the server upon logging
    }
  },
  components: { LocaleSwitcher, Notifications, LoginButton, LogoutButton, SignupButton },
  async created () {
    await this.refreshActiveUser()
  },
  watch: {
    // everytime a route is changed refresh the activeUser
    '$route': 'refreshActiveUser'
  },
  methods: {
    async refreshActiveUser () {
      if (this.$auth0.isAuthenticated) {
        this.activeUser = await this.$auth0.user
      }
    }
  }
}
</script>
<style scoped>
/* .nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  padding: 1rem;
  color: #fff;
  background-color: #3d536a;
}
.nav__start, */
.nav__end {
  display: flex;
  align-items: center;
}
.nav img {
  margin-right: 1rem;
}
.logo {
  max-height: 30px;
}
.navbar-collapse {
  justify-content: flex-end; 
}
/* .nav a {
  margin-right: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
} */
</style>
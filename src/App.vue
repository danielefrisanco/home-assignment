<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">My Vue App</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/readings-manager">Readings Manager</b-nav-item>
          <b-nav-item href="#" @click.prevent="login" v-if="!activeUser">Login</b-nav-item>
          <b-nav-item href="#" @click.prevent="logout" v-else>Logout</b-nav-item>
          <div class="nav__end">
            <LocaleSwitcher />
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- routes will be rendered here -->
    <router-view />
  </div>
</template>

<script>

import LocaleSwitcher from '@/components/LocaleSwitcher'
export default {
  name: 'app',
  data () {
    return {
      activeUser: null
    }
  },
  components: { LocaleSwitcher },
  async created () {
    // await this.refreshActiveUser()
  },
  watch: {
    // everytime a route is changed refresh the activeUser
    // '$route': 'refreshActiveUser'
  },
  methods: {
    async login () {
      this.$auth.signInWithRedirect()
    },
    async refreshActiveUser () {
      if (this.authState.isAuthenticated) {
        this.activeUser = await this.$auth.getUser()
      }
    },
    async logout () {
      await this.$auth.signOut()
      await this.refreshActiveUser()
      this.$router.push('/')
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
/* .nav a {
  margin-right: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
} */
</style>
<template>
  <b-btn class="button__logout" @click="handleLogout">Log Out</b-btn>
</template>

<script>
export default {
  methods: {
    handleLogout () {
      this.$auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    }
  }
}
</script>
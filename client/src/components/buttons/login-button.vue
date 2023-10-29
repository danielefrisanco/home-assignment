<template>
  <b-btn class="button__login" @click="handleLogin">Log In</b-btn>
</template>

<script>
export default {
  methods: {
    handleLogin () {
      this.$auth0.loginWithRedirect({
        appState: {
          targetPath: '/readings-manager'
        }
      })
    }
  }
}
</script>
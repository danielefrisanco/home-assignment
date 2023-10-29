<template>
  <b-btn class="button__sign-up" @click="handleSignUp">Sign Up</b-btn>
</template>

<script>
export default {
  methods: {
    handleSignUp () {
      this.$auth0.loginWithRedirect({
        appState: {
          targetPath: '/readings-manager'
        },
        authorizationParams: {
          screen_hint: 'signup'
        }
      })
    }
  }
}
</script>
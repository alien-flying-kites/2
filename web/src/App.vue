<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import showMessage from './plugins/showMessage'
import * as router from 'vue-router'
import * as ws from './plugins/ws'
// import * as decode from 'jwt-decode'
import {
  SAVE_USER_TO_LOCAL
} from './store/module/mutation-types'
export default Vue.extend({
  name: 'App',
  created: function () {
    const token = window.localStorage.getItem('token')
    this.$store.commit(SAVE_USER_TO_LOCAL, token)
    if (!this.isUserAuthenticated()) {
      if (token) {
        showMessage('用户身份已过期，请重新登录')
      }
      this.$router.replace('login')
      console.log(router)
    } else {
      this.openSocket()
    }
  },
  methods: {
    isUserAuthenticated (): boolean {
      const userExpirationTime = this.$store.state.userModule.currentUser.expirationTime
      if (!userExpirationTime) return false
      return userExpirationTime.valueOf() > new Date().valueOf()
    },
    openSocket () {
      const token = window.localStorage.getItem('token')
      if (token) {
        this.$socket.io.opts.query = { token: token }
        this.$socket.open()
        console.log(ws)
      }
    }
  }
})
</script>

<style>
</style>

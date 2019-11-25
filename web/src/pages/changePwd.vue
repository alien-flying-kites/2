<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
        <q-page>
            <div class="login-box"></div>
            <div class="login-box">
                <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" class="company-logo">
                <q-card class="card">
                    <q-card-title align="center">
                        修改初始密码
                    </q-card-title>
                    <q-card-separator />
                    <q-card-main>
                        <div class="input-box" style="margin:-10px auto 30px; maxWidth: 300px;">
                            <p class="caption" style="margin: 16px 0 6px">登录名</p>
                            <q-input color="white" v-model="username" inverted-light type="text" placeholder="输入登录名" style="margin: 6px 0 0" />
                            <p class="caption" style="margin: 16px 0 6px">初始密码</p>
                            <q-input color="white" v-model="oldpassword" inverted-light type="password" placeholder="输入初始密码" style="margin: 6px 0 0" />
                             <p class="caption" style="margin: 16px 0 6px">新密码</p>
                            <q-input color="white" v-model="newpassword" inverted-light type="password" placeholder="输入新密码" style="margin: 6px 0 0" />
                             <p class="caption" style="margin: 16px 0 6px">确认新密码</p>
                            <q-input color="white" v-model="newpassword2" inverted-light type="password" placeholder="输入新密码" style="margin: 6px 0 0" />
                            <div class="q-mt-lg">
                                <q-btn color="primary" label="确认修改" @click="submitLogin" style="width: 120px; height: 40px">
                                <span slot="loading">Loading...</span>
                                </q-btn>
                            </div>
                        </div>
                    </q-card-main>
                </q-card>
            </div>
            <q-inner-loading :visible="visible">
                <q-spinner-ios size="40px" color="primary"/>
            </q-inner-loading>
        </q-page>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import showMessage from '../plugins/showMessage'

export default Vue.extend({
  name: 'login',
  data () {
    return {
      username: '',
      oldpassword: '',
      newpassword: '',
      newpassword2: '',
      repassword: '',
      visible: false,
      showTip: false
    }
  },
  computed: {
  },
  watch: {
  },
  beforeMount () {
  },

  mounted () {
  },

  beforeDestroy () {
  },

  methods: {
    submitLogin: function () {
      if (!this.username) {
        return showMessage('请输入用户名')
      }
      if (!this.oldpassword) {
        return showMessage('请输入原密码')
      }
      if (!this.newpassword) {
        return showMessage('请输入新密码')
      }
      if (!this.newpassword2) {
        return showMessage('请输入确认密码')
      }
      if (this.newpassword !== this.newpassword2) {
        return showMessage('两次密码输入不一致，请重新确认输入')
      }
      const content = {
        username: this.username,
        oldpassword: this.oldpassword,
        newpassword: this.newpassword,
        newpassword2: this.newpassword2
      }
      console.log(content)
      const host = axios.defaults.baseURL
      axios.post(host + '/api/user/changePassword', content)
        .then(this.loginCallback,
          function (error) {
            console.log(error)
          })
        .catch(function (error) {
          console.log(error)
        })
    },
    loginCallback (data:any) {
      if (data.data.message) {
        showMessage(data.data.message)
      }
      if (data.data.success) {
        this.$router.replace('/login')
      }
    }
  }
})
</script>
<style>
.login-box {
  width: 100%;
  min-height: 100vh;
  position: absolute;
  background: #f5f5f7;
}
.login-box .card {
  margin: 50px auto 30px;
  background: #fff;
  max-width: 400px;
  width: 90vw;
}
.company-logo {
  width: 60vw;
  margin: 30px auto;
  max-width: 200px;
  display: block;
}
.forget-pwd {
  line-height: 40px;
  color: #eaa276;
  cursor: pointer;
}
</style>

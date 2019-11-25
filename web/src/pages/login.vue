<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
        <q-page>
            <div class="login-box"></div>
            <div class="login-box">
                <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" class="company-logo">
                <q-card class="card">
                    <q-card-title align="center">
                        登录
                    </q-card-title>
                    <q-card-separator />
                    <q-card-main>
                        <div class="input-box" style="margin:-10px auto 30px; maxWidth: 300px;">
                            <p class="caption" style="margin: 16px 0 6px">账号：登录名/邮箱/手机号码</p>
                            <q-input color="white" v-model="username" inverted-light type="text" placeholder="输入登录名/邮箱/手机号码" style="margin: 6px 0 0" />
                            <p class="caption" style="margin: 16px 0 6px">密码</p>
                            <q-input color="white" v-model="password" inverted-light type="password" placeholder="输入密码" style="margin: 6px 0 0" />
                            <div class="q-mt-lg">
                                <q-btn color="primary" label="登录" @click="submitLogin" style="width: 120px; height: 40px">
                                <span slot="loading">Loading...</span>
                                </q-btn>
                                <a href="mailto:lcai@openailab.com?subject=密码重置" class="float-right forget-pwd">
                                忘记密码？
                                <q-tooltip class="">
                                    请联系管理员
                                    <br>
                                    lcai@openailab.com
                                </q-tooltip>
                                </a>
                                <p class="float-left forget-pwd" @click="toRegister">还没有账号？去注册</p>
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
// import axios from 'axios'
import showMessage from '../plugins/showMessage'
import { mapGetters, mapActions } from 'vuex'
import {
  REMOVE_USER_FROM_LOCAL
} from '../store/module/mutation-types'
export default Vue.extend({
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      repassword: '',
      visible: false,
      showTip: false
    }
  },
  computed: {
    ...mapGetters([])
  },
  watch: {
    serverData: function (res, oldVal) {
      this.visible = false
      if (!res) return
      if (!res.data) {
        if (res.errCode === 1) {
          return showMessage(res.msg)
        }
      }
      this.$router.replace('/')
    }
  },
  beforeMount () {
    this.$store.commit(REMOVE_USER_FROM_LOCAL)
    this.$socket.close()
    // console.log('this.sockets:', this.sockets)
  },
  mounted () {
    document.onkeydown = (e:any) => {
      var key = e.which || e.target.keyCode
      if (key === 13) {
        this.submitLogin()
      }
    }
  },
  beforeDestroy () {
    document.onkeydown = null
    // (window as any).isLoginPage = false
  },

  methods: {
    ...mapActions(['login']),
    submitLogin () {
      const userInfo = {
        account: this.username,
        password: this.password
      }
      if (!this.username) {
        return showMessage('用户名为空')
      }
      if (!this.password) {
        return showMessage('登录密码为空')
      }
      this.visible = true
      this.$store.dispatch('login', userInfo)
        .then(this.loginSuccessCallback)
        .catch((reason: any) => {
          this.visible = false
        })
    },
    toRegister () {
      this.$router.push('/register')
    },
    loginSuccessCallback (res: any) {
      this.visible = false
      this.openSocket()
      console.log(res)
      setTimeout(() => {
        this.$router.replace('/')
      }, 2500)
      // if (localStorage.getItem('uuid') != null) {
      // }
    },
    openSocket () {
      const token = window.localStorage.getItem('token')
      if (token) {
        this.$socket.io.opts.query = { token: token }
        this.$socket.open()
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
  width: 80vw;
  margin: 60px auto;
  max-width: 300px;
  display: block;
}
.forget-pwd {
  line-height: 40px;
  color: #eaa276;
  cursor: pointer;
}
</style>

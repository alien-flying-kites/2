<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
        <q-page>
            <div class="login-box"></div>
            <div class="login-box">
                <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" class="company-logo">
                <q-card class="card">
                    <q-card-title align="center">
                        注册
                    </q-card-title>
                    <q-card-separator />
                    <q-card-main>
                        <div class="input-box" style="margin:-10px auto 30px; maxWidth: 300px;">
                          <!-- <p class="caption" style="margin: 16px 0 6px">角色类型</p>
                            <div class="q-mt-lg">
                              <q-radio v-model="roletype" val="1" label="非学生" />
                              <q-radio v-model="roletype" val="2" label="学生" />
                            </div> -->
                          <p class="caption" style="margin: 16px 0 6px">角色类型：</p>
                            <div class="q-mt-lg">
                              <q-select color="white"
                                  inverted
                                  separator
                                  v-model="selectedRole"
                                  :options="optionList"
                                  class="col-9 text_white"
                                  placeholder="请选择角色"
                                />
                                <!-- <q-select
                                  multiple
                                  float-label="Select role"
                                  v-model="selectedRole"
                                  class="col-9 text_white"
                                  :options="optionList"
                                /> -->
                            </div>
                            <p class="caption" style="margin: 16px 0 6px" v-if="this.selectedRole===64">所属班级</p>
                            <div class="q-mt-lg" v-if="this.selectedRole===64">
                              <q-select color="white"
                                inverted
                                separator
                                v-model="class2Name"
                                :options="class2OptionList"
                                class="col-9 text_white"
                              />
                            </div>
                            <p class="caption" style="margin: 16px 0 6px">账号(用于登录系统)</p>
                            <q-input color="white" v-model="username"  inverted-light type="text" placeholder="长度在2-20个字符之间" style="margin: 6px 0 0"/>
                            <p class="caption" style="margin: 16px 0 6px">姓名(用于显示)</p>
                            <q-input color="white" v-model="displayname" inverted-light type="text" placeholder="长度在2-20个字符之间" style="margin: 6px 0 0"/>
                            <p class="caption" style="margin: 16px 0 6px">手机号码</p>
                            <q-input color="white" v-model="phone" inverted-light type="text" placeholder="输入手机号码" style="margin: 6px 0 0"/>
                            <p class="caption" style="margin: 16px 0 6px">邮箱</p>
                            <q-input color="white" v-model="email"  inverted-light type="email" placeholder="输入邮箱" style="margin: 6px 0 0"/>
                            <p class="caption" style="margin: 16px 0 6px">密码</p>
                            <q-input color="white" v-model="pwd"  inverted-light type="password" placeholder="密码由6-20位数字+字母组成" style="margin: 6px 0 0"/>
                            <p class="caption" style="margin: 16px 0 6px">确认密码</p>
                            <q-input color="white" v-model="pwd2"  inverted-light type="password" placeholder="密码由6-20位数字+字母组成" style="margin: 6px 0 0"/>
                            <p class="caption" style="margin: 16px 0 6px">性别</p>
                            <div class="q-mt-lg">
                              <q-select color="white"
                                  inverted
                                  separator
                                  v-model="selectedGender"
                                  :options="genderList"
                                  class="col-9 text_white"
                                  placeholder="请选择性别"
                                />
                            </div>
                            <p class="caption" style="margin: 16px 0 6px">地址</p>
                            <q-input color="white" v-model="address"  inverted-light type="text" placeholder="非必填" style="margin: 6px 0 0"/>
                            <div class="q-mt-lg">
                                <q-btn color="primary"  label="确定" @click="sureRegister" style="width: 120px; height: 40px">
                                <span slot="loading">Loading...</span>
                                </q-btn>
                                <q-btn color="primary" class="float-right" label="取消" @click="cancle" style="width: 120px; height: 40px"></q-btn>
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
import showMessage from '../plugins/showMessage'
import { mapGetters } from 'vuex'
import axios from 'axios'
let class2OptionList: Array<any> = []
export default Vue.extend({
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      repassword: '',
      displayname: '',
      pwd: '',
      pwd2: '',
      address: '',
      phone: '',
      email: '',
      visible: false,
      showTip: false,
      roleTypes: 0,
      selectedRole: 64,
      selectedGender: null,
      option: '',
      optionList: [
        // { label: '超级管理员', value: 1 },
        // { label: '学校管理员', value: 2 },
        // { label: '课程管理员', value: 4 },
        // { label: '实验室管理员', value: 16 },
        { label: '教师', value: 32 },
        { label: '学生', value: 64 }
      ],
      genderList: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      roletype: '2',
      class2Name: '',
      class2OptionList
    }
  },
  computed: {
    ...mapGetters(['operateData'])
  },
  watch: {
    operateData: function (v) {
      if (!v) return
      let res = v.data
      if (res && !res.errCode) {
        setTimeout(() => {
          this.$router.replace('/login')
        }, 2000)
        return showMessage(v.tips + '，操作成功')
      }
      showMessage(v.tips + '，操作失败')
      if (res && res.msg) {
        setTimeout(() => {
          showMessage(res.msg, 'info', 1000)
        }, 1000)
      }
    }
  },
  beforeMount () {
  },

  mounted () {
    const host = axios.defaults.baseURL
    let _this = this
    axios.post(host + '/api/user/getClass2Option')
      .then(function (response) {
        if (response.data.length <= 0) {
          _this.class2OptionList.push({ label: '暂无数据', value: '' })
        }
        response.data.some((val:any, index:number) => {
          _this.class2OptionList.push({ label: val.name, value: val._id })
        })
      })
      .catch(function (error) {
        console.log(error)
      })
    // this.$socket.emit('class2OptionList')
  },

  beforeDestroy () {
  },

  methods: {
    sureRegister: function () {
      // if (this.roletype === '') {
      //   return showMessage('请选择角色类型')
      // }
      if (!this.selectedRole) {
        return showMessage('请选择角色')
      }
      this.roleTypes = this.selectedRole
      if (this.roleTypes === 64) {
        if (!this.class2Name) {
          return showMessage('请选择班级')
        }
      }
      if (!this.username) {
        return showMessage('用户名为空')
      }
      if (this.username.length < 2) {
        return showMessage('用户名不得少于2个字符')
      }
      if (this.username.length > 20) {
        return showMessage('用户名不得超过20个字符')
      }
      if (!this.displayname) {
        return showMessage('显示名为空')
      }
      if (this.displayname.length < 2) {
        return showMessage('显示名不得少于2个字符')
      }
      if (this.displayname.length > 20) {
        return showMessage('显示名不得超过20个字符')
      }
      if (!this.pwd) {
        return showMessage('密码为空')
      }
      if (this.pwd.length < 6 || this.pwd.length > 20) {
        return showMessage('密码长度在6~20范围')
      }
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(this.pwd)) {
        return showMessage('密码需由字母、数字组成')
      }
      if (!this.pwd2) {
        return showMessage('确认密码为空')
      }
      if (this.pwd2.length < 6 || this.pwd2.length > 20) {
        return showMessage('密码长度在6~20范围')
      }
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(this.pwd2)) {
        return showMessage('密码需由字母、数字组成')
      }
      if (this.pwd2 !== this.pwd) {
        return showMessage('两次密码不一样')
      }
      if (!this.phone) {
        return showMessage('手机号码为空')
      }
      if (this.phone && !(/^1[3456789]\d{9}$/.test(this.phone))) {
        return showMessage('手机号码有误')
      }
      if (!this.email) {
        return showMessage('邮箱为空')
      }
      if (!this.selectedGender) {
        return showMessage('请选择性别')
      }
      // for (let i in this.selectedRole) {
      //   this.roleTypes += this.selectedRole[i]
      // }
      console.log(this.roleTypes)
      const userInfo = {
        userName: this.username,
        password: this.pwd,
        displayName: this.displayname,
        account: this.username,
        gender: this.selectedGender,
        mobilePhone: this.phone,
        email: this.email,
        roleTypes: this.roleTypes,
        address: this.address,
        passwordExpired: false,
        class2Name: this.class2Name
      }
      console.log(userInfo)
      // this.$store.dispatch('addAccount', userInfo)
      const host = axios.defaults.baseURL
      axios.post(host + '/api/user/create', userInfo)
        .then(this.loginCallback,
          function (error) {
            console.log(error)
          })
        .catch(function (error) {
          console.log(error)
        })
    },
    loginCallback (response: any) {
      if (response && response.data) {
        const message = response.data.message
        const token = response.data.token
        if (response.data.success) {
          showMessage(message)
          this.$router.replace('/login')
        } else {
          showMessage(message)
        }
        if (token) {
          window.localStorage.setItem('token', token)
          this.$socket.io.opts.query = { token: token }
          this.$socket.open()
        }
      }
    },
    cancle () {
      this.$router.replace('/login')
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
  max-width: 20px;
  display: block;
}
.forget-pwd {
  line-height: 40px;
  color: #eaa276;
  cursor: pointer;
}
</style>

<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="用户基本信息"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <p><span>登录名：</span>{{userInfo.userName}}</p>
      <p><span>显示名：</span>{{userInfo.displayName}}</p>
      <p><span>角色：</span>{{userInfo.roleTypes | roleType}}</p>
      <p><span>邮箱：</span>{{userInfo.email}}</p>
      <p><span>手机号码：</span>{{userInfo.mobilePhone}}</p>
      <p><span>地址：</span>{{userInfo.address || '--'}}</p>
      <q-btn  color="primary" label="修改" class="no-shadow" @click="edit(userInfo)"/>
    </div>
    <!-- <div  class="q-pa-sm q-mt-sm q-ml-sm">
      <q-btn  color="standard" text-color='light' label="启动无线键鼠" @click="start()"/>
      <q-btn  color="standard" text-color='light' style="margin-left:10px" label="一键还原" @click="start()"/>
      <q-btn  color="standard" text-color='light' style="margin-left:10px" label="数据备份" @click="start()"/>
      <q-btn  color="standard" text-color='light' style="margin-left:10px" label="数据下载" @click="start()"/>
    </div> -->
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
// import showMessage from '../plugins/showMessagw'

export default Vue.extend({
  computed: {
    ...mapGetters(['currentUser', 'serverData'])
  },
  data () {
    return {
      websock: null,
      uuid: '',
      userInfo: {}
    }
  },
  filters: {
    roleType (data: number[]) {
      if (!data) {
        return
      }
      let role = ''
      if (data.indexOf(1) >= 0) {
        role += '超级管理员 '
      }
      if (data.indexOf(2) >= 0) {
        role += '学校管理员 '
      }
      if (data.indexOf(4) >= 0) {
        role += '课程管理员 '
      }
      if (data.indexOf(8) >= 0) {
        role += '班级管理员 '
      }
      if (data.indexOf(16) >= 0) {
        role += '实验室管理员 '
      }
      if (data.indexOf(32) >= 0) {
        role += '教师 '
      }
      if (data.indexOf(64) >= 0) {
        role += '学生 '
      }
      return role.trim()
    }
  },
  watch: {
    currentUser: function (data) {
      // console.log(data)
    },
    serverData: function (value) {
      // console.log(value)
      if (!value) {
        return
      }
      if (!value.data[0]) {
        return
      }
      this.userInfo = value.data[0]
      // console.log(this.userInfo)
    }
  },
  beforeMount () {
    const uuid = window.localStorage.getItem('uuid')
    if (uuid) {
      this.uuid = uuid
    }
  },
  mounted () {
    const params:any = {
      id: this.uuid
    }
    if (params.id) {
      this.$store.dispatch('getMyUserInfo', params)
    } else {
      setTimeout(() => {
        console.log('111111')
        this.$store.dispatch('getMyUserInfo', params)
      }, 1000)
    }
    // console.log(params)
  },
  methods: {
    edit (data) {
      this.$router.push({ name: 'editBaseInfo', params: { userInfo: data } })
    },
    refresh () {
      this.$router.go(0)
    },
    start () {
      console.log('启动cmd')
      const { exec } = require('child_process')
      exec('putty.exe', { cwd: 'C:/Program Files/PuTTY' }, (err, stdout, stderr) => {
      // exec('putty.exe', { cwd: '../PuTTY' }, (err, stdout, stderr) => {
        if (err) {
          console.error(err)
          console.error(stderr)
          return
        }
        console.log(stdout)
      })
      console.log('exec  000000000000')
    }
  }
})
</script>
<style>
.btn{
  background-color: aliceblue;
  color: darkslategrey
}
</style>

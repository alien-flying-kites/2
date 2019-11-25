<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="用户基本信息" to="/userbaseInfo"/>
        <q-breadcrumbs-el label="修改用户基本信息"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <!-- <div class="row flex-center">
          <div class="col-3">用户角色 <span class="text-negative">*</span></div>
          <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="selectedRole" value="selectedRole" placeholder="必填"/>
        </div> -->
         <div class="row flex-center mar_10">
          <div class="col-3">用户角色 <span class="text-negative">*</span></div>
          <q-select
              multiple
              float-label="选择角色"
              v-model="selectedRole"
              :options="optionList"
              disabled=true readonly="readonly"
              class="col-9 text_white"
            />
        </div>
        <div class="row flex-center">
          <div class="col-3">登录名 <span class="text-negative">*</span></div>
          <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="account" value="account" placeholder="必填"/>
        </div>
         <div class="row flex-center">
          <div class="col-3">显示名 <span class="text-negative">*</span></div>
          <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="displayName" value="displayName" placeholder="必填"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">邮箱 <span class="text-negative">*</span></div>
          <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="email" value="email" placeholder="必填"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">用户密码</div>
          <q-btn inverted color="white" :label=label @click="updatePwd()" class="col-9 text_white" />
        </div>
        <div class="row flex-center" v-if="showPwd">
          <div class="col-3">原密码</div>
          <q-input inverted color="white" type="password" @blur='checkPwd()' class="col-9 text_white" v-model.trim="password" placeholder="请输入原密码"/>
        </div>
        <div class="row flex-center" v-if="showPwd">
          <div class="col-3">新密码</div>
          <q-input inverted color="white" type="password" class="col-9 text_white" v-model.trim="password1" placeholder="密码由6-20位数字+字母组成"/>
        </div>
        <div class="row flex-center" v-if="showPwd">
          <div class="col-3">确认新密码</div>
          <q-input inverted color="white" type="password" class="col-9 text_white" v-model.trim="password2" placeholder="密码由6-20位数字+字母组成"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">联系电话</div>
          <q-input inverted color="white" type="number" v-model.trim="phoneNumber" class="col-9 text_white"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">地址</div>
          <q-input inverted color="white" type="text" v-model.trim="address" class="col-9 text_white"/>
        </div>
        <q-btn-group flat class="block q-pt-md" align="center">
          <q-btn color="faded" label="取消" class="q-mr-md" @click="cancle()"/>
          <q-btn color="primary" label="更新" @click="modifyAccount"/>
        </q-btn-group>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import showMessage from '../plugins/showMessage'
import { mapGetters } from 'vuex'

export default Vue.extend({
  components: {
  },
  data () {
    return {
      nodeName: null,
      hasData: 0,
      // opened: false,
      userData: { Id: '' },
      offset: 0,
      flag: false,
      modalShow: false,
      account: '',
      phoneNumber: '',
      password: '',
      password1: '',
      password2: '',
      repassword: '',
      remarks: '',
      email: '',
      displayName: '',
      selectedStatus: null,
      selectedRole: [],
      uuid: '',
      statusOptions: [
        {
          label: '未审核',
          value: 0
        },
        {
          label: '已激活',
          value: 1
        },
        {
          label: '已冻结',
          value: 2
        }
      ],
      optionList: [
        {
          label: '超级管理员',
          value: 1
        },
        {
          label: '学校管理员',
          value: 2
        },
        {
          label: '课程管理员',
          value: 4
        },
        {
          label: '班级管理员',
          value: 8
        },
        {
          label: '实验室管理员',
          value: 16
        },
        {
          label: '教师',
          value: 32
        },
        {
          label: '学生',
          value: 64
        }
      ],
      showPwd: false,
      label: '修改密码',
      address: ''
    }
  },
  filters: {
    roleType (roleTypes: number) {
      let role = ''
      if ((roleTypes & 1) === 1) {
        role += '超级管理员 '
      }
      if ((roleTypes & 2) === 2) {
        role += '学校管理员 '
      }
      if ((roleTypes & 4) === 4) {
        role += '课程管理员 '
      }
      if ((roleTypes & 8) === 8) {
        role += '班级管理员 '
      }
      if ((roleTypes & 16) === 16) {
        role += '实验室管理员 '
      }
      if ((roleTypes & 32) === 32) {
        role += '教师 '
      }
      if ((roleTypes & 64) === 64) {
        role += '学生 '
      }
      return role.trim()
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'currentUser'])
  },
  watch: {
    optionList: function (v: any[]) {
      if (!v) return
      var self = this
      v.some((val: any, index: number, array: any[]) => {
        if (val.label === self.selectedRole) {
          self.selectedRole = val.value
          return true
        }
        return false
      })
    },
    operateData: function (v) {
      if (!v) {
        return
      }
      let res = v.data
      if (res && !res.errCode) {
        setTimeout(() => {
          this.$router.replace('/user')
        }, 2000)
        return showMessage(v.tips + '，操作成功')
      }
      showMessage(v.tips + '，操作失败')
      if (res.msg) {
        setTimeout(() => {
          showMessage(res.msg)
        }, 1000)
      }
    },
    serverData: function (v) {
      if (!v) return
      if (v.errCode) {
        return showMessage('请求出错了', 'err')
      }
      if (v.msg !== 'OK') {
        showMessage(v.msg)
      }
      if (v && v.data && v.data.nModified && v.data.nModified === 1) {
        setTimeout(() => {
          // window.localStorage.removeItem('token')
          // window.localStorage.removeItem('uuid')
          this.$router.replace('/')
          // this.$router.replace('/login')
        }, 600)
      }
      if (v && v.data && v.data.update) {
        setTimeout(() => {
          this.$router.replace('/login')
        }, 600)
      }
      const storedUserId = localStorage.getItem('userId')
      if (storedUserId) {
        const userId = parseInt(storedUserId)
        if (v.data.Id === userId) {
          this.userData = v.data
          this.initData(v.data)
        }
      }
    }
  },
  beforeMount () {
    // this.$store.dispatch('getOption')
    const userInfo = this.$route.params.userInfo
    if (userInfo) {
      this.initData(userInfo)
    }
  },
  mounted () {
    const uuid = window.localStorage.getItem('uuid')
    if (uuid) {
      this.uuid = uuid
    }
    // let refreshBtn = this.$refs.refreshBtn
    // let parent = refreshBtn.$parent.$el.childNodes[2]
    // parent.classList.remove('no-pointer-events')
  },
  beforeDestroy () {
    localStorage.removeItem('userId')
  },
  methods: {
    showRole () {
    },
    modifyPwd () {
      // this.opened = true
      // this.password = genRandomStr()
    },
    comfirmModifyPwd () {
      if (!this.password) {
        return showMessage('密码不能为空')
      }
      // if (this.password.length < 8 || this.password.length > 24) {
      //   return showMessage('密码长度在8~24范围')
      // }
      // if (!/^[a-zA-Z0-9_]{8,24}$/.test(this.password)) {
      //   return showMessage('密码由字母、数字或下划线组成')
      // }
      let content = {
        id: this.userData.Id,
        password: this.password,
        isPwd: true
      }
      // console.log('修改用户密码，', content)
      this.$store.dispatch('modifyAccount', { type: 3, params: content })
    },
    modifyAccount () {
      if (this.selectedRole.length < 1) {
        return showMessage('请选择用户角色')
      }
      if (!this.account) {
        return showMessage('用户名不能为空')
      }
      if (this.account.length > 30) {
        return showMessage('用户名长度不超过30字符')
      }
      if (this.phoneNumber && !/^1[3456789]\d{9}$/.test(this.phoneNumber)) {
        return showMessage('手机号码有误')
      }
      if (this.showPwd === true && !this.password) {
        return showMessage('请输入原密码')
      }
      if (this.showPwd === true && !this.password1) {
        return showMessage('请输入新密码')
      }
      if (this.showPwd === true && (this.password1.length < 6 || this.password1.length > 20)) {
        return showMessage('密码长度在6~20范围')
      }
      if (this.showPwd === true && (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(this.password1))) {
        return showMessage('密码需由字母、数字组成')
      }
      if (this.showPwd === true && !this.password2) {
        return showMessage('请输入确认密码')
      }
      if (this.showPwd === true && (this.password2.length < 6 || this.password2.length > 20)) {
        return showMessage('密码长度在6~20范围')
      }
      if (this.showPwd === true && (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(this.password2))) {
        return showMessage('密码需由字母、数字组成')
      }
      if (this.showPwd === true && (this.password1 !== this.password2)) {
        return showMessage('两次密码输入不一致，请重新确认输入')
      }
      // if (!this.password) {
      //   return showMessage('密码不能为空')
      // }
      const content = {
        id: this.uuid,
        mobilePhone: this.phoneNumber,
        email: this.email,
        displayName: this.displayName,
        userName: this.account,
        password: this.password,
        password1: this.password1,
        roleTypes: this.selectedRole,
        address: this.address
      }
      // console.log(content)
      this.$store.dispatch('updateUserInfo', content)
        .then(this.editSuccessCallback)
      window.localStorage.removeItem('token')
    },
    editSuccessCallback (res: any) {
      // console.log(res)
      // showMessage('修改成功')
      // setTimeout(() => {
      //   this.$router.replace('/userbaseInfo')
      // }, 600)
    },
    initData (val: any) {
      // console.log('用户信息', val)
      let arr: Array<any> = []
      // console.log('this.selectedRole')
      if ((val.roleTypes & 1) === 1) {
        arr.push(1)
      }
      if ((val.roleTypes & 2) === 2) {
        arr.push(2)
      }
      if ((val.roleTypes & 4) === 4) {
        arr.push(4)
      }
      if ((val.roleTypes & 8) === 8) {
        arr.push(8)
      }
      if ((val.roleTypes & 16) === 16) {
        arr.push(16)
      }
      if ((val.roleTypes & 32) === 32) {
        arr.push(32)
      }
      if ((val.roleTypes & 64) === 64) {
        arr.push(64)
      }
      // console.log(arr)
      this.displayName = val.displayName
      this.phoneNumber = val.mobilePhone
      this.account = val.userName
      this.selectedRole = JSON.parse(JSON.stringify(arr))
      // this.selectedRole = arr || []
      this.selectedRole = val.roleTypes || null
      this.email = val.email
      this.uuid = val._id
      this.address = val.address
    },
    cancle () {
      this.$router.replace('/userBaseInfo')
    },
    updatePwd () {
      if (this.showPwd === true) {
        this.showPwd = false
        this.label = '修改密码'
      } else if (this.showPwd === false) {
        this.showPwd = true
        this.label = '取消修改密码'
        this.password = ''
        this.password1 = ''
        this.password2 = ''
      }
    },
    checkPwd () {
      if (this.showPwd === true && this.password && this.password.length > 0) {
        // console.log(this.password)
        const content = {
          id: this.uuid,
          password: this.password
        }
        // console.log(content)
        this.$store.dispatch('checkPwd', content)
      }
    }
  }
})
</script>
<style scope>
.mar_10{
  margin-top: 10px;
}
.text_white{
  color: #333 !important;
}
</style>

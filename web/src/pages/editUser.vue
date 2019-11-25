<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="用户列表" to="/user"/>
        <q-breadcrumbs-el label="用户编辑"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center" v-if="this.selectedRole.indexOf(1) !== -1 || this.selectedRole.indexOf(32) !== -1">
          <div class="col-3">用户角色 <span class="text-negative">*</span></div>
          <q-select
              multiple
              float-label="选择角色"
              v-model="selectedRole"
              :options="optionList1"
              class="col-9 text_white"
            />
        </div>
        <div class="row flex-center" v-if="this.selectedRole.indexOf(64) !== -1">
          <div class="col-3">用户角色 <span class="text-negative">*</span></div>
          <q-select
              multiple
              float-label="选择角色"
              v-model="selectedRole"
              disabled=true readonly="readonly"
              :options="optionList"
              class="col-9 text_white"
            />
        </div>
        <div class="row flex-center" v-if="this.selectedRole.indexOf(64) !== -1">
          <div class="col-3">所在班级 <span class="text-negative">*</span></div>
          <q-select color="white"
            inverted
            separator
            v-model="class2Name"
            :options="class2OptionList"
            class="col-9 text_white"
          />
        </div>
        <div class="row flex-center">
          <div class="col-3">登录名 <span class="text-negative">*</span></div>
          <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="account" value="account" placeholder="长度在2-20个字符之间"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">显示名 <span class="text-negative">*</span></div>
          <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="displayName" value="displayName" placeholder="长度在2-20个字符之间"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">性别 <span class="text-negative">*</span></div>
          <q-select color="white"
              inverted
              separator
              v-model="gender"
              :options="genderList"
              class="col-9 text_white"
              placeholder="请选择性别"
            />
          <!-- <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="gender" value="displayName" placeholder="长度在2-20个字符之间"/> -->
        </div>
        <div class="row flex-center">
          <div class="col-3">地址</div>
          <q-input inverted type="text" color="white" class="col-9 text_white" v-model.trim="address" value="address"/>
        </div>
        <!-- <div class="row flex-center" v-if="isShow">
          <div class="col-3">用户状态 <span class="text-negative">*</span></div>
           <q-select
            inverted
            separator
            v-model="selectedStatus"
            :options="statusOptions"
            class="col-9 text_white" color="white"
          />
        </div> -->
        <div class="row flex-center">
          <div class="col-3">联系电话</div>
          <q-input inverted color="white" type="number" v-model.trim="phoneNumber" class="col-9 text_white"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">邮箱 <span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" v-model.trim="email" class="col-9 text_white"  placeholder="必填"/>
        </div>
        <q-btn-group flat class="block q-pt-md" align="center">
          <q-btn color="faded" label="取消" class="q-mr-md" @click="cancle()"/>
          <q-btn color="primary" label="更新" @click="modifyAccount"/>
        </q-btn-group>
      </div>
    </div>
    <q-modal
      v-model="opened"
      no-esc-dismiss
      no-backdrop-dismiss
      content-classes="modal-custom"
    >
    </q-modal>
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import showMessage from '../plugins/showMessage'
import { mapGetters } from 'vuex'
let selectedRole: Array<any> = []
let selfRole: Array<any> = []
export default Vue.extend({
  components: {
  },
  data () {
    return {
      nodeName: null,
      opened: false,
      userData: { Id: '' },
      offset: 0,
      flag: false,
      modalShow: false,
      account: '',
      phoneNumber: '',
      password: '',
      address: '',
      remarks: '',
      email: '',
      displayName: '',
      selectedStatus: 0,
      selectedRole,
      uuid: '',
      isShow: true,
      selfRole,
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
          label: '教师',
          value: 32
        },
        {
          label: '学生',
          value: 64
        }
      ],
      optionList1: [
        {
          label: '超级管理员',
          value: 1
        },
        {
          label: '教师',
          value: 32
        }
      ],
      gender: null,
      userId: '',
      class2Name: Object,
      genderList: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ]
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'class2OptionList'])
  },
  watch: {
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
    serverData: function (value:any) {
      if (!value || value.ok !== 1) {
        return
      }
      if (value.errCode) {
        return showMessage('请求出错了', 'err')
      }
      this.$router.replace('/user')
    },
    class2OptionList: function (v:any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        if (val.label === self.class2Name) {
          self.class2Name = val.value
        }
      })
    }
  },
  beforeMount () {
    this.$socket.emit('class2OptionList')
    const userId = window.localStorage.getItem('uuid')
    if (userId) {
      this.userId = userId
      // console.log(this.userId)
    }
    const rowData = this.$route.params.rowData
    if (rowData) {
      // console.log(rowData)
      this.initData(rowData)
    } else {
      // showMessage('请求出错了', 'err')
      this.$router.replace('/user')
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    modifyAccount () {
      if (this.selectedRole.length <= 0) {
        return showMessage('请选择用户角色')
      }
      // console.log(this.selectedRole)
      if (this.selectedRole.indexOf(64) !== -1) {
        if (this.selectedRole.length > 1) {
          return showMessage('学生不可有多个角色')
        }
        // console.log(this.class2Name)
        if (Object.keys(this.class2Name).length === 0) {
          return showMessage('学生必须填所在班级')
        }
      }
      if (!this.account) {
        return showMessage('用户名不能为空')
      }
      if (this.account.length > 20) {
        return showMessage('用户名长度不超过20字符')
      }
      if (this.account.length < 2) {
        return showMessage('用户名长度不少于2字符')
      }
      if (!this.displayName) {
        return showMessage('显示名不能为空')
      }
      if (this.displayName.length > 20) {
        return showMessage('显示名长度不超过20字符')
      }
      if (this.displayName.length < 2) {
        return showMessage('显示名长度不少于2字符')
      }
      if (!this.gender) {
        return showMessage('性别不能为空')
      }
      if (!this.phoneNumber) {
        return showMessage('手机号码不能为空')
      }
      if (this.phoneNumber && !/^1[3456789]\d{9}$/.test(this.phoneNumber)) {
        return showMessage('手机号码有误')
      }
      // if (!this.gender) {
      //   return showMessage('性别不能为空')
      // }
      // if (!this.password) {
      //   return showMessage('密码不能为空')
      // }
      if (this.email.length < 5) {
        return showMessage('邮箱长度不少于5字符')
      }
      const content = {
        mobilePhone: this.phoneNumber,
        email: this.email,
        status: this.selectedStatus,
        roleTypes: this.selectedRole,
        userName: this.account,
        class2Name: this.class2Name,
        address: this.address,
        displayName: this.displayName,
        id: this.uuid,
        gender: this.gender
      }
      if (this.selfRole === this.selectedRole) {
        this.$store.dispatch('updateUserInfo', content)
          .then(this.editSuccessCallback)
      } else {
        this.$store.dispatch('updateUserInfo', content)
          .then(this.editSuccessCallback)
        // setTimeout(() => {
        //   this.$router.replace('/login')
        // }, 600)
      }
    },
    editSuccessCallback (res: any) {
      this.$router.replace('/User')
    },
    initData (val: any) {
      if (val._id === this.userId) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      // console.log('用户信息', val)
      this.account = val.userName || null
      this.displayName = val.displayName || null
      this.phoneNumber = val.mobilePhone || null
      this.selectedStatus = val.status || 0
      this.selectedRole = val.roleTypes || null
      this.selfRole = val.roleTypes || null
      this.email = val.email || null
      this.address = val.address || null
      this.uuid = val._id || null
      this.gender = val.gender || null
      this.class2Name = val.classId ? val.classId._id : Object
    },
    cancle () {
      this.$router.replace('/User')
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

<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="用户列表" to="/user"/>
        <q-breadcrumbs-el label="用户添加"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center mar_10">
          <div class="col-3">角色类型 <span class="text-negative">*</span></div>
          <div class=" col-9">
              <q-radio v-model="roletype" val="1" label="非学生" />
              <q-radio v-model="roletype" val="2" label="学生" />
          </div>
        </div>
        <div class="row flex-center mar_10" v-if="this.roletype ==='1'">
          <div class="col-3">用户角色 <span class="text-negative">*</span></div>
          <q-select
              multiple
              float-label="选择角色"
              v-model="selectedRole"
              :options="optionList"
              class="col-9 text_white"
            />
        </div>
        <div class="row flex-center" v-if="this.roletype ==='2'">
          <div class="col-3">所在班级 <span class="text-negative">*</span></div>
          <q-select color="white"
            inverted
            separator
            v-model="class2Name"
            :options="class2OptionList"
            class="col-9 text_white"
          />
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">登录名 <span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" class="col-9 text_white" v-model.trim="account" placeholder="长度在2-20个字符之间"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">显示名 <span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" class="col-9 text_white" v-model.trim="displayName" placeholder="长度在2-20个字符之间"/>
        </div>
         <div class="row flex-center mar_10">
            <div class="col-3">性别 <span class="text-negative">*</span></div>
            <div class="col-9">
              <q-radio v-model="gender" val="2" label="女" />
              <q-radio v-model="gender" val="1" label="男" />
            </div>
        </div>
        <!-- <div class="row flex-center mar_10">
          <div class="col-3">用户状态 <span class="text-negative">*</span></div>
           <q-select color="white"
            inverted
            separator
            v-model="selectedStatus"
            :options="statusOptions"
            class="col-9 text_white"
          />
        </div> -->
        <div class="row flex-center mar_10">
          <div class="col-3">登录密码 <span class="text-negative">*</span></div>
          <q-input  color="white" type="password" class="col-9 pwd-input text_white" v-model.trim="password">
            <q-icon color="primary"  size="24px" class="float-right icon-posi"/>
          </q-input>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">联系电话<span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" v-model.trim="phoneNumber" class="col-9 q-pr-md text_white" value="phoneNumber"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">email<span class="text-negative">*</span></div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="email"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">地址</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="address"/>
        </div>
        <q-btn-group flat class="block q-pt-md" align="center">
          <q-btn color="faded" label="取消" class="q-mr-md" @click="reset"/>
          <q-btn color="primary" label="添加" @click="addAccount"/>
        </q-btn-group>
      </div>
    </div>
    <q-modal v-model="modalShow" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
          添加成功
        </p>
        <q-btn-group flat class="q-pb-md q-pt-md float-right ">
          <q-btn
            color="amber-5"
            to="/user"
            label="返回上一页"
            class="q-mr-md round-borders"
          />
          <q-btn
            color="positive"
            @click="modalShow=false"
            label="继续添加"
            class="round-borders"
          />
        </q-btn-group>
      </div>
    </q-modal>
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
      hasData: 0,
      nodeName: '',
      offset: 0,
      flag: false,
      modalShow: false,
      account: '',
      phoneNumber: '',
      password: '',
      email: '',
      gender: '1',
      address: '',
      roleTypes: [],
      selectedStatus: 1,
      displayName: '',
      selectedRole: [],
      statusOptions: [
        {
          label: '激活',
          value: 1
        },
        {
          label: '冻结',
          value: 2
        }
      ],
      optionList: [
        {
          label: '超级管理员',
          value: 1
        },
        // {
        //   label: '学校管理员',
        //   value: 2
        // },
        // {
        //   label: '课程管理员',
        //   value: 4
        // },
        // {
        //   label: '班级管理员',
        //   value: 8
        // },
        // {
        //   label: '实验室管理员',
        //   value: 16
        // },
        {
          label: '教师',
          value: 32
        }
        // {
        //   label: '学生',
        //   value: 64
        // }
      ],
      roletype: '1',
      class2Name: ''
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'userList', 'handleOpers', 'class2OptionList'])
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      // console.log(value)
      let v = value.data
      if (!v) return
      if (value.errCode === 0) {
        this.$router.replace('/user')
      } else {
        showMessage(value.msg)
      }
    },
    operateData: function (v) {
      if (!v) return
      let res = v.data
      if (res && !res.errCode) {
        setTimeout(() => {
          this.$router.replace('/user')
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
    this.$socket.emit('class2OptionList')
  },
  mounted () {
    // let refreshBtn = this.$refs.refreshBtn
  },
  methods: {
    addAccount () {
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
      if (!this.phoneNumber) {
        return showMessage('手机号码不能为空')
      }
      if (this.phoneNumber && !/^1[3456789]\d{9}$/.test(this.phoneNumber)) {
        return showMessage('手机号码有误')
      }
      if (!this.gender) {
        return showMessage('性别不能为空')
      }
      if (!this.password) {
        return showMessage('密码不能为空')
      }
      if (this.email.length < 5) {
        return showMessage('邮箱长度不少于5字符')
      }
      if (this.roletype === '1') {
        if (this.selectedRole.length <= 0) {
          return showMessage('请选择用户角色')
        }
        this.roleTypes = this.selectedRole
        const content = {
          userName: this.account,
          mobilePhone: this.phoneNumber,
          password: this.password,
          roleTypes: this.roleTypes,
          email: this.email,
          passwordExpired: true,
          displayName: this.displayName,
          gender: parseInt(this.gender),
          address: this.address
        }
        this.$store.dispatch('addUser', content)
      } else {
        if (!this.class2Name) {
          return showMessage('学生班级不能为空')
        }
        const content = {
          userName: this.account,
          mobilePhone: this.phoneNumber,
          password: this.password,
          roleTypes: [64],
          class2Name: this.class2Name,
          email: this.email,
          passwordExpired: true,
          displayName: this.displayName,
          gender: parseInt(this.gender),
          address: this.address
        }
        this.$store.dispatch('addUser', content)
      }
      // console.log('添加用户信息', content)
      // this.$socket.emit('addUser', content)
    },
    reset () {
      this.$router.replace('/user')
      this.nodeName = ''
      this.hasData = 0
      this.account = ''
      this.phoneNumber = ''
      this.password = ''
      // this.selectedStatus = 1
      this.email = ''
      this.gender = '1'
      this.selectedRole = []
    },
    refresh () {
      this.password = ''
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

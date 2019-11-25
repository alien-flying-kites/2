<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="用户列表" to="/user"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-sm">
      <q-table
        dense
        table-class="table-custom"
        ref="table"
        row-key="userName"
        color="primary"
        selection="multiple"
        loading-label="努力加载中···"
        no-data-label="暂无数据"
        rows-per-page-label="每页最大行数"
        @request="request"
        :rows-per-page-options="[3,5,10,20]"
        :filter="filter"
        :separator="separator"
        :data="tableData"
        :columns="columns"
        :selected.sync="selected"
        :loading="tableLoading"
        :pagination.sync="serverPagination"
      >
        <template slot="top-right" slot-scope="props">
          <q-search :props="props" style="fontSize: 0.9rem"
            hide-underline
            placeholder="输入显示名进行搜索"
            v-model="filter"
          />
        </template>
        <template slot="top-left" slot-scope="props" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
          <q-btn :props="props" color="primary" to="/addUser" label="新增用户" class="no-shadow"/>
          &nbsp;<q-btn :props="props" color="primary"  label="导入学生数据" class="no-shadow"  @click="openStudentImportModal()"/>
          <span :class="{'manyItem' : isA, 'manyItem manyItem333': isB}" @click="deleteMany()">&nbsp; &nbsp;删除 </span>
          <span :class="{'manyItem' : isA, 'manyItem manyItem333': isB}" @click="unlockMany()">&nbsp; &nbsp;激活 </span>
          <span :class="{'manyItem' : isA, 'manyItem manyItem333': isB}" @click="lockMany()">&nbsp; &nbsp;冻结</span>
          <!-- <span>&nbsp; &nbsp;批量操作： </span>
          <q-select color="white"
          inverted
          separator
          :props="props"
          v-model="selectState"
          :options="optionList"
          :onchange="myFunction()"
          class="col-9 text_white"
          style="min-width:70px"
          /> -->
        </template>
        <q-tr slot="header" slot-scope="props" style="fontSize: 0.9rem">
          <q-th auto-width>
            <q-checkbox
              v-if="props.multipleSelect"
              v-model="props.selected"
              indeterminate-value="some"
            />
          </q-th>
          <q-th key="id" >序号</q-th>
          <q-th key="userName">登录名</q-th>
          <q-th key="role">角色</q-th>
          <q-th key="gender">性别</q-th>
          <q-th key="name">显示名</q-th>
          <q-th key="class">所在班级</q-th>
          <q-th key="status">用户状态</q-th>
          <q-th key="phoneNumber">联系电话</q-th>
          <q-th key="remarks">邮箱</q-th>
          <q-th key="registTime">更新时间</q-th>
          <q-th key="event">操作</q-th>
        </q-tr>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox color="primary" v-model="props.selected" />
            </q-td>
            <!-- <q-td key="desc" :props="props">
            <q-checkbox color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
            {{ props.row.userName }}
            </q-td> -->
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="userName" :props="props">{{ props.row.userName? props.row.userName:'--' }}</q-td>
            <!-- props.row.adminId?props.row.adminId.displayName:'--' -->
            <q-td key="role" :props="props" :title="props.row.roleTypes | roleType">{{ props.row.roleTypes | roleType }}</q-td>
            <q-td key="gender" :props="props" :title="props.row.gender">{{ props.row.gender|gender}}</q-td>
            <q-td key="displayName" :props="props">{{ props.row.displayName?props.row.displayName:'--'}}</q-td>
            <q-td key="class" :props="props">{{ props.row.classId?props.row.classId.name:'--'}}</q-td>
            <q-td key="status" :props="props">
              {{ props.row.status | userStatus}}
              <q-icon name="close" color="negative" v-if="props.row.status === 2"/>
              <q-icon name="close" color="negative" v-if="props.row.status === 0"/>
              <q-icon name="done" color="positive" v-if="props.row.status === 1"/>
            </q-td>
            <q-td key="mobilePhone" :props="props">{{ props.row.mobilePhone?props.row.mobilePhone:"--" }}</q-td>
            <q-td key="email" :props="props">{{ props.row.email?props.row.email:"--" }}</q-td>
            <q-td key="updatedAt" :props="props">{{ props.row.lastUpatedAt | formatDate}}</q-td>
            <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="primary" label="编辑" @click="modifyRow(props.row)" class="q-mr-sm"/>
                <!-- <q-btn push size="sm" color="positive" label="激活" @click="unlockAccount(props.row._id)" class="q-mr-sm" v-if="props.row.status !== 1"/> -->
                <!-- <q-btn push size="sm" color="negative" label="冻结" @click="lockAccount(props.row._id)" class="q-mr-sm" v-if="props.row.status !== 2"/> -->
                <!-- <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row)"  /> -->
              </div>
            </q-td>
          </q-tr>
          <!-- <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.userName }}.</div>
          </q-td>
        </q-tr> -->
        </template>
      </q-table>
    </div>
    <q-modal v-model="studentImportModal" class="">
    <div class="q-pa-md row flex-center">
        <div class="col input-box" style="maxWidth: 460px">
            <div class="row flex-center mar_10">
                <div class="col-3">
                    数据模板
                </div>
                  <div class="col-9">
                  <div><a v-bind:href="newTemplateFileURL">推荐模板(xlsx后缀, Excel 2007以后的默认格式)</a></div>
                    <div> <a v-bind:href="oldTemplateFileURL">旧格式模板(xls后缀, Excel 2003默认格式)</a></div>
                  </div>
            </div>
            <div class="row flex-center mar_10">
                <div class="col-3">
                    学生数据上传
                </div>
                 <div class="col-9">
                   <q-uploader id="uploader" ref="uploader" :url="''" class="text_white" float-label="选择文件后，点击导入按钮，开始上传"
                   :auto-expand="true" :multiple="false" :hide-upload-button="true" :clearable="true"
                   @add="file_selected" @remove:cancel="file_removed_before_upload"
                   extensions=".xls,.xlsx">
                </q-uploader>
                </div>
            </div>
            <q-btn color="primary" label="导入" @click="uploadStudentData"/>
        </div>
    </div>
</q-modal>
    <q-modal v-model="opened" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
          确定删除用户 <span class="text-negative">{{deleteUser ? deleteUser.name: null}}</span> ?
        </p>
        <q-btn-group flat class="q-pb-md q-pt-md float-right ">
          <q-btn
            color="faded"
            @click="opened=false"
            label="取消"
            class="q-mr-md round-borders"
          />
          <q-btn
            color="negative"
            @click="delConfirm"
            label="删除"
            class="round-borders"
          />
        </q-btn-group>
      </div>
    </q-modal>
     <q-modal v-model="deleteItem" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
          确定删除用户 <span class="text-negative">{{deleteUser ? deleteUser.name: null}}</span> ?
        </p>
        <q-btn-group flat class="q-pb-md q-pt-md float-right ">
          <q-btn
            color="faded"
            @click="opened=false"
            label="取消"
            class="q-mr-md round-borders"
          />
          <q-btn
            color="negative"
            @click="delConfirm"
            label="删除"
            class="round-borders"
          />
        </q-btn-group>
      </div>
    </q-modal>
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import showMessage from '../plugins/showMessage'
import { formatDate } from '../api/formData'
import { RoleType } from '../plugins/common'
import userAPI from '../api/user'
import request from '../api/request'

const emptyFileArray:File[] = []
export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['userList', 'serverData', 'operateData', 'userInfo', 'checkedOpers', 'handleOpers', 'currentUser'])
  },
  data () {
    return {
      studentImportModal: false,
      selected_files: emptyFileArray,
      enablePull: true,
      opened: false,
      tableData: [],
      tableLoading: false,
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      separator: 'horizontal',
      filter: '',
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: 'name',
          sortable: true
        },
        { name: 'id', required: true, align: 'left' },
        { name: 'displayName', align: 'left' },
        { name: 'node', align: 'left' },
        { name: 'userName', align: 'left' },
        { name: 'status', align: 'left' },
        { name: 'account', align: 'left' },
        { name: 'mobilePhone', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'email', align: 'left' },
        { name: 'event', align: 'left' },
        { name: 'class', align: 'left' },
        { name: 'gender', align: 'left' },
        { name: 'role', align: 'left' }
      ],
      selected: [],
      selectedIds: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      params: {},
      pullDone: null,
      uuid: '',
      classId: '',
      selectState: 0,
      optionList: [
        {
          label: '--选项--',
          value: 0
        },
        {
          label: '激活',
          value: 1
        },
        {
          label: '冻结',
          value: 2
        },
        {
          label: '删除',
          value: 3
        }
      ],
      isA: true,
      isB: false,
      deleteItem: false,
      newTemplateFileURL: request.defaults.baseURL + '/public/' + '导入学生数据的模板.xlsx',
      oldTemplateFileURL: request.defaults.baseURL + '/public/' + '导入学生数据的模板.xls'
    }
  },
  filters: {
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    roleType (data: number[]) {
      // console.log(data)
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
    },
    userStatus (data: number) {
      if (data === 0) {
        return '未审核'
      } else if (data === 1) {
        return '已激活'
      } else if (data === 2) {
        return '已冻结'
      } else {
        return '--'
      }
    },
    gender (data: number) {
      if (data === 0) {
        return '未知'
      } else if (data === 1) {
        return '男'
      } else if (data === 2) {
        return '女'
      } else {
        return '--'
      }
    }
  },
  watch: {
    selected: function (newName, oldName) {
      if (newName.length > 0) {
        this.isA = false
        this.isB = true
      } else {
        this.isA = true
        this.isB = false
      }
    },
    // userList: function (ul: any) {
    //   this.serverPagination.rowsNumber = ul ? ul.length : 0
    //   this.tableData = ul
    // },
    serverData: function (value) {
      if (!value) return
      if (value.msg !== 'OK') {
        showMessage(value.msg)
      }
      // console.log(value)
      this.selected = []
      if (value && value.data && value.data.deletedCount && value.data.deletedCount === 1) {
        this.serverPagination = {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        }
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          username: this.filter
        }
        this.$store.dispatch('getUserList', params)
      }
      if (value.data && value.data.nModified) {
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          username: this.filter
        }
        this.$store.dispatch('getUserList', params)
      }
      // this.$router.push('/user')
      if (!value.data.deletedCount) {
        let v = value.data
        this.tableLoading = false
        this.done()
        if (!v) return
        if (!v.errCode) {
          this.serverPagination.rowsNumber = v.count ? v.count : 0
          this.tableData = v.data
        }
      }
    },
    operateData: function (v) {
      if (!v || !v.data) return
      let res = v.data
      if (!res.errCode) {
        showMessage(v.tips + '，操作成功')
        this.reqConditions(false)
      }
      if (res.errCode === 1) {
        showMessage(v.tips + '，操作失败')
      }
      if (res.errCode === 2) {
        showMessage(v.tips + '，操作失败')
      }
      let type = res.errCode === 2 ? 'err' : 'info'
      if (res.msg) {
        setTimeout(() => {
          showMessage(res.msg, type)
        }, 1000)
      }
    }
  },
  beforeMount () {
    this.reqConditions()
    const uuid = window.localStorage.getItem('uuid')
    if (uuid) {
      this.uuid = uuid
    }
    // this.$store.dispatch('getFaceList', { offset: 10, limit: 20 })
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    file_selected (files: File[]) {
      Array.prototype.push.apply(this.selected_files, files)
    },
    file_removed_before_upload (file) {
      const fileIndex = this.selected_files.indexOf(file)
      if (fileIndex >= 0) {
        this.selected_files.splice(fileIndex, 1)
      }
    },
    uploadStudentData () {
      let files = this.selected_files
      if (files.length === 0) {
        showMessage('请选择需要上传的文件')
        return
      }
      let formData = new FormData()
      for (var i = 0; i <= files.length - 1; i++) {
        let file = files[i]
        formData.append('files[' + i + ']', file)
      }
      userAPI.uploadStudentData(formData)
        .then(this.uploadStudentDataCallback)
        .catch(err => {
          this.studentImportModal = false
          this.reqConditions()
          if (err && err.response && err.response.data) {
            const message = err.response.data || err.response.data.message
            if (message) {
              // showMessage(message)
            }
          } else if (err && err.message) {
            // showMessage(err.message)
          }
        })
    },
    uploadStudentDataCallback (response: any) {
      this.reqConditions()
      this.studentImportModal = false
      const uploader: any = this.$refs.uploader
      if (uploader.reset) {
        uploader.reset()
      }
      this.selected_files = []
    },
    pullToRefresh (done:any) {
      this.pullDone = done
      this.reqConditions()
    },
    done () {
      if (this.pullDone) {
        // let done = this.pullDone
        setTimeout(function () {
          // done()
        }, 200)
      }
    },
    toggleFullscreen (callback:any) {
      callback()
    },
    hideLoading () {
      setTimeout(() => {
        this.tableLoading = false
      }, 8000)
    },
    openStudentImportModal () {
      this.studentImportModal = true
    },
    mySort () {
      this.updatedAtDesc = !this.updatedAtDesc
      this.reqConditions()
    },
    request (props:any) {
      this.tableLoading = true
      this.serverPagination = props.pagination
      const params:any = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage
      }
      if (props.filter) {
        params.username = props.filter.replace(/_/g, '\\_')
      }
      // this.$socket.emit('getusers', params)
      // console.log(params)
      this.$store.dispatch('getUserList', params)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage
        }
        if (this.filter) {
          params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination.page = 1
        } else {
          params.offset = (this.serverPagination.page - 1) * this.serverPagination.rowsPerPage
        }
        // this.$socket.emit('getusers', params)
        // console.log(params)
        this.$store.dispatch('getUserList', params)
      }, 300)
      this.hideLoading()
    },
    lockAccount (id:string) {
      // console.log(id)
      if (id === this.uuid) {
        return showMessage('不可修改自身用户状态')
      }
      let params = {
        id: id,
        status: 2
      }
      // console.log(params)
      // this.$socket.emit('updateStateUser', params)
      this.$store.dispatch('updateUserState', params)
    },
    unlockAccount (id:string) {
      if (id === this.uuid) {
        return showMessage('不可修改自身用户状态')
      }
      let params = {
        id: id,
        status: 1
      }
      // this.$socket.emit('updateStateUser', params)
      this.$store.dispatch('updateUserState', params)
    },
    deleteAccount (user: any) {
      if (user._id === this.uuid) {
        showMessage('不可删除自己')
        return false
      }
      if (user.status === 1) {
        showMessage('该用户未冻结，不可删除')
      } else {
        this.opened = true
        this.deleteUser = user._id
        this.classId = user.classId
        // console.log(user)
      }
    },
    modifyRow (val: any) {
      // console.log('跳转用户编辑页面')
      this.$router.push({ name: 'editUser', params: { rowData: val } })
    },
    delConfirm () {
      if (this.deleteUser) {
        this.$store.dispatch('deleteUser', { id: this.deleteUser, classId: this.classId })
        this.opened = false
      } else if (this.params) {
        this.$store.dispatch('deleteManyUsers', this.params)
        this.opened = false
      }
      // this.$store.dispatch('deleteUser', { id: this.deleteUser._id })
      // this.$socket.emit('deleteUser', { id: this.deleteUser })
    },
    deleteMany () {
      if (this.selected.length <= 0) {
        return showMessage('请选择要删除的用户')
      } else {
        let _Ids: Array<any> = []
        let _classIds: Array<any> = []
        for (const i in this.selected) {
          const _data:any = this.selected[i]
          if (_data.status === 1) {
            return showMessage(_data.displayName + '未冻结，不可删除')
          }
          if (_data.classId) {
            _classIds.push({ classId: _data.classId._id, id: _data._id })
          }
          _Ids.push(_data._id)
        }
        this.opened = true
        const params = {
          ids: _Ids,
          classIds: _classIds
        }
        this.params = params
        // this.$store.dispatch('deleteManyUsers', params)
      }
    },
    lockMany () {
      if (this.selected.length <= 0) {
        return showMessage('请选择要冻结的用户')
      } else {
        let _Ids: Array<any> = []
        for (const i in this.selected) {
          const _data:any = this.selected[i]
          if (_data._id === this.uuid) {
            return showMessage('不可修改自身用户状态')
          }
          _Ids.push(_data._id)
        }
        const params = {
          ids: _Ids,
          status: 2
        }
        this.$store.dispatch('updateUserState', params)
        // this.$store.dispatch('deleteManyUsers', params)
      }
    },
    unlockMany () {
      if (this.selected.length <= 0) {
        return showMessage('请选择要激活的用户')
      } else {
        let _Ids: Array<any> = []
        for (const i in this.selected) {
          const _data:any = this.selected[i]
          if (_data._id === this.uuid) {
            return showMessage('不可修改自身用户状态')
          }
          _Ids.push(_data._id)
        }
        const params = {
          ids: _Ids,
          status: 1
        }
        this.$store.dispatch('updateUserState', params)
        // this.$store.dispatch('deleteManyUsers', params)
      }
    },
    isSuperAdmin (roleTypes: number) {
      return (roleTypes & RoleType.SuperAdmin) === RoleType.SuperAdmin
    },
    isSchoolAdmin (roleTypes: number) {
      return (roleTypes & RoleType.SchoolAdmin) === RoleType.SchoolAdmin
    },
    isCourseAdmin (roleTypes: number) {
      return (roleTypes & RoleType.CourseAdmin) === RoleType.CourseAdmin
    },
    isClassAdmin (roleTypes: number) {
      return (roleTypes & RoleType.ClassAdmin) === RoleType.ClassAdmin
    },
    isLabAdmin (roleTypes: number) {
      return (roleTypes & RoleType.LabAdmin) === RoleType.LabAdmin
    },
    isTeacher (roleTypes: number) {
      return (roleTypes & RoleType.Teacher) === RoleType.Teacher
    },
    isStudent (roleTypes: number) {
      return (roleTypes & RoleType.Student) === RoleType.Student
    }
  }
})
</script>
<style scope>
  .manyItem{
    color: #999;
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
  }
  .manyItem333{
    color: #333;
    font-size: 14px;
  }
</style>

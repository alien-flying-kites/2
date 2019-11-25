<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="课程列表" to="/allCourse"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-sm box">
      <q-table
        dense
        table-class="table-custom"
        ref="table"
        row-key="Id"
        selection="multiple"
        loading-label="努力加载中···"
        no-data-label="暂无数据"
        no-results-label="暂无匹配数据"
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
            placeholder="输入课程名搜索"
            v-model="filter"
          />
        </template>
        <template slot="top-left" slot-scope="props" v-if="isTeacher(currentUser.roleTypes)|| isSuperAdmin(currentUser.roleTypes)">
          <q-btn :props="props" color="primary"  label="新增课程" class="no-shadow" to="/addCourse"/>
        </template>
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
          <q-th key="id" >序号</q-th>
          <q-th key="role">课程名称</q-th>
          <q-th key="name">说明</q-th>
          <!-- <q-th key="status">课程管理员</q-th> -->
          <q-th key="registTime">更新时间</q-th>
          <q-th key="event">操作</q-th>
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="courseName" :props="props">{{ props.row.name? props.row.name:'--' }}</q-td>
            <q-td key="remark" :props="props" style="maxWidth:200px;word-wrap: break-word; white-space: pre-wrap">{{ props.row.description?props.row.description:'--'}}</q-td>
            <!-- <q-td key="teacherId" :props="props">{{ props.row.adminId?props.row.adminId.displayName:'--'}}</q-td> -->
            <q-td key="updatedAt" :props="props">{{ props.row.createdAt|formatDate }}</q-td>
            <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="primary" label="详情" @click="checkRow(props.row)" class="q-mr-sm"/>
                <q-btn push size="sm" color="positive" label="编辑" @click="editRow(props.row)" class="q-mr-sm"/>
                <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row)"  />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-modal v-model="opened" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
         删除该课程，则对应的全部班级以及课次也将全部删除，此操作不可逆，确定删除?
        </p>
        <q-btn-group flat class="q-pb-md q-pt-md float-right ">
          <q-btn
            color="negative"
            @click="delConfirm"
            label="删除"
            class="round-borders"
          />
            <q-btn
            color="faded"
            @click="opened=false"
            label="取消"
            class="q-mr-md round-borders"
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
// import axios from 'axios'
import { formatDate } from '../api/formData'
import { RoleType } from '../plugins/common'

export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['serverData', 'operateData', 'userInfo', 'checkedOpers', 'handleOpers', 'currentUser'])
  },
  data () {
    return {
      enablePull: true,
      fullScreen: false,
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
        { name: 'id', required: true, align: 'left' },
        { name: 'courseName', align: 'left' },
        { name: 'remark', align: 'left' },
        { name: 'teacherId', align: 'left' },
        { name: 'event', align: 'left' },
        { name: 'updatedAt', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null
    }
  },
  filters: {
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      // console.log(value)
      if (value[0] && value[0].deletedCount && value[0].deletedCount === 1) {
        this.serverPagination = {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        }
        const params = {
          id: this.uuid,
          offset: 0,
          limit: this.serverPagination.rowsPerPage
        }
        this.$store.dispatch('getCourseList', params)
      }
      if (value.msg && value.msg !== 'OK') {
        showMessage(value.msg)
      }
      // this.$router.replace('/allCourse')
      // this.$router.replace('/courseDetail')
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (!v.errCode) {
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
      }
      if (value.msg !== 'OK') {
        showMessage(v.msg, v.errCode)
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
  },
  mounted () {
  },
  beforeDestroy () {
    sessionStorage.removeItem('fsa')
  },
  methods: {
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
      this.fullScreen = !this.fullScreen
      // sessionStorage.setItem('fsa', this.fullScreen)
    },
    hideLoading () {
      setTimeout(() => {
        this.tableLoading = false
      }, 8000)
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
      // this.$socket.emit('getCourses', params)
      this.$store.dispatch('getCourseList', params)
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
        this.$store.dispatch('getCourseList', params)
        // this.$socket.emit('getCourses', params)
      }, 300)
      this.hideLoading()
    },
    lockAccount (id:string) {
      let content = {
        id: id,
        status: 1
      }
      this.$store.dispatch('modifyAccount', { type: 2, params: content })
    },
    editRow (val:string) {
      // this.$router.push('/courseDetail')
      this.$router.push({ name: 'editCourse', params: { rowData: val } })
    },
    deleteAccount (user: any) {
      this.opened = true
      this.deleteUser = user._id
    },
    checkRow (val: any) {
      localStorage.setItem('courseId', val._id)
      localStorage.setItem('courseName', val.name)
      this.$router.push({ name: 'courseDetail', params: { rowData: val } })
    },
    deleteRow () {
      if (this.selected.length < 1) {
        showMessage('请选择要删除的数据')
      } else {
        this.opened = true
      }
    },
    delConfirm () {
      this.opened = false
      this.$store.dispatch('deleteCourse', { id: this.deleteUser })
      // this.$socket.emit('deleteCourse', { id: this.deleteUser })
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
<style scoped>
.box{
  padding: 10px 15px;
}
</style>

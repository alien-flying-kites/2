<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <!-- <q-breadcrumbs>
        <q-breadcrumbs-el label="课次列表"/>
      </q-breadcrumbs> -->
      <q-breadcrumbs>
         <span class="title" @click="forward()"> 班级列表/</span>
         <span>课次列表</span>
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
        <!-- <template slot="top-left" slot-scope="props" v-if="isTeacher(currentUser.roleTypes) || isSuperAdmin(currentUser.roleTypes)">
          <q-btn :props="props" color="primary"  label="添加课次" class="no-shadow"  @click="addLesson()"/>
        </template> -->
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
          <q-th key="id" >序号</q-th>
          <q-th key="name">班级名称</q-th>
          <q-th key="teacher">授课人</q-th>
          <q-th key="classTime">上课日期</q-th>
          <q-th key="remark">上课时间</q-th>
          <q-th key="classPalce">上课地点</q-th>
          <q-th key="time">更新时间</q-th>
          <!-- <q-th key="remark">备注</q-th> -->
          <q-th key="event">操作</q-th>
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="name" :props="props">{{ props.row.classId.name }}</q-td>
            <q-td key="teacher" :props="props">{{ props.row.teacherId?props.row.teacherId.displayName:"--" }}</q-td>
            <q-td key="classTime" :props="props">{{ props.row.date|formatDate2 }}</q-td>
            <q-td key="remark" :props="props">{{ numberToTime(props.row.startTime)+'-'+numberToTime(props.row.endTime) }}</q-td>
            <q-td key="classPalce" :props="props">{{ props.row.labId?props.row.labId.name:"--" }}</q-td>
            <q-td key="time" :props="props">{{  props.row.lastUpatedAt | formatDate}}</q-td>
            <!-- <q-td key="remark" :props="props">{{ props.row.description||'--' }}</q-td> -->
            <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="positive" label="提交作业" @click="homework(props.row)" class="q-mr-sm"   v-if="isStudent(currentUser.roleTypes)"/>
                <q-btn push size="sm" color="positive" label="作业列表" @click="homeworkList(props.row)" class="q-mr-sm"   v-if="isTeacher(currentUser.roleTypes)"/>
                <q-btn push size="sm" color="primary" label="编辑" @click="modifyRow(props.row)" class="q-mr-sm"   v-if="isTeacher(currentUser.roleTypes)|| isSuperAdmin(currentUser.roleTypes)"/>
                <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row._id)"  class="q-mr-sm"   v-if="isTeacher(currentUser.roleTypes)|| isSuperAdmin(currentUser.roleTypes)" />
                <q-btn push size="sm" color="positive" label="详情" @click="checkDetail(props.row._id)"  />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-modal v-model="opened" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
          确定删除课次 ?
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
// import showMessage from '../plugins/showMessage'
// import axios from 'axios'

export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['serverData', 'operateData', 'checkedOpers', 'handleOpers', 'currentUser'])
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
        { name: 'name', align: 'left' },
        { name: 'class', align: 'left' },
        { name: 'teacher', align: 'left' },
        { name: 'classTeacher', align: 'left' },
        { name: 'startTime', align: 'left' },
        { name: 'classTime', align: 'left' },
        { name: 'classPalce', align: 'left' },
        { name: 'time', align: 'left' },
        { name: 'remark', align: 'left' },
        { name: 'num', align: 'left' },
        { name: 'limit', align: 'left' },
        { name: 'event', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null,
      uuid: '',
      courseName: '',
      rowData: {}
    }
  },
  filters: {
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    formatDate2 (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      // console.log(value)
      if (value && value.deletedCount && value.deletedCount === 1) {
        this.serverPagination = {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        }
        // this.$router.replace('/lessonList')
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          id: this.uuid
        }
        // console.log(params)
        this.$store.dispatch('getLessonList', params)
      }
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
      // this.$router.replace('/lessonList')
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (v.errCode !== 0) {
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
      }
      if (value.msg !== 'OK') {
        showMessage(value.msg, value.errCode)
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
    const id = window.localStorage.getItem('classId')
    if (id) {
      this.uuid = id
    }
    // const rowData = this.$route.params.rowData
    // if (rowData) {
    //   this.initData(rowData)
    // }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    numberToTime (num: number) {
      const integerPart = Math.floor(num)
      const digitPart = num - integerPart
      const minutes = digitPart * 60
      return integerPart.toString() + ':' + ('0' + minutes).slice(-2)
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
      this.fullScreen = !this.fullScreen
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
        limit: props.pagination.rowsPerPage,
        id: this.uuid
      }
      if (props.filter) {
        params.username = props.filter.replace(/_/g, '\\_')
      }
      // console.log(params)
      this.$store.dispatch('getLessonList', params)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          id: this.uuid
        }
        if (this.filter) {
          params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination.page = 1
        } else {
          params.offset = (this.serverPagination.page - 1) * this.serverPagination.rowsPerPage
        }
        // console.log(params)
        this.$store.dispatch('getLessonList', params)
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
    deleteAccount (user: any) {
      this.opened = true
      this.deleteUser = user
    },
    modifyRow (val: any) {
      this.$router.push({ name: 'editLesson', params: { rowData: val } })
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
      this.$store.dispatch('deleteLesson', { id: this.deleteUser })
      // this.$socket.emit('deleteLesson', { id: this.deleteUser })
    },
    addLesson () {
      this.$router.push('/addLesson')
    },
    checkDetail (data) {
      this.$router.push({ name: 'lessonDetail', params: { rowData: data } })
    },
    initData (val) {
      this.uuid = val._id
    },
    homework (data) {
      // console.log(data)
      this.$router.push({ name: 'submitHomework', params: { rowData: data } })
    },
    homeworkList (data) {
      // console.log(data)
      this.$router.push({ name: 'homeworkList', params: { rowData: data } })
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
    },
    forward () {
      this.$router.go(-1)
    }
  }
})
</script>
<style scoped>
.box{
  padding: 10px 15px;
}
.title{
  font-size: 16px;
  margin-right: 5px;
  margin-left: 10px;
  cursor: pointer;
  color: #027be3;
  font-weight: 700
}
</style>

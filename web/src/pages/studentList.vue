<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <q-breadcrumbs>
         <span class="title" @click="forward()"> 班级列表/</span>
         <span>学生列表</span>
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
        <!-- <template slot="top-right" slot-scope="props">
          <q-search :props="props" style="fontSize: 0.9rem"
            hide-underline
            placeholder="输入班级名搜索"
            v-model="filter"
          />
        </template> -->
        <template slot="top-left" slot-scope="props">
          <q-btn :props="props" color="primary"  label="添加学生" class="no-shadow" @click="addStudent()"/>
        </template>
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
          <q-th key="id" >序号</q-th>
          <q-th key="time">学生姓名</q-th>
          <!-- <q-th key="classteacher">班级管理员</q-th> -->
          <q-th key="event">操作</q-th>
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="time" :props="props">{{ props.row._id?props.row._id.displayName:'--' }}</q-td>
            <!-- <q-td key="classteacher" :props="props">{{ props.row.name?props.row.name:'--' }}</q-td> -->
            <q-td key="event" :props="props">
              <div>
                <!-- <q-btn push size="sm" color="positive" label="查看作业" @click="checkHomework(props.row)"  /> -->
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
          确定删除此学生?
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

export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['serverData', 'operateData', 'checkedOpers', 'handleOpers'])
  },
  data () {
    return {
      enablePull: true,
      fullScreen: false,
      opened: false,
      tableData: [],
      tableData1: [],
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
        { name: 'class', align: 'left' },
        { name: 'course', align: 'left' },
        { name: 'time', align: 'left' },
        { name: 'teacher', align: 'left' },
        { name: 'classteacher', align: 'left' },
        { name: 'num', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'list', align: 'left' },
        { name: 'event', align: 'left' },
        { name: 'role', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null,
      classid: '',
      students: [],
      class_id: '',
      studentLimit: 200,
      studentIds: 0
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
      if (value.msg !== 'OK') {
        showMessage(value.msg)
      }
      if (value.data.data) {
        this.studentIds = value.data.data.length
      }
      if (value.msg === '删除成功' && value.errCode === 0) {
        const params = {
          classid: this.classid,
          offset: 0,
          limit: this.serverPagination.rowsPerPage
        }
        this.$store.dispatch('getStudentList', params)
      }
      // this.$router.replace('/allClass')
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (value.errCode === 0) {
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
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
    const classId = window.localStorage.getItem('classId')
    if (classId) {
      this.classid = classId
    }
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    }
    // this.$store.dispatch('getFaceList', { offset: 10, limit: 20 })
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
        limit: props.pagination.rowsPerPage,
        classid: this.classid
      }
      if (props.filter) {
        params.username = props.filter.replace(/_/g, '\\_')
      }
      // this.$socket.emit('getClass', params)
      this.$store.dispatch('getStudentList', params)
      // this.$store.dispatch('getClass', params)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          classid: this.classid
        }
        if (this.filter) {
          params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination.page = 1
        } else {
          params.offset = (this.serverPagination.page - 1) * this.serverPagination.rowsPerPage
        }
        this.$store.dispatch('getStudentList', params)
        // this.$store.dispatch('getClass', params)
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
    unlockAccount (id:string) {
      let content = {
        id: id,
        status: 2
      }
      this.$store.dispatch('modifyAccount', { type: 2, params: content })
    },
    deleteAccount (user: any) {
      // console.log(user)
      this.opened = true
      this.deleteUser = user._id._id || user._id
    },
    modifyRow (val: any) {
      // this.$router.push('/editClass')
      this.$router.push({ name: 'editClass', params: { rowData: val } })
    },
    checkHomework (data) {
      console.log(data)
    },
    lessons (data) {
      localStorage.setItem('classId', data._id)
      localStorage.setItem('className', data.name)
      localStorage.setItem('courseId', data.courseId._id)
      this.$router.push({ name: 'lessonList', params: { rowData: data } })
    },
    checkStudent (data) {
      this.$router.push({ name: 'studentList', params: { rowData: data } })
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
      this.$store.dispatch('deleteClassStudent', { id: this.deleteUser, classId: this.classid })
    },
    addStudent () {
      if (this.studentLimit - this.studentIds <= 0) {
        return showMessage('此班级人数已满员,不可添加学生')
      }
      this.$router.push({ name: 'addStudent', params: { rowData: this.classid } })
    },
    initData (data) {
      // console.log(data)
      this.studentLimit = data.studentLimit || 200
      this.studentIds = data.studentIds.length || 0
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

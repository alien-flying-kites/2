<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
       <q-breadcrumbs>
        <q-breadcrumbs-el label="课程列表" to="/allCourse"/>
        <q-breadcrumbs-el label="课程详情(课程班列表)"/>
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
            placeholder="输入班级名搜索"
            v-model="filter"
          />
        </template>
        <template slot="top-left" slot-scope="props">
          <q-btn :props="props" color="primary"  label="添加课程班级" class="no-shadow"  @click="addCourseClass()" />
        </template>
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
          <q-th key="id" >序号</q-th>
          <q-th key="name">课程名称</q-th>
          <q-th key="class">班级名</q-th>
          <q-th key="teacher">任课老师</q-th>
          <!-- <q-th key="classTeacher">课程管理员</q-th> -->
          <!-- <q-th key="startTime">开课时间</q-th> -->
          <q-th key="limit">人数限制</q-th>
          <q-th key="time">创建时间</q-th>
          <q-th key="remark">备注</q-th>
          <q-th key="event">操作</q-th>
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="name" :props="props">{{ courseName }}</q-td>
            <q-td key="class" :props="props">{{ props.row.name?props.row.name:'--'}}</q-td>
            <q-td key="teacher" :props="props">{{ props.row.teacherId?props.row.teacherId.displayName:"--" }}</q-td>
            <!-- <q-td key="classTeacher" :props="props">{{  props.row.adminId?props.row.adminId.displayName:'--' }}</q-td> -->
            <!-- <q-td key="startTime" :props="props">{{ props.row.dateToOpenClass| formatDate }}</!-->
            <q-td key="limit" :props="props">{{ props.row.studentLimit||'--' }}</q-td>
            <q-td key="time" :props="props">{{  props.row.lastUpatedAt | formatDate}}</q-td>
            <q-td key="remark" :props="props">{{ props.row.description||'--' }}</q-td>
            <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="primary" label="编辑" @click="modifyRow(props.row)" class="q-mr-sm"/>
                <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row._id)"  />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-modal v-model="opened" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
          删除该班级，则对应的全部课次也将全部删除，确定删除?
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
// import { constants } from 'crypto';

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
      courseName: ''
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
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
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
        this.$store.dispatch('getCourseDetail', params)
      }
      this.$router.replace('/courseDetail')
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (v.errCode !== 0) {
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
      }
      if (v.msg) {
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
    const courseId = window.localStorage.getItem('courseId')
    const courseName = window.localStorage.getItem('courseName')
    if (courseId) {
      this.uuid = courseId
    }
    if (courseName) {
      this.courseName = courseName
    }
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
        id: this.uuid
      }
      if (props.filter) {
        params.username = props.filter.replace(/_/g, '\\_')
      }
      // this.$socket.emit('getCourseDetail', params)
      this.$store.dispatch('getCourseDetail', params)
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
        // this.$socket.emit('getCourseDetail', params)
        this.$store.dispatch('getCourseDetail', params)
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
      this.$router.push({ name: 'editCourseDetail', params: { rowData: val } })
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
      this.$store.dispatch('deleteCourseDetail', { id: this.deleteUser })
      // this.$socket.emit('deleteCourseDetail', { id: this.deleteUser })
    },
    addCourseClass () {
      if (this.uuid) {
        this.$router.push({ name: 'addCourseClass', params: { rowData: this.uuid } })
      }
    }
  }
})
</script>
<style scoped>
.box{
  padding: 10px 15px;
}
</style>

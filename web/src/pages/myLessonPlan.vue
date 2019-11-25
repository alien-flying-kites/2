<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="教案列表" />
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
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
          <q-th key="id" >序号</q-th>
          <q-th key="roleName">课程名称</q-th>
          <q-th key="type">班级名称</q-th>
          <q-th key="time">课次时间</q-th>
          <q-th key="role">文件类型</q-th>
          <q-th key="status">教案简介</q-th>
          <q-th key="mobilePhone">授课人</q-th>
          <q-th key="email">文件地址</q-th>
          <!-- <q-th key="updatedAt">创建时间</q-th> -->
          <!-- <q-th key="event">操作</q-th> -->
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="roleName" :props="props">{{ props.row.courseId? props.row.courseId.name:'--' }}</q-td>
            <q-td key="type" :props="props">{{ props.row.classId?props.row.classId.name:'--' }}</q-td>
            <q-td key="time" :props="props">{{ props.row.time|formatDate}}</q-td>
            <q-td key="role" :props="props">{{ props.row.materialItemType|materialItemType}}</q-td>
            <q-td key="status" :props="props" style="maxWidth:200px;word-wrap: break-word; white-space: pre-wrap">{{ props.row.description?props.row.description:'--'}}</q-td>
            <q-td key="mobilePhone" :props="props">{{ props.row.teacherId?props.row.teacherId.displayName:"--" }}</q-td>
            <q-td key="email" :props="props"><span v-html="fileListToLinks(props.row.fileList)"></span></q-td>
            <!-- <q-td key="updatedAt" :props="props">{{ props.row.lastUpatedAt||'--' }}</q-td> -->
            <!-- <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="primary" label="查看" @click="modifyRow(props.row)" class="q-mr-sm"/>
                <q-btn push size="sm" color="negative" label="推送" @click="lockAccount(props.row.Id)" class="q-mr-sm"/>
                <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row)"  />
              </div>
            </q-td> -->
          </q-tr>
        </template>
      </q-table>
    </div>
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
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import showMessage from '../plugins/showMessage'
import request from '../api/request'
import { formatDate } from '../api/formData'

export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['serverData', 'operateData', 'userInfo', 'checkedOpers', 'handleOpers'])
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
        { name: 'roleName', align: 'left' },
        { name: 'role', align: 'left' },
        { name: 'node', align: 'left' },
        { name: 'time', align: 'left' },
        { name: 'userName', align: 'left' },
        { name: 'status', align: 'left' },
        { name: 'account', align: 'left' },
        { name: 'mobilePhone', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'email', align: 'left' },
        { name: 'event', align: 'left' },
        { name: 'type', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null
    }
  },
  filters: {
    materialItemType (type:any) {
      if (type === 1) {
        return '教案'
      } else if (type === 2) {
        return '示例代码'
      } else if (type === 3) {
        return '作业'
      }
    },
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      // console.log(value)
      // if (!value || value.code !== 1000) return
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (!v.errCode) {
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
        // console.log(this.tableData)
      }
      if (value.msg !== 'OK') {
        showMessage(value.msg)
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
    // this.$store.dispatch('getFaceList', { offset: 10, limit: 20 })
  },
  mounted () {
    if (localStorage.getItem('uuid') != null) {
      const uuid = window.localStorage.getItem('uuid')
      if (uuid) {
        this.uuid = uuid
      }
    }
    // this.uuid = window.localStorage.getItem('uuid')
  },
  beforeDestroy () {
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
      const params = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage,
        id: this.uuid
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      if (params.id) {
        this.$store.dispatch('getMyLessonPlan', params)
        this.hideLoading()
      } else {
      }
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          id: this.uuid
        }
        if (this.filter) {
          // params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination.page = 1
        } else {
          params.offset = (this.serverPagination.page - 1) * this.serverPagination.rowsPerPage
        }
        this.$store.dispatch('getMyLessonPlan', params)
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
      this.opened = true
      this.deleteUser = user
    },
    modifyRow (val: any) {
      // this.$router.push('/editUser')
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
      // this.$store.dispatch('deleteAccount', { id: this.deleteUser.Id })
    },
    fileListToLinks (fileList: string[]) {
      // console.log(fileList)
      if (fileList) {
        let html = ''
        for (let filePath of fileList) {
          const fileNameMatch = /([^\\]+)$/.exec(filePath)
          if (fileNameMatch) {
            html += ('<a href="' + request.defaults.baseURL + '/' + filePath + '">' + fileNameMatch[1] + '</a><br/>')
          }
        }
        // console.log(html)
        return html
      } else {
        return '--'
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

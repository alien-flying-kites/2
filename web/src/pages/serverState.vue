<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="服务器连接状态" />
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
        @request="request"
        :filter="filter"
        :separator="separator"
        :data="tableData"
        :columns="columns"
        :selected.sync="selected"
        :loading="tableLoading"
        :pagination.sync="serverPagination"
      >
        <template slot="top-left" slot-scope="props">
          <q-btn :props="props" color="primary"  label="刷新" class="no-shadow" @click="refresh()"/>
        </template>
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
            <q-th key="id" >序号</q-th>
            <q-th key="role">Ip地址</q-th>
            <q-th key="class">版本号</q-th>
            <q-th key="teacher">上次连接时间</q-th>
            <q-th key="state">连接状态</q-th>
          </q-tr>
        </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="role" :props="props">{{ props.row.ip }}</q-td>
            <q-td key="course" :props="props">{{ props.row.content.version }}</q-td>
            <q-td key="teacher" :props="props">{{ props.row.createdAt|formatDate }}</q-td>
            <q-td key="state" :props="props">{{ props.row.content.type }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import showMessage from '../plugins/showMessage'
import { formatDate } from '../api/formData'
// import { date } from 'quasar'
// const tableData = new Array()
let tableData: Array<any> = []
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
      tableData,
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
        { name: 'state', align: 'left' },
        { name: 'role', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null,
      arr: []
    }
  },
  filters: {
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
      let v = value.data
      this.tableLoading = false
      if (!v) return
      if (value.errCode === 0) {
        if (!this.tableData) {
          return
        }
        if (v instanceof Array === false) {
          return false
        }
        if (v.length > 0) {
          console.log(v)
          this.serverPagination.rowsNumber = v.length ? v.length : 0
          this.tableData = v
          for (const i in this.tableData) {
            this.tableData[i].ip = this.tableData[i].ip.slice(7, 100)
            if (!this.tableData[i].content) return
            this.tableData[i].content = JSON.parse(this.tableData[i].content)
            let _time:any = new Date()
            _time = _time.getTime()
            this.tableData[i].createdAt = Date.parse(this.tableData[i].createdAt)
            const _aa = _time - this.tableData[i].createdAt
            if (_aa > 30000 && _aa <= 60000) {
              this.tableData[i].content.type = '断开连接'
            } else if (_aa <= 30000 && _aa > 0) {
              this.tableData[i].content.type = '已连接'
            } else if (_aa > 60000) {
              const params = {
                id: this.tableData[i]._id
              }
              this.$store.dispatch('deleteServerState', params)
              this.tableData[i].content.type = '已离线'
            }
          }
        }
      }
      // if (value.msg !== 'OK') {
      //   showMessage(v.msg, v.errCode)
      // }
    }
    // operateData: function (v) {
    //   if (!v || !v.data) return
    //   let res = v.data
    //   if (!res.errCode) {
    //     showMessage(v.tips + '，操作成功')
    //     this.reqConditions(false)
    //   }
    //   if (res.errCode === 1) {
    //     showMessage(v.tips + '，操作失败')
    //   }
    //   if (res.errCode === 2) {
    //     showMessage(v.tips + '，操作失败')
    //   }
    //   let type = res.errCode === 2 ? 'err' : 'info'
    //   if (res.msg) {
    //     setTimeout(() => {
    //       showMessage(res.msg, type)
    //     }, 1000)
    //   }
    // }
  },
  beforeMount () {
    this.reqConditions()
  },
  mounted () {
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
      const params:any = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage
      }
      if (props.filter) {
        params.username = props.filter.replace(/_/g, '\\_')
      }
      // this.$socket.emit('getClass', params)
      this.$store.dispatch('serverState', params)
      // this.$store.dispatch('getClass', params)
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
        this.$store.dispatch('serverState', params)
        // this.$store.dispatch('getClass', params)
      }, 300)
      this.hideLoading()
    },
    refresh () {
      const params:any = {
        offset: 0,
        limit: this.serverPagination.rowsPerPage
      }
      this.$store.dispatch('serverState', params)
    }
  }
})
</script>
<style scoped>
.box{
  padding: 10px 15px;
}
</style>

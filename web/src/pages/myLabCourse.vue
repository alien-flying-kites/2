<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="我的实验室" to="/myLabCourse"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-sm">
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
            placeholder="输入搜索内容"
            v-model="filter"
          />
        </template> -->
        <!-- <template slot="top-left" slot-scope="props">
          <q-btn :props="props" color="primary" to="/addUser" label="新增用户" class="no-shadow"/>
        </template> -->
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
          <q-th key="id" >序号</q-th>
          <q-th key="name">实验室名称</q-th>
          <q-th key="status">管理人</q-th>
          <q-th key="phoneNumber">实验室地址</q-th>
          <!-- <q-th key="remarks">邮箱</q-th> -->
          <q-th key="registTime">更新时间</q-th>
          <q-th key="event">操作</q-th>
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="userName" :props="props">{{ props.row.name? props.row.name:'--' }}</q-td>
            <q-td key="status" :props="props">{{ props.row.adminId? props.row.adminId.displayName:'--' }}</q-td>
            <q-td key="mobilePhone" :props="props">{{ props.row.location?props.row.location:"--" }}</q-td>
            <!-- <q-td key="email" :props="props">{{ props.row.email?props.row.email:"--" }}</q-td> -->
            <q-td key="updatedAt" :props="props">{{ props.row.lastUpatedAt | formatDate }}</q-td>
            <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="primary" label="查看" @click="checkRow(props.row)" class="q-mr-sm"/>
                <!-- <q-btn push size="sm" color="positive" label="解冻" @click="unlockAccount(props.row.Id)" class="q-mr-sm" v-if="props.row.isActive==false"/>
                <q-btn push size="sm" color="negative" label="冻结" @click="lockAccount(props.row.Id)" class="q-mr-sm" v-if="props.row.isActive==true"/>
                <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row)"  /> -->
              </div>
            </q-td>
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
     <q-modal v-model="check" class="" maximized >
      <div class="q-pa-lg">
         <q-btn
         style="float:right"
            color="faded"
            @click="check=false"
            label="关闭"
            class="q-mr-md round-borders"
          />
         <img alt="Quasar logo" src="~assets/20190403145258.png">
         <img alt="Quasar logo" src="~assets/20190403145420.png">
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
        { name: 'role', align: 'left' },
        { name: 'node', align: 'left' },
        { name: 'userName', align: 'left' },
        { name: 'status', align: 'left' },
        { name: 'account', align: 'left' },
        { name: 'mobilePhone', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'email', align: 'left' },
        { name: 'event', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null,
      uuid: '',
      check: false
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
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (v) {
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
      }
      if (v.msg) {
        showMessage(v.msg, v.errCode)
      }
      if (!value) return
      console.log(value)
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
    const uuid = window.localStorage.getItem('uuid')
    if (uuid) {
      this.uuid = uuid
    }
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
        status: this.userStatus,
        id: this.uuid
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      console.log(params)
      this.$store.dispatch('getMylab', params)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params = {
          offset: 0,
          status: this.userStatus,
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
        console.log(params)
        this.$store.dispatch('getMylab', params)
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
    checkRow (val: any) {
      this.check = true
    }
  }
})
</script>
<style>

</style>

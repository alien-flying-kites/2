<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <!-- <q-breadcrumbs>
        <q-breadcrumbs-el label="添加学生"/>
      </q-breadcrumbs> -->
      <q-breadcrumbs>
        <span class="title" @click="forward()"> 学生列表/</span>
        <span>添加学生</span>
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
            placeholder="输入学生姓名进行搜索"
            v-model="filter"
          />
        </template>
        <template slot="top-left" slot-scope="props">
          <q-btn :props="props" color="primary" label="确认添加" @click="addAccount()" class="no-shadow"/>
          <!-- <div class="manyItem333"> &nbsp;筛选班级 &nbsp;</div>
          <q-select color="white"
            inverted
            separator
            style="minWidth:100px"
            v-model="class2Name"
            :options="class2OptionList"
            class="text_white manyItem333"
          /> -->
        </template>
        <q-tr slot="header" slot-scope="props" style="fontSize: 0.9rem">
          <q-th auto-width >
            <q-checkbox
              v-if="props.multipleSelect"
              v-model="props.selected"
              indeterminate-value="some"
            />
          </q-th>
          <q-th key="id" style="text-align:center">Id</q-th>
          <q-th key="name">显示名</q-th>
          <q-th key="class"><q-select color="white"
            inverted
            separator
            v-model="class2Name"
            :options="class2OptionList1"
            class="text_white boxShadow"
          /></q-th>
          <q-th key="status">用户状态</q-th>
        </q-tr>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox color="primary" v-model="props.selected" />
            </q-td>
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="displayName" :props="props">{{ props.row.displayName?props.row.displayName:'--'}}</q-td>
            <q-td key="class" :props="props">{{ props.row.classId?props.row.classId.name:'--'}}</q-td>
            <q-td key="status" :props="props">
              {{ props.row.status | userStatus}}
              <q-icon name="close" color="negative" v-if="props.row.status === 2"/>
              <q-icon name="close" color="negative" v-if="props.row.status === 0"/>
              <q-icon name="done" color="positive" v-if="props.row.status === 1"/>
            </q-td>
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
let selected: Array<any> = []
const emptyFileArray:File[] = []
export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['userList', 'serverData', 'operateData', 'class2OptionList1', 'classList', 'handleOpers', 'currentUser'])
  },
  data () {
    return {
      studentImportModal: false,
      selected_files: emptyFileArray,
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
        { name: 'id', required: true, align: 'center' },
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
        { name: 'role', align: 'left' }
      ],
      selected,
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
      class2Name: ''
    }
  },
  filters: {
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    roleType (data: number[]) {
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
    }
  },
  watch: {
    selected: {
      handler (newName, oldName) {
        if (newName.length > 0) {
          this.isA = false
          this.isB = true
        } else {
          this.isA = true
          this.isB = false
        }
      }
    },
    class2Name: function (val) {
      // console.log(val)
      const params:any = {
        offset: 0,
        limit: this.serverPagination.rowsPerPage,
        username: this.filter,
        class2Name: val
      }
      this.$store.dispatch('getAddStudentList', params)
    },
    // userList: function (ul: any) {
    //   this.serverPagination.rowsNumber = ul ? ul.length : 0
    //   this.tableData = ul
    // },
    serverData: function (value) {
      // console.log(value)
      if (!value) return
      if (value.msg !== 'OK') {
        showMessage(value.msg)
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          username: this.filter,
          class2Name: this.class2Name
        }
        this.$store.dispatch('getAddStudentList', params)
      }
      //  let v = value.data
      if (value.msg === '添加成功') {
        this.$router.replace('/studentList')
      }
      // this.$router.push('/user')
      if (!value.data.deletedCount) {
        let v = value.data
        this.tableLoading = false
        this.done()
        if (!v) return
        if (!v.errCode) {
          this.selected = []
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
    this.$socket.emit('class2OptionList')
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    } else {
      this.$router.replace('/studentList')
    }
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
    addAccount () {
      if (this.selected.length <= 0) {
        return showMessage('请选择学生')
      } else {
        const content = {
          classId: this.classId,
          stutdents: this.selected
        }
        // console.log(content)
        this.$store.dispatch('addClassStudent', content)
      }
    },
    initData (data) {
      console.log(data)
      this.classId = data
      // const content = {
      //   id: this.classId
      // }
      // console.log(content)
      // this.$store.dispatch('classDetail', content)
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
      // sessionStorage.setItem('fsa', this.fullScreen)
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
        limit: props.pagination.rowsPerPage,
        class2Name: this.class2Name
      }
      if (props.filter) {
        params.username = props.filter.replace(/_/g, '\\_')
      }
      // this.$socket.emit('getusers', params)
      // console.log(params)
      this.$store.dispatch('getAddStudentList', params)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          class2Name: this.class2Name
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
        this.$store.dispatch('getAddStudentList', params)
      }, 300)
      this.hideLoading()
    },
    forward () {
      this.$router.go(-1)
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
  .boxShadow{
    box-shadow: none;
    font-size: 14px;
    max-width: 150px;
  }
</style>

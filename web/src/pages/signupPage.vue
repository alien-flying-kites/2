<template>
  <q-page class="">
     <q-tabs v-model="selectedTab">
      <!-- 选项卡 - 注意slot="title" -->
      <q-tab  slot="title" name="tab-1" icon="message" label="我的选课" />
      <q-tab  slot="title" name="tab-2" icon="fingerprint" label="报名列表"/>
      <q-tab-pane name="tab-1">
        <div class="q-pa-sm q-mt-sm q-ml-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="我的选课" to="/mySelection"/>
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
            @request="request1"
            :rows-per-page-options="[3,5,10,20]"
            :filter="filter1"
            :separator="separator1"
            :data="tableData1"
            :columns="columns1"
            :selected.sync="selected1"
            :loading="tableLoading1"
            :pagination.sync="serverPagination1"
          >
            <template slot="header" slot-scope="props">
              <q-tr :props="props"  style="fontSize: 0.9rem">
              <q-th key="id" >序号</q-th>
              <q-th key="class">班级</q-th>
              <q-th key="student">报名人</q-th>
              <q-th key="isadjust">是否同意调剂</q-th>
              <q-th key="state">审核状态</q-th>
              <q-th key="adjust">调剂班级</q-th>
              <q-th key="updatedAt">更新时间</q-th>
              <q-th key="event">操作</q-th>
            </q-tr>
            </template>
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
                <q-td key="class" :props="props">{{ props.row.classId? props.row.classId.name:'--' }}</q-td>
                <q-td key="student" :props="props">{{ props.row.studentId? props.row.studentId.displayName:'--' }}</q-td>
                <q-td key="isadjust" :props="props"  color="negative">
                  {{ props.row.acceptClassAdjustment | isAdjust}}
                </q-td>
                <q-td key="state" :props="props"  color="negative">
                  {{ props.row.approvalState | userStatus}}
                </q-td>
                <q-td key="adjust" :props="props">{{ props.row.adjustedClassId? props.row.adjustedClassId.name:'--' }}</q-td>
                <q-td key="updatedAt" :props="props">{{ props.row.lastUpatedAt|formatDate }}</q-td>
                <q-td key="event" :props="props" >
                  <div>
                  <!-- <q-btn push size="sm" v-if="props.row.approvalState ===2||props.row.approvalState===4" color="primary" label="课次详情" @click="modifyRow(props.row)"/> -->
                  <q-btn push size="sm" color="primary" label="取消报名" @click="deleteAccount(props.row)"/>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <q-modal v-model="opened1" class="" minimized>
          <div class="q-pa-lg">
            <p class="text-tertiary">
              确定取消报名?
            </p>
            <q-btn-group flat class="q-pb-md q-pt-md float-right ">
              <q-btn
                color="faded"
                @click="opened1=false"
                label="取消"
                class="q-mr-md round-borders"
              />
              <q-btn
                color="negative"
                @click="delConfirm1"
                label="确定"
                class="round-borders"
              />
            </q-btn-group>
          </div>
        </q-modal>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <div class="q-pa-sm q-mt-sm q-ml-sm ">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="报名列表" to="/signup"/>
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
                placeholder="输入用户名搜索"
                v-model="filter"
              />
            </template> -->
            <!-- <template slot="top-left" slot-scope="props">
              <q-btn :props="props" color="primary"  label="添加班级" class="no-shadow"/>
            </template> -->
            <template slot="header" slot-scope="props">
              <q-tr :props="props"  style="fontSize: 0.9rem">
              <q-th key="id" >Id</q-th>
              <q-th key="role">班级名称</q-th>
              <q-th key="name">所学课程</q-th>
              <!-- <q-th key="status">上课时间</q-th> -->
              <q-th key="phoneNumber">任课老师</q-th>
              <!-- <q-th key="remarks">负责老师</q-th> -->
              <q-th key="registTime">创建时间</q-th>
              <q-th key="num">剩余名额</q-th>
              <q-th key="event">操作</q-th>
            </q-tr>
            </template>
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
                <q-td key="class" :props="props">{{ props.row.name||'--' }}</q-td>
                <q-td key="course" :props="props">{{ props.row.courseId?props.row.courseId.name:'--' }}</q-td>
                <!-- <q-td key="time" :props="props">{{ props.row.studyTime?(props.row.studyTime) : '--' }}</q-td> -->
                <q-td key="teacher" :props="props">{{ props.row.teacherId?props.row.teacherId.displayName:'--' }}</q-td>
                <!-- <q-td key="classteacher" :props="props">{{ props.row.adminId?props.row.adminId.displayName:'--' }}</q-td> -->
                <q-td key="updatedAt" :props="props">{{ props.row.createdAt | formatDate }}</q-td>
                <q-td key="num" :props="props">{{ (props.row.studentLimit) - (props.row.studentIds.length) }}</q-td>
                <q-td key="event" :props="props">
                  <div>
                    <q-btn push size="sm" color="positive" label="报名" @click="signup(props.row)" class="q-mr-sm"/>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <q-modal v-model="opened" class="" minimized>
          <div class="q-pa-lg">
            <!-- <p class="text-tertiary">
              确定删除用户 <span class="text-negative">{{deleteUser ? deleteUser.name: null}}</span> ?
            </p> -->
            <div class="row flex-center">
              <div class="col-3">是否同意调剂 </div>
              <q-select
                inverted
                separator
                v-model="isTiaoji"
                :options="optionList"
                class="col-9 text_white"
                color="white"
              />
            </div>
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
                label="确认报名"
                class="round-borders"
              />
            </q-btn-group>
          </div>
        </q-modal>
      </q-tab-pane>
    </q-tabs>
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
    ...mapGetters(['serverData', 'operateData', 'classList', 'checkedOpers', 'handleOpers'])
  },
  data () {
    return {
      opened: false,
      opened1: false,
      tableData1: [],
      tableLoading1: false,
      serverPagination1: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      separator1: 'horizontal',
      filter1: '',
      enablePull: true,
      fullScreen: false,
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
        { name: 'class', align: 'left' },
        { name: 'course', align: 'left' },
        { name: 'time', align: 'left' },
        { name: 'teacher', align: 'left' },
        { name: 'classteacher', align: 'left' },
        { name: 'num', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'list', align: 'left' },
        { name: 'event', align: 'left' }
      ],
      columns1: [
        { name: 'id', required: true, align: 'left' },
        { name: 'role', align: 'left' },
        { name: 'class', align: 'left' },
        { name: 'student', align: 'left' },
        { name: 'status', align: 'left' },
        { name: 'account', align: 'left' },
        { name: 'adjust', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'state', align: 'left' },
        { name: 'isadjust', align: 'left' },
        { name: 'event', align: 'left' }
      ],
      selected: [],
      selected1: [],
      updatedAtDesc: true,
      userStatus: -1,
      info: {},
      isTiaoji: null,
      pullDone: null,
      showing: false,
      selectedTab: 'tab-2',
      optionList: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    }
  },
  filters: {
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    isAdjust (state:Boolean) {
      if (state) {
        return '是'
      } else {
        return '否'
      }
    },
    userStatus (data: number) {
      if (data === 1) {
        return '未审核'
      } else if (data === 2) {
        return '审核通过'
      } else if (data === 3) {
        return '已拒绝'
      } else if (data === 4) {
        return '已调剂'
      } else {
        return '--'
      }
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) {
        return false
      }
      console.log(value)
      console.log(value.type)
      if (value.type === 1) {
        this.tableLoading1 = false
        let v = value.data
        this.serverPagination1.rowsNumber = v.count ? v.count : 0
        this.tableData1 = v.data
        if (v.deletedCount && v.deletedCount === 1) {
          const params = {
            offset: 0,
            status: this.userStatus,
            limit: this.serverPagination1.rowsPerPage,
            id: this.uuid
          }
          console.log(params)
          this.$store.dispatch('getMyChooseClass', params)
        }
      }
      // console.log(value)
      if (value && value._id) {
        showMessage('报名成功')
      }
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (!value.type) {
        console.log('2')
        if (!v.errCode) {
          this.serverPagination.rowsNumber = v.count ? v.count : 0
          this.tableData = v.data
        }
      }
      if (value && value._id) {
        showMessage('报名成功')
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
    },
    selectedTab: function (val) {
      // console.log(val)
      if (val === 'tab-1') {
        // console.log('1111111')
        this.serverPagination1.page = 1
        const params = {
          offset: 0,
          status: this.userStatus,
          limit: this.serverPagination.rowsPerPage,
          id: this.uuid
        }
        // console.log(params)
        this.$store.dispatch('getMyChooseClass', params)
      } else if (val === 'tab-2') {
        // console.log('22222')
      }
    }
  },
  beforeMount () {
    this.reqConditions1()
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
    sessionStorage.removeItem('fsa')
  },
  methods: {
    pullToRefresh (done:any) {
      this.pullDone = done
      this.reqConditions()
      this.reqConditions1()
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
      this.reqConditions1()
      this.reqConditions()
    },
    request1 (props:any) {
      this.tableLoading1 = true
      this.serverPagination1 = props.pagination
      const params = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage,
        status: this.userStatus,
        id: this.uuid
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      // console.log(params)
      if (params.id) {
        this.$store.dispatch('getMyChooseClass', params)
        this.hideLoading()
      } else {
      }
      // this.$store.dispatch('getMyChooseClass', params)
      // this.hideLoading()
    },
    request (props:any) {
      this.tableLoading = true
      this.serverPagination = props.pagination
      const params = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage,
        status: this.userStatus
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      this.$socket.emit('signUpClassIndex', params)
      this.hideLoading()
    },
    reqConditions1 (initPageIndex = true) {
      this.tableLoading1 = true
      setTimeout(() => {
        const params = {
          offset: 0,
          status: this.userStatus,
          limit: this.serverPagination1.rowsPerPage,
          id: this.uuid
        }
        if (this.filter) {
          // params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination1.page = 1
        } else {
          params.offset = (this.serverPagination1.page - 1) * this.serverPagination1.rowsPerPage
        }
        // console.log(params)
        this.$store.dispatch('getMyChooseClass', params)
      }, 300)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params = {
          offset: 0,
          status: this.userStatus,
          limit: this.serverPagination.rowsPerPage
        }
        if (this.filter) {
          // params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination.page = 1
        } else {
          params.offset = (this.serverPagination.page - 1) * this.serverPagination.rowsPerPage
        }
        this.$socket.emit('signUpClassIndex', params)
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
      if (user.approvalState === 1) {
        this.opened1 = true
        this.deleteUser = user._id
      } else {
        return showMessage('报名结果已被审核，不可取消操作')
      }
    },
    delConfirm1 () {
      this.opened1 = false
      // console.log(this.deleteUser)
      this.$store.dispatch('deleteMyChooseClass', { id: this.deleteUser })
    },
    signup (val: any) {
      // console.log(val)
      if (val.studentLimit - val.studentIds.length <= 0) {
        return showMessage('此班级人数已满员')
      } else {
        // console.log(val.studentLimit - val.studentIds.length)
        this.opened = true
        this.info = {
          teacherId: val.teacherId ? val.teacherId._id : Object,
          classId: val._id,
          studentId: window.localStorage.getItem('uuid'),
          approvalState: 1,
          acceptClassAdjustment: this.isTiaoji
        }
      }
    },
    checkRow () {
      this.$router.push('/editUser')
    },
    deleteRow () {
      if (this.selected.length < 1) {
        showMessage('请选择要删除的数据')
      } else {
        this.opened = true
      }
    },
    delConfirm () {
      if (this.isTiaoji === null) {
        showMessage('请选择是否调剂')
        return false
      } else {
        this.opened = false
        this.$set(this.info, 'acceptClassAdjustment', this.isTiaoji)
        const params = this.info
        this.$store.dispatch('singup', params)
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

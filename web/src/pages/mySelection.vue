<template>
  <q-page class="">
     <q-tabs v-model="selectedTab">
      <!-- 选项卡 - 注意slot="title" -->
      <!-- <q-tab  slot="title" name="tab-1" icon="message" label="选课报名" /> -->
      <q-tab  slot="title" name="tab-2" icon="fingerprint" label="课程班级"/>
      <q-tab  slot="title" name="tab-3" icon="account_box" label="学籍班级"/>
      <!-- 目标 -->
      <!-- <q-tab-pane name="tab-1">
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
              <q-th key="id" >Id</q-th>
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
                  <q-btn push size="sm" v-if="props.row.approvalState ===2||props.row.approvalState===4" color="primary" label="课次详情" @click="modifyRow(props.row)"/>
                  <q-btn push size="sm" color="primary" label="取消报名" @click="deleteAccount(props.row)"/>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <q-modal v-model="opened" class="" minimized>
          <div class="q-pa-lg">
            <p class="text-tertiary">
              确定取消报名?
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
                label="确定"
                class="round-borders"
              />
            </q-btn-group>
          </div>
        </q-modal>
      </q-tab-pane> -->
      <q-tab-pane name="tab-2">
         <div class="q-pa-sm q-mt-sm q-ml-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="我的课程班级" />
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
            @request="request2"
            :rows-per-page-options="[3,5,10,20]"
            :filter="filter2"
            :separator="separator2"
            :data="tableData2"
            :columns="columns2"
            :selected.sync="selected2"
            :loading="tableLoading2"
            :pagination.sync="serverPagination2"
          >
            <template slot="header" slot-scope="props">
              <q-tr :props="props"  style="fontSize: 0.9rem">
              <q-th key="id" >序号</q-th>
              <q-th key="class">班级</q-th>
              <!-- <q-th key="姓名">报名人</q-th> -->
              <q-th key="state">课程</q-th>
              <!-- <q-th key="adjust">调剂班级</q-th> -->
              <q-th key="updatedAt">更新时间</q-th>
              <q-th key="event">操作</q-th>
            </q-tr>
            </template>
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
                <q-td key="class" :props="props">{{ props.row.name? props.row.name:'--' }}</q-td>
                <!-- <q-td key="student" :props="props">{{ props.row.studentId? props.row.studentId.displayName:'--' }}</q-td> -->
                <q-td key="state" :props="props"> {{ props.row.courseId? props.row.courseId.name:'--' }}</q-td>
                <!-- <q-td key="adjust" :props="props">{{ props.row.adjustedClassId? props.row.adjustedClassId.name:'--' }}</q-td> -->
                <q-td key="updatedAt" :props="props">{{ props.row.lastUpatedAt|formatDate }}</q-td>
                <q-td key="event" :props="props">
                  <div>
                  <q-btn push size="sm" color="primary" label="课次详情" @click="modifyRow2(props.row)"/>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-tab-pane>
      <q-tab-pane name="tab-3">
          <div class="q-pa-sm q-mt-sm q-ml-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="我的学籍班" />
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
            @request="request3"
            :rows-per-page-options="[3,5,10,20]"
            :filter="filter3"
            :separator="separator3"
            :data="tableData3"
            :columns="columns3"
            :selected.sync="selected3"
            :loading="tableLoading3"
            :pagination.sync="serverPagination3"
          >
            <template slot="header" slot-scope="props">
              <q-tr :props="props"  style="fontSize: 0.9rem">
              <q-th key="id" >序号</q-th>
              <q-th key="class">班级</q-th>
              <!-- <q-th key="姓名">报名人</q-th> -->
              <!-- <q-th key="state">课程</q-th> -->
              <!-- <q-th key="adjust">调剂班级</q-th> -->
              <q-th key="updatedAt">更新时间</q-th>
              <!-- <q-th key="event">操作</q-th> -->
            </q-tr>
            </template>
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
                <q-td key="class" :props="props">{{ props.row.name? props.row.name:'--' }}</q-td>
                <!-- <q-td key="student" :props="props">{{ props.row.studentId? props.row.studentId.displayName:'--' }}</q-td> -->
                <!-- <q-td key="state" :props="props"> {{ props.row.courseId? props.row.courseId.name:'--' }}</q-td> -->
                <!-- <q-td key="adjust" :props="props">{{ props.row.adjustedClassId? props.row.adjustedClassId.name:'--' }}</q-td> -->
                <q-td key="updatedAt" :props="props">{{ props.row.lastUpatedAt|formatDate }}</q-td>
                <!-- <q-td key="event" :props="props">
                  <div>
                  <q-btn push size="sm" color="primary" label="课次详情" @click="modifyRow2(props.row)"/>
                  </div>
                </q-td> -->
              </q-tr>
            </template>
          </q-table>
        </div>
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
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null,
      uuid: '',
      selectedTab: 'tab-2',
      enablePull2: true,
      fullScreen2: false,
      opened2: false,
      tableData2: [],
      tableLoading2: false,
      serverPagination2: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      separator2: 'horizontal',
      filter2: '',
      columns2: [
        { name: 'id', required: true, align: 'left' },
        { name: 'role', align: 'left' },
        { name: 'class', align: 'left' },
        { name: 'student', align: 'left' },
        { name: 'status', align: 'left' },
        { name: 'account', align: 'left' },
        { name: 'adjust', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'state', align: 'left' },
        { name: 'event', align: 'left' }
      ],
      selected2: [],
      enablePull3: true,
      fullScreen3: false,
      opened3: false,
      tableData3: [],
      tableLoading3: false,
      serverPagination3: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      separator3: 'horizontal',
      filter3: '',
      columns3: [
        { name: 'id', required: true, align: 'left' },
        { name: 'role', align: 'left' },
        { name: 'class', align: 'left' },
        { name: 'student', align: 'left' },
        { name: 'status', align: 'left' },
        { name: 'account', align: 'left' },
        { name: 'adjust', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'state', align: 'left' },
        { name: 'event', align: 'left' }
      ],
      selected3: []
    }
  },
  filters: {
    formatDate (time:any) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
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
    },
    isAdjust (state:Boolean) {
      if (state) {
        return '是'
      } else {
        return '否'
      }
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      // console.log(value)
      let v = value.data
      this.done()
      if (!v) return
      // if (!v.errCode) {
      //   this.serverPagination.rowsNumber = v.count ? v.count : 0
      //   this.tableData = v.data
      // }
      if (value.type === 1) {
        this.tableLoading = false
        let v = value.data
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
        if (v.deletedCount && v.deletedCount === 1) {
          const params = {
            offset: 0,
            status: this.userStatus,
            limit: this.serverPagination.rowsPerPage,
            id: this.uuid
          }
          this.$store.dispatch('getMyChooseClass', params)
        }
      }
      if (value.msg !== 'OK') {
        showMessage(value.msg, v.errCode)
      }
      if (value.type === 2) {
        this.tableLoading2 = false
        let v = value.data
        this.serverPagination2.rowsNumber = v.count ? v.count : 0
        this.tableData2 = v.data
      }
      if (value.type === 3) {
        this.tableLoading3 = false
        let v = value.data
        this.serverPagination3.rowsNumber = v.count ? v.count : 0
        this.tableData3 = v.data
      }
    }
  },
  beforeMount () {
    this.reqConditions()
    this.reqConditions2()
    this.reqConditions3()
    const uuid = window.localStorage.getItem('uuid')
    if (uuid) {
      this.uuid = uuid
    }
    this.reqConditions()
    this.reqConditions2()
    this.reqConditions3()
    // this.$store.dispatch('getFaceList', { offset: 10, limit: 20 })
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    pullToRefresh (done:any) {
      this.pullDone = done
      this.reqConditions()
      this.reqConditions2()
      this.reqConditions3()
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
      this.reqConditions2()
      this.reqConditions3()
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
      if (params.id) {
        this.$store.dispatch('getMyChooseClass', params)
        this.hideLoading()
      } else {
      }
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
        if (params.id) {
          this.$store.dispatch('getMyChooseClass', params)
          this.hideLoading()
        }
        // this.$store.dispatch('getMyChooseClass', params)
      }, 300)
      this.hideLoading()
    },
    request2 (props:any) {
      this.tableLoading2 = true
      this.serverPagination2 = props.pagination
      const params = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage,
        id: this.uuid
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      if (params.id) {
        console.log('111')
        this.$store.dispatch('getMyStudyClass', params)
        this.hideLoading()
      } else {
        console.log('222')
      }
      // this.$store.dispatch('getMyStudyClass', params)
      // this.hideLoading()
    },
    reqConditions2 (initPageIndex = true) {
      this.tableLoading2 = true
      setTimeout(() => {
        const params = {
          offset: 0,
          limit: this.serverPagination2.rowsPerPage,
          id: this.uuid
        }
        if (this.filter) {
          // params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination2.page = 1
        } else {
          params.offset = (this.serverPagination2.page - 1) * this.serverPagination2.rowsPerPage
        }
        if (params.id) {
          this.$store.dispatch('getMyStudyClass', params)
          this.hideLoading()
        }
        // this.$store.dispatch('getMyStudyClass', params)
      }, 300)
      this.hideLoading()
    },
    request3 (props:any) {
      this.tableLoading3 = true
      this.serverPagination3 = props.pagination
      const params: any = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage,
        id: this.uuid
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      if (params.id) {
        this.$store.dispatch('getMyStatusClass', params)
        this.hideLoading()
      } else {
      }
      // this.$store.dispatch('getMyStatusClass', params)
      // this.hideLoading()
    },
    reqConditions3 (initPageIndex = true) {
      this.tableLoading3 = true
      setTimeout(() => {
        const params = {
          offset: 0,
          limit: this.serverPagination3.rowsPerPage,
          id: this.uuid
        }
        if (this.filter) {
          // params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination3.page = 1
        } else {
          params.offset = (this.serverPagination3.page - 1) * this.serverPagination3.rowsPerPage
        }
        if (params.id) {
          this.$store.dispatch('getMyStatusClass', params)
          this.hideLoading()
        }
        // this.$store.dispatch('getMyStatusClass', params)
      }, 300)
      this.hideLoading()
    },
    modifyRow (val: any) {
      if (val.adjustedClassId && val.adjustedClassId !== null) {
        localStorage.setItem('classId', val.adjustedClassId._id)
        localStorage.setItem('className', val.adjustedClassId.name)
      } else {
        localStorage.setItem('classId', val.classId._id)
        localStorage.setItem('className', val.classId.name)
      }
      this.$router.push({ name: 'lessonList', params: { rowData: val } })
      // this.$router.push('/editUser')
    },
    modifyRow2 (val: any) {
      localStorage.setItem('classId', val._id)
      localStorage.setItem('className', val.name)
      this.$router.push({ name: 'lessonList', params: { rowData: val } })
      // this.$router.push('/editUser')
    },
    deleteAccount (user: any) {
      // console.log(user)
      if (user.approvalState === 1) {
        this.opened = true
        this.deleteUser = user._id
      } else {
        return showMessage('报名结果已被审核，不可取消操作')
      }
    },
    delConfirm () {
      this.opened = false
      // console.log(this.deleteUser)
      this.$store.dispatch('deleteMyChooseClass', { id: this.deleteUser })
    }
  }
})
</script>
<style>

</style>

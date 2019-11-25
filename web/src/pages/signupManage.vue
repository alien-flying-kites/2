<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="报名审核" to="/signupManage"/>
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
           <span>批量操作： </span>
           <q-select color="white"
            inverted
            separator
            :props="props"
            v-model="selectState"
            selection="multiple"
            :selected.sync="selected"
            :options="optionList"
            class="col-9 text_white"
            style="min-width:100px"
          />
        </template> -->
        <template slot="header" slot-scope="props">
          <q-tr :props="props"  style="fontSize: 0.9rem">
          <!-- <q-th auto-width>
            <q-checkbox
              v-if="props.multipleSelect"
              v-model="props.selected"
              indeterminate-value="some"
            />
          </q-th> -->
          <q-th key="id" >序号</q-th>
          <q-th key="class">班级</q-th>
          <q-th key="student">报名人</q-th>
          <q-th key="state">状态</q-th>
          <q-th key="updatedAt">是否同意调剂</q-th>
           <q-th key="adjustedClassId">已调剂到</q-th>
          <q-th key="event">操作</q-th>
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <!-- <q-td auto-width>
              <q-checkbox color="primary" v-model="props.selected" />
            </q-td> -->
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="class" :props="props">{{ props.row.classId? props.row.classId.name:'--' }}</q-td>
            <q-td key="student" :props="props">{{ props.row.studentId? props.row.studentId.displayName:'--' }}</q-td>
            <q-td key="state" :props="props"  color="negative">
              {{ props.row.approvalState | userStatus}}
            </q-td>
            <q-td key="updatedAt" :props="props">
              {{ props.row.acceptClassAdjustment?(props.row.acceptClassAdjustment===false?"否":"是"):"否"}}
              <q-icon name="close" color="negative" v-if="props.row.acceptClassAdjustment===false"/>
              <q-icon name="done" color="positive" v-if="props.row.acceptClassAdjustment===true"/>
            </q-td>
            <q-td key="adjustedClassId" :props="props">{{ props.row.adjustedClassId? props.row.adjustedClassId.name:'--' }}</q-td>
            <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="positive" label="同意" @click="agree(props.row)" class="q-mr-sm" />
                <q-btn push size="sm" color="negative" label="拒绝" @click="disagree(props.row)" class="q-mr-sm"/>
                <q-btn push size="sm" color="negative" label="调剂" @click="adjust(props.row)" class="q-mr-sm" v-if="props.row.acceptClassAdjustment===true && props.row.approvalState !== 3"/>
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
          <div class="col-3">调剂到班级 </div>
           <q-select
            inverted
            separator
            v-model="adjustClass"
            :options="classAdjustOptionList"
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
            label="确认调剂"
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

export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['serverData', 'operateData', 'checkedOpers', 'handleOpers', 'classAdjustOptionList'])
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
        { name: 'class', align: 'left' },
        { name: 'name', align: 'left' },
        { name: 'teacher', align: 'left' },
        { name: 'student', align: 'left' },
        { name: 'classtime', align: 'left' },
        { name: 'num', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'adjustedClassId', align: 'left' },
        { name: 'state', align: 'left' },
        { name: 'event', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null,
      adjustClass: '',
      selectState: 1,
      optionList: [
        {
          label: '审核通过',
          value: 1
        },
        {
          label: '拒绝',
          value: 2
        }
      ]

    }
  },
  filters: {
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
      if (!value) return
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (v && v.nModified) {
        this.serverPagination = {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        }
        const params = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage
        }
        this.$store.dispatch('signupList', params)
      }
      if (v && !v.nModified) {
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
    this.$socket.emit('classAdjustOptionList')
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
      console.log(this.serverPagination)
      const params = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      // this.$socket.emit('signupList', params)
      this.$store.dispatch('signupList', params)
      // this.$store.dispatch('getRoleList', params)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params = {
          offset: 0,
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
        console.log(this.serverPagination)
        // this.$socket.emit('signupList', params)
        this.$store.dispatch('signupList', params)
      }, 300)
      this.hideLoading()
    },
    agree (data:any) {
      // console.log('agree:', data)
      let content = {
        id: data._id,
        studentId: data.studentId._id,
        classId: data.classId._id,
        approvalState: 2
      }
      this.$store.dispatch('updateSignupState', content)
    },
    disagree (data:any) {
      let content = {
        id: data._id,
        studentId: data.studentId._id,
        classId: data.classId._id,
        approvalState: 3
      }
      this.$store.dispatch('updateSignupState', content)
    },
    adjust (user: any) {
      this.opened = true
      this.dadjustUser = {
        id: user._id,
        studentId: user.studentId._id,
        classId: user.classId._id,
        approvalState: 4
      }
    },
    modifyRow (val: any) {
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
      this.opened = false
      // adjustedClassId = this.adjustClass
      this.$set(this.dadjustUser, 'adjustedClassId', this.adjustClass)
      const params = this.dadjustUser
      // console.log('params  调剂班级')
      // console.log(params)
      this.$store.dispatch('updateSignupState', params)
    }
  }
})
</script>
<style scoped>
.box{
  padding: 10px 15px;
}
</style>

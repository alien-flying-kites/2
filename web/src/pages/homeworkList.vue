<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <!-- <q-breadcrumbs>
        <q-breadcrumbs-el label="学生作业列表" />
      </q-breadcrumbs> -->
      <q-breadcrumbs>
         <span class="title" @click="forward()"> 课次列表/</span>
         <span>学生作业列表</span>
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
          <q-th key="roleName">班级名称</q-th>
          <q-th key="type">学生</q-th>
          <q-th key="role">作业状态</q-th>
          <q-th key="status">文字作业</q-th>
          <q-th key="mobilePhone">分数</q-th>
          <q-th key="teacherComments">评语</q-th>
          <q-th key="email">文件作业</q-th>
          <!-- <q-th key="updatedAt">创建时间</q-th> -->
          <q-th key="event">操作</q-th>
        </q-tr>
         </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
            <q-td key="roleName" :props="props">{{ props.row.classId? props.row.classId.name:'--' }}</q-td>
            <q-td key="type" :props="props">{{ props.row.studentId?props.row.studentId.displayName:'--' }}</q-td>
            <q-td key="role" :props="props">{{ props.row.state|state}}</q-td>
            <q-td key="status" :props="props" style="maxWidth:200px;word-wrap: break-word; white-space: pre-wrap">{{ props.row.description?props.row.description:'--'}}</q-td>
            <q-td key="mobilePhone" :props="props">{{ props.row.score?props.row.score:"0" }}</q-td>
            <q-td key="teacherComments" :props="props" style="maxWidth:200px;word-wrap: break-word; white-space: pre-wrap" >{{ props.row.teacherComments?props.row.teacherComments:"--" }}</q-td>
            <q-td key="email" :props="props"><span v-html="fileListToLinks(props.row.filePath)"></span></q-td>
            <!-- <q-td key="updatedAt" :props="props">{{ props.row.lastUpatedAt||'--' }}</q-td> -->
            <q-td key="event" :props="props">
              <div>
                <q-btn push size="sm" color="primary" label="批改" @click="modifyRow(props.row)" class="q-mr-sm"/>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-modal v-model="opened" class="" minimized>
      <div class="q-pa-lg">
        <div class="row flex-center">
          <div class="col-3">评语：</div>
          <q-input inverted color="white" type="text" class="col-9 text_white" v-model.trim="comment" placeholder="评语"/>
          <div class="col-3">请打分：</div>
          <q-input inverted color="white" type="number" class="col-9 text_white" v-model.trim="score" placeholder="打分"/>
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
            label="确定"
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
        { name: 'userName', align: 'left' },
        { name: 'status', align: 'left' },
        { name: 'account', align: 'left' },
        { name: 'mobilePhone', align: 'left' },
        { name: 'updatedAt', align: 'left' },
        { name: 'email', align: 'left' },
        { name: 'teacherComments', align: 'left' },
        { name: 'event', align: 'left' },
        { name: 'type', align: 'left' }
      ],
      selected: [],
      updatedAtDesc: true,
      userStatus: -1,
      deleteUser: null,
      pullDone: null,
      lessonId: '',
      score: -1,
      comment: '已阅',
      info: {},
      homeworkId: Object,
      id: Object
    }
  },
  filters: {
    state (type:any) {
      if (type === 1) {
        return '未提交'
      } else if (type === 2) {
        return '已提交'
      } else if (type === 3) {
        return '已批改'
      }
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      if (value.data && value.data.nModified) {
        const params:any = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          lessonId: this.lessonId
        }
        this.$store.dispatch('getAllHomeworkList', params)
      }
      // if (!value || value.code !== 1000) return
      let v = value.data
      this.tableLoading = false
      this.done()
      if (!v) return
      if (!v.errCode) {
        this.serverPagination.rowsNumber = v.count ? v.count : 0
        this.tableData = v.data
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
    const uuid = window.localStorage.getItem('uuid')
    if (uuid) {
      this.uuid = uuid
    }
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    } else {
      // showMessage('请求出错了', 'err')
      this.$router.replace('/lessonList')
    }
    // this.$store.dispatch('getFaceList', { offset: 10, limit: 20 })
  },
  mounted () {
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
        lessonId: this.lessonId
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      this.$store.dispatch('getAllHomeworkList', params)
      this.hideLoading()
    },
    reqConditions (initPageIndex = true) {
      this.tableLoading = true
      setTimeout(() => {
        const params = {
          offset: 0,
          limit: this.serverPagination.rowsPerPage,
          lessonId: this.lessonId
        }
        if (this.filter) {
          // params.username = this.filter
        }
        if (initPageIndex) {
          this.serverPagination.page = 1
        } else {
          params.offset = (this.serverPagination.page - 1) * this.serverPagination.rowsPerPage
        }
        if (!params.lessonId) {
          return
        }
        this.$store.dispatch('getAllHomeworkList', params)
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
    modifyRow (val: any) {
      this.opened = true
      this.homeworkId = val._id
      this.id = val.id
      this.info = {
        id: this.id,
        homeworkId: this.homeworkId,
        filePath: val.filePath,
        description: val.description,
        score: this.score,
        teacherComments: this.comment
      }
    },
    deleteRow () {
      if (this.selected.length < 1) {
        showMessage('请选择要删除的数据')
      } else {
        this.opened = true
      }
    },
    delConfirm () {
      if (this.score < 0) {
        return showMessage('分数不可小于0')
      }
      if (this.score > 100) {
        return showMessage('分数不可大于100')
      }
      this.opened = false
      this.$set(this.info, 'score', this.score)
      this.$set(this.info, 'state', 3)
      this.$set(this.info, 'teacherComments', this.comment)
      const params = this.info
      this.$store.dispatch('updateHomeworkScore', params)
      // this.$store.dispatch('updateHomeworkScore', { id: this.deleteUser.Id })
    },
    fileListToLinks (fileList: string[]) {
      const _fileList:any = fileList
      const result = _fileList.split(',')
      if (result) {
        let html = ''
        for (const i in result) {
          const fileNameMatch = /([^\\]+)$/.exec(result[i])
          if (fileNameMatch) {
            html += ('<a href="' + request.defaults.baseURL + '/' + result[i] + '">' + fileNameMatch[1] + '</a><br/>')
          }
        }
        console.log(html)
        return html
      } else {
        return '--'
      }
    },
    initData (val:any) {
      this.lessonId = val._id || ''
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

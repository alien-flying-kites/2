<template>
  <q-page>
    <!-- <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="添加课次"/>
      </q-breadcrumbs>
    </div> -->
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center mar_10">
          <div class="col-3">班级名称</div>
           <!-- <q-select color="white"
            inverted
            separator
            v-model="className"
            :options="classOptionList"
            class="col-9 text_white"
          /> -->
           <q-input inverted disabled=true readonly="readonly" color="white" class="col-9 text_white" v-model.trim="className"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">本次授课人</div>
           <q-select color="white"
            inverted
            separator
            v-model="teacther"
            :options="teacherOptionList"
            class="col-9 text_white"
          />
        </div>
        <div class="row flex-center mar_10">
        <div class="col-3">课程概要</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="remark"/>
        </div>
        <!-- <div class="q-pa-sm box">
          <q-table dense table-class="table-custom" ref="table" row-key="Id" selection="multiple" loading-label="努力加载中···" no-data-label="暂无数据" no-results-label="暂无匹配数据" rows-per-page-label="每页最大行数" @request="request" :rows-per-page-options="[3,5,10,20]" :filter="filter"
            :separator="separator" :data="tableData" :columns="columns" :selected.sync="selected" :loading="tableLoading" :pagination.sync="serverPagination">
            <template slot="top-left" slot-scope="props">
                <q-btn :props="props" color="primary"  label="添加教案/作业/示例" class="no-shadow"  @click="openLessonMaterialModal()"/>
            </template>
            <template slot="header" slot-scope="props">
              <q-tr :props="props" style="fontSize: 0.9rem">
                <q-th key="id">Id</q-th>
                <q-th key="materialType">材料类型</q-th>
                <q-th key="filePath">文件</q-th>
                <q-th key="description">内容</q-th>
                <q-th key="event">操作</q-th>
              </q-tr>
            </template>
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
                <q-td key="materialType" :props="props">{{ props.row.materialItemType }}</q-td>
                <q-td key="filePath" :props="props">{{ props.row.filePath?props.row.filePath:'--'}}</q-td>
                <q-td key="description" :props="props">{{ props.row.description?props.row.description:"--" }}</q-td>
                <q-td key="event" :props="props">
                  <div>
                    <q-btn push size="sm" color="primary" label="编辑" @click="modifyRow(props.row)" class="q-mr-sm" />
                    <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row._id)" />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div> -->
        <q-btn-group flat class="block q-pt-md" align="center">
          <q-btn color="faded" label="取消" class="q-mr-md" @click="reset"/>
          <q-btn color="primary" label="添加" @click="addAccount"/>
        </q-btn-group>
      </div>
    </div>
    <q-modal v-model="modalShow" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
          添加成功
        </p>
        <q-btn-group flat class="q-pb-md q-pt-md float-right ">
          <q-btn
            color="amber-5"
            to="/user"
            label="返回上一页"
            class="q-mr-md round-borders"
          />
          <q-btn
            color="positive"
            @click="modalShow=false"
            label="继续添加"
            class="round-borders"
          />
        </q-btn-group>
      </div>
    </q-modal>
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import showMessage from '../plugins/showMessage'
import { mapGetters } from 'vuex'

export default Vue.extend({
  components: {
  },
  data () {
    return {
      hasData: 0,
      lessonMaterialModel: false,
      remark: '',
      offset: 0,
      flag: false,
      modalShow: false,
      classTeacher: null,
      teacther: null,
      name: '',
      maxNum: null,
      selectedStatus: 2,
      time: '',
      uuid: '',
      separator: 'horizontal',
      className: '',
      class: '',
      filter: '',
      courseId: '',
      tableData: [],
      serverPagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      columns: [
        {
          name: 'id',
          required: true,
          align: 'left'
        },
        {
          name: 'name',
          align: 'left'
        },
        {
          name: 'class',
          align: 'left'
        },
        {
          name: 'teacher',
          align: 'left'
        },
        {
          name: 'classTeacher',
          align: 'left'
        },
        {
          name: 'startTime',
          align: 'left'
        },
        {
          name: 'time',
          align: 'left'
        },
        {
          name: 'remark',
          align: 'left'
        },
        {
          name: 'num',
          align: 'left'
        },
        {
          name: 'limit',
          align: 'left'
        },
        {
          name: 'event',
          align: 'left'
        }
      ],
      selected: [],
      phoneNumber: '',
      tableLoading: false,
      optionList: [
        {
          label: '学校管理员',
          value: 2
        },
        {
          label: '课程管理员',
          value: 4
        },
        {
          label: '班级管理员',
          value: 8
        },
        {
          label: '实验室管理员',
          value: 16
        },
        {
          label: '教师',
          value: 32
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'teacherOptionList', 'handleOpers', 'classOptionList'])
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
      let v = value.data
      if (!v) return
      if (v) {
        this.$router.replace('/lessonList')
      }
    },
    teacherOptionList: function (data:any) {
    },
    operateData: function (v) {
      if (!v) return
      let res = v.data
      if (res && !res.errCode) {
        setTimeout(() => {
          this.$router.replace('/user')
        }, 2000)
        return showMessage(v.tips + '，操作成功')
      }
      showMessage(v.tips + '，操作失败')
      if (res && res.msg) {
        setTimeout(() => {
          showMessage(res.msg, 'info', 1000)
        }, 1000)
      }
    }
  },
  beforeMount () {
    this.$socket.emit('teacherOptionList')
    this.$socket.emit('classOptionList')
    // this.$socket.emit('classAdminOptionList')
    // courseAdminOptionList  classAdminOptionList
  },
  mounted () {
    const courseId = window.localStorage.getItem('courseId')
    const classId = window.localStorage.getItem('classId')
    const className = window.localStorage.getItem('className')
    if (courseId) {
      this.courseId = courseId
    }
    if (className) {
      this.className = className
    }
    if (classId) {
      this.classId = classId
    }
    // let refreshBtn = this.$refs.refreshBtn
  },
  methods: {
    openLessonMaterialModal () {
      this.lessonMaterialModel = true
    },
    request (props: any) {
      this.tableLoading = true
      this.serverPagination = props.pagination
      const params = {
        offset: (props.pagination.page - 1) * props.pagination.rowsPerPage,
        limit: props.pagination.rowsPerPage,
        status: this.userStatus,
        id: this.lessonId
      }
      if (props.filter) {
        // params.username = props.filter.replace(/_/g, '\\_')
      }
      // this.$socket.emit('getCourseDetail', params)
      this.$store.dispatch('getLessonMaterialList', params)
      this.hideLoading()
    },
    hideLoading () {
      setTimeout(() => {
        this.tableLoading = false
      }, 8000)
    },
    addAccount () {
      if (!this.className) {
        return showMessage('班级名称不能为空')
      }
      if (!this.name) {
        return showMessage('课程名称不能为空')
      }
      const content = {
        name: this.name,
        courseId: this.courseId,
        classId: this.classId,
        teacherId: this.teacther,
        absentStudentIds: [],
        attendantStudentIds: [],
        remark: this.remark
      }
      // console.log('添加keci', content)
      // this.$socket.emit('addCoursesClass', content)
      this.$store.dispatch('addLesson', content)
    },
    reset () {
      this.$router.replace('/lessonList')
      this.maxNum = null
      this.classTeacher = null
      this.teacher = null
      this.className = ''
      this.time = ''
      this.remark = ''
    },
    refresh () {
    }
  }
})
</script>
<style scope>
.mar_10{
  margin-top: 10px;
}
.text_white{
  color: #333 !important;
}
</style>

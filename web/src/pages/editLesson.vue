<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="课次列表" to="/lessonList" />
        <q-breadcrumbs-el label="课次修改" />
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 800px">
        <div class="row flex-center mar_10">
          <div class="col-3">班级名称</div>
          <q-select color="white" inverted disabled=true readonly="readonly" separator v-model="className" :options="classOptionList" class="col-9 text_white" />
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">本次授课人</div>
          <q-select color="white" inverted separator v-model="teacther" :options="teacherOptionList" class="col-9 text_white" />
        </div>
        <!-- <div class="row flex-center mar_10">
          <div class="col-3">课程概要</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="remark" />
        </div> -->
        <div class="row flex-center mar_10" style="maxWidth: 800px">
          <q-table dense table-class="table-custom" ref="table" row-key="Id" selection="multiple" loading-label="努力加载中···"
          no-data-label="暂无数据" no-results-label="暂无匹配数据" rows-per-page-label="每页最大行数" @request="request" :rows-per-page-options="[10]" :filter="filter"
            :separator="separator" :data="lessonMaterialList" :columns="columns" :selected.sync="selected" :loading="tableLoading" style="minWidth: 800px">
            <template slot="top-left" slot-scope="props">
                <q-btn :props="props" color="primary"  label="添加教案/作业/示例" class="no-shadow"  @click="openLessonMaterialModal()"/>
            </template>
            <template slot="header" slot-scope="props">
              <q-tr :props="props" style="fontSize: 0.9rem">
                <q-th key="id">Id</q-th>
                <q-th key="materialItemType">材料类型</q-th>
                <q-th key="fileList">文件</q-th>
                <q-th key="description">简介</q-th>
                <q-th key="event">操作</q-th>
              </q-tr>
            </template>
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">{{ props.row.__index + 1 }}</q-td>
                <q-td key="materialItemType" :props="props">{{ props.row.materialItemType | materialType }}</q-td>
                <q-td key="fileList" :props="props"><span v-html="fileListToLinks(props.row.fileList)"></span></q-td>
                <q-td key="description" :props="props">{{ props.row.description?props.row.description:"--" }}</q-td>
                <q-td key="event" :props="props">
                  <div>
                    <!-- <q-btn push size="sm" color="primary" label="编辑" @click="modifyAccount(props.row)" class="q-mr-sm" /> -->
                    <q-btn push size="sm" color="negative" label="删除" @click="deleteAccount(props.row._id)" />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
         <q-btn-group flat class="block q-pt-md" align="center">
          <q-btn color="faded" label="取消" class="q-mr-md" @click="cancle()"/>
          <q-btn color="primary" label="更新" @click="modifyAccount"/>
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
    <q-modal v-model="opened" class="" minimized>
      <div class="q-pa-lg">
        <p class="text-tertiary">
          确定删除<span class="text-negative"></span>?
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
    <q-modal v-model="lessonMaterialModel" class="">
    <div class="q-pa-md row flex-center">
        <div class="col input-box" style="maxWidth: 800px;minWidth: 460px;minHeight: 300px">
            <div class="row flex-center mar_10">
                <div class="col-3">
                    类型
                    <span class="text-negative">
                        *
                    </span>
                </div>
                <div class="col-9">
                  <q-select color="white" inverted separator v-model="lessonMaterialType"
                :options="lessonMaterialOptionList" class="col-9 text_white" />
                </div>
            </div>
            <div class="row flex-center mar_10">
                <div class="col-3">
                    内容
                </div>
                  <div class="col-9">
                     <textarea placeholder="文字描述" class="text_white" v-model="lessonMaterialDescription" maxlength="1500">
                </textarea>
                  </div>
            </div>
            <div class="row flex-center mar_10">
                <div class="col-3">
                    文件上传
                </div>
                 <div class="col-9">
                   <q-uploader id="uploader" ref="uploader" :url="''" hide-upload-progress class="text_white" float-label="选择文件后，点击保存按钮，开始上传"
                   :auto-expand="true" :multiple="true" :hide-upload-button="true" :clearable="true"
                   @add="file_selected" @remove:cancel="file_removed_before_upload" :filter="filterFiles"
                   extensions=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.rar,.log,.jpg,.jpeg,.png,.gif,.bmp,.zip,.rar,.gz,.tgz,.gzip,.bz2,.7z">
                </q-uploader>
                </div>
            </div>
            <q-btn color="primary" v-if="canSave" label="保存" @click="addLessonMaterial"/>
            <q-btn color="primary" v-else  disabled label="保存" @click="addLessonMaterial"/>
        </div>
    </div>
</q-modal>
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import showMessage from '../plugins/showMessage'
import { mapGetters } from 'vuex'
import courseAPI from '../api/course'
import request from '../api/request'

const emptyFileArray:File[] = []
export default Vue.extend({
  components: {},
  data () {
    return {
      hasData: 0,
      opened: false,
      lessonMaterialModel: false,
      lessonMaterialType: 1,
      lessonMaterialDescription: '',
      lessonMaterialFilePath: '',
      selected_files: emptyFileArray,
      // remark: '',
      offset: 0,
      flag: false,
      modalShow: false,
      classTeacher: '',
      teacther: '',
      name: '',
      maxNum: null,
      selectedStatus: 2,
      time: '',
      courseId: '',
      classId: '',
      className: '',
      class: '',
      phoneNumber: '',
      selectedRole: null,
      lessonId: '',
      toBeRemovedLessonMaterialId: null,
      lessonMaterialOptionList: [{
        label: '教案',
        value: 1
      },
      {
        label: '示例',
        value: 2
      },
      {
        label: '作业题',
        value: 3
      }
      ],
      filter: '',
      tableLoading: false,
      selected: [],
      columns: [{
        name: 'id',
        required: true,
        align: 'left'
      },
      {
        name: 'materialItemType',
        align: 'left'
      },
      {
        name: 'fileList',
        align: 'left'
      },
      {
        name: 'description',
        align: 'left'
      },
      {
        name: 'event',
        align: 'left'
      }
      ],
      separator: 'horizontal',
      tableData: [],
      canSave: true
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'classOptionList', 'teacherOptionList', 'lessonMaterialList'])
  },
  watch: {
    operateData: function (v) {
      if (!v) {
        return
      }
      let res = v.data
      if (res && !res.errCode) {
        setTimeout(() => {
          this.$router.replace('/user')
        }, 2000)
        return showMessage(v.tips + '，操作成功')
      }
      showMessage(v.tips + '，操作失败')
      if (res.msg) {
        setTimeout(() => {
          showMessage(res.msg)
        }, 1000)
      }
    },
    lessonMaterialList: function (v) {
      console.log(v)
      if (!v) return
      this.canSave = true
    },
    serverData: function (value: any) {
      if (!value || value.ok !== 1) {
        return
      }
      // console.log(value)
      if (value.errCode) {
        // return showMessage('请求出错了', 'err')
      }
      if (value && value.ok) {
        this.$router.replace('/lessonList')
      }
      //   this.$router.replace('/allCourse')
    },
    classOptionList: function (v: any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        if (val.label === self.className) {
          self.className = val.value
          return true
        }
      })
    },
    teacherOptionList: function (v: any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        if (val.label === self.teacher) {
          self.teacher = val.value
          return true
        }
      })
    }
  },
  beforeMount () {
    this.$socket.emit('classOptionList')
    this.$socket.emit('teacherOptionList')
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    } else {
      // showMessage('请求出错了', 'err')
      this.$router.replace('/lessonList')
    }
    this.selected_files = []
  },
  mounted () {
  },
  beforeDestroy () {
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    }
  },
  filters: {
    materialType (data: number) {
      if (data === 1) {
        return '教案'
      } else if (data === 2) {
        return '示例代码'
      } else if (data === 3) {
        return '作业'
      } else {
        return '--'
      }
    }
  },
  methods: {
    file_selected (files: File[]) {
      Array.prototype.push.apply(this.selected_files, files)
    },
    file_removed_before_upload (file) {
      const fileIndex = this.selected_files.indexOf(file)
      if (fileIndex >= 0) {
        this.selected_files.splice(fileIndex, 1)
      }
    },
    filterFiles (files) {
      const MAX_FILE_SIZE = 30 * 1024 * 1024 /* =30M */
      const MAX_TOTAL_FILE_SIZE = 50 * 1024 * 1024 /* =50M* */
      const MAX_FILE_COUNT = 5
      // returns an Array containing allowed files
      let currentTotalFileSize = 0
      let currentTotalFileCount = this.selected_files.length
      this.selected_files.forEach(x => { currentTotalFileSize += x.size })
      return files.filter((file) => {
        if (currentTotalFileCount + 1 <= MAX_FILE_COUNT) {
          currentTotalFileCount++
          if (file.size <= MAX_FILE_SIZE) {
            if ((currentTotalFileSize + file.size) < MAX_TOTAL_FILE_SIZE) {
              currentTotalFileSize += file.size
              return true
            } else {
              showMessage('文件总大小不可超过50MB')
              return false
            }
          } else {
            showMessage('单个文件不可超过30MB')
            return false
          }
        } else {
          showMessage('一次最多只能上传5个文件')
          return false
        }
      })
    },
    openLessonMaterialModal () {
      this.lessonMaterialModel = true
    },
    addLessonMaterial () {
      let files = this.selected_files
      if (files.length === 0 && this.lessonMaterialDescription.trim().length === 0) {
        showMessage('请至少提供文字描述或上传文件')
        return
      }
      let formData = new FormData()
      const additionalQueryString = JSON.stringify({
        lessonId: this.lessonId,
        lessonMaterialType: this.lessonMaterialType.toString(),
        lessonMaterialDescription: this.lessonMaterialDescription
      })
      formData.append('additionalQueryString', additionalQueryString)
      for (var i = 0; i <= files.length - 1; i++) {
        let file = files[i]
        formData.append('files[' + i + ']', file)
      }
      // console.log(formData)
      courseAPI.uploadLessonMaterial(formData)
        .then(this.uploadLessonMaterialCallback)
        .catch(err => {
          if (err && err.response && err.response.data) {
            const message = err.response.data || err.response.data.message
            if (message) {
              // showMessage(message)
            }
          } else if (err && err.message) {
            // showMessage(err.message)
          }
        })
      if (!this.canSave) {
        return false
      }
      this.canSave = false
    },
    uploadLessonMaterialCallback (response: any) {
      const params = {
        id: this.lessonId
      }
      this.$store.dispatch('getLessonMaterialList', params)
      this.lessonMaterialModel = false
      const uploader: any = this.$refs.uploader
      if (uploader.reset) {
        uploader.reset()
      }
      this.selected_files = []
      // console.log('upload completed!!')
    },
    modifyAccount (row: any) {
      // console.log(row)
      if (!this.className) {
        return showMessage('班级名称不能为空')
      }
      if (!this.teacther) {
        return showMessage('请填写授课人')
      }
      const content = {
        courseId: this.courseId,
        classId: this.className,
        // className: this.className,
        teacherId: this.teacther,
        classTime: this.classTime,
        absentStudentIds: [],
        attendantStudentIds: [],
        // remark: this.remark,
        id: this.lessonId
      }
      // console.log('修改课次详情信息')
      // console.log(content)
      // this.$socket.emit('updateLesson', content)
      this.$store.dispatch('updateLesson', content)
    },
    deleteAccount (user: any) {
      this.opened = true
      this.toBeRemovedLessonMaterialId = user
    },
    delConfirm () {
      this.opened = false
      this.$socket.emit('deleteLessonMaterial', {
        lessonId: this.lessonId,
        id: this.toBeRemovedLessonMaterialId
      })
    },
    hideLoading () {
      setTimeout(() => {
        this.tableLoading = false
      }, 8000)
    },
    fileListToLinks (fileList: string[]) {
      // console.log(fileList)
      if (fileList) {
        let html = ''
        for (let filePath of fileList) {
          // console.log(filePath)
          const fileNameMatch = /([^\\]+)$/.exec(filePath)
          if (fileNameMatch) {
            html += ('<a href="' + request.defaults.baseURL + '/' + filePath + '">' + fileNameMatch[1] + '</a><br/>')
          }
        }
        return html
      } else {
        return '--'
      }
    },
    request (props: any) {
      this.tableLoading = true
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
    initData (val: any) {
      this.teacther = val.teacherId ? val.teacherId._id : null
      this.className = val.classId._id || null
      // this.classId = val.classId._id || ''
      this.courseId = val.courseId || ''
      this.name = val.name || ''
      // this.remark = val.description || ''
      this.lessonId = val._id || ''
      // this.lessonMaterialItems = val.lessonMaterialItems || []
      const params = {
        id: this.lessonId
      }
      this.$store.dispatch('getLessonMaterialList', params)
    },
    cancle () {
      this.$router.replace('/lessonList')
    }
  }
})
</script>
<style scope>
  .mar_10 {
    margin-top: 10px;
  }
  .text_white {
    color: #333 !important;
  }
</style>

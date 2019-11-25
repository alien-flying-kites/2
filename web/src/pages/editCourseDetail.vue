<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="课程列表" to="/courseDetail"/>
        <q-breadcrumbs-el label="课程详情修改"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center mar_10">
         <div class="col-3">课程名称<span class="text-negative">*</span></div>
           <q-input inverted color="white" disabled=true readonly="readonly" class="col-9 text_white" v-model.trim="name"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">班级名称<span class="text-negative">*</span></div>
           <q-input inverted color="white" class="col-9 text_white" v-model.trim="className"/>
        </div>
          <div class="row flex-center mar_10">
          <div class="col-3">任课老师</div>
           <q-select color="white"
            inverted
            separator
            v-model="teacther"
            :options="teacherOptionList"
            class="col-9 text_white"
          />
        </div>
          <!-- <div class="row flex-center">
          <div class="col-3">班级管理员</div>
           <q-select color="white"
            inverted
            separator
            v-model="classTeacher"
            :options="classAdminOptionList"
            class="col-9 text_white"
          />
        </div> -->
         <div class="row flex-center mar_10">
        <div class="col-3">人数限制<span class="text-negative">*</span></div>
          <q-input inverted color="white" class="col-9 text_white" type="number" float-label="Number" v-model="maxNum"/>
        </div>
        <!-- <div class="row flex-center mar_10">
        <div class="col-3">开课时间<span class="text-negative">*</span></div>
          <q-datetime v-model="time" type="date" :min="today" class="col-9 text_white"  placeholder="4月15号"/>
        </div> -->
        <div class="row flex-center mar_10">
          <div class="col-3">备注</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="remark"/>
        </div>
         <div class="row flex-center">
          <div class="col-3">是否接受报名</div>
           <q-select color="white"
            inverted
            separator
            v-model="isOpenForRegisteration"
            :options="RegisterationoptionList"
            class="col-9 text_white"
          />
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
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import showMessage from '../plugins/showMessage'
import { mapGetters } from 'vuex'
const today = new Date()
export default Vue.extend({
  components: {
  },
  data () {
    return {
      today,
      hasData: 0,
      remark: '',
      offset: 0,
      flag: false,
      modalShow: false,
      classTeacher: Object,
      teacther: Object,
      name: '',
      maxNum: 0,
      selectedStatus: 2,
      time: '',
      courseId: '',
      classId: '',
      className: '',
      class: '',
      phoneNumber: '',
      isOpenForRegisteration: true,
      selectedRole: null,
      optionList: [
        {
          label: '张三',
          value: 2
        },
        {
          label: '李四',
          value: 4
        }
      ],
      RegisterationoptionList: [
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
  computed: {
    ...mapGetters(['serverData', 'operateData', 'teacherOptionList', 'classAdminOptionList'])
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
    teacherOptionList: function (v:any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        if (val.label === self.teacher) {
          self.teacher = val.value
          return true
        }
      })
    },
    classAdminOptionList: function (v:any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        if (val.label === self.classTeacher) {
          self.classTeacher = val.value
          return true
        }
      })
    },
    serverData: function (value:any) {
      if (!value || value.ok !== 1) {
        return
      }
      if (value.errCode) {
        return showMessage('请求出错了', 'err')
      }
      this.$router.replace('/courseDetail')
    }
  },
  beforeMount () {
    const content = {}
    this.$store.dispatch('teacherOptionList', content)
    // this.$socket.emit('teacherOptionList')
    this.$socket.emit('classAdminOptionList')
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    } else {
      // showMessage('请求出错了', 'err')
      this.$router.replace('/courseDetail')
    }
  },
  mounted () {
    const courseId = window.localStorage.getItem('courseId')
    const courseName = window.localStorage.getItem('courseName')
    if (courseId) {
      this.courseId = courseId
    }
    if (courseName) {
      this.name = courseName
    }
  },
  beforeDestroy () {
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    }
  },
  methods: {
    modifyAccount () {
      if (!this.className) {
        return showMessage('班级名称不能为空')
      }
      if (this.className.length > 20) {
        return showMessage('名称不超过20个字')
      }
      if (!this.maxNum) {
        return showMessage('人数限制不能为空')
      }
      if (this.maxNum > 200) {
        return showMessage('人数限制不能超过200')
      }
      if (this.maxNum < 1) {
        return showMessage('人数限制不能少于1')
      }
      // if (!this.teacther) {
      //   return showMessage('任课老师不能为空')
      // }
      // if (!this.classTeacher) {
      //   return showMessage('班级管理员不能为空')
      // }
      // if (!this.time) {
      //   return showMessage('开课时间不能为空')
      // }
      // if (!this.remark) {
      //   return showMessage('班级说明不能为空')
      // }
      if (!this.isOpenForRegisteration) {
        return showMessage('是否接收报名不能为空')
      }
      const content = {
        id: this.classId,
        courseId: this.courseId,
        className: this.className,
        teacherId: this.teacther,
        classTeacherId: this.classTeacher,
        limit: this.maxNum,
        // startTime: this.time,
        description: this.remark,
        isOpenForRegisteration: this.isOpenForRegisteration
      }
      // console.log('修改详情信息', content)
      // this.$socket.emit('updateCourseDetail', content)
      this.$store.dispatch('updateCourseDetail', content)
    },
    initData (val: any) {
      this.teacther = val.teacherId ? val.teacherId._id : Object
      this.className = val.name || null
      this.classTeacher = val.adminId ? val.adminId._id : Object
      // this.maxNum = val.dateToOpenClass || null
      this.time = val.dateToOpenClass || null
      this.remark = val.description || null
      this.classId = val._id || ''
      this.maxNum = val.studentLimit || null
    },
    cancle () {
      this.$router.replace('/courseDetail')
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

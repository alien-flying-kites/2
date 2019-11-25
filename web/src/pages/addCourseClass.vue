<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="课程列表" to="/allCourse"/>
        <q-breadcrumbs-el label="添加课程班级"/>
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
            :options="teacherList"
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
          <q-input inverted color="white" class="col-9 text_white" type="number" v-model.trim="maxNum"/>
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
      maxNum: 200,
      selectedStatus: 2,
      time: '',
      uuid: '',
      className: '',
      class: '',
      phoneNumber: '',
      isOpenForRegisteration: true,
      teacherList: [],
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
      ],
      // classAdminOptionList: [],
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
    ...mapGetters(['serverData', 'operateData', 'teacherOptionList', 'handleOpers', 'classAdminOptionList'])
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
      let v = value.data
      if (!v) {
        return false
      } else {
        this.tableData = v
        this.$router.push('/courseDetail')
      }
      if (value.msg) {
        showMessage(value.msg, value.errCode)
      }
    },
    teacherOptionList: function (data:any) {
      this.teacherList = data
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
    const content = {}
    this.$store.dispatch('teacherOptionList', content)
    // this.$socket.emit('teacherOptionList')
    this.$socket.emit('classAdminOptionList')
    //  courseAdminOptionList  classAdminOptionList
  },
  mounted () {
    const courseId = window.localStorage.getItem('courseId')
    const courseName = window.localStorage.getItem('courseName')
    console.log(courseId)
    if (courseId) {
      this.uuid = courseId
    }
    if (courseName) {
      this.name = courseName
    }
    // let refreshBtn = this.$refs.refreshBtn
  },
  methods: {
    addAccount () {
      // if (!this.class) {
      //   return showMessage('用户名不能为空')
      // }
      if (!this.className) {
        return showMessage('班级名称不能为空')
      }
      if (this.className.length > 20) {
        return showMessage('名称不超过20个字')
      }
      // if (!this.maxNum) {
      //   return showMessage('人数限制不能为空')
      // }
      if (this.maxNum > 200) {
        return showMessage('人数限制不能超过200')
      }
      if (this.maxNum < 1) {
        return showMessage('人数限制不能少于1')
      }
      // if (!this.time) {
      //   return showMessage('开课时间不能为空')
      // }
      const content = {
        courseId: this.uuid,
        className: this.className,
        teacherId: this.teacther,
        classTeacherId: this.classTeacher,
        limit: this.maxNum,
        startTime: this.time,
        description: this.remark,
        isOpenForRegisteration: this.isOpenForRegisteration
      }
      // this.$socket.emit('addCoursesClass', content)
      this.$store.dispatch('addCoursesClass', content)
    },
    reset () {
      this.$router.push('/courseDetail')
      this.maxNum = 0
      this.classTeacher = Object
      this.teacher = Object
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

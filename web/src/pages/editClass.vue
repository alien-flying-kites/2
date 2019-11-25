<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="班级列表" to="/allClass"/>
        <q-breadcrumbs-el label="班级修改"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center">
          <div class="col-3">课程名称</div>
           <q-select color="white"
            inverted
            disabled=true readonly="readonly"
            separator
            v-model="name"
            :options="courseOptionList"
            class="col-9 text_white"
          />
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
          <q-input inverted color="white" class="col-9 text_white" type="number" v-model.trim="maxNum"/>
        </div>
        <!-- <div class="row flex-center mar_10">
          <div class="col-3">开课时间<span class="text-negative">*</span></div>
          <q-datetime v-model="time"  :min="today" type="date" class="col-9 text_white"  placeholder="4月15号"/>
        </div> -->
        <!-- <div class="row flex-center mar_10">
          <div class="col-3">上课时间</div>
          <q-datetime v-model="classTime" type="datetime" :value="classTime" :min="today" class="col-9 text_white"  @change="val => { classTime = val }"/>
        </div>
        <div class="row flex-center mar_10" v-if="this.classTime">
          <div class="col-3">持续时间 </div>
          <q-input inverted color="white" class="col-6 text_white" type="number" v-model.trim="duration" placeholder="教室一"/>
          <div class="col-3">小时 </div>
        </div>
        <div class="row flex-center mar_10" v-if="this.duration">
          <div class="col-3">是否重复 </div>
           <q-select color="white"
            inverted
            separator
            v-model="isRepeat"
            :options="isRepeatOption"
            class="col-9 text_white"
          />
        </div>
        <div class="row flex-center mar_10" v-if="this.duration">
          <div class="col-3">重复频率 </div>
           <q-select color="white"
            inverted
            separator
            v-model="frequency"
            :options="frequencyOption"
            class="col-9 text_white"
          />
        </div>
        <div class="row flex-center mar_10" v-if="this.isRepeat===1">
          <div class="col-3">重复 </div>
          <q-input inverted color="white" class="col-6 text_white" type="number" v-model.trim="weeks" placeholder="教室一"/>
          <div class="col-3">周 </div>
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
// import { genRandomStr } from '../plugins/common'
import { mapGetters } from 'vuex'
// import { date } from 'quasar'

// import axios from 'axios'
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
      time: 1477298414674,
      courseId: '',
      classId: '',
      duration: 0,
      className: '',
      class: '',
      phoneNumber: '',
      selectedRole: null,
      isOpenForRegisteration: true,
      weeks: null,
      isRepeat: null,
      frequency: 1,
      RegisterationoptionList: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      isRepeatOption: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        }
      ],
      frequencyOption: [
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        },
        {
          label: '4',
          value: 4
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'teacherOptionList', 'classAdminOptionList', 'courseOptionList'])
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
    serverData: function (value:any) {
      if (!value || value.ok !== 1) {
        return
      }
      if (value.errCode) {
        return showMessage('请求出错了', 'err')
      }
      this.$router.replace('/allClass')
    },
    teacherOptionList: function (v:any) {
      if (!v) return
      // var self = this
      v.some((val, index) => {
        if (val.label === this.teacher) {
          this.teacher = val.value
          return true
        } else {
          return false
        }
      })
    },
    classAdminOptionList: function (v:any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        // console.log(self.classTeacher)
        if (val.label === self.classTeacher) {
          self.classTeacher = val.value
          return true
        } else {
          return false
        }
      })
    },
    courseOptionList: function (v:any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        // console.log(self.name)
        if (val.label === self.name) {
          self.name = val.value
          return true
        }
      })
    }
  },
  beforeMount () {
    this.$socket.emit('teacherOptionList')
    this.$socket.emit('classAdminOptionList')
    this.$socket.emit('courseOptionList')
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    } else {
      // showMessage('请求出错了', 'err')
      this.$router.replace('/allClass')
    }
  },
  mounted () {
  },
  beforeDestroy () {
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    } else {
      // showMessage('请求出错了', 'err')
      this.$router.replace('/allClass')
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
      if (!this.name) {
        return showMessage('课程名称不能为空')
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
      // console.log(new Date().getTime())
      // console.log(this.time)
      // if (this.time < new Date()) {
      //   return showMessage('开课时间不能早于今天')
      // }
      // if (this.isOpenForRegisteration) {
      //   return showMessage('是否接收报名不能为空')
      // }
      // let timeStamp = Date.now()
      // let formattedString = date.formatDate(this.classTime, 'YYYY-MM-DD HH:mm:ss')
      // const classTime:any = {
      //   duration: this.duration,
      //   isRepeat: this.isRepeat,
      //   weeks: this.weeks,
      //   frequency: this.frequency,
      //   classTime: this.classTime
      // }
      // classTime = classTime.toString()
      const content = {
        id: this.classId,
        courseId: this.name,
        className: this.className,
        teacherId: this.teacther,
        classTeacherId: this.classTeacher,
        classTime: '',
        limit: this.maxNum,
        // startTime: this.time,
        description: this.remark,
        isOpenForRegisteration: this.isOpenForRegisteration
      }
      console.log(content)
      // console.log(content.classTime)
      // this.$socket.emit('updateCourseDetail', content)
      this.$store.dispatch('updateCourseDetail', content)
    },
    initData (val: any) {
      // console.log(val)
      this.name = val.courseId._id || ''
      this.className = val.name || ''
      this.maxNum = val.studentLimit || 0
      this.time = val.dateToOpenClass || ''
      // this.duration = JSON.parse(val.studyTime).duration || ''
      // this.isRepeat = JSON.parse(val.studyTime).isRepeat || ''
      // this.weeks = JSON.parse(val.studyTime).weeks || ''
      // this.frequency = JSON.parse(val.studyTime).frequency || 1
      this.remark = val.description || ''
      this.classId = val._id || ''
      this.isOpenForRegisteration = val.isOpenForRegisteration
      this.teacther = val.teacherId ? val.teacherId._id : Object
      this.classTeacher = val.adminId ? val.adminId._id : Object
    },
    cancle () {
      this.$router.replace('/allClass')
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

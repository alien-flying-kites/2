<template>
  <q-page class="">
    <div class="q-pa-sm q-mt-sm q-ml-sm ">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="排课列表" to="/getScheduleList"/>
        <q-breadcrumbs-el label="排课管理" to="/teachSchedule"/>
      </q-breadcrumbs>
      <!-- <q-breadcrumbs>
         <span class="title" @click="forward()"> 班级列表/</span>
         <span>学生列表</span>
      </q-breadcrumbs> -->
    </div>
     <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 800px">
        <div class="row flex-center mar_10 height50">
          <div class="col-2">实验室<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-9 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="labName"
              :options="labOptionList"
              class="col-9 text_white"
            />
          </div>
        </div>
        <div class="row flex-center mar_10 height50">
          <div class="col-2">上课日期<span class="text-negative">*</span></div>
          <q-datetime :min="today" v-model="startDate" type="date" class="col-9" @focus="checklab()"/>
        </div>
        <div class="row flex-center mar_10 height50">
          <div class="col-2">上课开始时间<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-1 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="startTime"
              :options="startTimeOptionList"
              class="col-9 text_white"
            />
          </div>
          <span>&nbsp;&nbsp;时&nbsp;&nbsp;</span>
          <div class="q-mt-lg col-1 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="startTimeMin"
              :options="startTimeMinOption"
              class="col-9 text_white"
            />
          </div>
          <span>&nbsp;&nbsp;分&nbsp;&nbsp;</span>
          <!-- <q-input inverted color="white" class="text_white" type='number' v-model.trim="startTime"/> -->
          <!-- <q-datetime v-model="startTime" type="time" class="col-3"/> -->
          <div class="col-1"></div>
          <div class="col-2">上课结束时间<span class="text-negative">*</span></div>
          <!-- <q-datetime v-model="endTime" type="time" class="col-3"/> -->
          <!-- <q-input inverted color="white" class="text_white" type='number' v-model.trim="endTime"/> -->
          <div class="q-mt-lg col-1 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="endTime"
              :options="startTimeOptionList"
              class="col-9 text_white"
            />
          </div>
          <span>&nbsp;&nbsp;时&nbsp;&nbsp;</span>
          <div class="q-mt-lg col-1 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="endTimeMin"
              :options="startTimeMinOption"
              class="col-9 text_white"
            />
          </div>
          <span>&nbsp;&nbsp;分&nbsp;&nbsp;</span>
        </div>
         <div class="row flex-center mar_10 height50">
          <div class="col-2">选择上课的班级<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-9 margin0">
            <q-radio v-model="classType" val='1' label="按学籍班"  class="margin0 mar_left_10"/>
            <q-radio v-model="classType" val='2' label="按课程班" class="margin0 mar_left_10"/>
          </div>
        </div>
        <div class="row flex-center mar_10 height50"  v-if="this.classType === '1'">
          <div class="col-2">上课班级<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-3 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="classaName2"
              :options="class2OptionList"
              class="col-9 text_white"
            />
          </div>
          <div class="col-1"></div>
          <div class="col-2">所学课程<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-3 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="courseName"
              :options="courseOptionList"
              class="col-9 text_white"
            />
          </div>
        </div>
        <div class="row flex-center mar_10 height50"  v-if="this.classType === '2'">
          <div class="col-2">上课班级<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-9 margin0">
            <q-select color="white"
              inverted
              separator
              v-model="className"
              :options="class1OptionList"
              class="col-9 text_white"
            />
          </div>
        </div>
        <div class="row flex-center mar_10 height50">
          <div class="col-2">是否重复<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-9 margin0">
            <q-radio v-model="isRepeated" val='true' label="是"  class="margin0 mar_left_10"/>
            <q-radio v-model="isRepeated" val='false' label="否" class="margin0 mar_left_10"/>
          </div>
        </div>
        <div class="row flex-center mar_10 height50" v-if="this.isRepeated === 'true'">
          <div class="col-2">重复模式<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-9 margin0">
            <q-radio v-model="repeatType" val='1' label="每天" @input="repeatTypeSelected" class="margin0 mar_left_10"/>
            <q-radio v-model="repeatType" val='2' label="隔天" @input="repeatTypeSelected" class="margin0 mar_left_10"/>
            <q-radio v-model="repeatType" val='3' label="每周" @input="repeatTypeSelected" class="margin0 mar_left_10"/>
            <q-radio v-model="repeatType" val='4' label="隔周" @input="repeatTypeSelected" class="margin0 mar_left_10"/>
            <q-radio v-model="repeatType" val='5' label="每月" @input="repeatTypeSelected" class="margin0 mar_left_10"/>
          </div>
        </div>
        <div class="row flex-center mar_10 height50" v-if="this.isRepeated === 'true' && (this.repeatType === '4' || this.repeatType === '3')">
          <div class="col-2"></div>
          <div class="q-mt-lg col-9 margin0">
            <q-checkbox v-model="repeatParams" val="1" label="周一" class="margin0 mar_left_10"/>
            <q-checkbox v-model="repeatParams" val="2" label="周二" class="margin0 mar_left_10"/>
            <q-checkbox v-model="repeatParams" val="3" label="周三" class="margin0 mar_left_10"/>
            <q-checkbox v-model="repeatParams" val="4" label="周四" class="margin0 mar_left_10"/>
            <q-checkbox v-model="repeatParams" val="5" label="周五" class="margin0 mar_left_10"/>
            <!-- <q-checkbox v-model="repeatParams" val="6" :disabled="avoidWeekend==='true'" :readonly="avoidWeekend==='true'" label="周六" class="margin0 mar_left_10"/>
            <q-checkbox v-model="repeatParams" val="7" :disabled="avoidWeekend==='true'" :readonly="avoidWeekend==='true'" label="周日" class="margin0 mar_left_10"/> -->
          </div>
        </div>
        <div class="row flex-center mar_10 height50" v-if="this.isRepeated === 'true' && this.repeatType === '5'">
          <div class="col-2" style=" text-align: right">每月&nbsp; &nbsp;</div>
          <div class="q-mt-lg col-4 margin0">
            <q-input inverted color="white" class="text_white" type='number' v-model.trim="month" @blur="check(month)"/>
          </div>
          <div class="col-2">&nbsp; &nbsp;号</div>
          <div class="col-2"></div>
        </div>
        <div class="row flex-center mar_10 height50" v-if="this.isRepeated === 'true' && this.repeatType === '2'">
          <div class="col-2" style=" text-align: right">隔&nbsp; &nbsp;</div>
          <div class="q-mt-lg col-4 margin0">
            <q-input inverted color="white" class="text_white" type='number' v-model.trim="days"/>
          </div>
          <div class="col-2" v-if="this.isRepeated === 'true' && this.repeatType === '2'">&nbsp; &nbsp;天</div>
          <div class="col-2"></div>
        </div>
         <div class="row flex-center mar_10 height50" v-if="this.isRepeated === 'true'">
          <div class="col-2">持续至<span class="text-negative">*</span></div>
          <q-datetime :min="today" v-model="endDate" type="date" class="col-9"/>
        </div>
         <div class="row flex-center mar_10 height50" v-if="this.isRepeated === 'true' && this.repeatType !== '3'&& this.repeatType !== '4'& this.repeatType !== '5'">
          <div class="col-2">是否避开周末<span class="text-negative">*</span></div>
          <div class="q-mt-lg col-9 margin0">
            <q-radio v-model="avoidWeekend" val='true' label="是"  @input="avoidWeekendSelected" class="margin0 mar_left_10"/>
            <q-radio v-model="avoidWeekend" val='false' label="否" class="margin0 mar_left_10"/>
          </div>
        </div>
        <q-btn-group flat class="block q-pt-md" align="center">
          <q-btn color="faded" label="重置" class="q-mr-md" @click="reset()"/>
          <q-btn color="primary" label="确认" @click="sure()"/>
        </q-btn-group>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import showMessage from '../plugins/showMessage'
// import showMessage from '../plugins/showMessage'
// import axios from 'axios'
// import { formatDate } from '../api/formData'

let repeatParams: Array<any> = []
const today = new Date()
export default Vue.extend({
  name: 'PageUser',
  computed: {
    ...mapGetters(['serverData', 'class1OptionList', 'operateData', 'courseOptionList', 'class2OptionList', 'labOptionList'])
  },
  data () {
    return {
      today,
      startTime: '',
      startTimeMin: '',
      endTime: '',
      endTimeMin: '',
      startDate: new Date(),
      endDate: new Date(),
      repeatType: '3',
      // repeatParams: 1,
      avoidWeekend: 'true',
      isRepeated: 'false',
      repeatParams,
      days: 1,
      month: 1,
      className: Object,
      classType: '',
      classaName2: Object,
      courseName: Object,
      classaName: Object,
      labName: Object,
      startTimeOptionList: [
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
        { label: '13', value: '13' },
        { label: '14', value: '14' },
        { label: '15', value: '15' },
        { label: '16', value: '16' },
        { label: '17', value: '17' },
        { label: '18', value: '18' },
        { label: '19', value: '19' },
        { label: '20', value: '20' },
        { label: '21', value: '21' },
        { label: '22', value: '22' },
        { label: '23', value: '23' }
      ],
      startTimeMinOption: [
        { label: '0', value: '0' },
        { label: '30', value: '0.5' }
      ]
    }
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      // console.log(value)
      // if (value.errCode !== 0) {
      //   showMessage(value.msg)
      // }
      // this.$router.replace('/allLab')
      let v = value.data
      if (!v) return false
      if (value.msg !== 'OK') {
        showMessage(value.msg, v.errCode)
      }
    },
    operateData: function (v) {
    }
  },
  beforeMount () {
    this.$socket.emit('classOptionList')
    this.$socket.emit('courseOptionList')
    this.$socket.emit('class2OptionList')
    this.$socket.emit('labOptionList')
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    avoidWeekendSelected () {
      if (this.repeatType === '3' || this.repeatType === '4') {
        const satIndex = this.repeatParams.indexOf('6')
        if (satIndex !== -1) {
          this.repeatParams.splice(satIndex, 1)
        }
        const sunIndex = this.repeatParams.indexOf('7')
        if (sunIndex !== -1) {
          this.repeatParams.splice(sunIndex, 1)
        }
      }
    },
    repeatTypeSelected () {
      this.repeatParams = []
    },
    reset () {
      this.isRepeated = 'false'
      this.avoidWeekend = 'true'
      this.repeatType = '3'
      this.startTime = ''
      this.repeatParams = []
      this.startDate = new Date()
      this.endDate = new Date()
      this.endTime = ''
      this.startTimeMin = ''
      this.endTimeMin = ''
      this.classType = ''
      this.labName = Object
    },
    sure () {
      if (!this.labName || this.labName === Object) {
        return showMessage('请选择实验室')
      }
      if (!this.startDate) {
        return showMessage('请选择开始日期')
      }
      if (this.isRepeated === 'true' && this.endDate <= this.startDate) {
        return showMessage('结束日期必须晚开始日期')
      }
      if (this.isRepeated === 'true' && !this.endDate) {
        return showMessage('请选择结束日期')
      }
      if (!this.startTime || this.startTime === '') {
        return showMessage('请选择上课开始时间小时项')
      }
      if (!this.startTimeMin || this.startTimeMin === '') {
        return showMessage('请选择上课开始时间分钟项')
      }
      if (!this.endTime || this.endTime === '') {
        return showMessage('请选择上课结束时间小时项')
      }
      if (!this.endTimeMin || this.endTimeMin === '') {
        return showMessage('请选择上课结束时间分钟项')
      }
      if ((Number(this.endTime) + Number(this.endTimeMin)) <= (Number(this.startTime) + Number(this.startTimeMin))) {
        return showMessage('上课结束时间必须晚于开始时间')
      }
      if (this.repeatType === '2') {
        this.repeatParams = []
        this.repeatParams.push(this.days)
      }
      if (this.isRepeated === 'true' && (this.repeatType === '4' || this.repeatType === '3')) {
        if (this.repeatParams.length <= 0) {
          return showMessage('请选择需要重复的星期')
        }
      }
      if (this.repeatType === '5') {
        if (this.month > 31) {
          return showMessage('所填日期不符合逻辑')
        }
        if (this.month === 0) {
          return showMessage('请填写重复时间参数')
        }
        if (this.month < 0) {
          return showMessage('所填日期不符合逻辑')
        }
        this.repeatParams = []
        this.repeatParams.push(this.month)
      }
      if (this.isRepeated === 'true' && (!this.avoidWeekend || this.avoidWeekend === '')) {
        return showMessage('请选择是否避开周末')
      }
      // if (!this.repeatType || this.repeatType === '') {
      //   return showMessage('请选择重复方式')
      // }
      if (!this.isRepeated || this.isRepeated === '') {
        return showMessage('请选择是否重复')
      }
      if (this.classType === '') {
        return showMessage('请选择班级形式')
      }
      if (this.classType === '2' && this.className === Object) {
        return showMessage('请选择班级')
      }
      if (this.classType === '1' && this.classaName2 === Object) {
        return showMessage('请选择班级')
      }
      if (this.classType === '1' && this.courseName === Object) {
        return showMessage('请选择课程')
      }
      if (this.isRepeated === 'true' && this.repeatType === '') {
        return showMessage('请选择重复方式')
      }
      if (this.isRepeated === 'true' && this.repeatType !== '1') {
        // console.log(111111)
        // console.log(this.repeatParams)
        // console.log(this.repeatParams.length)
        if (this.repeatParams === [] || (this.repeatParams.length === 1 && this.repeatParams[0] === 0)) {
          return showMessage('请填写重复时间参数')
        }
      } else if (this.isRepeated === 'true' && this.repeatType === '1') {
        // console.log(222222)
        this.repeatParams = []
      }
      const content:any = {
        labId: this.labName,
        // isRepeated: this.isRepeated,
        // avoidWeekend: this.avoidWeekend,
        repeatType: Number(this.repeatType),
        repeatParams: this.repeatParams.map(Number),
        date: this.startDate,
        endDate: this.endDate,
        startTime: Number(this.startTime) + Number(this.startTimeMin),
        endTime: Number(this.endTime) + Number(this.endTimeMin)
        // classId: classInfo.id,
        // courseId: classInfo.courseId
      }
      if (this.classType === '2' && this.className) {
        const classInfo:any = this.className
        content.classId = classInfo.id
        content.courseId = classInfo.courseId
      }
      if (this.classType === '1' && this.classaName2) {
        content.classId = this.classaName2
        content.courseId = this.courseName
      }
      if (this.avoidWeekend === 'true') {
        content.avoidWeekend = true
      } else if (this.avoidWeekend === 'false') {
        content.avoidWeekend = false
      }
      if (this.isRepeated === 'true') {
        content.isRepeated = true
      } else if (this.isRepeated === 'false') {
        content.isRepeated = false
      }
      // console.log(content)
      this.$store.dispatch('addSchedule', content)
      this.$router.replace('/getScheduleList')
    },
    check (data) {
      // console.log(data)
      if (data > 31) {
        return showMessage('所填日期不符合逻辑')
      }
    },
    checklab () {
      if (!this.labName || this.labName === Object) {
        return showMessage('请先选择实验室')
      }
    },
    checkDate () {
      if (!this.startDate) {
        return showMessage('请先选择开始日期')
      }
    }
    // checkStartTime () {
    //   if (!this.startTime || this.startTime === '') {
    //     return showMessage('请先选择上课开始时间')
    //   }
    // }
  }
})
</script>
<style scoped>
.box{
  padding: 10px 15px;
}
.margin0{
  margin-top: 0
}
.mar_left_10{
  margin-left: 10px
}
.height50{
  height: 50px;
  line-height: 50px;
}
</style>

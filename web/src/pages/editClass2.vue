<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="班级列表" to="/allClass2"/>
        <q-breadcrumbs-el label="班级修改"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center mar_10">
          <div class="col-3">班级名称<span class="text-negative">*</span></div>
           <q-input inverted color="white" class="col-9 text_white" v-model.trim="className"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">备注</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="remark"/>
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
      maxNum: 0,
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
      this.$router.replace('/allClass2')
    }
    // teacherOptionList: function (v:any) {
    //   if (!v) return
    //   // var self = this
    //   v.some((val, index) => {
    //     console.log(this.teacher)
    //     if (val.label === this.teacher) {
    //       this.teacher = val.value
    //       return true
    //     } else {
    //       return false
    //     }
    //   })
    // },
    // classAdminOptionList: function (v:any) {
    //   if (!v) return
    //   var self = this
    //   v.some((val, index) => {
    //     console.log(self.classTeacher)
    //     if (val.label === self.classTeacher) {
    //       self.classTeacher = val.value
    //       return true
    //     } else {
    //       return false
    //     }
    //   })
    // },
    // courseOptionList: function (v:any) {
    //   if (!v) return
    //   var self = this
    //   v.some((val, index) => {
    //     console.log(self.name)
    //     if (val.label === self.name) {
    //       self.name = val.value
    //       return true
    //     }
    //   })
    // }
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
      this.$router.replace('/allClass2')
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
      this.$router.replace('/allClass2')
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
      const content = {
        id: this.classId,
        className: this.className,
        description: this.remark
      }
      console.log(content)
      // this.$socket.emit('updateCourseDetail', content)
      this.$store.dispatch('updateClass2', content)
    },
    initData (val: any) {
      console.log(val)
      this.className = val.name || ''
      this.remark = val.description || ''
      this.classId = val._id || ''
    },
    cancle () {
      this.$router.replace('/allClass2')
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

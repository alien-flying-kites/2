<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="实验室列表" to="/allLab"/>
        <q-breadcrumbs-el label="实验室修改"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
         <div class="row flex-center mar_10">
          <div class="col-3">实验室名称名称<span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" v-model.trim="coursename" class="col-9 q-pr-md text_white" value="coursename"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">实验室管理员</div>
           <q-select color="white"
            inverted
            separator
            v-model="courseTeacher"
            :options="labAdminOptionList"
            class="col-9 text_white"
          />
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">备注</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="remark"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">实验室位置</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="location"/>
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

export default Vue.extend({
  components: {
  },
  data () {
    return {
      hasData: 0,
      nodeName: '',
      offset: 0,
      flag: false,
      modalShow: false,
      coursename: '',
      courseTeacher: Object,
      remark: '',
      uuid: '',
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
      ]
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'labAdminOptionList'])
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
    serverData: function (value) {
      console.log(value)
      if (!value) return
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
      this.$router.replace('/allLab')
      let v = value.data
      if (!v) return
      if (v.msg) {
        showMessage(v.msg, v.errCode)
      }
    },
    courseAdminOptionList: function (v:any) {
      if (!v) return
      var self = this
      v.some((val, index) => {
        if (val.label === self.courseTeacher) {
          self.courseTeacher = val.value
          return true
        }
      })
    }
  },
  beforeMount () {
    this.$socket.emit('labAdminOptionList')
    const rowData = this.$route.params.rowData
    if (rowData) {
      this.initData(rowData)
    } else {
      // showMessage('请求出错了', 'err')
      this.$router.replace('/allLab')
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    modifyAccount () {
      if (!this.coursename) {
        return showMessage('课程名不能为空')
      }
      // if (!this.courseTeacher) {
      //   return showMessage('课程管理员不能为空')
      // }
      // if (!this.remark) {
      //   return showMessage('课程说明不能为空')
      // }
      const content = {
        name: this.coursename,
        // adminId: this.courseTeacher,
        description: this.remark,
        location: this.location,
        id: this.uuid
      }
      this.$store.dispatch('updateLab', content)
      // this.$socket.emit('updateCourse', content)
    },
    initData (val: any) {
      console.log(val)
      this.coursename = val.name || ''
      // this.courseTeacher = val.adminId ? val.adminId._id : Object
      this.remark = val.description || ''
      this.location = val.location || ''
      this.uuid = val._id || null
    },
    cancle () {
      this.$router.replace('/allLab')
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

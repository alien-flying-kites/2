<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="实验室列表" to="/allLab"/>
        <q-breadcrumbs-el label="实验室添加"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center mar_10">
          <div class="col-3">实验室名称<span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" v-model.trim="coursename" class="col-9 q-pr-md text_white" value="coursename"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">实验室描述</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="description"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">实验室位置</div>
          <q-input inverted color="white" class="col-9 text_white" v-model.trim="location"/>
        </div>
        <div class="row flex-center">
          <div class="col-3">实验室管理员</div>
           <q-select color="white"
            inverted
            separator
            v-model="courseAdmin"
            :options="labAdminOptionList"
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
import { genRandomStr } from '../plugins/common'
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
      courseAdmin: Object,
      description: '',
      location: '',
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
    ...mapGetters(['serverData', 'operateData', 'courseList', 'labAdminOptionList', 'handleOpers'])
  },
  watch: {
    serverData: function (value) {
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
    this.$socket.emit('labAdminOptionList')
  },
  mounted () {
  },
  methods: {
    addAccount () {
      if (!this.coursename) {
        return showMessage('实验室名称不能为空')
      }
      // if (!this.courseAdmin) {
      //   return showMessage('实验管理员不能为空')
      // }
      // if (!this.description) {
      //   return showMessage('实验室描述不能为空')
      // }
      const content = {
        name: this.coursename,
        adminId: this.courseAdmin,
        description: this.description,
        location: this.location
      }
      // console.log('添加课程信息', content)
      this.$store.dispatch('addLab', content)
    },
    reset () {
      this.$router.replace('/allLab')
      this.coursename = ''
      this.courseAdmin = Object
      this.description = ''
    },
    refresh () {
      this.password = genRandomStr()
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

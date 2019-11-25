<template>
  <q-page>
    <div class="q-pa-sm q-mt-sm q-ml-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="教案列表" to="/lessonPlan"/>
        <q-breadcrumbs-el label="上传教案"/>
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md row flex-center">
      <div class="col input-box" style="maxWidth: 460px">
        <div class="row flex-center mar_10">
          <div class="col-3">类型 <span class="text-negative">*</span></div>
           <q-select color="white"
            inverted
            separator
            v-model="selectedType"
            :options="optionList"
            class="col-9 text_white"
          />
        </div>
         <div class="row flex-center mar_10">
          <div class="col-3">班级名称</div>
           <q-select color="white"
            inverted
            separator
            v-model="className"
            :options="classOptionList"
            class="col-9 text_white"
          />
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">文件名称 <span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" class="col-9 text_white" v-model.trim="name"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">文件说明 <span class="text-negative">*</span></div>
          <q-input inverted color="white" type="text" class="col-9 text_white" v-model.trim="description"/>
        </div>
        <div class="row flex-center mar_10">
          <div class="col-3">上传 <span class="text-negative">*</span></div>
          <q-uploader
            :url="url"
            :hide-upload-progress='progress'
            class="col-9"
            :after="[
              {
                icon: 'warning',
                handler () {
                  // do something...
                }
              }
            ]"
          />
          <!-- <q-input  color="white" type="file" class="col-9 pwd-input text_white" v-model.trim="file">
            <q-icon color="primary"  size="24px" class="float-right icon-posi"/>
          </q-input> -->
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
// import axios from 'axios'

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
      phoneNumber: '',
      password: genRandomStr(),
      description: '',
      name: '',
      selectedStatus: 2,
      selectedType: 1,
      progress: true,
      className: '',
      file: '',
      url: '',
      optionList: [
        {
          label: '教案',
          value: 1
        },
        {
          label: '示例代码',
          value: 2
        },
        {
          label: '作业',
          value: 3
        }
      ],
      optionclass: [
        {
          label: '教案',
          value: 1
        },
        {
          label: '示例代码',
          value: 2
        },
        {
          label: '作业',
          value: 3
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['serverData', 'operateData', 'classOptionList', 'lessonOptionList', 'currentUser'])
  },
  watch: {
    serverData: function (value) {
      if (!value) return
      if (value && value.nModified) {
        this.$router.replace('/myLessonPlan')
        // const params = {}
        // this.$store.dispatch('signupList', params)
      }
      if (value.errCode !== 0) {
        showMessage(value.msg)
      }
      let v = value.data
      if (!v) {
        return false
      } else {
        this.$router.replace('/myLessonPlan')
      }
      // if (v.errCode !== 0) {
      //   this.serverPagination.rowsNumber = v.data ? v.data.count : 0
      //   this.tableData = v
      // }
      if (value.msg) {
        showMessage(value.msg, value.errCode)
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
    this.$socket.emit('lessonOptionList')
    this.$socket.emit('classOptionList')
  },
  mounted () {
    this.uuid = window.localStorage.getItem('uuid')
    // let refreshBtn = this.$refs.refreshBtn
  },
  methods: {
    addAccount () {
      if (this.selectedType === null) {
        return showMessage('请选择文件类型')
      }
      const content = {
        name: this.name,
        description: this.description,
        teacherId: this.uuid,
        lessonId: this.lessonName,
        classId: this.className,
        lessonMaterialItems: {
          materialItemType: this.selectedType,
          filePath: 'http://img4.imgtn.bdimg.com/it/u=2146046871,2611785107&fm=26&gp=0.jpg',
          description: this.description }
      }
      console.log('添加用户信息', content)
      this.$store.dispatch('addLessonMaterial', content)
    },
    reset () {
      this.$router.replace('/myLessonPlan')
      this.nodeName = ''
      this.description = ''
      this.file = ''
      this.name = ''
      this.className = ''
      this.selectedType = 1
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

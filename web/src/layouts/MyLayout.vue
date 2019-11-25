<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title>实验室管理系统
          <!-- <div slot="subtitle">Running on Quasar v{{ $q.version }}</div> -->
        </q-toolbar-title>
        <span style="display: inherit">
          <q-icon name="account_circle" size="1.5rem" class="q-mr-sm"/>
          <span class="name-custom">{{currentUser.displayName}}</span>
          <q-popover class="q-mt-sm q-mr-sm round-borders popover-custom">
            <q-list link>
              <q-item @click.native="$router.push('/userbaseInfo')">个人资料</q-item>
              <q-item @click.native="logout">退出登录</q-item>
            </q-list>
          </q-popover>
        </span>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list no-border link inset-delimiter>
        <!-- <q-list-header>导航</q-list-header> -->
        <!-- <q-item to="/Role" @click.native="itemClick" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
          <q-item-side icon="school"/>
          <q-item-main label="角色管理" sublabel="管理员权限"/>
        </q-item> -->
        <q-item to="/User" @click.native="itemClick" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
         <!-- <q-item-separator inset/> -->
          <q-item-side icon="event"/>
          <q-item-main label="用户管理" sublabel=""/>
        </q-item>
        <q-item @click.native="itemClick" to="/userbaseInfo" >
          <q-item-separator inset/>
          <q-item-side icon="school"/>
          <q-item-main label="基本信息"/>
        </q-item>
        <q-item @click.native="itemClick" to="/myTeachClass" v-if="isTeacher(currentUser.roleTypes)">
          <q-item-separator inset/>
          <q-item-side icon="face"/>
          <q-item-main label="我的任课班级"/>
        </q-item>
        <q-item @click.native="itemClick" to="/mySelection" v-if="isStudent(currentUser.roleTypes)">
          <q-item-separator inset/>
          <q-item-side icon="all_inbox"/>
          <q-item-main label="我的班级" sublabel="学生权限"/>
        </q-item>
        <!-- <q-item @click.native="itemClick" to="/userbaseInfo" >
          <q-item-separator inset/>
          <q-item-side icon="face"/>
          <q-item-main label="基本信息"/>
        </q-item> -->
        <!-- <q-list v-if="showInfoItem" no-border link inset-delimiter>
          <q-item to="/userbaseInfo" @click.native="itemClick">
            <q-item-side icon/>
            <q-item-main label="基本信息"/>
          </q-item>
          <q-item to="/myCourse" @click.native="itemClick" v-if="isCourseAdmin(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="我的课程" sublabel="课程管理员权限"/>
          </q-item>
          <q-item to="/myClass" @click.native="itemClick" v-if="isClassAdmin(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="我的班级" sublabel="班级管理员权限"/>
          </q-item>
          <q-item to="/mySelection" @click.native="itemClick" v-if="isStudent(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="我的选课" sublabel="学生权限"/>
          </q-item>
          <q-item to="/myLabCourse" @click.native="itemClick" v-if="isLabAdmin(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="我的实验室" sublabel="实验室管理员"/>
          </q-item>
          <q-item to="/myTeachClass" @click.native="itemClick" v-if="isTeacher(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="我的任课班级" sublabel="教师"/>
          </q-item>
        </q-list> -->
        <q-item @click.native="itemClick"  to="/allCourse" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
          <!-- <q-item-separator inset/> -->
          <q-item-side icon="chat"/>
          <q-item-main label="课程列表"/>
        </q-item>
        <q-item @click.native="itemClick"  to="/allClass" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
          <q-item-side icon="assessment"/>
          <q-item-main label="课程班列表"/>
        </q-item>
        <q-item @click.native="itemClick"  to="/allClass2" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
          <q-item-side icon="note_add"/>
          <q-item-main label="学籍班列表"/>
        </q-item>
        <q-item @click.native="itemClick"  to="/getScheduleList" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
          <q-item-side icon="bookmarks"/>
          <q-item-main label="排课管理"/>
        </q-item>
          <!-- <q-list v-if="showCourseItem" no-border link inset-delimiter>
          <q-item to="/allCourse" @click.native="itemClick" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="课程列表" sublabel="全部课程列表"/>
          </q-item>
          <q-item to="/alllab" @click.native="itemClick" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="实验室列表" />
          </q-item>
          <q-item to="/allClass" @click.native="itemClick" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="班级列表" sublabel="全部班级列表"/>
          </q-item>
        </q-list> -->
        <!-- <q-item-separator inset /> -->
        <q-item to="/signup" @click.native="itemClick" v-if="isStudent(currentUser.roleTypes)">
          <q-item-side icon="record_voice_over"/>
          <q-item-main label="报名列表"/>
        </q-item>
        <q-item to="/signupManage" @click.native="itemClick" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
        <!-- <q-item-separator inset/> -->
          <q-item-side icon="rss feed"/>
          <q-item-main label="报名审核"/>
        </q-item>
         <q-item @click.native="itemClick"  to="/lessonPlan" v-if="isSuperAdmin(currentUser.roleTypes)">
           <!-- <q-item-separator inset/> -->
          <q-item-side icon="assignment"/>
          <q-item-main label="教案列表"/>
        </q-item>
        <q-item @click.native="itemClick"  to="/myLessonPlan" v-if="isTeacher(currentUser.roleTypes)">
           <!-- <q-item-separator inset/> -->
          <q-item-side icon="copyright"/>
          <q-item-main label="我的教案"/>
        </q-item>
        <!-- <q-list v-if="showlessonItem" no-border link inset-delimiter>
          <q-item to="/myLessonPlan" @click.native="itemClick" v-if="isTeacher(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="我的教案" sublabel="我的教案"/>
          </q-item>
          <q-item to="/lessonPlan" @click.native="itemClick" v-if="isSuperAdmin(currentUser.roleTypes) || isSchoolAdmin(currentUser.roleTypes)">
            <q-item-side icon/>
            <q-item-main label="教案列表" sublabel="全部教案列表"/>
          </q-item>
        </q-list> -->
      </q-list>
    </q-layout-drawer>
    <q-modal v-model="modalShow" class minimized content-classes="modal-posi">
      <div class="q-pa-lg">
        <p class="text-tertiary">是否要退出登录？</p>
        <q-btn-group flat class="q-pb-md q-pt-md float-right">
          <q-btn color="negative" label="退出" class="q-mr-md round-borders" @click="confirmLogout"/>
          <q-btn color="faded" @click="modalShow=false" label="取消" class="round-borders"/>
        </q-btn-group>
      </div>
    </q-modal>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { openURL } from 'quasar'
import { mapGetters } from 'vuex'
import {
  REMOVE_USER_FROM_LOCAL
} from '../store/module/mutation-types'
import { RoleType } from '../plugins/common'
export default Vue.extend({
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      modalShow: false,
      modalTip: false,
      enablePull: false,
      showCourseItem: false,
      showInfoItem: false,
      showlessonItem: false
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {
    currentUser: function (value) {
    },
    itemClick: function (data) {
      console.log(data)
    }
  },
  beforeMount () {
  },
  mounted () {
    // this.enablePull = this.$refs.page && this.$refs.page.enablePull
  },
  updated () {
    // this.enablePull = this.$refs.page && this.$refs.page.enablePull
  },
  methods: {
    openURL,
    refresher (done: any) {
      // if (this.$refs.page.enablePull) {
      //   this.$refs.page.pullToRefresh(done)
      // }
    },
    relogin () {
      this.$router.replace('/login')
    },
    switchDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
      // localStorage.setItem('drawerStatus', this.leftDrawerOpen)
    },
    isSuperAdmin (roleTypes: number) {
      return (roleTypes & RoleType.SuperAdmin) === RoleType.SuperAdmin
    },
    isSchoolAdmin (roleTypes: number) {
      return (roleTypes & RoleType.SchoolAdmin) === RoleType.SchoolAdmin
    },
    isCourseAdmin (roleTypes: number) {
      return (roleTypes & RoleType.CourseAdmin) === RoleType.CourseAdmin
    },
    isClassAdmin (roleTypes: number) {
      return (roleTypes & RoleType.ClassAdmin) === RoleType.ClassAdmin
    },
    isLabAdmin (roleTypes: number) {
      return (roleTypes & RoleType.LabAdmin) === RoleType.LabAdmin
    },
    isTeacher (roleTypes: number) {
      return (roleTypes & RoleType.Teacher) === RoleType.Teacher
    },
    isStudent (roleTypes: number) {
      return (roleTypes & RoleType.Student) === RoleType.Student
    },
    logout () {
      setTimeout(() => {
        this.modalShow = true
      }, 100)
    },
    confirmLogout () {
      this.$store.commit(REMOVE_USER_FROM_LOCAL)
      this.$socket.close()
      setTimeout(() => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('uuid')
        // this.$store.dispatch('login')
        this.$router.replace('/login')
      }, 100)
    },
    clickHeader () {
      this.$router.push('/')
    },
    itemClick () {
      if (document.body.clientWidth <= 992) {
        // this.leftDrawerOpen = false
      }
    },
    // 课程与班级
    showItemFun () {
      if (this.showCourseItem) {
        this.showCourseItem = false
      } else {
        this.showCourseItem = true
      }
    },
    // 用户信息
    showInfoFun () {
      if (this.showInfoItem) {
        this.showInfoItem = false
      } else {
        this.showInfoItem = true
      }
    },
    //  教案折叠
    showLessonItemFun () {
      if (this.showlessonItem) {
        this.showlessonItem = false
      } else {
        this.showlessonItem = true
      }
    }
  }
})
</script>

<style>
.active-color {
  background: #bdbdbd80;
}
.name-custom {
  font-size: 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  max-width: 260px;
}
@media screen and (max-width: 500px) {
  .name-custom {
    max-width: 80px;
  }
}
.popover-custom {
  right: 10px;
  left: inherit !important;
  width: 100px;
}
.list-header-custom {
  height: 100px;
  line-height: 100px;
  background: #fff;
}
.q-list-link > .q-item {
  height: 45px;
}
.q-layout-drawer-left {
  width: 260px;
}
.sub_menu > div {
  padding-left: 50px;
}
@media (min-height: 400px) {
  .modal-posi {
    margin-top: -200px;
  }
}
.custom-container {
  min-height: calc(100vh - 58px) !important;
}
.q-item-separator-inset-component{
  margin-left: 0px
}
</style>

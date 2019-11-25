import MyLayout from 'layouts/MyLayout.vue'
import Login from 'pages/login.vue'// 登录
import register from 'pages/register.vue'// 注册
import Index from 'pages/Index.vue'
import Error404 from 'pages/Error404.vue'
import Role from 'pages/role.vue'// 角色列表
import User from 'pages/user.vue'// 用户管理列表
import addUser from 'pages/addUser.vue'// 添加用户，只有管理员有权限
import editUser from 'pages/editUser.vue'// 修改编辑用户
import changePwd from 'pages/changePwd.vue'
import userbaseInfo from 'pages/userbaseInfo.vue'
import myCourse from 'pages/myCourse.vue'
import allCourse from 'pages/allCourse.vue'// 显示全部的课程信息，课程列表
import allClass from 'pages/allClass.vue'// 显示所有的班级信息，班级列表
import myClass from 'pages/myClass.vue'// 显示班级管理员所管理的班级信息
import mySelection from 'pages/mySelection.vue'// 显示学生的已报名信息
import signup from 'pages/signupPage.vue'// 学生报名页面
import signupManage from 'pages/signupManage.vue'// 审核报名信息页面，管理员权限
import myLabCourse from 'pages/myLabCourse.vue'
import alllab from 'pages/alllab.vue'
import lessonPlan from 'pages/lessonPlan.vue'
import myLessonPlan from 'pages/myLessonPlan.vue'
import courseDetail from 'pages/courseDetail.vue'
import addCourse from 'pages/addCourse.vue'
import addCourseClass from 'pages/addCourseClass.vue'
import editBaseInfo from 'pages/editUserBaseInfo.vue'
import addlessonPlan from 'pages/addlessonPlan.vue'
import editCourse from 'pages/editCourse.vue'
import editCourseDetail from 'pages/editCourseDetail.vue'
import addClass from 'pages/addClass.vue'
import editClass from 'pages/editClass.vue'
import lessonList from 'pages/lessonList.vue'
import addLesson from 'pages/addLesson.vue'
import editLesson from 'pages/editLesson.vue'
import myTeachClass from 'pages/myTeachClass.vue'
import addLab from 'pages/addLab.vue'
import editLab from 'pages/editLab.vue'
import studentList from 'pages/studentList.vue'
import addClass2 from 'pages/addClass2.vue'
import editClass2 from 'pages/editClass2.vue'
import allClass2 from 'pages/allClass2.vue'
import class2StudentList from 'pages/class2StudentList.vue'
import addStudent from 'pages/addStudent.vue'
import addSchedule from 'pages/teachSchedule.vue'
import getScheduleList from 'pages/scheduleList.vue'
import editSchedule from 'pages/editSchedule.vue'
import lessonDetail from 'pages/lessonDetail.vue'
import submitHomework from 'pages/submitHomework.vue'
import homeworkList from 'pages/homeworkList.vue'
import serverState from 'pages/serverState.vue'

const routes = [
  // path: '/pages',
  // component: () => import('layouts/MyLayout.vue'),
  // children: [
  //   { path: '', component: () => import('pages/Index.vue') }
  // ],
  { path: '/login', component: Login },
  { path: '/register', component: register },
  { path: '/changePwd', component: changePwd },
  { path: '/',
    component: MyLayout,
    children: [
      { path: '/', component: Index, meta: { requireAuth: true } },
      { path: '/Role', component: Role, meta: { requireAuth: true } },
      { path: '/User', component: User, meta: { requireAuth: true } },
      { path: '/addUser', component: addUser, meta: { requireAuth: true } },
      { path: '/editUser', component: editUser, name: 'editUser', meta: { requireAuth: true } },
      { path: '/userbaseInfo', component: userbaseInfo, meta: { requireAuth: true } },
      { path: '/myCourse', component: myCourse, meta: { requireAuth: true } },
      { path: '/allCourse', component: allCourse, meta: { requireAuth: true } },
      { path: '/allClass', component: allClass, meta: { requireAuth: true } },
      { path: '/myClass', component: myClass, meta: { requireAuth: true } },
      { path: '/mySelection', component: mySelection, meta: { requireAuth: true } },
      { path: '/signup', component: signup, meta: { requireAuth: true } },
      { path: '/signupManage', component: signupManage, meta: { requireAuth: true } },
      { path: '/myLabCourse', component: myLabCourse, meta: { requireAuth: true } },
      { path: '/alllab', component: alllab, meta: { requireAuth: true } },
      { path: '/lessonPlan', component: lessonPlan, meta: { requireAuth: true } },
      { path: '/myLessonPlan', component: myLessonPlan, meta: { requireAuth: true } },
      { path: '/courseDetail', component: courseDetail, name: 'courseDetail', meta: { requireAuth: true } },
      { path: '/addCourse', component: addCourse, meta: { requireAuth: true } },
      { path: '/addCourseClass', component: addCourseClass, name: 'addCourseClass', meta: { requireAuth: true } },
      { path: '/editBaseInfo', component: editBaseInfo, name: 'editBaseInfo', meta: { requireAuth: true } },
      { path: '/addlessonPlan', component: addlessonPlan, meta: { requireAuth: true } },
      { path: '/editCourse', component: editCourse, name: 'editCourse', meta: { requireAuth: true } },
      { path: '/editCourseDetail', component: editCourseDetail, name: 'editCourseDetail', meta: { requireAuth: true } },
      { path: '/addClass', component: addClass, meta: { requireAuth: true } },
      { path: '/editClass', component: editClass, name: 'editClass', meta: { requireAuth: true } },
      { path: '/lessonList', component: lessonList, name: 'lessonList', meta: { requireAuth: true } },
      { path: '/editLesson', component: editLesson, name: 'editLesson', meta: { requireAuth: true } },
      { path: '/addLesson', component: addLesson, meta: { requireAuth: true } },
      { path: '/myTeachClass', component: myTeachClass, meta: { requireAuth: true } },
      { path: '/addLab', component: addLab, meta: { requireAuth: true } },
      { path: '/editLab', component: editLab, name: 'editLab', meta: { requireAuth: true } },
      { path: '/studentList', component: studentList, name: 'studentList', meta: { requireAuth: true } },
      { path: '/addClass2', component: addClass2, meta: { requireAuth: true } },
      { path: '/editClass2', component: editClass2, name: 'editClass2', meta: { requireAuth: true } },
      { path: '/allClass2', component: allClass2, meta: { requireAuth: true } },
      { path: '/class2StudentList', component: class2StudentList, name: 'class2StudentList', meta: { requireAuth: true } },
      { path: '/addStudent', component: addStudent, name: 'addStudent', meta: { requireAuth: true } },
      { path: '/addSchedule', component: addSchedule, name: 'addSchedule', meta: { requireAuth: true } },
      { path: '/getScheduleList', component: getScheduleList, meta: { requireAuth: true } },
      { path: '/editSchedule', component: editSchedule, name: 'editSchedule', meta: { requireAuth: true } },
      { path: '/lessonDetail', component: lessonDetail, name: 'lessonDetail', meta: { requireAuth: true } },
      { path: '/submitHomework', component: submitHomework, name: 'submitHomework', meta: { requireAuth: true } },
      { path: '/homeworkList', component: homeworkList, name: 'homeworkList', meta: { requireAuth: true } },
      { path: '/serverState', component: serverState, name: 'serverState', meta: { requireAuth: true } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: Error404
  })
}

export default routes

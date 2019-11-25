import courseAPI from '../../api/course'
import { actionType, deepCopy } from './action-types'
import { Commit } from 'vuex'
import showMessage from '../../plugins/showMessage';

const state = {
  courseList: [],
  classList: [],
  courseclassList: [],
  optionList: [],
  signupList:[],
  checkedArr: [],
  lessonList:[],
  lessonMaterialList:[],
  homeworklList:[]
}
const getters = {
  courseList: (state: any) => state.courseList,
  classList: (state: any) => state.classList,
  courseclassList: (state: any) => state.courseclassList,
  signupList: (state: any) => state.signupList,
  lessonList: (state: any) => state.lessonList,
  lessonMaterialList: (state: any) => state.lessonMaterialList,
  homeworklList: (state: any) => state.homeworklList
}

const actions = {
  //向服务器请求 getCourseList && 处理服务器返回数据“ setCourseList ”
  getCourseList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getCourseList(params)
  },
  SOCACT_setCourseList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSE_LIST', params)
    }
  },
  //向服务器请求 getClassList && 处理服务器返回数据“ setclassList ”
  getClassList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getClassList(params)
  },
  SOCACT_setclassList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  signUpClassIndex ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.signUpClassIndex(params)
  },
  SOCACT_setsignUpClassIndex({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    console.log(params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  //向服务器请求 getCourseDetail && 处理服务器返回数据“ setCourseDetailList ”
  getCourseDetail ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getCourseDetail(params)
  },
  SOCACT_setCourseDetailList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSECLASS_LIST', params)
    }
  },
  //向服务器请求 addCoursesClass && 处理服务器返回数据“ setAddCourseClass ”
  addCoursesClass ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.addCoursesClass(params)
  },
  SOCACT_setAddCourseClass({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSECLASS_LIST', params)
    }
  },
  // 添加课程
  addCourse ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.addCourse(params)
  },
  SOCACT_setAddCourse({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSE_LIST', params)
    }
  },
  //更新课程
  updateCourse ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.updateCourse(params)
  },
  SOCACT_setupdateCourse({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSE_LIST', params)
    }
  },
  //向服务器请求 singup && 处理服务器返回数据“ setsingup ”
  singup ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.singup(params)
  },
  SOCACT_setsingup({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_SIGNUP_LIST', params)
    }
  },
      //向服务器请求 signupList && 处理服务器返回数据“ setAddCourseClass ”
  signupList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.signupList(params)
  },
  SOCACT_setsignupList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_SIGNUP_LIST', params)
    }
  },
 // 获取课次列表
  getLessonList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getLessonList(params)
  },
  getLessonMaterialList ({ commit }, params) {
  commit('RESET_SERVER_DATA')
  courseAPI.getLessonMaterialList(params)
  },
  SOCACT_setLessonList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LESSON_LIST', params)
    }
  },
 //向服务器请求 addLesson && 处理服务器返回数据“ addLesson ”
  addLesson ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.addLesson(params)
  },
  SOCACT_setaddLesson({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LESSON_LIST', params)
    }
  },
 //向服务器请求 updateSignupState && 处理服务器返回数据“setupdateUser”
  updateSignupState ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.updateSignupState(params)
  },
  SOCACT_setupdateSignupState({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_SIGNUP_LIST', params)
    }
  },

//向服务器请求 addLessonMaterial && 处理服务器返回数据“ addLessonMaterial ”
  addLessonMaterial ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.addLessonMaterial(params)
  },
  SOCACT_setaddLessonMaterial({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LESSONMATERIAL_LIST', params)
    }
  },
 //向服务器请求 getLessonList && 处理服务器返回数据“ getLessonList ”
  getMyLessonPlan ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getMyLessonPlan(params)
  },
  SOCACT_setgetMyLessonPlan({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LESSONMATERIAL_LIST', params)
    }
  },
  //向服务器请求 getAllLessonPlan && 处理服务器返回数据“ getAllLessonPlan ”
  getAllLessonPlan ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getAllLessonPlan(params)
  },
  SOCACT_setgetAllLessonPlan({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LESSONMATERIAL_LIST', params)
    }
  },
  // 获取我的报名班级
  getMyChooseClass ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getMyChooseClass(params)
  },
  SOCACT_setgetMyChooseClass({ commit }, params:any) {
    params.type = 1
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_SIGNUP_LIST', params)
    }
  },
  // 取消报名
  deleteMyChooseClass ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteMyChooseClass(params)
  },
  SOCACT_setdeleteMyChooseClass({ commit }, params:any) {
    params.type = 1
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_SIGNUP_LIST', params)
    }
  },
  
  // 获取我的任课班级
  getMyTeachClass ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getMyTeachClass(params)
  },
  SOCACT_setgetMyTeachClass({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
   //向服务器请求 getMyClass && 处理服务器返回数据“ getMyClass ”
   getMyClass ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getMyClass(params)
  },
  SOCACT_setgetMyClass({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
    //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  getMyCourse ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getMyCourse(params)
  },
  SOCACT_setgetMyCourse({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  deleteLesson ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteLesson(params)
  },
  SOCACT_setdeleteLesson({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LESSON_LIST', params)
    }
  },
  //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  deleteCourse ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteCourse(params)
  },
  SOCACT_setdeleteCourse({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSE_LIST', params)
    }
  },
  //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  updateCourseDetail ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.updateCourseDetail(params)
  },
  SOCACT_setupdateCourseDetail({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSE_LIST', params)
    }
  },
   //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
   updateLesson ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.updateLesson(params)
  },
  SOCACT_setupdateLesson({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LESSON_LIST', params)
    }
  },
   //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
   deleteCourseDetail ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteCourseDetail(params)
  },
  SOCACT_setdeleteCourseDetail({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSEDETAIL_LIST', params)
    }
  },
  //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  getStudentList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getStudentList(params)
  },
  SOCACT_setgetStudentList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  //向服务器请求 getClassList && 处理服务器返回数据“ setclassList ”
  getClass2List ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getClass2List(params)
  },
  SOCACT_setclass2List({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  //向服务器请求 addCoursesClass && 处理服务器返回数据“ setAddCourseClass ”
  addClass2 ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.addClass2(params)
  },
  SOCACT_setAddClass2({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSECLASS_LIST', params)
    }
  },
  //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  updateClass2 ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.updateClass2(params)
  },
  SOCACT_setupdateClass2({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSE_LIST', params)
    }
  },
  //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  getLClass2StudentList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getLClass2StudentList(params)
  },
  SOCACT_setgetLClass2StudentList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },

  
  //向服务器请求 addSchedule && 处理服务器返回数据“ setaddSchedule ”
  addSchedule ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.addSchedule(params)
  },
  SOCACT_setaddSchedule({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
    },
  //向服务器请求 getMyChooseClass && 处理服务器返回数据“ getMyChooseClass ”
  getMyStudyClass ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getMyStudyClass(params)
  },
  SOCACT_setgetMyStudyClass({ commit }, params:any) {
    params.type = 2
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_SIGNUP_LIST', params)
    }
  },
   //向服务器请求 getMyChooseClass && 处理服务器返回数据“ getMyChooseClass ”
  getMyStatusClass ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getMyStatusClass(params)
  },
  SOCACT_setgetMyStatusClass({ commit }, params:any) {
    params.type = 3
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_SIGNUP_LIST', params)
    }
  },
  //向服务器请求 addSchedule && 处理服务器返回数据“ setaddSchedule ”
  getScheduleList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getScheduleList(params)
  },
  SOCACT_setgetScheduleList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  
  //向服务器请求 addSchedule && 处理服务器返回数据“ setaddSchedule ”
  deleteSchedule ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteSchedule(params)
  },
  SOCACT_setdeleteSchedule({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  //向服务器请求 addSchedule && 处理服务器返回数据“ setaddSchedule ”
  lessonDetail ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.lessonDetail(params)
  },
  SOCACT_setlessonDetail({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
   //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  deleteClass2 ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteClass2(params)
  },
  SOCACT_setdeleteClass2({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSEDETAIL_LIST', params)
    }
  },
   //向服务器请求 getMyCourse && 处理服务器返回数据“ getMyCourse ”
  deleteClassStudent ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteClassStudent(params)
  },
  SOCACT_setdeleteClassStudent({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSEDETAIL_LIST', params)
    }
  },
  deleteClass2Student({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.deleteClass2Student(params)
  },
  SOCACT_setdeleteClass2Student({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_COURSEDETAIL_LIST', params)
    }
  },
  gethomeworklList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.gethomeworklList(params)
  },
  SOCACT_setgethomeworklList({ commit }, params:any) {
    commit('UPDATE_HOMEWORK_LIST', params)
    if(params.errCode === 0) {
      commit('UPDATE_HOMEWORK_LIST', params)
    }
  },
  getAllHomeworkList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.getAllHomeworkList(params)
  },
  SOCACT_setgetAllHomeworkList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_HOMEWORK_LIST', params)
    }
  },
  updateHomeworkScore ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.updateHomeworkScore(params)
  },
  SOCACT_setupdateHomeworkScore({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    // console.log(params)
    if(params.errCode === 0) {
      commit('UPDATE_HOMEWORK_LIST', params)
    }
  },
  //  班级详情（添加学生用）
  classDetail ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    courseAPI.classDetail(params)
  },
  SOCACT_setclassDetail({ commit }, params:any) {
    commit('UPDATE_CLASS_LIST', params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
   //  
  serverState ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    // console.log('serverState')
    courseAPI.serverState(params)
  },
  SOCACT_setserverState({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    // console.log(params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  },
  // 
  deleteServerState ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    // console.log('serverState')
    courseAPI.deleteServerState(params)
  },
  SOCACT_setdeleteServerState({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    // console.log(params)
    if(params.errCode === 0) {
      commit('UPDATE_CLASS_LIST', params)
    }
  }
}

const mutations = {
  UPDATE_COURSE_LIST (state:  any, payload: any) {
    state.courseList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.courseList = (data && data.rows) || []
  },
  UPDATE_CLASS_LIST (state:  any, payload: any) {
    state.classList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    // console.log(payload)
    const data = payload.data
    state.classList = (data && data.data) || []
  },
  UPDATE_COURSECLASS_LIST (state:  any, payload: any) {
    state.courseclassList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.courseclassList = (data && data.rows) || []
  },
  UPDATE_COURSEDETAIL_LIST (state:  any, payload: any) {
    state.classList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.classList = (data && data.rows) || []
  },
  // 
  UPDATE_CHECKED_ARR (state:  any, payload: any) {
    state.checkedArr = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.checkedArr = data || []
  },
  UPDATE_SIGNUP_LIST (state:  any, payload: any) {
    state.signupList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.signupList = data || []
  },
  UPDATE_LESSON_LIST (state:  any, payload: any) {
    state.lessonList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.lessonList = data || []
  },
  UPDATE_LESSONMATERIAL_LIST (state:  any, payload: any) {
    state.lessonMaterialList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    if ( payload &&payload.data) {
      const data = payload.data
      // console.log(data)
      state.lessonMaterialList = data || []
    }
  },
  UPDATE_HOMEWORK_LIST (state:  any, payload: any) {
    state.homeworklList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.homeworklList = data || []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
import {
  RESET_SERVER_DATA,
  UPDATE_SERVER_DATA,
  UPDATE_STUDENT_DATA,
  UPDATE_OPERATE_DATA,
  RESET_OPERATE_DATA
} from './mutation-types';
import showMessage from '../../plugins/showMessage';
import userAPI from '../../api/user'
// initial state
const state = {
  serverData: null, // request data from server
  promptMsg: null,
  operateData: null,
  studentData: null,
  teacherOptionList:[],  // 教师列表
  courseAdminOptionList:[], // 课程管理员列表
  classAdminOptionList:[], // 班级管理员
  labAdminOptionList:[], // 实验室管理员列表
  courseOptionList:[], // 课程列表
  classOptionList:[], // 班级列表
  classAdjustOptionList:[], // 班级列表
  class1OptionList:[], // 班级列表
  lessonOptionList:[], // 课次列表
  class2OptionList:[], // 班级列表
  class2OptionList1:[], // 班级列表
  studentOptionList:[], //学生列表
};
const getters = {
  promptMsg: (state: any) => state.promptMsg,
  serverData: (state: any) => state.serverData,
  studentData: (state: any) => state.studentData,
  operateData: (state: any) => state.operateData,
  teacherOptionList: (state: any) => state.teacherOptionList,
  courseAdminOptionList: (state: any) => state.courseAdminOptionList,
  classAdminOptionList: (state: any) => state.classAdminOptionList,
  labAdminOptionList: (state: any) => state.labAdminOptionList,
  courseOptionList: (state: any) => state.courseOptionList,
  classOptionList: (state: any) => state.classOptionList,
  classAdjustOptionList: (state: any) => state.classAdjustOptionList,
  class1OptionList: (state: any) => state.class1OptionList,
  class2OptionList: (state: any) => state.class2OptionList,
  class2OptionList1: (state: any) => state.class2OptionList1,
  lessonOptionList: (state: any) => state.lessonOptionList,
  studentOptionList: (state: any) => state.studentOptionList,
}
const actions = {
  //向服务器请求getUserList  && 处理服务器返回数据“setUserList”
  teacherOptionList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.teacherOptionList(params)
  },
  SOCACT_setteacherOptionList({ commit }, params:any) {
    // console.log('message from server teacherOptionList:', params)
    // commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_OPTION_LIST', params)
    }
  },
}
const mutations = {
  [UPDATE_SERVER_DATA] (state: any, payload: any) {
    state.serverData = payload
  },
  [UPDATE_STUDENT_DATA] (state: any, payload: any) {
    state.studentData = payload
  },
  //  教师列表
  // SOCKET_setteacherOptionList(state: any, payload: any) {
  //   console.log('message from teacherOptionList 888:', payload)
  //   if(payload.errCode === 1){
  //     showMessage(payload.msg)
  //   }
  //   if(payload.data.length <= 0){
  //     state.teacherOptionList.push({lable:'暂无数据',value:'暂无数据'})
  //   }
  //   payload.data.some((val:any, index:number) => {
  //     state.teacherOptionList.push({lable:val.userName,value:val._id})
  //   })
  //   // state.teacherOptionList = payload.data
  // },
  //  课程管理员列表
  SOCKET_setcourseAdminOptionList(state: any, payload: any) {
    // console.log('message from courseAdminOptionList 888:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.courseAdminOptionList = []
    payload.data.some((val:any, index:number) => {
      state.courseAdminOptionList.push({label:val.displayName,value:val._id})
    })
  },
  //  班级管理员列表
  SOCKET_setclassAdminOptionList(state: any, payload: any) {
    // console.log('message from classAdminOptionList 888:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.classAdminOptionList = []
    payload.data.some((val:any, index:number) => {
      state.classAdminOptionList.push({label:val.displayName,value:val._id})
    })
  },
  //  实验室管理员列表
  SOCKET_setlabAdminOptionList(state: any, payload: any) {
    // console.log('message from labAdminOptionList:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.labAdminOptionList = []
    payload.data.some((val:any, index:number) => {
      state.labAdminOptionList.push({label:val.displayName,value:val._id})
    })
  },
  //  课程列表
  SOCKET_setcourseOptionList(state: any, payload: any) {
    // console.log('message from courseOptionList:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.courseOptionList = []
    payload.data.some((val:any, index:number) => {
      state.courseOptionList.push({label:val.name,value:val._id})
    })
  },
  //  班级列表
  SOCKET_setclassOptionList(state: any, payload: any) {
    // console.log('message from classOptionList:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.classOptionList = []
    state.class1OptionList = []
    payload.data.some((val:any, index:number) => {
      state.class1OptionList.push({label:val.name, value:{id:val._id, courseId: val.courseId}})
      state.classOptionList.push({label:val.name, value:val._id})
    })
  },
  //  班级列表
  SOCKET_setclassAdjustOptionList(state: any, payload: any) {
    // console.log('message from classOptionList:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.classAdjustOptionList = []
    payload.data.some((val:any, index:number) => {
      state.classAdjustOptionList.push({label:val.name, value:val._id})
    })
  },
 //  课次列表
 SOCKET_setlessonOptionList(state: any, payload: any) {
  // console.log('message from setlessonOptionList:', payload)
  if(payload.errCode === 1){
    showMessage(payload.msg)
  }
  state.lessonOptionList = []
  payload.data.some((val:any, index:number) => {
    state.lessonOptionList.push({label:val.name,value:val._id})
  })
},
  //  班级列表
  SOCKET_setclass2OptionList(state: any, payload: any) {
    // console.log('message from class2OptionList:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.class2OptionList = []
    state.class2OptionList1 = []
    state.class2OptionList1.push({label:'全部班级',value:''})
    payload.data.some((val:any, index:number) => {
      state.class2OptionList.push({label:val.name,value:val._id})
      state.class2OptionList1.push({label:val.name,value:val._id})
    })
  },
  //  课程管理员列表
  SOCKET_setstudentOptionList(state: any, payload: any) {
    // console.log('message from courseAdminOptionList 888:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.studentOptionList = []
    payload.data.some((val:any, index:number) => {
      state.studentOptionList.push({label:val.displayName+'  '+ val.classId.name,value:val._id})
    })
  },

 
  [RESET_SERVER_DATA] (state: any) {
    state.serverData = null
  },
  // [UPDATE_STUDENT_DATA] (state: any) {
  //   state.studentData = null
  // },
  [UPDATE_OPERATE_DATA] (state: any, payload: any) {
    state.operateData = payload
  },
  [RESET_OPERATE_DATA] (state: any) {
    state.operateData = null
  },
  UPDATE_OPTION_LIST (state:  any, payload: any) {
    state.teacherOptionList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.teacherOptionList = []
    if(data.length <= 0){
    } else {
      data.some((val:any, index:number) => {
        state.teacherOptionList.push({label:val.displayName,value:val._id})
      })
    }
    // state.teacherOptionList = (data && data.rows) || []
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}

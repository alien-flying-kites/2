import request from './request'
import $socket from '../plugins/socketInstance'
import showMessage from '../plugins/showMessage'

const useWebsocket: boolean = true;

export default {
  // 获取课程列表
  getCourseList(params: any) {
    if (useWebsocket) {
      $socket.emit('getCourses', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getClassList(params: any) {
    if (useWebsocket) {
      $socket.emit('getClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getClass2List(params: any) {
    if (useWebsocket) {
      $socket.emit('getClass2', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  addClass2(params: any) {
    if (useWebsocket) {
      $socket.emit('addClass2', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  updateClass2(params: any) {
    if (useWebsocket) {
      $socket.emit('updateClass2', params)
    }
    else {
      showMessage('接口错误')
    }
  },
    // 获取班级学生列表
  getLClass2StudentList(params: any) {
    if (useWebsocket) {
      $socket.emit('getLClass2StudentList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getCourseDetail(params: any) {
    if (useWebsocket) {
      $socket.emit('getCourseDetail', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  addCoursesClass(params: any) {
    if (useWebsocket) {
      $socket.emit('addCoursesClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  addCourse(params: any) {
    if (useWebsocket) {
      $socket.emit('addCourse', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  updateCourse(params: any) {
    if (useWebsocket) {
      $socket.emit('updateCourse', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  singup(params: any) {
    if (useWebsocket) {
      $socket.emit('singup', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  signupList(params: any) {
    if (useWebsocket) {
      $socket.emit('signupList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getLessonList(params: any) {
    if (useWebsocket) {
      $socket.emit('getLessonList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getLessonMaterialList(params: any) {
    if (useWebsocket) {
      $socket.emit('getLessonMaterialList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  gethomeworklList(params: any) {
    if (useWebsocket) {
      $socket.emit('gethomeworklList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  addLesson(params: any) {
    if (useWebsocket) {
      $socket.emit('addLesson', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  //  更新报名审核状态
  updateSignupState(params: any) {
    if (useWebsocket) {
      $socket.emit('updateSignupState', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  //  上传教案
  addLessonMaterial(params: any) {
    if (useWebsocket) {
      $socket.emit('addLessonMaterial', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  uploadLessonMaterial(params: any) {
    let url = ''
    const formData = params as FormData
    if (formData.has('additionalQueryString')) {
      const additionalQueryString = formData.get('additionalQueryString') as string
      if (additionalQueryString) {
        const additionalQueryStringObj = JSON.parse(additionalQueryString)       
        for (const key in additionalQueryStringObj) {
          if (additionalQueryStringObj.hasOwnProperty(key)) {
            url += ('&' + key + '=' + encodeURIComponent(additionalQueryStringObj[key]))
          }
        }
        formData.delete('additionalQueryString')
      }
    }
    const urlPrefix = '/api/lessonmaterial/upload'
    if (url.length !== 0) {
      url = urlPrefix + '?1=1' + url
    } else {
      url = urlPrefix
    }
    let token = window.localStorage.getItem('token') || ''
    return request.post(url, params, { headers: { 'Authorization': 'Bearer ' + token}})
  },
  uploadHomework(params: any) {
    let url = ''
    const formData = params as FormData
    if (formData.has('additionalQueryString')) {
      const additionalQueryString = formData.get('additionalQueryString') as string
      if (additionalQueryString) {
        const additionalQueryStringObj = JSON.parse(additionalQueryString)       
        for (const key in additionalQueryStringObj) {
          if (additionalQueryStringObj.hasOwnProperty(key)) {
            url += ('&' + key + '=' + encodeURIComponent(additionalQueryStringObj[key]))
          }
        }
        formData.delete('additionalQueryString')
      }
    }
    const urlPrefix = '/api/lessonmaterial/uploadHomework'
    if (url.length !== 0) {
      url = urlPrefix + '?1=1' + url
    } else {
      url = urlPrefix
    }
    let token = window.localStorage.getItem('token') || ''
    console.log('url  0000000000000000')
    console.log(url)
    console.log(params)
    return request.post(url, params, { headers: { 'Authorization': 'Bearer ' + token}})
  },
    //  获取我的教案列表
  getMyLessonPlan(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyLessonPlan', params)
    }
    else {
      showMessage('接口错误')
    }
  },
     //  获取全部教案列表
  getAllLessonPlan(params: any) {
    if (useWebsocket) {
      $socket.emit('getAllLessonPlan', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  //  获取我的选课列表
  getMyChooseClass(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyChooseClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  //  获取我的任课班级列表
  getMyTeachClass(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyTeachClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
   //  获取我的管理班级列表
  getMyClass(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
   //  获取我的管理课程列表
  getMyCourse(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyCourse', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  //  删除课次
  deleteLesson(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteLesson', params)
    }
    else {
      showMessage('接口错误')
    }
  },
    // 删除课程
  deleteCourse(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteCourse', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  // 更新课程详情
  updateCourseDetail(params: any) {
    if (useWebsocket) {
      $socket.emit('updateCourseDetail', params)
    }
    else {
      showMessage('接口错误')
    }
  },
    // 更新课次
  updateLesson(params: any) {
    if (useWebsocket) {
      $socket.emit('updateLesson', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  // 删除课程详情
  deleteCourseDetail(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteCourseDetail', params)
    }
    else {
      showMessage('接口错误')
    }
  },
   // 获取班级学生列表
   getStudentList(params: any) {
    if (useWebsocket) {
      $socket.emit('getStudentList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  // 获取班级学生列表
  addSchedule(params: any) {
    if (useWebsocket) {
      $socket.emit('addSchedule', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getMyStudyClass(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyStudyClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getMyStatusClass(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyStatusClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getScheduleList(params: any) {
    if (useWebsocket) {
      $socket.emit('getScheduleList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  lessonDetail(params: any) {
    if (useWebsocket) {
      $socket.emit('lessonDetail', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  deleteSchedule(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteSchedule', params)
    }
    else {
      showMessage('接口错误')
    }
  },
    // 删除课程详情
  deleteClass2(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteClass2', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  deleteClassStudent(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteClassStudent', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  deleteClass2Student(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteClass2Student', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getAllHomeworkList(params: any) {
    if (useWebsocket) {
      $socket.emit('getAllHomeworkList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  updateHomeworkScore(params: any) {
    if (useWebsocket) {
      $socket.emit('updateHomeworkScore', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  classDetail(params: any) {
    if (useWebsocket) {
      $socket.emit('classDetail', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  //  取消报名
  deleteMyChooseClass(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteMyChooseClass', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  classAdjustOptionList(params: any) {
    if (useWebsocket) {
      $socket.emit('classAdjustOptionList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  serverState(params: any) {
    if (useWebsocket) {
      console.log('11')
      $socket.emit('serverState', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  deleteServerState(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteServerState', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  signUpClassIndex(params: any) {
    if (useWebsocket) {
      $socket.emit('signUpClassIndex', params)
    }
    else {
      showMessage('接口错误')
    }
  }
}

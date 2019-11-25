import request from './request'
import $socket from '../plugins/socketInstance'
import showMessage from '../plugins/showMessage'

const useWebsocket: boolean = true;

export default {
  //  获取所有用户列表
  getUserList(params: any) {
    if (useWebsocket) {
      $socket.emit('getusers', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  //  更新用户状态（激活或冻结）
  updateUserState(params: any){
    if (useWebsocket) {
      $socket.emit('updateStateUser', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  // 更新用户信息
  updateUserInfo (params: any) {
    if (useWebsocket) {
      $socket.emit('updateUser', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  // 添加用户
  addUser (params: any) {
    if (useWebsocket) {
      $socket.emit('addUser', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  // 删除用户
  deleteUser(params: any){
    if (useWebsocket) {
      $socket.emit('deleteUser', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  // 登录
  login(params: any) {
    return request.post('/api/user/login', params)
  },
  // 删除用户
  teacherOptionList(params: any){
    if (useWebsocket) {
      $socket.emit('teacherOptionList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  addClassStudent(params: any) {
    if (useWebsocket) {
      $socket.emit('addClassStudent', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  checkPwd(params: any) {
    if (useWebsocket) {
      $socket.emit('checkPwd', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  deleteManyUsers(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteManyUsers', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  uploadStudentData(params: any) {
    let url = '/api/user/uploadstudent'
    let token = window.localStorage.getItem('token') || ''
    return request.post(url, params, { headers: { 'Authorization': 'Bearer ' + token}})
  },
  student1OptionList(params: any) {
    if (useWebsocket) {
      $socket.emit('student1OptionList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getAddStudentList(params: any) {
    if (useWebsocket) {
      $socket.emit('getAddStudentList', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getMyUserInfo(params: any) {
    if (useWebsocket) {
      $socket.emit('getMyUserInfo', params)
    }
    else {
      showMessage('接口错误')
    }
  },
}

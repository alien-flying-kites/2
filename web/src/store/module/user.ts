import {
  UDATE_USER_TO_STORE, SAVE_USER_TO_LOCAL, REMOVE_USER_FROM_LOCAL
} from './mutation-types'
import { actionType, deepCopy } from './action-types'
import userAPI from '../../api/user'
import { Commit } from 'vuex'
import Vue from 'vue'
import showMessage from '../../plugins/showMessage'
import { AxiosResponse } from 'axios'
import * as decode from 'jwt-decode'

// initial state
const state = {
  currentUser: {
    id: null,
    //user display name    
    displayName: null,
    expirationTime: null,
    roleTypes: 0
  },
  userList: [],
  userCountArr: [],
  userCountDateArr: [],
  tempData: [],
  courseDetailList: [],
  treeData: null
}

const getters = {
  currentUser: (state: any) => state.currentUser,
  userList: (state: any) => state.userList,
  courseDetailList: (state: any) => state.courseDetailList,
  userCountArr: (state: any) => {
    let statusArr = [0, 0, 0]
    state.userCountArr.map((val: any) => {
      if (val.status === 0) {
        statusArr[0] = val.count
      }
      if (val.status === 1) {
        statusArr[1] = val.count
      }
      if (val.status === 2) {
        statusArr[2] = val.count
      }
    })
    return statusArr
  },
  userCountByDate: (state: any) => {
    let num = 0, xArr: number[] = [], yArr: number[] = []
    if (state.userCountDateArr.length >= 2) {
      state.userCountDateArr.map((val: any) => {
        let date = parseInt(val.date)
        while (num > 0 && (date - num) > 1) {
          // tempArr.push({date: ++num + '', count: 0})
          xArr.push(++num)
          yArr.push(0)
        }
        num = date
        // tempArr.push(val)
        xArr.push(num)
        yArr.push(val.count)
      })
    }
    return { xAxis: xArr, yAxis: yArr }
  },
  treeData: (state: any) => {
    return [
      {
        label: state.userInfo.name,
        children: []
      }
    ]
  }
}



const actions = {
  login(context: { commit: Commit, state: any }, params: any) {
    return new Promise((resolve, reject) => {
      userAPI.login(params)
        .then((response: AxiosResponse) => {
          if (response && response.data) {
            // const success = response.data.success
            const message = response.data.message
            // if (!success) {
            //   showMessage(message)
            //   return
            // }
            const token = response.data.token
            if (token) {
              window.localStorage.removeItem('token')
              window.localStorage.setItem('token', token)
              context.commit(SAVE_USER_TO_LOCAL, token)
              // this.$socket.io.opts.query = { token: token }
              // this.$socket.open()         
            }
            if (message) {
              showMessage(message)
            }
            resolve(response)
          }
        })
        .catch((err: any) => {
          if (err) {
            let message = ''
            if (err.response && err.response.data && err.response.data.message) {
              message = err.response.data.message              
            }
            else if (err.message) {
              message = err.message
              if (message === 'Network Error') {
                message = '网络出错了, 无法连接到服务器'
              }             
            }
            if(message) {
              showMessage(message)
            }
          }
          reject(err)
        })
    })
  },
  //向服务器请求getUserList  && 处理服务器返回数据“setUserList”
  getUserList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.getUserList(params)
  },
  SOCACT_setUserList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  //向服务器请求updateUserState && 处理服务器返回数据“setupdateUser”
  updateUserState ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.updateUserState(params)
  },
  SOCACT_setupdateState({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  //向服务器请求 updateUserInfo && 处理服务器返回数据“ setupdateUserInfo ”
  updateUserInfo ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.updateUserInfo(params)
  },
  SOCACT_setupdateUserInfo({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  //向服务器请求 addUser && 处理服务器返回数据“ setAddUser ”
  addUser ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.addUser(params)
  },
  SOCACT_setAddUser({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  //向服务器请求 deleteUser && 处理服务器返回数据“ setdeleteUser ”
  deleteUser ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.deleteUser(params)
  },
  SOCACT_setdeleteUser({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  // 批量删除
  deleteManyUsers ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.deleteManyUsers(params)
  },
  SOCACT_setdeleteManyUsers({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  
  // 班级添加学生
  addClassStudent ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.addClassStudent(params)
  },
  SOCACT_setaddClassStudent({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  // 班级添加学生
  checkPwd ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.checkPwd(params)
  },
  SOCACT_setcheckPwd({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
    // 
  student1OptionList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.student1OptionList(params)
  },
  SOCACT_setstudent1OptionList({ commit }, params:any) {
    commit('UPDATE_STUDENT_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_STUDENT_DATA', params)
    }
  },
  //  添加学生页面-获取学生列表
  getAddStudentList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.getAddStudentList(params)
  },
  SOCACT_setgetAddStudentList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
  // 获取我的用户信息
  getMyUserInfo ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    userAPI.getMyUserInfo(params)
  },
  SOCACT_setgetMyUserInfo({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_USER_LIST', params)
    }
  },
}

const mutations = {
  [SAVE_USER_TO_LOCAL](state: any, payload: any) {
    const token = payload
    if (token) {
      state.currentUser = {
        id: null,
        displayName: null,
        expirationTime: null,
        roleTypes: 0
      }
      let decodedToken: any = decode(token);
      console.log(decodedToken)
      if (decodedToken.hasOwnProperty('_id')) {
        state.currentUser.id = decodedToken._id;
      }
      if (decodedToken.hasOwnProperty('displayName')) {
        state.currentUser.displayName = decodedToken.displayName;
      }
      if (decodedToken.hasOwnProperty('exp')) {
        const expDate = new Date(0);
        expDate.setUTCSeconds(decodedToken.exp);
        state.currentUser.expirationTime = expDate;
      }
      if (decodedToken.hasOwnProperty('roleTypes')) {
        state.currentUser.roleTypes = parseInt(decodedToken.roleTypes);
      }
    }
  },
  [REMOVE_USER_FROM_LOCAL](state: any) {
    window.localStorage.removeItem('token')
    state.currentUser.id = null
    state.currentUser.displayName = null
    state.currentUser.expirationTime = null
    state.currentUser.roleTypes = 0
  },
  UPDATE_USER_LIST (state:  any, payload: any) {
    state.userList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.userList = (data && data.rows) || []
  },
  SOCKET_refreshToken(state: any, token) {
    if (token) {
      // console.log(token)
      window.localStorage.setItem('token', token)
      let decodedToken: any = decode(token);
      // console.log(decode(window.localStorage.getItem('token'))
      state.currentUser = {
        id: null,
        displayName: null,
        expirationTime: null,
        roleTypes: 0
      }
      // console.log(state.currentUser)
      if (decodedToken.hasOwnProperty('_id')) {
        state.currentUser.id = decodedToken._id;
        window.localStorage.setItem('uuid', decodedToken._id)
      }
      if (decodedToken.hasOwnProperty('displayName')) {
        state.currentUser.displayName = decodedToken.displayName;
      }
      if (decodedToken.hasOwnProperty('userName')) {
        state.currentUser.userName = decodedToken.userName;
      }
      if (decodedToken.hasOwnProperty('mobilePhone')) {
        state.currentUser.mobilePhone = decodedToken.mobilePhone;
      }
      if (decodedToken.hasOwnProperty('email')) {
        state.currentUser.email = decodedToken.email;
      }
      if (decodedToken.hasOwnProperty('exp')) {
        const expDate = new Date(0);
        expDate.setUTCSeconds(decodedToken.exp);
        state.currentUser.expirationTime = expDate;
      }
      if (decodedToken.hasOwnProperty('roleTypes')) {
        state.currentUser.roleTypes = parseInt(decodedToken.roleTypes);
      }
      // console.log(state.currentUser)
    }
  },
  SOCKET_testClient(state: any, text) {
    if (text) {
      console.log(' 333333333333333333 ')
      console.log(text)
    }
  },
  reset_temp_data(state: any) {
    state.tempData = []
  },
  update_temp_data(state: any, payload: any) {
    if (payload.count < 1) return
    payload.rows.forEach((e: any) => {
      state.tempData.push({ label: e.username })
    })
  },
  [UDATE_USER_TO_STORE](state: any, payload: any) {
    if (payload.prvl) {
      state.userInfo = payload
      return
    }
    if (payload.phone_number) {
      state.userInfo.phone = payload.phone_number
    }
  },
  clear_user_count() {
    state.userCountArr = []
  },
  update_user_count(state: any, payload: any) {
    if (payload && payload.data) {
      state.userCountArr = payload.data
    }
  },
  update_user_countDate(state: any, payload: any) {
    if (payload && payload.data) {
      state.userCountDateArr = payload.data
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}

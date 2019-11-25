import labAPI from '../../api/lab'
import { actionType, deepCopy } from './action-types'
import { Commit } from 'vuex'
import showMessage from '../../plugins/showMessage';

const state = {
  labOptionList: []
}
const getters = {
  labOptionList: (state: any) => state.labOptionList
}

const actions = {
  //向服务器请求 getAllLab && 处理服务器返回数据“ getAllLab ”
  getAllLab ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    labAPI.getAllLab(params)
  },
  SOCACT_setlabList({ commit }, params:any) {
    // console.log('message from server getAllLab:', params)
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LAB_LIST', params)
    }
  },
   //向服务器请求 addLab && 处理服务器返回数据“ addLab ”
  addLab ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    labAPI.addLab(params)
  },
  SOCACT_setaddLab({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LAB_LIST', params)
    }
  },
    //向服务器请求 getCourseList && 处理服务器返回数据“ setCourseList ”
  updateLab ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    labAPI.updateLab(params)
  },
  SOCACT_setupdateLab({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LAB_LIST', params)
    }
  },
  //向服务器请求 getCourseList && 处理服务器返回数据“ setCourseList ”
  deleteLab ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    labAPI.deleteLab(params)
  },
  SOCACT_setdeleteLab({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_LAB_LIST', params)
    }
  },
   //向服务器请求 getCourseList && 处理服务器返回数据“ setCourseList ”
  getMylab ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    labAPI.getMylab(params)
  },
  SOCACT_setgetMylab({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    // console.log('params  dasdsa')
    // console.log(params)
    if(params.errCode === 0) {
      commit('UPDATE_LAB_LIST', params)
    }
  },
}

const mutations = {
  SOCKET_setlabOptionList(state: any, payload: any) {
    // console.log('message from setlabOptionList:', payload)
    if(payload.errCode === 1){
      showMessage(payload.msg)
    }
    state.labOptionList = []
    payload.data.data.some((val:any, index:number) => {
      state.labOptionList.push({label:val.name,value:val._id})
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
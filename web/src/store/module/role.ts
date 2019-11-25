import roleAPI from '../../api/role'
// import { actionType, deepCopy } from './action-types'
// import { Commit } from 'vuex'

const state = {
  roleList: [],
  optionList: [],
  checkedArr: []
}
const getters = {
  roleList: (state: any) => state.roleList,
  optionList: (state: any) => state.optionList,
}

const actions = {
  //向服务器请求RoleList
  getRoleList ({ commit }, params) {
    commit('RESET_SERVER_DATA')
    roleAPI.getRoleList(params)
  },
  //处理服务器返回数据“setRoleList”
  SOCACT_setRoleList({ commit }, params:any) {
    commit('UPDATE_SERVER_DATA', params)
    if(params.errCode === 0) {
      commit('UPDATE_ROLE_LIST', params)
    }
  },
}

const mutations = {
  UPDATE_ROLE_LIST (state:  any, payload: any) {
    state.roleList = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.roleList = (data && data.rows) || []
  },
  UPDATE_CHECKED_ARR (state:  any, payload: any) {
    state.checkedArr = []
    if (payload.errCode) {
      return console.log(payload.msg)
    }
    const data = payload.data
    state.checkedArr = data || []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

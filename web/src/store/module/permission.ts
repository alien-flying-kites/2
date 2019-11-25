import permAPI from '../../api/permission'
import { actionType, deepCopy } from './action-types'

const state = {
  checkedArr: [],
  checkedOwnArr: [],
  opers: {
    SuperAdmin: 1,
    SchoolAdmin: 2,
    CourseAdmin: 4,
    ClassAdmin: 8,
    LabAdmin: 16,
    Teacher: 32,
    Student: 64
  }
}
const getters = {
  checkedOpers: (state: any) => state.checkedArr,
  handleOpers: state => {
    let res = {}
    for (var key in state.opers) {
      if (state.checkedOwnArr.indexOf(state.opers[key]) === -1) {
        res[key] = false
      } else {
        res[key] = true
      }
    }
    return res
  }
}

const actions = {
}

const mutations = {
  updateCheckedArr (state: any, data: any) {
    let payload = data
    let type = data && data.type
    if (type && type === 'own') {
      payload = data.data
    }
  },
  clearCheckedArr (state: any) {
    state.checkedArr = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

import Vue from 'vue'
import Vuex from 'vuex'

import commonModule from './module/common'
import permissionModule from './module/permission'
import userModule from './module/user'
import courseModule from './module/course'
import labModule from './module/lab'

import exampleModule from './module'
import roleModule from './module/role'
// import axios from '../plugins/axios'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

const store = new Vuex.Store({
  modules: {
    exampleModule,
    commonModule,
    permissionModule,
    userModule,
    roleModule,
    courseModule,
    labModule
  }
})
export default store

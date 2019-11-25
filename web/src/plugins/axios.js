import axios from 'axios'

export default ({ Vue }) => {
  axios.defaults.baseURL = 'http://127.0.0.1:7001'
  // axios.defaults.baseURL = 'http://192.168.94.110'
  // axios.defaults.baseURL = 'http://192.168.89.230'
  Vue.prototype.$axios = axios
  if (process.server) {
    return
  }
  axios.interceptors.request.use(config => {
    config.baseURL = axios.defaults.baseURL

    // Get token from auth.js store
    const token = window.localStorage.getItem('token')

    // Update token axios header
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
  })
}

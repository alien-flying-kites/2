import  axios from 'axios'
import  { AxiosResponse } from 'axios'
import showMessage from '../plugins/showMessage'
// import qs from 'qs'
// const host = 'http://14.18.41.125:3001'
// const host = axios.defaults.baseURL
// const host = 'http://192.168.94.110'
const host = 'http://127.0.0.1:7001'
// const host = 'http://192.168.89.230'

// 创建axios实例
const request = axios.create({
  baseURL: host,
  timeout: 15000                  // 请求超时时间
});


function resetLogin() {
  (window as any).isLoginPage = true
  localStorage.removeItem('token')
  const router = (window as any).router
  // router.push({
  //   path: '/login'
  // })
}

function rejectResponse(err: any, isResetLogin: boolean = false) {
  if (isResetLogin) {
    return resetLogin()
  }
  // if (err.message === 'timeout of 8000ms exceeded') {
  //   showMessage('请求超时')
  // }
  // if (err.message === 'Network Error') {
 
  // }
  return Promise.reject(err)
}

// async function request(url = '', params: any = {}, success?: (d: any) => void, fail?: (d: any) => void) {
//   try {
//     const path = host + url
//     const response = await axios.post(path,params)
//     if (response) {
//       if (response.status !== 200) {
//         throw new Error('Error:' + response)
//       }
//       success && success(response) // 请求成功回调函数
//     }
//   } catch (err) {
//     if (fail) fail(err)
//   }
//   return Promise.resolve()
// }

axios.interceptors.response.use(
  (res: AxiosResponse) => {
    if(res.status !== 200)
    {
      let msg = res.statusText
      if(res.data && res.data.message) {
        msg += (":" + res.data.message)
      }
      showMessage(msg)
      return Promise.reject(msg)
    }
    return res
}, 
err => {
  if (!err.response) {
    return Promise.reject(err)
  }
  const msg = err.response.data.message
  const status = err.response.status
  const errorMessage = err.message
  // if (err.toString().indexOf('401') >= 0 && !((window as any).isLoginPage)) {
  //   showMessage(msg)
  //   return rejectResponse(err, true)
  // }
  showMessage(msg)
  return Promise.reject(err)
})

export default request

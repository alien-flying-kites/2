import request from './request'
import $socket from '../plugins/socketInstance'

const useWebsocket: boolean = true;

export default {
  //获取角色列表(角色列表页面)
  getRoleList(params: any) {
    if (useWebsocket) {
      $socket.emit('getroles', params)
    }
    else {
      request('/api/roles')
    }
  }
}

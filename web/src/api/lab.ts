import request from './request'
import $socket from '../plugins/socketInstance'
import showMessage from '../plugins/showMessage'

const useWebsocket: boolean = true;

export default {
  //  获取所有实验室列表
  getAllLab(params: any) {
    if (useWebsocket) {
      $socket.emit('getAllLab', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  addLab(params: any) {
    if (useWebsocket) {
      $socket.emit('addLab', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  updateLab(params: any) {
    if (useWebsocket) {
      $socket.emit('updateLab', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  deleteLab(params: any) {
    if (useWebsocket) {
      $socket.emit('deleteLab', params)
    }
    else {
      showMessage('接口错误')
    }
  },
  getMylab(params: any) {
    if (useWebsocket) {
      $socket.emit('getMylab', params)
    }
    else {
      showMessage('接口错误')
    }
  },
}

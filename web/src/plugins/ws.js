import Vue from 'vue'
// import VueSocketio from 'vue-socket.io'

import VueSocketIO from 'vue-socket.io'
import store from '../store'
import showMessage from './showMessage'
import $socket from './socketInstance'

// Vue.use(VueSocketio, socketConnection)
Vue.use(new VueSocketIO({
  debug: false,
  connection: $socket,
  vuex: {
    store,
    actionPrefix: 'SOCACT_',
    mutationPrefix: 'SOCKET_'
  }
}))

export default ({ app, Vue }) => {
  const refreshTokenMethod = function () {
    window.localStorage.removeItem('token')
    $socket.emit('refreshToken')
    // $socket.emit('testClient')
  }
  app.sockets = {
    refreshTokenTimer: Number,
    connect: function () {
      console.log('socket已连接')
      this.refreshTokenTimer = window.setInterval(refreshTokenMethod, 3 * 1000) // refresh toke every minute
    },
    disconnect: function (e, args) {
      console.log('socket已断开')
      window.clearInterval(this.refreshTokenTimer)
      // 有可能是token过期, 更新token以便能自动连接
      const token = window.localStorage.getItem('token')
      if (token) {
        $socket.io.opts.autoConnect = true
        $socket.io.opts.query = { token: token }
        $socket.open()
      }
    },
    PushMessageToClient: function (message) {
      if (message && (typeof message === 'string')) {
        showMessage(message)
      } else if (message.msg && (typeof message.msg === 'string')) {
        showMessage(message.msg)
      }
      console.log('Message from server in PushMessageToClient:', message)
    }
  }
}

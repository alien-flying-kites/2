import io from 'socket.io-client'
export default io('http://127.0.0.1:7001/', { autoConnect: false })
// export default io('http://192.168.94.110/', { autoConnect: false })
// export default io('http://192.168.89.230/', { autoConnect: false })

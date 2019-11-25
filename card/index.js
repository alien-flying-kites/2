const WebSocket = require('ws');
var mongoose = require('mongoose');
require('./model.js');

/** 获取Model，创建Book的实例 Entity **/
var Book = mongoose.model('Book');
// var book = new Book({
//   ip: 'MEAN Web 222',
//   port: 'Green',
//   createdAt: new Date()
// });
// /** 插入数据 **/
// book.save(function(err) {    // 执行保存，并查看返回情况
//     console.log('save status:', err ? 'failed' : 'success');
// })
const config = {
    wsPort: 3011,
  };
  function handleConnect(ws, req, server) {
    let { client } = server;
    const key = req.headers['sec-websocket-key'];
    console.log(`\n***new_connection , key: ${key}, ip: ${ws._socket.remoteAddress}, port: ${ws._socket.remotePort}`);
    console.log(`req_url: ${req.url}`);
    var book = new Book({
      ip: ws._socket.remoteAddress,
      port: ws._socket.remotePort,
      content: '',
      createdAt: new Date()
    });
    /** 插入数据 **/
    book.save(function(err) {    // 执行保存，并查看返回情况
        console.log('save status:', err ? 'failed' : 'success');
    })
    ws.selfKey = key;
  }  
class WSServer {
    constructor () {
      this.client = null;
      this.wss = null;
    }
    createWSServer () {
      this.wss = new WebSocket.Server({ port: config.wsPort });
      var self = this;
      this.wss.on('connection', function connection(ws, req) {
        self.client = ws;
        handleConnect(ws, req, self)
        ws.on('message', async function handleData(data) {
          console.log('00000   ' + ws);
          // console.log(ws.Socket);
          // console.log(ws._socket);
          // console.log(ws._socket._peername);
          console.log(ws._socket._peername.address);
          // console.log(ws._socket._peername.port);
          console.log(`\n***receive_data, key: ${ws.selfKey}\ncontent: `, data);
          console.log(data);
          Book.findOne({ip: ws._socket._peername.address}, function(err, doc) {
            if (err) {
              console.log('err:', err);
              return;
            }
            if (doc) {
              console.log('000000000000000000000', doc)
              doc.createdAt = new Date();
              doc.content = data;
              doc.save();
            }
            // console.log('findOne result:', doc)
          })
        });
        ws.on('close', function handleClose(code) {
          console.log(`***close, code: ${code}, ws_key: ${ws.selfKey}`);
          Book.findOne({ip: ws._socket._peername.address}, function(err, doc) {
            if (err) {
              console.log('findOne err:', err);
              return;
            }
          
            if (doc) {
              doc.remove();
            }
          })
          ws.removeAllListeners();
        });
        ws.on('error', function() {
          console.log(`err, `, err)
        });
      });
      this.wss.on('close', function() {
        console.log('ws server closed');
      })
      this.wss.on('error', function(err) {
        console.log('ws server occured err:', err);
      })
      this.wss.on('listening', function() {
        const address = this.address();
        console.log(`ws server is listening on port ${address.port}`);
      })
    }
    // getClients () {
    //   return this.wss.clients;
    // }
  }

  let server = new WSServer();
  server.createWSServer();

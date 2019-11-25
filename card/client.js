const host = 'ws://192.168.8.32';
const WebSocket = require('ws');
var mongoose = require('mongoose');
require('./model.js');

/** 获取Model，创建Book的实例 Entity **/
var Book = mongoose.model('Book');
// var Book = mongoose.model('User');
// const AddTask = require('./compile_and_run.js');

let ws = null;
let reConnectNum = 0;
let isConnected = false;
let heartBitTimer = null;
function connect(ws) {
  ws = new WebSocket('ws://192.168.8.32:4444', {
    // rejectUnauthorized: false
  });
  ws.on('open', function open() {
    console.log('***connected');
    reConnectNum = 0;
    Book.find({}, function(err, doc) {
      if (err) {
        console.log('err:', err);
        return;
      }
      console.log('find result:', doc)
      ws.send(doc);
      // ws.send(JSON.stringify({ type: 3 }));
    })
    // heartBitTimer = setInterval(function () {
    //   console.log('发送心跳' +  new Date());
    //   ws.send(JSON.stringify({ type: 3 }));
    // }, 1000 * 30);
  });
  
  ws.on('error', function(err) {
    isConnected = false;
    console.log('\n*** occur err 11111111111111111');
    console.log(`code: ${err.code}`)
    console.log(`errno:: ${err.errno}`)
    if (!isConnected) {
      console.log(`reconnect num: ${++reConnectNum}, ${new Date()}\n`);
    }
  });
  
  ws.on('close', function close(code) {
    if (heartBitTimer) {
      clearInterval(heartBitTimer);
      heartBitTimer = null;
    }
    isConnected = false;
    console.log(`***close, code: ${code}, ${new Date()}`);
    ws.removeAllListeners();
    setTimeout(function() {
      connect(ws);
    }, 2000);
  });
  
  ws.on('message', async function incoming(data) {
    console.log('\n***receive:', data)
    let { type, name, file, key} = JSON.parse(data);
    if (!type || !name) return;
  });
}

connect(ws);



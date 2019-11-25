/** 配置并链接MongoDB **/
var mongoose = require('mongoose');
// var uri = 'mongodb://admin:abc123!@localhost/lms';

mongoose.connect('mongodb://admin:abc123!@localhost/lms', {
  useCreateIndex: true,
  useNewUrlParser: true
})
// mongoose.connect(uri);

/** 创建Schema、创建Model **/
// var BookSchema = new mongoose.Schema({
//     ip: String,
//     port: String,
//     createdAt: Date
// });
var book = new mongoose.Schema({
    ip: String,
    port: String,
    content: String,
    createdAt: Date
  });
  mongoose.model('Book', book);

// mongoose.model('Book', BookSchema);

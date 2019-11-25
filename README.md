This is Open AI Lab's lab management system

运行服务器之前，需要创建数据库lms：
创建mongodb用户名及密码
* mongo
* \> use lms;
* \> db.createUser({user: "admin",pwd: "abc123!",roles: [ { role: "readWrite", db: "lms" } ]})
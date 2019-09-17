const mysql = require('mysql');
const config = require('./config/database.config');
const logger = require('morgan');

module.exports = {
  query:(sql,params,callback) => {
    let connection = mysql.createConnection(config);
    connection.connect(error => {
      if(error){
        console.log('数据库连接失败');
        logger('tiny');
        throw error;
      }
    })
    connection.query(sql,params,callback);
    connection.end(error => {
      if(error){
        console.log('关闭数据库连接失败');
        logger('tiny');
        throw error;
      }
    })
  }
}
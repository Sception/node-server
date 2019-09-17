const jwt = require('jsonwebtoken');
const privateKey = require('./privateKey');
const key = privateKey.key;

/*
* 生成token
* */
module.exports = {
  createToken:(data) => {
    let token = jwt.sign(data, key,{ expiresIn: '7d'});
    return token;
  }
}
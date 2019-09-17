const jwt = require('jsonwebtoken');
const privateKey = require('./privateKey');

/*
* 生成token
* */
module.exports = {
  createToken:() => {
    const {key, data} = privateKey;
    let token = jwt.sign({data}, key,{ expiresIn: '7d'});
    return token;
  }
}
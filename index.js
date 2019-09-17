const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./routes/index');
const path = require('path');

// 状态码相关
const statusCode = require('./config/statusCode');

// token中间件
const jwt = require('jsonwebtoken');
const privateKey = require('./config/privateKey');
const key = privateKey.key;

const noToken = ['/user/getCaptcha','/user/login','/tags/all','/tags/getTagsArticleList','/articles/list','/articles/detail','/archive/all','/resource/all'];//无需token认证的接口

app.use(bodyParser.json())//解析application/json
  .use(bodyParser.urlencoded({ extended: false }))//解析application/x-www-form-urlencoded
  .use(cookieParser())// 使用cookie

app.use(express.static(path.join(__dirname, '../dist')));
// 设置请求头
// application/json  接口返回json数据
// charset=utf-8 解决json数据中中文乱码
app.use('*',(req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
    res.header("Content-Type","text/html; charset=utf-8");
    let { baseUrl:url } = req;
    //验证接口是否需要token
    let tokenFlag = noToken.every(item => url.indexOf(item) === -1);
    if(tokenFlag){
      let header = req.headers;
      let {token} = header;
      if(token){
        // 验证token是否过期
        jwt.verify(token, key, (err, decode)=> {
          if (err) {  //  时间失效的时候 || 伪造的token
            return res.send(JSON.stringify({
              code:statusCode.TOKEN_EXPIRED,
              message:'token已过期'
            }));
          }
          let{ data }= decode;
          if(data === 'admin'){
            next();
          }else{
            return res.send(JSON.stringify({
              code:statusCode.NO_TOKEN,
              message:'token无效'
            }));
          }
        });
      }else{
        // 无token
        return res.send(JSON.stringify({
          code:statusCode.NO_TOKEN,
          message:'token无效'
        }))
      }
    }else{
      next();
    }
});
app.use('/api',routes);

app.listen(3000,() => {
  console.log('app is listening 3000....')
});

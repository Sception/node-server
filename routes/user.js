const db = require('../db');
const statusCode = require('../config/statusCode');
const { createToken } = require('../config/token');
const svgCaptcha = require('svg-captcha');
const sql = 'select * from user where username = ?';
/*
* 登录接口
* */
exports.login = (req,res) => {
  let {username,password} = req.body;
  db.query(sql,[username],(error,results,fields) => {
    let result = null;
    if(results.length > 0){
      let pwd = results[0].password;
      let token = createToken();
      if(password === pwd){
        result = {
          code:statusCode.ERROR_OK,
          data:{
            token:token,
            name:username
          },
          message:'成功'
        }
      }else{
        result = {
          code:statusCode.VALID_ERROR,
          message:'密码不正确'
        }
      }
    }else{
      result = {
        code:statusCode.VALID_ERROR,
        message:'用户不存在'
      }
    }
    return res.end(JSON.stringify(result));
  })
}

/*
* 验证token是否正确
* */
exports.tokenVerify = (data) => {
    db.query(sql,[data],(error,results,fields) => {

    })
}

/*
*  获取图片验证码
* */
exports.getCaptcha = (req,res) => {
  let captchaConfig = {
    size:4,
    ignoreChars: '0o1i',//忽略某些字符如0oli
    noise:2,//干扰线条数
    color:true,
    width:100,
    height:50,
    background:'#cc9966'
  };
  let  captcha = svgCaptcha.create(captchaConfig);
  req.session = captcha.text.toLowerCase();//存session用于验证接口获取文字码并忽略大小写
  res.cookie('captcha',req.session);// 将生成的验证码保存到cookie 方便前端调用验证
  res.header('Content-Type', 'image/svg+xml');
  return res.status(200).end(captcha.data);
}
const db = require('../db');
const statusCode = require('../config/statusCode');
const qiniu = require('qiniu');
const qiniuConf = require('../config/qiniuConf');

// 上传图片
exports.getToken = function(req,res) {
  // console.log(req.query,req.params,req.body);
  // let params = req.query || req.params || req.body;
  let token = getUploadToken();
  return res.json({
    "code":statusCode.ERROR_OK,
    "data":token
  })
  // 获取token
  function getUploadToken(){
    // 定义鉴权对象mac
    let mac = new qiniu.auth.digest.Mac(qiniuConf.accessKey, qiniuConf.secretKey);
    let options = {
      scope: qiniuConf.bucket,
      expires:7200 //凭证有效期
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }

}



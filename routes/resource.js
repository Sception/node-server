const db = require('../db');
const statusCode = require('../config/statusCode');
const sqlObj = {
  delSql:'DELETE from resource where id = ?',
  querySql:'SELECT a.*,t.type_name FROM resource a  LEFT JOIN resource_type t ON  a.resource_type = t.id where 1 = 1',
  insertSql:'INSERT INTO resource(resource_name,resource_link,resource_type,createTime) VALUES(?,?,?,?)',
  queryTypeSql:'SELECT * from resource_type',
  insertTypeSql:'INSERT INTO resource_type(type_name) VALUES(?)',
  updateSql:'UPDATE resource SET resource_name = ?,resource_link = ?,resource_type = ?,createTime = ? where id = ?'
}


/*
* 查询资源列表 带分页
*
* */
exports.getResource = (req,res) => {
  return getDataWithPages(req,res,db,'resource');
}




/*
* 添加资源
* */
exports.addResource = (req,res) => {
  let { resource_name,resource_link,resource_type,createTime } = req.body;
  db.query(sqlObj.insertSql,[resource_name,resource_link,resource_type,createTime],(error,results,fields) => {
    let params = null;
    if(error) {
      params = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      res.json(params);
      throw error;
    }else{
      params = {
        "code":statusCode.ERROR_OK,
        "message":'成功'
      }
    }
    return res.json(params);
  })
}


/*
* 更新资源
* */
exports.updateResource = (req,res) => {
  let { id,resource_name,resource_link,resource_type,createTime } = req.body;
  db.query(sqlObj.updateSql,[resource_name,resource_link,resource_type,createTime,id],(error,results,fields) => {
    let params = null;
    if(error) {
      params = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      res.json(params);
      throw error;
    }else{
      if(results.affectedRows > 0){
        params = {
          "code":statusCode.ERROR_OK,
          "message":'成功'
        }
      }else{
        params = {
          "code":statusCode.ERROR_FAIL,
          "message":'失败'
        }
      }
    }
    return res.json(params);
  })
}

/*
* 根据ID删除资源
* */
exports.delResource = (req,res) => {
  let { id } = req.params;
  db.query(sqlObj.delSql,[id],(error,results,fields) => {
    let params = null;
    if(error) {
      params = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      res.json(params);
      throw error;
    }else{
      if(results.affectedRows > 0){
        params = {
          "code":statusCode.ERROR_OK,
          "message":'成功'
        }
      }else{
        params = {
          "code":statusCode.ERROR_FAIL,
          "message":'失败'
        }
      }
    }
    return res.json(params);
  })
}

/*
  * @params
  * {Number} size 每页条目数
  * {Number} current 当前页数
  * {Number} total 总条数
  * {Number} pageCount 总页数
  * db 数据库连接对象
  * {String} tableName 数据库表名
  * {Boolean} isPage 是否分页
  * */
function getDataWithPages(req,res,db,tableName,isPage = true){
  let pageCount = 0,
    params = req.query && Object.keys(req.query).length > 0 ? req.query : req.params,
    {id,createTime,resource_name,resource_link,resource_type,current,size} = params,
    currentPage = parseInt(current,10) || 1,
    pageSize = parseInt(size,10) || 10;
  let start = (currentPage - 1)*pageSize;
  let end = pageSize;
  let sql2 = isPage ? addSql({id,createTime,resource_name,resource_link,resource_type},start,end) : addSql({id,createTime,resource_name,resource_link,resource_type});
  let totalSql = addSql({id,createTime,resource_name,resource_link,resource_type});
  let sql = isPage ? 'SELECT COUNT(1) FROM ('+ totalSql + ') as d;'+sql2 : 'SELECT COUNT(1) FROM ('+ sql2 + ') as d;'+sql2;
  db.query(sql,[],function(error,results,fields) {
    let result = null;
    if(error) {
      result = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      throw error;
    }else{
      let data = null;
      let total = results[0][0]['COUNT(1)'];//获取总条数
      pageCount = Math.max(Math.floor(total/pageSize),1);//总页数不能小于1
      if(results[1] && results[1].length > 0){
        data = results[1];
      }else{
        data = [];
      }
      isPage? result = {
        "code":statusCode.ERROR_OK,
        "data":{
          total:total,
          results:data,
          size:pageSize,
          current:currentPage,
          pageCount:pageCount
        },
        "message":'成功'
      } : result = {
        "code":statusCode.ERROR_OK,
        "data":{
          results:data
        }
      }
    }
    return res.json(result);
  })
  // 动态拼接查询的sql语句
  function addSql({id,createTime,resource_name,resource_link,resource_type},start,end){
    let sql = sqlObj.querySql;
    if(id){
      sql += ' AND a.id = '+id;
    }else if(createTime){
      sql += ' AND createTime = '+createTime;
    }else if(resource_name){
      sql += ' AND resource_name = '+resource_name;
    }else if(resource_link){
      sql += ' AND resource_link = '+resource_link;
    }else if(resource_type){
      sql += ' AND resource_type = '+resource_type;
    }else if(start >= 0 && end){
      sql += ' limit ' + start + ','+ end;
    }
    return sql;
  }
}


/*
* 添加资源类型
* */
exports.addResourceType = (req,res) => {
  let { type_name } = req.body;
  db.query(sqlObj.insertTypeSql,[type_name],(error,results,fields) => {
    let params = null;
    if(error) {
      params = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      res.json(params);
      throw error;
    }else{
      params = {
        "code":statusCode.ERROR_OK,
        "message":'成功'
      }
    }
    return res.json(params);
  })
}

/*
* 查询资源类型
* */
exports.getResourceType = (req,res) => {
  db.query(sqlObj.queryTypeSql,[],(error,results,fields) => {
    let params = null;
    if(error) {
      params = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      res.json(params);
      throw error;
    }else{
      params = {
        "code":statusCode.ERROR_OK,
        "data":{
          results:[...results]
        },
        "message":'成功'
      }
    }
    return res.json(params);
  })
}


/*
* 查询所有资源类型对应的资源名称
* */
exports.getResTypeList = (req,res) => {
  db.query('select * from resource_type',[],async (error,results,fields) => {
    if(error) {
      let params = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      res.json(params);
      throw error;
    }
    let arr = [];
  let resData = [];
  for(let i = 0; i < results.length; i++){
    resData = await queryFun(results[i]);
  }
  res.json({
    "code":statusCode.ERROR_OK,
    "data":resData
  })
    // 拿到forEach循环结束后的结果集
    function queryFun(item){
      let type_name = item.type_name;
      return new Promise((resolve, reject) => {
        db.query('select * from resource where resource_type = ?',[item.id],(error,results,fields) => {
          if(error) {
            reject(error);
            throw error;
          }
          if(results.length > 0 ) {
            arr.push({
              type_name: type_name,
              list: [...results]
            })
          }
          resolve(arr);
        })
      })
    }
  })
}

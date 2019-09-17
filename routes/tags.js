const db = require('../db');
const statusCode = require('../config/statusCode');

const sqlObj = {
  delSql:'DELETE from tags where id = ?',
  querySql:'SELECT a.*,t.tag_name FROM artical a  LEFT JOIN tags t ON  a.tags_id = t.id',
  insertSql:'INSERT INTO tags(tag_name) VALUES(?)',
  updateSql:'UPDATE tags SET tag_name = ? where id = ?'
}

/*
* 查询标签 带分页
* */
exports.getTagsList = (req,res) => {
  return getDataWithPages(req,res,db,'tags');
}


/*
  * @params
  * {Number}size 每页条目数
  * {Number}current 当前页数
  * {Number}total 总条数
  * {Number}pageCount 总页数
  * db 数据库连接对象
  * {String}tableName 数据库表名
  * */
function getDataWithPages(req,res,db,tableName){
  let pageCount = 0,
    params = req.query && Object.keys(req.query).length > 0 ? req.query : req.params,
    {id,tag_name,current,size} = params,
    currentPage = parseInt(current,10) || 1,
    pageSize = parseInt(size,10) || 10;
  let start = (currentPage - 1)*pageSize;
  let end = pageSize;
  let sql2 = addSql({id,tag_name},start,end);
  let sql = 'SELECT COUNT(1) FROM ('+ sql2 + ') as a;'+sql2;

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
      result = {
        "code":statusCode.ERROR_OK,
        "data":{
          total:total,
          results:data,
          size:pageSize,
          current:currentPage,
          pageCount:pageCount
        },
        "message":'成功'
      }
    }
    return res.json(result);
  })

  function addSql({id,tag_name},start,end){
    let sql = 'SELECT * FROM '+tableName + ' WHERE 1 = 1';
    if(id){
      sql += ' AND id = '+id;
    }else if(tag_name){
      sql += ' AND tag_name = '+tag_name;
    }else if(start >= 0 && end){
      sql += ' limit ' + start + ','+ end;
    }
    return sql;
  }
}

/*
* 查询所有标签 不带分页
* */
exports.getTagsAll = (req,res) => {
  let tag_sql = 'SELECT * from tags where tag_name != "关于我"';
  db.query('SELECT COUNT(1) FROM ('+tag_sql+') as t;'+tag_sql,[],(error,results,fields) => {
    let result = null;
    if(error) {
      result = {
        "code":statusCode.ERROR_FAIL,
        "message":'失败'
      }
      res.json(result);
      throw error;
    }
    let total = results[0][0]['COUNT(1)'];//获取总条数
    result = {
      "code": statusCode.ERROR_OK,
      "data": {
        total: total,
        results: results[1]
      },
      "message": '成功'
    }
      return res.json(result);
  })
}





/*
* 查询所有标签对应的全部文章集合 不带分页 查询类型为已发布的文章
* */
exports.getTagsArticleList = (req,res) => {
  db.query('select * from tags',[],async (error,results,fields) => {
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
    for(let i = 0,len = results.length; i < len;i++){
      resData = await queryFun(results[i]);
    }
    res.json({
       "code":statusCode.ERROR_OK,
       "data":resData
    })
    // 拿到forEach循环结束后的结果集 不能保证结果的顺序
    function queryFun(item){
      let tag_name = item.tag_name;
      return new Promise((resolve, reject) => {
        db.query('select * from artical where tags_id = ? AND article_type = 1',[item.id],(error,results,fields) => {
          if(error) {
            reject(error);
            throw error;
          }
          arr.push({
            tags_id: item.id,
            tag_name: tag_name,
            list: [...results]
          })
          resolve(arr);
        })
      })
    }
  })
}


/*
* 根据ID删除标签
* */
exports.deleteTags = (req,res) => {
  db.query(sqlObj.delSql,[req.params.id],function(error,results,fields) {
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
* 新增标签接口
* */
exports.addTags = (req,res) => {
  let { tag_name } = req.body;
  db.query(sqlObj.insertSql,[tag_name],function(error,results,fields) {
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
* 更新标签
* */
exports.updateTags = (req,res) => {
  let { id,tag_name } = req.body;
  db.query(sqlObj.updateSql,[tag_name,id],function(error,results,fields) {
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
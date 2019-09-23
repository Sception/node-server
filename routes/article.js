const db = require('../db');
const statusCode = require('../config/statusCode');
const sqlObj = {
  delSql:'DELETE from artical where id = ?',
  querySql:'SELECT a.*,t.tag_name FROM artical a  LEFT JOIN tags t ON  a.tags_id = t.id where 1 = 1',
  insertSql:'INSERT INTO artical(title,brief,article_type,comments,views,loves,tags_id,images_url,contents,publishTime) VALUES(?,?,?,?,?,?,?,?,?,?)',
  updateSql:'UPDATE artical SET title = ?,brief = ?,article_type = ?,comments = ?,views = ?,loves = ?,tags_id = ?,images_url = ?,contents = ?,publishTime = ? where id = ?'
}


/*
* 查询文章 带分页
*
* */
exports.getArticles = (req,res) => {
    return getDataWithPages(req,res,db,'artical');
}

/*
* 查询文章详情 不带分页
* */
exports.getArticlesDetail = (req,res) => {
  return getDataWithPages(req,res,db,'artical',false);
}


/*
* 按日期分类文章 无分页
* */
exports.getArticlesByDate = (req,res) => {
  let {article_type} = req.query;
  let sqlYear = 'SELECT  YEAR(publishTime) FROM artical where article_type = ? GROUP BY YEAR(publishTime) ORDER BY YEAR(publishTime) DESC';// 查询文章包含的所有年份并按降序排列
  let sql = 'SELECT * FROM artical WHERE YEAR(publishTime) = ? AND article_type = ? ORDER BY publishTime DESC';//按年份查询对应的文章列表并按时间降序排列
  let arr = [];
  db.query(sqlYear,[parseInt(article_type,10)],async (error,results) => {
    let resData = [];
    for(let i = 0,len = results.length;i < len;i++){
      resData = await queryFun(results[i],parseInt(article_type,10));
    }
    res.json({
      "code":statusCode.ERROR_OK,
      "data":resData
    })
  })
  // 拿到forEach循环结束后的结果集 不能保证结果的顺序
  function queryFun(item,type){
    return new Promise((resolve, reject) => {
      db.query(sql,[item['YEAR(publishTime)'],type],(error,results,fields) => {
        if(error) {
          reject(error);
          throw error;
        }
        arr.push({
          year: item['YEAR(publishTime)'],
          list: [...results]
        })
        resolve(arr);
      })
    })
  }

}


/*
* 添加文章
* */
exports.addArticles = (req,res) => {
  let { title,brief,article_type,comments,views,loves,tags_id,images_url,contents,publishTime } = req.body;
  db.query(sqlObj.insertSql,[title,brief,article_type,comments,views,loves,tags_id,images_url,contents,publishTime],(error,results,fields) => {
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
* 更新文章
* */
exports.updateArticles = (req,res) => {
  let { id,title,brief,article_type,comments,views,loves,tags_id,images_url,contents,publishTime } = req.body;
  db.query(sqlObj.updateSql,[title,brief,article_type,comments,views,loves,tags_id,images_url,contents,publishTime,id],(error,results,fields) => {
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
* 根据ID删除文章
* */
exports.delArticles = (req,res) => {
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
  * {Number}  article_type 文章类型
  * */
function getDataWithPages(req,res,db,tableName,isPage = true){
  let pageCount = 0,
    params = req.query && Object.keys(req.query).length > 0 ? req.query : req.params,
    {id,publishTime,tag_id,article_type,current,size} = params,
    currentPage = parseInt(current,10) || 1,
    pageSize = parseInt(size,10) || 10;
  let start = (currentPage - 1)*pageSize;
  let end = pageSize;
  let sql2 = isPage ? addSql({id,publishTime,tag_id,article_type},start,end) : addSql({id,publishTime,tag_id,article_type});
  let totalSql = addSql({id,publishTime,tag_id,article_type});
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
          total:total,
          results:data
        }
      }
      //查看文章详情时 更新views数量
      if(!isPage && data.length > 0){
        let views = data[0].views;
        views++;
        let updateSql = '';
        if(parseInt(article_type,10) === 2){
            updateSql = pottUpdateSql({views,article_type});
        }else{
            updateSql = pottUpdateSql({views,id});
        }
        db.query(updateSql,[],(error,results) => {})
      }
    }
    return res.json(result);
  })
  // 动态拼接查询的sql语句
  function addSql({id,publishTime,tag_id,article_type},start,end){
    let sql = sqlObj.querySql;
    if(id){
      sql += ' AND a.id = '+id;
    }else if(publishTime){
      sql += ' AND publishTime = '+publishTime;
    }else if(tag_id){
      sql += ' AND tag_id = '+tag_id;
    }else if(article_type){
      sql += ' AND article_type = '+article_type;
    }
    sql += ' ORDER BY a.publishTime DESC';
    if(start >= 0 && end){
      sql += ' limit ' + start + ','+ end;
    }
    return sql;
  }

  // 修改相应字段的值 如文章访问数,评论数,点赞数等
  function pottUpdateSql({title,brief,article_type,comments,views,loves,tags_id,images_url,contents,publishTime,id}){
    let sql = 'UPDATE artical SET ';
    let obj = arguments[0];
    let keyLen = Object.keys(obj);
    let seperate = keyLen.length > 2 ? ',':'';
    if(title){
      sql += `title = ${title}${seperate}`;
    }else if(brief){
      sql += `brief = ${brief}${seperate}`;
    }else if(comments){
      sql += `comments = ${comments}${seperate}`;
    }else if(views){
      sql += `views = ${views}${seperate}`;
    }else if(loves){
      sql += `loves = ${loves}${seperate}`;
    }else if(tags_id){
      sql += `tags_id = ${tags_id}${seperate}`;
    }else if(images_url){
      sql += `images_url = ${images_url}${seperate}`;
    }else if(contents){
      sql += `contents = ${contents}${seperate}`;
    }else if(publishTime){
      sql += `publishTime = ${publishTime}`;
    }
    // 关于我文章的相关字段做特殊处理
    if(parseInt(article_type,10) === 2){
      sql += ` where article_type = ${article_type}`;
    }else{
      sql += ` where id = ${id}`;
    }
    return sql;
  }
}
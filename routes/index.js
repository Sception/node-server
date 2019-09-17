const express = require('express');
const routes = express.Router();
const article = require('./article');
const resource = require('./resource');
const tags = require('./tags');
const user = require('./user');
const upload = require('./upload');

//后台管理系统接口  需token
routes.get('/user/getCaptcha',user.getCaptcha);
routes.post('/user/login',user.login);
routes.get('/tags',tags.getTagsList);
routes.put('/tags',tags.updateTags);
routes.delete('/tags/:id',tags.deleteTags);
routes.post('/tags',tags.addTags);
routes.get('/articles',article.getArticles);
routes.post('/articles',article.addArticles);
routes.put('/articles',article.updateArticles);
routes.delete('/articles/:id',article.delArticles);
routes.get('/resource',resource.getResource);
routes.post('/resource',resource.addResource);
routes.delete('/resource/:id',resource.delResource);
routes.put('/resource',resource.updateResource);
routes.get('/resourceType',resource.getResourceType);
routes.post('/resourceType',resource.addResourceType);
routes.get('/upload/getToken',upload.getToken);

//博客前端展示接口  无需token
routes.get('/tags/all',tags.getTagsAll);
routes.get('/tags/getTagsArticleList',tags.getTagsArticleList);
routes.get('/articles/list',article.getArticles);
routes.get('/articles/detail',article.getArticlesDetail);
routes.get('/archive/all',article.getArticlesByDate);
routes.get('/resource/all',resource.getResTypeList);
module.exports = routes;
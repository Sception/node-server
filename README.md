# node-server
> 基于Node+Express+Mysql的博客网站的后台(这里主要是后端实现),线上地址:http://www.zoujiesss.com

## Build Setup

```bash
# 克隆项目
git clone https://github.com/Sception/noder-server.git

# 进入项目目录
cd noder-server

# 安装依赖
npm install

npm install --registry=https://registry.npm.taobao.org

# 启动服务
supervisor index.js
```

浏览器访问 [http://localhost:3000](http://localhost:3000)

## Technology
- node
- body-parser: "^1.19.0",
- cookie-parser: "^1.4.4",
- express: "^4.17.1",
- jsonwebtoken: "^8.5.1",
- moment: "^2.24.0",
- morgan: "^1.9.1",
- mysql: "^2.17.1",
- qiniu: "^7.2.2",
- svg-captcha: "^1.4.0"

## Completed（only server）
- [x] 登录
- [x] 标签管理
- [x] 资源管理
- [x] 文章管理
- [x] 文章浏览量更新

## To do list(only server)
- [ ] 评论管理
- [ ] PV、UV统计
- [ ] 日志管理

## License

[MIT](https://github.com/Sception/noder-server/blob/master/LICENSE) license.

Copyright (c) 2019-present ZouJie

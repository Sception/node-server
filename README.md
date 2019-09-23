# node-server
> 基于Node+Express+Mysql的博客网站的后台(这里主要是后端实现),线上地址:http://www.zoujiesss.com

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

## Directory
![directory](https://github.com/Sception/Sception.io/blob/master/images/directory.jpg)

## tips
请注意clone下来的代码需修改其中的某些配置项方能使用
### DatabaseConfig
config文件夹下的database.config.js文件中,导入自己的数据库配置信息(主机地址,数据库名称,用户名,密码等)
![DatabaseConfig](https://github.com/Sception/Sception.io/blob/master/images/database_config.jpg)

将my_db.sql文件导入数据库中生成相应的表(以navicat为例)
![generalTable](https://github.com/Sception/Sception.io/blob/master/images/generalTable.jpg)
### QiNiuConfig
![QiNiuConfig](https://github.com/Sception/Sception.io/blob/master/images/qiniuConfig.png)
在config文件夹下的qiniuConf.js文件中,将自己的七牛管理后台中的key填入其中即可(key所在位置如下图所示)
![QiNiuKey](https://github.com/Sception/Sception.io/blob/master/images/qiNiuKey.png)

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

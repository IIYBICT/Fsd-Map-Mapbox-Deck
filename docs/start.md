# 前言

由 DataElement - De004 开发，采用 Go+Vue 组合开发

## 准备工作

准备好一台服务器，最好是宝塔（目前应该都在用吧）

前往 [DeStudio 源码分享站](https://pan.deteam.cn)下载最新的压缩包

<font color="red">需要授权码才能使用</font>

# 1. 上传

在宝塔面板中，点击 `文件管理`，到 `/www/wwwroot/` 目录下，新建一个文件夹，比如 `de_map`，然后将下载的源码上传到该目录下

# 2. 解压

将上传好的压缩包解压

# 3. 安装 Redis

在宝塔面板中，点击 `软件商店`，搜索 `Redis`，安装，没有的自行百度安装方法

# 4. 创建数据库

在宝塔面板中，点击 `数据库`，新建一个数据库，比如 `de_map`，然后记住账号密码数据库名

# 5. 配置

在`conf/app.conf`文件进行配置，所有配置如下：

```
[Mysql]
# 数据库地址
dbHost = 127.0.0.1
# 数据库端口
dbPort = 3306
# 数据库用户名
dbUser = de_map_v2
# 数据库密码
dbPassword = 123456
# 数据库名
dbName = de_map_v2

[redis]
# Redis IP和端口
conn = 127.0.0.1:6379
# Redis 库
dbNum = 0
# Redis密码
password =

[DeMap]
# whazzup.txt文件所在地
whazzupPath = /www/wwwroot/map.deteam.cn/whazzup.txt
# 运行端口
webPort = 8090
```

PS:有些人在改完数据库后还是连不上，可尝试使用 root 账号连接

~~如果还是不行，那就 GG 吧（bushi）~~

# 6. 部署启动

在宝塔面板中，点击 `网站`，然后点击 `Go项目`-`添加Go项目`，在弹出的页面中，项目执行文件选择解压出来的`De-Fsd-Map`文件

Windows 选择`De-Fsd-Map.exe`文件（Windows 用户可以直接在远程桌面双击打开或终端执行）

端口填写`8090`(`8090`为默认端口，可在`conf/app.conf`下更改)

### 7。绑定域名

到 Go 项目中点击`管理`-`域名管理`添加域名，

然后到 Go 项目中点击`管理`-`配置文件`，滑到最下面，添加`ProxyPass /ws/whazzup ws://127.0.0.1:8090/ws/whazzup`

具体配置：

## Apache：

```
# HTTP反向代理相关配置开始 >>>
    <IfModule mod_proxy.c>
        ProxyRequests Off
        SSLProxyEngine on
        ProxyPreserveHost On
        ProxyPass /ws/whazzup ws://127.0.0.1:8090/ws/whazzup
        ProxyPass / http://127.0.0.1:8090/
        ProxyPassReverse / http://127.0.0.1:8090/
    </IfModule>
```

`ProxyPreserveHost On`这个必须设置，否则会提示 IP 不匹配

`ProxyPass /ws/whazzup ws://127.0.0.1:8090/ws/`这个是设置 whazzup 的 Websocket 服务的，也是必须的，这个也必须在`ProxyPass / http://127.0.0.1:8090/`之前。

## Nginx：

Nginx 不用做什么配置，只需要将

```
proxy_set_header Host 127.0.0.1:$server_port;
```

改成

```
proxy_set_header Host $host;
```

这个也是必须设置的，否则会提示 IP 不匹配

端口根据自己在配置文件上设置的修改，

重启即可绑定域名

### 7. 后台地址

后台地址：`http://你的域名/admin`
默认密码：`123456`

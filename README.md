# TDR-uniapp

TDR-uniapp（教学管理日报系统-小程序端）

需依赖于 [此项目](https://gitee.com/ufec/tdr) 

## 安装

获取源代码

```shell
git clone https://gitee.com/ufec/tdr-uniapp.git
```

打开 `common/my.http.interceptor.js` 文件，修改第三行为你[服务端](https://gitee.com/ufec/tdr)的地址

并将 `http.interceptor.js` 重命名为 `http.interceptor.js` 或者执行如下命令

```shell
copy .\common\my.http.interceptor.js .\common\http.interceptor.js
```

## 配置

推荐使用 [HBuilder X](https://www.dcloud.io/hbuilderx.html) IDE，

用 `HBuilder X` 打开此项目，点击 `manifest.json` 文件，找到微信小程序配置，输入微信小程序后台获取的 `AppID`

取消勾选 `检查安全域名和TLS版本` 

>注：此项默认未勾选，不动即可

## 运行

找到顶部 `运行` 选项卡，依次选择 `运行到小程序模拟器->微信开发者工具` 等待编译运行即可

## 鸣谢

- 感谢 [uni-app](https://gitee.com/dcloud/uni-app) ，提供开源免费的多端框架

- 感谢 [uView](https://gitee.com/xuqu/uView) 提供开源免费的UI框架

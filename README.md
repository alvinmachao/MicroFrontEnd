# 一、初始化工程

```
npm install

npm run serve

```

# 二、app 概念

1、**要求**

2、**App 状态**

App 共有 11 个状态，流转如下图

![APP状态](https://github.com/alvinmachao/MicroFrontEnd/blob/master/images/%E5%BE%AE%E6%9C%8D%E5%8A%A1APP%E7%8A%B6%E6%80%81%E6%B5%81%E8%BD%AC.png)
状态说明
| 状态 | 说明 |下一个状态|
| --- | --- |---|
| NOT_LOADED | 默认状态 |LOAD_SOURCE_CODE|
| LOAD_SOURCE_CODE | 加载 App 资源中 |NOT_BOOTSTRAPED SKIP_BECAUSE_BROKEN LOAD_ERROR|
|NOT_BOOTSTRAPED|app 加载完成还未启动|BOOTSTRAPPING|
|BOOTSTRAPPING|app 启动中 （执行 bootstrap 生命周期函数只会执行一次）|SKIP_BECAUSE_BROKEN|
|NOT_MOUNTED|启动完成或者 unmount 生命周期执行成功等待挂载（mount 生命周期)| MOUNTTING UPDATEING |
|MOUNTTING|挂载中，执行 mount 生命周期中|SKIP_BECAUSE_BROKEN MOUNTED |
|MOUNTED| mount 生命周期执行成功意味着挂载成功|UNMOUNTTING|
|UNMOUNTTING|卸载中执行 unmout 生命周期函数|NOT_MOUNTED SKIP_BECAUSE_BROKEN|
|UPDATEING|service 更新中只有 service 有此状态|MOUNTED SKIP_BECAUSE_BROKEN |
| SKIP_BECAUSE_BROKEN | app 变更失败就会变成此状态，且不会在变更 | 无 |
| LOAD_ERROR | 加载错误意味着 app 无法使用 | 无 |

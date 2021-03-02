# 一、初始化工程

```
npm install

npm run serve

```

# 二、前端微服务概念

微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。

微前端架构核心优势：

1. 独立开发，独立部署
   微应用单独建项、单独部署，部署完成主框架自动完成更新
2. 技术栈无关
   主框架不限制微应用的技术栈
3. 增量升级
   完成项目重构，微前端可以以一种渐进式的手段进行重构
4. 独立运行时
   微应用之间相互隔离

微前端的几种实现方式：

| 方案           | 描述                                                                                             | 优点         | 缺点                           |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------ | ------------------------------ |
| Nginx 路由转接 | 通过配置 ginx 的反向代理实现不同路由映射到不同应用（此方案不属于前端改造范围，应归属于运维范围） | 简单、已配置 | 切换时候浏览器会刷新，影响体验 |

| iframe 嵌套 | 父应用在一个页面里，子应用嵌套在 iframe 内部，父子通信 postMessage 或者 contentWindow | 实现简单，子应用自带隔离 | 显示和样式太过简单，兼容性差 |
| WebComponents | 每个子应用需要用全新的 Web Components 技术进行开发 | 每个子应用有独立 js、css 、可独立部署 | 历史项目难更改，通信方面难度大 |
| 组合式的应用路由分发 | 子应用独立开发部署，主框架进行路由管理、应用加载、启动、卸载、以及通信机制 | 纯前端改造，体检好可以无感切换，子应用相互隔离 | 需要统一设计和开发，父子处于同一运行时，需要解决子应用样式冲突，全局作用的污染以及通信机制 |

# 三、app 概念

1、**要求**

这些微应用称之为 app，为了能更好的保证 app 运行正常，要求每个 app 必须向外 export 完整的生命周期函数，让微前端框架可以更好的追踪和控制它们

```
export default {
    // app启动
    bootstrap:() => Promise.resolve(),
    // app挂载
    mount:() => Promise.resolve() ,
    // app卸载
    unmout:() => Promise.resolve(),
    // 更新 service独有
    update:() => Promise.resolve()
}
```

    app 生命周期函数一共 4 个：bootstrap,mount,unmout,update
    app 生命周期函数必须返回 Promise

2、**App 状态**

App 共有 11 个状态，流转如下图

![APP状态](https://github.com/alvinmachao/MicroFrontEnd/blob/master/images/%E5%BE%AE%E6%9C%8D%E5%8A%A1APP%E7%8A%B6%E6%80%81%E6%B5%81%E8%BD%AC.png)

状态说明

| 状态                | 说明                                                           | 下一个状态                                     |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------- |
| NOT_LOADED          | 默认状态                                                       | LOAD_SOURCE_CODE                               |
| LOAD_SOURCE_CODE    | 加载 App 资源中                                                | NOT_BOOTSTRAPED SKIP_BECAUSE_BROKEN LOAD_ERROR |
| NOT_BOOTSTRAPED     | app 加载完成还未启动                                           | BOOTSTRAPPING                                  |
| BOOTSTRAPPING       | app 启动中 （执行 bootstrap 生命周期函数只会执行一次）         | SKIP_BECAUSE_BROKEN                            |
| NOT_MOUNTED         | 启动完成或者 unmount 生命周期执行成功等待挂载（mount 生命周期) | MOUNTTING UPDATEING                            |
| MOUNTTING           | 挂载中，执行 mount 生命周期中                                  | SKIP_BECAUSE_BROKEN MOUNTED                    |
| MOUNTED             | mount 生命周期执行成功意味着挂载成功                           | UNMOUNTTING                                    |
| UNMOUNTTING         | 卸载中执行 unmout 生命周期函数                                 | NOT_MOUNTED SKIP_BECAUSE_BROKEN                |
| UPDATEING           | service 更新中只有 service 有此状态                            | MOUNTED SKIP_BECAUSE_BROKEN                    |
| SKIP_BECAUSE_BROKEN | app 变更失败就会变成此状态，且不会在变更                       | 无                                             |
| LOAD_ERROR          | 加载错误意味着 app 无法使用                                    | 无                                             |

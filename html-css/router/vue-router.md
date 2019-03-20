history 
    API
        window.history.pushState(state, title, url) 
            // state：需要保存的数据，这个数据在触发popstate事件时，可以在event.state里获取
            // title：标题，基本没用，一般传 null
            // url：设定新的历史记录的 url。新的 url 与当前 url 的 origin 必须是一樣的，否则会抛出错误。url可以是绝对路径，也可以是相对路径。
            //如 当前url是 https://www.baidu.com/a/,执行history.pushState(null, null, './qq/')，则变成 https://www.baidu.com/a/qq/，
            //执行history.pushState(null, null, '/qq/')，则变成 https://www.baidu.com/qq/

            window.history.replaceState(state, title, url)
            // 与 pushState 基本相同，但她是修改当前历史记录，而 pushState 是创建新的历史记录

            window.addEventListener("popstate", function() {
                // 监听浏览器前进后退事件，pushState 与 replaceState 方法不会触发              
            });

            window.history.back() // 后退
            window.history.forward() // 前进
            window.history.go(1) // 前进一步，-2为后退两步，window.history.length 可以查看当前历史堆栈中页面的数量

        "更新视图但不重新请求页面"是前端路由的原理的核心之一，目前在浏览器环境中这一功能的实现主要有两种方式

        利用URL中的hash（"#"）
        利用History interface在 HTML5中新增的方法
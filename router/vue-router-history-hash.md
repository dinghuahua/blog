###路由router
#####背景：
        在现在这些MVC和MVVM框架兴起之前，是不存在前端路由的，页面之间的跳转是由后台控制的。随着前后端分离和单页面应用（SPA）的兴起和WEB项目复杂度的增加，再加上前面这些框架的支持，慢慢前端路由也就成为了现实。单页面应用的特点就是可以在改变URL在不重新请求页面的情况下更新页面视图。目前在浏览器环境中这一功能的实现主要有两种方式
            利用URL中的hash（"#"）
            利用History interface在 HTML5中新增的方法
        
        hash 能兼容到IE8， history 只能兼容到 IE10
        
        history 模式改变 url 的方式会导致浏览器向服务器发送请求，这不是我们想看到的，我们需要在服务器端做处理：如果匹配不到任何静态资源，则应该始终返回同一个 html 页面。
        
        首先，hash 本来是拿来做页面定位的，如果拿来做路由的话，原来的锚点功能就不能用了。其次，hash 的传参是基于 url 的，如果要传递复杂的数据，会有体积的限制，而 history 模式不仅可以在url里放参数，还可以将数据存放在一个特定的对象中。
        最重要的一点：
            如果不想要很丑的 hash，我们可以用路由的 history 模式
                                      —— 引用自 vueRouter文档 

####history
#####属性
        *1.host:域名+端口号
        *2.hostname:域名
        *3.port:端口号
        *4.protocol:协议
        *5.href：完整路径
        *6.origin：协议+域名+端口
        *7.hash：井号 (#) 开始的 URL(hash)
        *8.pathname:文档路径+文档名
        *9.search:(?)后面的内容
#####API
        window.history.pushState(state, title, url) 
            // state：需要保存的数据，这个数据在触发popstate事件时，可以在event.state里获取
            // title：标题，基本没用，一般传 null
            // url：  设定新的历史记录的 url。新的 url 与当前 url 的 origin 必须是一样的，否则会抛出错误。url可以是绝对路径，也可以是相对路径。
            //如 当前url是 https://www.baidu.com/a/,执行history.pushState(null, null, './qq/')，则变成 https://www.baidu.com/a/qq/，
            //执行history.pushState(null, null, '/qq/')，则变成 https://www.baidu.com/qq/

        window.history.replaceState(state, title, url)
            // 与 pushState 基本相同，但它是修改当前历史记录，而 pushState 是创建新的历史记录

        window.addEventListener("popstate", function() {
            // 监听浏览器前进后退事件，pushState 与 replaceState 方法不会触发              
        });

        window.history.back() // 后退
        window.history.forward() // 前进
        window.history.go(1) // 前进一步，-2为后退两步，window.history.length 可以查看当前历史堆栈中页面的数量

####hash
#####hash介绍
        这里的 hash 就是指 url 后的 # 号以及后面的字符。这里的 # 和 css 里的 # 是一个意思(#是id属性)。
        hash 也 称作 锚点，本身是用来做页面定位的，它可以使对应 id 的元素显示在可视区域内。
        由于 hash 值变化不会导致浏览器向服务器发出请求，而且 hash 改变会触发 hashchange 事件，浏览器的进后退也能对其进行控制，所以人们在 html5 的 history 出现前，基本都是使用 hash 来实现前端路由的。
#####API 
        window.location.hash = 'qq'         // 设置 url 的 hash，会在当前url后加上 '#qq'
                                            // 就算赋值的时候没有加# hash 也会自动加# 如果赋值时有一个# 则相当于是默认的#，如果赋值时添加2个以上的#，则最后用hash值来匹配路由的时候是总数量减1个#，所以在匹配路由的时候经常会从1这个位置来截取
        var hash = window.location.hash     // 获取hash值 '#qq'  
        window.addEventListener('hashchange', function(){ 
            // 监听hash变化，点击浏览器的前进后退会触发
        })
        eg:  
            window.location.hash = 'qq' 或者  window.location.hash = '#qq'     
            window.location.hash 值为 #qq
            用hash来控制路由时，window.location.hash.substring(1)来获取hash内容qq，来进行匹配路由
        
            window.location.hash = '##qq'     
            window.location.hash 值为 ##qq
            用hash来控制路由时，window.location.hash.substring(1)来获取hash内容#qq，来进行匹配路由

#####例子
######hash原生API 的应用

#######用随机数的方式生成hash值，同时改变hash 并展示到页面当中

        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <script>
                    window.onload = function(){ 
                        var  getoneNum = function(start,end){
                            var rand_num = Math.random();
                            var range = end - start ;
                            return Math.floor(Math.random() * (end - start) + start);
                        };
                        function Ohash(){
                            this.ospan = document.querySelector('.ospan');
                            this.obtn = document.querySelector('input');
                        };
                        Ohash.prototype.bind = function(){
                            var that = this;
                            this.obtn.onclick = function(){
                                location.hash = getnum(1,100);
                                that.ospan.innerHTML = location.hash.substring(1) ;
                            };
                            window.onhashchange = function(){
                                that.ospan.innerHTML = location.hash.substring(1)||'' ;
                            };
                        };
                        var Oha = new Ohash();
                        Oha.bind();
                    }
                </script>
            </head>
            <body>
                <div class='box'> 
                <input type="submit" value="触发按钮">
                <span class="ospan"></span>
                </div>
            </body>
        </html>

#######模拟Vue-router的实现

            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Document</title>
                    <script>
                        window.onload = function(){
                            (function(){
                                var Router=function(){
                                    this.routes={};
                                    this.curUrl='/';
                                };
                                // 对路由的hash值进行监听，如果发生改变，则调用reloadPage()函数
                                Router.prototype.init= function(){
                                    // 这里的两个this 是不一样的，需要注意
                                    window.addEventListener('hashchange',this.reloadPage.bind(this) );
                                };
                                // 调用reloadPage函数，实际上时执行routes[]()函数
                                Router.prototype.reloadPage = function(){
                                    this.curUrl = location.hash.substring(1)||'/';
                                    this.routes[this.curUrl]();
                                };
                                // 路由配置的规则
                                Router.prototype.map = function(key,callback){
                                    this.routes[key] = callback;
                                }
                                window.Router = Router;
                            })();

                            var ORouter = new Router();
                            ORouter.init();
                            var Osect = document.querySelector('section');

                            // 以下为路由配置的设置，形象的当做一个路由与调用函数的映射表也可以
                            ORouter.map('/',function(){
                                Osect.innerHTML = "欢迎";
                            });
                            ORouter.map('/01',function(){
                                Osect.innerHTML = "2019";
                            });
                            ORouter.map('/02',function(){
                                Osect.innerHTML = "2018";
                            });
                            ORouter.map('/03',function(){
                                Osect.innerHTML = "2017";
                            });
                            ORouter.map('/04',function(){
                                Osect.innerHTML = "2016";
                            });
                            ORouter.map('/05',function(){
                                Osect.innerHTML = "2015";
                            });
                        }
                    </script>
                </head>
                <body>
                    <header>这里是头部</header>
                    <nav>
                        <li> <a href="#/">a</a>    </li>
                        <li> <a href="#/01">b</a>  </li>
                        <li> <a href="#/02">c</a>  </li>
                        <li> <a href="#/03">d</a>  </li>
                        <li> <a href="#/04">e</a>  </li>
                        <li> <a href="#/05">f</a>  </li>
                    </nav>
                    <section>
                        如果想看路由改变效果，请点击上边的链接
                    </section>
                    <div class="clear"></div>
                    <footer>这里是尾部</footer>
                </body>
            </html>

#### hash 和 history 对比

        |   维度   |   hash   |  history |
        | :------: | :------: | :------: |
        | push | location.hash | history.pushState |
        | replace | location.replace | history.replace |
        | 监听变化 | window.onhashchange | window.onpopstate |

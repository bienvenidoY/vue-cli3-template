# vue-cli3 配置

- vue-cli  v3.0.0
- node v10.6.0

## feature
- 增加site测试环境
- 增加alias文件索引配置
- 生产环境删除console
- 本地代理
- 剔除vue等公共依赖包、使用cdn加载
- eslint 开启关闭设置

## 新增环境变量
#### 文档
``` javascript
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```
一个环境文件只包含环境变量的“键=值”对：
```javascript
FOO=bar
VUE_APP_SECRET=secret
```

#### 示例:site模式
1. 项目下新建`.env.site `文件:
``` javascript
NODE_ENV = 'site'
```

2. 在package.json的scripts中增加
``` javascript
"site": "vue-cli-service build --mode site"
```
3. main.js入口文件打印`process.env`,可以在控制台看到:
``` javascript
{
    BASE_URL: "/",
    NODE_ENV: "site",
    VUE_APP_CLI_UI_URL:""
}
``` 
4. `npm run site` 构建出dist目录
5. 在本地预览生产环境构建最简单的方式就是使用一个 Node.js 静态文件服务器，例如[serve](https://github.com/zeit/serve)
``` javascript
npm install -g serve
# -s 参数的意思是将其架设在 Single-Page Application 模式下
# 这个模式会处理即将提到的路由问题
serve -s dist
```


#### tips
 ```
Q: 使用vue ui构建项目，配置正确，环境却没有改变?
A: 在ui界面中点击设置图标，打开设置把默认打包环境production改成（unset）
 ```


## 增加alias

`vue create Project`初始化项目时默认不生成`vue.config.js`，需要自行在项目中新建`vue.config.js`

``` javascript
// vue.config.js
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: true,
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('base',resolve('src/base'))
            .set('styles',resolve('src/styles'))
            .set('api',resolve('src/api'))
            .set('store',resolve('src/store'))
            .set('router',resolve('src/router'))
            .set('static',resolve('src/static'))
    }
}
```

## 删除生产环境console.log
1. 安装依赖

``` javascript
npm install babel-plugin-transform-remove-console --save-dev
```
2. 使用

``` javascript
// babel.config.js
const removeConsolePlugin = []
if(process.env.NODE_ENV === 'production') {
  removeConsolePlugin.push("transform-remove-console")
}

module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: removeConsolePlugin
}

```
## 本地代理
#### devServer.proxy
- Type: string | Object

``` javascript
devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null, // 设置代理
    before: app => {}
  }
## or
  devServer: {
    proxy: {
      '/api': {
        target: '<url>',
        ws: true,
        changeOrigin: true
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  }

```
## 公共依赖包使用cdn加速
1. 增加第三方cdn依赖包

``` 
## public/index.html

<script src="https://unpkg.com/vue@2.5.16/dist/vue.runtime.min.js"></script>

```
2. 配置中剔除依赖包
``` javascript
configureWebpack: {
    externals: {
        vue: "Vue"
    }
}
```

## eslint 关闭

``` javascript
// vue.config.js
// 当 lintOnSave 是一个 truthy 的值时，eslint-loader 在开发和生产构建下都会被启用。
module.exports = {
    lintOnSave: false // 关闭
}

```

## 完整配置
``` javascript
// vue.config.js
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    // 部署应用时的基本 URL。默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，
    // 例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。
    // 例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
    // 这个值在开发环境下同样生效。如果你想把开发服务器架设在根路径，你可以使用一个条件式的值
    baseUrl: '/',

    //当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
    //注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
    outputDir: 'build',

    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
    assetsDir: 'static',

    //指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
    indexPath: 'index.html',

    //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。
    //然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
    // filenameHashing: false,

    //当 lintOnSave 是一个 truthy 的值时，eslint-loader 在开发和生产构建下都会被启用。
    //如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置：
    lintOnSave: false,

    //是否使用包含运行时编译器的 Vue 构建版本。
    //设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
    runtimeCompiler: false,

    //默认情况下 babel-loader 会忽略所有 node_modules 中的文件。
    //如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
    transpileDependencies: [],

    //如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,

    //设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
    //使用crossorigin属性，使得加载的跨域脚本可以得出跟同域脚本同样的报错信息。
    crossorigin: undefined,

    //在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。
    //如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性, 这个标签是为了防止 CDN 篡改 javascript 用的。 。
    integrity: false,


    //（高级用法）这是一个一个函数，这个库提供了一个 webpack 原始配置的上层抽象，
    //使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。
    //允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: config => {
        //config.module
        //.rule('vue')
        //.use('vue-loader')
        //.loader('vue-loader')
        //.tap(options => {
        // 修改它的选项...
        // return options
        //})
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('base', resolve('src/base'))
            .set('styles', resolve('src/styles'))
            .set('api', resolve('src/api'))
            .set('store', resolve('src/store'))
            .set('router', resolve('src/router'))
            .set('static', resolve('src/static'))
    },

    //如果想在 JavaScript 中作为 CSS Modules 导入 CSS 或其它预处理文件，
    //该文件应该以 .module.(css|less|sass|scss|styl) 结尾：
    css: {
        //如果你想去掉文件名中的 .module，可以设置 vue.config.js 中的 css.modules 为 true
        modules: true,
        //如果你希望自定义生成的 CSS Modules 模块的类名
        loaderOptions: {
            css: {
                localIdentName: '[name]-[hash]',
                camelCase: 'only'
            },
            //比如你可以这样向所有 Sass 样式传入共享的全局变量：
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.scss` 这个文件
                // data: `@import "@/variables.scss";`
            }
        },
        //生产环境下是 true，开发环境下是 false
        //是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
        //提取 CSS 在开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容。
        //然而，你仍然可以将这个值显性地设置为 true 在所有情况下都强制提取
        extract: process.env.NODE_ENV === 'production' ? true : false,
        sourceMap: false
    },

    //调整 webpack 配置最简单的方式就是在 vue.config.js 中的 configureWebpack 选项提供一个对象：
    //如果你需要基于环境有条件地配置行为，或者想要直接修改配置，
    //那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。
    //该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象：
    configureWebpack: config => {
        config.externals = {
            vue: "Vue",
        }
    },

    //第三方插件
    pluginOptions: {
        //...
    },

    pwa: {
        //默认值为packag.json中的“name”
        name: 'vue-cli3-test',
        //manifest主题颜色
        themeColor: '#4DBA87',
        //PWA app默认背景色
        msTileColor: '#000000',
        //这默认为“no”，因为11.3之前的iOS没有适当的PWA支持。
        appleMobileWebAppCapable: 'yes',
        //默认webApp状态栏颜色为黑色
        appleMobileWebAppStatusBarStyle: 'black',

        //允许您在底层的注入workbox-webpack-plugin插件的时候支持的两种模式之间进行选择。
        //GenerateSW: (默认)，每次重新构建web应用程序时都会创建一个新的server-worker文件。
        //InjectManifest: 允许您从现有的server-worker.js文件中，并创建该文件的副本，并将“预缓存清单”注入其中。
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            //在InjectManifest模式中需要使用swSrc。
            swSrc: 'src/registerServiceWorker.js',
        }
    },



    devServer: {
        host: '0.0.0.0',
        port: 8082,
        https: false,
        //设置为 true 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
        //如果你希望让 lint 错误在开发时直接显示在浏览器中，你可以使用 lintOnSave: 'error'。
        //这会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败。
        //或者，你也可以通过设置让浏览器 overlay 同时显示警告和错误：
        overlay: {
            warnings: true,
            errors: true
        },
        //服务器接口代理
        // proxy: '',
        before: app => { }
    }

}

```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

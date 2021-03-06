import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import request from '@/utils/request' //引入修改axios
import 'iview/dist/styles/iview.css';

//富文本组件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


//生成excel的组件
import Blob from './vendor/Blob.js'
import Export2Excel from './vendor/Export2Excel.js'
Vue.use(VueQuillEditor)

Vue.prototype.$http = request

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
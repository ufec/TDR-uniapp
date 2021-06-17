import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
    ...App
})
import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

// 自定义对象数组去重方法
function unique(arr, key) {
	let obj = {};
	let res = [];
	res = arr.reduce(function(item, next) {
		obj[next[key]] ? "" : obj[next[key]] = true && item.push(next);
		return item
	}, []);
	return res;
}

Vue.prototype.$unique = unique;
app.$mount()
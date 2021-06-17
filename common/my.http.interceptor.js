const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: '你的网址',
		dataType: 'json',
		showLoading: true, // 是否显示请求中的loading
		loadingText: '请求中...', // 请求loading中的文字提示
		loadingTime: 200, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		originalData: true, // 是否在拦截器中返回服务端的原始数据
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 配置请求头信息
		header: {
			'content-type': 'application/json; charset=UTF-8'
		},
	});
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		const Authorization = uni.getStorageSync('Authorization');
		const token_expire = uni.getStorageSync('token_expire');
		if (Authorization && token_expire) {
			let timestamp = new Date().getTime();
			if(timestamp < token_expire) {
				config.header.Authorization = `Bearer ${Authorization}`;
			}
		}
		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if(res.statusCode == 200) {
			// 没有请求成功，弹出提示
			if(res.data.code != 1) {
				switch(res.data.code){
					case 1020001:
						res.data.msg = "身份已过期，请重新登录"
						break;
				}
				vm.$u.toast(res.data.msg ? res.data.msg : res.data.message);
			}
			if(res.data.code == 1020001) {
				// Token过期
				uni.removeStorageSync("Authorization"); // 移除Token
				uni.removeStorageSync("token_expire");
				uni.setStorageSync("user", {
					nick_name: null,
					username: 0,
					avatar_url: "/static/avatar.png",
				}); // 设置默认缓存
				uni.setStorageSync("isLogin", false);
				var timeoutID = setTimeout(()=>{
					uni.navigateTo({
						url: "/pages/login/login",
						success() {
							clearTimeout(timeoutID)
						}
					})
				}, 1500);
			}
			return res.data;
		} else if(res.statusCode == 404) {
			vm.$u.toast('请求地址无效！');
			return false;
		} else if(res.statusCode == 500 ) {
			vm.$u.toast('服务器出了点儿故障哦！');
			return false;
		}
	}
}

export default {
	install
}
<script>
	export default {
		globalData: {  
			oauthPlatform: ""  
		},
		onLaunch: function() {
			console.log('App onLaunch')
		},
		onShow: function() {
			// 根据缓存信息来确定用户是否登录
			const Authorization = uni.getStorageSync('Authorization');
			if (!Authorization) {
				uni.setStorageSync("isLogin", false);
			}else{
				uni.setStorageSync("isLogin", true);
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>

<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">登录账号</view>
			<input type="text"     v-model="username" placeholder="请输入账号" />
			<input type="password" v-model="password" placeholder="请输入密码" />
			<view class="tips">登陆后可以绑定微信账号，以后只需使用微信登陆即可</view>
			<button @tap="login" :style="[inputStyle]" class="getCaptcha">登录</button>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: "",
				password: ""
			}
		},
		
		computed: {
			inputStyle() {
				let style = {};
				if (this.username && this.password) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['warning'];
				}
				return style;
			}
		},
		
		onShow() {
			if(uni.getStorageSync("isLogin")){
				uni.redirectTo({
					url: "../user/user"
				})
			}
		},
		
		methods: {
			login() {
				if (!this.username || !this.password) {
					return false;
				}
				this.$u.api.login({
					username: this.username,
					password: this.password
				}).then(res => {
					if (res.code != 1) {
						this.$u.toast(res.msg, 1500);
						return false;
					}
					
					// 登录成功
					uni.setStorageSync('user', res.data.user); // 设置用户信息
					uni.setStorageSync('Authorization', res.data.token); // 设置Token
					uni.setStorageSync('isLogin', true); // 设置登录状态
					uni.setStorageSync("token_expire", res.data.token_expire);
					return this.$refs.uToast.show({
						title: res.msg,
						back: true,
						type: 'success',
					})
				})
			}
		}
	};
</script>

<style lang="scss">
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
				height: 60rpx;
				border-bottom: 3rpx solid rgba(0, 0, 0, 0.1);
			}

			.tips {
				color: $u-type-info;
				margin-bottom: 60rpx;
				margin-top: 50rpx;
			}

			.getCaptcha {
				background-color: rgb(253, 243, 208);
				color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.buttom {
			.loginType {
				display: flex;
				padding: 350rpx 150rpx 150rpx 150rpx;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;
				}
			}

			.hint {
				padding: 20rpx 40rpx;
				font-size: 20rpx;
				color: $u-tips-color;

				.link {
					color: $u-type-warning;
				}
			}
		}
	}

	input {
		margin-top: 50upx;
	}
</style>

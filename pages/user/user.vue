<template>
	<view>
		<u-navbar :is-back="false" title="　" :border-bottom="false">
			<view class="u-flex u-row-right" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="camera-fill" color="#000000" size="48" @click="scanQRCode"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="user.avatar_url" size="140" @click="toLogin"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20"> {{ user.nick_name === null ? "教师姓名" : `欢迎您！${user.nick_name}` }} </view>
				<view class="u-font-14 u-tips-color"> 工号：{{ user.username === 0 ? "登陆可查看" : user.username }} </view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="35"></u-icon>
			</view>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="订阅提醒" @click="notice"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置" @click="toSetting"></u-cell-item>
			</u-cell-group>
		</view>
		<view class="actionBtns" v-if="!isLogin">
			<u-button @click="toLogin" type="primary" :plain="true">账号登录</u-button>
		</view>
		
		<view class="actionBtns" v-if="isLogin">
			<u-button @click="logout" type="primary" :plain="true">退出登录</u-button>
		</view>

		<view class="actionBtns">
			<u-button :plain="true" type="primary" @click="wxLogin">{{ isLogin ? "绑定微信" : "微信登录" }}</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				isLogin: false,
				user: {
					nick_name: null,
					username: 0,
					avatar_url: "/static/avatar.png",
				},
				platForm: "",
			}
		},
		onLoad() {
			console.log("onLoad");
		},

		onShow() {
			// 展示页面时触发
			let isLogin = uni.getStorageSync("isLogin");
			let user = uni.getStorageSync('user'); // 设置角色信息
			if(user && typeof user == "object") {
				this.user = user;
				this.isLogin = isLogin; // 设置登陆状态
			}
		},

		methods: {
			// 跳转登陆界面
			toLogin() {
				if (this.isLogin) {
					return this.$u.toast('您已登录！');
				} else {
					return	uni.navigateTo({
						url: "../login/login"
					})
				}
			},
			
			// 订阅提醒
			notice() {
				return this.$refs.uToast.show({
					title: '订阅提醒待完成',
					type: 'success'
				})
			},
			
			// 去设置界面
			toSetting() {
				uni.navigateTo({
					url: "../setting/setting"
				})
			},
			
			// 退出登录
			logout() {
				this.$u.api.logout().then(res => {
					if(res.code == 1) {
						this.isLogin = false;
						uni.clearStorageSync(); // 清除所有缓存
						this.$refs.uToast.show({
							title: res.msg ? res.msg : res.message,
							mask: true
						})
						this.user = {
							nick_name: null,
							username: 0,
							avatar_url: "/static/avatar.png",
						};
						uni.setStorageSync('user', this.user);
					}
				}).catch(err => {
					throw Error(err);
				});
			},

			//微信授权
			wxLogin(e) {
				if(uni.getUserProfile){
					uni.getUserProfile({
						desc: "获取您的信息，方便登录",
						lang: "zh_CN",
						success: res => {
							uni.login({
								success: code => {
									this.weChatLogin(code.code, res);
								}
							})
						}
					})
				}
			},

			// 登陆接口
			weChatLogin(code, e) {
				let postData = {
					code: code,
					encryptedData: e.encryptedData,
					iv: e.iv,
					rawData: e.rawData,
					signature: e.signature,
				}
				// 登陆状态说明是绑定
				if (this.isLogin && this.user.id) {
					postData['userId'] = this.user.id;
					this.$u.api.bindWechat(postData).then(res => {
						if(res.code == 1) {
							this.$refs.uToast.show({
								title: res.msg,
								type: "success"
							});
							console.log(111);
							uni.setStorageSync('user', res.data.user); // 设置用户信息
							uni.setStorageSync('Authorization', res.data.token); // 设置Token
							uni.setStorageSync('isLogin', true); // 设置登录状态
							uni.setStorageSync("token_expire", res.data.token_expire);
						}
					}).catch(err => {
						throw Error(err);
					})
				}else{
					// 未登录状态登录
					this.$u.api.login({wchatLogin: postData}).then(res => {
						if(res.code == 1) {
							this.$refs.uToast.show({
								title: res.msg,
								type: "success"
							});
							this.user = res.data.user;
							this.isLogin = true;
							uni.setStorageSync('user', res.data.user); // 设置用户信息
							uni.setStorageSync('Authorization', res.data.token); // 设置Token
							uni.setStorageSync('isLogin', true); // 设置登录状态
							uni.setStorageSync("token_expire", res.data.token_expire);
						}
					}).catch(err => {
						throw Error(err);
					})
				}
			},
			
			scanQRCode() {
				uni.scanCode({
				    onlyFromCamera: true,
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
				    }
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.actionBtns {
		margin: 30rpx 20rpx;
	}
</style>

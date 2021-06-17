<template>
	<view class="page">
		<view style="text-align: center;">
			<image src="../../static/logo.png" mode="aspectFit"></image>
		</view>
		
		<view class="detail">
			您正在登陆网页版请确认
		</view>
		<view class="btns">
			<u-button shape="square" :ripple="true" type="primary" style="margin-top: 100rpx;" @click="login">确认登录网页版</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uuid: null,
			}
		},
		
		onLoad(e) {
			if(e.scene == undefined || e.scene.length != 32) {
				uni.showModal({
				    title: '提示',
				    content: '进入场景错误，请扫描网页端小程序码进入',
				    success: function (res) {
				        if (res.confirm) {
				            uni.reLaunch({
				            	url: "/pages/index/index",
				            })
				        } else if (res.cancel) {
				            uni.reLaunch({
				            	url: "/pages/index/index",
				            })
				        }
				    }
				});
			}
			this.uuid = e.scene;
		},
		
		onShow() {
			this.checkLogin();
		},
		
		methods: {
			// 检查登录
			checkLogin(){
				let isLogin = uni.getStorageSync('isLogin');
				if(!isLogin) {
					uni.showModal({
					    title: '提示',
					    content: '还未登录。是否前往登录',
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					            	url: "/pages/login/login",
									complete(res) {
										console.log(res);
									}
					            })
					        } else if (res.cancel) {
					            uni.navigateBack();
					        }
					    }
					});
				}else{
					let user = uni.getStorageSync('user');
					this.user = user;
				}
			},
			
			login() {
				if(!this.uuid){
					return false;
				}
				this.$u.api.checkUUID({
					uuid: this.uuid
				}).then(res =>{
					if(res.code == 1) {
						this.$refs.uToast.show({
							title: '登录成功',
							type: 'success',
							url: '/pages/user/user'
						})
					}
				}).catch(err => {
					throw Error(err);
				})
			}
		}
	}
</script>

<style>
	.btns {
		width: 80%;
		margin: 130rpx 10%;
	}
	
	.btns u-button {
		margin: 15upx;
	}
	
	.detail {
		margin: 10upx 10%;
		line-height: 50upx;
		text-align: center;
	}
</style>

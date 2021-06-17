<template>
	<view>		
		<scroll-view scroll-y="true" >
			<view>
				<view style="text-align: center;">
					<image src="../../static/logo.png" mode="aspectFit"></image>
				</view>
				
				<view class="detail">
					武工大邮电院教师日报系统
				</view>
				<view class="btns">
					<u-button @click="toSubmit" type="primary" :plain="true">填写日报</u-button>
					<u-button @click="todailyList" type="primary" :plain="true">查看日报</u-button>
					<u-button @click="toWiKi" type="primary" :plain="true">使用说明</u-button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			toSubmit() {
				uni.navigateTo({
					url: "../submit/submit"
				})
			},
			todailyList() {
				uni.navigateTo({
					url:"../dailyList/dailyList"
				})
			},
			toWiKi() {
				uni.navigateTo({
					url: "../wiki/wiki"
				})
			},
		}
	}
</script>

<style lang="scss">
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
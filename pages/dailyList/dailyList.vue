<template>
	<view>
		<u-swipe-action :show="item.show" :index="index" 
			v-for="(item, index) in list" :key="item.id" 
			@click="click" @open="open"
			:options="options"
		>
			<view class="item u-border-bottom">
				<image mode="aspectFill" :src="item.images" />
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="title-wrap">
					<text class="title u-line-2">{{ item.title }}</text>
				</view>
			</view>
		</u-swipe-action>
		<u-toast ref="uToast" />
		<u-empty text="空数据" mode="data" v-show="showEmpty"></u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teacherId: "",
				total: 0,
				user: {},
				list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
				page: 1,
				pageSize: 10,
				showEmpty: false,
				options: [
					{
						text: '修改',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			};
		},
		
		onLoad() {
			
		},
		
		onShow() {
			this.checkLogin();
			this.teacherId = this.user.id;
			let total = this.page * this.pageSize;
			if(this.total < total){
				this.getDailyList();
			}
		},
		
		onReachBottom(e) {
			let total = this.page * this.pageSize;
			if(this.total > total){
				this.page += 1;
				this.getDailyList();
			}else{
				this.$refs.uToast.show({
					title: "没有了！",
					type: 'warning'
				});
			}
		},
		
		onPullDownRefresh() {
			let total = this.page * this.pageSize;
			if(this.total > total){
				this.page += 1;
				this.getDailyList();
				uni.stopPullDownRefresh();
			}else{
				this.$refs.uToast.show({
					title: "没有了！",
					type: 'warning'
				});
			}
		},
		
		methods: {
			// 获取日报列表
			getDailyList() {
				this.$u.api.getDailyList({
					id: this.user.id,
					page: this.page,
					pageSize: this.pageSize
				}).then(res => {
					if(res.code == 1){
						this.$refs.uToast.show({
							title: res.msg,
							type: 'success'
						});
						this.total = res.data.total;
						const data = res.data.data;
						data.forEach(e => {
							let submit_time = this.$u.timeFormat(Number(e.submit_time), 'yyyy-mm-dd');
							let date = this.$u.timeFormat(Number(e.post_date), 'yyyy-mm-dd');
							let title = `${e.teacher_name}老师，于${submit_time}日上传${date}日报`;
							if(Number(e.update_time) > 0) {
								let update_time = this.$u.timeFormat(Number(e.update_time), 'yyyy-mm-dd');
								title += `，修改与${update_time}`;
							}else{
								title += "，从未修改"
							}
							this.list.push({
								id: e.id,
								title: title,
								images: "https://i0.hdslb.com/bfs/album/ca876ec72f82c3fc269eeeaf6a7a2d72c87539dc.png",
								show: false
							});
						})
					}
				}).finally(()=>{
					if(this.list.length == 0) {
						this.showEmpty = true;
					}
				})
			},
			
			// 点击事件
			click(index, index1) {
				this.list[index].show = false;
				if(index1 == 1) {
					this.$u.api.deleteDaily({
						id: this.list[index].id,
						teacherId: this.user.id
					}).then(res => {
						if(res.code == 1){
							this.$u.toast("删除成功");
							this.list.splice(index, 1);
						}
					})
				} else {
					// 跳转到修改界面
					uni.redirectTo({
						url: `/pages/submit/submit?dailyId=${this.list[index].id}`
					})
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = !this.list[index].show;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = !this.list[index].show;
				})
			},
			
			// 检查登录
			checkLogin(){
				let isLogin = uni.getStorageSync('isLogin');
				if(!isLogin) {
					uni.showModal({
					    title: '提示',
					    content: '还未登录！是否前往登录',
					    success: function (res) {
					        if (res.confirm) {
					            uni.reLaunch({
					            	url: "/pages/user/user",
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
		}
	};
</script>

<style lang="scss">
	.item {
		display: flex;
		padding: 20rpx;
	}
	
	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}
	
	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}
	
</style>
<template>
	<scroll-view scroll-y="true" >
		<view class="content">
			<view class="title">
				武工大邮电院教师日报使用说明
			</view>
			<view class="part">
				<view class="next">一、首次使用
					<view class="next">首次使用先点击下方<text style="color: #FA3534;">我的</text>选项，可点击头像或者账号登陆进行登陆账号。<text style="color: #FA3534;">注：首次登陆账号和密码一致均为工号</text>
					登录之后，在<text style="color: #FA3534;">我的</text>界面，点击<text style="color: #FA3534;">设置</text>选项进行个人本学期配置，主要配置项如下：
						<view class="next">1、学期课程：填写本学期所教授课程，<text style="color: #FA3534;">注：可填写多个，可根据个人喜好，以逗号、顿号、空格隔开，</text></view>
						<view class="next">2、班级名称：输入班级关键词，稍等一秒左右会弹出选项，选择对应班级即可，可重复操作，错选可删除</view>
						<view class="next">3、班主任：填写本学期所教授班级的班主任，<text style="color: #FA3534;">注：可填写多个，可根据个人喜好，以逗号、顿号、空格隔开，</text></view>
						<view class="next"></view>
					</view>
				</view>
				
				<view class="next">二、日报填写
					<view class="next">
						除第二部分、第三部分、第四部分为可选项之外，其余均需要填写，（实到人数和应到人数不相等时，需填写学生）
					</view>
					<view class="next">
						班级、课程、班主任等均需要提前配置，详见<text style="color: #FA3534;">首次使用</text>说明
					</view>
					<view>
						特殊情况，学生人数选择做如下说明：
						<view class="next">
							1、点击<text style="color: #FA3534;">请选择学生下拉框</text>，在弹出的选项中选择对应班级学生即可
						</view>
						<view class="next">
							2、当人数过多难以选择，点击右侧<text style="color: #FA3534;">搜索</text>按钮，在弹出的窗口中输入学生姓名（可以是姓名中任意字或者学号），等待一会儿，弹出选项，选择学生即可<text style="color: #FA3534;">注：如果还未输入，弹出红色警告，这是正常情况，继续输入即可</text>
						</view>
						<view class="next">
							3、当学生信息有变，可长按已选中的学生，会弹出信息修改页面，修改即可，若未找到学生，可点击右侧<text style="color: #FA3534;">添加</text>来添加学生，可多个添加，可根据个人喜好，以逗号、顿号、空格隔开，
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.title {
		margin-top: 38rpx;
		text-align: center;
		line-height: 30rpx;
		font-size: 35rpx;
	}
	
	.part {
		padding: 30rpx;
		line-height: 50rpx;
		font-size: 35rpx;
	}
	
	.next {
		margin-top: 20rpx;
	}
</style>
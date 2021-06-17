<template>
	<view class="page">
		<u-form>
			<u-form-item label="本学期课程" label-position="top">
				<u-input v-model="course" :border="true" placeholder="请输入课程名称 请用逗号隔开"></u-input>
			</u-form-item>
			<u-form-item label="本学期班级" label-position="top">
				<input-autocomplete
					:value="model.className"
					v-model="model.className"
					placeholder="请输入班级名称"
					highlightColor="#FF0000"
					:loadData="loadAutocompleteData"
					v-on:selectItem="selectItemS"
					:debounce="1500"
				></input-autocomplete>
				<view class="checkboxClass">
					<u-checkbox-group width="auto" :wrap="true">
						<u-checkbox 
							@change="checkboxClassChange" 
							:label-disabled="true" 
							label-size="35" 
							v-model="item.checked" 
							v-for="item in classList" :key="item.key" :name="item.name"
						>{{ item.name }}</u-checkbox>
					</u-checkbox-group>
				</view>
			</u-form-item>
			<u-form-item label="本学期班主任 请用逗号隔开" label-position="top">
				<u-input v-model="headteacher" :border="true"></u-input>
			</u-form-item>
			<u-form-item label="请选择部门" label-position="top">
				<u-input v-model="department" placeholder="请选择部门" disabled :border="true" @click="()=>{showSelectDepartment = !showSelectDepartment}"></u-input>
				<u-select v-model="showSelectDepartment" :default-value="department" :list="departments" :safe-area-inset-bottom="true" @confirm="(e) => {department = e[0].value}"></u-select>
			</u-form-item>
		</u-form>
		<u-toast ref="uToast" />
		<u-button @click="submit">保存</u-button>
	</view>
</template>
<script>
	let that = this;
	export default {
		data() {
			return {
				// 课程
				course: "",
				// 班主任
				headteacher: "",
				model: {
					className: "",
				},
				// 班级列表
				classList: [],
				checkedClass: [],
				teacherId: "",
				user: {},
				showSelectDepartment: false,
				department: "",
				departments: [],
			}
		},
		
		onShow() {
			this.checkLogin();
			uni.showLoading({
				title: "加载中",
				mask: true
			})
			this.$u.api.getTeacherConf({
				teacherId: this.user.id
			}).then(res => {
				if(res.code == 1) {
					let data = res.data;
					this.$refs.uToast.show({
						title: res.msg ? res.msg : res.message,
						type: "success"
					})
					this.course = data.course_name;
					this.headteacher = data.head_teacher;
					this.department = data.department;
					data.class_name.forEach(e => {
						if(e){
							this.classList.push({
								name: e.text,
								checked: true,
								disabled: false,
								key: e.key
							});
							this.checkedClass.push(e.key);
						}
					})
				}else {
					let timeoutId = setTimeout(() => {
						uni.navigateBack({
							delta: 1,
							animationType: 'pop-out',
							animationDuration: 2500,
							success: () => {
								clearTimeout(timeoutId);
							},
						})
					}, 1500);
				}
			}) 
			this.$u.api.getAllDepartment().then(res=>{
				if(res.code == 1) {
					res.data.forEach(item => {
						this.departments.push({
							value: item.name,
							label: item.name
						});
					})
				}
			})
		},
		
		methods: {
			// 更改多选框
			checkboxClassChange(e) {
				this.classList.forEach((item, index, arr) => {
					if(item.name == e.name){
						arr.splice(index, 1)
						this.checkedClass.forEach((el, i, arrs) => {
							if(el == item.key){
								arrs.splice(index, 1);
							}
						})
					}
				})
				
			},
			
			// 选择下拉列表事件
			selectItemS(data) {
				this.model.className = "";
				let nameArr = this.classList.map(item => {
					return item.name;
				})
				if(nameArr.indexOf(data.text) == -1){
					this.classList.push({
						name: data.text,
						checked: true,
						disabled: false,
						key: data.key
					});
					this.checkedClass.push(data.key);
				}
				this.$refs.uToast.show({
					title: "选中了" + data.text,
					type: 'success',
				})
			},
			
			// 输入框变化时动态请求，获取数据
			async loadAutocompleteData(value) {
				if(!value){
					return Promise.resolve([]);
				}
				let res = await this.$u.api.searchClass({
					className: value
				});
				let data = [];
				for(let i = 0; i < res.data.length; i++){
					data.push({
						text: res.data[i].name,
						key: res.data[i].id
					});
				}
				return Promise.resolve(data);
			},
			
			// 检查登录
			checkLogin(){
				let isLogin = uni.getStorageSync('isLogin');
				if(!isLogin) {
					uni.showModal({
					    title: '提示',
					    content: '还未登录。无法填写，是否前往登录',
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
		
			// 表单提交
			submit() {
				console.log();
				let courseArr = this.course.split(/\、|\,|\ |，/);
				let headMasterArr = this.headteacher.split(/\、|\,|\ |，/);
				this.$u.api.setTeacherConf({
					teacherId: this.user.id,
					course: courseArr,
					headmaster: headMasterArr,
					className: this.checkedClass,
					department: this.department,
				}).then(res => {
					if(res.code == 1) {
						this.$refs.uToast.show({
							title: res.msg,
							type: 'success'
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.page {
		padding: 20rpx 10rpx;
	}
	
	.checkboxClass {
		margin-top: 30rpx;
	}
</style>
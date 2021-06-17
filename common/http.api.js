const api = {
  // 用户接口
  loginUrl: "/user/login", // 登录接口
  logoutUrl: "/user/logout", // 退出登录接口
  refreshTokenUrl: "/user/refreshToken", // 刷新Token接口
  changeUserNameUrl: "/user/changeUserName", // 修改用户姓名
  bindWechatUrl: "/user/bindWechat", // 绑定微信
  checkUUIDUrl: "/user/checkUUID", // 校验UUID来执行登录

  // 公共接口
  searchClassUrl: "/api/searchClass", // 搜索班级接口
  getClassStudentUrl: "/api/getClassStudent", // 获取教师配置班级列表中的学生
  searchStudentUrl: "/api/searchStudent", // 搜索对应班级的学生
  getAllDepartmentUrl: "/api/getAllDepartment", // 获取所有部门信息
  
  // 教师日报
  setTeacherConfUrl: "/daily/setTeacherConf", // 设置教学配置接口
  getTeacherConfigUrl: "/daily/getTeacherConf", // 获取教师配置接口
  dailySubmitUrl: "/daily/submit", // 提交日报接口
  dailyListUrl: "/daily/list", // 获取日报列表接口
  getDailyInfoUrl: "/daily/dailyInfo", // 查询日报信息接口
  editDailyUrl: "/daily/editDaily", // 编辑日报接口
  delDailyUrl: "/daily/delDaily", // 删除日报接口
  
}

const install = (Vue, vm) => {
	// 用户接口
	let login = (params = {}, header = {}) => vm.$u.post(api.loginUrl, params, header); // 登录
	let logout = () => vm.$u.get(api.logoutUrl); // 登出 
	let bindWechat = (params = {}, header = {}) => vm.$u.post(api.bindWechatUrl, params, header); // 绑定微信
	let checkUUID = (params = {}, header = {}) => vm.$u.post(api.checkUUIDUrl, params, header); // 绑定微信
	// 教师日报
	let getDailyList = (params = {}, header = {}) => vm.$u.get(api.dailyListUrl, params, header); // 获取教师日报列表
	let getTeacherConf = (params = {}, header = {}) => vm.$u.get(api.getTeacherConfigUrl, params, header); // 获取教师配置
	let setTeacherConf = (params = {}, header = {}) => vm.$u.post(api.setTeacherConfUrl, params, header); // 设置教学配置
	let submitDaily = (params = {}, header = {}) => vm.$u.post(api.dailySubmitUrl, params, header); // 提交日报
	let deleteDaily = (params = {}, header = {}) => vm.$u.post(api.delDailyUrl, params, header); // 删除日报
	let editDaily = (params = {}, header = {}) => vm.$u.post(api.editDailyUrl, params, header); // 编辑日报
	let getDailyInfo = (params = {}, header = {}) => vm.$u.get(api.getDailyInfoUrl, params, header); // 查询日报信息
	
	// 公共API
	let searchStudent = (params = {}, header = {}) => vm.$u.post(api.searchStudentUrl, params, header); // 搜索对应班级的学生
	let getClassStudent = (params = {}, header = {}) => vm.$u.get(api.getClassStudentUrl, params, header); // 获取教师配置班级列表中的学生
	let searchClass = (params = {}, header = {}) => vm.$u.get(api.searchClassUrl, params, header); // 搜索班级
	
	let getAllDepartment = () => vm.$u.get(api.getAllDepartmentUrl); // 获取所有部门

	vm.$u.api = {
		login,
		logout,
		bindWechat,
		getDailyList,
		getTeacherConf,
		setTeacherConf,
		submitDaily,
		deleteDaily,
		editDaily,
		getDailyInfo,
		searchStudent,
		getClassStudent,
		searchClass,
		getAllDepartment,
		checkUUID,
	};
}

export default {
	install
}
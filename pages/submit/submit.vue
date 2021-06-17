<template>
	<scroll-view scroll-y="true">
		<view class="content">
			<u-form :model="model" ref="uForm">
				<!-- 第一部分 -->
				<u-form-item label="第一部分：基本信息" label-position="top"></u-form-item>
				
				<!-- 表单teacherName值 -->
				<u-form-item label="任课教师" :label-width="labelWidth" labelAlign="center" prop="teacherName">
					<u-input :disabled="true" v-model="model.teacherName" :border="true" placeholder="请输入姓名" type="text"></u-input>
				</u-form-item>
				
				<!-- 表单classRoomName值 -->
				<u-form-item label="教室" :label-width="labelWidth" labelAlign="center" prop="classRoomName">
					<u-input v-model="model.classRoomName" :border="true" placeholder="请输入教室名称" type="text"></u-input>
				</u-form-item>
				
				<!-- 表单postDateTemp值 -->
				<u-form-item label="时间" :label-width="labelWidth" labelAlign="center" prop="postDateTemp">
					<u-input v-model="model.postDateTemp" :border="true" placeholder="请选择日期" type="select" @click="openselectDate"></u-input>
					<!-- 日期选择 -->
					<u-picker mode="time" v-model="selectDateShow" :params="selectDateParams" :start-year="nowYear - 1" :end-year="nowYear + 1" @confirm="confirmSelectDate"></u-picker>
				</u-form-item>
				
				<!-- 表单class值 -->
				<u-form-item label="班级" :label-width="labelWidth" labelAlign="center" prop="checkedClass">
					<u-input :border="true" placeholder="请选择班级" type="select" @click="showSelectClass = !showSelectClass "></u-input>
					<u-select v-model="showSelectClass" :list="classList" @confirm="selectClass"></u-select>
					<u-checkbox-group width="auto" :wrap="true" style="position:relative;top:20rpx;">
						<u-checkbox @change="checkboxClassListChange" :label-disabled="true" label-size="35" v-model="item.checked" v-for="(item, index) in checkboxClassList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
				
				<!-- 表单course值 -->
				<u-form-item label="课程" :label-width="labelWidth" labelAlign="center" prop="course">
					<u-input :border="true" :value="model.course" placeholder="请选择课程名称" type="select" @click="showSelectCourse = !showSelectCourse "></u-input>
					<u-select v-model="showSelectCourse" :list="courseList" @confirm="selectCourse"></u-select>
				</u-form-item>
				
				<!-- 课程性质 -->
				<u-form-item label="课程性质" :label-width="labelWidth" labelAlign="center" prop="courseNature">
					<u-radio-group v-model="model.courseNature">
						<u-radio name="正常">正常</u-radio>
						<u-radio name="补课">补课</u-radio>
					</u-radio-group>
				</u-form-item>
				
				<!-- 表单headMaster值 -->
				<u-form-item label="班主任" :label-width="labelWidth" labelAlign="center" prop="checkedHeadTeacher">
					<u-input :border="true" placeholder="请选择班主任名称" type="select" @click="showSelectHeadTeacher = !showSelectHeadTeacher "></u-input>
					<u-select v-model="showSelectHeadTeacher" :list="headMasterList" @confirm="selectHeadMaster"></u-select>
					<u-checkbox-group width="auto" :wrap="true" style="position:relative;top:20rpx;">
						<u-checkbox @change="checkboxHeadMasterListChange" v-model="item.checked" v-for="(item, index) in checkboxHeadMasterList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
				
				<!-- 表单section值 -->
				<u-form-item label="节次" :label-width="labelWidth" labelAlign="center" prop="section">
					<u-input v-model="model.section" :border="true" placeholder="请选择节次" type="select" @click="openSelectSection"></u-input>
					<u-picker
						mode="multiSelector"
						@columnchange="sectionColumnChange"
						v-model="selectSectionShow"
						:range="selectSections"
						:default-selector="defaultSection"
						@confirm="confirmSelectSection"
					></u-picker>
				</u-form-item>
				
				<!-- 表单attendNum值 -->
				<u-form-item label="应到人数" :label-width="labelWidth" labelAlign="center" prop="attendNum">
					<u-input v-model="model.attendNum" :border="true" placeholder="请输入应到人数" type="number"></u-input>
				</u-form-item>
				
				<!-- 表单trueAttendNum值 -->
				<u-form-item label="实到人数" :label-width="labelWidth" labelAlign="center" prop="trueAttendNum">
					<u-input v-model="model.trueAttendNum" :border="true" placeholder="请输入实到人数" type="number"></u-input>
				</u-form-item>
				
				<view v-show="checkNum">
					<!-- 表单以StudenList后缀的值 -->
					<view style="text-align: center; margin: 20rpx 0; color: #FA3534;">
						<text>选中学生后，单击可取消修改，长按文字可修改信息</text>
					</view>
					
					<u-form-item label="旷课人数" :label-width="labelWidth" labelAlign="center" v-show="checkNumOverFlow || model.truancyStudentNum">
						<u-input :value="model.truancyStudentNum" :border="true" type="text" :disabled="true"></u-input>
						<u-input :border="true" placeholder="请选择学生" type="select" @click="openSelectStudent(truancyStudentParams)"></u-input>
						<view class="studenActionBtns" slot="right">
							<u-button type="success" size="mini" @click="searchStudent" dataName="Truancy">搜索</u-button>
							<u-button type="primary" size="mini" @click="inputStudent" dataName="Truancy">添加</u-button>
						</view>
						<u-select v-model="selectTruancyStudent" title="请选择旷课学生"	mode="mutil-column-auto" :list="studentList" @confirm="e => selectStudenConfirm(e, truancyStudentParams)"></u-select>
						<u-checkbox-group width="auto" :wrap="true">
							<u-checkbox 
								:label-disabled="true" 
								label-size="35" 
								@change="e => checkboxChange(e, truancyStudentParams)" 
								@longpress="checkboxLongPress(item.name, truancyStudentParams)" 
								v-model="item.checked" 
								v-for="item in truancyStudenList" :key="item.name" :name="item.name"
							>{{ item.name }}</u-checkbox>
						</u-checkbox-group>
						<!-- 搜索学生名单弹窗 -->
						<u-popup v-model="showSearchTruancy" border-radius="25" :closeable="true" mode="center" width="90%" height="80%" close-icon-pos="top-right">
							<scroll-view scroll-y="true" class="scroll-search">
								<view class="popup-search">
									<text>输入姓名等待搜索即可</text>
									<input-autocomplete
										style="border: #000000;"
										:border="true"
										class="unit-item__input"
										placeholder="请输入学生姓名"
										:debounce="1500"
										:paramObj="truancyStudentParams"
										:loadData="searchStudentList"
										v-on:selectItem="selectSearchStudent"
									></input-autocomplete>
								</view>
							</scroll-view>
						</u-popup>
						<!-- 修改学生信息弹窗 -->
						<u-popup v-model="changeSelectTruancyStudent" border-radius="25" mode="center" width="90%" height="30%" close-icon-pos="top-right" :closeable="true">
							<view class="changeSelectStudentInfo">
								<u-input v-model="changeCache.name" :border="true"></u-input>
								<u-button type="warning" @click="changeStudentInfo(truancyStudentParams)">修改</u-button>
							</view>
						</u-popup>
						<!-- 手动输入学生信息弹窗 -->
						<u-popup v-model="inputTruancyStudent" mode="center" width="90%" height="40%" close-icon-pos="top-right" :closeable="true" border-radius="25">
							<view class="changeSelectStudentInfo">
								<text>可以输入多个</text>
								<u-input v-model="inputStudents" placeholder="请输入学生信息" :border="true"></u-input>
								<u-button type="warning" @click="addStudent(inputStudents, truancyStudentParams)">添加</u-button>
							</view>
						</u-popup>
					</u-form-item>
					
					<u-form-item label="迟到人数" :label-width="labelWidth" labelAlign="center" v-show="checkNumOverFlow || model.lateStudentNum">
						<u-input :value="model.lateStudentNum" :disabled="true" :border="true"></u-input>
						<u-input :border="true" placeholder="请选择学生" type="select" @click="openSelectStudent(lateStudentParams)"></u-input>
						<view class="studenActionBtns" slot="right">
							<u-button type="success" size="mini" @click="searchStudent" dataName="Late">搜索</u-button>
							<u-button type="primary" size="mini" @click="inputStudent" dataName="Late">添加</u-button>
						</view>
						<u-select v-model="selectLateStudent" title="请选择迟到学生" mode="mutil-column-auto" :list="studentList" @confirm="e => selectStudenConfirm(e, lateStudentParams)"></u-select>
						<u-checkbox-group width="auto" :wrap="true">
							<u-checkbox 
								:label-disabled="true"
								label-size="35" 
								@change="e => checkboxChange(e, lateStudentParams)" 
								@longpress="checkboxLongPress(item.name, lateStudentParams)" 
								v-model="item.checked"
								v-for="item in lateStudenList" :key="item.name" :name="item.name"
							>{{ item.name }}</u-checkbox>
						</u-checkbox-group>
						<!-- 搜索学生弹框 -->
						<u-popup v-model="showSearchLate" mode="center" width="90%" height="80%" close-icon-pos="top-right" :closeable="true" border-radius="25">
							<scroll-view scroll-y="true" class="scroll-search">
								<view class="popup-search">
									<input-autocomplete
										style="border: #000000;"
										:border="true"
										class="unit-item__input"
										placeholder="请输入学生姓名"
										:debounce="1500"
										:paramObj="lateStudentParams"
										:loadData="searchStudentList"
										v-on:selectItem="selectSearchStudent"
									></input-autocomplete>
								</view>
							</scroll-view>
						</u-popup>
						<!-- 修改学生信息弹窗 -->
						<u-popup v-model="changeSelectLateStudent" border-radius="25" mode="center" width="90%" height="30%" close-icon-pos="top-right" :closeable="true">
							<view class="changeSelectStudentInfo">
								<u-input v-model="changeCache.name" :border="true"></u-input>
								<u-button type="warning" @click="changeStudentInfo(lateStudentParams)">修改</u-button>
							</view>
						</u-popup>
						<!-- 手动输入学生信息弹窗 -->
						<u-popup v-model="inputLateStudent" mode="center" width="90%" height="40%" close-icon-pos="top-right" :closeable="true" border-radius="25">
							<view class="changeSelectStudentInfo">
								<text>可以输入多个</text>
								<u-input v-model="inputStudents" placeholder="请输入学生信息" :border="true"></u-input>
								<u-button type="warning" @click="addStudent(inputStudents, lateStudentParams)">添加</u-button>
							</view>
						</u-popup>
					</u-form-item>
					
					<u-form-item label="早退人数" :label-width="labelWidth" labelAlign="center" v-show="checkNumOverFlow || model.leaveEarlyStudentNum">
						<u-input :value="model.leaveEarlyStudentNum" :disabled="true" :border="true"></u-input>
						<u-input :border="true" placeholder="请选择学生" type="select" @click="openSelectStudent(leaveEarlyStudentParams)"></u-input>
						<view class="studenActionBtns" slot="right">
							<u-button type="success" size="mini" @click="searchStudent" dataName="LeaveEarly">搜索</u-button>
							<u-button type="primary" size="mini" @click="inputStudent" dataName="LeaveEarly">添加</u-button>
						</view>
						<u-select v-model="selectleaveEarlyStudent" title="请选择早退学生" mode="mutil-column-auto" :list="studentList" @confirm="e => selectStudenConfirm(e, leaveEarlyStudentParams)"></u-select>
						<u-checkbox-group width="auto" :wrap="true">
							<u-checkbox 
								:label-disabled="true" 
								label-size="35" 
								@change="e => checkboxChange(e, leaveEarlyStudentParams)" 
								@longpress="checkboxLongPress(item.name, leaveEarlyStudentParams)" 
								v-model="item.checked" 
								v-for="item in leaveEarlyStudenList" :key="item.name" :name="item.name"
							>{{ item.name }}</u-checkbox>
						</u-checkbox-group>
						<!-- 搜索学生弹窗 -->
						<u-popup v-model="showSearchLeaveEarly" mode="center" width="90%" height="80%" close-icon-pos="top-right" :closeable="true" border-radius="25">
							<scroll-view scroll-y="true" class="scroll-search">
								<view class="popup-search">
									<input-autocomplete
										style="border: #000000;"
										:border="true"
										class="unit-item__input"
										placeholder="请输入学生姓名"
										:debounce="1500"
										:paramObj="leaveEarlyStudentParams"
										:loadData="searchStudentList"
										v-on:selectItem="selectSearchStudent"
									></input-autocomplete>
								</view>
							</scroll-view>
						</u-popup>
						<!-- 修改学生信息弹窗 -->
						<u-popup v-model="changeSelectLeaveEarlyStudent" border-radius="25" mode="center" width="90%" height="30%" close-icon-pos="top-right" :closeable="true">
							<view class="changeSelectStudentInfo">
								<u-input v-model="changeCache.name" :border="true"></u-input>
								<u-button type="warning" @click="changeStudentInfo(leaveEarlyStudentParams)">修改</u-button>
							</view>
						</u-popup>
						<!-- 手动输入学生信息弹窗 -->
						<u-popup v-model="inputLeaveEarlyStudent" mode="center" width="90%" height="40%" close-icon-pos="top-right" :closeable="true" border-radius="25">
							<view class="changeSelectStudentInfo">
								<text>可以输入多个</text>
								<u-input v-model="inputStudents" placeholder="请输入学生信息" :border="true"></u-input>
								<u-button type="warning" @click="addStudent(inputStudents, leaveEarlyStudentParams)">添加</u-button>
							</view>
						</u-popup>
					</u-form-item>
					
					<u-form-item label="请假人数" :label-width="labelWidth" labelAlign="center" v-show="checkNumOverFlow || model.leaveStudentNum">
						<u-input :value="model.leaveStudentNum" :disabled="true" :border="true"></u-input>
						<u-input :border="true" placeholder="请选择学生" type="select" @click="openSelectStudent(leaveStudentParams)"></u-input>
						<view class="studenActionBtns" slot="right">
							<u-button type="success" size="mini" @click="searchStudent" dataName="Leave">搜索</u-button>
							<u-button type="primary" size="mini" @click="inputStudent" dataName="Leave">添加</u-button>
						</view>
						<u-select v-model="selectLeaveStudent" title="请选择请假学生" mode="mutil-column-auto" :list="studentList" @confirm="e => selectStudenConfirm(e, leaveStudentParams)"></u-select>
						<u-checkbox-group width="auto" :wrap="true">
							<u-checkbox
								:label-disabled="true"
								label-size="35" 
								@change="e => checkboxChange(e, leaveStudentParams)" 
								@longpress="checkboxLongPress(item.name, leaveStudentParams)" 
								v-model="item.checked" 
								v-for="item in leaveStudenList" :key="item.name" :name="item.name"
							>{{ item.name }}</u-checkbox>
						</u-checkbox-group>
						<!-- 搜索学生信息弹窗 -->
						<u-popup v-model="showSearchLeave" mode="center" width="90%" height="80%" close-icon-pos="top-right" :closeable="true" border-radius="25">
							<scroll-view scroll-y="true" class="scroll-search">
								<view class="popup-search">
									<input-autocomplete
										style="border: #000000;"
										:border="true"
										class="unit-item__input"
										placeholder="请输入学生姓名"
										:debounce="1500"
										:paramObj="leaveStudentParams"
										:loadData="searchStudentList"
										v-on:selectItem="selectSearchStudent"
									></input-autocomplete>
								</view>
							</scroll-view>
						</u-popup>
						<!-- 修改学生信息弹窗 -->
						<u-popup v-model="changeSelectLeaveStudent" border-radius="25" mode="center" width="90%" height="30%" close-icon-pos="top-right" :closeable="true">
							<view class="changeSelectStudentInfo">
								<u-input v-model="changeCache.name" :border="true"></u-input>
								<u-button type="warning" @click="changeStudentInfo(leaveStudentParams)">修改</u-button>
							</view>
						</u-popup>
						<!-- 手动输入学生信息弹窗 -->
						<u-popup v-model="inputLeaveStudent" mode="center" width="90%" height="40%" close-icon-pos="top-right" :closeable="true" border-radius="25">
							<view class="changeSelectStudentInfo">
								<text>可以输入多个</text>
								<u-input v-model="inputStudents" placeholder="请输入学生信息" :border="true"></u-input>
								<u-button type="warning" @click="addStudent(inputStudents, leaveStudentParams)">添加</u-button>
							</view>
						</u-popup>
					</u-form-item>
				</view>
				
				<!-- 第二部分 -->
				<u-form-item label="第二部分：学生状况 有异常" label-width="400">
					<u-switch v-model="Status.secondPart" slot="right"></u-switch>
				</u-form-item>
				<view v-if="Status.secondPart">
					<u-form-item label="上课时有学生使用手机或娱乐设备" label-width="500" labelAlign="center">
						<u-switch v-model="Status.serious" slot="right" active-color="#19be6b"></u-switch>
					</u-form-item>
					<!-- 有情况则填 -->
					<view v-if="Status.serious">
						<u-form-item label="使用人数" label-position="top">
							<u-radio-group v-model="model.useMedia" @change="radioMediaGroupChange" width="auto" :wrap="true">
								<u-radio shape="circle" v-for="(item, index) in useMediaRadioList" :key="index" :name="item.name">{{ item.name }}</u-radio>
							</u-radio-group>
						</u-form-item>
					</view>
					
					<u-form-item label="上课时学生的言行举止和衣着不得体" label-width="500" labelAlign="center">
						<u-switch v-model="Status.image" slot="right" active-color="#19be6b"></u-switch>
					</u-form-item>
					<!-- 无情况不选择 -->
					<view v-if="Status.image">
						<u-checkbox-group @change="e => checkboxGroupChange(e, 'unImageStudentList')" width="auto" :wrap="true">
							<u-checkbox
								v-model="item.checked" 
								:is_delete="false" 
								v-for="(item, index) in imageCheckBoxList" :key="index" :name="item.name"
							>{{ item.name }}</u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
				
				<!-- 第三部分 -->
				<u-form-item label="第三部分：条件保障 有异常" label-width="400">
					<u-switch v-model="Status.thirdPart" slot="right"></u-switch>
				</u-form-item>
				<view v-if="Status.thirdPart">
					<u-form-item label="投影仪不能正常使用" label-width="300" labelAlign="center">
						<u-switch v-model="Status.projector" slot="right" active-color="#19be6b"></u-switch>
					</u-form-item>
					<view v-if="Status.projector">
						<u-checkbox-group @change="e => checkboxGroupChange(e, 'projectorDamage')" width="auto" :wrap="true">
							<u-checkbox v-model="item.checked" :is_delete="false" v-for="(item, index) in projectorCheckBoxList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
						</u-checkbox-group>
					</view>
					
					<u-form-item label="电脑不能正常使用" label-width="280" labelAlign="center">
						<u-switch v-model="Status.computer" slot="right" active-color="#19be6b"></u-switch>
					</u-form-item>
					<view v-if="Status.computer">
						<u-checkbox-group @change="e => checkboxGroupChange(e, 'computerDamage')" width="auto" :wrap="true">
							<u-checkbox v-model="item.checked" :is_delete="false" v-for="(item, index) in computerCheckBoxList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
						</u-checkbox-group>
					</view>
					<u-form-item label="其它情况" :label-width="labelWidth" label-position="top" prop="otherWarnDamage">
						<u-checkbox-group @change="e => checkboxGroupChange(e, 'otherWarnDamage')" width="auto" :wrap="true">
							<u-checkbox v-model="item.checked" :is_delete="false" v-for="(item, index) in otherCheckBoxList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
						</u-checkbox-group>
					</u-form-item>
				</view>
				
				<!-- 第四部分 -->
				<u-form-item label="第四部分：其它情况 有异常" label-width="400">
					<u-switch v-model="Status.fourthPart" slot="right"></u-switch>
				</u-form-item>
				<view v-if="Status.fourthPart">
					<!-- 表单otherThings值 -->
					<u-form-item label="有其他影响正常课堂教学的不良行为及现象" label-width="400" label-position="top" prop="otherThings">
						<u-input v-model="model.otherThings" :border="true" placeholder="请输入其他问题" type="textarea"></u-input>
					</u-form-item>
				</view>
			</u-form>
			
			<!-- 操作按钮 -->
			<view class="actionButtons" style="margin-bottom: 100upx;">
				<u-button @click="submit" type="primary">{{postButtenText}}</u-button>
				<view class="resetBtn" v-if="!isChangeData">
					<u-button @click="resetForm" type="error">重置</u-button>
				</view>
			</view>
			
			<u-modal
				v-model="modelShow" 
				@confirm="confirmResetForm" 
				@cancel="cancelResetForm" 
				ref="uModal" 
				content="确定要清空所有数据吗？此操作不可逆"
				:show-cancel-button="true"
				:show-title="false"
			></u-modal>
			<!-- Toast提示 -->
			<u-toast ref="uToast" />
		</view>
	</scroll-view>
</template>

<script>
	let app = getApp();
	export default {
		data() {
			return {
				dailyId: null,
				user: {}, // 用户信息
				showSelectClass: false, // 是否展示班级选择框
				showSelectCourse: false, // 是否展示课程选择框
				showSelectHeadTeacher: false, // 是否展示班主任选择框
				// 修改配置
				isChangeData: false,
				postButtenText: "提交",
				// 节次选择
				selectSections: [
					[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
					[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				],
				defaultSection: [0, 1],
				
				// 搜索框展示
				showSearchTruancy:false,//旷课
				showSearchLate: false,//迟到
				showSearchLeaveEarly: false,//早退
				showSearchLeave: false,//请假
				selectDateShow: false,// 展示日期选择框
				selectSectionShow: false,// 展示节次选择框
				// 日期选择参数
				selectDateParams: {
					year: true,
					month: true,
					day: true
				},
				
				nowYear: 0,
				// 表单对象(最后提交的数据)
				model: {
					teacherId: "",//教师编号
					teacherName: "",//教师姓名（自动选择）
					department: "", // 教师部门
					classRoomName: "",//教室
					postDate: "", // 时间（最后提交数据）
					postDateTemp: "",//时间缓存（仅作展示，不做最后提交）
					section: "",//节次
					trueAttendNum: '',//实到人数
					attendNum: '',//应到人数
					
					useMedia: "", //使用媒体设备
					unImageStudentList: [], //衣着问题
					projectorDamage: [], //投影仪问题
					computerDamage: [], //电脑问题
					otherWarnDamage: [], //其他问题
					
					otherThings: "",//其他反馈
					
					// 教师配置项开始
					// 选中提交值
					course: "",//教师配置项-课程
					courseNature: "正常", // 课程性质
					checkedClass: [],//本次课出席的班级
					checkedHeadTeacher: [],//本次课出席班级的班主任
					// 教师配置项结束
					
					checkedTruancyStudentList: [],//所选旷课学生列表
					checkedLateStudentList: [],//所选迟到学生列表
					checkedLeaveEarlyStudentList: [],//所选早退学生列表
					checkedLeaveStudentList: [],//所选请假学生列表
					
					truancyStudentNum: 0,//旷课学生人数
					lateStudentNum: 0,//迟到学生人数
					leaveEarlyStudentNum: 0,//早退学生人数
					leaveStudentNum: 0,//请假学生人数
				},				
				modelShow: false,//重置提示模态框
				
				// switch状态
				Status: {
					attend: false,//学生人数异常开关
					serious: false,//使用设备开关
					image: false,//衣着问题开关
					projector: false,//投影仪问题开关
					computer: false,//电脑问题开关
					// 各部分情况，默认正常(false)
					secondPart: false,//第二部分开关
					thirdPart: false,//第三部分开关
					fourthPart: false//第四部分开关
				},
				
				// 表格label配置
				labelPosition: 'left',
				labelWidth: 150,
				
				// 使用手机人数
				useMediaRadioList: [
					{
						name: '1-5人',
						checked: false,
						disabled: false
					},
					{
						name: '6-10人',
						checked: false,
						disabled: false
					},
					{
						name: '10人以上',
						checked: false,
						disabled: false
					}
				],
				// 衣着形象问题
				imageCheckBoxList: [
					{
						name: '衣着不整',
						checked: false,
						disabled: false
					},
					{
						name: '上课睡觉',
						checked: false,
						disabled: false
					},
					{
						name: '肆意谈笑喧哗',
						checked: false,
						disabled: false
					},
					{
						name: '在教室或走廊吸烟',
						checked: false,
						disabled: false
					},
					{
						name: '将食物带进教室',
						checked: false,
						disabled: false
					},
					{
						name: '上课不带教材',
						checked: false,
						disabled: false
					}
				],
				// 投影仪问题
				projectorCheckBoxList: [
					{
						name: '投影仪效果不好',
						checked: false,
						disabled: false
					},
					{
						name: '投影仪分辨率不高',
						checked: false,
						disabled: false
					},
					{
						name: '投影仪已坏，不能使用',
						checked: false,
						disabled: false
					}
				],
				// 电脑问题
				computerCheckBoxList: [
					{
						name: '电脑系统老旧，反应慢',
						checked: false,
						disabled: false
					},
					{
						name: '电脑病毒多',
						checked: false,
						disabled: false
					},
					{
						name: '电脑损坏，不能使用',
						checked: false,
						disabled: false
					}
				],
				// 其他问题
				otherCheckBoxList: [
					{
						name: '桌椅存在损坏',
						checked: false,
						disabled: false
					},
					{
						name: '门窗存在损坏',
						checked: false,
						disabled: false
					},
					{
						name: '未准时开门',
						checked: false,
						disabled: false
					},
					{
						name: '教室卫生较差',
						checked: false,
						disabled: false
					}
				],
				
				studentList: [], // 学生列表
				// 下拉选择框显示状态
				selectTruancyStudent: false,
				selectLateStudent: false,
				selectleaveEarlyStudent: false,
				selectLeaveStudent: false,
				// 教师自定义配置开始
				// 班级列表
				classList: [],
				// 课程列表
				courseList: [],
				// 班主任列表
				headMasterList: [],
				checkboxClassList: [],
				checkboxHeadMasterList: [],
				// 教师自定义配置结束
				
				truancyStudenList: [],//旷课学生列表
				lateStudenList: [],//迟到学生列表
				leaveEarlyStudenList: [],//早退学生列表
				leaveStudenList: [],//请假学生列表
				
				// 修改
				changeSelectTruancyStudent: false,
				changeSelectLateStudent: false,
				changeSelectLeaveEarlyStudent:false,
				changeSelectLeaveStudent:false,
				changeCache: {
					name: "",
					cache: "",
				},
				// 手动输入
				inputTruancyStudent: false,
				inputLateStudent: false,
				inputLeaveEarlyStudent: false,
				inputLeaveStudent: false,
				inputStudents: "",//储存输入框信息
				
				// 部分操作公共参数
				truancyStudentParams: {
					'checkList': 'truancyStudenList',
					'checkedList': 'checkedTruancyStudentList',
					'num': 'truancyStudentNum',
					'stuList': 'studentList',
					'selectStatus': 'selectTruancyStudent',
					'change': 'changeSelectTruancyStudent',
				},
				lateStudentParams: {
					'checkList': 'lateStudenList',
					'checkedList': 'checkedLateStudentList',
					'num': 'lateStudentNum',
					'stuList': 'studentList',
					'selectStatus': 'selectLateStudent',
					'change': 'changeSelectLateStudent'
				},
				leaveEarlyStudentParams: {
					'checkList': 'leaveEarlyStudenList',
					'checkedList': 'checkedLeaveEarlyStudentList',
					'num': 'leaveEarlyStudentNum',
					'stuList': 'studentList',
					'selectStatus': 'selectleaveEarlyStudent',
					'change': 'changeSelectLeaveEarlyStudent'
				},
				leaveStudentParams: {
					'checkList': 'leaveStudenList',
					'checkedList': 'checkedLeaveStudentList',
					'num': 'leaveStudentNum',
					'stuList': 'studentList',
					'selectStatus': 'selectLeaveStudent',
					'change': 'changeSelectLeaveStudent'
				},
				
				// 验证规则
				rules: {
					classRoomName: [
						{
							required: true,
							message: '请输入教室',
							trigger: ['change', 'blur'],
						}
					],
					attendNum: [
						{
							trigger: 'blur',
							message: "请输入应到人数",
							validator: (rule, value, callback) => {
								return value > 0 ? true : false;
							},
						}, {
							trigger: ['change', 'blur'],
							message: "应到人数必须大于0",
							validator: (rule, value, callback) => {
								if(Number(value) > 0){
									this.model.attendNum = Number(value);
									return true;
								}
								this.model.attendNum = 0
								return false;
							},
						}
					],
					trueAttendNum: [
						{
							trigger: 'blur',
							message: "请输入实到人数",
							validator: (rule, value, callback) => {
								return value > 0 ? true : false;
							},
						}, {
							trigger: ['change', 'blur'],
							message: "实到人数必须大于0",
							validator: (rule, value, callback) => {
								if(Number(value) > 0){
									this.model.trueAttendNum = Number(value);
									return true;
								}
								this.model.trueAttendNum = 0
								return false;
								
							},
						}, {
							trigger: ['change', 'blur'],
							message: "实到人数必须小于等于应到人数",
							validator: (rule, value, callback) => {
								if(Number(value) > Number(this.model.attendNum)){
									this.model.trueAttendNum = Number(this.model.attendNum);
									return false;
								}
								return true;
							},
						}
					],
					section: [
						{
							trigger: ['change', 'blur'],
							message: "请选择上课节次",
							validator: (rule, value, callback) => {
								return value ? true : false;
							},
						}
					],
					course: [
						{
							trigger: ['change', 'blur'],
							message: "请选择课程",
							validator: (rule, value, callback) => {
								return value ? true : false;
							},
						}
					],
					checkedHeadTeacher: [
						{
							trigger: ['change', 'blur'],
							message: "请选择班主任",
							validator: (rule, value, callback) => {
								return value.length > 0 ? true : false;
							},
						}
					],
					checkedClass: [
						{
							trigger: ['change', 'blur'],
							message: "请选择班级",
							validator: (rule, value, callback) => {
								return value.length > 0 ? true : false;
							},
						}
					]
				}
			}
		},
		
		onShow() {
			if(!this.checkLogin()){
				uni.showModal({
				    title: '提示',
				    content: '还未登录。无法填写，是否前往登录',
				    success: function (res) {
				        if (res.confirm) {
				            uni.navigateTo({
				            	url: "/pages/login/login",
				            })
				        } else if (res.cancel) {
				            uni.navigateBack();
				        }
				    }
				});
				return false; // 阻止继续加载
			}
			uni.showLoading({
				mask: true,
				title: "加载中"
			})
			
			if(this.dailyId){
				uni.setNavigationBarTitle({
					title: "日报修改"
				})
				this.postButtenText = "提交修改"
				this.isChangeData = true;
				this.initPage(this.dailyId);
			}
			// 初始化数据
			let date = new Date()
			let year = date.getFullYear()
			let month = date.getMonth() + 1;
			month = month.length != 2 ? `0${month}` : month;
			let day = date.getDate().length != 2 ? `0${date.getDate()}` : date.getDate();
			this.nowYear = year;
			this.model.postDateTemp = `${year}-${month}-${day}`;
			this.model.postDate = date.getTime(); // 取当前时间戳
			this.model.teacherName = this.user.nick_name;
			this.model.teacherId = this.user.id;
			
			// 获取教师配置
			this.$u.api.getTeacherConf({
				teacherId: this.user.id
			}).then(res => {
				if(res.code == 1){
					let data = res.data;
					if(data.length == 0) {
						uni.showModal({
						    title: '提示',
						    content: '您还未进行学年配置！是否前往配置？',
						    success: function (res) {
						        if (res.confirm) {
						            uni.reLaunch({
						            	url: "/pages/setting/setting",
						            })
						        } else if (res.cancel) {
						            uni.navigateBack();
						        }
						    }
						});
					}
					if(data.department == "") {
						uni.showModal({
						    title: '提示',
						    content: '您还未配置部门！是否前往配置？',
						    success: function (res) {
						        if (res.confirm) {
						            uni.reLaunch({
						            	url: "/pages/setting/setting",
						            })
						        } else if (res.cancel) {
						            uni.navigateBack();
						        }
						    }
						});
					}
					// 从配置中获取班级列表并渲染
					data.class_name.forEach(item => {
						this.classList.push({
							label: item.text,
							value: item.key
						});
					});
					// 从配置中获取课程列表并渲染
					data.course_name.split(",").forEach(item => {
						this.courseList.push({
							label: item,
							value: item
						});
					});
					// 从配置中获取班主任列表并渲染
					data.head_teacher.split(",").forEach(item => {
						this.headMasterList.push({
							label: item,
							value: item
						});
					});
					this.model.department = data.department;
				}
			})
			
			// 获取教师配置班级列表中的学生
			this.$u.api.getClassStudent({
				id: this.user.id
			}).then(res => {
				if(res.code == 1){
					this.studentList = res.data;
				}else{
					this.$refs.uToast.show({
						title: '您还未配置班级，但您可以选择搜索',
						type: 'warning'
					})
				}
			})
			uni.hideLoading();
		},
		
		onLoad(e) {
			// 编辑日报
			if(e.dailyId){
				this.dailyId = e.dailyId;
			}
		},
		
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		
		// 计算属性
		computed: {
			// 校验输入的人数
			checkNum() {
				return this.model.trueAttendNum < this.model.attendNum ? true : false; 
			},
			
			// 校验人数
			checkNumOverFlow() {
				let sum = this.model.truancyStudentNum + this.model.lateStudentNum + this.model.leaveEarlyStudentNum + this.model.leaveStudentNum;
				return (this.model.attendNum - this.model.trueAttendNum - sum) > 0 ? true : false;
			}
		},
		
		// 方法
		methods: {			
			// 学生搜索按钮事件
			searchStudent(e) {
				switch(e.target.dataset.name){
					case "Truancy":
						// 旷课
						this.showSearchTruancy = true;
					break;
					case "Late":
						// 迟到
						this.showSearchLate = true;
					break;
					case "LeaveEarly":
						// 早退
						this.showSearchLeaveEarly = true;
					break;
					case "Leave":
						// 请假
						this.showSearchLeave = true;
					break;
				}
			},
			
			// 执行修改时初始化页面数据
			async initPage(dailyId) {
				let res = await this.$u.api.getDailyInfo({id: dailyId});
				if(res.code != 1){
					this.$refs.uToast.show({
						title: '选择错误',
						type: 'warning',
					});
					return false;
				}
				let initData = res.data;
				// 初始化赋值
				this.model.attendNum = initData.attend_num;//应到人数
				this.model.classRoomName = initData.class_room;//教室名
				this.model.postDateTemp = this.$u.timeFormat(Number(initData.post_date), 'yyyy-mm-dd');//时间缓存
				this.model.postDate = Number(initData.post_date); // 时间
				this.model.section = initData.section;//节次
				this.model.trueAttendNum = initData.true_attend_num;//实到人数
				
				this.model.submit_time = Number(initData.submit_time); // 提交时间
				
				//判断内容并初始化相关开关
				initData.use_media ? (this.model.useMedia = initData.use_media) && (this.Status.serious = true) && (this.Status.secondPart = true) : false; //使用媒体设备
				initData.un_image_student ? (this.model.unImageStudentList = initData.un_image_student.split(',')) && (this.Status.image = true) && (this.Status.secondPart = true) : false;//衣着问题
				initData.projector_damage ? (this.model.projectorDamage = initData.projector_damage.split(',')) && (this.Status.thirdPart = true) && (this.Status.projector = true) : false; //投影仪问题
				initData.computer_damage ? (this.model.computerDamage = initData.computer_damage.split(',')) && (this.Status.computer = true) && (this.Status.thirdPart = true): false; //电脑问题
				initData.other_warn_damage ? (this.model.otherWarnDamage = initData.other_warn_damage.split(',')) && (this.Status.thirdPart = true): false; //其他问题
				initData.other_things ? (this.model.otherThings = initData.other_things) && (this.Status.fourthPart = true) : false;//其他反馈
				
				this.model.course = initData.course;//教师配置项-课程
				this.model.checkedClass = initData.class.split(',');//本次课出席的班级
				this.model.checkedHeadTeacher = initData.head_teacher.split(',');//本次课出席班级的班主任
				
				this.model.checkedTruancyStudentList = initData.truancy_student ? initData.truancy_student.split(',') : [];//所选旷课学生列表
				this.model.checkedLateStudentList = initData.late_student ? initData.late_student.split(',') : [];//所选迟到学生列表
				this.model.checkedLeaveEarlyStudentList = initData.leave_early_student ? initData.leave_early_student.split(',') : [];//所选早退学生列表
				this.model.checkedLeaveStudentList = initData.leave_student ? initData.leave_student.split(',') : [];//所选请假学生列表
				
				this.model.truancyStudentNum = initData.truancy_student_num;//旷课学生人数
				this.model.lateStudentNum = initData.late_student_num;//迟到学生人数
				this.model.leaveEarlyStudentNum = initData.leave_early_student_num;//早退学生人数
				this.model.leaveStudentNum = initData.leave_student_num;//请假学生人数
				
				// 初始化衣着问题
				this.imageCheckBoxList.forEach(e => {
					if(this.model.unImageStudentList.indexOf(e.name) > -1){
						e.checked = true;
					}
				})
				// 初始化投影仪问题
				this.projectorCheckBoxList.forEach(e => {
					if(this.model.projectorDamage.indexOf(e.name) > -1){
						e.checked = true;
					}
				})
				// 初始化电脑问题
				this.computerCheckBoxList.forEach(e => {
					if(this.model.computerDamage.indexOf(e.name) > -1){
						e.checked = true;
					}
				})
				// 初始化其他问题
				this.otherCheckBoxList.forEach(e => {
					if(this.model.otherWarnDamage.indexOf(e.name) > -1){
						e.checked = true;
					}
				})
				// 初始化已选择班主任名单
				this.model.checkedHeadTeacher.forEach(e => {
					this.checkboxHeadMasterList.push({
						name: e,
						checked: true,
						disabled: false
					})
				})
				// 初始化已选择班级名单
				this.model.checkedClass.forEach(e => {
					this.checkboxClassList.push({
						name: e,
						checked: true,
						disabled: false
					})
				})
				// 初始化旷课学生
				this.model.checkedTruancyStudentList.forEach(e => {
					this.truancyStudenList.push({
						name: e,
						checked: true,
						disabled: false
					})
				})
				// 初始化迟到学生
				this.model.checkedLateStudentList.forEach(e => {
					this.lateStudenList.push({
						name: e,
						checked: true,
						disabled: false
					})
				})
				// 初始化早退学生
				this.model.checkedLeaveEarlyStudentList.forEach(e => {
					this.leaveEarlyStudenList.push({
						name: e,
						checked: true,
						disabled: false
					})
				})
				// 初始化请假学生
				this.model.checkedLeaveStudentList.forEach(e => {
					this.leaveStudenList.push({
						name: e,
						checked: true,
						disabled: false
					})
				})
			},
			
			// 选择班级
			selectClass(e) {
				let classInfo = e[0];
				if(!this.model.checkedClass.includes(classInfo.label)) {
					// 插入多选框列表
					this.checkboxClassList.push({
						name: classInfo.label,
						checked: true,
						disabled: false,
						key: classInfo.key
					});
					this.model.checkedClass.push(classInfo.label);
				}else{
					this.$refs.uToast.show({
						title: `已经选过${classInfo.label}`,
						type: 'error',
					})
				}
			},
			// 选择课程
			selectCourse(e) {
				this.model.course = e[0].label;
			},
			// 选择班主任
			selectHeadMaster(e) {
				let headTeacher = e[0];
				if(!this.model.checkedHeadTeacher.includes(headTeacher.label)) {
					this.checkboxHeadMasterList.push({
						name: headTeacher.label,
						checked: true,
						disabled: false,
					});		
					this.model.checkedHeadTeacher.push(headTeacher.label);
				}else{
					this.$refs.uToast.show({
						title: `已选择${headTeacher.label}`,
						type: 'error'
					});
				}
			},
			
			// 更改班级选中值
			checkboxClassListChange(e) {
				this.checkboxClassList.forEach((item , index, arr) => {
					if(item.name == e.name){
						arr.splice(index, 1);
						this.model.checkedClass.forEach((el, i, arrs)=>{
							if(el == e.name){
								arrs.splice(i, 1);
								this.$refs.uToast.show({
									title: "删除了" + e.name,
									type: 'warning',
								})
							}
						})
					}
				})
			},

			// 更改班主任选中值
			checkboxHeadMasterListChange(e) {
				this.checkboxHeadMasterList.forEach((item, index, arr) => {
					if(item.name == e.name){
						arr.splice(index, 1);
						this.model.checkedHeadTeacher.forEach((el, i, arrs) => {
							if(el == e.name){
								arrs.splice(i, 1);
								this.$refs.uToast.show({
									title: "删除了" + e.name,
									type: 'warning',
								})
							}
						})
					}
				})
			},
			// 老师自定义配置结束
			
			// 搜索学生
			async searchStudentList(value) {
				let that = this.$root;
				let res = await this.$u.api.searchStudent({
					name: value,
					class: that.classList
				});
				if(res.code == 0){
					that.$refs.uToast.show({
						title: '您所教班级中未找到该学生，请尝试手动添加',
						type: 'error',
					})
					return Promise.resolve([]);
				}
				let arr = res.data.map(e => {
					return e.class_name + e.name
				})
				return Promise.resolve(arr);
			},
			
			// 选择搜索的结果
			selectSearchStudent(data, paramObj) {
				if(!this.checkNumOverFlow) {
					this.$refs.uToast.show({
						title: '人数已满！',
						type: 'error',
					})
					return false;
				}
				// key参数为第一个数组名
				this[paramObj.checkList].push({
					name: data,
					checked: true,
					disabled: false,
				})
				this[paramObj.checkList] = this.$unique(this[paramObj.checkList], "name");
				// 设置表单对应学生名单
				this.model[paramObj.checkedList].push(data);
				this.model[paramObj.checkedList] = Array.from(new Set(this.model[paramObj.checkedList]));
				// 设置对应人数
				this.model[paramObj.num] = this.model[paramObj.checkedList].length;
				
			},
			
			// 重置表格模态框
			resetForm() {
				this.modelShow = true;
			},
			
			// 确定重置
			confirmResetForm() {
				// 由于数据复杂，重置的话也能做到，但代码量复杂，最简单的办法让页面跳转回来
				uni.reLaunch({
					url:"../index/index",
					success() {
						uni.navigateTo({
							url:"../submit/submit"
						})
					}
				})
			},
			
			// 取消重置按钮
			cancelResetForm() {
				
			},
			
			// 打开日期选择框
			openselectDate() {
				this.selectDateShow = true;
			},
			
			// 打开节次选择
			openSelectSection() {
				this.selectSectionShow = true;
			},
			
			// 确定选择节次
			confirmSelectSection(e) {
				if(e[0] > e[1]){
					this.$refs.uToast.show({
						title: '选择错误，请重新选择',
						type: 'warning',
					})
				}else if(e[0] == this.selectSections[0].length - 1){
					return this.model.section = `${e[0] + 1}-${e[0] + 1}`
				}else{
					return this.model.section = this.selectSections[0][e[0]] + "-" + this.selectSections[1][e[1]]
				}
			},
			
			sectionColumnChange(e) {
				
			},
			
			// 确认选择数据回调事件
			confirmSelectDate(e) {
				this.model.postDateTemp = `${e.year}-${e.month}-${e.day}`;
				let date = new Date(e.year, e.month-1, e.day);
				this.model.postDate = date.getTime();
			},
			
			// 点击选择框事件(下拉选择学生)
			openSelectStudent(e) {
				if(this[e.stuList].length > 0){
					return this[e.selectStatus] = true;
				}else{
					return this.$refs.uToast.show({
						title: '没有更多学生可以选择了',
						type: 'warning',
					})
				}
			},
			
			// 确定选择学生
			selectStudenConfirm(e, params) {
				if(!this.checkNumOverFlow) {
					this.$refs.uToast.show({
						title: '人数已满！',
						type: 'error',
					})
					return false;
				}
				// let className = e[0].label; // 班级名
				// let stuName = e[1].label; // 姓名
				let res = e[0].label + e[1].label; // 班级姓名
				// 之前选中了，就不做操作
				if(this.model[params.checkedList].includes(res)) {
					return false;
				}
				// 没选中先插入多选框列表
				this[params.checkList].push({
					name: res,
					checked: true,
					disabled: false,
				})
				this.model[params.checkedList].push(res);// 设置表单选择迟到人数
				this.model[params.num] += 1 // 人数自增
			},
			
			// 提交表单
			submit(e) {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
							mask: true,
							title: "提交中"
						})
						if(this.dailyId){
							// 更新数据
							this.model['id'] = this.dailyId;
							this.model['update_time'] = (new Date()).getTime();
							this.$u.api.editDaily(this.model).then(res => {
								uni.hideLoading()
								if(res.code == 1){
									this.$refs.uToast.show({
										title: '提交成功，即将刷新页面',
										type: 'success',
									})
									setTimeout(() => {
										this.confirmResetForm();
									}, 1500);
								}else{
									this.$refs.uToast.show({
										title: '提交失败',
										type: 'error',
									})
								}
							});
						}else{
							// 新增数据
							this.model['submit_time'] = (new Date()).getTime();
							this.$u.api.submitDaily(this.model).then(res => {
								uni.hideLoading()
								if(res.code == 1){
									this.$refs.uToast.show({
										title: '提交成功，即将刷新页面',
										type: 'success',
									})
									setTimeout(() => {
										this.confirmResetForm();
									}, 1500);
								}else{
									this.$refs.uToast.show({
										title: '提交失败',
										type: 'error',
									})
								}
							})
						}
					}
				});
			},
			
			// checkBox复选框列表改变事件
			checkboxGroupChange(e, k) {
				this.model[k] = e;
			},
			// 单选框选中
			radioMediaGroupChange(e) {
				this.model.useMedia = e;
			},
			
			// 取消勾选
			checkboxChange(e, param) {
				// 取消勾选 value一定为false
				if(e.value) {
					return false
				}
				let info = e.name;
				// 更新数组选中
				this[param.checkList].forEach((item, index, arr) => {
					if(item.name == info) {
						arr.splice(index, 1);
					}
				})
				// 更新提交的表单数据
				this.model[param.checkedList].forEach((item, index, arr) => {
					if(item == info){
						arr.splice(index, 1);
					}
				})
				this.model[param.num] -= 1; // 人数自减
			},
			
			// 长按多选框
			checkboxLongPress(name, param) {
				if(name){
					this[param.change] = !this[param.change];
					this.changeCache.name = name;
					this.changeCache.cache = name;
				}
			},
			
			// 修改学生信息
			changeStudentInfo(param) {
				if(!this.changeCache.name){
					this.$refs.uToast.show({
						title: '数据不得为空',
						type: 'error',
					})
					return false;
				}
				this[param.checkList].forEach((item, index, arr) => {
					if(this.changeCache.cache == item.name){
						arr[index].name = this.changeCache.name;//对展示的数据重新赋值
					}
				})
				this.model[param.checkedList].forEach((el, index, arr) => {
					if(this.changeCache.cache == el){
						arr[index] = this.changeCache.name;
					}
				})
				this.changeCache.cache = this.changeCache.name;
				this[param.change] = !this[param.change];
			},
			
			// 输入学生
			inputStudent(e) {
				switch(e.target.dataset.name){
					case "Truancy":
						// 旷课
						this.inputTruancyStudent = true;
						break;
					case "Late":
						// 迟到
						this.inputLateStudent = true;
						break;
					case "LeaveEarly":
						// 早退
						this.inputLeaveEarlyStudent = true;
						break;
					case "Leave":
						// 请假
						this.inputLeaveStudent = true;
						break;
				}
			},
			
			// 添加学生
			addStudent(e, param) {
				if(!this.checkNumOverFlow) {
					this.$refs.uToast.show({
						title: '人数已满！',
						type: 'error',
					})
					return false;
				}
				if(!this.inputStudents){
					this.$refs.uToast.show({
						title: '空数据无法添加',
						type: 'error',
					})
					return false;
				}
				let inserArr = this.inputStudents.split(/\、|\,|\ |，/);
				inserArr.forEach(e => {
					// 插入model选中列表中不存在的值
					if(!this.model[param.checkedList].includes(e)) {
						this[param.checkList].push({
							name: e,
							checked: true,
							disable: false,
						})
						this.model[param.checkedList].push(e);
						this.model[param.num] += 1;
					}
				})
				this.inputStudents = "";
				if(this.inputTruancyStudent) this.inputTruancyStudent = !this.inputTruancyStudent;
				if(this.inputLateStudent) this.inputLateStudent = !this.inputLateStudent;
				if(this.inputLeaveEarlyStudent) this.inputLeaveEarlyStudent = !this.inputLeaveEarlyStudent;
				if(this.inputLeaveStudent) this.inputLeaveStudent = !this.inputLeaveStudent;
				this.$refs.uToast.show({
					title: '添加成功，可继续添加',
					type: 'success',
				})
			},
			
			// 检查登录
			checkLogin(){
				let isLogin = uni.getStorageSync('isLogin');
				if(!isLogin) {
					// uni.showModal({
					//     title: '提示',
					//     content: '还未登录。无法填写，是否前往登录',
					//     success: function (res) {
					//         if (res.confirm) {
					//             uni.redirectTo({
					//             	url: "/pages/login/login",
					//             })
					//         } else if (res.cancel) {
					//             uni.navigateBack();
					//         }
					//     }
					// });
					return false;
				}else{
					let user = uni.getStorageSync('user');
					this.user = user;
					return true;
				}
			},
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx 15rpx;
	}
	.actionButtons u-button {
		margin: 30upx 40upx;
	}
	.resetBtn u-button {
		margin: 0;
		margin-bottom: 40upx;
	}
	.scroll-search {
		position: relative;
		top: 50rpx;
		height: 100%;
	}
	.scroll-search .popup-search{
		text-align: center;
		margin: 50rpx 40rpx;
	}
	.changeSelectStudentInfo {
		text-align: center;
		position: relative;
		padding: 0 35rpx;
		top: 100rpx;
	}
	.changeSelectStudentInfo u-button {
		position: relative;
		top: 50rpx;
	}
	.studenActionBtns u-button{
		display: block;
	}
</style>
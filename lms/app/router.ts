// tslint:disable: linebreak-style
import { Application } from 'egg';
// import 'egg-socket.io';

export default (app: Application) => {
  const { controller, router, io } = app;

  router.get('/', controller.home.index);
  router.get('/api/users', controller.user.index);
  router.post('/api/user/create', controller.user.create);
  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/update', controller.user.update);
  router.post('/api/user/delete', controller.user.delete);
  router.get('/api/user/find', controller.user.find);
  router.post('/api/user/uploadstudent', controller.user.uploadStudent);
  router.get('/api/roles', controller.role.index);

  router.post('/api/user/changePassword', controller.user.changePassword);

  router.post('/api/user/getClass2Option', controller.user.getClass2Option);

  router.get('/api/courses', controller.course.index);
  router.post('/api/lessonmaterial/upload', controller.course.uploadLessonMaterial);
  router.post('/api/lessonmaterial/uploadHomework', controller.course.uploadHomework);

  // socket.io
  io.of('/').route('callServerMethod', io.controller.user.ping);
  io.of('/').route('getusers', io.controller.user.index);
  io.of('/').route('updateStateUser', io.controller.user.updateState); // 修改用户状态，是否激活
  io.of('/').route('updateUser', io.controller.user.updateUserInfo); // 编辑修改用户信息
  io.of('/').route('addUser', io.controller.user.create);
  io.of('/').route('deleteUser', io.controller.user.delete);
  io.of('/').route('refreshToken', io.controller.user.refreshToken);
  io.of('/').route('checkPwd', io.controller.user.checkPwd);
  io.of('/').route('deleteManyUsers', io.controller.user.deleteManyUsers);
  io.of('/').route('getAddStudentList', io.controller.user.getAddStudentList);
  io.of('/').route('getMyUserInfo', io.controller.user.getMyUserInfo); // 获取我的用户信息
  io.of('/').route('testClient', io.controller.user.testClient);

  io.of('/').route('student1OptionList', io.controller.user.student1OptionList);

  io.of('/').route('getroles', io.controller.user.roleIndex); // 角色列表

  io.of('/').route('getCourses', io.controller.course.coursesIndex); // 课程列表
  io.of('/').route('addCourse', io.controller.course.addCourse); // 添加课程
  io.of('/').route('deleteCourse', io.controller.course.deleteCourse); // 删除课程
  io.of('/').route('updateCourse', io.controller.course.updateCourse);

  io.of('/').route('deleteClass', io.controller.course.deleteClass); // 删除班级

  io.of('/').route('getCourseDetail', io.controller.course.courseDetailIndex); // 某一课程的详情列表
  io.of('/').route('addCoursesClass', io.controller.course.addCoursesClass);  // 添加某一课程的班级信息
  io.of('/').route('updateCourseDetail', io.controller.course.updateCourseDetail); // 更新课程详情列表信息
  io.of('/').route('deleteCourseDetail', io.controller.course.deleteCourseDetail); // 删除课程详情列表

  io.of('/').route('getStudentList', io.controller.course.getStudentList);  // 班级学生列表
  io.of('/').route('getClass', io.controller.course.classIndex);  // 班级列表
  io.of('/').route('singup', io.controller.course.singup);  // 报名
  io.of('/').route('signupList', io.controller.course.signupList);  // 报名审核列表
  io.of('/').route('updateSignupState', io.controller.course.updateSignupState);  // 更新报名审核状态
  io.of('/').route('signUpClassIndex', io.controller.course.signUpClassIndex);

  io.of('/').route('teacherOptionList', io.controller.user.teacherOptionList); // 教师列表
  io.of('/').route('courseAdminOptionList', io.controller.user.courseAdminOptionList); // 课程管理员列表
  io.of('/').route('classAdminOptionList', io.controller.user.classAdminOptionList); // 班级管理员列表
  io.of('/').route('labAdminOptionList', io.controller.user.labAdminOptionList); // 实验室管理员列表
  io.of('/').route('studentOptionList', io.controller.user.studentOptionList); // 班级列表
  io.of('/').route('courseOptionList', io.controller.course.courseOptionList); // 课程列表
  io.of('/').route('classOptionList', io.controller.course.classOptionList); // 班级列表
  io.of('/').route('classAdjustOptionList', io.controller.course.classAdjustOptionList); // 班级列表

  io.of('/').route('lessonOptionList', io.controller.course.lessonOptionList);  // 课次列表

  io.of('/').route('class2OptionList', io.controller.course.class2OptionList); // 学籍班级列表
  io.of('/').route('getClass2', io.controller.course.class2Index);  // 学籍班级列表
  io.of('/').route('addClass2', io.controller.course.addClass2);  // 添加学籍班级信息
  io.of('/').route('updateClass2', io.controller.course.updateClass2); // 更新学籍班信息
  io.of('/').route('deleteClass2', io.controller.course.deleteClass2); // 删除学籍班信息
  io.of('/').route('getLClass2StudentList', io.controller.course.getLClass2StudentList); // 学籍班学生信息
  io.of('/').route('deleteClassStudent', io.controller.course.deleteClassStudent); // 学籍班学生信息
  io.of('/').route('deleteClass2Student', io.controller.course.deleteClass2Student); // 学籍班学生信息

  io.of('/').route('getLessonList', io.controller.course.LessonIndex);  // 课次列表
  // io.of('/').route('addLesson', io.controller.course.addLesson);  // 添加课次
  io.of('/').route(
    'deleteLesson', io.controller.course.deleteLesson);  // 删除课次
  // io.of('/').route('addLesson', io.controller.course.addLesson);  // 添加课次
  io.of('/').route('deleteLesson', io.controller.course.deleteLesson);  // 删除课次
  io.of('/').route('updateLesson', io.controller.course.updateLesson);  // 更新课次

  io.of('/').route('addLessonMaterial', io.controller.course.addLessonMaterial);  // 上传教案
  io.of('/').route('getLessonMaterialList', io.controller.course.getLessonMaterialList);  // 获取全部教案列表
  io.of('/').route('deleteLessonMaterial', io.controller.course.deleteLessonMaterial);  // 获取全部教案列表

  io.of('/').route('gethomeworklList', io.controller.course.gethomeworklList);  // 获取学生自己的作业列表
  io.of('/').route('getAllHomeworkList', io.controller.course.getAllHomeworkList);  // 获取课次的全部学生作业列表
  io.of('/').route('updateHomeworkScore', io.controller.course.updateHomeworkScore);  // 获取课次的全部学生作业列表
  io.of('/').route('deleteHomework', io.controller.course.deleteHomework);  // 删除作业

  io.of('/').route('lessonDetail', io.controller.course.lessonDetail);  // 获取课次详情如：教案
  io.of('/').route('getMyLessonPlan', io.controller.course.getMyLessonPlan);  // 获取我的教案列表
  io.of('/').route('getMyChooseClass', io.controller.course.getMyChooseClass);  // 获取我的选课班级列表
  io.of('/').route('getMyTeachClass', io.controller.course.getMyTeachClass);  // 获取我的任课班级列表
  io.of('/').route('getMyClass', io.controller.course.getMyClass);  // 获取我的管理班级列表
  io.of('/').route('getMyCourse', io.controller.course.getMyCourse);  // 获取我的管理课程列表
  io.of('/').route('getAllLessonPlan', io.controller.course.getAllLessonPlan);
  io.of('/').route('deleteMyChooseClass', io.controller.course.deleteMyChooseClass); // 取消报名

  io.of('/').route('getAllLab', io.controller.lab.labIndex);
  io.of('/').route('addLab', io.controller.lab.addLab);
  io.of('/').route('updateLab', io.controller.lab.updateLab);
  io.of('/').route('deleteLab', io.controller.lab.deleteLab);
  io.of('/').route('getMylab', io.controller.lab.getMylab);
  io.of('/').route('labOptionList', io.controller.lab.labOptionList);

  io.of('/').route('addSchedule', io.controller.course.addSchedule); // 添加排课信息
  io.of('/').route('getScheduleList', io.controller.course.getScheduleList); // 获取排课列表
  io.of('/').route('deleteSchedule', io.controller.course.deleteSchedule); // 删除排课信息

  io.of('/').route('addClassStudent', io.controller.user.addClassStudent);
  io.of('/').route('getMyStudyClass', io.controller.course.getMyStudyClass);
  io.of('/').route('getMyStatusClass', io.controller.course.getMyStatusClass);

  io.of('/').route('classDetail', io.controller.course.classDetail); // 获取班级详情
  io.of('/').route('serverState', io.controller.course.serverState);
  io.of('/').route('deleteServerState', io.controller.course.deleteServerState);

};

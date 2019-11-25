// This file is created by egg-ts-helper@1.24.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCourse from '../../../app/controller/course';
import ExportHome from '../../../app/controller/home';
import ExportRole from '../../../app/controller/role';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    course: ExportCourse;
    home: ExportHome;
    role: ExportRole;
    user: ExportUser;
  }
}

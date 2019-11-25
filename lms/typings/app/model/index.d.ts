// This file is created by egg-ts-helper@1.24.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBooks from '../../../app/model/books';
import ExportClass from '../../../app/model/class';
import ExportClass2 from '../../../app/model/class2';
import ExportClassRegistration from '../../../app/model/classRegistration';
import ExportCourse from '../../../app/model/course';
import ExportHomework from '../../../app/model/homework';
import ExportLab from '../../../app/model/lab';
import ExportLabReservation from '../../../app/model/labReservation';
import ExportLesson from '../../../app/model/lesson';
import ExportRole from '../../../app/model/role';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Books: ReturnType<typeof ExportBooks>;
    Class: ReturnType<typeof ExportClass>;
    Class2: ReturnType<typeof ExportClass2>;
    ClassRegistration: ReturnType<typeof ExportClassRegistration>;
    Course: ReturnType<typeof ExportCourse>;
    Homework: ReturnType<typeof ExportHomework>;
    Lab: ReturnType<typeof ExportLab>;
    LabReservation: ReturnType<typeof ExportLabReservation>;
    Lesson: ReturnType<typeof ExportLesson>;
    Role: ReturnType<typeof ExportRole>;
    User: ReturnType<typeof ExportUser>;
  }
}

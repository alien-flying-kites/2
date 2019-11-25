// This file is created by egg-ts-helper@1.24.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportToken from '../../../app/service/Token';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    token: ExportToken;
  }
}

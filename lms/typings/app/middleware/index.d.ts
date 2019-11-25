// This file is created by egg-ts-helper@1.24.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCheckJwt from '../../../app/middleware/checkJwt';

declare module 'egg' {
  interface IMiddleware {
    checkJwt: typeof ExportCheckJwt;
  }
}

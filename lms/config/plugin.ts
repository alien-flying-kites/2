// tslint:disable: linebreak-style
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  mongoose : {
    enable: true,
    package: 'egg-mongoose',
  },
  jwt : {
    enable: true,
    package: 'egg-jwt',
  },
  cors : {
    enable: true,
    package: 'egg-cors',
  },
  io : {
    enable: true,
    package: 'egg-socket.io',
  },
};

export default plugin;

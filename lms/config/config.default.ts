// tslint:disable: linebreak-style
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551275835244_8277';

  // add your egg config in here
  config.middleware = [
    'checkJwt',
  ];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: false,
    },
    domainWhiteList: [ 'http://localhost:8080' ],
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.multipart = {
    whitelist: [
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.pdf',
      '.txt',
      '.rar',
      '.log',
      '.jpg', '.jpeg', // image/jpeg
      '.png', // image/png, image/x-png
      '.gif', // image/gif
      '.bmp', // image/bmp
      '.zip', '.rar',
      '.gz', '.tgz', '.gzip', '.bz2', '.7z',
    ],
    fileSize: '30mb',
  };
  config.io = {
    init: {},
    namespace: {
        '/': {
            connectionMiddleware: [ 'connection' ] as any,
            packetMiddleware: [ 'packet' ] as any,
        },
    },
  };
  config.mongoose = {
    client: {
        url: 'mongodb://admin:abc123!@localhost/lms',
        options: {
        },
    },
  };

  config.jwtConfig = {
    privateKeyPath: '/config/jwt/private.key',
    publicKeyPath: '/config/jwt/public.key',
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};

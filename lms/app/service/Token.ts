// tslint:disable: linebreak-style
import { Service } from 'egg';
import { readFileSync } from 'fs';
import JwtPayload from '../core/jwtPayload';

/**
 * Token Service, refer to https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
 * https://www.keylength.com/en/compare/
 * https://jwt.io/
 */
export default class Token extends Service {
  /**
   * sayHi to you
   * @param name - your name
   */
  public generateToken(payLoad: JwtPayload) {
    const privateKeyString = readFileSync(this.app.baseDir + this.app.config.jwtConfig.privateKeyPath).toString();
    const token = this.app.jwt.sign(payLoad, privateKeyString,
       { algorithm: 'RS256',
         issuer: 'lms.token.service',
         expiresIn: '2h',
         notBefore: '0m',
         audience: 'lmsUser',
       });
    return token;
  }

  public verifyToken(token: string) {
    const publicKeyString = readFileSync(this.app.baseDir + this.app.config.jwtConfig.publicKeyPath).toString();
    return this.app.jwt.verify(token, publicKeyString,
      { algorithms: [ 'RS256' ],
        issuer: 'lms.token.service',
        clockTolerance: 0,
        audience: 'lmsUser',
  });
  }
}

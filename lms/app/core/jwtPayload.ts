// tslint:disable: linebreak-style
export default class JwtPayload {
    _id: string;
    displayName: string;
    roleTypes: number;
    userName: string;
    mobilePhone: string;
    email: string;
    iss?: string;
    aud?: string;
    iat?: number;
    nbf?: number;
    exp?: number;
    constructor() {
        this._id = '';
        this.displayName = '';
        this.userName = '';
        this.mobilePhone = '';
        this.roleTypes = 0;
    }
  }

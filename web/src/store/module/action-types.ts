const actionType = {
  // user
  ListUser: { tips: '查询用户信息', code: 1000 },
  AddUser: { tips: '添加用户信息', code: 1001 },
  ModifyUser: { tips: '修改用户信息', code: 1002 },
  DelUser: { tips: '删除用户信息', code: 1003 },
  ModifyPwd: { tips: '修改密码', code: 1004 },
  ModifyPart: { tips: '修改信息', code: 1005 },
  ResetPwd: { tips: '重置密码', code: 1006 },
  ListSubUser: { tips: '', code: 1007 },
  // role
  ListRole: { tips: '查询角色信息', code: 2000 },
  AddRole: { tips: '添加角色信息', code: 2001 },
  DelRole: { tips: '删除角色信息', code: 2002 },
  ModifyRole: { tips: '修改角色信息', code: 2003 },
  OptionRole: { tips: '可选角色信息', code: 2004 },
  OptionAdd: { tips: '添加可选角色', code: 2005 },
  OptionDel: { tips: '移除可选角色', code: 2006 },
  // permission
  ListPerm: { tips: '', code: 3000 },
  ListPermByRole: { tips: '', code: 3001 },
  AddRolePerm: { tips: '添加权限', code: 3002 },
  RemoveRolePerm: { tips: '移除权限', code: 3003 },
  // device
  AddDevice: { tips: '绑定设备', code: 4000 },
  DelDevice: { tips: '解绑设备', code: 4001 },
  ListDevice: { tips: '', code: 4002 },
  SendCMD: { tips: '发送指令', code: 4003 },
  ListDevFace: { tips: '获取已推送人脸', code: 4004 },
  PushFace: { tips: '推送人脸', code: 4005 },
  RemoveFace: { tips: '移除人脸', code: 4006 },
  ListAllDevFace: { tips: '获取已推送人脸', code: 4007 },
  FindDevItem: { tips: '', code: 4008 },
  ModifyDevParams: { tips: '修改设备参数', code: 4009 },
  ModifyRemarks: { tips: '更新备注', code: 4010 },
  // face
  ListFace: { tips: '', code: 5000 },
  AddFace: { tips: '注册人脸', code: 5001 },
  DelFace: { tips: '删除人脸', code: 5002 },
  UploadFile: { tips: '上传文件', code: 5003 }
}
const deepCopy = (type: object) => {
  return JSON.parse(JSON.stringify(type))
}

export { actionType, deepCopy }

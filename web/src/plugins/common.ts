// 2018-10-09T17:20:45.626Z ==> 2018-10-10 01:20:45
const formatTime = (tt: string) => {
  const dd = new Date(tt)
  if (dd.toString() === 'Invalid Date') {
    return '格式错误'
  }
  let hou = dd.getHours() > 9 ? dd.getHours() : '0' + dd.getHours()
  let min = dd.getMinutes() > 9 ? dd.getMinutes() : '0' + dd.getMinutes()
  let sec = dd.getSeconds() > 9 ? dd.getSeconds() : '0' + dd.getSeconds()
  return dd.getFullYear() + '-' + (dd.getMonth() + 1) + '-' + dd.getDate() + '' + hou + ':' + min + ':' + sec
}

const checkInput = (str: string, limit: string = '-_=~`!@#$%^&*()+?？《》<>,、。（），/[]|{}\\') => {
  let res = 0
  if (limit.length < 1 || !str || str.length < 1) return 0;
  for (var i = 0; i < limit.length; i++) {
    if (str.indexOf(limit[i]) !== -1) {
      res = i;
      break;
    }
  }
  return res;
}

const genRandomStr = (len = 8) => {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
  let res = ''
  for (var i = 0; i < len; i++) {
    res += str.charAt(Math.floor(Math.random() * str.length))
  }
  return res;
}

const getLocalItem = (itemName: string) => {
  // if (window.localStorage === 'undefined') {
  //   return null
  // }
  return localStorage.getItem(itemName)
}

enum RoleType {
  SuperAdmin = 1,
  SchoolAdmin = 2,
  CourseAdmin = 4,
  ClassAdmin = 8,
  LabAdmin = 16,
  Teacher = 32,
  Student = 64,
}

export { formatTime, checkInput, genRandomStr, getLocalItem, RoleType }

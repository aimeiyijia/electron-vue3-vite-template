import {
  emailReg,
  idCardReg,
  numberTypeReg,
  passwordReg,
  personNameReg,
  phoneReg,
  smsCodeReg
} from './regular'

export function validatorPassword(rule: any, value: string, callback: Function) {
  if (!passwordReg.test(value)) {
    callback(new Error('密码必须为8~16位，且包含数字、大写字母、小写字母'))
  } else {
    callback()
  }
}

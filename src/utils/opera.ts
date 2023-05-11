export function getValueByKey(key: string, row: any) {
  return key.split('.').reduce((obj, cur) => {
    if (obj) {
      return obj[cur]
    }
  }, row)
}

// 获取到文件类型
export function getFileType(file) {
  if (file && file.fileName) {
    const lastPointeIndex = file.fileName.lastIndexOf('.')
    const len = file.fileName.length
    const name = file.fileName.substring(0, lastPointeIndex)
    const type = file.fileName.substring(lastPointeIndex + 1, len)
    return {
      name,
      type,
      fileFormat: type
    }
  }
  return ''
}

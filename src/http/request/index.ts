import http from './instance'

const JSONType = 'application/json'
const FORMType = 'application/x-www-form-urlencoded;charset=UTF-8'

export function $post(url: string, data: any, contentType?: string) {
  const ct = contentType || JSONType
  return http({
    method: 'POST',
    url: url,
    data: data,
    headers: { 'Content-Type': ct }
  })
}
export function $get(url: string, data: any, contentType?: string) {
  const ct = contentType || JSONType
  return http({
    method: 'GET',
    url: url,
    params: data,
    headers: {
      'Content-Type': ct
    }
  })
}

export function $delete(url: string, data: any, contentType?: string) {
  const ct = contentType || FORMType
  return http({
    method: 'DELETE',
    url: url,
    params: data,
    headers: {
      'Content-Type': ct
    }
  })
}
export function $put(url: string, data: any, contentType?: string) {
  const ct = contentType || JSONType
  return http({
    method: 'PUT',
    url: url,
    data: data,
    headers: { 'Content-Type': ct }
  })
}

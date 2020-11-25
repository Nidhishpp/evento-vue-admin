import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/signin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/profile',
    method: 'get'
  })
}

export function logout() {
  return request.headers.delete('Content-Type')
}

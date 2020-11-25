import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}

export function dashboardCount(query) {
  return request({
    url: '/dashboard',
    method: 'get',
    params: query
  })
}

export function pendingBookingList(query) {
  return request({
    url: '/bookings/pending',
    method: 'get',
    params: query
  })
}

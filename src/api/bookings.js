import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/bookings',
    method: 'get',
    params: query
  })
}

// export function createEvent(data) {
//   return request({
//     url: '/events',
//     method: 'post',
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     },
//     data
//   })
// }

export function statusUpdateBooking(id, data) {
  return request({
    url: '/bookings/status/' + id,
    method: 'patch',
    data
  })
}

// export function deleteEvent(id) {
//   return request({
//     url: '/gallery/' + id,
//     method: 'delete'
//   })
// }



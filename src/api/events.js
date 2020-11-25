import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/events',
    method: 'get',
    params: query
  })
}

export function updateGallery(id, data) {
  return request({
    url: '/gallery/' + id,
    method: 'patch',
    data
  })
}

export function featureUpdateEvent(id, data) {
  return request({
    url: '/events/featured/' + id,
    method: 'patch',
    data
  })
}

export function deleteEvent(id) {
  return request({
    url: '/gallery/' + id,
    method: 'delete'
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

export function createGallery(data) {
  return request({
    url: '/gallery',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// export function updateArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/update',
//     method: 'post',
//     data
//   })
// }

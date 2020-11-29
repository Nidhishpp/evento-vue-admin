import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/events',
    method: 'get',
    params: query
  })
}

export function createEvent(data) {
  return request({
    url: '/events',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
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
    url: '/events/' + id,
    method: 'delete'
  })
}



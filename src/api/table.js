import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/leaveAdmin/list',
    method: 'get',
    params
  })
}

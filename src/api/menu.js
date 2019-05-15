import request from '@/utils/request'

export function getMenu(userId) {
  return request({
    url: `/user/${userId}/menus`,
    method: 'get'
  })
}
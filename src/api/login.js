import request from '@/utils/request'

export function login(username, password) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            loginName: username,
            loginPwd: password
        }
    })
}

// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
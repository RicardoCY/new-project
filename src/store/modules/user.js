import { login} from '@/api/login'
import { getMenu } from '@/api/menu'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'

const user = {
  state: {
    userId:'',
    avatar: '',
    roles: [],
    userInfo:{},
    userMenu:[]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.userName = name
    },
    SET_ID: (state, id) => {
      state.userId = id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERINFO:(state,info)=>{
      state.userInfo=info
    },
    SET_USERMENU:(state,menu)=>{
      state.userMenu = menu
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username.trim(), userInfo.password).then(response => {
          const data = response.data
          //setToken(data.accessToken)
          Cookies.set('token', data.accessToken)
          Cookies.set('name', data.userName)
          Cookies.set('userInfo', data)
          commit('SET_ID', data.userId)
          commit('SET_NAME', data.userName)
          commit('SET_USERINFO', data)
          resolve(data)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          commit('SET_AVATAR', 'https://avatars2.githubusercontent.com/u/21124327?s=400&u=dc742a7f8cafea63c665eecb25ed5cc87b51546b&v=4')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取菜单
    GetMenu({ commit }, userid) {
      return new Promise((resolve, reject) => {
        getMenu(userid).then(response => {
          const data = response.data
          //console.log(data)
          var userMenus = JSON.stringify(data);
          window.localStorage["userMenus"] = userMenus
          commit('SET_USERMENU', data)
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      console.log(11)
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      Cookies.get('token')
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

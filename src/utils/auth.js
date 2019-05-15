import Cookies from 'js-cookie'

const TokenKey = 'token'
const MenuKey = 'userMenu'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  Cookies.set(TokenKey, token)
  // console.log(Cookies.set(TokenKey, token))
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeMenu() {
  return Cookies.remove(MenuKey)
}

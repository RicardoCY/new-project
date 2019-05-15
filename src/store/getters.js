const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  dialog: state => state.app.dialog,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userName,
  roles: state => state.user.roles,
  userMenu: state => state.user.userMenu
}
export default getters

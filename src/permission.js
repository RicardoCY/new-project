import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import Cookies from 'js-cookie'

//const whiteList = ['/login','/person','/dashboard','/detail','/Assets/index','/Auth/role','/leaveAdmin/employeeLeave'] // 不重定向白名单
const whiteList = ['/login'] // 不重定向白名单


router.beforeEach((to, from, next) => {
  NProgress.start()
  let localToken = Cookies.get('token')
  //判断是否有token
  if (localToken&&JSON.parse(window.localStorage.getItem("userMenus"))){
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    }else {
      let lockRoutes = []
      let commonRoutes = []
      for(let i = 0; i < router.options.routes.length; i++){
        let item = router.options.routes[i]
        if(item.children){
          lockRoutes.push(item)
        }else{
          commonRoutes.push(item)
        }
      }
      // console.log(lockRoutes)
      // console.log(commonRoutes)
      let userMenus = JSON.parse(window.localStorage.getItem("userMenus"))
      //console.log(userMenus)
      let menuLevel1 = userMenus.filter(item => item.menuLevel == 1)//用户可访问的一级菜单
      let menulevel2 = userMenus.filter(item => item.menuLevel == 2)//用户可访问的二级菜单
      let newMenus = []
      //过滤上级菜单不可访问的二级菜单
      for(let i = 0; i < menulevel2.length; i++){
        let menu2 = menulevel2[i]
        if(menuLevel1.filter(item => item.menuId == menu2.parentId).length > 0){
          //console.log(menu2)
          newMenus.push(menu2)//用户可访问菜单
        }
      }
      //console.log(newMenus)
      
      
      
      let flag = false
      for(let i = 0; i < newMenus.length; i++){
        let item = newMenus[i]
        if(to.meta.title == item.menuName){
          flag = true
        }
      }
      for(let i = 0; i < commonRoutes.length; i++){
        let item = commonRoutes[i]
        if(to.path == item.path){
          flag = true
        }
      }
      if(!flag && to.meta.title != "个人中心" && to.meta.title != "无权限"){
        console.log("没有权限")
        //next({ path: '/' })
        next({ name: 'personalInfoError' })
      }else{
        next()
      }
    }
  } else {
    console.log(11)
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

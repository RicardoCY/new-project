<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :unique-opened='true'
    >
      <div style="height:50px;display:flex;justify-content:center">
         <img v-if="sidebar.opened" :src="logo_white" style="height: 30px;margin-top:10px;" alt="" >
         <img v-else  class="pos-img" :src="logo_small"  alt="">
      </div>
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import logo_white from '@/assets/logo_white.png'
import logo_small from '@/assets/favicon.png'

export default {
   data(){
    return {
      logo_white,
      logo_small,
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      //console.log(this.$router.options.routes)
      let userMenus = JSON.parse(window.localStorage.getItem("userMenus"))//用户可访问菜单
      console.log(userMenus)
      let menuLevel1 = userMenus.filter(item => item.menuLevel == 1)//用户可访问的一级菜单
      let menulevel2 = userMenus.filter(item => item.menuLevel == 2)//用户可访问的二级菜单
      // console.log(menuLevel1)
      // console.log(menulevel2)
      let lockRoutes = []
      let commonRoutes = []
      for(let i = 0; i < this.$router.options.routes.length; i++){
        let item = this.$router.options.routes[i]
        if(item.children && item.path != '/personalInfo'){
          lockRoutes.push(item)//需对照可访问菜单过滤路由(门户、请假、资产、客户、权限)
        }else{
          commonRoutes.push(item)//不需判断路由
        }
      }
      //console.log(lockRoutes)
      //console.log(commonRoutes)
      for(var i = 0; i < lockRoutes.length; i++){
        let item = lockRoutes[i]
        //console.log(menuLevel1)
        for(let j = 0; j < menuLevel1.length; j++){
          if(item.meta.title == menuLevel1[j].menuName){
            let newChildren = []
            //遍历可用一级菜单内的二级菜单
            for(let k = 0; k < item.children.length; k++){
              let child = item.children[k]
              for(let l = 0; l < menulevel2.length; l++){
                if(child.meta.title == menulevel2[l].menuName){
                  newChildren.push(child)
                }
              }
            }
            //console.log(item)//可用一级菜单
            //console.log(newChildren)//可用二级菜单
            item.children = newChildren//合并菜单
            commonRoutes.push(item)//合并路由
          }
        }

      }

      console.log(commonRoutes)
      return commonRoutes
    },
    isCollapse() {
      console.log(this.sidebar.opened)
      return !this.sidebar.opened
    }
  },
  mounted(){
    console.log(this.routes)
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
.pos-img{
  width: 20px;
  height: 20px;
  margin-top: 20px
}
.bg-div{
  position: absolute;
  top:-50px;
  width: 100%;
  background-color: rgb(48, 65, 86);
  z-index: 1300;
}
</style>

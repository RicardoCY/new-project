<template>
  <el-menu class="navbar" mode="horizontal" style="background-color:#fff;color:#2F4157!important;border-bottom:1px solid rgba(244,246,249,.7);">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper" >
        <span style="margin-right: 10px">您好{{`，${username}`}}</span>
        <!-- <img style="vertical-align: middle;" class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
        <img style="vertical-align: middle;" class="user-avatar" :src="userImg">
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" :to="{path:'/personalInfo'}">
          <el-dropdown-item>
             个人中心
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item >
          <span @click="openDialog">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters ,mapState} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Cookies from 'js-cookie'

import userImg from '@/assets/userImg.png'

export default {
  data(){
    return {
      userImg,
      username:'',
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
    ]),
    ...mapState({
      userInfo:state=>state.user.userInfo
    })
  },
  methods: {
    openDialog(){
      this.$store.commit('TOGGLE_DIALOG')
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut')
      location.reload() // 为了重新实例化vue-router对象 避免bug
    }
  },
  mounted(){
    this.username=Cookies.get('name')
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: royalblue;
  border-bottom:none;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;

  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>


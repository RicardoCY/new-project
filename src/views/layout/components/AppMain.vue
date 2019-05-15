<template>
  <section class="app-main">
    <sidebar :userMenus="userMenus" style="width: 180px" class="sidebar-container">
    </sidebar>
    <el-container style="flex-direction: column">
      <navbar></navbar>
       <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view style="width:100%"></router-view>
    </transition>
    </el-container>
  </section>
</template>

<script>
import Cookies from 'js-cookie'

  import navbar from '../components/Navbar'
  import Sidebar from '../components/Sidebar'
export default {
  name: 'AppMain',
  components: {
    Sidebar,
    navbar
  },
  data(){
    return {
      userInfo:'',
      userMenus:[]
    }
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  methods:{
    
  },
  beforeUpdate(){
    
  },
  mounted(){
    this.userInfo = JSON.parse(Cookies.get('userInfo'))
    
  },
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh);
  position: relative;
  /* overflow: hidden; */
  display: flex;
  
}
</style>

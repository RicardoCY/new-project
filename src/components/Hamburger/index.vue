<template>
  <div class="nav-container">
    <svg t="1492500959545" @click="toggleClick" class="hamburger" :class="{'is-active':isActive}" style="height: 50px;" viewBox="0 0 1024 1024"
      version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
      <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
        p-id="1692"></path>
      <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
        p-id="1693"></path>
      <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
        p-id="1694"></path>
    </svg>
  </div>
</template>

<script>
import logo from '@/assets/logo.png'
import logo_white from '@/assets/logo_white.png'
import logo_small from '@/assets/favicon.png'
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  },
  data(){
    return {
      logo,
      logo_white,
      logo_small,
      opened:true
    }
  },
  watch:{
    '$store.getters.sidebar':{
       handler: function(newer, older) { // 可以获取新值与老值两个参数
          this.opened=newer.opened
          console.log(this.opened)
       },
       deep: true // 开启深度监听
    }
  },
  mounted(){
   
  }
}
</script>

<style scoped>
.nav-container{
  padding-left: 24px;
}
.hamburger {
	display: inline-block;
	cursor: pointer;
	width: 20px;
	height: 20px;
	transform: rotate(90deg);
	transition: .38s;
	transform-origin: 50% 50%;
}
.hamburger.is-active {
	transform: rotate(0deg);
}

.yes{
  width:160px;
  transition: width .295s ease;
}
.no{
  width: 35px;
  transition: width .295s ease;
}
.size{
  height: 50px;
  width: 34px;
}
.pos-img{
  position: absolute;
  top:15px;
  left: 7px;
  width: 20px;
  height: 20px;
}
</style>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{title?item.meta.title+'  /  '+title:" "}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      title:null,
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      //let matched = this.$route.matched.filter(item => item.name)
      let matched = this.$route.matched
      this.title = matched[1].meta.title
      const first = matched[0]
      // if (first && first.name !== 'dashboard') {
      //   matched = [{ path: '/dashboard', meta: { title: '门户' }}].concat(matched)
      // }
      this.levelList=[first]
      // this.levelList = [{ path: '/dashboard', meta: { title: '门户' }}].concat(matched)
      // this.levelList = matched
      console.log(this.levelList)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      cursor: text;
    }
  }
</style>

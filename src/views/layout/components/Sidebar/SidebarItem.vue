<template>
  <div v-if="!item.hidden&&item.children" class="menu-wrapper">
      <!--<router-link   v-if="hasOneShowingChild(item.children)item.children==0 && !onlyOneChild.children" :to="resolvePath(onlyOneChild.path)">-->
        <!--<el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">-->
          <!--<i v-if="item.meta&&item.meta.iconfont" class="iconfont" :class="item.meta.iconfont"></i>-->
          <!--&lt;!&ndash;<svg-icon v-if="onlyOneChild.meta&&onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon"></svg-icon>&ndash;&gt;-->
          <!--<span v-if="onlyOneChild.meta&&onlyOneChild.meta.title" slot="title">{{onlyOneChild.meta.title}}</span>-->
        <!--</el-menu-item>-->
      <!--</router-link>-->
    <router-link   v-if="item.children==0 && !onlyOneChild.children" :to="resolvePath(onlyOneChild.path)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <i v-if="item.meta&&item.meta.iconfont" class="iconfont" :class="item.meta.iconfont"></i>
        <!--<svg-icon v-if="onlyOneChild.meta&&onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon"></svg-icon>-->
        <span v-if="onlyOneChild.meta&&onlyOneChild.meta.title" slot="title">{{onlyOneChild.meta.title}}</span>
      </el-menu-item>
    </router-link>
      <el-submenu v-else :index="item.name||item.path">
        <template slot="title">
          <i v-if="item.meta&&item.meta.iconfont" class="iconfont" :class="item.meta.iconfont"></i>
          <!--<svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>-->
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>
        <template v-for="child in item.children" v-show="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :item="child" :key="child.path" :base-path="resolvePath(child.path)"></sidebar-item>
          <router-link v-else :to="resolvePath(child.path)" :key="child.name">
            <el-menu-item :index="resolvePath(child.path)">
              <i v-if="child.meta&&child.meta.iconfont" class="iconfont" :class="child.meta.iconfont"></i>
              <!--<svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>-->
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
  </div>
</template>

<script>
import path from 'path'

export default {
  name: 'SidebarItem',
  props: {
    // route配置json
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    resolvePath(...paths) {
      return path.resolve(this.basePath, ...paths)
    }
  },
  mounted(){ }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>

  i{
    font-size:15px
  }
</style>

import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// company: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Dashboard',
    // hidden: true,
    meta: { title: '门户', icon: 'example',iconfont: 'icon-PCtaishiji' },
    children: [
      {
      path: 'index',
      meta: { title: '个人门户', icon: 'example',iconfont: '' },
      component: () => import('@/views/dashboard/index')
      },
      {
        path: 'company',
        // hidden: true,
        meta: { title: '公司门户', icon: 'example',iconfont: '' },
        component: () => import('@/views/dashboard/company/company')
      },
      {
        path: 'manage',
        // hidden: true,
        meta: { title: '门户管理', icon: 'example',iconfont: '' },
        component: () => import('@/views/dashboard/manage/manage')
      },
      {
        path: 'process',
        // hidden: true,
        meta: { title: '新建流程', icon: 'example',iconfont: '' },
        component: () => import('@/views/dashboard/process/process')
      },
      // {
      //   path: 'info',
      //   hidden: true,
      //   component: () => import('@/views/personalInfo/index')
      // }
    ]
  },
  {
    path: '/leaveAdmin',
    component: Layout,
    redirect: '/leaveAdmin/admin',
    // name: 'Example',
    meta: { title: '考勤管理', icon: 'example',iconfont: 'icon-riqi' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/leaveAdmin/LeaveAdmin'),
        meta: { title: '假别管理', icon: 'table' ,iconfont:''}
      },
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/leaveAdmin/index'),
        meta: { title: '我的假别', icon: 'table' ,iconfont:''}
      },
      {
        path: 'employeeLeave',
        name: 'employeeLeave',
        component: () => import('@/views/leaveAdmin/employeeLeave'),
        meta: { title: '请假申请', icon: 'tree',iconfont:'' }
      },
      {
        path: 'leaveSearch',
        name: 'leaveSearch',
        component: () => import('@/views/leaveAdmin/leaveSearch'),
        meta: { title: '请假查询', icon: 'tree',iconfont:'' }
      }
    ]
  },
  {
    path: '/assets',
    component: Layout,
    meta:{
      auth:1,
      title: '资产管理',
      icon: 'form',
      iconfont: 'icon-CombinedShape'
    },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/Assets/AssetsInfo/Info'),
        meta: { title: '资产查询',iconfont:'' }
      },
      {
        path: 'index',
        name: 'AssetsIndex',
        component: () => import('@/views/Assets/index'),
        meta: { title: '资产入库',iconfont:'' },

      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/Assets/AssetsUser/user'),
        meta: { title: '我的资产',iconfont:'' }
      },
      {
        path: 'grant',
        name: 'grant',
        component: () => import('@/views/Assets/AssetsGrant/grant'),
        meta: { title: '资产领用', iconfont: '' },

      },
      {
        path: 'borrow',
        name: 'borrow',
        component: () => import('@/views/Assets/AssetsBorrow/borrow'),
        meta: { title: '资产借用', iconfont: '' },
      },
      {
        path: 'return',
        name: 'return',
        component: () => import('@/views/Assets/AssetsReturn/return'),
        meta: { title: '资产归还', iconfont: '' },
      },
      {
        path: 'Repair',
        name: 'Repair',
        component: () => import('@/views/Assets/AssetsRepair/Repair'),
        meta: { title: '资产维修', iconfont: '' },
      },
      // {
      //   path: 'scrapped',
      //   name: 'scrapped',
      //   component: () => import('@/views/Assets/AssetsScrapped/scrapped'),
      //   meta: { title: '资产报废', iconfont: 'icon-cunkuan' },
      // }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/index',
    meta: { title: '客户管理', icon: 'example',iconfont: 'icon-gerentouxiang' },
    children: [
      {
        path: 'index',
        name: 'CustomerIndex',
        component: () => import('@/views/Customer/index'),
        meta: { title: '客户管理', icon: 'form' ,iconfont:''},
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    meta:{
      auth:1,
      title: '权限管理',
      icon: 'form',
      iconfont: 'icon-quanxian'
    },
    children: [
      {
        path: 'index',
        name: 'AuthIndex',
        component: () => import('@/views/Auth/index'),
        meta: { title: '员工管理', icon: 'form' ,iconfont:''},

      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/Auth/role'),
        meta: { title: '角色管理', icon: 'form' ,iconfont:''},

      },
      {
        path: 'structure',
        name: 'structure',
        component: () => import('@/views/Auth/structure'),
        meta: { title: '权限管理', icon: 'form',iconfont:'' },
      },
      {
        path: 'carte',
        name: 'carte',
        component: () => import('@/views/Auth/carte'),
        meta: { title: '菜单管理', icon: 'form',iconfont:'' },
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/Auth/department'),
        meta: { title: '部门管理', icon: 'form',iconfont:'' },
      }
    ]
  },
  {
    path: '/personalInfo',
    component: Layout,
    redirect: '/personalInfo/index',
    hidden: true,
    meta: { title: '个人中心', icon: 'example',iconfont: 'icon-gerentouxiang' },
    children: [
      {
        path: 'index',
        name: 'personalInfoIndex',
        component: () => import('@/views/personalInfo/index'),
        meta: { title: '个人中心', icon: 'form' ,iconfont:''},
      },
      {
        path: 'error',
        name: 'personalInfoError',
        component: () => import('@/views/error'),
        meta: { title: '无权限', icon: 'form' ,iconfont:''},
      }
    ]
  },
  {
    path: '/Detail',name:'Detail' ,component: () => import('@/views/dashboard/detail/detail'), hidden: true
  },
  {//资产操作详情页
    path: '/AssetsDetail',name:'AssetsDetail' ,component: () => import('@/views/dashboard/detail/assets'), hidden: true
  },
  {//新闻详情页
    path: '/NewsDetail',name:'NewsDetail' ,component: () => import('@/views/NewsDetail/index'), hidden: true
  },
  {//通知详情页
    path: '/NotifyDetail',name:'NotifyDetail' ,component: () => import('@/views/NewsDetail/notify'), hidden: true
  },
  //公司制度
  {//员工管理方法
    path: '/CompanySystemStaff',name:'Staff' ,component: () => import('@/views/CompanySystem/staff'), hidden: true
  },
  {//考勤和请休假管理规定
    path: '/CompanySystemLeave',name:'Leave' ,component: () => import('@/views/CompanySystem/leave'), hidden: true
  },
  {//薪酬管理规定
    path: '/CompanySystemSalary',name:'Salary' ,component: () => import('@/views/CompanySystem/salary'), hidden: true
  },
  {//违纪管理规定
    path: '/CompanySystemBreach',name:'Breach' ,component: () => import('@/views/CompanySystem/breach'), hidden: true
  },
  {//内部推荐流程及奖励方法
    path: '/CompanySystemRecommend',name:'Recommend' ,component: () => import('@/views/CompanySystem/recommend'), hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <!--<sidebar class="sidebar-container"></sidebar>-->
    <div class="main-container">
      <!-- <navbar></navbar> -->
      <app-main >
        
      </app-main>
    </div>
    <!--:visible.sync=""-->
    <el-dialog
      title="修改密码"
      :before-close="toggleDialog"
      :visible.sync="$store.getters.dialog"
      width="400px"
    >
      <el-form
        ref="modifyForm"
        :model="form"
        label-width="100px"
      >
        <el-form-item
          label="原始密码"
          prop="oldpass"
          :rules="[
          { required: true, message: '密码不能为空'},
          {max:16, message: '密码不超过16个字符'},
          {min:6, message: '密码最少6个字符'}
          ]"
        >
          <el-input type="password" v-model.trim="form.oldpass" ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          :rules="[
          {required: true, message: '密码不能为空'},
          {max:16, message: '密码不超过16个字符'},
          {min:6, message: '密码最少6个字符'},
          ]"
          prop="newpass"
        >
          <el-input type="password" v-model.trim="form.newpass" ></el-input>
        </el-form-item>
        <el-form-item
          label="确认新密码"
          :rules="[{ required: true, message: '密码不能为空'},{max:16, message: '密码不超过16个字符'},
          {min:6, message: '密码最少6个字符'}]"
          prop="repass"
        >
          <el-input type="password" v-model.trim="form.repass" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="toggleDialog">取 消</el-button>
        <el-button  @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data(){
    return {
      userInfo:'',
      form: {
        oldpass:'',
        repass:'',
        newpass:''
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    toggleDialog(){
      //切换前清空数据检测
      this.from=''
      this.$refs['modifyForm'].resetFields();
      this.$store.commit('TOGGLE_DIALOG')
    },
    handleSubmit(){
        this.$refs['modifyForm'].validate((valid) => {
          if (valid) {
            let pwdReg = /^[\w_!@#-.]{6,16}$/
            if(pwdReg.test(this.form.newpass)){
              if(this.form.newpass == this.form.repass){
                this.$http.post("/user/updatePwd",{
                  newPwd:this.form.newpass,
                  oldPwd:this.form.oldpass
                }).then(res => {
                    this.$notify({
                      title: '成功',
                      message: '密码修改成功',
                      type: 'success'
                    });
                    this.$store.commit('TOGGLE_DIALOG')
                  })
              }else{
                this.$message({
                  message:'两次输入的密码不匹配，请重试',
                  type:'warning'
                });
              }
            }else{
              this.$message({
                message:'密码只能包含数字、字母、下划线，且长度为6~16位',
                type:'warning'
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  },
  mounted(){
    console.log(this.$store.getters.dialog)
    this.userInfo = JSON.parse(Cookies.get('userInfo'))
  },

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>

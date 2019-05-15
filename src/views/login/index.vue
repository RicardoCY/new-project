<template>
  <div class="login-container">
    <div style="width:calc(100vw - 520px)">
      <el-carousel height="100vh">
        <el-carousel-item v-for="item in [p1,p2,p3]" :key="item">
          <img style="width: 100%;height: 100%" :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-form v-show='!forgetShow'  v-if="!dialogForgetVisible" class="login-form" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">彦旭OA管理系统</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="请输入密码"></el-input>
          <span class="svg-container show-pwd" @click="showPwd">
            <svg-icon v-if="pwdType" icon-class="eye" />
            <i style="font-size:24px;margin-left:-5px" v-else class="iconfont icon-eye"></i>
            </span>
      </el-form-item>
      <el-form-item style="margin-top:40px">
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录账号
        </el-button>
      </el-form-item>
      <span style="float: left;margin-top:30px">
        <el-checkbox v-model="checked" >记住密码</el-checkbox>
      </span>
      <span style="float: right;margin-top:30px">
        <el-button class="forget-btn" type="text" @click="openDialogForget">忘记密码</el-button>
      </span>
    </el-form>
    <div v-show='forgetShow' class="dialog-forget">
       <h3 class="title">忘记密码</h3>
      <el-form v-if="forgetShow" :model="forgetForm" label-width="80px">
        <el-form-item label="工作邮箱" >
          <el-input style="width:320px;" v-model="forgetForm.workMail" :disabled="comeFromMail"></el-input>
        </el-form-item>
          <el-form-item label="验证码">
            <div style="width:320px;display:flex;justify-content: space-between;">
              <el-input style="flex:1;" v-model="forgetForm.code" :disabled="comeFromMail"></el-input>
              <el-button style="margin-left:10px;"  :disabled="comeFromMail" :loading="getCodeLoad" @click="getCode">
                {{getCodeLoad?btnTime + "s后获取":"获取验证码"}}
              </el-button>
            </div>
          </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input style="width:320px;" type="password" v-model="forgetForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input style="width:320px;" type="password" v-model="forgetForm.rePwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button style="width:104px" @click="forgetShow = false">取 消</el-button>
         <el-button style="width:104px" type="primary" @click="forgetPassword">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import p1 from '@/assets/P1@2x.png'
import p2 from '@/assets/P2@2x.png'
import p3 from '@/assets/P3@2x.png'
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      p1,
      p2,
      p3,
      forgetShow:false,
      imgList:[''],
      checked: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      //忘记密码弹窗
      dialogForgetVisible: false,
      forgetForm: {
        workMail:"",
        code:"",
        pwd:"",
        rePwd:""
      },
      getCodeLoad:false,
      btnTime:60,
      //忘记密码邮箱跳转
      comeFromMail:false,
      urlCode:null
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      // this.$router.push({ path: '/' })
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then((res) => {
            this.$store.dispatch('GetMenu' , res.userId).then(() => {
              this.loading = false
              this.handleRemeber()
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRemeber(){
      if(this.checked){
        localStorage.setItem('username',this.loginForm.username)
        localStorage.setItem('password',this.loginForm.password)
        localStorage.setItem('checked',this.checked)
      }else {
        localStorage.removeItem('checked')
        localStorage.removeItem('username')
        localStorage.removeItem('password')
      }
    },
    //打开忘记密码弹窗
    openDialogForget(){
      this.forgetShow = true
    },
    //获取验证码
    getCode(){
      let workMailReg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
      if(workMailReg.test(this.forgetForm.workMail)){
        this.btnTime = 60
        this.getCodeLoad = true
        var timer = setInterval(() => {
          this.btnTime--
          if (this.btnTime <= 0) {
            this.getCodeLoad = false
            clearInterval(timer)
          }
        }, 1000)
        this.$http.get(`/user/getCode/${this.forgetForm.workMail}/workMail`).then(res => {
          this.$notify({
            title: '成功',
            message: '验证码已发送至邮箱，请注意查收',
            type: 'success'
          });
        }, error => {
          this.btnTime = 0
        })
      }else{
        this.$message({
          message:'请填写正确的工作邮箱',
          type:'warning'
        });
      }
    },
    //提交新密码
    forgetPassword(){
      let workMailReg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
      let pwdReg = /^[\w_!@#-.]{6,16}$/
      if(workMailReg.test(this.forgetForm.workMail)){
        if(this.forgetForm.code){
          if(pwdReg.test(this.forgetForm.pwd)){
            if(this.forgetForm.pwd == this.forgetForm.rePwd){
              this.$http.post("/user/forgetPassword",this.forgetForm).then(res => {
                let newPwd = this.forgetForm.pwd
                this.$notify({
                  title: '成功',
                  message: '密码修改成功',
                  type: 'success'
                });
                this.loginForm.password = newPwd
                this.forgetShow = false
              })
            }else{
              this.$message({
                message:'两次输入的密码不匹配，请重试',
                type:'warning'
              });
            }
          }else{
            this.$message({
              message:'密码只能包含数字、字母、_!@#-.，且长度为6~16位',
              type:'warning'
            });
          }
        }else{
          this.$message({
            message:'请填写验证码',
            type:'warning'
          });
        }
      }else{
        this.$message({
          message:'请填写正确的工作邮箱',
          type:'warning'
        });
      }
    },
    //忘记密码邮箱跳转
    getUrlCode(){
      let str = this.urlCode.split("&")
      let code = str[0]
      let workMail = str[1].split("=")[1]
      this.forgetForm.code = code
      this.forgetForm.workMail = workMail
      this.dialogForgetVisible = true
    }
  },
  mounted(){
    let checked =JSON.parse(localStorage.getItem('checked'))
    if(checked){
      this.checked = checked
      this.loginForm={
        username:localStorage.getItem('username'),
        password:localStorage.getItem('password')
      }
    }else {

    }
    //忘记密码邮箱跳转
    if(this.$route.query.code){
      this.comeFromMail = true
      this.urlCode = this.$route.query.code
      this.getUrlCode()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .login-form{
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.dialog-footer{
  direction: rtl;
  margin-right: -30px;
}

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    background-color: rgba(255,255,255,1);
    z-index: 2;
    position: absolute;
    right:0;
    top: 0;
    height: 100%;
    width: 520px;
    padding: 120px 100px 0px 100px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color:#3A84FF;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    &:hover{
      color: #3A84FF ;
    }
  }
  .forget-btn{
    padding:0;
    text-decoration:underline;
  }
  .dialog-forget{
    z-index: 2;
    background-color: rgba(255,255,255,1);
    position: absolute;
    right:0;
    top: 0;
    height: 100%;
    width: 520px;
    padding: 120px 100px 0px 100px;
  }
}
</style>

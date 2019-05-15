<template>
    <div class="info-container">
      <el-row >
        <div>
          <h3 style="text-align:center"  v-if="$route.query.jobNum">
            员工信息
            </h3>
        </div>
        <el-button  v-if="$route.query.jobNum" @click="$router.go(-1)" style="float:right" type='info '>返回</el-button>
        <el-col :span="20">
          <div  class="grid-content bg-purple">
            <el-col :span="2" v-if="!$route.query.jobNum">
              <div style="text-align: center">
                <span style="text-align: center;display: inline-block;width:35px;height:35px;border-radius: 50%;">
                <i style="font-size: 30px;color: #99a9bf" class="iconfont icon-gerentouxiang"></i>
               </span>
              </div>
            </el-col>
            <el-col :span="18" v-if="!$route.query.jobNum">
              <div class="info">
                <span>{{passInfo.baseInfo.trueName}}</span>
                <span class="info-sex">{{passInfo.baseInfo.sex==1?'(男)':'(女)'}}</span>
                <span class="info-sex">{{passInfo.baseInfo.jobNum}}</span>
              </div>
              <div class="title">
                基本信息
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="4">
          <div style="line-height:35px;text-align: center" class="grid-content bg-purple">
          </div>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="4">
          &nbsp;
        </el-col>
        <el-col :span="20" :gutter="10">
          <el-col :span="12">
              <el-row>
                <p> <span >基本信息表</span>
                <el-button   @click="handleShow(1)" type="text" icon="el-icon-edit" circle></el-button>
                </p>
                <vtable v-if="passInfo.baseInfo"  :passInfo="passInfo.baseInfo"></vtable>
              </el-row>
            <el-row>
              <p v-if="passInfo.workInfo"  style="height:40px;line-height:40px">薪资表
                  <el-button v-if="$route.query.jobNum"   @click="handleShow(5)" type="text" icon="el-icon-edit" circle></el-button>
              </p>
              <vtable v-if="passInfo.salaryInfo" :passInfo="passInfo.salaryInfo"></vtable>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <p v-if="passInfo.familyInfo">家庭情况表
                <el-button   @click="handleShow(2)" type="text" icon="el-icon-edit" circle></el-button>
              </p>
              <vtable :passInfo="passInfo.familyInfo"></vtable>
            </el-row>
            <el-row>
              <p v-if="passInfo.educationInfo">教育情况表
                <el-button   @click="handleShow(3)" type="text" icon="el-icon-edit" circle></el-button>
              </p>
              <vtable v-if="passInfo.educationInfo"  :passInfo="passInfo.educationInfo"></vtable>
            </el-row>
            <el-row>
              <p v-if="passInfo.workInfo" >工作情况表
                <el-button   @click="handleShow(4)" type="text" icon="el-icon-edit" circle></el-button>
              </p>
              <vtable v-if="passInfo.workInfo" :passInfo="passInfo.workInfo"></vtable>
            </el-row>
          </el-col>
        </el-col>
      </el-row>

      <el-dialog
        :before-close="handleBeforeClose"
        title="修改个人信息"
        :visible.sync="dialogShow"
        width="400px"
      >
        <el-form
          v-if="dialogShow"
          ref="modifyForm"
          :model="form"
          label-width="100px"
        >
        <el-form-item
           v-if="showState==1"
            label="英文名"
            :rules="[{required:true, message: '英文名不能为空', trigger: 'blur' },{max:20, message: '英文名不超过20个字符'},
          {min:4, message: '英文名最少4个字符'}]"
            prop="englishName"
          >
            <el-input v-model.trim="form.englishName" ></el-input>
          </el-form-item>
          <el-form-item
            v-if="showState==1"
            label="手机号"
            prop="mobile"
            :rules="[
          {required:true, message: '手机号不能为空', trigger: 'blur'},
           {pattern:/^1\d{10}$/, message: '手机号格式不对', trigger: 'blur'},
          {max:11, message: '手机号为11位数字'},
          {min:11, message: '手机号为11位数字'}
          ]"
          >
            <el-input v-model.trim="form.mobile" ></el-input>
          </el-form-item>
          <el-form-item
            v-if="showState==1"
            label="个人邮箱"
            :rules="[{required:true, message: '个人邮箱不能为空', trigger: 'blur' },{max:40, message: '个人邮箱不超过40个字符'},
            {min:6, message: '个人邮箱最少6个字符'}]"
            prop="email"
          >
            <el-input v-model.trim="form.email" ></el-input>
          </el-form-item>

          <el-form-item v-if="showState==1" label="性别" prop="resource">
            <el-radio-group v-model="form.sex"
              :rules="[
             { required: true, message: '请选择性别', trigger: 'blur' }
              ]"
            >
              <el-radio :label="1" >男</el-radio>
              <el-radio :label="0" >女</el-radio>
            </el-radio-group>
          </el-form-item>
         
          
          
           <el-form-item v-if="showState==1" label="岗位类别"  prop="jobCategory" >
            <el-radio-group 
              @change="handleChange"
              v-model="form.jobCategory"
              :rules="[
             { required: true, message: '请选择岗位类别', trigger: 'blur' }
              ]"
            >
              <el-radio :label="1" >业务岗</el-radio>
              <el-radio :label="0" >非业务岗</el-radio>
            </el-radio-group>
          </el-form-item>

           <el-form-item
           v-if="showState==1"
            label="岗位"
            :rules="[{required:true, message: '岗位不能为空', trigger: 'blur' },{max:20, message: '岗位不超过20个字符'},
          {min:2, message: '岗位最少2个字符'}]"
            prop="post"
          >
            <el-input v-model.trim="form.post" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==1"
            label="分机号"
            :rules="[{required:true, message: '分机号不能为空', trigger: 'blur' },{max:20, message: '分机号不超过20个字符'},
          {min:4, message: '分机号最少4个字符'}]"
            prop="extension"
          >
            <el-input v-model.trim="form.extension" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==1"
            label="Skype"
            :rules="[{required:true, message: 'skype不能为空', trigger: 'blur' },{max:20, message: 'Skype不超过20个字符'},
          {min:4, message: 'Skype最少4个字符'}]"
            prop="skype"
          >
            <el-input v-model.trim="form.skype" ></el-input>
          </el-form-item>
           <el-form-item
          v-if="showState==1"
            label="QQ号"
            :rules="[{required:true, message: 'QQ号不能为空', trigger: 'blur' },{max:12, message: 'QQ号不超过12个字符'},
          {min:6, message: 'QQ最少6位'}]"
            prop="qq"
          >
            <el-input v-model.trim="form.qq" ></el-input>
          </el-form-item>
          <el-form-item
           v-if="showState==1"
            label="微信号"
            :rules="[{required:true, message: '微信号不能为空', trigger: 'blur' },{max:20, message: '微信号不超过20个字符'},
          {min:4, message: '微信号最少4个字符'}]"
            prop="wechat"
          >
            <el-input v-model.trim="form.wechat" ></el-input>
          </el-form-item>
           <el-form-item
            v-if="showState==1&&$route.query.jobNum"
            label="备注"
            :rules="[{required:true, message: '备注不能为空', trigger: 'blur' },{max:20, message: '备注不超过20个字符'},
            {min:4, message: '备注最少4个字符'}]"
            prop="remark"
          >
            <el-input v-model.trim="form.remark" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==2"
            label="籍贯"
            :rules="[{required:true, message: '籍贯不能为空', trigger: 'blur' },]"
            prop="nativePlace"
          >
            <el-input v-model.trim="form.nativePlace" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==2"
            label="现住地"
              :rules="[{required:true, message: '现住地不能为空', trigger: 'blur' },]"
            prop="place"
          >
            <el-input v-model.trim="form.place" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==2"
            label="婚姻"
            :rules="[ { required: true, message: '请选择是否结婚', trigger: 'blur' }]"
            prop="isMarry"
          >
            <el-radio-group v-model="form.isMarry"
            >
              <el-radio :label="true" >已婚</el-radio>
              <el-radio :label="false" >未婚</el-radio>
            </el-radio-group>
          </el-form-item>
           <el-form-item
           v-if="showState==2"
            label="小孩"
            :rules="[ { required: true, message: '请选择是否有小孩', trigger: 'blur' }]"
            prop="hasChild"
          >
            <el-radio-group v-model="form.hasChild"
            >
              <el-radio :label="true" >有</el-radio>
              <el-radio :label="false" >无</el-radio>
            </el-radio-group>
          </el-form-item>
           <el-form-item
           v-if="showState==2"
            label="紧急联系人"
            :rules="[   {required:true, message: '紧急联系人不能为空', trigger: 'blur' },]"
            prop="emergencyContact"
          >
            <el-input v-model.trim="form.emergencyContact" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==2"
            label="手机"
            :rules="[
             {required:true, message: '手机号不能为空', trigger: 'blur' },
            {max:11, message: '手机号为11位数字'},
            {min:11, message: '手机号为11位数字'}
            ]"
            prop="mobile"
          >
            <el-input v-model.trim="form.mobile" ></el-input>
          </el-form-item>
           <el-form-item
            v-if="showState==2&&$route.query.jobNum"
            label="备注"
            :rules="[{required:true, message: '备注不能为空', trigger: 'blur' },{max:20, message: '备注不超过20个字符'},
            {min:4, message: '备注最少4个字符'}]"
            prop="remark"
          >
            <el-input v-model.trim="form.remark" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==3"
            label="毕业院校"
            :rules="[{required:true, message: '毕业院校不能为空', trigger: 'blur' }]"
            prop="university"
          >
            <el-input v-model.trim="form.university" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==3"
            label="专业"
            :rules="[{required:true, message: '专业不能为空', trigger: 'blur' }]"
            prop="major"
          >
            <el-input v-model.trim="form.major" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==3"
            label="学历"
             :rules="[{required:true, message: '学历不能为空', trigger: 'blur' }]"
            prop="education"
          >
            <el-input v-model.trim="form.education" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==3"
            label="学位"
            :rules="[{required:true, message: '学位不能为空', trigger: 'blur' }]"
            prop="degree"
          >
            <el-input v-model.trim="form.degree" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==3"
            label="英语水平"
             :rules="[{required:true, message: '英语水平不能为空', trigger: 'blur' }]"
            prop="englishLevel"
          >
            <el-input v-model.trim="form.englishLevel" ></el-input>
          </el-form-item>
           <!-- <el-form-item
           v-if="showState==3"
            label="其他语言"
            :rules="[{required:true, message: '其他语言不能为空', trigger: 'blur' }]"
            prop="otherLanguageLevel"
          >
            <el-input v-model.trim="form.otherLanguageLevel" ></el-input>
          </el-form-item> -->
           <el-form-item
           v-if="showState==3"
            label="其他语言"
            prop="otherLanguageLevel"
          >
            <el-input v-model.trim="form.otherLanguageLevel" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==3"
            label="认证证书"
            :rules="[{required:true, message: '认证证书不能为空', trigger: 'blur' }]"
            prop="certificate"
          >
            <el-input v-model.trim="form.certificate" ></el-input>
          </el-form-item>
           <el-form-item
           v-if="showState==3"
            label="培训经历"
            :rules="[{required:true, message: '培训经历不能为空', trigger: 'blur' }]"
            prop="trainingExperience"
          >
            <el-input resize='none' type="textarea" v-model.trim="form.trainingExperience" ></el-input>
          </el-form-item>
           <el-form-item
            v-if="showState==3&&$route.query.jobNum"
            label="备注"
            :rules="[{required:true, message: '备注不能为空', trigger: 'blur' },{max:20, message: '备注不超过20个字符'},
            {min:4, message: '备注最少4个字符'}]"
            prop="remark"
          >
            <el-input v-model.trim="form.remark" ></el-input>
          </el-form-item>
          <el-form-item
           v-if="showState==4"
            label="工作年限"
            :rules="[{required:true, message: '工作年限不能为空', trigger: 'blur' }]"
            prop="workAge"
          >
            <el-input v-model.trim="form.workAge" ></el-input>
          </el-form-item>
          <el-form-item
           v-if="showState==4"
            label="工作经验"
             :rules="[{required:true, message: '工作经验不能为空', trigger: 'blur' }]"
            prop="workExperience"
          >
            <el-input  resize='none' type="textarea"  v-model.trim="form.workExperience" ></el-input>
          </el-form-item>
          <el-form-item
           v-if="showState==4"
            label="项目经验"
            :rules="[{required:true, message: '项目经验不能为空', trigger: 'blur' }]"
            prop="projectExperience"
          >
            <el-input  resize='none' type="textarea"  v-model.trim="form.projectExperience" ></el-input>
          </el-form-item>
          <el-form-item
           v-if="showState==4"
            label="培训经历"
            :rules="[{required:true, message: '培训经历不能为空', trigger: 'blur' }]"
            prop="trainingExperience"
          >
            <el-input  resize='none' type="textarea"  v-model.trim="form.trainingExperience" ></el-input>
          </el-form-item>
           <el-form-item
            v-if="showState==4&&$route.query.jobNum"
            label="备注"
            :rules="[{required:true, message: '备注不能为空', trigger: 'blur' },{max:20, message: '备注不超过20个字符'},
            {min:4, message: '备注最少4个字符'}]"
            prop="remark"
          >
            <el-input v-model.trim="form.remark" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleModify(showState)">修 改</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import Vtable from '../../components/VTable/index'
import Cookies from 'js-cookie'
import axios from 'axios'
import { mapState} from 'vuex'


  export default {
    name: 'index',
    components:{
      Vtable
    },
    data() {
      return {
        btnLoading:false,
        dialogShow:false,
        userInfo:{},
        passInfo:{
          baseInfo:{},
          familyInfo:{},
          educationInfo:{},
          salaryInfo:{},
          workInfo:{}
        },
       form: {

       },
       showState:1,
       dataAdd:false
      }
    },
    methods:{
      handleChange(){
       
      },
      handleBeforeClose(done){
         if(this.$route.query.jobNum){
         this.getInfo(this.$route.query.jobNum)
        }else{
          if(Object.keys(this.userInfo)){
          this.getInfo(this.userInfo.jobNum)
          }else {
            this.$notify({
              title: '警告',
              message: '没有用户信息',
              type: 'warning'
            });
          }
        }
        done()
      },
      async postData(url,data){
        this.btnLoading=true
        try {
          let res = await this.$http.post(url,data)
          console.log(res.data)
              if(res.ok){
                setTimeout(()=>{
                   this.btnLoading=false
                },500)
                this.dialogShow=false
                this.form={}
                this.$notify({
                      title: '成功',
                      message: '修改成功',
                      type:'success'
                 });
              }
        }catch (e) {
          this.$notify({
            title: '警告',
            message: '提交失败',
            type: 'error'
          });
        }finally{
          this.btnLoading=false
        }
      },
      handleShow(state){
        this.showState=state
        this.dialogShow=true
        switch(state){
          case 1:
            this.form=this.passInfo.baseInfo
            break;
          case 2:
            this.form=this.passInfo.familyInfo
            this.dataAdd=Object.values(this.form).every(item=>item=='')?true:false
            break;
          case 3:
            this.form=this.passInfo.educationInfo
             this.dataAdd=Object.values(this.form).every(item=>item=='')?true:false
            break;
           case 4:
            this.form=this.passInfo.workInfo
            this.dataAdd=Object.values(this.form).every(item=>item=='')?true:false
            break;
        }
      },
      closeDialog(){
         if(this.$route.query.jobNum){
         this.getInfo(this.$route.query.jobNum)
      }else{
        if(Object.keys(this.userInfo)){
        this.getInfo(this.userInfo.jobNum)
        }else {
          this.$notify({
            title: '警告',
            message: '没有用户信息',
            type: 'warning'
          });
        }
      }
        this.from=''
        this.dialogShow=false
      },
      handleModify(state){
        this.$refs['modifyForm'].validate((valid) => {
          if (valid) {
            switch(state){
              case 1:
                this.postData('user/update',{
                  mobile:this.form.mobile,
                  qq:this.form.qq,
                  sex:this.form.sex,
                  wechat:this.form.wechat,
                  userId:this.form.userId,
                  skype:this.form.skype,
                  post:this.form.post,
                  englishName:this.form.englishName,
                  extension:this.form.extension,
                  email:this.form.email,
                  jobCategory:this.form.jobCategory,
                  remark:this.form.remark,
                })
                break;
              case 2:
                if(this.dataAdd){
                    this.postData('familySituation/add',{
                    place:this.form.place,
                    nativePlace:this.form.nativePlace,
                    mobile:this.form.mobile,
                    isMarry:this.form.isMarry,
                    emergencyContact:this.form.emergencyContact,
                    hasChild:this.form.hasChild,
                    jobNum:this.$route.query.jobNum?this.$route.query.jobNum:this.userInfo.jobNum,
                    remark:this.form.remark,
                  })
                }else{
                  this.postData('familySituation/update',{
                    place:this.form.place,
                    nativePlace:this.form.nativePlace,
                    mobile:this.form.mobile,
                    isMarry:this.form.isMarry,
                    emergencyContact:this.form.emergencyContact,
                    hasChild:this.form.hasChild,
                    id:this.form.id
                  })  
                }
                break;
              case 3:
                if(this.dataAdd){
                    this.postData('educationSituation/add',{
                    university:this.form.university,
                    trainingExperience:this.form.trainingExperience,
                    otherLanguageLevel:this.form.otherLanguageLevel,
                    major:this.form.major,
                    englishLevel:this.form.englishLevel,
                    education:this.form.education,
                    degree:this.form.degree,
                    certificate:this.form.certificate,
                    jobNum:this.$route.query.jobNum?this.$route.query.jobNum:this.userInfo.jobNum,
                     remark:this.form.remark,
                  })
                }else{
                  this.postData('educationSituation/update',{
                    university:this.form.university,
                    trainingExperience:this.form.trainingExperience,
                    otherLanguageLevel:this.form.otherLanguageLevel,
                    major:this.form.major,
                    englishLevel:this.form.englishLevel,
                    education:this.form.education,
                    degree:this.form.degree,
                    certificate:this.form.certificate,
                    id:this.form.id
                  })  
                }
                break;
              case 4:
                 if(this.dataAdd){
                    this.postData('workSituation/add',{
                    projectExperience:this.form.projectExperience,
                    trainingExperience:this.form.trainingExperience,
                    workExperience:this.form.workExperience,
                    workAge:this.form.workAge,
                    jobNum:this.$route.query.jobNum?this.$route.query.jobNum:this.userInfo.jobNum,
                    remark:this.form.remark,
                  })
                }else{
                  this.postData('workSituation/update',{
                    projectExperience:this.form.projectExperience,
                    trainingExperience:this.form.trainingExperience,
                    workExperience:this.form.workExperience,
                    workAge:this.form.workAge,
                    id:this.form.id
                  })  
                }
                break;
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      async getInfo(jobNum){
        let that=this

       
        let localFamilyInfo={
          emergencyContact:"",
          hasChild: '',
          isMarry: "",
          mobile: "",
          nativePlace: "",
          place: "",
          remark: "",
          
          }
        
        let localEducationInfo={
          "certificate": "",
          "degree": "",
          "education": "",
          "englishLevel": "",
          "major": "",
          "otherLanguageLevel": "",
          "remark": "",
          "trainingExperience": "",
          "university": "",
         
          }
          
        let localSalaryInfo={
          "accumulationFund": "",
          "actualRevisionDate": "",
          "bank": "",
          "bankCard": "",
          "fundBase": '',
          "joinDate": "",
          "leaveDate": "",
          "otherSubsidies":"",
          "paymentMethod": "",
          "plannedRevisionDate": "",
          "probationBasicSalary": "",
          "probationPerformanceSalary": "",
          "remark": "",
          "revisionBasicSalary": "",
          "revisionPerformanceSalary":"",
          "socialSecurity": "",
          "socialSecurityBase": "",
          "subbranch": "",
          "updateSalaryRecord": "",
        
          }
          
        let localWorkInfo={
            "projectExperience": "",
            "remark": "",
            "trainingExperience": "",
            "workAge": "",
            "workExperience": "",
         
          }

        axios.all([
          this.$http.get(`/user/jobNum/${jobNum}`),
          this.$http.get(`/familySituation/jobNum/${jobNum}`),
          this.$http.get(`/educationSituation/jobNum/${jobNum}`),
          this.$http.get(`/salary/jobNum/${jobNum}`),
          this.$http.get(`/workSituation/jobNum/${jobNum}`)
        ]).then(axios.spread(function (baseInfo, familyInfo,educationInfo,salaryInfo,workInfo) {
          that.passInfo={
            baseInfo:baseInfo.data,
            familyInfo:familyInfo.data?familyInfo.data:localFamilyInfo,
            educationInfo:educationInfo.data?educationInfo.data:localEducationInfo,
            salaryInfo:salaryInfo.data?salaryInfo.data:localSalaryInfo,
            workInfo:workInfo.data?workInfo.data:localWorkInfo
          }

        })).catch(e=>{
          this.$notify({
            title: '失败',
            message: '用户信息请求失败',
            type: 'error'
          });
        })
      }
    },
    mounted(){
      this.userInfo=JSON.parse(Cookies.get('userInfo'))
      console.log(this.$route)
      if(this.$route.query.jobNum){
         this.getInfo(this.$route.query.jobNum)
      }else{
        if(Object.keys(this.userInfo)){
        this.getInfo(this.userInfo.jobNum)
        }else {
          this.$notify({
            title: '警告',
            message: '没有用户信息',
            type: 'warning'
          });
        }
      }
    },
    computed:{
      // ...mapState({
      //   userInfo:state=>state.user.userInfo
      // })
    },
    watch:{
      $route(){
        console.log(this.$route.query.jobNum)
        if(!this.$route.query.jobNum){
          this.$router.go(0)
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.info-container{
  .grid-content{
    height: 45px;
    padding: 5px 5px;
    .info{
      &-sex{
        font-size: 10px;
      }
    }
    .title{
      font-size: 12px;
    }
  }
}


</style>

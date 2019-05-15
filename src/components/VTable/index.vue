<template>
  <div class="table-container" v-loading="loading">
      <div  class="table-row"  v-for="item,index in passInfo" v-if="index in user">
           <div class="table-l" >
                {{user[index]}}
            </div>
            <div class="table-r" v-if="user[index]==='性别'">
                {{item?'男':'女'}}
            </div>
            <div class="table-r" v-else-if="user[index]==='婚姻'||user[index]==='小孩'">
              {{item?'已有':'暂未'}}
            </div>
            <div class="table-r" v-else-if="user[index]==='岗位类别'">
              {{item?'业务岗':'非业务岗'}}
            </div>
            <div class="table-r" v-else>
              {{item}}
            </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'v-table',
  data(){
    return {
      loading:true,
      user:{
        userName:'用户名',
        trueName:'姓名',
        mobile:'手机',
        email:'个人邮箱',
        workMail:'工作邮箱',
        jobCategory:'岗位类别',
        sex:'性别',
        post:'职位',
        qq:'QQ',
        wechat:'微信',
        remark:'备注',
        university:'毕业院校',
        major:'专业',
        education:'学历',
        degree:'学位',
        englishLevel:'英语水平',
        otherLanguageLevel:'其他语言',
        certificate:'认证证书',
        workAge:'工作年限',
        englishName:"英文名",
        skype:'SKYPE',
        extension:'分机号',
        workExperience:'工作经验',
        projectExperience:'项目经验',
        trainingExperience:'培训经历',
        nativePlace:'籍贯',
        place:'现住地',
        isMarry:'婚姻',
        hasChild:'小孩',
        emergencyContact:'紧急联系人',
        bankCard:'银行卡号 ',
        subbranch:'支行 ',
        jobNum :'工号',
        joinDate:'入职日期 ',
        leaveDate:'离职日期 ',
        actualRevisionDate:'实际转正日期 ',
        // accumulationFund:'公积金编号',
        paymentMethod:'薪资发放方式',
        plannedRevisionDate:'计划转正日期 ',
        // probationBasicSalary:'试用期基本薪资',
        // probationPerformanceSalary:'试用期绩效薪资',
        // revisionBasicSalary:'转正后基本薪资',
        // revisionPerformanceSalary:'转正后绩效薪资 ',
        // socialSecurity:'社保编号 ',
        // socialSecurityBase:'社保基数 '
      }
    }
  },
  props: {
    passInfo:Object
  },
  computed: {

  },
  mounted(){
  },
  watch:{
    passInfo(newval,oldval){
      if(Object.keys(newval).length){
        this.loading=false
      }
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-container{
    .table-row{
        display: flex;
        flex-direction: row;
        width: 400px;
        border: 1px solid #ebeef5;
      border-radius: 2px;
        min-height: 40px;
        line-height: 40px;
        text-align: center;
        .table-l{
          width: 150px;
          border-right: 1px solid #ebeef5;
          font-weight: bolder;
        }
        .table-r{
           width: 250px;
           word-break: break-all;
          // background-color: #d3dce6;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        }
    }
}
</style>

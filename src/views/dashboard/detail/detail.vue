<template>
    <div class="detail-layout" v-loading="loadingShow" >
      <div class="detail-container" v-if="!loadingShow">
          <el-row style="text-align: center;line-height: 60px;
    font-size: 36px;">
                员工{{this.$route.query.type}}
          </el-row>
    <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">标题</el-col>
          <el-col
            class="apply-title-content"
            :span="20"
          >
            <span style="float:right">{{detail.title}}</span>
           </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">流程编号</el-col>
          <el-col class="apply-title-content" :span="20">
            <span style="float:right">
            {{detail.processId||'&nbsp;'}}
            </span>
            </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">申请日期</el-col>
          <el-col class="apply-title-content" :span="20"> <span style="float:right">{{detail.createdTime}}</span></el-col>
        </el-row>
        
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">项目组</el-col>
          <el-col
            class="apply-title-content"
            :span="20"
          >
          <span style="float:right"> {{detail.projectTeam==null?'&nbsp;':ddetail.projectTeam}}</span>
          </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">请假人</el-col>
          <el-col class="apply-title-content" :span="20">
             <span style="float:right"> {{this.$route.query.applicant}}</span>
            </el-col>
        </el-row>
       <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">联系方式</el-col>
          <el-col
            class="apply-title-content"
            :span="20"
          >
          <span style="float:right"> {{detail.phone}}</span>
          </el-col>
        </el-row>
         <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">部门</el-col>
          <el-col
            class="apply-title-content"
            :span="20"
          >
          <span style="float:right"> {{detail.deptName}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col class="apply-title-label" :span="4">{{this.$route.query.type=='请假申请'?'请假说明':'申请说明'}}</el-col>
          <el-col class="apply-title-content" :span="20">
            <div>
              <el-input
                :disabled="true"
                class="textarea-input"
                type="textarea"
                :rows="3"
                width="100%"
                placeholder="请输入内容"
                v-model="detail.message"
                resize="none"
              >
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="this.$route.query.type=='请假申请'" >
          <el-table
            :data="detail.list"
            style="width: 100%;margin: 20px 0"
            border
          >
            <el-table-column
              prop="leaveType"
              label="假别"
              min-width="130"
            >
            </el-table-column>
            <el-table-column
              prop="beginDate"
              label="开始日期"
              width="250"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="true"
                  size="small"
                  v-model="scope.row.beginDate"
                  type="date"
                  placeholder="选择日期时间">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="结束日期"
              width="250"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="true"
                  size="small"
                  v-model="scope.row.endDate"
                  @change="handleRowEnd(scope.row)"
                  type="date"
                  placeholder="选择日期时间">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="availableTime"
              label="请假时长(小时)"
              width="200"
            >
              <template slot-scope="scope">
                <el-input  :disabled="true" size="small"  v-model="scope.row.availableTime" maxlength="3"
                          minlength="1" placeholder="工时"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div :style="{
            display:this.$route.query.nowTab=='已办事宜'||this.$route.query.nowTab=='已归档'?'none':'block'
        }
          ">
          <div v-if="this.$route.query.nowTab=='待办事宜'">
            
            <el-row class="col-height-100"  v-show="roleId!=32"  style="margin: 40px 0">
                <el-col :span="4">审批回复</el-col>
                  <el-col :span="20">
                    <div >
                      <el-input
                        class="textarea-input"
                        type="textarea"
                        :rows="3"
                        width="80%"
                        placeholder="不输入则默认内容为同意"
                        v-model="replay"
                        resize="none"
                      >
                      </el-input>
                    </div>
                </el-col>
             </el-row>
            <el-row class="col-height-40" v-show="roleId!=32">
              <div style="text-align: center" >
              
                <el-button type="danger" @click="handleAsset">驳回</el-button>
                  <el-button  @click="handleArgee">同意</el-button>
              </div>
            </el-row>
            <el-row class="col-height-40" >
              <div style="text-align: center">
                <el-button  @click="hrHandle"  v-show="roleId=='32'">确认</el-button>
              </div>
            </el-row>

         </div>
      
        <div v-else>
        
          <el-row class="col-height-40" >
            <div style="text-align: center;">
               <el-button v-if="this.$route.query.processState==2||this.$route.query.nowTab=='被驳回'"  @click="handleModify('exit')">修改</el-button>
               <el-button   v-else-if="this.$route.query.state==3||this.$route.query.state==5"  @click="handleModify('exit')">修改</el-button>
              <el-button type="danger" v-if="(this.$route.query.nowTab=='审批中'||this.$route.query.processState!==3)&&this.$route.query.state!=7" @click="handleCanlce" >撤回</el-button>
            </div>
          </el-row>
        </div>
        </div>
     
        
        <el-row v-for="(item ,index) in processList" :key="index" style=" border-bottom: 1px solid #e3e3e3;">
          <el-col :span="12">
            <div class="person-info">
              <div class="person-info-img">
                <img v-if="imgSrc" :src="imgSrc" alt="">
                <i v-else style="font-size: 50px" class="iconfont icon-mine_fill"></i>
              </div>
              <div class="person-info-name" >
                <div>
                     <p style="margin: 5px 0">{{item.tureName}}</p>
                      <p style="margin: 5px 0;width:600px">
                        <span style="width:120px;display:inline-block">{{item.deptName}}</span>
                       <span style="margin-left:10px"></span>
                       <span style="color:royalblue" v-if="item.comment">审批意见:{{item.comment}}</span>
                    </p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6" :offset="6">
            <div class="process-info">
              <div>
                <p>{{item.createdTime.slice(0,10)}}</p>
                <p>[{{item.nodeState}}]</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
  import cookies from 'js-cookie'
  export default {
    name: 'detail',

    data(){
      return {
        roleId:'',
        replay:'',
        userInfo:'',
       parseLeaveType:{
          1:"年假",
          2:"事假",
          3:"病假",
          4:"婚假",
          5:"产假",
          6:"加班调休",
          7:"司龄假",
          8:"项目假",
          9:"陪产假"
        },
        loadingShow:false,
        imgSrc:'',
        textarea:'',
        LeaveTable:[],
        processList:[],
        detail:'',
        deptInfo:''
      }
    },
    methods:{
      //hr submit
      hrHandle(){
         this.postDetail('oaLeave/approval',{
              "auditState": 1,
              "id":this.$route.query.applyId,
              "message": this.replay?this.replay:'同意',
              "processId": this.$route.query.processId,
              "taskId": this.$route.query.taskId,
              "hours":this.detail.hours
          })
      },
      //modify  leaveItem
      handleModify(val){
        console.log(this.$route.query)
          this.$router.push({path:'/leaveAdmin/employeeLeave',query:{
            state:'serach',
            applyId:this.$route.query.applyId,
            processId:this.$route.query.processId
          }})
      },
      //处理撤回
      handleCanlce(){
        this.$confirm( '此申请将撤回至草稿箱, 是否继续?' , '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let data = {
					id:this.$route.query.applyId,
					processId:this.$route.query.processId,
        }
        console.log(1)
				this.$http.post('oaLeave/callBack',data).then(res => {
					this.$notify({
            title: '成功',
            message: '撤回成功',
            type: 'success'
					});
					this.$router.go(-1)
				})
			}).catch(() => {});
      },
      //处理同意
      handleArgee(){
        switch (this.$route.query.type) {
          case '请假申请':
            this.postDetail('oaLeave/approval',{
              "auditState": 1,
              "id":this.$route.query.applyId,
              "message": this.replay?this.replay:'同意',
              "processId": this.$route.query.processId,
              "taskId": this.$route.query.taskId,
              "hours":this.detail.hours
            })
            break
        }
      },
      //处理驳回
      handleAsset(){
        if(this.replay){
          switch (this.$route.query.type) {
          case '请假申请':
            this.postDetail('oaLeave/approval',{
              "auditState": 0,
              "id":this.$route.query.applyId,
              "message": this.replay?this.replay:'同意',
              "processId": this.$route.query.processId,
              "taskId": this.$route.query.taskId,
              "hours":this.detail.hours
            })
            break
         }
        }else{
            this.$notify({
              title: '错误',
              message: '请说明驳回原因',
              type: 'error'
            });
        }
        
      },
      //获取请假流程
      async initDetail(){
        this.loadingShow=true
        try {
          let res =await this.$http.get(`task/list/${this.$route.query.processId}`)
          this.processList = res.data
        }catch (e) {
            this.$notify({
              title: '错误',
              message: '请求失败',
              type: 'error'
            });
        }
      },
      //请假单详情
      async getLeaveDetail(){
        try {
          let res =await this.$http.get(`oaLeave/${this.$route.query.applyId}`)
          this.detail=res.data
          console.log(this.detail)
          console.log(this.$route.query.nowTab=='frist'&&(this.detail.state==4||this.detail.state==2))
          this.detail.list.forEach(item=>{
          return item.leaveType=this.parseLeaveType[item.leaveType]
        })
        }catch (e) {
          this.$notify({
            title: '错误',
            message: '请求失败',
            type: 'error'
          });
        }
      },
      //获取用户项目组
      async getUserDept(){
        try {
          let res =await this.$http.get(`dept/${JSON.parse(cookies.get('userInfo')).userId}/detail`)
          this.deptInfo =res.data
          this.loadingShow=false
        }catch (e) {
          this.$notify({
            title: '错误',
            message: '请求失败',
            type: 'error'
          });
        }
      },
      async postDetail(url,data){
        try {
          let res =await this.$http.post(url,data)
          this.$notify({
            title: '成功',
            message: '审批成功',
            type: 'success'
          });
          this.$router.go(-1)
        }catch (e) {
          this.$notify({
            title: '错误',
            message: '请求失败',
            type: 'error'
          });
        }
      }
    },
    async mounted(){
      this.userInfo = JSON.parse(cookies.get('userInfo'))
      let res= await this.$http.get(`user/${this.userInfo.userId}/roles`)
      this.roleId=res.data[0].roleId
      console.log(this.roleId)
      this.initDetail()
      // this.getAssetsDetail()
      this.getLeaveDetail()
      this.getUserDept()
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .detail-layout{
   
    padding-top: 20px;
   
    .detail-container{
     box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
      padding: 10px;
      width: 1000px;
      min-width: 1000px;
      margin: 50px auto;
      background-color: #fff;
      .person-info{
        padding: 10px 0;
        display: flex;
        align-items: center;
        flex-direction: row;
        &-img{
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &-name{
          flex: 5;
          p{
            margin: 5px;
          }
        }
      }
      .process-info{
        height: 95px;
        padding: 10px 0;
        text-align: center;
        display: flex;
        align-items: center;
        p{
          margin: 5px;
        }
      }
    }
  }

</style>

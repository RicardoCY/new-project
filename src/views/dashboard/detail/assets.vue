<template>
  <div class="detail-layout">
    <div class="detail-container">
       <el-row style="text-align: center;line-height: 60px;
    font-size: 36px;">
                {{title}}
          </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">标题</el-col>
          <el-col class="apply-title-content" :span="20">
            <span style="float:right">{{assetDetail.title}}</span>
          </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">流程编号</el-col>
          <el-col class="apply-title-content" :span="20">
            <span style="float:right">{{assetDetail.processId||'&nbsp;'}}</span>
          </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">申请日期</el-col>
          <el-col class="apply-title-content" :span="20">
            <span style="float:right">{{assetDetail.createdTime}}</span>
          </el-col>
        </el-row>

        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">项目组</el-col>
          <el-col class="apply-title-content" :span="20">
            <span
              style="float:right"
            >{{assetDetail.projectTeam==null?'&nbsp;':assetDetail.projectTeam}}</span>
          </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">请假人</el-col>
          <el-col class="apply-title-content" :span="20">
            <span style="float:right">{{assetDetail.applicant}}</span>
          </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">联系方式</el-col>
          <el-col class="apply-title-content" :span="20">
            <span style="float:right">{{assetDetail.phone}}</span>
          </el-col>
        </el-row>
        <el-row class="col-height-40">
          <el-col class="apply-title-label" :span="4">部门</el-col>
          <el-col class="apply-title-content" :span="20">
            <span style="float:right">{{assetDetail.deptName}}</span>
          </el-col>
        </el-row>

        <el-container class="asstes-detail-table">
          <el-header style="height:10px"></el-header>
          <el-table :data="assetDetail.list" empty-text="暂无数据" border>
            <el-table-column v-if="title != '资产入库'" prop="assetId" label="资产编号" min-width="1"></el-table-column>
            <el-table-column prop="assetName" label="资产名称" min-width="1"></el-table-column>
            <el-table-column label="资产类型" min-width="1">
              <template
                slot-scope="scope"
              >{{typeOptions.filter(item => item.value == scope.row.assetType)[0].label}}</template>
            </el-table-column>
            <el-table-column v-if="title == '资产入库'" label="入库时间" min-width="2">
              <template
                slot-scope="scope"
              >{{scope.row.addTime.substring(0,10)+' '+scope.row.addTime.substring(11,19)}}</template>
            </el-table-column>
            <el-table-column v-if="title == '资产入库'" prop="serialNum" label="资产序列号" min-width="1"></el-table-column>
            <el-table-column v-if="title == '资产入库'" prop="orderId" label="采购编号/订单编号" min-width="2"></el-table-column>
            <el-table-column v-if="title == '资产入库'" prop="price" label="购买价格" min-width="1">
              <template slot-scope="scope">{{Number(scope.row.price).toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="资产描述" min-width="3"></el-table-column>
          </el-table>

          <el-row height="auto" v-if="processType == '待办事宜'">
            <el-row
              class="col-height-100"
              type="flex"
              justify="center"
              v-if="rejectFlag"
              style="margin:40px 0;"
            >
              <el-col :span="4">审批意见:</el-col>
              <el-col :span="20">
                <el-input
                  type="textarea"
                  resize="none"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="message"
                ></el-input>
              </el-col>
            </el-row>
            <el-row class="col-height-40" style="text-align:center">
              <el-button type="danger" @click="Approval(0)">驳回</el-button>
              <el-button @click="Approval(1)">{{rejectFlag?'同意':'确认'}}</el-button>
            </el-row>
          </el-row>
          <el-footer height="auto" v-if="processType == '我的请求'">
            <el-row class="col-height-40" type="flex" justify="center">
              <el-col :span="3" v-if="updateBtn">
                <el-button @click="assetReject">修改</el-button>
              </el-col>
              <el-col :span="3" v-if="callBackBtn">
                <el-button type="danger" @click="assetCallBack">撤回</el-button>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>
        <!-- <el-row class="task-data-item" v-for="item in taskData" :key="item.id">
					<el-col :span="4">
						<p>{{item.nodeName + ' :'}}</p>
						<p>所在部门 :</p>
					</el-col>
					<el-col :span="6">
						<p>{{item.tureName}}</p>
						<p>{{item.deptName}}</p>
					</el-col>
					<el-col :span="2">
						<p>{{item.comment?'审批意见 :':'&nbsp;'}}</p>
					</el-col>
					<el-col :span="8">
						<p>{{item.comment?item.comment:'&nbsp;'}}</p>
					</el-col>
					<el-col :span="4">
						<p style="text-align:right">{{item.nodeState}}</p>
						<p style="text-align:right">{{item.createdTime.substring(0,10)+' '+item.createdTime.substring(11,19)}}</p>
					</el-col>
        </el-row>-->

        <el-row
          v-for="(item ,index) in taskData"
          :key="index"
          style=" border-bottom: 1px solid #e3e3e3;"
        >
          <el-col :span="12">
            <div class="person-info">
              <div class="person-info-img">
                <img v-if="imgSrc" :src="imgSrc" alt>
                <i v-else style="font-size: 50px" class="iconfont icon-mine_fill"></i>
              </div>
              <div class="person-info-name">
                <div>
                  <p style="margin: 5px 0">{{item.tureName}}</p>
                  <p style="margin: 5px 0;width:600px">
                    <span style="width:120px;display:inline-block">{{item.nodeName}}</span>
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
import "@/styles/Dashboard/assetsDetail.scss";

export default {
  name: "asstes",
  data() {
    return {
      imgSrc: "",
      processType: "",
      state: 0,
      title: "",
      applyId: null,
      taskId: null,
      assetDetail: {},
      typeOptions: [
        { value: 0, label: "未知" },
        { value: 11, label: "电子设备" },
        { value: 12, label: "易耗品" },
        { value: 20, label: "家具/工具/器具" },
        { value: 30, label: "机械设备" },
        { value: 40, label: "房屋建筑" },
        { value: 50, label: "运输工具" },
        { value: 60, label: "其他" }
      ],
      message: "",
      taskData: [],
      updateBtn: false,
      callBackBtn: true,
      rejectFlag: false
    };
  },
  mounted() {
    //console.log(this.$route.query)
    this.processType = this.$route.query.processType;
    this.state = this.$route.query.state;
    this.title = this.$route.query.title;
    this.applyId = this.$route.query.applyId;
    this.taskId = this.$route.query.taskId;
    this.getAssetDetail();
  },
  methods: {
    //同意/驳回按钮
    Approval(val) {
      let data = {
        auditState: val,
        id: this.applyId,
        message: "",
        processId: this.assetDetail.processId,
        taskId: this.taskId
      };
      let url = "";
      if (val == 1 || this.message) {
        data.message = this.message ? this.message : "审批通过";
        if (this.title == "资产入库") {
          url = "/assetAdd/inspectorApproval";
        }
        if (this.title == "资产领用") {
          url = "/assetUse/approval";
        }
        if (this.title == "资产借用") {
          url = "/assetBorrow/approval";
        }
        if (this.title == "资产归还") {
          url = "/assetReturn/approval";
        }
        if (this.title == "资产维修") {
          url = "/assetRepair/approval";
        }
        // console.log(data)
        // console.log(url)
        this.$http.post(url, data).then(res => {
          this.$notify({
            title: "成功",
            message: "审批成功",
            type: "success"
          });
          this.$router.go(-1);
        });
      } else {
        this.$message({
          message: "驳回必须填写驳回原因",
          type: "warning"
        });
      }
    },
    //撤回按钮
    assetCallBack() {
      this.$confirm("此申请将撤回至草稿箱, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "";
          if (this.title == "资产入库") {
            url = "/assetAdd/callBack";
          }
          if (this.title == "资产领用") {
            url = "/assetUse/callBack";
          }
          if (this.title == "资产借用") {
            url = "/assetBorrow/callBack";
          }
          if (this.title == "资产归还") {
            url = "/assetReturn/callBack";
          }
          if (this.title == "资产维修") {
            url = "/assetRepair/callBack";
          }
          let data = {
            id: this.assetDetail.id,
            processId: this.assetDetail.processId
          };
          this.$http.post(url, data).then(res => {
            this.$notify({
              title: "成功",
              message: "撤回成功",
              type: "success"
            });
            this.$router.go(-1);
          });
        })
        .catch(() => {});
    },
    //被驳回详情修改按钮
    assetReject() {
      //console.log(this.assetDetail)
      let data = {
        state: "驳回修改",
        applyId: this.assetDetail.id,
        processId: this.assetDetail.processId
      };
      let url = "";
      if (this.title == "资产入库") {
        url = "/assets/index";
      }
      if (this.title == "资产领用") {
        url = "/assets/grant";
      }
      if (this.title == "资产借用") {
        url = "/assets/borrow";
      }
      if (this.title == "资产归还") {
        url = "/assets/return";
      }
      if (this.title == "资产维修") {
        url = "/assets/Repair";
      }
      this.$router.push({ path: url, query: data });
    },
    //获取资产操作申请详情
    getAssetDetail() {
      this.$http
        .get(`/asset/${this.applyId}/info`)
        .then(res => {
          this.assetDetail = res.data;
          console.log(this.assetDetail);
          if (this.state == 2) {
            this.updateBtn = true;
          }
          if (this.title == "资产入库" && this.assetDetail.state == 4) {
            this.callBackBtn = false;
          }
          if (this.title == "资产领用" && this.assetDetail.state == 5) {
            this.callBackBtn = false;
          }
          if (this.title == "资产借用" && this.assetDetail.state == 5) {
            this.callBackBtn = false;
          }
          if (this.title == "资产归还" && this.assetDetail.state == 4) {
            this.callBackBtn = false;
          }
          if (this.title == "资产维修" && this.assetDetail.state == 6) {
            this.callBackBtn = false;
          }
        })
        .then(res => {
          if (this.assetDetail.processId) {
            this.getTaskData();
          }
        });
    },
    //获取资产操作节点信息
    getTaskData() {
      this.$http.get(`/task/list/${this.assetDetail.processId}`).then(res => {
        this.taskData = res.data;
        if (this.taskData[this.taskData.length - 1].nodeState == "提交") {
          this.rejectFlag = true;
        } else {
          this.rejectFlag = false;
        }
        //console.log(this.taskData)
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.person-info {
  padding: 10px 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  &-img {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-name {
    flex: 5;
    p {
      margin: 5px;
    }
  }
}

.process-info {
  height: 95px;
  padding: 10px 0;
  text-align: center;
  display: flex;
  align-items: center;
  p {
    margin: 5px;
  }
}

.detail-layout {
  
  height: 145%;
  padding-top: 20px;
}
.detail-container {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  padding: 10px;
  width: 1000px;
  min-width: 1000px;
  margin: 50px auto;
  background-color: #fff;
}
</style>

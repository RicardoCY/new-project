<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside">
        <div class="employee-container">
          <el-row>
            <h3 style="font-size:24px;">请假流程</h3>
          </el-row>
          <el-row>
            <el-col :span="24" style="padding-right:10px">
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">标题</el-col>
                <el-col class="apply-title-content" :span="20">
                  <span style="float:right">员工请假-{{cookieInfo.trueName}}-{{formatTitle}}</span>
                </el-col>
              </el-row>
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">流程编号</el-col>
                <el-col class="apply-title-content" :span="20">&nbsp;</el-col>
              </el-row>
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">申请日期</el-col>
                <el-col class="apply-title-content" :span="20">
                  <span style="float:right">{{ new Date().toLocaleString()}}</span>
                </el-col>
              </el-row>
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">项目组</el-col>
                <el-col class="apply-title-content" :span="20">
                  <span style="float:right">{{deptInfo.parent==null?'&nbsp;':deptInfo.deptName}}</span>
                </el-col>
              </el-row>
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">请假人</el-col>
                <el-col class="apply-title-content" :span="20">
                  <span style="float:right">{{cookieInfo.trueName}}</span>
                </el-col>
              </el-row>
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">联系方式</el-col>
                <el-col :span="20">
                  <span style="float:right;display:flex;align-items:center;height:65px">
                    <i
                      class="el-icon-edit-outline"
                      v-if="modifyMobile"
                      type="success"
                      @click="modifyMobile =false"
                      style="color:rgba(58,132,255,1);font-size:20px;"
                    ></i>
                    <i
                      class="el-icon-check"
                      v-if="!modifyMobile"
                      @click="SaveNum"
                      style="color:rgba(58,132,255,1);font-size:20px;"
                    ></i>
                  </span>
                  <span style="padding-left: 10px;float:right">
                    <el-input
                      style="width: 200px"
                      v-model.trim="cookieInfo.mobile"
                      :disabled="modifyMobile"
                    ></el-input>
                  </span>
                </el-col>
              </el-row>
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">部门</el-col>
                <el-col class="apply-title-content" :span="20">
                  <span style="float:right">{{deptInfo.deptName||'&nbsp'}}</span>
                </el-col>
              </el-row>
              <el-row class="col-height-120">
                <el-col class="apply-title-label" :span="4">
                  <i style="color:red">*</i>
                  请假说明
                </el-col>
                <el-col class="apply-title-content" :span="20">
                  <div>
                    <el-input
                      class="textarea-input"
                      type="textarea"
                      :rows="3"
                      width="80%"
                      placeholder="请输入内容(提交必填)"
                      v-model.trim="textarea"
                      resize="none"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-table height="300" :data="tableData" style="width:100%;margin-top:40px;" border>
            <el-table-column prop="leaveType" label="假别" width="100">
              <template slot-scope="scope">
                <span>{{parseLeaveType[scope.row.leaveType]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalTime" label="定额(小时)" min-width="120"></el-table-column>
            <el-table-column prop="availableTime" label="可用定额(小时)" min-width="120"></el-table-column>
            <el-table-column prop="beginDate" label="有效期开始">
              <template slot-scope="scope">
                <span>{{ scope.row.beginDate.slice(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="endDate" label="有效期结束">
              <template slot-scope="scope">
                <span>{{ scope.row.endDate.slice(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="disable" label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :disabled="scope.row.disable"
                  @click="handleNew(scope.row,scope.$index)"
                >使用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-table :data="LeaveTable" style="width: 100%;margin-top:24px;" border>
              <el-table-column prop="leaveType" label="假别" width="130">
                <template slot-scope="scope">
                  <span>{{parseLeaveType[scope.row.leaveType]}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="beginDate" label="开始日期" min-width="250">
                <!--:picker-options="pickerOptions1"-->
                <template slot-scope="scope">
                  <el-date-picker
                    size="small"
                    v-model="scope.row.beginDate"
                    type="date"
                    @change="handleRowStart(scope.row)"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="endDate" label="结束日期" min-width="250">
                <!--:picker-options="pickerOptions1"-->
                <template slot-scope="scope">
                  <el-date-picker
                    size="small"
                    v-model="scope.row.endDate"
                    @change="handleRowEnd(scope.row)"
                    type="date"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="availableTime" label="请假时长(小时)" width="200">
                <template slot-scope="scope">
                  <el-input
                    size="small"
                    @input.native="handleTime(scope.row)"
                    v-model="scope.row.availableTime"
                    maxlength="3"
                    minlength="1"
                    placeholder="工时"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleDelete(scope.row)">撤回</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <div style="display:flex;" class="el-row-marginTop">
            <div>
              <p
                style="font-size:14px;
font-family:PingFangSC-Regular;
font-weight:400;
color:rgba(58,132,255,1);"
              >备注：</p>
            </div>
            <div
              style="font-size:14px;
font-family:PingFangSC-Regular;
font-weight:400;
color:rgba(58,132,255,1);
margin-left:20px;
"
            >
              <p>1 请在有效时间范围内做申请</p>
              <p>2 项目假为特殊员工持有，误申请会作为事假处理</p>
              <p>3 病假超过3天，请联系hr</p>
            </div>
          </div>
          <el-row
            class="el-row-marginTop"
            style="text-align: center"
            v-show="!this.$route.query.state"
          >
            <el-button
              class="btn-width btn-160"
              @click="onSave"
              :loading="btnLoading1"
            >{{btnLoading1?'.':'保存'}}</el-button>
            <el-button
              class="btn-width btn-160"
              type="primary"
              @click="onSubmit"
              :loading="btnLoading1"
            >{{btnLoading1?'.':'提交'}}</el-button>
          </el-row>
          <el-row
            class="el-row-marginTop"
            style="text-align: center"
            v-show="this.$route.query.state=='darf'"
          >
            <el-button
              class="btn-width btn-160"
              @click="onSave"
              :loading="btnLoading1"
            >{{btnLoading1?'.':'保存'}}</el-button>
            <el-button
              class="btn-width btn-160"
              type="primary"
              @click="onDaftSubmit"
              :loading="btnLoading1"
            >{{btnLoading1?'.':'提交'}}</el-button>
          </el-row>
          <el-row
            class="el-row-marginTop"
            style="text-align: center"
            v-show="this.$route.query.state=='serach'"
          >
            <el-button
              class="btn-width btn-160"
              type="primary"
              @click="onExitSubmit"
              :loading="btnLoading1"
            >{{btnLoading1?'.':'提交'}}</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";

export default {
  name: "employeeLeave",
  data() {
    return {
      formatTitle: "",
      btnLoading1: false,
      btnLoading2: false,
      deptInfo: "",
      cookieInfo: "",
      tableData: [],
      textarea: "",
      LeaveTable: [],
      modifyMobile: true,
      parseLeaveType: {
        1: "年假",
        2: "事假",
        3: "病假",
        4: "婚假",
        5: "产假",
        6: "加班调休",
        7: "司龄假",
        8: "项目假",
        9: "陪产假"
      }
    };
  },
  methods: {
    async postData(type = 2, list = []) {
      type == 2 ? (this.btnLoading1 = true) : (this.btnLoading2 = true);
      try {
        let res = await this.$http.post(`oaLeave/submit`, {
          applicant: this.cookieInfo.trueName,
          list: list,
          applicant: this.cookieInfo.trueName,
          deptName: this.deptInfo.deptName,
          message: this.textarea,
          phone: this.cookieInfo.mobile,
          title: `员工请假流程-${
            this.cookieInfo.trueName
          }-${new Date().toLocaleString().replace(" ", "")}`,
          state: type
        });
        if (res.data) {
          setTimeout(() => {
            type == 2 ? (this.btnLoading1 = false) : (this.btnLoading2 = false);
          }, 500);

          this.LeaveTable = [];
          console.log(this.LeaveTable);
          this.textarea = "";
          this.fetchData();
          this.$notify({
            title: "成功",
            message: "请求成功",
            type: "success"
          });
        }
      } catch (e) {
        this.$notify({
          title: "警告",
          message: "提交失败",
          type: "error"
        });
      } finally {
        this.btnLoading1 = false;
      }
    },
    onExitSubmit() {
      console.log("驳回提交");
      let remark = this.textarea.length > 0 && this.textarea.length < 25;
      let allPass = this.LeaveTable.every(item => {
        return Object.values(item).every(i => i !== "");
      });
      console.log(this.LeaveTable);
      if (this.LeaveTable.length && allPass && remark) {
        this.$http
          .post("oaLeave/reject/submit", {
            id: this.$route.query.applyId,
            list: this.LeaveTable,
            processId: this.$route.query.processId,
            message: this.textarea,
            phone: this.cookieInfo.mobile
          })
          .then(res => {
            console.log(res.ok == false);
            if (res.ok !== false) {
              this.$router.go(-2);
            }
          })
          .catch(e => {});
      } else {
        this.$notify({
          title: "警告",
          message: "请先添加并完善信息",
          type: "error"
        });
      }
    },
    //草稿箱提交
    onDaftSubmit() {
      console.log("草稿提交");
      let remark = this.textarea.length > 0 && this.textarea.length < 25;
      let allPass = this.LeaveTable.every(item => {
        return Object.values(item).every(i => i !== "");
      });
      console.log(this.LeaveTable);
      this.LeaveTable = this.LeaveTable.filter(item => {
        return (item.beginDate = new Date(item.beginDate));
      }).filter(i => (i.endDate = new Date(i.endDate)));
      if (this.LeaveTable.length && allPass && remark) {
        this.$http
          .post("oaLeave/submit", {
            id: this.$route.query.applyId,
            list: this.LeaveTable,
            applicant: this.cookieInfo.trueName,
            deptName: this.deptInfo.deptName,
            message: this.textarea,
            phone: this.cookieInfo.mobile,
            title: `员工请假流程-${
              this.cookieInfo.trueName
            }-${new Date().toLocaleString().replace(" ", "")}`
          })
          .then(res => {
            console.log(res.ok == false);
            if (res.ok !== false) {
              this.$router.go(-1);
            }
          })
          .catch(e => {});
      } else {
        this.$notify({
          title: "警告",
          message: "请先添加并完善信息",
          type: "error"
        });
      }
    },
    //提交
    async onSubmit() {
      let remark = this.textarea.length > 0 && this.textarea.length < 25;
      let allPass = this.LeaveTable.every(item => {
        return Object.values(item).every(i => i !== "");
      });
      console.log("allPass " + allPass);
      if (this.LeaveTable.length && allPass && remark) {
        this.postData(2, this.LeaveTable);
      } else {
        this.$notify({
          title: "警告",
          message: "请先添加并完善信息",
          type: "error"
        });
      }
    },
    onSave() {
      let remark = this.textarea.length > 0 && this.textarea.length < 25;
      console.log(this.LeaveTable);
      let allPass = this.LeaveTable.every(item => {
        return (
          Array.from(new Set(Object.values(item))).filter(item => item != "")
            .length >= 5
        );
      });
      console.log(this.LeaveTable);
      if (this.LeaveTable.length && allPass && remark) {
        //  this.postData(1,this.LeaveTable)
        this.LeaveTable = this.LeaveTable.filter(item => {
          return (item.beginDate = new Date(item.beginDate));
        }).filter(i => (i.endDate = new Date(i.endDate)));

        let data = {
          applicant: this.cookieInfo.trueName,
          list: this.LeaveTable,
          deptName: this.deptInfo.deptName,
          message: this.textarea,
          phone: this.cookieInfo.mobile,
          title: `员工请假流程-${
            this.cookieInfo.trueName
          }-${new Date().toLocaleString().replace(" ", "")}`
        };
        this.$route.query.applyId
          ? (data["id"] = this.$route.query.applyId)
          : data;
        this.$http.post("oaLeave/save", data);
        this.$router.go(-1);
      } else {
        this.$notify({
          title: "警告",
          message: "请先添加并完善信息",
          type: "error"
        });
      }
    },
    handleDelete(val) {
      //处理delete
      this.LeaveTable = this.LeaveTable.filter(item => {
        return item.id !== val.id;
      });
      console.log(val.useId);
      if (val.useId) {
        this.tableData.forEach(item => {
          return item.id === val.useId ? (item.disable = false) : item.disable;
        });
      } else {
        this.tableData.forEach(item => {
          return item.id === val.id ? (item.disable = false) : item.disable;
        });
      }
    },
    //添加假别
    handleNew(val, index) {
      val.disable = true;
      this.LeaveTable.push({
        leaveType: val.leaveType,
        id: val.id,
        beginDate: "",
        endDate: "",
        availableTime: ""
      });
      console.log(this.LeaveTable);
    },
    handleTime(val) {
      //处理工时输入
      this.$nextTick(() => {
        val.availableTime = val.availableTime.replace(/^(0+)|[^\d]+/g, "");
      });
    },
    //处理时间选择
    handleRowStart(val) {
      let start = val.beginDate;
      if (!start) {
        this.$notify({
          title: "警告",
          message: "请输入开始时间",
          type: "warning"
        });
      }
    },
    //处理时间选择
    handleRowEnd(val) {
      let end = val.endDate,
        start = val.beginDate;
      if (start && end) {
        console.log("suc");
        if (end.getTime() < start.getTime()) {
          this.$notify({
            title: "警告",
            message: "结束时间必须大于开始时间",
            type: "warning"
          });
          val.endDate = "";
        }
      } else {
        this.$notify({
          title: "警告",
          message: "请输入时间",
          type: "warning"
        });
        val.endDate = "";
        return false;
      }
    },
    // //获得时差
    // getIntervalHour(startDate, endDate) {
    //   let ms = endDate - startDate
    //   if (ms < 0) return 0
    //   return Math.floor(ms / 1000 / 60 / 60)
    // },
    //处理上级路由传递的参数，如果有
    async getParams() {
      console.log(this.$route.query.applyId);
      if (this.$route.query.applyId) {
        console.log(this.$route.query.applyId);
        try {
          let res = await this.$http.get(
            `oaLeave/${this.$route.query.applyId}`
          ); //用户ID
          // res.data.list.forEach(item=>{
          //   item.disable=false
          // })
          this.LeaveTable = res.data.list;
          this.LeaveTable.forEach(i => {
            this.tableData.forEach(item => {
              if (item.id == i.useId) {
                item.disable = true;
              }
            });
          });
          this.textarea = res.data.message;
        } catch (e) {
          console.log(e);
        }
      } else if (this.$route.params.LeaveName) {
        this.LeaveTable.push({
          leaveType: this.$route.params.LeaveName,
          id: this.$route.params.id,
          beginDate: "",
          endDate: "",
          availableTime: ""
        });

        this.tableData.forEach(item => {
          if (item.id == this.$route.params.id) {
            item.disable = true;
          }
        });
      } else {
        return false;
      }
    },
    getInfo() {
      this.cookieInfo = JSON.parse(Cookies.get("userInfo"));
    },
    //获取用户项目组
    async getUserDept() {
      try {
        let res = await this.$http.get(
          `dept/${JSON.parse(Cookies.get("userInfo")).userId}/detail`
        );
        this.deptInfo = res.data;
        console.log(this.deptInfo);
      } catch (e) {
        this.$notify({
          title: "错误",
          message: "请求失败",
          type: "error"
        });
      }
    },
    async fetchData() {
      try {
        let res = await this.$http.get(
          `leave/list/${JSON.parse(Cookies.get("userInfo")).jobNum}`
        ); //用户ID
        res.data.forEach(item => {
          item.disable = false;
        });
        this.tableData = res.data;
        console.log(this.tableData);
        this.getParams();
      } catch (e) {
        this.$notify({
          title: "警告",
          message: "数据请求失败",
          type: "error"
        });
      }
    },
    SaveNum() {
      //编辑电话号码
      console.log(this.cookieInfo.mobile);
      if (!/^1\d{10}$/.test(this.cookieInfo.mobile)) {
        this.$notify({
          title: "警告",
          message: "手机号码有误，请重填",
          type: "error"
        });
        return false;
      }
      this.modifyMobile = true;
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  mounted() {
    this.getInfo();
    this.getUserDept();
    this.fetchData();

    Date.prototype.Format = function(fmt) {
      var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S+": this.getMilliseconds() //毫秒
      };
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          if (k == "y+") {
            fmt = fmt.replace(
              RegExp.$1,
              ("" + o[k]).substr(4 - RegExp.$1.length)
            );
          } else if (k == "S+") {
            var lens = RegExp.$1.length;
            lens = lens == 1 ? 3 : lens;
            fmt = fmt.replace(
              RegExp.$1,
              ("00" + o[k]).substr(("" + o[k]).length - 1, lens)
            );
          } else {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
      }
      return fmt;
    };
    this.formatTitle = `${new Date().Format("yyyyMMdd")}-${String(
      new Date().getTime()
    ).slice(5)}`;
    console.log(this.formatTitle);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.employee-container {
  .textarea-input {
    margin: 10px;
  }
}
</style>

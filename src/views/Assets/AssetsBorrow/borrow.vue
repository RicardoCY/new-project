<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside">
        <div class="assets-common-container">
          <el-container>
            <h3 style="font-size:24px;">资产借用流程</h3>
            <el-row>
              <el-col :span="24" style="padding-right:10px">
                <el-row class="col-height-40">
                  <el-col class="apply-title-label" :span="4">标题</el-col>
                  <el-col class="apply-title-content" :span="20">
                    <span
                      style="float:right"
                    >{{state?draftData.title:'资产借用-'+userInfo.trueName}}-{{formatTitle}}</span>
                  </el-col>
                </el-row>
                <el-row class="col-height-40">
                  <el-col class="apply-title-label" :span="4">流程编号</el-col>
                  <el-col class="apply-title-content" :span="20">&nbsp;</el-col>
                </el-row>
                <el-row class="col-height-40">
                  <el-col class="apply-title-label" :span="4">申请日期</el-col>
                  <el-col class="apply-title-content" :span="20">
                    <span
                      style="float:right"
                    >{{state?draftData.createdTime: new Date().toLocaleString()}}</span>
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
                    <span style="float:right">{{state?draftData.applicant:userInfo.trueName}}</span>
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
                        v-model.trim="userInfo.mobile"
                        :disabled="modifyMobile"
                      ></el-input>
                    </span>
                  </el-col>
                </el-row>
                <el-row class="col-height-40">
                  <el-col class="apply-title-label" :span="4">部门</el-col>
                  <el-col class="apply-title-content" :span="20">
                    <span
                      style="float:right"
                    >{{state?draftData.deptName:deptInfo.deptName||'&nbsp;'}}</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-footer style="text-align:center;">
              <el-button style="width:110px"  @click="openDialog">资产选择</el-button>
            </el-footer>

            <el-container>
              <el-header height="20px" class="assets-common-title">已选资产明细</el-header>
              <el-main>
                <el-table :data="tableData" empty-text="暂无数据" border>
                  <el-table-column prop="assetId" label="资产编号" min-width="1"></el-table-column>
                  <el-table-column prop="assetName" label="资产名称" min-width="1"></el-table-column>
                  <el-table-column label="资产类型" min-width="1">
                    <template
                      slot-scope="scope"
                    >{{typeOptions.filter(item => item.value == scope.row.assetType)[0].label}}</template>
                  </el-table-column>
                  <el-table-column prop="remark" label="资产描述" min-width="3"></el-table-column>
                  <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                 <i style="margin-left:10px" class="hover-i el-icon-delete" @click="deleteData(scope.row)"></i>
                      
</el-tooltip > 
                      <!-- <el-button type="danger" size="small" @click="deleteData(scope.row)">删除</el-button> -->
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-footer v-if="!state" style="text-align:center;">
                <el-button
                  class="btn-width btn-160"
                  :disabled="submitLoading"
                  @click="assetBorrowSave('init')"
                >保存</el-button>
                <el-button
                  class="btn-width btn-160"
                  type="primary"
                  :disabled="submitLoading"
                  @click="assetBorrowAdd(2)"
                >提交</el-button>
              </el-footer>
              <!-- 草稿箱提交按钮 -->
              <el-footer v-if="state" style="text-align:center;">
                <el-button
                  class="btn-width btn-160"
                  :disabled="submitLoading"
                  @click="assetBorrowSave('draft')"
                >保存</el-button>
                <el-button
                  v-if="state  == '草稿箱'"
                  class="btn-width btn-160"
                  type="primary"
                  :disabled="submitLoading"
                  @click="assetBorrowAdd('草稿箱')"
                >提交</el-button>
                <el-button
                  class="btn-width btn-160"
                  v-if="state  == '驳回修改'"
                  type="primary"
                  :disabled="submitLoading"
                  @click="assetBorrowAdd('驳回修改')"
                >提交</el-button>
              </el-footer>
            </el-container>
          </el-container>
          <el-dialog title="资产选择" :visible.sync="dialogVisible" width="90%" center>
            <el-container v-loading="isLoad">
              <el-header>
                <div class="select-label" style="display:inline-block;">资产类型</div>
                <el-select
                  v-model="assetPagerData.paramData.assetType"
                  @change="handleCurrentChange(1)"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input class="search-input" placeholder="请输入内容" v-model="searchValue">
                  <el-select v-model="selectValue" slot="prepend" placeholder="请选择">
                    <el-option label="资产编号" value="id"></el-option>
                    <el-option label="资产名称" value="name"></el-option>
                    <el-option label="资产描述" value="remark"></el-option>
                    <el-option label="序列号码" value="serialNum"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="searchAssets"></el-button>
                </el-input>
              </el-header>
              <el-main>
                <el-table
                  ref="dialogTable"
                  :data="dialogData"
                  empty-text="暂无数据"
                  @select="selectChange"
                  @select-all="selectChange"
                  border
                >
                  <el-table-column type="selection" width="36"></el-table-column>
                  <el-table-column prop="assetId" label="资产编号" min-width="1"></el-table-column>
                  <el-table-column prop="serialNum" label="序列号码" min-width="1"></el-table-column>
                  <el-table-column prop="assetName" label="资产名称" min-width="1"></el-table-column>
                  <el-table-column label="资产类型" min-width="1">
                    <template
                      slot-scope="scope"
                    >{{typeOptions.filter(item => item.value == scope.row.assetType)[0].label}}</template>
                  </el-table-column>
                  <el-table-column prop="remark" label="资产描述" min-width="3"></el-table-column>
                </el-table>
              </el-main>
              <el-footer class="assets-common-dialog-footer">
                <div class="footer-left">
                 
                </div>
                <div class="footer-right">
                  <el-pagination
                    v-if="totalCount"
                   small
                    :current-page="assetPagerData.pageNum"
                    :page-size="assetPagerData.pageSize"
                    :page-sizes="[5, 10, 20, 2]"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="totalCount"
                  ></el-pagination>
                </div>
              </el-footer>
            </el-container>
            <span slot="footer" class="dialog-footer">
             
              <el-button type="danger" @click="dialogVisible=false">取消</el-button>
               <el-button  @click="getTableData">确定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </el-container>
</template>
<script>
import "@/styles/Assets/index.scss";
import Cookies from "js-cookie";

export default {
  name: "borrow",
  data() {
    return {
      formatTitle: "",
      userInfo: "",
      deptInfo: "",
      modifyMobile: true,
      tableData: [],
      submitLoading: false,
      //选择弹窗
      dialogVisible: false,
      isLoad: false,
      searchValue: "",
      selectValue: "name",
      dialogData: [],
      selectList: [],
      totalCount: 0,
      assetPagerData: {
        pageNum: 1,
        pageSize: 5,
        paramData: {
          assetId: null,
          assetName: null,
          assetType: 11,
          isLock: false,
          state: 1
        }
      },
      typeOptions: [
        { value: 11, label: "电子设备" },
        { value: 20, label: "家具/工具/器具" },
        { value: 30, label: "机械设备" },
        { value: 40, label: "房屋建筑" },
        { value: 50, label: "运输工具" },
        { value: 60, label: "其他" }
      ],
      //草稿箱
      state: null,
      applyId: null,
      draftData: [],
      //被驳回申请
      processId: null
    };
  },
  mounted() {
    this.userInfo = JSON.parse(Cookies.get("userInfo"));
    this.getUserDept();
    //this.getDialogData()
    if (this.$route.query.state) {
      this.state = this.$route.query.state;
      this.applyId = this.$route.query.applyId;
      if (this.$route.query.state == "驳回修改") {
        this.processId = this.$route.query.processId;
      }
      //获取草稿箱详情
      this.$http.get(`/asset/${this.applyId}/info`).then(res => {
        console.log(res.data);
        this.draftData = res.data;
        this.userInfo.mobile = res.data.phone;
        this.tableData = res.data.list;
        this.selectList = res.data.list;
      });
    }

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
  },
  methods: {
    postSave(data) {
      this.$http.post("assetBorrow/save", data).then(res => {
        this.$notify({
          title: "成功",
          message: "提交成功，请等待管理员审核",
          type: "success"
        });
        this.tableData = [];
        this.selectList = [];
      });
    },
    //保存
    assetBorrowSave(val) {
      switch (val) {
        case "init":
          console.log("init");
          console.log(this.selectList);
          if (this.selectList.length) {
            let data = {
              applicant: this.userInfo.trueName,
              deptName: this.deptInfo.deptName,
              phone: this.userInfo.mobile,
              title:
                "资产借用-" +
                this.userInfo.trueName +
                "-" +
                new Date().toLocaleString(),
              assetIds: this.selectList.map(item => item.assetId)
            };
            console.log(data);
            this.postSave(data);
          } else {
            this.$notify({
              title: "错误",
              message: "请先选择资产后再进行此操作",
              type: "error"
            });
          }
          break;
        case "draft":
          console.log("draft");
          if (this.selectList.length) {
            let data = {
              applicant: this.userInfo.trueName,
              deptName: this.deptInfo.deptName,
              phone: this.userInfo.mobile,
              title:
                "资产借用-" +
                this.userInfo.trueName +
                "-" +
                new Date().toLocaleString(),
              assetIds: this.selectList.map(item => item.assetId),
              id: this.$route.query.applyId
            };
            console.log(data);
            this.postSave(data);
            this.$router.go(-1);
          } else {
            this.$notify({
              title: "错误",
              message: "请先选择资产后再进行此操作",
              type: "error"
            });
          }
          break;
      }
    },
    //获取用户项目组
    async getUserDept() {
      try {
        let res = await this.$http.get(
          `dept/${JSON.parse(Cookies.get("userInfo")).userId}/detail`
        );
        this.deptInfo = res.data || "";
      } catch (e) {
        this.$notify({
          title: "错误",
          message: "请求失败",
          type: "error"
        });
      }
    },
    //编辑电话号码
    SaveNum() {
      if (!/^1\d{10}$/.test(this.userInfo.mobile)) {
        this.$notify({
          title: "警告",
          message: "手机号码有误，请重填",
          type: "error"
        });
        return false;
      }
      this.modifyMobile = true;
    },
    //确认已选
    getTableData() {
      this.tableData = this.selectList;
      this.dialogVisible = false;
    },
    //删除已选
    deleteData(row) {
      let newData = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        if (item.assetId != row.assetId) {
          newData.push(item);
        }
      }
      this.tableData = newData;
      this.selectList = newData;
    },
    //提交/保存借用单
    assetBorrowAdd(val) {
      if (this.tableData.length > 0) {
        this.submitLoading = true;
        let assetIds = [];
        for (let i = 0; i < this.tableData.length; i++) {
          assetIds.push(this.tableData[i].assetId);
        }
        if (!this.state) {
          let data = {
            applicant: this.userInfo.trueName,
            deptName: this.deptInfo.deptName,
            phone: this.userInfo.mobile,
            title:
              "资产借用-" +
              this.userInfo.trueName +
              "-" +
              new Date().toLocaleString(),
            assetIds: assetIds
          };
          console.log(data);
          this.$http
            .post("/assetBorrow/submit", data)
            .then(
              res => {
                //console.log(res)
                this.tableData = [];
                this.selectList = [];
                if (val == 2) {
                  this.$notify({
                    title: "成功",
                    message: "资产借用信息提交成功，请等待管理员审核",
                    type: "success"
                  });
                } else if (val == 1) {
                  this.$notify({
                    title: "成功",
                    message: "资产借用信息成功保存至草稿箱",
                    type: "success"
                  });
                }
              },
              error => {}
            )
            .then(res => {
              this.submitLoading = false;
            });
        } else if (this.state == "草稿箱") {
          let data = {
            applicant: this.userInfo.trueName,
            deptName: this.deptInfo.deptName,
            id: this.applyId,
            title:
              "资产借用-" +
              this.userInfo.trueName +
              "-" +
              new Date().toLocaleString(),
            phone: this.userInfo.mobile,
            assetIds: assetIds
          };
          //console.log(data)
          this.$http
            .post("/assetBorrow/submit", data)
            .then(
              res => {
                this.tableData = [];
                this.selectList = [];
                this.$notify({
                  title: "成功",
                  message: "资产借用信息提交成功，请等待管理员审核",
                  type: "success"
                });
                this.$router.go(-1);
              },
              error => {}
            )
            .then(res => {
              this.submitLoading = false;
            });
        } else if (this.state == "驳回修改") {
          let data = {
            id: this.applyId,
            processId: this.processId,
            phone: this.userInfo.mobile,
            list: assetIds
          };
          //console.log(data)
          this.$http
            .post("/assetBorrow/reject/submit", data)
            .then(
              res => {
                this.tableData = [];
                this.selectList = [];
                this.$notify({
                  title: "成功",
                  message: "被驳回申请修改并提交成功，请等待管理员审核",
                  type: "success"
                });
                this.$router.go(-2);
              },
              error => {}
            )
            .then(res => {
              this.submitLoading = false;
            });
        }
      } else {
        this.$notify({
          title: "错误",
          message: "请先选择资产后再进行此操作",
          type: "error"
        });
      }
    },
    //打开选择弹窗
    openDialog() {
      this.dialogVisible = true;
      this.getDialogData();
    },
    //搜索
    searchAssets() {
      if (this.searchValue == "") {
        this.assetPagerData.paramData.assetId = null;
        this.assetPagerData.paramData.assetName = null;
        this.assetPagerData.paramData.serialNum = null;
        this.assetPagerData.paramData.remark = null;
      } else {
        if (this.selectValue == "id") {
          this.assetPagerData.paramData.assetId = this.searchValue;
          this.assetPagerData.paramData.assetName = null;
          this.assetPagerData.paramData.serialNum = null;
          this.assetPagerData.paramData.remark = null;
        } else if (this.selectValue == "name") {
          this.assetPagerData.paramData.assetId = null;
          this.assetPagerData.paramData.serialNum = null;
          this.assetPagerData.paramData.remark = null;
          this.assetPagerData.paramData.assetName = this.searchValue;
        } else if (this.selectValue == "serialNum") {
          this.assetPagerData.paramData.assetId = null;
          this.assetPagerData.paramData.assetName = null;
          this.assetPagerData.paramData.remark = null;
          this.assetPagerData.paramData.serialNum = this.searchValue;
        } else if (this.selectValue == "remark") {
          this.assetPagerData.paramData.assetId = null;
          this.assetPagerData.paramData.assetName = null;
          this.assetPagerData.paramData.serialNum = null;
          this.assetPagerData.paramData.remark = this.searchValue;
        }
      }
      this.handleCurrentChange(1);
    },
    //多选
    selectChange(selection) {
      let newList = [];
      let selectYes = []; //勾选
      let selectNo = []; //不勾选
      //查找当前页>勾选/不勾选
      //console.log(this.dialogData)
      for (let i = 0; i < this.dialogData.length; i++) {
        let item = this.dialogData[i];
        let flag = true;
        for (let j = 0; j < selection.length; j++) {
          if (selection[j].assetId == item.assetId) {
            flag = false;
          }
        }
        if (flag) {
          selectNo.push(item); //不勾选
        } else {
          selectYes.push(item); //勾选
          newList.push(item); //添加勾选
        }
      }
      //查找已勾选，添加不重复勾选，去除不勾选
      for (let i = 0; i < this.selectList.length; i++) {
        let item = this.selectList[i];
        let flag = true;
        for (let j = 0; j < selectNo.length; j++) {
          if (selectNo[j].assetId == item.assetId) {
            flag = false; //去除不勾选
          }
        }
        for (let j = 0; j < selectYes.length; j++) {
          if (selectYes[j].assetId == item.assetId) {
            flag = false; //添加不重复勾选
          }
        }
        if (flag) {
          newList.push(item);
        }
      }
      this.selectList = newList;
      // console.log(this.selectList)
      // console.log(this.tableData)
    },
    //切换当前页
    handleCurrentChange(val) {
      this.assetPagerData.pageNum = val;
      this.getDialogData();
    },
    //切换每页条数
    handleSizeChange(val) {
      this.assetPagerData.pageSize = val;
      this.handleCurrentChange(1);
    },
    //获取资产信息
    getDialogData() {
      this.isLoad = true;
      this.$http
        .post("/asset/pager", this.assetPagerData)
        .then(res => {
          this.totalCount = res.data.pagination.totalCount;
          this.dialogData = res.data.resultData;
          this.isLoad = false;
        })
        .then(res => {
          //勾选已选项
          if ((this.dialogVisible = true)) {
            for (let i = 0; i < this.dialogData.length; i++) {
              let item = this.dialogData[i];
              for (let j = 0; j < this.selectList.length; j++) {
                if (this.selectList[j].assetId == item.assetId) {
                  //console.log(item)
                  this.$refs.dialogTable.toggleRowSelection(item);
                }
              }
            }
          } else {
            for (let i = 0; i < this.dialogData.length; i++) {
              let item = this.dialogData[i];
              for (let j = 0; j < this.tableData.length; j++) {
                if (this.tableData[j].assetId == item.assetId) {
                  //console.log(item)
                  this.$refs.dialogTable.toggleRowSelection(item);
                }
              }
            }
          }
        });
    }
  }
};
</script>
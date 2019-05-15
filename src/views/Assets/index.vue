<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside">
        <div class="assets-index-container">
          <el-row>
            <h3 style="font-size:24px;">资产入库流程</h3>
          </el-row>
          <!-- 
    <el-row class="col-height-40">
      <el-col class="apply-title-label" :span="4">申请日期</el-col>
      <el-col  class="apply-title-content" :span="8">{{state?draftData.createdTime: new Date().toLocaleString()}}</el-col>
      <el-col class="apply-title-label" :span="4">联系方式</el-col>
      <el-col  class="apply-title-content" :span="8">
        <span style="padding-left: 10px">
          <el-input
            style="width: 200px"
            v-model.trim="userInfo.mobile"
            :disabled="modifyMobile"
          >
          </el-input>
        </span>
        <span>
          <el-button type="primary" v-if="modifyMobile"  @click="modifyMobile =false" icon="el-icon-edit" circle>
          </el-button>
            <el-button v-if="!modifyMobile" type="success" @click="SaveNum" icon="el-icon-check" circle></el-button>
        </span>
      </el-col>
    </el-row>
          -->

          <el-row>
            <el-col :span="24" style="padding-right:10px">
              <el-row class="col-height-40">
                <el-col class="apply-title-label" :span="4">标题</el-col>
                <el-col class="apply-title-content" :span="20">
                  <span
                    style="float:right"
                  >{{state?draftData.title:'资产入库-'+userInfo.trueName}}-{{formatTitle}}</span>
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
                  <span style="float:right">{{state?draftData.deptName:deptInfo.deptName||'&nbsp;'}}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div style="text-align: center;margin: 50px 0">
            <el-button style="width:110px;" @click="handleAddShow">添加入库</el-button>
            <Upload
              style="display:inline-block"
              :headers="{
            access_token:uploadToken
            }"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :on-erro="onerror"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              :action="`${$http.defaults.baseURL}/asset/multiple`"
            >
              <el-button style="width:110px;margin-left:10px" icon="ios-cloud-upload-outline">批量导入</el-button>
            </Upload>
            <el-button style="width:135px;margin-left:10px" type="primary" :disabled="downloading" @click="downloadExcel">
              <i class="el-icon-download"></i> 下载模板
            </el-button>
          </div>

          <!--表格-->
          <el-col :span="24" class="table-container" style="margin-bottom:20px;">
            <el-header height="40px" style="font-size:20px" class="assets-common-title">
              
            </el-header>
            <el-table style="width: 100%" border :data="assetsList" stripe>
              <el-table-column prop="assetName" align="center" label="资产名称" width="100"></el-table-column>
              <el-table-column prop="assetType" label="资产类型" width="100" align="center">
                <template slot-scope="scope">{{options1[scope.row.assetType]}}</template>
              </el-table-column>
              <el-table-column prop="remark" label="资产描述" align="center" min-width="180"></el-table-column>
              <el-table-column prop="addTime" label="入库时间" align="center" min-width="170">
                <template slot-scope="scope">
                  <span>{{scope.row.addTime.toLocaleString()}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="serialNum" label="序列号码" align="center" min-width="100"></el-table-column>

              <el-table-column prop="orderId" label="采购编号" align="center" width="100"></el-table-column>
              <el-table-column label="购买价格" align="center" width="100">
                <template slot-scope="scope">{{Number(scope.row.price).toFixed(2)}}</template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                   <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                 <i style="margin-left:10px" class="hover-i el-icon-edit-outline"  @click="handleModify(scope.row,scope.$index)"></i>
                 </el-tooltip > 
                    <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                 <i style="margin-left:10px" class="hover-i el-icon-delete" @click="handleDel(scope.row,scope.$index)"></i>
                      
</el-tooltip > 


<!--                       
                  <el-button type="danger" @click="handleDel(scope.row,scope.$index)">删除</el-button>
                  <el-button @click="handleModify(scope.row,scope.$index)">修改</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <!--v-if="assetsList.length"-->
          <div v-if="!state" style="text-align: center;margin: 50px 0">
            <el-button
              class="btn-width btn-160"
              :disabled="submitLoading"
              @click="assetBorrowSave('init')"
            >保存</el-button>
            <el-button
              class="btn-width btn-160"
              type="primary"
              :disabled="submitLoading"
              @click="assetAddSave(2)"
            >提交</el-button>
          </div>
          <!-- 草稿箱提交按钮 -->
          <div v-if="state" style="text-align: center;margin: 50px 0">
            <el-button
              class="btn-width btn-160"
              :disabled="submitLoading"
              @click="assetBorrowSave('draft')"
            >保存</el-button>
            <el-button
              class="btn-width btn-160"
              type="primary"
              v-if="state == '草稿箱'"
              :disabled="submitLoading"
              @click="assetAddSave('草稿箱')"
            >
              <i :class="!submitLoading?'el-icon-check':'el-icon-loading'"></i>提交
            </el-button>
            <el-button
              class="btn-width btn-160"
              v-if="state == '驳回修改'"
              type="primary"
              :disabled="submitLoading"
              @click="assetAddSave('驳回修改')"
            >
              <i :class="!submitLoading?'el-icon-check':'el-icon-loading'"></i>提交
            </el-button>
          </div>

          <!--添加选项弹窗-->
          <el-dialog
            class="asset-dialog"
            :title="modifyForm?'资产修改':'资产入库'"
            :before-close="beforeClose"
            width="400px"
            :visible.sync="dialogFormVisible"
          >
            <el-form :inline="true" :model="form" label-width="100px">
            
                  <el-form-item label="资产名称">
                    <el-input v-model.trim="form.assetName"></el-input>
                  </el-form-item>
                  <el-form-item label="资产类型">
                    <el-select v-model="form.assetType" placeholder="请选择">
                      <el-option
                        v-for="(item,index) in options1"
                        :key="item"
                        :label="item"
                        :value="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  
               
                  <el-form-item label="序列号码">
                    <el-input v-model.trim="form.serialNum"></el-input>
                  </el-form-item>
                  <el-form-item label="采购编号">
                    <el-input v-model.trim="form.orderId"></el-input>
                  </el-form-item>
                  <el-form-item label="购买价格">
                    <el-input v-model.trim="form.price"></el-input>
                  </el-form-item>
                  <el-form-item label="入库时间">
                    <el-date-picker v-model="form.addTime" type="date" placeholder="选择日期"></el-date-picker>
                  </el-form-item>
             <el-form-item label="资产描述">
                    <el-input
                      resize="none"
                      type="textarea"
                      class="asset-remark-input"
                      v-model.trim="form.remark"
                    ></el-input>
                  </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="modifyForm==false">
              <el-button type="danger" @click="dialogFormVisible=false">取消</el-button>
              <el-button type="primary" @click="handleContinue">继续添加</el-button>
              <el-button :disabled="btnDisabled" @click="handleAdd">确 定</el-button>
            </div>
            <div slot="footer" class="dialog-footer" v-else>
              <el-button type="danger" @click="dialogFormVisible=false">取消</el-button>
              <el-button :disabled="btnDisabled"  @click="saveModify">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import Cookies from "js-cookie";
import { Upload, Button } from "iview";

export default {
  components: {
    Upload,
    Button
  },
  data() {
    return {
      formatTitle: "",
      uploadToken: "",
      submitLoading: false,
      userInfo: "",
      deptInfo: "",
      modifyForm: false,
      modifyIndex: "",
      modifyMobile: true,
      dialogFormVisible: false,
      options1: {
        "11": "电子设备",
        "12": "易耗品",
        "20": "家具/工具/器具",
        "30": "机械设备",
        "40": "房屋建筑",
        "50": "运输工具",
        "60": "其他"
      },
      form: {
        assetName: "",
        assetType: "",
        remark: "",
        orderId: "",
        price: "",
        addTime: ""
      },
      assetsList: [],
      //防止按钮快速双击提交
      btnDisabled: false,
      //草稿箱
      state: null,
      applyId: null,
      draftData: [],
      downloading: false,
      //被驳回申请
      processId: null
    };
  },
  methods: {
    postSave(data) {
      this.$http.post("assetAdd/save", data).then(res => {
        this.$notify({
          title: "成功",
          message: "保存成功，可在草稿箱中查看",
          type: "success"
        });
        this.assetsList = [];
      });
    },
    //保存
    assetBorrowSave(val) {
      switch (val) {
        case "init":
          console.log("init");
          console.log(this.assetsList);
          if (this.assetsList.length) {
            let data = {
              applicant: this.userInfo.trueName,
              deptName: this.deptInfo.deptName,
              phone: this.userInfo.mobile,
              title:
                "资产入库-" +
                this.userInfo.trueName +
                "-" +
                new Date().toLocaleString(),
              list: this.assetsList
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
          console.log(this.assetsList);
          if (this.assetsList.length) {
            let data = {
              applicant: this.userInfo.trueName,
              deptName: this.deptInfo.deptName,
              phone: this.userInfo.mobile,
              title:
                "资产借用-" +
                this.userInfo.trueName +
                "-" +
                new Date().toLocaleString(),
              list: this.assetsList.filter(
                item => (item.addTime = new Date(item.addTime))
              ),
              id: this.$route.query.applyId
            };
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

      // if(this.tableData.length > 0){
      //   this.submitLoading = true
      //   let assetIds = []
      //   for(let i = 0; i < this.tableData.length; i++){
      //     assetIds.push(this.tableData[i].assetId)
      //   }
      //   if(!this.state){
      //     let data = {
      //       applicant:this.userInfo.trueName,
      //       deptName:this.deptInfo.deptName,
      //       phone:this.userInfo.mobile,
      //       title:"资产借用-"+this.userInfo.trueName+"-"+new Date().toLocaleString(),
      //       assetIds:assetIds
      //     }
      //     console.log(data)
      //     this.$http.post("/assetAdd/submit",data).then(res => {
      //       //console.log(res)
      //       this.tableData = []
      //       this.selectList = []
      //       if (val == 2) {
      //         this.$notify({
      //           title: '成功',
      //           message: '资产借用信息提交成功，请等待管理员审核',
      //           type: 'success'
      //         });
      //       }else if(val == 1){
      //         this.$notify({
      //           title: '成功',
      //           message: '资产借用信息成功保存至草稿箱',
      //           type: 'success'
      //         });
      //       }
      //     }, error => {}).then(res => {
      //       this.submitLoading = false
      //     })
      //   }else if(this.state == '草稿箱'){
      //     let data = {
      //        applicant:this.userInfo.trueName,
      //       deptName:this.deptInfo.deptName,
      //       id:this.applyId,
      //       title:"资产借用-"+this.userInfo.trueName+"-"+new Date().toLocaleString(),
      //       phone:this.userInfo.mobile,
      //       assetIds:assetIds
      //     }
      //     //console.log(data)
      //     this.$http.post("/assetAdd/submit",data).then(res => {
      //       this.tableData = []
      //       this.selectList = []
      //       this.$notify({
      //         title: '成功',
      //         message: '资产借用信息提交成功，请等待管理员审核',
      //         type: 'success'
      //       });
      //       this.$router.go(-1)
      //     }, error => {}).then(res => {
      //       this.submitLoading = false
      //     })
      //   }else if(this.state == '驳回修改'){
      //     let data = {
      //       id:this.applyId,
      //       processId:this.processId,
      //       phone:this.userInfo.mobile,
      //       list:assetIds
      //     }
      //     //console.log(data)
      //     this.$http.post("/assetAdd/reject/submit",data).then(res => {
      //       this.tableData = []
      //       this.selectList = []
      //       this.$notify({
      //         title: '成功',
      //         message: '被驳回申请修改并提交成功，请等待管理员审核',
      //         type: 'success'
      //       });
      //       this.$router.go(-2)
      //     }, error => {}).then(res => {
      //       this.submitLoading = false
      //     })
      //   }
      // }else{
      //   this.$notify({
      //     title: '错误',
      //     message: '请先选择资产后再进行此操作',
      //     type: 'error'
      //   });
      // }
    },
    handleSuccess(response) {
      if (response.data) {
        this.$message({
          type: "success",
          message: "导入完成"
        });
        response.data.forEach(element => {
          console.log(element);
          element.addTime = new Date(element.addTime).toLocaleString();
          this.assetsList.push(element);
        });
      } else {
        this.$message({
          type: "info",
          message: "上传失败"
        });
      }
    },
    onerror() {
      this.$message({
        type: "info",
        message: "上传失败"
      });
    },
    downloadExcel() {
      this.downloading = true;
      let timer = null;
      if (!timer) {
        timer = setTimeout(() => {
          window.location.href = "./static/css/导入资产模板.xlsx";
          this.downloading = false;
        }, 1000);
      } else {
        return false;
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
    //弹窗关闭前
    beforeClose(done) {
      if ((this.modifyForm = false)) {
        done();
      } else {
        this.modifyForm = false;
        done();
      }
    },
    //添加入库
    handleAddShow() {
      this.dialogFormVisible = true;
      this.form = {
        assetName: "",
        assetType: "",
        remark: "",
        orderId: "",
        price: "",
        addTime: "",
        serialNum: ""
      };
    },
    SaveNum() {
      //编辑电话号码
      // /^1\d{10}$/
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
    // 确认添加
    handleAdd() {
      this.btnDisabled = true;
      setTimeout(() => {
        this.btnDisabled = false;
      }, 800);

      let length = Object.values(this.form).filter(item => item != "").length;
      console.log(length == 6);
      console.log(this.form.serialNum);

      if ((length == 6 && this.form.serialNum == "") || length === 7) {
        this.assetsList.push({
          assetName: this.form.assetName,
          assetType: this.form.assetType,
          remark: this.form.remark,
          serialNum: this.form.serialNum,
          orderId: this.form.orderId,
          price: this.form.price,
          addTime: this.form.addTime
        });
        this.dialogFormVisible = false;
      } else {
        this.$notify({
          title: "错误",
          message: "除资产序号外必须填写",
          type: "error"
        });
      }
    },
    // 继续添加
    handleContinue() {
      let length = Object.values(this.form).filter(item => item).length;
      if ((length == 6 && this.form.serialNum == "") || length === 7) {
        this.assetsList.push({
          assetName: this.form.assetName,
          assetType: this.form.assetType,
          remark: this.form.remark,
          serialNum: this.form.serialNum,
          orderId: this.form.orderId,
          price: this.form.price,
          addTime: this.form.addTime
        });
        this.form = {
          assetName: "",
          assetType: "",
          remark: "",
          orderId: "",
          price: "",
          addTime: "",
          serialNum: ""
        };
      } else {
        this.$notify({
          title: "错误",
          message: "除资产序号外必须填写",
          type: "error"
        });
      }
    },
    //删除行数据
    handleDel(val, index) {
      this.assetsList = this.assetsList.filter((item, num) => {
        return num !== index;
      });
    },
    //修改行数据
    handleModify: function(val, index) {
      this.dialogFormVisible = true;
      this.modifyForm = true;
      this.modifyIndex = index;
      console.log(val.serialNum);

      this.form = {
        assetName: val.assetName,
        assetType: this.options1[val.assetType],
        remark: val.remark,
        orderId: val.orderId,
        price: val.price,
        addTime: val.addTime,
        serialNum: val.serialNum || ""
      };
      console.log(this.form);
    },
    // 保存更改
    saveModify() {
      this.btnDisabled = true;
      setTimeout(() => {
        this.btnDisabled = false;
      }, 800);
      let length = Object.values(this.form).filter(item => item).length;
      if ((length == 6 && this.form.serialNum == "") || length === 7) {
        if (this.modifyIndex >= 0) {
          this.dialogFormVisible = false;
          this.modifyForm = false;
          this.assetsList.splice(this.modifyIndex, 1, this.form);
        } else {
          console.log(111111);
          return false;
        }
      } else {
        this.$notify({
          title: "错误",
          message: "除资产序号外必须填写",
          type: "error"
        });
      }
    },

    //提交/保存入库单assetAdd/save
    assetAddSave(val) {
      if (this.assetsList.length > 0) {
        this.submitLoading = true;
        let addList = [];
        let priceFlag = true;
        for (let i in this.assetsList) {
          let item = this.assetsList[i];
          if (
            !/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(item.price)
          ) {
            priceFlag = false;
          } else {
            let price = Number(item.price).toFixed(2);
            let addItem = {
              addTime: new Date(),
              assetName: item.assetName,
              assetType: item.assetType,
              orderId: item.orderId,
              price: parseFloat(price),
              remark: item.remark,
              serialNum: item.serialNum
            };
            addList.push(addItem);
          }
        }
        if (priceFlag) {
          if (!this.state) {
            let data = {
              applicant: this.userInfo.trueName,
              deptName: this.deptInfo.deptName,
              phone: this.userInfo.mobile,
              title:
                "资产入库-" +
                this.userInfo.trueName +
                "-" +
                new Date().toLocaleString(),
              state: val,
              list: addList
            };
            console.log(data);
            this.$http
              .post("/assetAdd/submit", data)
              .then(
                res => {
                  //console.log(res)
                  this.assetsList = [];
                  if (val == 2) {
                    this.$notify({
                      title: "成功",
                      message: "资产入库信息提交成功，请等待管理员审核",
                      type: "success"
                    });
                  } else if (val == 1) {
                    this.$notify({
                      title: "成功",
                      message: "资产入库信息成功保存至草稿箱",
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
            //提交草稿箱
            console.log(addList);
            let data = {
              id: this.applyId,
              applicant: this.userInfo.trueName,
              deptName: this.deptInfo.deptName,
              phone: this.userInfo.mobile,
              title:
                "资产入库-" +
                this.userInfo.trueName +
                "-" +
                new Date().toLocaleString(),
              list: addList
            };
            console.log(data);
            this.$http
              .post("/assetAdd/submit", data)
              .then(
                res => {
                  console.log(res);
                  this.assetsList = [];
                  this.$notify({
                    title: "成功",
                    message: "资产入库信息提交成功，请等待管理员审核",
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
              list: addList
            };
            console.log(data);
            this.$http
              .post("/assetAdd/reject/submit", data)
              .then(
                res => {
                  console.log(res);
                  this.assetsList = [];
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
          this.submitLoading = false;
          this.$message({
            message: "购买价格格式不正确,最多保留两位小数",
            type: "warning"
          });
        }
      } else {
        this.$notify({
          title: "错误",
          message: "入库单信息不能为空",
          type: "error"
        });
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(Cookies.get("userInfo"));
    this.getUserDept();
    this.uploadToken = Cookies.get("token");
    //检测是否由 草稿箱 或 被驳回申请 点击进入
    if (this.$route.query.state) {
      //console.log(this.$route.query)
      this.state = this.$route.query.state;
      this.applyId = this.$route.query.applyId;
      if (this.$route.query.state == "驳回修改") {
        this.processId = this.$route.query.processId;
      }
      //获取草稿箱详情
      this.$http.get(`/asset/${this.applyId}/info`).then(res => {
        this.draftData = res.data;
        this.userInfo.mobile = res.data.phone;
        console.log(this.draftData);
        let list = [];
        for (let i = 0; i < res.data.list.length; i++) {
          let item = res.data.list[i];
          let newItem = {
            assetName: item.assetName,
            assetType: item.assetType,
            remark: item.remark,
            serialNum: item.serialNum,
            orderId: item.orderId,
            price: item.price,
            addTime: item.addTime
          };
          list.push(newItem);
        }
        this.assetsList = list;
        console.log(this.assetsList);
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
  }
};
</script>

<style scoped>
.table-container .el-table {
  margin: 0 auto;
}
</style>
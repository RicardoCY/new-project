<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside">
        <div>
          <h3 style="font-size: 24px;">假别管理</h3>
          <el-row style="margin:25px 0">
            <el-col :span="9">
              <div style="display:flex;align-items:space-between">
                <el-button style="width:110px;" class="btn-110" @click="showAddModial">添加假别</el-button>
                <el-button  class="btn-110" style="margin-left:10px;width:110px;" @click="delMany" :disabled="!btnShow">批量删除</el-button>
                <Upload
                  style="display:inline-block;height:40px"
                  :headers="{
                access_token:uploadToken
                }"
                  :show-upload-list="false"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  :on-success="handleSuccess"
                  :on-erro="onerror"
                  :action="`${$http.defaults.baseURL}/leave/multiple`"
                >
                  <el-button  class="btn-110" style="margin-left:10px;width:110px;" icon="ios-cloud-upload-outline">批量导入</el-button>
                </Upload>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="text-align:center">
                <el-input
                  placeholder="请输入姓名或工号(默认姓名)"
                  v-model="search"
                  clearable
                  class="input-with-select"
                  @keyup.enter.native="handleSearch(selectValue)"
                >
                  <el-select clearable v-model="selectValue" slot="prepend" placeholder="请选择">
                    <el-option label="姓名" value="name"></el-option>
                    <el-option label="工号" value="num"></el-option>
                  </el-select>
                  <el-button
                    
                    slot="append"
                    @click="handleSearch(selectValue)"
                    type="primary"
                    icon="el-icon-search"
                  ></el-button>
                </el-input>
              </div>
            </el-col>
            <el-col :span="3">
              <div style="text-align:center">
                <el-button
                class="btn-135"
                  style="float:right"
                  type="primary"
                  :disabled="downloading"
                  @click="downloadExcel"
                >
                  <i class="el-icon-download"></i> 下载模板
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="table-container">
              <el-table
                border
                :data="tableData"
                style="width: 100%;min-width: 600px"
                @selection-change="handleSelectionChange"
              >
                >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="trueName" label="姓名" width="100"></el-table-column>
                <el-table-column prop="jobNum" label="工号" width="100"></el-table-column>
                <el-table-column prop="leaveType" label="假别" width="100">
                  <template slot-scope="scope">
                    <span>{{parseLeaveType[scope.row.leaveType]}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="totalTime" label="总额(小时)" width="100"></el-table-column>
                <el-table-column prop="availableTime" label="余额(小时)" width="100"></el-table-column>
                <el-table-column prop="beginDate" value-format="yyyy-MM-dd" label="有效期开始">
                  <template slot-scope="scope">
                    <!--<span>{{ scope.row.beginDate.toLocaleString()}}</span>-->
                    <span>{{ scope.row.beginDate.slice(0,10)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="endDate" type="date" value-format="yyyy-MM-dd" label="有效期结束">
                  <template slot-scope="scope">
                    <!--<span>{{ scope.row.endDate.toLocaleString()}}</span>-->
                    <span>{{ scope.row.endDate.slice(0,10)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="80">
                  <template slot-scope="scope">
                    <!-- <el-button
                :loading="loadingBtn"
                size="mini"
                type="danger"
                @click="delItems(scope.row)"
              >{{loadingBtn?'':'删除'}}</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleModify( scope.row)"
                    >编辑</el-button>-->
                    <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                  <i class="hover-i el-icon-edit-outline" @click="handleModify(scope.row)"></i>
                      
</el-tooltip >  
                  
                    <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                 <i
                      style="margin-left:20px"
                      class="hover-i el-icon-delete"
                      @click="delItems(scope.row)"
                    ></i>
                      
</el-tooltip >  
                   
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row style="text-align: center;margin-top: 50px">
            <el-pagination
            v-if="pagination.totalCount"
              small
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.currentPageIndex"
              :page-size="10"
              layout="prev, pager, next"
              :total="pagination.totalCount"
            ></el-pagination>
          </el-row>
          <el-dialog
            :before-close="handleBefore"
            class="leave-dialog"
            width="400px"
            :title="'修改假别'"
            :visible.sync="dialogFormVisible"
          >
            <el-form :inline="true" :model="form" style="text-align: center">
              <el-form-item label="姓名">
                <el-input
                  v-if="modifyState"
                  :disabled="true"
                  v-model.trim="form.trueName"
                  placeholder="小时"
                ></el-input>
                <Select
                  placeholder="请输入姓名"
                  class="iview-select"
                  v-else
                  v-model="form.trueName"
                  filterable
                  clearable
                  remote
                  :remote-method="remoteMethod"
                  :loading="selectLoading"
                  :label-in-value="true"
                >
                  <Option
                    v-for="(item,index) in restaurants"
                    :key="index"
                    :value="item.name+' '+item.num"
                    :label="item.name+' 工号: '+item.num"
                  >
                    <span style="display:inline-block;width: 60px;text-align: left">{{item.name}}</span>
                    <span>{{item.num}}</span>
                  </Option>
                </Select>
              </el-form-item>
              <el-form-item label="假别">
                <el-select v-model="form.leaveType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.leaveType"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="总额">
                <el-input v-model.trim="form.totalTime" placeholder="小时"></el-input>
              </el-form-item>
              <el-form-item label="余额">
                <el-input v-model.trim="form.availableTime" placeholder="小时"></el-input>
              </el-form-item>
              <el-form-item label="开始">
                <el-date-picker
                  @change="handleBeginChange2"
                  v-model="form.beginDate"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  type="date"
                  value-format="timestamp"
                  v-model="form.endDate"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="danger" @click="dialogFormVisible=false">取消</el-button>
              <el-button v-if="modifyState"  @click=" handleModifySubmit">确定</el-button>
              <el-button v-else @click="handleAdd">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog
            class="leave-dialog"
            width="400px"
            title="添加假别"
            :visible.sync="addShow"
            :before-close="handleBefore"
          >
            <el-form :inline="true" :model="form2" style="text-align: center">
              <el-form-item label="姓名">
                <el-input v-if="modifyState" v-model.trim="form2.trueName" placeholder="请输入姓名"></el-input>
                <Select
                  class="iview-select"
                  v-else
                  placeholder="请输入"
                  v-model="form2.trueName"
                  filterable
                  clearable
                  remote
                  not-found-text="无匹配数据"
                  :remote-method="remoteMethod"
                  :loading="selectLoading"
                  :label-in-value="true"
                >
                  <Option
                    v-for="(item,index) in restaurants"
                    :key="index"
                    :value="item.name+' '+item.num"
                    :label="item.name+' 工号: '+item.num"
                  >
                    <span style="display:inline-block;width: 60px;text-align: left">{{item.name}}</span>
                    <span>{{item.num}}</span>
                  </Option>
                </Select>
              </el-form-item>
              <el-form-item label="假别">
                <el-select v-model="form2.leaveType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.leaveType"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="总额">
                <el-input v-model.trim="form2.totalTime" placeholder="小时"></el-input>
              </el-form-item>
              <el-form-item label="开始">
                <el-date-picker
                  v-model="form2.beginDate"
                  @change="handleBeginChange"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束">
                <el-date-picker
                  type="date"
                  value-format="timestamp"
                  v-model="form2.endDate"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="danger" @click="addShow=false">取消</el-button>
              <el-button @click="handleAdd">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import { Select, Option, Upload, Button } from "iview";
import Cookie from "js-cookie";

export default {
  name: "LeaveAdmin",
  components: {
    Select,
    Option,
    Upload,
    Button
  },
  data() {
    return {
      // selectVal:'',
      uploadToken: "",
      addShow: false,
      modifyState: false,
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
      },
      selectLoading: false,
      restaurants: [], //建议
      loadingBtn: false,
      selectValue: "姓名",
      search: "",
      currentPage: 1,
      dialogFormVisible: false,
      options: [],
      form: {
        trueName: "",
        leaveType: "",
        oaLeaveId: 0,
        beginDate: "",
        endDate: "",
        totalTime: "",
        availableTime: ""
      },
      form2: {
        trueName: "",
        leaveType: "",
        oaLeaveId: 0,
        beginDate: "",
        endDate: "",
        totalTime: "",
        availableTime: ""
      },
      btnShow: false,
      delList: [],
      tableData: [],
      pagination: [],
      nowPage: 1,
      numSearch: false,
      nameSearch: false,
      modifyLeaveType: "",
      downloading: false
    };
  },
  methods: {
    //加班调休 自动加半年
    handleBeginChange(val) {
      console.log(this.form2.leaveType);
      console.log(val);
      if (this.form2.leaveType == 6 && val) {
        this.form2.endDate = val + 5259600000;
      }
    },
    handleBeginChange2(val) {
      console.log(this.form.leaveType);
      console.log(val);
      if (this.form.leaveType == 6 && val) {
        this.form.endDate = val + 5259600000;
      }
    },
    handleSuccess(response) {
      console.log(response);
      if (response.data) {
        this.initLeaveList(this.nowPage);
        this.$message({
          type: "success",
          message: "上传成功"
        });
      } else {
        this.$message({
          type: "info",
          message: response.message
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
          window.location.href = "./static/css/导入假别模板.xlsx";
          this.downloading = false;
        }, 1000);
      } else {
        return false;
      }
    },
    showAddModial() {
      this.addShow = true;
    },
    handleBefore(done) {
      if (!this.modifyState) {
        this.form = {};
      }
      this.form2 = {};
      done();
    },
    //搜索确认后
    // selectChange(val){
    //     if(val){
    //        console.log(val.label)
    //        console.log(this.form.name+'name')
    //     }
    // },
    //多选
    handleSelectionChange(val) {
      this.delList = [];
      this.btnShow = val.length ? 1 : 0;
      val.forEach(element => {
        this.delList.push(element.id);
      });
    },
    //删除多选
    delMany() {
      this.$confirm("此操作将删除该假别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delList.forEach(item => {
            this.$http
              .post(`leave/delete`, {
                id: item
              })
              .then(res => {
                this.initLeaveList(this.nowPage);
              });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改单项
    async handleModify(val) {
      this.modifyState = true;
      this.dialogFormVisible = true;
      this.modifyLeaveType = val.leaveType;
      console.log("beginTime" + val.beginDate);
      if (this.modifyState) {
        this.form.trueName = val.trueName + " 工号: " + val.jobNum;
        this.form.leaveType = val.leaveType;
        this.form.beginDate = new Date(val.beginDate);
        this.form.endDate = new Date(val.endDate);
        this.form.totalTime = val.totalTime == 0 ? "0" : val.totalTime;
        this.form.oaLeaveId = 0;
        this.form.jobNum = val.jobNum;
        this.form.availableTime =
          val.availableTime == 0 ? "0" : val.availableTime;
        this.form.id = val.id;
      }
    },
    // 删除项
    async delItems(val) {
      this.$confirm("此操作将删除该假别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadingBtn = true;
          this.$http
            .post(`leave/delete`, { id: val.id })
            .then(res => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success"
              });
              this.handleSearch();
              // this.initLeaveList(this.nowPage)
              this.loadingBtn = false;
            })
            .catch(e => {
              this.$notify({
                title: "警告",
                message: e,
                type: "error"
              });
              this.loadingBtn = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //姓名搜索
    handleSearch(val) {
      if (val == "num") {
        this.numSearch = true;
        this.initLeaveList(1, 10, {
          jobNum: this.search
        });
      } else {
        this.nameSearch = true;
        this.initLeaveList(1, 10, {
          trueName: this.search
        });
      }
    },
    //处理提交编辑
    async handleModifySubmit() {
      let pass =
        Object.values(this.form).filter(item => item != "").length == 8;
      if (pass) {
        let arr = this.form.trueName.split(" ");
        if (
          new Date(this.form.endDate).getTime() <
          new Date(this.form.beginDate).getTime()
        ) {
          this.$notify({
            title: "失败",
            message: "结束时间必须大于或等于开始时间",
            type: "error"
          });
          return;
        }
        if (this.form.totalTime < this.form.availableTime) {
          this.$notify({
            title: "失败",
            message: "假期总额必须大于假期余额",
            type: "error"
          });
          return;
        }
        try {
          let res = await this.$http.post(`leave/update`, {
            beginDate: new Date(this.form.beginDate),
            endDate: new Date(this.form.endDate),
            jobNum: arr[2],
            leaveType:
              this.modifyLeaveType == this.form.leaveType
                ? ""
                : this.form.leaveType,
            id: this.form.id,
            oaLeaveId: 0,
            totalTime: this.form.totalTime,
            trueName: arr[0],
            availableTime: this.form.availableTime
          });
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success"
          });
          // this.form={}
          console.log(this.form);
          this.currentPage = 1;
          this.handleSearch();
          this.dialogFormVisible = false;
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$notify({
          title: "失败",
          message: "请添加信息",
          type: "error"
        });
      }
    },
    //新建假别
    async handleAdd() {
      let pass = Object.values(this.form2).filter(item => item).length == 5;
      if (pass) {
        try {
          let arr = this.form2.trueName.split(" ");
          if (
            new Date(this.form2.endDate).getTime() <
            new Date(this.form2.beginDate).getTime()
          ) {
            this.$notify({
              title: "失败",
              message: "结束时间必须大于或等于开始时间",
              type: "error"
            });
            return;
          }

          console.log(new Date(this.form2.beginDate));
          console.log(new Date(this.form2.endDate));
          let res = await this.$http.post(`leave/add`, {
            beginDate: this.form2.beginDate,
            endDate: this.form2.endDate,
            jobNum: arr[1],
            leaveType: this.form2.leaveType,
            oaLeaveId: 0,
            totalTime: this.form2.totalTime,
            trueName: arr[0]
          });
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          this.form2 = {};
          this.currentPage = 1;
          this.initLeaveList(this.currentPage);
          this.addShow = false;
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$notify({
          title: "失败",
          message: "请添加信息",
          type: "error"
        });
      }
    },
    //处理换页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      if (this.numSearch) {
        this.initLeaveList(val, 10, {
          jobNum: this.search
        });
      } else if (this.nameSearch) {
        this.initLeaveList(val, 10, {
          trueName: this.search
        });
      } else {
        this.nowPage = val;
        this.initLeaveList(val);
        this.delList = [];
      }
    },
    //初始化所有数据
    async initLeaveList(page, size = 10, data = {}) {
      try {
        let res = await this.$http.post(`leave/pager`, {
          pageNum: page,
          pageSize: size,
          paramData: data
        });
        console.log("请求数据");
        this.tableData = res.data.resultData;
        console.log(this.tableData);
        if (this.tableData == null && this.currentPage > 0) {
          (this.currentPage = page - 1),
            this.initLeaveList(page - 1, size, data);
        }
        this.pagination = res.data.pagination;
      } catch (e) {
        this.$notify({
          title: "警告",
          message: "数据请求失败",
          type: "error"
        });
      }
    },
    //搜索用户名
    async remoteMethod(val) {
      this.restaurants = [];
      if (val !== "") {
        this.selectLoading = true;
        try {
          let res = await this.$http.post(`user/pager`, {
            pageNum: 1,
            pageSize: 10,
            paramData: {
              trueName: val
            }
          });
          res.data.resultData.forEach(item =>
            this.restaurants.push({ name: item.trueName, num: item.jobNum })
          );
          this.selectLoading = false;
        } catch (e) {}
      } else {
        this.restaurants = [];
      }
    },
    async getLeaveType() {
      try {
        let res = await this.$http.get(`leave/leaveType`);
        this.options = res.data;
      } catch (e) {
        this.$notify({
          title: "警告",
          message: "数据请求失败",
          type: "error"
        });
      }
    },
    handleSelect() {},
    handleInput() {
      clearTimeout(timer);
      let timer = setTimeout(() => {
        this.getSearchList(this.form.name);
      }, 500);
    }
  },
  mounted() {
    console.log(this.$http.defaults.baseURL);
    this.initLeaveList(this.nowPage);
    this.getLeaveType();
    // this.getSearchList()
    this.uploadToken = Cookie.get("token");
    console.log(Cookie.get("token"));
  }
};
</script>

<style scoped>
.table-container .el-table {
  margin: 0 auto;
}
.iview-select {
}
.ivu-select-selection {
  height: 40px !important;
}
</style>

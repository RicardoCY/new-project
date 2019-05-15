<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside" v-loading="isLoad">
        <div class="header">
          <div style="float:left;">
            <el-button type="primary" class="btn-80" @click="openDialog('add')">添加</el-button>
          </div>
          <div class="header-center">
            <el-input placeholder="请输入内容" v-model="searchValue"  @keyup.enter.native="searchUser"   class="input-with-select">
              <el-select v-model="selectValue" slot="prepend" placeholder="请选择">
                <el-option label="用户名" value="userName"></el-option>
                <el-option label="姓名" value="trueName"></el-option>
                <el-option label="手机号" value="mobile"></el-option>
                <el-option label="工号" value="jobNum"></el-option>
                <el-option label="邮箱" value="workMail"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
            </el-input>
          </div>
          <div class="header-right">
            <el-button type="primary" icon="el-icon-refresh" @click="refresh"></el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" icon="el-icon-tickets">
                <i class="el-icon-caret-bottom"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="auth-index-dropdown">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    v-for="(item,index) in checkAllList"
                    :key="index"
                    :label="item.label"
                    :disabled="checkList.length == 1 && checkList.indexOf(item.label) != '-1'"
                  >{{item.text}}</el-checkbox>
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="main">
          <el-table
            :data="tableData"
            empty-text="暂无数据"
            border
            @selection-change="selectChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="36"></el-table-column>
            <el-table-column
              prop="userId"
              label="id"
              v-if="checkList.indexOf(1) != '-1'"
              min-width="2"
            ></el-table-column>
            <el-table-column
              prop="userName"
              label="用户名"
              v-if="checkList.indexOf(2) != '-1'"
              min-width="3"
            ></el-table-column>
            <el-table-column
              prop="trueName"
              label="姓名"
              v-if="checkList.indexOf(3) != '-1'"
              min-width="3"
            ></el-table-column>
            <el-table-column
              prop="sex"
              label="性别"
              v-if="checkList.indexOf(4) != '-1'"
              min-width="2"
            >
              <template slot-scope="scope">
                <div>{{scope.row.sex == 0?'女':'男'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号"
              v-if="checkList.indexOf(5) != '-1'"
              min-width="4"
            ></el-table-column>
            <el-table-column
              prop="post"
              label="职位"
              v-if="checkList.indexOf(6) != '-1'"
              min-width="4"
            ></el-table-column>
            <el-table-column
              prop="jobNum"
              label="工号"
              v-if="checkList.indexOf(7) != '-1'"
              min-width="3"
            ></el-table-column>
            <el-table-column
              prop="workMail"
              label="邮箱"
              v-if="checkList.indexOf(8) != '-1'"
              min-width="6"
            ></el-table-column>
            <el-table-column
              label="操作"
              v-if="checkList.indexOf(9) != '-1'"
              :width="Math.min.apply(null,checkList) < 9 ? '100' : null"
              :min-width="Math.min.apply(null,checkList) < 9 ? null : '1'"
            >
              <template slot-scope="scope">
                <el-tooltip class="i-tips" effect="light" placement="bottom" content="详细">
                  <i class="hover-i iconfont icon-shebeisousuo" @click="openDetail(scope.row)"></i>
                </el-tooltip>
                <el-tooltip class="i-tips" effect="light" placement="bottom" content="授权">
                  <i
                    style="margin-left:10px"
                    class="hover-i iconfont icon-yuechi"
                    @click="openDialog2(scope.row)"
                  ></i>
                </el-tooltip>
                <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除">
                  <i
                    style="margin-left:10px"
                    class="hover-i el-icon-delete"
                    @click="openDialog('update',scope.row)"
                  ></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="停用开关"
              v-if="checkList.indexOf(10) != '-1'"
              :width="Math.min.apply(null,checkList) < 9 ? '80' : ''"
              :min-width="Math.min.apply(null,checkList) < 9 ? '' : '1'"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.isDisable"
                  @change="switchChange(scope.row)"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <div class="footer-left">
            <!-- 显示第 {{(tableRequest.pageNum-1)*tableRequest.pageSize+1}}
          到第 {{tableRequest.pageNum*tableRequest.pageSize > totalCount?totalCount:tableRequest.pageNum*tableRequest.pageSize}} 条记录，
            总共 {{totalCount}} 条记录-->
          </div>
          <div class="footer-right">
            <el-pagination
              v-if="totalCount"
              small
              :current-page="tableRequest.pageNum"
              :page-size="tableRequest.pageSize"
              :page-sizes="[5, 10, 20, 30]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :total="totalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
      <el-dialog
        :title="dialogState == 'add'?'添加员工':'编辑员工'"
        :visible.sync="dialogVisible"
        width="400px"
        center
      >
        <el-form :model="addForm" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="addForm.userName"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input  v-model="addForm.trueName"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="addForm.sex" placeholder="请选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input  v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-cascader
             
              :options="treeData"
              :show-all-levels="false"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="职位">
            <el-select v-model="addForm.post" placeholder="请选择职位">
              <el-option
                v-for="item in postList"
                :key="item.postName"
                :label="item.postName"
                :value="item.postName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input  v-model="addForm.workMail"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input  v-model="addForm.idCard"></el-input>
          </el-form-item>
          <el-form-item label="岗位类别">
            <el-select  v-model="addForm.jobCategory" placeholder="请选择岗位">
              <el-option label="业务类" :value="1"></el-option>
              <el-option label="非业务类" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div  style="text-align:right" slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
            <el-button  @click="addUser('add')" v-if="dialogState == 'add'">确定</el-button>
          <el-button  @click="addUser('update')" v-if="dialogState == 'update'">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="授权" :visible.sync="dialogVisible2" width="400px" center>
        <el-container v-if="dialogVisible2">
          <el-tree
            :data="dialog2Data"
            :props="defaultProps"
            default-expand-all
            check-strictly
            node-key="roleId"
            :default-checked-keys="checkedKeysList"
            ref="tree"
            show-checkbox
          ></el-tree>
        </el-container>
        <div slot="footer" class="dialog-footer" style="text-align:right">
          <el-button @click="getCheckedKeys">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import "@/styles/Auth/index.scss";

export default {
  name: "index",
  data() {
    return {
      selectedOptions: [],
      isLoad: false,
      selectValue: "trueName",
      searchValue: "",
      checkAllList: [
        { text: "id", label: 1 },
        { text: "用户名", label: 2 },
        { text: "真实姓名", label: 3 },
        { text: "性别", label: 4 },
        { text: "手机号", label: 5 },
        { text: "职位", label: 6 },
        { text: "工号", label: 7 },
        { text: "邮箱", label: 8 },
        { text: "操作", label: 9 },
        { text: "停用开关", label: 10 }
      ],
      checkList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      selectList: [],
      tableData: [],
      tableRequest: {
        pageNum: 1,
        pageSize: 10,
        paramData: {}
      },
      totalCount: 0,
      //添加/编辑弹窗
      dialogVisible: false,
      dialogState: "add",
      deptList: [],
      postList: [],
      dialogID: null,
      dialogName: null,
      addForm: {
        userName: "",
        trueName: "",
        sex: null,
        mobile: "",
        deptId: 1,
        post: "",
        //jobNum: "",
        workMail: "",
        idCard: "",
        loginPwd: "123456",
        jobCategory: 1
      },
      //授权弹窗
      dialogVisible2: false,
      dialog2Data: [],
      defaultProps: {
        children: "children",
        label: "roleName"
      },
      defaultProps1: {
        children: "children",
        label: "deptName"
      },
      checkedKeysList: [],
      newCeckedKeysList: [],
      treeData: []
    };
  },
  mounted() {
    this.getDept();
    this.getTableData();
    this.getPostList();
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    handleNodeClick() {},
    async getDept() {
      let res = await this.$http.get("/dept/list");

      //  function listToTree(data) {
      //     // let arr = JSON.parse(JSON.stringify(data))
      //     let arr =data
      //     const listChildren = (obj, filter) => {
      //       [arr, obj.children] = arr.reduce((res, val) => {
      //         if (filter(val))
      //           res[1].push(val)
      //         else
      //           res[0].push(val)
      //         return res
      //       }, [[],[]])
      //       obj.children.forEach(val => {
      //         if (arr.length)
      //         listChildren(val, obj => obj.parentId === val.id)
      //       })
      //     }
      //     const tree = {}
      //     listChildren(tree, val => arr.findIndex(i => i.id === val.parentId) === -1)
      //     return tree.children
      //   }

      //     this.treeData =listToTree(res.data)
      //     this.treeData.forEach(item=>{
      //       if(item.children){
      //         item.children.length==0?delete item.children:null
      //       }

      //   })

      //old
      // let obj={}
      // res.data.forEach((item,index)=>{
      //   let x = res.data[index]
      //   item.value=item.id
      //   item.label=item.deptName
      //   return obj[x.parentId]?obj[x.parentId].push(item):obj[x.parentId]=[item]
      // })
      // obj[0].forEach(item=>item.children=[])
      // Object.keys(obj).slice(1).forEach(i=>{
      //     obj[0].forEach(item=>{
      //        item.label=item.deptName
      //         if(item.id==i){
      //           item.children=obj[i]
      //         }else{
      //           item.children.forEach(e=>{
      //             e.label=e.deptName
      //             if(e.id==i){
      //               e.children=obj[i]
      //             }
      //           })
      //         }
      //     })
      // })
      // this.treeData =obj[0]
      // this.treeData.forEach(item=>{
      //   if(item.children){
      //     item.children.length==0?delete item.children:null
      //   }
      // })
      //end old

      //sulotion
      let top = [],
        sub = [],
        obj = {};
      res.data.forEach(item => {
        item.value = item.id;
        item.label = item.deptName;
        item.parentId == 0 ? top.push(item) : sub.push(item);
        obj[item.id] = item;
        item.children = [];
      });
      sub.forEach(item => {
        let parent = obj[item.parentId];
        parent.children.push(item);
      });

      let re = arr => {
        //清除空children
        arr.forEach(i => {
          if (i.children.length !== 0) {
            re(i.children);
          } else {
            delete i.children;
          }
        });
      };
      re(top);
      this.treeData = top;
    },

    //openDetail
    openDetail(val) {
      console.log(val.jobNum);
      this.$router.push({
        name: "personalInfoIndex",
        query: {
          jobNum: val.jobNum
        }
      });
    },
    //刷新按钮
    refresh() {
      this.handleCurrentChange(1);
    },
    //搜索用户
    searchUser() {
      if (this.selectValue == "") {
        this.$message({
          message: "请先选择您要搜索的类型",
          type: "warning"
        });
      } else {
        if (this.searchValue == "") {
          this.tableRequest.paramData = {};
        } else {
          if (this.selectValue == "userName") {
            this.tableRequest.paramData = { userName: this.searchValue };
          } else if (this.selectValue == "trueName") {
            this.tableRequest.paramData = { trueName: this.searchValue };
          } else if (this.selectValue == "mobile") {
            this.tableRequest.paramData = { mobile: this.searchValue };
          } else if (this.selectValue == "jobNum") {
            this.tableRequest.paramData = { jobNum: this.searchValue };
          } else if (this.selectValue == "workMail") {
            this.tableRequest.paramData = { workMail: this.searchValue };
          }
        }
        this.handleCurrentChange(1);
      }
    },

    //---添加/编辑---弹窗
    openDialog(val, row) {
      this.$http.get("/dept/list").then(res => {
        this.dialogState = val;
        this.deptList = res.data;
        this.dialogVisible = true;
        if (this.dialogState == "update") {
          this.dialogName = row.userName;
          this.$http.get("/dept/" + row.userId + "/user").then(res => {
            console.log(res);
            console.log([res.data.parentId, res.data.id]);
            this.addForm = {
              userName: row.userName,
              trueName: row.trueName,
              sex: row.sex,
              mobile: row.mobile,
              deptId: res.data ? [res.data.parentId, res.data.id] : 1,
              post: row.post,
              //jobNum: row.jobNum,
              workMail: row.workMail,
              idCard: row.idCard,
              jobCategory: row.jobCategory,
              userId: row.userId
            };
            this.selectedOptions = [res.data.parentId, res.data.id];
          });
        } else if (this.dialogState == "add") {
          this.addForm = {
            userName: "",
            trueName: "",
            sex: null,
            mobile: "",
            deptId: 1,
            post: "",
            //jobNum: "",
            workMail: "",
            idCard: "",
            loginPwd: "123456",
            jobCategory: 1
          };
          this.selectedOptions = [];
        }
      });
    },
    //--添加/修改--用户
    addUser(val) {
      if (
        this.addForm.userName &&
        this.addForm.trueName &&
        this.addForm.mobile &&
        this.addForm.workMail &&
        this.addForm.idCard
      ) {
        let userNameReg = new RegExp("^[\u4e00-\u9fa5A-Za-z0-9._-]*$");
        let mobileReg = new RegExp("^1[0-9]{10}$");
        let workMailReg = new RegExp(
          "^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"
        );
        let idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (userNameReg.test(this.addForm.userName)) {
          if (mobileReg.test(this.addForm.mobile)) {
            if (workMailReg.test(this.addForm.workMail)) {
              if (idCardReg.test(this.addForm.idCard)) {
                //console.log(this.addForm);
                if (val == "add") {
                  this.addForm.deptId =
                    this.selectedOptions[this.selectedOptions.length - 1] || 1;
                  this.$http.post("/user/add", this.addForm).then(res => {
                    this.dialogVisible = false;
                    this.$notify({
                      title: "成功",
                      message: "用户添加成功",
                      type: "success"
                    });
                    this.getTableData();
                  });
                } else if (val == "update") {
                  console.log(
                    this.selectedOptions[this.selectedOptions.length - 1]
                  );
                  let data = {
                    userName: this.addForm.userName,
                    trueName: this.addForm.trueName,
                    sex: this.addForm.sex,
                    mobile: this.addForm.mobile,
                    deptId: this.selectedOptions[
                      this.selectedOptions.length - 1
                    ],
                    post: this.addForm.post,
                    //jobNum: this.addForm.jobNum,
                    workMail: this.addForm.workMail,
                    idCard: this.addForm.idCard,
                    jobCategory: this.addForm.jobCategory,
                    userId: this.addForm.userId
                  };
                  if (this.addForm.userName == this.dialogName) {
                    delete data.userName;
                  }
                  this.$http.post("/user/update", data).then(res => {
                    this.dialogVisible = false;
                    this.$notify({
                      title: "成功",
                      message: "用户信息修改成功",
                      type: "success"
                    });
                    this.getTableData();
                  });
                }
              } else {
                this.$message({
                  message: "身份证号码格式不正确",
                  type: "warning"
                });
              }
            } else {
              this.$message({
                message: "邮箱格式不正确",
                type: "warning"
              });
            }
          } else {
            this.$message({
              message: "手机号格式不正确",
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: "用户名只能由中英文、数字、._-组成",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "表格尚未填写完整，无法完成提交",
          type: "warning"
        });
      }
    },

    //授权弹窗
    openDialog2(row) {
      this.dialogID = row.userId;
      this.$http.get("/roles/query").then(res => {
        res.data = res.data.filter(obj => obj.isDisable == false);
        this.dialog2Data = this.toTree(res.data);
        //console.log(this.dialog2Data);
        this.$http.get("/user/" + row.userId + "/roles").then(res => {
          this.checkedKeysList = [];
          for (let i in res.data) {
            this.checkedKeysList.push(res.data[i].roleId);
          }
          //console.log(this.checkedKeysList);
          this.dialogVisible2 = true;
        });
      });
    },
    //授权提交按钮
    getCheckedKeys() {
      this.newCeckedKeysList = this.$refs.tree.getCheckedKeys(); //获取全选中的id
      this.$http
        .post("/userrole/set", {
          roleIds: this.newCeckedKeysList,
          userId: this.dialogID
        })
        .then(res => {
          this.dialogVisible2 = false;
          this.$notify({
            title: "成功",
            message: "员工权限修改成功",
            type: "success"
          });
        });
    },
    // checkListChange(){
    //   console.log(this.checkList);
    // },

    switchChange(row) {
      //console.log(row);
      let str = "";
      let message = "";
      if (row.isDisable) {
        str = "该用户及其相关权限将被启用, 是否继续?";
        message = "该用户已被启用";
      } else {
        str = "该用户及其相关权限将被停用, 是否继续?";
        message = "该用户已被停用";
      }
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isLoad = true;
          this.$http
            .post("/user/update", {
              userId: row.userId,
              isDisable: !row.isDisable
            })
            .then(res => {
              this.$notify({
                title: "成功",
                message: message,
                type: "success"
              });
              this.getTableData();
            });
        })
        .catch(() => {});
    },
    //多选
    selectChange(selection) {
      this.selectList = selection;
      console.log(selection);
    },

    handleCurrentChange(val) {
      this.tableRequest.pageNum = val;
      //console.log(`当前页: ${this.tableRequest.pageNum}`);
      this.getTableData();
    },
    handleSizeChange(val) {
      this.tableRequest.pageSize = val;
      //console.log(`每页 ${this.tableRequest.pageSize} 条`);
      this.handleCurrentChange(1);
    },

    getTableData() {
      this.isLoad = true;
      // setTimeout(() =>{
      //   this.isLoad = false
      // },800);
      this.$http.post("/user/pager", this.tableRequest).then(res => {
        this.totalCount = res.data.pagination.totalCount;
        this.tableData = res.data.resultData;
        this.isLoad = false;
      });
    },

    //获取所有职位
    getPostList() {
      this.$http.get("/post/list").then(
        res => {
          this.postList = res.data;
        },
        error => {
          this.$notify.error({
            title: "错误",
            message: "获取所有职位信息失败"
          });
        }
      );
    },

    toTree(data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function(item) {
        delete item.children;
      });
      // 将数据存储为 以 roleId 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function(item) {
        map[item.roleId] = item;
      });
      var val = [];
      data.forEach(function(item) {
        // 以当前遍历项，的parentId,去map对象中找到索引的roleId
        var parent = map[item.parentId];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引roleId,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      return val;
    }
  }
};
</script>
<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside" style=" display: flex;flex-direction: row" v-loading="isLoad">
        <el-container style="width:180px">
        <div style="flex:1;overflow-x: hidden">
          <el-scrollbar style="height:100%;overflow-x: hidden">
            <el-tree
              style="overflow-x: hidden"
              :data="allFunctionstree"
              :props="defaultProps"
              :default-expand-all="true"
              highlight-current
              :expand-on-click-node="false"
              node-key="functionId"
              ref="tree"
              @node-click="handleNodeClick"
            ></el-tree>
          </el-scrollbar>
        </div>
        </el-container>
      <el-container >
        <div style="flex:4;margin-left:5px;width:90%">
          <div
            class="header"
            style="display:flex;
					align-items:center;
					justify-content:space-between;
					margin-bottom:10px;"
          >
            <el-button
              type="primary"
              @click="openDialog('add')"
            >添加子权限</el-button>
            <div class="header-right">
              <el-button type="primary" icon="el-icon-refresh" @click="refresh"></el-button>
              <el-dropdown trigger="click">
                <el-button type="primary" icon="el-icon-tickets">
                  <i class="el-icon-caret-bottom"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" class="auth-structure-dropdown">
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

          <div class="main" style="height:80%">
            <el-table
              :data="tableData"
              empty-text="该权限下暂无子权限"
              border
              @selection-change="selectChange"
              style="width: 100%"
            >
              <el-table-column type="selection" width="36"></el-table-column>
              <el-table-column
                prop="functionId"
                label="权限id"
                v-if="checkList.indexOf(1) != '-1'"
                min-width="1"
              ></el-table-column>
              <el-table-column
                prop="functionName"
                label="权限名称"
                v-if="checkList.indexOf(2) != '-1'"
                min-width="2"
              ></el-table-column>
              <el-table-column
                prop="functionLevel"
                label="权限级别"
                v-if="checkList.indexOf(3) != '-1'"
                min-width="1"
              ></el-table-column>
              <el-table-column
                prop="isDisable"
                label="是否禁用"
                v-if="checkList.indexOf(4) != '-1'"
                min-width="1"
              >
                <template slot-scope="scope">
                  <div>{{scope.row.isDisable?"是":"否"}}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                v-if="checkList.indexOf(5) != '-1'"
                :width="Math.min.apply(null,checkList) < 5 ? '80' : null"
                :min-width="Math.min.apply(null,checkList) < 5 ? null : '1'"
              >
                <template slot-scope="scope">
                  <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                  <i class="hover-i el-icon-edit-outline" @click="openDialog('update',scope.row)"></i>
                      
</el-tooltip >  
<el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                
                      
                  <i
                    style="margin-left:20px"
                    class="hover-i el-icon-delete"
                    @click="deleteFunction(scope.row)"
                  ></i>
</el-tooltip >  
                
                  <!-- <el-button type="success" size="small" @click="openDialog('update',scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteFunction(scope.row)">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
           <div style="height: 60px;float:right;line-height:60px" >
          <span style="float:right">
             <!-- 共 {{tableData.length}} 条记录 -->
          </span>
         
        </div>
          </div>
        </div>
        </el-container>
      </div>
      <el-dialog
        :title="dialogState == 'add'?'添加权限':'编辑权限'"
        :visible.sync="dialogVisible"
        width="400px"
        center
      >
        <el-form :model="addForm" label-width="100px" v-if="dialogVisible">
          <el-form-item label="权限名称">
            <el-input v-model="addForm.functionName"></el-input>
          </el-form-item>
          <el-form-item label="功能代码">
            <el-input v-model="addForm.functionCode"></el-input>
          </el-form-item>
          <el-form-item label="功能级别">
            <el-input v-model="addForm.functionLevel" disabled></el-input>
          </el-form-item>
          <el-form-item label="父级权限">
            <el-input v-model="currentFunction.functionName" disabled></el-input>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-select v-model="addForm.isDisable" placeholder="请选择">
              <el-option label="否" :value="false"></el-option>
              <el-option label="是" :value="true"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:right"  class="dialog-footer">
          
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button  @click="addFunction('add')" v-if="dialogState == 'add'">确定</el-button>
          <el-button  @click="addFunction('update')" v-if="dialogState == 'update'">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import "@/styles/Auth/structure.scss";

export default {
  name: "structure",
  data() {
    return {
      allFunctions: [],
      allFunctionstree: [
        {
          functionId: 0,
          functionLevel: 0,
          parentId: 0,
          functionName: "所有权限",
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "functionName"
      },
      isLoad: false,
      checkAllList: [
        { text: "权限id", label: 1 },
        { text: "权限名称", label: 2 },
        { text: "权限级别", label: 3 },
        { text: "是否禁用", label: 4 },
        { text: "操作", label: 5 }
      ],
      checkList: [1, 2, 3, 4, 5],
      selectList: [],
      currentFunction: null,
      tableData: [],
      //添加/编辑弹窗
      dialogVisible: false,
      dialogState: "add",
      dialogCode: null,
      addForm: {
        functionName: "",
        functionCode: "",
        functionLevel: 1,
        parentId: 0,
        isDisable: false
      }
    };
  },
  mounted() {
    this.getAllFunctions();
  },
  methods: {
    handleNodeClick(data) {
      //console.log(data);
      this.currentFunction = data;
      this.tableData = this.allFunctions.filter(
        obj => obj.parentId == this.currentFunction.functionId
      );
    },
    //---添加/编辑---弹窗
    openDialog(val, row) {
      this.dialogState = val;
      this.dialogVisible = true;
      if (this.dialogState == "update") {
        this.dialogCode = row.functionCode;
        this.addForm = {
          functionName: row.functionName,
          functionCode: row.functionCode,
          functionLevel: row.functionLevel,
          parentId: row.parentId,
          isDisable: row.isDisable,
          functionId: row.functionId
        };
      } else if (this.dialogState == "add") {
        this.addForm = {
          functionName: "",
          functionCode: "",
          functionLevel: this.currentFunction.functionLevel + 1,
          parentId: this.currentFunction.functionId,
          isDisable: false
        };
      }
    },
    //--添加/修改--权限
    addFunction(val) {
      if (this.addForm.functionName && this.addForm.functionName.length <= 15) {
        if (this.addForm.functionCode) {
          if (val == "add") {
            this.$http.post("/function/add", this.addForm).then(res => {
              this.dialogVisible = false;
              this.$notify({
                title: "成功",
                message: "权限添加成功",
                type: "success"
              });
              this.getAllFunctions();
            });
          } else if (val == "update") {
            if (this.addForm.functionCode == this.dialogCode) {
              this.addForm.functionCode = null;
            }
            this.$http.post("/function/update", this.addForm).then(res => {
              this.dialogVisible = false;
              this.$notify({
                title: "成功",
                message: "权限信息修改成功",
                type: "success"
              });
              this.getAllFunctions();
            });
          }
        } else {
          this.$message({
            message: "功能代码不能为空",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "权限名称不规范",
          type: "warning"
        });
      }
    },
    //删除权限
    deleteFunction(row) {
      let childList = this.allFunctions.filter(
        obj => obj.parentId == row.functionId
      );
      if (childList.length > 0) {
        this.$message.error("该权限下还有下级权限,如需删除请先删除其下级权限");
      } else {
        this.$confirm("该权限将被删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.isLoad = true;
            this.$http
              .post("/function/delete", {
                functionId: row.functionId
              })
              .then(res => {
                this.$notify({
                  title: "成功",
                  message: "该权限已被删除",
                  type: "success"
                });
                this.getAllFunctions();
              });
          })
          .catch(() => {});
      }
    },
    //刷新按钮
    refresh() {
      this.getAllFunctions();
    },
    //多选
    selectChange(selection) {
      this.selectList = selection;
      console.log(selection);
    },
    //获取所有操作列表
    getAllFunctions() {
      this.isLoad = true;
      this.$http
        .get("/functions/query")
        .then(res => {
          this.allFunctions = res.data;
          this.allFunctionstree[0].children = this.toTree(res.data);
          if (this.currentFunction == null) {
            this.handleNodeClick(this.allFunctionstree[0]);
          } else {
            this.handleNodeClick(this.currentFunction);
          }
          this.isLoad = false;
        })
        .then(res => {
          this.$refs.tree.setCurrentKey(this.currentFunction.functionId);
        });
    },
    //functions数组转树形结构
    toTree(data) {
      data.forEach(function(item) {
        delete item.children;
      });
      var map = {};
      data.forEach(function(item) {
        map[item.functionId] = item;
      });
      var val = [];
      data.forEach(function(item) {
        var parent = map[item.parentId];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          val.push(item);
        }
      });
      return val;
    }
  }
};
</script>
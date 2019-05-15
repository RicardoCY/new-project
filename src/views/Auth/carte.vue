<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside" style=" display: flex;flex-direction: row" v-loading="isLoad">
        <el-container style="width:180px">
          <div style="flex:1;overflow-x: hidden">
            <el-scrollbar style="height:100%;">
              <el-tree
                :data="allMenustree"
                :props="defaultProps"
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
                node-key="menuId"
                ref="tree"
                @node-click="handleNodeClick"
              ></el-tree>
            </el-scrollbar>
          </div>
        </el-container>
        <el-container>
          <div style="flex:6;margin-left:5px;width:90%">
            <div class="main-container-box">
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
                >添加子菜单</el-button>
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
              <div class="main">
                <el-table
                  :data="tableData"
                  empty-text="该菜单下暂无子菜单"
                  border
                  @selection-change="selectChange"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="36"></el-table-column>
                  <el-table-column
                    prop="menuId"
                    label="菜单id"
                    v-if="checkList.indexOf(1) != '-1'"
                    min-width="1"
                  ></el-table-column>
                  <el-table-column
                    prop="menuName"
                    label="菜单名称"
                    v-if="checkList.indexOf(2) != '-1'"
                    min-width="2"
                  ></el-table-column>
                  <el-table-column
                    prop="menuLevel"
                    label="菜单级别"
                    v-if="checkList.indexOf(3) != '-1'"
                    min-width="1"
                  ></el-table-column>
                  <el-table-column
                    prop="remark"
                    label="菜单说明"
                    v-if="checkList.indexOf(4) != '-1'"
                    min-width="4"
                  >
                    <template slot-scope="scope">
                      <div>{{scope.row.remark?scope.row.remark:'/'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="isDisable"
                    label="是否禁用"
                    v-if="checkList.indexOf(5) != '-1'"
                    min-width="1"
                  >
                    <template slot-scope="scope">
                      <div>{{scope.row.isDisable?"是":"否"}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    v-if="checkList.indexOf(6) != '-1'"
                    :width="Math.min.apply(null,checkList) < 6 ? '80' : null"
                    :min-width="Math.min.apply(null,checkList) < 6 ? null : '1'"
                  >
                    <template slot-scope="scope">
                      <!-- <el-button type="success" size="small" @click="openDialog('update',scope.row)">编辑</el-button>
                      <el-button type="danger" size="small" @click="deleteMenu(scope.row)">删除</el-button>-->
                     <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                      <i
                        class="hover-i el-icon-edit-outline"
                        @click="openDialog('update',scope.row)"
                      ></i>
</el-tooltip  >  
          <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                      <i
                        style="margin-left:20px"
                        class="hover-i el-icon-delete"
                        @click="deleteMenu(scope.row)"
                      ></i>
              </el-tooltip  >         
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
          </div>
        </el-container>
      </div>
      <el-dialog
        :title="dialogState == 'add'?'添加子菜单':'编辑子菜单'"
        :visible.sync="dialogVisible"
        width="400px"
        center
      >
        <el-form :model="addForm" label-width="100px" v-if="dialogVisible">
          <el-form-item label="菜单名称">
            <el-input v-model="addForm.menuName"></el-input>
          </el-form-item>
          <el-form-item label="功能代码">
            <el-input v-model="addForm.functionCode"></el-input>
          </el-form-item>
          <el-form-item label="菜单级别">
            <el-input v-model="addForm.menuLevel" disabled></el-input>
          </el-form-item>
          <el-form-item label="父级菜单">
            <el-input v-model="currentMenu.menuName" disabled></el-input>
          </el-form-item>
          <el-form-item label="菜单序列">
            <el-input v-model="addForm.menuSequence"></el-input>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-select v-model="addForm.isDisable" placeholder="请选择">
              <el-option label="否" :value="false"></el-option>
              <el-option label="是" :value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单说明">
            <el-input class="asset-remark-input"  resize="none"  type="textarea" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:right">
         
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
           <el-button  @click="addMenu('add')" v-if="dialogState == 'add'">确定</el-button>
          <el-button  @click="addMenu('update')" v-if="dialogState == 'update'">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import "@/styles/Auth/structure.scss";

export default {
  name: "carte",
  data() {
    return {
      allMenus: [],
      allMenustree: [
        {
          menuId: 0,
          menuLevel: 0,
          parentId: 0,
          menuName: "所有菜单",
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      isLoad: false,
      checkAllList: [
        { text: "菜单id", label: 1 },
        { text: "菜单名称", label: 2 },
        { text: "菜单级别", label: 3 },
        { text: "菜单说明", label: 4 },
        { text: "是否禁用", label: 5 },
        { text: "操作", label: 6 }
      ],
      checkList: [1, 2, 3, 4, 5, 6],
      selectList: [],
      currentMenu: null,
      tableData: [],
      //添加/编辑弹窗
      dialogVisible: false,
      dialogState: "add",
      dialogCode: null,
      addForm: {
        menuName: "",
        functionCode: "",
        menuLevel: 1,
        parentId: 0,
        menuSequence: 0,
        isDisable: false,
        remark: ""
      }
    };
  },
  mounted() {
    this.getAllMenus();
  },
  methods: {
    handleNodeClick(data) {
      //console.log(data);
      this.currentMenu = data;
      this.tableData = this.allMenus.filter(
        obj => obj.parentId == this.currentMenu.menuId
      );
    },
    //---添加/编辑---弹窗
    openDialog(val, row) {
      this.dialogState = val;
      this.dialogVisible = true;
      if (this.dialogState == "update") {
        this.dialogCode = row.functionCode;
        this.addForm = {
          menuName: row.menuName,
          functionCode: row.functionCode,
          menuLevel: row.menuLevel,
          parentId: row.parentId,
          menuSequence: row.menuSequence,
          isDisable: row.isDisable,
          remark: row.remark,
          menuId: row.menuId
        };
      } else if (this.dialogState == "add") {
        this.addForm = {
          menuName: "",
          functionCode: "",
          menuLevel: this.currentMenu.menuLevel + 1,
          parentId: this.currentMenu.menuId,
          menuSequence: 0,
          isDisable: false,
          remark: ""
        };
      }
    },
    //--添加/修改--菜单
    addMenu(val) {
      if (this.addForm.menuName && this.addForm.menuName.length <= 15) {
        if (this.addForm.functionCode) {
          if (/^[0-9]+$/.test(this.addForm.menuSequence)) {
            if (val == "add") {
              this.$http.post("/menu/add", this.addForm).then(res => {
                this.dialogVisible = false;
                this.$notify({
                  title: "成功",
                  message: "子菜单添加成功",
                  type: "success"
                });
                this.getAllMenus();
              });
            } else if (val == "update") {
              if (this.addForm.functionCode == this.dialogCode) {
                this.addForm.functionCode = null;
              }
              this.$http.post("/menu/update", this.addForm).then(res => {
                this.dialogVisible = false;
                this.$notify({
                  title: "成功",
                  message: "菜单信息修改成功",
                  type: "success"
                });
                this.getAllMenus();
              });
            }
          } else {
            this.$message({
              message: "菜单序列只能为大于等于0的数字",
              type: "warning"
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
          message: "菜单名称不规范",
          type: "warning"
        });
      }
    },
    //删除菜单
    deleteMenu(row) {
      let childList = this.allMenus.filter(obj => obj.parentId == row.menuId);
      if (childList.length > 0) {
        this.$message.error("该菜单下还有子菜单,如需删除请先删除其子菜单");
      } else {
        this.$confirm("该菜单将被删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.isLoad = true;
            this.$http
              .post("/menu/delete", {
                menuId: row.menuId
              })
              .then(res => {
                this.$notify({
                  title: "成功",
                  message: "该菜单已被删除",
                  type: "success"
                });
                this.getAllMenus();
              });
          })
          .catch(() => {});
      }
    },
    //刷新按钮
    refresh() {
      this.getAllMenus();
    },
    //多选
    selectChange(selection) {
      this.selectList = selection;
      console.log(selection);
    },
    //获取所有操作列表
    getAllMenus() {
      this.isLoad = true;
      this.$http
        .get("/menus/query")
        .then(res => {
          this.allMenus = res.data;
          this.allMenustree[0].children = this.toTree(res.data);
          if (this.currentMenu == null) {
            this.handleNodeClick(this.allMenustree[0]);
          } else {
            this.handleNodeClick(this.currentMenu);
          }
          this.isLoad = false;
        })
        .then(res => {
          this.$refs.tree.setCurrentKey(this.currentMenu.menuId);
        });
    },
    //menus数组转树形结构
    toTree(data) {
      data.forEach(function(item) {
        delete item.children;
      });
      var map = {};
      data.forEach(function(item) {
        map[item.menuId] = item;
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
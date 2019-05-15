<template>
<el-container>
    <div class="main-bg">
      <div class="main-inside" v-loading="isLoad">
        <div class="header">
          <el-button type="primary" class='btn-80'  @click="openDialog('add')">添加</el-button>
          <div class="header-right">
            <el-button type="primary" icon="el-icon-refresh" @click="refresh"></el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" icon="el-icon-tickets"><i class="el-icon-caret-bottom"></i></el-button>
              <el-dropdown-menu slot="dropdown" class="auth-role-dropdown">
                <el-checkbox-group v-model="checkList" @change="checkListChange">
                  <el-checkbox v-for="(item,index) in checkAllList" :key="index" :label="item.label" :disabled="checkList.length == 1 && checkList.indexOf(item.label) != '-1'">{{item.text}}</el-checkbox>
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
           
            style="width: 100%">
            <el-table-column
              type="selection"
              width="36">
            </el-table-column>
            <el-table-column
              prop="roleId"
              label="id"
              v-if="checkList.indexOf(1) != '-1'"
              min-width="1">
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="角色名称"
              v-if="checkList.indexOf(2) != '-1'"
              min-width="2">
            </el-table-column>
            <el-table-column
              prop="parentId"
              label="上级角色"
              v-if="checkList.indexOf(3) != '-1'"
              min-width="2">
              <template slot-scope="scope">
                <div>{{scope.row.parentId != 0?tableData.filter(obj => obj.roleId == scope.row.parentId)[0].roleName:'/'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="描述信息"
              v-if="checkList.indexOf(4) != '-1'"
              min-width="4">
              <template slot-scope="scope">
                <div>{{scope.row.remark?scope.row.remark:'/'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              v-if="checkList.indexOf(5) != '-1'"
              :width="Math.min.apply(null,checkList) < 5 ? '130' : null"
              :min-width="Math.min.apply(null,checkList) < 5 ? null : '1'">
              <template slot-scope="scope">
                <!-- <el-button type="primary" size="small" @click="openDialog3(scope.row)">授权</el-button>
                <el-button type="primary" size="small" @click="openDialog2(scope.row)">角色用户</el-button>
                <el-button type="success" size="small" @click="openDialog('update',scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleterole(scope.row)">删除</el-button> -->
  <el-tooltip class="i-tips" effect="light" placement="bottom" content="授权" >  
                         <i class="hover-i iconfont  icon-yuechi"   @click="openDialog3(scope.row)"></i> 
</el-tooltip > 
              
  <el-tooltip class="i-tips" effect="light" placement="bottom" content="子用户" >  
                 <i style="margin-left:10px" class="hover-i iconfont  icon-guanliyuanrenzheng"   @click="openDialog2(scope.row)"></i> 
                      
</el-tooltip > 
  <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                 <i style="margin-left:10px" class="hover-i el-icon-edit-outline"  @click="openDialog('update',scope.row)"></i>
                      
</el-tooltip > 
  <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                 <i style="margin-left:10px" class="hover-i el-icon-delete" @click="deleterole(scope.row)"></i>
                      
</el-tooltip > 
                 
                
                
              </template>
            </el-table-column>
            <el-table-column
              label="停用开关"
              v-if="checkList.indexOf(6) != '-1'"
              :width="Math.min.apply(null,checkList) < 5 ? '80' : ''"
              :min-width="Math.min.apply(null,checkList) < 5 ? '' : '1'">
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.isDisable"
                  @change="switchChange(scope.row)"
                  active-color="#ff4949"
                  inactive-color="#13ce66">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="height: 60px;float:right;line-height:60px" >
          <span style="float:right">
             <!-- 共 {{tableData.length}} 条记录 -->
          </span>
         
        </div>
      </div>
      <el-dialog
        :title="dialogState == 'add'?'添加角色':'编辑角色'"
        :visible.sync="dialogVisible"
        width="400px"
        center>
        <el-form :model="addForm" label-width="100px">
          <el-form-item label="用户角色">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="上级角色">
            <el-select v-model="addForm.parentId" placeholder="请选择上级角色">
              <el-option label="无" :value="0"></el-option>
              <el-option v-for="item in tableData" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述信息">
            <el-input class="asset-remark-input"  resize="none"  type="textarea" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:right" slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
           <el-button  @click="addRole" v-if="dialogState == 'add'">确定</el-button>
          <el-button  @click="updateRole" v-if="dialogState == 'update'">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="角色下用户"
        :visible.sync="dialogVisible2"
        width="400px"
        center>
        <el-container v-if="dialogVisible2">
          <el-main>
            <div v-if="dialog2Data.length == 0">该角色下暂无用户</div>
            <el-tag v-for="item in dialog2Data" :key="item.userId">{{item.trueName}}</el-tag>
          </el-main>
        </el-container>
      </el-dialog>
      <el-dialog
        title="授权"
        :visible.sync="dialogVisible3"
        width="400px"
        center>
        <el-container v-if="dialogVisible3">
          <el-tree
            :data="dialog3Data"
            :props="defaultProps"
            default-expand-all
            node-key="functionId"
            :default-checked-keys="checkedKeysList"
            ref="tree"
            show-checkbox>
          </el-tree>
        </el-container>
        <div slot="footer" style="text-align:right" class="dialog-footer">
          <el-button  @click="getCheckedKeys">提交</el-button>
        </div>
      </el-dialog>
    </div>
    </el-container>
</template>

<script>

  import '@/styles/Auth/role.scss'


  export default {
    name: 'role',
    data(){
      return {
        isLoad:false,
        checkAllList:[{text:"id",label:1},{text:"角色名称",label:2},{text:"上级角色",label:3},{text:"描述信息",label:4},{text:"操作",label:5},{text:"停用开关",label:6}],
        checkList:[1,2,3,4,5,6],
        selectList:[],
        tableData:[],
        //添加/编辑弹窗
        dialogVisible:false,
        dialogState:"add",
        dialogID:null,
        dialogName:null,
        addForm:{
          roleName:"",
          parentId:0,
          remark:""
        },
        //用户角色弹窗
        dialogVisible2:false,
        dialog2Data:[],
        //授权弹窗
        dialogVisible3:false,
        dialog3Data:[],
        defaultProps: {
          children: 'children',
          label: 'functionName'
        },
        checkedKeysList:[],
        newCeckedKeysList:[]
      }
    },
    mounted(){
      this.getTableData()

    },
    updated(){
      
    },
    methods:{
      //---添加/编辑---弹窗
      openDialog(val,row){
        this.dialogState = val
        this.dialogVisible = true
        if(this.dialogState == 'update'){
          this.dialogID = row.roleId
          this.dialogName = row.roleName
          this.addForm = {
            roleName:row.roleName,
            parentId:row.parentId,
            remark:row.remark
          }
        }else if(this.dialogState == 'add'){
          this.addForm = {roleName:"",parentId:0,remark:""}
        }
      },
      //添加角色
      addRole(){
        if(this.addForm.roleName && this.addForm.roleName.length <= 15){
          this.$http.post("/roles/add",this.addForm).then(res => {
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '角色添加成功',
              type: 'success'
            });
            this.getTableData()
          })
        }else{
          this.$message({
            message:'角色名不规范',
            type:'warning'
          });
        }
      },
      //修改角色
      updateRole(){
        if(this.addForm.roleName && this.addForm.roleName.length <= 15){
          this.$http.post("/roles/update",{
            roleId:this.dialogID,
            roleName:this.addForm.roleName == this.dialogName?null:this.addForm.roleName,
            parentId:this.addForm.parentId,
            remark:this.addForm.remark
          }).then(res => {
              this.dialogVisible = false
              this.$notify({
                title: '成功',
                message: '角色信息修改成功',
                type: 'success'
              });
              this.getTableData()
            })
        }else{
          this.$message({
            message:'角色名不能为空',
            type:'warning'
          });
        }
      },
      //用户角色弹窗
      openDialog2(row){
        let url = "/user/" + row.roleId +"/role"
        this.$http.get(url).then(res => {
          this.dialog2Data = res.data
          //console.log(this.dialog2Data);
          this.dialogVisible2 = true
        })
      },
      //授权弹窗
      openDialog3(row){
        this.dialogID = row.roleId
        this.$http.get("/functions/query").then(res => {
          res.data = res.data.filter(obj => obj.isDisable == false)
          this.dialog3Data = this.toTree(res.data)
          //this.dialog3Data = Level1
          this.$http.get("/role/"+row.roleId+"/functions").then(res => {
            this.checkedKeysList = []
            let roleLevel2 = res.data.filter(obj => obj.functionLevel == 2)
            for(let i in roleLevel2){
              this.checkedKeysList.push(roleLevel2[i].functionId)
            }
            //console.log(this.checkedKeysList);
            this.dialogVisible3 = true
          })
        })
      },
      //授权提交按钮
      getCheckedKeys() {
        let parentArr = this.$refs.tree.getHalfCheckedKeys()   //获取半选中状态的id
        let childArr = this.$refs.tree.getCheckedKeys()  //获取全选中的id
        this.newCeckedKeysList = parentArr.concat(childArr)   //拼接在一起
        this.$http.post("/rolefunction/set",{
            functionIds:this.newCeckedKeysList,
            roleId:this.dialogID,
          }).then(res => {
              this.dialogVisible3 = false
              this.$notify({
                title: '成功',
                message: '角色权限修改成功',
                type: 'success'
              });
            })
      },
      //删除角色
      deleterole(row){
        let childList = this.tableData.filter(obj => obj.parentId == row.roleId)
        if(childList.length > 0){
          this.$message.error('该角色下还有下级角色,如需删除请先删除其下级角色')
        }else{
          this.$confirm( '该角色将被删除, 是否继续?' , '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isLoad = true
            this.$http.post("/roles/delete",{
              roleId:row.roleId,
            }).then(res => {
              this.$notify({
                title: '成功',
                message: '该角色已被删除',
                type: 'success'
              });
              this.getTableData()
            })
          }).catch(() => {});
        }
      },
      //刷新按钮
      refresh(){
        this.getTableData()
      },
      checkListChange(){
        console.log(this.checkList);
      },

      switchChange(row){
        let str = ""
        if(row.isDisable){
          str = '该角色及其相关权限将被启用, 是否继续?'
        }else{
          str = '该角色及其相关权限将被停用, 是否继续?'
        }
        this.$confirm( str , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isLoad = true
          this.$http.post("/roles/update",{
            roleId:row.roleId,
            isDisable:!row.isDisable
          }).then(res => {
              this.getTableData()
            })
        }).catch(() => {});
      },

      //多选
      selectChange(selection){
        this.selectList = selection
        console.log(selection);
      },
      getTableData(){
        this.isLoad = true
        this.$http.get("/roles/query").then(res => {
          this.tableData = res.data
          this.isLoad = false
        })
      },
      
      toTree(data) {
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
          delete item.children;
        });
        // 将数据存储为 以 functionId 为 KEY 的 map 索引数据列
        var map = {};
        data.forEach(function (item) {
          map[item.functionId] = item;
        });
        var val = [];
        data.forEach(function (item) {
          // 以当前遍历项，的parentId,去map对象中找到索引的functionId
          var parent = map[item.parentId];
          // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
          if (parent) {
              (parent.children || ( parent.children = [] )).push(item);
          } else {
              //如果没有在map中找到对应的索引functionId,那么直接把 当前的item添加到 val结果集中，作为顶级
              val.push(item);
          }
        });
        return val;
      }
    }
  }
</script>
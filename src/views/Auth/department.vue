<template>
  <el-container>
    <div class="main-bg">
       <div class="main-inside" style=" display: flex;flex-direction: row" v-loading="isLoad">
      <el-container style="width:180px">
          <el-scrollbar style="height:100%;">
            <el-tree
              :data="allDeptstree"
              :props="defaultProps"
              default-expand-all
              highlight-current
              :expand-on-click-node="false"
              node-key="id"
              ref="tree"
              @node-click="handleNodeClick">
            </el-tree>
          </el-scrollbar>
      </el-container>
        <el-container>
          <div style="flex:6;margin-left:5px;width:90%">
            <div class="header"
             style="display:flex;
					align-items:center;
					justify-content:space-between;
					margin-bottom:10px;"
            >
              <el-button type="primary"  @click="openDialog('add')">添加子部门</el-button>
              <div class="header-right">
                <el-button type="primary" icon="el-icon-refresh" @click="refresh"></el-button>
                <el-dropdown trigger="click">
                  <el-button type="primary" icon="el-icon-tickets"><i class="el-icon-caret-bottom"></i></el-button>
                  <el-dropdown-menu slot="dropdown" class="auth-structure-dropdown">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox v-for="(item,index) in checkAllList" :key="index" :label="item.label" :disabled="checkList.length == 1 && checkList.indexOf(item.label) != '-1'">{{item.text}}</el-checkbox>
                    </el-checkbox-group>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="main">
              <el-table
                :data="tableData"
                empty-text="该部门下暂无子部门"
                border
                @selection-change="selectChange"
               
                style="width: 100%">
                <el-table-column
                  type="selection"
                  width="36">
                </el-table-column>
                <el-table-column
                  prop="deptName"
                  label="部门名称"
                  v-if="checkList.indexOf(1) != '-1'"
                  min-width="1">
                </el-table-column>
                <el-table-column
                  prop="deptNum"
                  label="部门编号"
                  v-if="checkList.indexOf(2) != '-1'"
                  min-width="1">
                </el-table-column>
                <el-table-column
                  label="父级机构"
                  v-if="checkList.indexOf(3) != '-1'"
                  min-width="1">
                  <template slot-scope="scope">
                    <div>{{scope.row.parentId != 0?allDepts.filter(obj => obj.id == scope.row.parentId)[0].deptName:'彦旭科技'}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="父级部门编号"
                  v-if="checkList.indexOf(4) != '-1'"
                  min-width="1">
                  <template slot-scope="scope">
                    <div>{{scope.row.parentId != 0?allDepts.filter(obj => obj.id == scope.row.parentId)[0].deptNum:'0'}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  v-if="checkList.indexOf(5) != '-1'"
                  :width="Math.min.apply(null,checkList) < 5 ? '80' : null"
                  :min-width="Math.min.apply(null,checkList) < 5 ? null : '1'">
                  <template slot-scope="scope">
                    <!-- <el-button type="success" size="small" @click="openDialog('update',scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteDepts(scope.row)">删除</el-button> -->
<el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                      <i class="hover-i el-icon-edit-outline"  @click="openDialog('update',scope.row)"></i>
</el-tooltip > 
                      <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                    <i style="margin-left:20px" class="hover-i el-icon-delete" @click="deleteDepts(scope.row)"></i>
                    </el-tooltip >  
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
        :title="dialogState == 'add'?'添加部门':'编辑部门'"
        :visible.sync="dialogVisible"
        width="400px"
        center>
        <el-form :model="addForm" label-width="100px" v-if="dialogVisible">
          <el-form-item label="父级部门">
            <el-input v-model="currentDept.deptName" disabled></el-input>
          </el-form-item>
          <el-form-item label="父级部门编号">
            <el-input v-model="currentDept.deptNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="子部门名称">
            <el-input v-model="addForm.deptName"></el-input>
          </el-form-item>
          <el-form-item label="子部门编号">
            <el-input v-model="addForm.deptNum"></el-input>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:right">
          
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button  @click="addDept('add')" v-if="dialogState == 'add'">确定</el-button>
          <el-button @click="addDept('update')" v-if="dialogState == 'update'">确定</el-button>
        </div>
      </el-dialog>
      </div>
 </el-container> 
</template>

<script>
  import '@/styles/Auth/structure.scss'

  export default {
    name: 'department',
    data(){
      return {
        allDepts:[],
        allDeptstree:[
          {
            id:0,
            deptLevel:0,
            parentId:0,
            deptNum:0,
            deptName:"彦旭科技",
            children:[]
          }
        ],
        defaultProps: {
          children:'children',
          label:'deptName'
        },
        isLoad:false,
        checkAllList:[{text:"部门名称",label:1},{text:"部门编号",label:2},{text:"父级机构",label:3},{text:"父级编号",label:4},{text:"操作",label:5}],
        checkList:[1,2,3,4,5],
        selectList:[],
        currentDept:null,
        tableData:[],
        //添加/编辑弹窗
        dialogVisible:false,
        dialogState:"add",
        addForm:{
          deptName: "",
          deptNum: "",
          deptLevel: 1,
          parentId: 0
        },
        name:'',
        num:''
      }
    },
    mounted(){
      this.getAllDepts()
    },
    methods:{
      handleNodeClick(data) {
        //console.log(data);
        this.currentDept = data
        this.tableData = this.allDepts.filter(obj => obj.parentId == this.currentDept.id)
      },
      //---添加/编辑---弹窗
      openDialog(val,row){
        this.dialogState = val
        this.dialogVisible = true
        if(this.dialogState == 'update'){

          this.name=row.deptName
          this.num=row.deptNum
         
          this.addForm = {
            deptName: row.deptName,
            deptNum: row.deptNum,
            deptLevel: row.deptLevel,
            parentId: row.parentId,
            id: row.id
          }
        }else if(this.dialogState == 'add'){
          this.addForm = {
            deptName: "",
            deptNum: "",
            deptLevel: this.currentDept.deptLevel + 1,
            parentId: this.currentDept.id
          }
        }
      },
      //--添加/修改--部门
      addDept(val){
        if(this.addForm.deptName && this.addForm.deptName.length <= 20){
          if(this.addForm.deptNum){
            if(val == 'add'){
              this.$http.post("/dept/add",this.addForm).then(res => {
                this.dialogVisible = false
                this.$notify({
                  title: '成功',
                  message: '子部门添加成功',
                  type: 'success'
                });
                this.getAllDepts()
              })
            }else if(val == 'update'){

              console.log(this.addForm.deptName)
              console.log()
              let condistion =this.addForm.deptName==this.name&&this.addForm.deptNum==this.num
              console.log(condistion)
              //  addForm:{
              //   deptName: "",
              //   deptNum: "",
              //   deptLevel: 1,
              //   parentId: 0
              // }
              if(condistion){
                this.dialogVisible = false
              }else if(this.addForm.deptName!==this.name){
                 this.$http.post("/dept/update",{
                    deptName:this.addForm.deptName,
                    deptLevel:  this.addForm.deptLevel,
                    parentId:  this.addForm.parentId,
                    id:this.addForm.id,
                 }).then(res => {
                this.dialogVisible = false
                this.$notify({
                  title: '成功',
                  message: '部门信息修改成功',
                  type: 'success'
                });
                this.getAllDepts()
                })
              }else if(this.addForm.deptNum!==this.num){
                 this.$http.post("/dept/update",{
                    deptNum:this.addForm.deptNum,
                    deptLevel:  this.addForm.deptLevel,
                    parentId:  this.addForm.parentId,
                    id:this.addForm.id,
                 }).then(res => {
                this.dialogVisible = false
                this.$notify({
                  title: '成功',
                  message: '部门信息修改成功',
                  type: 'success'
                });
                this.getAllDepts()
                })
              }
              
            }
          }else{
            this.$message({
              message:'部门编号不能为空',
              type:'warning'
            });
          }
        }else{
          this.$message({
            message:'部门名称不规范',
            type:'warning'
          });
        }
      },
      //删除部门
      deleteDepts(row){
        let childList = this.allDepts.filter(obj => obj.parentId == row.id)
        if(childList.length > 0){
          this.$message.error('该部门下还有子部门,如需删除请先删除其子部门')
        }else{
          this.$confirm( '该部门将被删除, 是否继续?' , '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isLoad = true
            this.$http.post("/dept/delete",{
              id:row.id,
            }).then(res => {
              this.$notify({
                title: '成功',
                message: '该部门已被删除',
                type: 'success'
              });
              this.getAllDepts()
            })
          }).catch(() => {});
        }
      },
      //刷新按钮
      refresh(){
        this.getAllDepts()
      },
      //多选
      selectChange(selection){
        this.selectList = selection
        console.log(selection);
      },
      //获取所有操作列表
      getAllDepts(){
        this.isLoad = true
        this.$http.get("/dept/list").then(res => {
          this.allDepts = res.data
          this.allDeptstree[0].children = this.toTree(res.data)
          if(this.currentDept == null){
            this.handleNodeClick(this.allDeptstree[0])
          }else{
            this.handleNodeClick(this.currentDept)
          }
          this.isLoad = false
        }).then(res => {this.$refs.tree.setCurrentKey(this.currentDept.id)})
      },
      //menus数组转树形结构
      toTree(data){
        data.forEach(function (item) {
          delete item.children;
        });
        var map = {};
        data.forEach(function (item) {
          map[item.id] = item;
        });
        var val = [];
        data.forEach(function (item) {
          var parent = map[item.parentId];
          
          if (parent) {
              (parent.children || ( parent.children = [] )).push(item);
          } else {
              val.push(item);
          }
        });
        return val;
      }
    }
  }
</script>
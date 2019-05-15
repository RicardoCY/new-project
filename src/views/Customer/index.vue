<template>
   <el-container>
      <div class="main-bg">
      <div class="main-inside" v-loading="isLoad">
        <div class="header"  style="display:flex;
					align-items:center;
					justify-content:space-between;
					margin-bottom:10px;">
          <el-button type="primary" class="btn-80"  @click="openDialog('add')">添加</el-button>
          <div class="header-center">
            <el-input placeholder="请输入内容" v-model="searchValue"   @keyup.enter.native="searchUser" class="input-with-select">
              <el-select v-model="selectValue" slot="prepend" placeholder="请选择">
                <el-option label="编号" value="id"></el-option>
                <el-option label="名称" value="name"></el-option>
                <el-option label="类别" value="category"></el-option>
                <el-option label="状态" value="state"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
            </el-input>
          </div>
          <div class="header-right">
            <el-button type="primary" icon="el-icon-refresh" @click="refresh"></el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" icon="el-icon-tickets"><i class="el-icon-caret-bottom"></i></el-button>
              <el-dropdown-menu slot="dropdown" class="customer-index-dropdown">
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
            empty-text="暂无数据"
            border
            @selection-change="selectChange"
            style="width:100%">
            <el-table-column
              type="selection"
              width="36">
            </el-table-column>
            <el-table-column
              prop="id"
              label="客户编号"
              v-if="checkList.indexOf(1) != '-1'"
              min-width="1">
            </el-table-column>
            <el-table-column
              prop="name"
              label="客户名称"
              v-if="checkList.indexOf(2) != '-1'"
              min-width="1">
            </el-table-column>
            <el-table-column
              prop="category"
              label="类别"
              v-if="checkList.indexOf(3) != '-1'"
              min-width="1">
              <template slot-scope="scope">
                <div v-if="scope.row.category == null">N/A</div>
                <div v-if="scope.row.category == 1">收款</div>
                <div v-if="scope.row.category == 2">付款</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              v-if="checkList.indexOf(4) != '-1'"
              min-width="1">
              <template slot-scope="scope">
                <div v-if="scope.row.state == 0">启用</div>
                <div v-if="scope.row.state == 1">停用</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              v-if="checkList.indexOf(5) != '-1'"
              min-width="2">
            </el-table-column>
            <el-table-column
              label="操作"
              v-if="checkList.indexOf(6) != '-1'"
              :width="Math.min.apply(null,checkList) < 6 ? '80' : null"
              :min-width="Math.min.apply(null,checkList) < 6 ? null : '1'">
              <template slot-scope="scope">
                <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                
                       <i class="hover-i el-icon-edit-outline"   @click="openDialog('update',scope.row)"></i>
</el-tooltip >  
<el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                <i style="margin-left:20px" class="hover-i el-icon-delete"  @click="deleteCustomer(scope.row)"></i>
                      
</el-tooltip >  
                  
                
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <div class="footer-left">
            <!-- 显示第 {{(tableRequest.pageNum-1)*tableRequest.pageSize+1}}
            到第 {{tableRequest.pageNum*tableRequest.pageSize > totalCount?totalCount:tableRequest.pageNum*tableRequest.pageSize}} 条记录，
            总共 {{totalCount}} 条记录 -->
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
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </div>
      </div>

      <el-dialog
        :title="dialogState == 'add'?'添加客户':'编辑客户'"
        :visible.sync="dialogVisible"
        width="400px"
        center>
        <el-form :model="addForm" label-width="100px">
          <el-form-item label="客户名称">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="addForm.category" placeholder="请选择类型">
              <el-option label="收款" :value="1"></el-option>
              <el-option label="付款" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="addForm.state" placeholder="请选择状态">
              <el-option label="启用" :value="0"></el-option>
              <el-option label="停用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input class="asset-remark-input"  resize="none"  type="textarea" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button  @click="addCustomer('add')" v-if="dialogState == 'add'">确定</el-button>
          <el-button  @click="addCustomer('update')" v-if="dialogState == 'update'">确定</el-button>
        </div>
      </el-dialog>


   </el-container>
</template>

<script>
  import '@/styles/Customer/index.scss'

  export default {
    name: 'index',
    data(){
      return {
        isLoad:false,
        selectValue:"name",
        searchValue:"",
        checkAllList:[{text:"客户编号",label:1},{text:"客户名称",label:2},{text:"类别",label:3},{text:"状态",label:4},{text:"备注",label:5},{text:"操作",label:6}],
        checkList:[1,2,3,4,5,6],
        selectList:[],
        tableData:[],
        tableRequest:{
          pageNum: 1,
          pageSize: 10,
          paramData: {}
        },
        totalCount:0,
        //添加/编辑弹窗
        dialogVisible:false,
        dialogState:"add",
        addForm:{
          name: "",
          category: 1,
          state: 0,
          remark: ""
        }
      }
    },
    mounted(){
      this.getTableData()
    },
    methods:{
      //刷新按钮
      refresh(){
        this.handleCurrentChange(1)
      },
      //搜索客户
      searchUser(){
        if(this.selectValue == ''){
          this.$message({
            message: '请先选择您要搜索的类型',
            type: 'warning'
          });
        }else{
          let reg = /^[0-9]*$/;
          if(this.searchValue == ''){
            this.tableRequest.paramData = {}
          }else{
            if(this.selectValue == "id"){
              if(reg.test(Number(this.searchValue))){
                this.tableRequest.paramData = { id:Number(this.searchValue) }
              }else{
                this.tableRequest.paramData = { id:-1 }
              }
            }else if(this.selectValue == "name"){
              this.tableRequest.paramData = { name:this.searchValue }
            }else if(this.selectValue == "category"){
              if(this.searchValue == "收" || this.searchValue == "收款"){
                this.tableRequest.paramData = { category:1 }
              }else if(this.searchValue == "付" || this.searchValue == "付款"){
                this.tableRequest.paramData = { category:2 }
              }else{
                if(reg.test(this.selectValue)){
                  this.tableRequest.paramData = { category:this.searchValue }
                }else{
                  this.tableRequest.paramData = { category:-1 }
                }
              }
            }else if(this.selectValue == "state"){
              if(this.searchValue == "启" || this.searchValue == "启用" || this.searchValue == "0"){
                this.tableRequest.paramData = { state:0 }
              }else if(this.searchValue == "停" || this.searchValue == "停用" || this.searchValue == "1"){
                this.tableRequest.paramData = { state:1 }
              }else{
                if(reg.test(this.selectValue)){
                  this.tableRequest.paramData = { state:this.searchValue }
                }else{
                  this.tableRequest.paramData = { state:-1 }
                }
              }
            }
          }
          this.handleCurrentChange(1)
        }
      },
      //---添加/编辑---弹窗
      openDialog(val,row){
        this.dialogState = val
        this.dialogVisible = true
        if(this.dialogState == 'update'){
          this.addForm = {
            name: row.name,
            category: row.category,
            state: row.state,
            remark: row.remark,
            id:row.id
          }
        }else if(this.dialogState == 'add'){
          this.addForm = {
            name: "",
            category: 1,
            state: 0,
            remark: ""
          }
        }
      },
      //--添加/修改--客户
      addCustomer(val){
        if(this.addForm.name && this.addForm.name.length <= 20){
          if(val == 'add'){
            this.$http.post("/customer/add",this.addForm).then(res => {
              this.dialogVisible = false
              this.$notify({
                title: '成功',
                message: '客户添加成功',
                type: 'success'
              });
              this.getTableData()
            })
          }else if(val == 'update'){
            this.$http.post("/customer/update",this.addForm).then(res => {
              this.dialogVisible = false
              this.$notify({
                title: '成功',
                message: '客户信息修改成功',
                type: 'success'
              });
              this.getTableData()
            })
          }
        }else{
          this.$message({
            message:'客户名称不能为空,且长度不能超过20字',
            type:'warning'
          });
        }
      },
      //删除客户
      deleteCustomer(row){
        this.$confirm( '该客户将被删除, 是否继续?' , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isLoad = true
          this.$http.post("/customer/delete",{
            id:row.id,
          }).then(res => {
            this.$notify({
              title: '成功',
              message: '该客户已被删除',
              type: 'success'
            });
            this.handleCurrentChange(1)
          })
        }).catch(() => {});
      },
      //多选
      selectChange(selection){
        this.selectList = selection
        console.log(selection);
      },
      handleCurrentChange(val) {
        this.tableRequest.pageNum = val
        this.getTableData()
      },
      handleSizeChange(val) {
        this.tableRequest.pageSize = val
        this.handleCurrentChange(1)
      },
      getTableData(){
        this.isLoad = true
        this.$http.post("/customer/pager",this.tableRequest).then(res => {
          this.totalCount = res.data.pagination.totalCount
          this.tableData = res.data.resultData
          this.isLoad = false
        })
      }
    }
  }
</script>
<template>
<el-container>
     <div class="main-bg">
    <div class="main-inside" >
    <div class="assets-info-container">
      <el-container v-loading="isLoad">
        <el-header class="assets-info-header" height="60px">
          <div class="select-label" style="display:inline-block;">
            资产类型
          </div>
          <el-select v-model="assetPagerData.paramData.assetType" @change="handleCurrentChange(1)">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="select-label" style="display:inline-block;">
            资产状态
          </div>
          <el-select v-model="assetPagerData.paramData.state" @change="handleCurrentChange(1)">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input class="search-input" placeholder="请输入内容" v-model="searchValue">
            <el-select v-model="selectValue" slot="prepend" placeholder="请选择">
              <el-option label="资产编号" value="id"></el-option>
              <el-option label="资产名称" value="name"></el-option>
              <el-option label="资产描述" value="remark"></el-option>
                  <el-option label="序列号码" value="serialNum"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"  @click="searchAssets"></el-button>
          </el-input>
        </el-header>
        <el-main>
          <el-table
            :data="tableData"
            empty-text="暂无数据"
            border>
            <el-table-column
              prop="assetId"
              label="资产编号"
              min-width="1">
            </el-table-column>
            <el-table-column
              prop="assetName"
              label="资产名称"
              min-width="1">
            </el-table-column>
            <el-table-column
              label="资产类型"
              min-width="1">
              <template slot-scope="scope">
                {{typeOptions.filter(item => item.value == scope.row.assetType)[0].label}}
              </template>
            </el-table-column>
            <el-table-column
              label="资产状态"
              min-width="1">
              <template slot-scope="scope">
                {{stateOptions.filter(item => item.value == scope.row.state)[0].label}}
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="资产描述"
              min-width="2">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="使用人"
              align="center"
              min-width ="1"
            >
            </el-table-column>
            <el-table-column
              label="入库时间"
              min-width="1">
              <template slot-scope="scope">
                {{scope.row.addTime.toLocaleString().slice(0,10)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="serialNum"
              label="资产序列号"
              min-width="1">
            </el-table-column>
            <el-table-column
              prop="orderId"
              label="采购编号/订单编号"
              min-width="1">
            </el-table-column>
            <el-table-column
              prop="price"
              label="购买价格"
              min-width="1">
              <template slot-scope="scope">
                {{Number(scope.row.price).toFixed(2)}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80px">
              <template slot-scope="scope">
                 <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                  <i class="hover-i el-icon-edit-outline"  @click="openDialog(scope.row)"></i>
                 </el-tooltip > 
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer class="assets-info-footer">
          <div class="footer-left">
            <!-- 显示第 {{(assetPagerData.pageNum-1)*assetPagerData.pageSize+1}}
            到第 {{assetPagerData.pageNum*assetPagerData.pageSize > totalCount?totalCount:assetPagerData.pageNum*assetPagerData.pageSize}} 条记录， -->
            <!-- 共 {{totalCount}} 条 -->
          </div>
          <div class="footer-right">
            <el-pagination
            v-if="totalCount"
              small
              :current-page="assetPagerData.pageNum"
              :page-size="assetPagerData.pageSize"
              :page-sizes="[5, 10, 20, 30]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </el-footer>
      </el-container>
      <el-dialog title="资产修改" width="400px" :visible.sync="dialogVisible">
        <el-form :inline="true" :model="dialogForm" label-width="100px">
              <el-form-item label="资产名称" >
                <el-input v-model="dialogForm.assetName" ></el-input>
              </el-form-item>
              <el-form-item label="资产类型" >
                <el-select v-model="dialogAsset.assetType" placeholder="请选择">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资产编号" >
                <el-input v-model="dialogAsset.assetId" ></el-input>
              </el-form-item>
             
              <el-form-item label="序列号码" >
                <el-input v-model="dialogForm.serialNum" ></el-input>
              </el-form-item>
              <el-form-item label="采购编号" >
                <el-input v-model="dialogForm.orderId" ></el-input>
              </el-form-item>
              <el-form-item label="购买价格" >
                <el-input v-model="dialogForm.price" ></el-input>
              </el-form-item>
              <el-form-item label="入库时间" >
                <el-date-picker
                  v-model="dialogAsset.addTime"
                  type="date"
                  @change="handlePick"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            <el-form-item label="资产描述" >
                <el-input type="textarea" v-model="dialogForm.remark"></el-input>
              </el-form-item>
         
        </el-form>
        <div slot="footer">
          <el-button type="danger" @click="dialogVisible=false">取消</el-button>
          <el-button  @click="updateAsset">确定</el-button>
        </div>
      </el-dialog>
    </div>

    </div>
    </div> 
  </el-container>
</template>

<script>
import '@/styles/Assets/info.scss'

export default {
  name: 'info',
  data(){
    return {
      isLoad:false,
      selectValue:"name",
      searchValue:"",
      tableData:[],
      totalCount:0,
      assetPagerData:{
        pageNum:1,
        pageSize:10,
        paramData:{
          assetId:null,
          assetName:null,
          assetType:null,
          state:null
        }
      },
      typeOptions:[
        {value:null,label:"所有"},
        {value:11,label:"电子设备"},
        {value:12,label:"易耗品"},
        {value:20,label:"家具/工具/器具"},
        {value:30,label:"机械设备"},
        {value:40,label:"房屋建筑"},
        {value:50,label:"运输工具"},
        {value:60,label:"其他"}
      ],
      stateOptions:[
        {value:null,label:"所有"},
        {value:1,label:"在库"},
        {value:2,label:"借出"},
        {value:3,label:"报修"}
      ],
      //修改弹窗
      dialogVisible:false,
      dialogAsset:{},
      dialogForm:{
        assetName:"",
        serialNum:"",
        orderId:"",
        price:0,
        remark:""
      }
    }
  },
  mounted(){
    this.getTableData()
  },
  methods:{
    handlePick(val){
      console.log(val)
      this.dialogForm.addTime=val
    },
    //搜索
    searchAssets(){
       if(this.searchValue == ''){
        this.assetPagerData.paramData.assetId = null
        this.assetPagerData.paramData.assetName = null
        this.assetPagerData.paramData.serialNum=null
        this.assetPagerData.paramData.remark=null
      }else{
        if(this.selectValue == "id"){
          this.assetPagerData.paramData.assetId = this.searchValue
          this.assetPagerData.paramData.assetName = null
          this.assetPagerData.paramData.serialNum=null
          this.assetPagerData.paramData.remark=null
        }else if(this.selectValue == "name"){
          this.assetPagerData.paramData.assetId = null
          this.assetPagerData.paramData.serialNum=null
          this.assetPagerData.paramData.remark=null
          this.assetPagerData.paramData.assetName = this.searchValue
        }else if(this.selectValue == "serialNum"){
          this.assetPagerData.paramData.assetId = null
          this.assetPagerData.paramData.assetName=null
          this.assetPagerData.paramData.remark=null
          this.assetPagerData.paramData.serialNum = this.searchValue
        }else if(this.selectValue == "remark"){
          this.assetPagerData.paramData.assetId = null
          this.assetPagerData.paramData.assetName=null
          this.assetPagerData.paramData.serialNum=null
          this.assetPagerData.paramData.remark = this.searchValue
        }
      }
      this.handleCurrentChange(1)
    },
    //修改弹窗
    openDialog(row){
     
      this.dialogVisible = true
      this.dialogAsset = row
      this.dialogForm = {
        assetName:row.assetName,
        serialNum:row.serialNum,
        orderId:row.orderId,
        price:row.price,
        remark:row.remark,
        assetId:row.assetId,
        addTime:row.addTime,
        assetType:row.assetType
      }
      console.log(this.dialogForm)
    },
    //提交修改
    updateAsset(){
      
      let length =Object.values(this.dialogForm).filter(item=>(item)).length
      if((length==7&&!this.dialogForm.serialNum)||length===8){
        if(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(this.dialogForm.price)){
          this.dialogForm.price = parseFloat(Number(this.dialogForm.price).toFixed(2))
          console.log(this.dialogForm)
          this.dialogForm.addTime=new Date(this.dialogForm.addTime)
          this.$http.post("/asset/update",this.dialogForm).then(res => {
            this.dialogVisible = false
            this.getTableData()
            this.$notify({
              title: '成功',
              message: '资产信息修改成功',
              type: 'success'
            });
          })
        }else{
          this.$message({
            message:'购买价格格式不正确,最多保留两位小数',
            type:'warning'
          });
        }
      }else{
        this.$message({
          message:'除序列号外，所有选项必须填写',
          type:'warning'
        });
      }
    },
    //切换当前页
    handleCurrentChange(val) {
      this.assetPagerData.pageNum = val
      this.getTableData()
    },
    //切换每页条数
    handleSizeChange(val) {
      this.assetPagerData.pageSize = val
      this.handleCurrentChange(1)
    },
    //获取资产信息
    getTableData(){
      this.isLoad = true
      this.$http.post("/asset/pager",this.assetPagerData).then(res => {
        //console.log(res.data)
        this.totalCount = res.data.pagination.totalCount
        this.tableData = res.data.resultData
        this.isLoad = false
      })
    }
  }
}
</script>

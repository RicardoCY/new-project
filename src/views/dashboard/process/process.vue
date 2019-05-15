<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside">
        <div class="container">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="全部流程" name="first">
              <el-col :span="8" v-for="(item,index) in router" :key="index">
                <h2 style="height:40px;margin-right:15px;border-bottom:2px solid #ccc;">
                  <div
                    style="float:left;height:40px;line-height:38px;border-bottom:2px solid #67C23A;"
                  >{{item.meta.title}}</div>
                  <div
                    style="float:left;height:40px;line-height:38px;border-bottom:2px solid #67C23A;color:#999;"
                  >（{{item.children.length}}）</div>
                </h2>
                <router-link
                  tag="p"
                  class="routers-box"
                  :to="item.path+'/'+child.path"
                  v-for="(child,index) in item.children"
                  :key="index"
                >
                  <i style="color: #67C23A" class="el-icon-caret-right"></i>
                  <a href="#" class="routers">{{child.meta.title }}</a>
                </router-link>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="草稿箱" name="second">
              <el-container v-loading="draftsLoad">
                <el-header height="auto" style="padding-bottom:10px;">
                  <div>
                    <div class="type-l" style="font-size:14px">
                      类型
                    </div>
                    <div  class="type-r" >
                      <el-cascader
                        v-model="draftsType"
                        :options="options3"
                        :show-all-levels="false"
                        @change="draftsTypeChange"
                      ></el-cascader>
                    </div>
                  </div>
                  
                
                </el-header>
                <el-main style="padding-top:0;cursor: pointer;">
                  <el-table :data="draftsData" @row-click="RowClick" border>
                    <el-table-column prop="title" label="标题" min-width="200">
                      <template slot-scope="scope">
                        <span class="table-column-title">{{ scope.row.title}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="processType" label="类型" min-width="80"></el-table-column>
                    <el-table-column prop="applicant" label="申请人" min-width="80"></el-table-column>
                    <el-table-column prop="createdTime" label="日期" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.createdTime.slice(0,10)}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-main>
                <el-footer
                  height="auto"
                  style="text-align:center;padding-top:10px;"
                >
                  <el-pagination
                  v-if="draftsTotal"
                    small
                    :current-page="draftsRequest.pageNum"
                    :page-size="draftsRequest.pageSize"
                    @current-change="draftsCurrentChange"
                    layout="prev, pager, next"
                    :total="draftsTotal"
                  ></el-pagination>
                </el-footer>
              </el-container>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "process",
  data() {
    return {
      defaultBegin: 0,
      defaultSize: 10,
      activeName: "second",
      loadingShow: false,
      tableData: [],
      value7: "",
      options3: [
        {
          value: "全部",
          label: "全部"
        },
        {
          value: "考勤管理",
          label: "考勤管理",
          children: [
            {
              value: "请假申请",
              label: "请假申请"
            },
            {
              value: "考勤申诉",
              label: "考勤申诉"
            }
          ]
        },
        {
          value: "资产管理",
          label: "资产管理",
          children: [
            {
              value: "资产入库",
              label: "资产入库"
            },
            {
              value: "资产领用",
              label: "资产领用"
            },
            {
              value: "资产借用",
              label: "资产借用"
            },
            {
              value: "资产归还",
              label: "资产归还"
            },
            {
              value: "资产维修",
              label: "资产维修"
            }
          ]
        }
      ],
      router: [],
      //3月22草稿箱接口修改
      draftsLoad: false,
      draftsType: ["全部"],
      draftsData: [],
      draftsTotal: 0,
      draftsRequest: {
        pageNum: 1,
        pageSize: 7,
        paramData: {
          processType: null,
          state: 0
        }
      }
    };
  },

  methods: {
    // tab 切换
    handleClick() {},
    //新建流程路由
    getRoutes() {
      let route = this.$router.options.routes;
      //过滤所需标签
      this.router = route.filter(item => {
        if (item.meta) {
          return item.meta.title == "资产管理" || item.meta.title == "考勤管理";
        }
      });
    },
    // //初始化草稿箱
    // async initDrafts(){
    //   this.loadingShow=true
    //   try {
    //     let res =await this.$http.get(`task/drafts`)
    //     console.log(res.data)
    //     this.tableData=res.data
    //   }catch (e) {
    //     this.$notify({
    //       title: '错误',
    //       message: '请求失败',
    //       type: 'error'
    //     })
    //   }finally{
    //     this.loadingShow=false
    //   }
    // },
    // //pageChange
    // pageChange(val){
    //   this.defaultSize=10*val
    //   this.defaultBegin=this.defaultSize-10
    // },

    //获取草稿箱列表
    getDraftsData() {
      this.draftsLoad = true;
      if (!this.draftsRequest.paramData.processType) {
        delete this.draftsRequest.paramData.processType;
      }
      this.$http.post("/task/process/pager", this.draftsRequest).then(res => {
        this.draftsTotal = res.data.pagination.totalCount;
        this.draftsData = res.data.resultData;
        this.draftsLoad = false;
      });
    },
    //草稿箱当前页
    draftsCurrentChange(val) {
      this.draftsRequest.pageNum = val;
      this.getDraftsData();
    },
    //草稿箱类型选择
    draftsTypeChange(val) {
      let draftsType = this.draftsType[this.draftsType.length - 1];
      if (draftsType == "全部") {
        this.draftsRequest.paramData.processType = null;
      } else {
        this.draftsRequest.paramData.processType = draftsType;
      }
      this.draftsCurrentChange(1);
    },
    //跳转相关操作详情
    RowClick(row) {
      console.log(row);
      //'资产入库'  '资产领用'  '资产借用'  '资产归还'  '资产维修'
      if (row.processType == "资产入库") {
        this.$router.push({
          path: "/assets/index",
          query: {
            state: "草稿箱",
            applyId: row.applyId
          }
        });
      }
      if (row.processType == "资产领用") {
        this.$router.push({
          path: "/assets/grant",
          query: {
            state: "草稿箱",
            applyId: row.applyId
          }
        });
      }
      if (row.processType == "资产借用") {
        this.$router.push({
          path: "/assets/borrow",
          query: {
            state: "草稿箱",
            applyId: row.applyId
          }
        });
      }
      if (row.processType == "资产归还") {
        this.$router.push({
          path: "/assets/return",
          query: {
            state: "草稿箱",
            applyId: row.applyId
          }
        });
      }
      if (row.processType == "资产维修") {
        this.$router.push({
          path: "/assets/Repair",
          query: {
            state: "草稿箱",
            applyId: row.applyId
          }
        });
      }
      if (row.processType == "请假申请") {
        this.$router.push({
          path: "/leaveAdmin/employeeLeave",
          query: {
            state: "darf",
            applyId: row.applyId
          }
        });
      }
    }
  },
  mounted() {
    this.getRoutes(); //获取路由
    //this.initDrafts()  //获取草稿箱
    this.draftsRequest.paramData.applicant = JSON.parse(
      Cookies.get("userInfo")
    ).userId;
    this.getDraftsData();
  }
};
</script>

<style rel="stylesheet/scss" scoped lang="scss">
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.container {
  overflow: hidden;
  .routers-box {
    height: 32px;
    line-height: 32px;
    margin-right: 15px;
    border-bottom: 1px dashed #ccc;
  }
  .routers {
    font-size: 14px;
    margin-left: 10px;
    color: #409eff;
  }
}
</style>
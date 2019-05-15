<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside">
        <div class="container mine-request">
          <el-tabs @tab-click="changeTab" v-model="tabVal" type="card">
            <el-tab-pane name="我的请求" :label="`我的请求(${tableCount})`">
              <el-table
                :data="tableData"
                highlight-current-row
                @current-change="handleCurrentChange"
                border
              >
                <el-table-column prop="title" label="请假标题" min-width="250"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间" min-width="100"></el-table-column>
                <el-table-column prop="hours" width="200" label="请假时长(小时)"></el-table-column>
                <el-table-column prop="message" min-width="200" label="请假说明"></el-table-column>

                <el-table-column prop="state" label="当前状态" min-width="150">
                  <template slot-scope="scope">
                    <span>{{parseState[scope.row.state]}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                v-if="tableCount"
                 small
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
                  :total="tableCount"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane name="被驳回" :label="`被驳回(${rejectCount})`">
              <el-table
                
                :data="rejectData"
                highlight-current-row
                @current-change="handleCurrentChange"
                border
              >
                <el-table-column prop="title" label="请假标题" min-width="250"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间" min-width="100"></el-table-column>
                <el-table-column prop="hours" width="200" label="请假时长(小时)"></el-table-column>
                <el-table-column prop="message" min-width="200" label="请假说明"></el-table-column>

                <el-table-column prop="state" label="当前状态" min-width="150">
                  <template slot-scope="scope">
                    <span>{{parseState[scope.row.state]}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                v-if="rejectCount"
                small
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
                  :total="rejectCount"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane name="审批中" :label="`审批中(${processCount})`">
              <el-table
              
                :data="processDate"
               
                highlight-current-row
                @current-change="handleCurrentChange"
                border
              >
                <el-table-column prop="title" label="请假标题" min-width="250"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间" min-width="100"></el-table-column>
                <el-table-column prop="hours" width="200" label="请假时长(小时)"></el-table-column>
                <el-table-column prop="message" min-width="200" label="请假说明"></el-table-column>

                <el-table-column prop="state" label="当前状态" min-width="150">
                  <template slot-scope="scope">
                    <span>{{parseState[scope.row.state]}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                v-if="processCount"
                small
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
                  :total="processCount"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane name="已归档" :label="`已归档(${endCount})`">
              <el-table
             
                :data="endDate"
                highlight-current-row
                @current-change="handleCurrentChange"
                border
              >
                <el-table-column prop="title" label="请假标题" min-width="250"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间" min-width="100"></el-table-column>
                <el-table-column prop="hours" width="200" label="请假时长(小时)"></el-table-column>
                <el-table-column prop="message" min-width="200" label="请假说明"></el-table-column>
                <el-table-column prop="state" label="当前状态" min-width="150">
                  <template slot-scope="scope">
                    <span>{{parseState[scope.row.state]}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination
                v-if="endCount"
                small
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
                  :total="endCount"
                ></el-pagination>
              </div>
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
  name: "leaveSearch",
  data() {
    return {
      tabVal: "我的请求", //1.我的请求， 2驳回。3审批中 4 已归档
      nowPage: 1,
      tableCount: 0,
      rejectCount: 0,
      processCount: 0,
      endCount: 0,
      tableData: [],
      rejectData: [],
      processDate: [],
      endDate: [],
      parseState: {
        2: "部门经理审批",
        3: "部门经理驳回",
        4: "总经理审核审批",
        5: "总经理驳回",
        6: "人事备案",
        7: "任务完成"
      }

      //requestType:1 //1.我的请求， 2驳回。3审批中 4 已归档
    };
  },
  methods: {
    //处理tabs 切换
    changeTab(tab, e) {
      // console.log(this.tabVal)
    },
    //跳转页面
    handlePageChange(val) {
      console.log(val);
      switch (this.tabVal) {
        case "我的请求":
          this.initList(val, 1);
          break;
        case "被驳回":
          this.initList(val, 2, [3, 5]);
          break;
        case "审批中":
          this.initList(val, 3, [2, 4]);
          break;
        case "已归档":
          this.initList(val, 4, [7]);
          break;
      }
      // this.initList(val)
    },
    //(1.未提交 2.部门经理审批 3.部门经理驳回 4.总经理审核审批 5.总经理驳回 6.人事备案 7.任务完成)
    async initList(nowPage, type, list = [2, 3, 4, 5, 6, 7]) {
      try {
        let res = await this.$http.post(`oaLeave/pager`, {
          pageNum: nowPage,
          pageSize: 10,
          paramData: {
            state: list,
            userId: JSON.parse(Cookies.get("userInfo")).userId
          }
        });
        switch (type) {
          case 1:
            this.tableData = res.data.resultData;
            this.tableCount = res.data.pagination.totalCount;
            break;
          case 2:
            this.rejectData = res.data.resultData;
            this.rejectCount = res.data.pagination.totalCount;
            break;
          case 3:
            this.processDate = res.data.resultData;
            this.processCount = res.data.pagination.totalCount;
            break;
          case 4:
            this.endDate = res.data.resultData;
            this.endCount = res.data.pagination.totalCount;
            break;
        }
      } catch (e) {
        this.$notify({
          title: "警告",
          message: "数据请求失败",
          type: "error"
        });
      }
    },
    handleCurrentChange(val) {
      console.log(val.state);
      this.$router.push({
        name: "Detail",
        query: {
          type: "请假申请",
          applyId: val.id,
          state: val.state,
          processId: val.processId,
          taskId: val.taskId,
          nowTab: this.tabVal
        }
      });
    }
  },
  mounted() {
    this.initList(1, 1);
    this.initList(1, 2, [3, 5]);
    this.initList(1, 3, [2, 4, 6]);
    this.initList(1, 4, [7]);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pagination-container {
  margin-top: 40px;
}
</style>

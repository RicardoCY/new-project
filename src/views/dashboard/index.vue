<template>
  <el-container>
    <div class="main-bg">
      <div class="dashboard-index-container">
        <div class="main-inside">
          <h3>流程中心</h3>
          <div class="home-container-info">
            <el-tabs v-model="activeName" @tab-click="changeTab" type="card" v-if="done">
              <el-tab-pane name="待办事宜" :label="`待办事宜(${todoList[0].list.length})`">
                <el-container v-loading="todoLoad">
                  <el-header height="auto" style="padding-bottom:10px;">
                    <!-- <el-row type="flex" align="middle">
                        <el-col :span="3" style="text-align:center;font-size:14px;">类型</el-col>
                        <el-col :span="9">
                          <el-cascader
                            v-model="todoType"
                            :options="options3"
                            :show-all-levels="false"
                            @change="todoTypeChange"
                          ></el-cascader>
                        </el-col>
                    </el-row>-->

                    <div>
                      <div class="type-l" style="font-size:14px;">类型</div>
                      <div class="type-r">
                        <el-cascader
                          v-model="todoType"
                          :options="options3"
                          :show-all-levels="false"
                          @change="todoTypeChange"
                        ></el-cascader>
                      </div>
                    </div>
                  </el-header>
                  <el-main style="padding-top:0;">
                    <el-table
                      :data="todoData"
                      @current-change="handleCurrentChange"
                      @row-click="todoDataRowClick"
                      border
                    >
                      <el-table-column prop="title" label="标题" min-width="600">
                        <template slot-scope="scope">
                          <span class="table-column-title">{{ scope.row.title}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="processType" label="类型" width="90"></el-table-column>
                      <el-table-column prop="applicant" label="申请人" width="80"></el-table-column>
                      <el-table-column prop="createdTime" label="日期" width="100">
                        <template slot-scope="scope">
                          <span>{{ scope.row.createdTime.slice(0,10)}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-main>
                  <el-footer height="auto" style="text-align:center;padding-top:10px;">
                    <el-pagination
                     v-if="todoTotal"
                      small
                      :current-page="todoRequest.pageNum"
                      :page-size="todoRequest.pageSize"
                      @current-change="todoCurrentChange"
                      layout="prev, pager, next"
                      :total="todoTotal"
                    ></el-pagination>
                  </el-footer>
                </el-container>
              </el-tab-pane>
              <el-tab-pane name="已办事宜" :label="`已办事宜(${doneList!=null?doneList[0].list.length:0})`">
                <el-container v-loading="doneLoad">
                  <el-header height="auto" style="padding-bottom:10px;">
                    <div>
                      <div class="type-l" style="font-size:14px;">类型</div>
                      <div class="type-r">
                        <el-cascader
                          v-model="doneType"
                          :options="options3"
                          :show-all-levels="false"
                          @change="doneTypeChange"
                        ></el-cascader>
                      </div>
                    </div>
                  </el-header>
                  <el-main style="padding-top:0;">
                    <el-table
                      :data="doneData"
                      @current-change="handleCurrentChange"
                      @row-click="doneDataRowClick"
                      border
                    >
                      <el-table-column prop="title" label="标题" min-width="600">
                        <template slot-scope="scope">
                          <span class="table-column-title">{{ scope.row.title}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="processType" label="类型" width="90"></el-table-column>
                      <el-table-column prop="applicant" label="申请人" width="80"></el-table-column>
                      <el-table-column prop="createdTime" label="日期" width="100">
                        <template slot-scope="scope">
                          <span>{{ scope.row.createdTime.slice(0,10)}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-main>
                  <el-footer height="auto" style="text-align:center;padding-top:10px">
                    <el-pagination
                    v-if="doneTotal"
                      small
                      :current-page="doneRequest.pageNum"
                      :page-size="doneRequest.pageSize"
                      @current-change="doneCurrentChange"
                      layout="prev, pager, next"
                      :total="doneTotal"
                    ></el-pagination>
                  </el-footer>
                </el-container>
              </el-tab-pane>
              <el-tab-pane name="请求" :label="`我的请求(${myList?myList[0].list.length:0})`">
                <el-container v-loading="myLoad">
                  <el-header height="auto" style="padding-bottom:10px;">
                    <el-row type="flex" align="middle">
                      <div class="type-l" style="font-size:14px;">类型</div>
                      <el-col :span="9">
                        <el-cascader
                          v-model="myType"
                          :options="options3"
                          :show-all-levels="false"
                          @change="myTypeChange"
                        ></el-cascader>
                      </el-col>
                      <div class="type-l" style="font-size:14px;">状态</div>
                      <el-col :span="9">
                        <el-select
                          v-model="myRequest.paramData.state"
                          @change="myStateChange"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-header>
                  <el-main style="padding-top:0;">
                    <el-table
                      :data="myData"
                      @current-change="handleCurrentChange"
                      @row-click="myDataRowClick"
                      border
                    >
                      <el-table-column prop="title" label="标题" min-width="600">
                        <template slot-scope="scope">
                          <span class="table-column-title">{{ scope.row.title}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="processType" label="类型" width="90"></el-table-column>
                      <el-table-column prop="state" label="状态" width="80">
                        <template
                          slot-scope="scope"
                        >{{options.filter(item => item.value == scope.row.state)[0].label}}</template>
                      </el-table-column>
                      <el-table-column prop="createdTime" label="日期" width="100">
                        <template slot-scope="scope">
                          <span>{{ scope.row.createdTime.slice(0,10)}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-main>
                  <el-footer height="auto" style="text-align:center;padding-top:10px;">
                    <el-pagination
                    v-if="myTotal"
                      small
                      :current-page="myRequest.pageNum"
                      :page-size="myRequest.pageSize"
                      @current-change="myCurrentChange"
                      layout="prev, pager, next"
                      :total="myTotal"
                    ></el-pagination>
                  </el-footer>
                </el-container>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="dashboard-index-asider">
          <div class="notify-container" v-loading="notifyLoad">
            <h3
              style="text-align:center;display:block;width:100%;height:40px;line-height:40px;margin-bottom:10px;"
            >
              <i
                class="el-icon-bell"
                style="height:40px;width:40px;background-color:#3A84FF;color:#fff;line-height:40px;border-radius:5px"
              ></i>
              <span style="color:#3A84FF">通知</span>
            </h3>
            <div
              style="height:50px;"
              class="notify-item"
              v-for="item in notifyData"
              :key="item.id"
              @click="ToNotifyDetail(item.id)"
            >
              <p style="height:25px;font-size:14px">
                <span class="notify-item-time">{{item.createdTime.slice(0,10)}}</span>
              </p>
              <p style="height:25px;font-size:14px">
                <span
                  class="notify-item-title"
                >{{item.title.length>20?item.title.slice(0,20)+'..':item.title}}</span>
              </p>
            </div>
            <div class="pagination-container">
              <el-pagination
              v-if="notifyTotal"
                small
                :current-page="notifyRequest.pageNum"
                :page-size="notifyRequest.pageSize"
                @current-change="notifyCurrentChange"
                layout="prev, pager, next"
                :total="notifyTotal"
              ></el-pagination>
            </div>
          </div>
          <div style="margin-top:40px">
            <h3
              style="text-align:center;display:block;width:100%;height:40px;line-height:40pxa;margin-bottom:10px;"
            >
              <i
                class="el-icon-date"
                style="height:40px;width:40px;background-color:#50C984;color:#fff;line-height:40px;border-radius:5px"
              ></i>
              <span style="color:#50C984">日历</span>
            </h3>
          </div>
          <date-picker :inline="true" :language="dataPick.language" :value="dataPick.openDate"></date-picker>
        </div>
      </div>
    </div>

    <!-- <div class="dashboard-index-container">
          <div class="home-container" >
            <div class="home-container-info" v-loading="loadingShow">
              <div class="dashboard-index-header">
                <h3>流程中心</h3>
              </div>
              <el-tabs v-model="activeName"  @tab-click="changeTab" type="card" v-if="done">
                <el-tab-pane name="待办事宜" :label="`待办事宜(${todoList[0].list.length})`">
                  <el-container v-loading="todoLoad">
                    <el-header height="auto" style="padding-bottom:10px;border-bottom:1px solid #ccc;">
                      <el-row type="flex" align="middle">
                        <el-col :span="3" style="text-align:center;font-size:14px;">类型</el-col>
                        <el-col :span="9">
                          <el-cascader
                            v-model="todoType"
                            :options="options3"
                            :show-all-levels="false"
                            @change="todoTypeChange"
                          ></el-cascader>
                        </el-col>
                      </el-row>
                    </el-header>
                    <el-main style="padding-top:0;">
                      <el-table
                        :data="todoData"
                        @current-change="handleCurrentChange"
                        @row-click="todoDataRowClick"
                        height="380px"
                        border
                      >
                        <el-table-column
                          prop="title"
                          label="标题"
                          width="600">
                          <template slot-scope="scope">
                            <span class="table-column-title">{{ scope.row.title}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="processType"
                          label="类型"
                          width="90">
                        </el-table-column>
                        <el-table-column
                          prop="applicant"
                          label="申请人"
                          width="80">
                        </el-table-column>
                        <el-table-column
                          prop="createdTime"
                          label="日期"
                          width="100">
                          <template slot-scope="scope">
                            <span>{{ scope.row.createdTime.slice(0,10)}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-main>
                    <el-footer height="auto" style="text-align:center;padding-top:10px;border-top:1px solid #ccc;">
                      <el-pagination
                        small
                        :current-page="todoRequest.pageNum"
                        :page-size="todoRequest.pageSize"
                        @current-change="todoCurrentChange"
                        layout="prev, pager, next"
                        :total="todoTotal">
                      </el-pagination>
                    </el-footer>
                  </el-container>
                </el-tab-pane>
                <el-tab-pane name="已办事宜" :label="`已办事宜(${doneList!=null?doneList[0].list.length:0})`">
                  <el-container v-loading="doneLoad">
                    <el-header height="auto" style="padding-bottom:10px;border-bottom:1px solid #ccc;">
                      <el-row type="flex" align="middle">
                        <el-col :span="3" style="text-align:center;font-size:14px;">类型</el-col>
                        <el-col :span="9">
                          <el-cascader
                            v-model="doneType"
                            :options="options3"
                            :show-all-levels="false"
                            @change="doneTypeChange"
                          ></el-cascader>
                        </el-col>
                      </el-row>
                    </el-header>
                    <el-main style="padding-top:0;">
                      <el-table
                        :data="doneData"
                        @current-change="handleCurrentChange"
                        @row-click="doneDataRowClick"
                        height="380px"
                        border
                      >
                        <el-table-column
                          prop="title"
                          label="标题"
                          width="600">
                          <template slot-scope="scope">
                            <span class="table-column-title">{{ scope.row.title}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="processType"
                          label="类型"
                          width="90">
                        </el-table-column>
                        <el-table-column
                          prop="applicant"
                          label="申请人"
                          width="80">
                        </el-table-column>
                        <el-table-column
                          prop="createdTime"
                          label="日期"
                          width="100">
                          <template slot-scope="scope">
                            <span>{{ scope.row.createdTime.slice(0,10)}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-main>
                    <el-footer height="auto" style="text-align:center;padding-top:10px;border-top:1px solid #ccc;">
                      <el-pagination
                        small
                        :current-page="doneRequest.pageNum"
                        :page-size="doneRequest.pageSize"
                        @current-change="doneCurrentChange"
                        layout="prev, pager, next"
                        :total="doneTotal">
                      </el-pagination>
                    </el-footer>
                  </el-container>
                </el-tab-pane>
                <el-tab-pane name="请求" :label="`我的请求(${myList?myList[0].list.length:0})`">
                  <el-container v-loading="myLoad">
                    <el-header height="auto" style="padding-bottom:10px;border-bottom:1px solid #ccc;">
                      <el-row type="flex" align="middle">
                        <el-col :span="3" style="text-align:center;font-size:14px;">类型</el-col>
                        <el-col :span="9">
                          <el-cascader
                            v-model="myType"
                            :options="options3"
                            :show-all-levels="false"
                            @change="myTypeChange"
                          ></el-cascader>
                        </el-col>
                        <el-col :span="3" style="text-align:center;font-size:14px;">状态</el-col>
                        <el-col :span="9">
                          <el-select v-model="myRequest.paramData.state" @change="myStateChange" placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-header>
                    <el-main style="padding-top:0;">
                      <el-table
                        :data="myData"
                        @current-change="handleCurrentChange"
                        @row-click="myDataRowClick"
                        height="380px"
                        border
                      >
                        <el-table-column
                          prop="title"
                          label="标题"
                          width="600">
                          <template slot-scope="scope">
                            <span class="table-column-title">{{ scope.row.title}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="processType"
                          label="类型"
                          width="90">
                        </el-table-column>
                        <el-table-column
                          prop="state"
                          label="状态"
                          width="80">
                          <template slot-scope="scope">
                            {{options.filter(item => item.value == scope.row.state)[0].label}}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="createdTime"
                          label="日期"
                          width="100">
                          <template slot-scope="scope">
                            <span>{{ scope.row.createdTime.slice(0,10)}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-main>
                    <el-footer height="auto" style="text-align:center;padding-top:10px;border-top:1px solid #ccc;">
                      <el-pagination
                        small
                        :current-page="myRequest.pageNum"
                        :page-size="myRequest.pageSize"
                        @current-change="myCurrentChange"
                        layout="prev, pager, next"
                        :total="myTotal">
                      </el-pagination>
                    </el-footer>
                  </el-container>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="home-container-slider">
              <div class="notify-container" v-loading="notifyLoad" >
                  <h3 style="text-align:center;display:block;width:100%;height:56px;line-height:56px">
                    <i class="el-icon-bell" style="height:56px;width:56px;background-color:#3A84FF;color:#fff;line-height:56px;border-radius:5px"></i>
                    <span style="color:#3A84FF">通知</span>
                    </h3>
                <div style="height:50px;" class="notify-item" v-for="item in notifyData" :key="item.id" @click="ToNotifyDetail(item.id)">
                  <p style="height:25px;" ><span class="notify-item-time"> {{item.createdTime.slice(0,10)}}</span></p>
                  <p style="height:25px;"><span class="notify-item-title">{{item.title.length>20?item.title.slice(0,20)+'..':item.title}}</span></p>
                </div>
                <div class="pagination-container">
                  <el-pagination
                    small
                    :current-page="notifyRequest.pageNum"
                    :page-size="notifyRequest.pageSize"
                    @current-change="notifyCurrentChange"
                    layout="prev, pager, next"
                    :total="notifyTotal">
                  </el-pagination>
                </div>
              </div>
              <div style="margin-top:60px">
                  <h3 style="text-align:center;display:block;width:100%;height:56px;line-height:56px">
                    <i class="el-icon-date" style="height:56px;width:56px;background-color:#50C984;color:#fff;line-height:56px;border-radius:5px"></i>
                    <span style="color:#50C984">日历</span>
                    </h3>
                </div>
                  
                  <date-picker
                    :inline="true"
                    :language="dataPick.language"
                    :value='dataPick.openDate'
                  ></date-picker>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>-->
  </el-container>
</template>

<script>
import "@/styles/Dashboard/index.scss";

import { mapGetters } from "vuex";
import DatePicker from "vuejs-datepicker";
import { zh } from "vuejs-datepicker/dist/locale";

export default {
  name: "dashboard",
  components: {
    DatePicker
  },
  data() {
    return {
      activeName: "待办事宜",
      options: [
        { value: null, label: "全部" },
        { value: 1, label: "审批中" },
        { value: 2, label: "被驳回" },
        { value: 3, label: "已归档" }
      ],
      stateValue: "",
      done: false,
      defaultBegin: 0,
      defaultSize: 10,
      loadingShow: false,
      dataPick: {
        language: zh,
        openDate: new Date()
      },
      todoList: null,
      doneList: null,
      myList: null,
      selectVal: "",
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

      //通知
      notifyLoad: false,
      notifyData: [],
      notifyTotal: 0,
      notifyRequest: {
        pageNum: 1,
        pageSize: 4,
        paramData: {
          isPublish: true
        }
      },
      //待办事宜
      todoLoad: false,
      todoType: ["全部"],
      todoData: [],
      todoTotal: 0,
      todoRequest: {
        pageNum: 1,
        pageSize: 7,
        paramData: {
          processIds: [],
          processType: null
        }
      },
      //已办事宜
      doneLoad: false,
      doneType: ["全部"],
      doneData: [],
      doneTotal: 0,
      doneRequest: {
        pageNum: 1,
        pageSize: 7,
        paramData: {
          processIds: [],
          processType: null
        }
      },
      //我的请求
      myLoad: false,
      myType: ["全部"],
      myData: [],
      myTotal: 0,
      myRequest: {
        pageNum: 1,
        pageSize: 7,
        paramData: {
          processIds: [],
          processType: null,
          state: null
        }
      }
    };
  },
  computed: {
    ...mapGetters(["name", "roles"])
  },
  methods: {
    changeTab(tab, e) {
      this.defaultBegin = 0;
      this.defaultSize = 10;
    },
    //跳转页
    // handleChange(val){
    //   this.defaultSize=10*val
    //   this.defaultBegin=this.defaultSize-10
    // },
    //初始化列表
    async initList() {
      this.loadingShow = true;
      try {
        let res = await this.$http.get("/task/process_center");
        this.todoList = res.data.filter(item => item.processType == "待办事宜");
        this.todoRequest.paramData.processIds = this.todoList[0].list;
        this.todoCurrentChange(1);
        this.doneList = res.data.filter(item => item.processType == "已办事宜");
        this.doneRequest.paramData.processIds = this.doneList[0].list;
        this.doneCurrentChange(1);
        this.myList = res.data.filter(item => item.processType == "我的请求");
        this.myRequest.paramData.processIds = this.myList[0].list;
        this.myCurrentChange(1);
        this.done = true;
        this.loadingShow = false;
      } catch (e) {
        this.$notify({
          title: "错误",
          message: e,
          type: "error"
        });
      }
    },
    //刷新流程中心
    refreshInitList() {
      this.initList();
    },

    //获取代办事宜列表
    getTodoData() {
      this.todoLoad = true;
      if (
        this.todoRequest.paramData.processType &&
        !this.todoRequest.paramData.processType
      ) {
        delete this.todoRequest.paramData.processType;
      }
      if (this.todoRequest.paramData.processIds.length > 0) {
        this.$http.post("/task/process/pager", this.todoRequest).then(res => {
          this.todoTotal = res.data.pagination.totalCount;
          this.todoData = res.data.resultData;
          this.todoLoad = false;
        });
      } else {
        this.todoTotal = 0;
        this.todoData = [];
        this.todoLoad = false;
      }
    },
    //代办事宜当前页
    todoCurrentChange(val) {
      this.todoRequest.pageNum = val;
      this.getTodoData();
    },
    //代办事宜类型选择
    todoTypeChange(val) {
      let todoType = this.todoType[this.todoType.length - 1];
      if (todoType == "全部") {
        this.todoRequest.paramData.processType = null;
      } else {
        this.todoRequest.paramData.processType = todoType;
      }
      this.todoCurrentChange(1);
    },

    //获取已办事宜列表
    getDoneData() {
      this.doneLoad = true;
      if (
        this.doneRequest.paramData.processType &&
        !this.doneRequest.paramData.processType
      ) {
        delete this.doneRequest.paramData.processType;
      }
      if (this.doneRequest.paramData.processIds.length > 0) {
        this.$http.post("/task/process/pager", this.doneRequest).then(res => {
          this.doneTotal = res.data.pagination.totalCount;
          this.doneData = res.data.resultData;
          this.doneLoad = false;
        });
      } else {
        this.doneTotal = 0;
        this.doneData = [];
        this.doneLoad = false;
      }
    },

    //已办事宜当前页
    doneCurrentChange(val) {
      this.doneRequest.pageNum = val;
      this.getDoneData();
    },
    //已办事宜类型选择
    doneTypeChange(val) {
      let doneType = this.doneType[this.doneType.length - 1];
      if (doneType == "全部") {
        this.doneRequest.paramData.processType = null;
      } else {
        this.doneRequest.paramData.processType = doneType;
      }
      this.doneCurrentChange(1);
    },

    //获取我的请求列表
    getMyData() {
      this.myLoad = true;
      if (
        this.myRequest.paramData.processType &&
        !this.myRequest.paramData.processType
      ) {
        delete this.myRequest.paramData.processType;
      }
      if (this.myRequest.paramData.state && !this.myRequest.paramData.state) {
        delete this.myRequest.paramData.state;
      }
      if (this.myRequest.paramData.processIds.length > 0) {
        this.$http.post("/task/process/pager", this.myRequest).then(res => {
          this.myTotal = res.data.pagination.totalCount;
          this.myData = res.data.resultData;
          this.myLoad = false;
        });
      } else {
        this.myTotal = 0;
        this.myData = [];
        this.myLoad = false;
      }
    },
    //我的请求当前页
    myCurrentChange(val) {
      this.myRequest.pageNum = val;
      this.getMyData();
    },
    //我的请求类型选择
    myTypeChange(val) {
      let myType = this.myType[this.myType.length - 1];
      if (myType == "全部") {
        this.myRequest.paramData.processType = null;
      } else {
        this.myRequest.paramData.processType = myType;
      }
      this.myCurrentChange(1);
    },
    //我的请求状态选择
    myStateChange() {
      this.myCurrentChange(1);
    },
    //跳转请假申请详情
    handleCurrentChange(val) {
      if (val.processType == "请假申请") {
        console.log(11111);
        console.log("审批状态：" + val.state);
        this.$router.push({
          name: "Detail",
          query: {
            type: val.processType,
            applyId: val.applyId,
            // state:val.state,
            processId: val.processId,
            taskId: val.taskId,
            applicant: val.applicant,
            createdTime: val.createdTime,
            todo: this.activeName == "first" ? 1 : 0,
            nowTab: this.activeName,
            processState: val.state
          }
        });
      }
      // window.open(this.$router.resolve({path: `/Detail/1`}).href, '_blank');
    },

    //跳转审批资产操作详情
    todoDataRowClick(row) {
      if (
        row.processType == "资产入库" ||
        row.processType == "资产领用" ||
        row.processType == "资产借用" ||
        row.processType == "资产归还" ||
        row.processType == "资产维修"
      ) {
        this.$router.push({
          name: "AssetsDetail",
          query: {
            processType: "待办事宜",
            state: row.state,
            title: row.processType,
            applyId: row.applyId,
            taskId: row.taskId
          }
        });
      }
    },
    doneDataRowClick(row) {
      if (
        row.processType == "资产入库" ||
        row.processType == "资产领用" ||
        row.processType == "资产借用" ||
        row.processType == "资产归还" ||
        row.processType == "资产维修"
      ) {
        this.$router.push({
          name: "AssetsDetail",
          query: {
            processType: "已办事宜",
            state: row.state,
            title: row.processType,
            applyId: row.applyId,
            taskId: row.taskId
          }
        });
      }
    },
    myDataRowClick(row) {
      if (
        row.processType == "资产入库" ||
        row.processType == "资产领用" ||
        row.processType == "资产借用" ||
        row.processType == "资产归还" ||
        row.processType == "资产维修"
      ) {
        this.$router.push({
          name: "AssetsDetail",
          query: {
            processType: "我的请求",
            state: row.state,
            title: row.processType,
            applyId: row.applyId,
            taskId: row.taskId
          }
        });
      }
    },
    handleClick(tab, event) {},
    filterTag(value, row) {
      return row.type === value;
    },
    //获取通知
    ToNotifyDetail(id) {
      //跳转通知详细
      window.open(
        this.$router.resolve({ path: `/NotifyDetail`, query: { id } }).href,
        "_blank"
      );
    },
    //刷新通知
    refreshNotify() {
      this.notifyCurrentChange(1);
    },
    //通知当前页
    notifyCurrentChange(val) {
      this.notifyRequest.pageNum = val;
      this.getNotifyData();
    },
    //获取通知
    getNotifyData() {
      this.notifyLoad = true;
      this.$http.post("/notify/pager", this.notifyRequest).then(res => {
        this.notifyTotal = res.data.pagination.totalCount;
        this.notifyData = res.data.resultData;
        this.notifyLoad = false;
      });
    }
  },
  mounted() {
    this.initList();
    this.getNotifyData();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
h3 {
  font-size: 24px;
}
.el-main {
  cursor: pointer;
}
[v-cloak] {
  display: none;
}
.pagination-container {
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}
.dashboard {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.datepicker-container {
  display: flex;
  justify-content: center;
}
</style>
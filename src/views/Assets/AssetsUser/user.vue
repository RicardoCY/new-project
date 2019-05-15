<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside">
        <el-container v-loading="isLoad">
          <el-row style="padding-top:0!important;width:100%">
            <h3 style="font-size:24px;">我的资产</h3>
            <el-table style="margin-top:20px" :data="tableData" empty-text="暂无资产" border>
              <el-table-column prop="assetId" label="资产编号" min-width="1"></el-table-column>
              <el-table-column prop="assetName" label="资产名称" min-width="1"></el-table-column>
              <el-table-column label="资产类型" min-width="1">
                <template
                  slot-scope="scope"
                >{{typeOptions.filter(item => item.value == scope.row.assetType)[0].label}}</template>
              </el-table-column>
              <el-table-column prop="remark" label="资产描述" min-width="2"></el-table-column>
              <el-table-column label="资产状态" min-width="1">
                <template
                  slot-scope="scope"
                >{{stateOptions.filter(item => item.value == scope.row.state)[0].label}}</template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-container>
      </div>
    </div>
  </el-container>
</template>

<script>
import "@/styles/Assets/user.scss";
import Cookies from "js-cookie";

export default {
  name: "user",
  data() {
    return {
      isLoad: false,
      userId: null,
      tableData: [],
      typeOptions: [
        { value: 11, label: "电子设备" },
        { value: 12, label: "易耗品" },
        { value: 20, label: "家具/工具/器具" },
        { value: 30, label: "机械设备" },
        { value: 40, label: "房屋建筑" },
        { value: 50, label: "运输工具" },
        { value: 60, label: "其他" }
      ],
      stateOptions: [{ value: 2, label: "在用" }, { value: 3, label: "报修" }]
    };
  },
  mounted() {
    this.userId = JSON.parse(Cookies.get("userInfo")).userId;
    //console.log(this.userId)
    if (this.userId) {
      this.getTableData();
    }
  },
  methods: {
    //获取个人资产列表
    getTableData() {
      this.isLoad = true;
      this.$http.get(`/asset/${this.userId}/list`).then(res => {
        console.log(res.data);
        this.tableData = res.data;
        this.isLoad = false;
      });
    }
  }
};
</script>
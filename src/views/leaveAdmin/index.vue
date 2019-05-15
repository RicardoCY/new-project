<template>
<el-container>
    <div class="main-bg">
      <div class="main-inside">
  <div class="app-container">
    <!--可用假期-->
    <h3 style="font-size: 24px;">我的假别</h3>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top:25px"
      height="400"
      border
    >
      <el-table-column
        prop="leaveType"
        label="假别"
        min-width="150">
         <template slot-scope="scope">
          <span>{{parseLeaveType[scope.row.leaveType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalTime"
        label="定额(小时)"
        width="100">
      </el-table-column>
      <el-table-column
        prop="availableTime"
        label="可用定额(小时)"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="beginDate"
        label="有效期开始"
        min-width="150"
        >
        <template slot-scope="scope">
          <span>{{scope.row.beginDate.slice(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="有效期结束"
        min-width="150"
        >
        <template slot-scope="scope">
          <span>{{scope.row.endDate.slice(0,10)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="新建假期"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            
            @click="handleLeave( scope.row)"
          >请假</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
       <p >
         <el-button type="text" @click="dialogVisible = true">点击查看假别细则</el-button>
       </p>
    </el-row>
    <!--细则弹窗-->
    <el-dialog
      title="假别细则"
      :visible.sync="dialogVisible"
      width="60%"
      >
      <div class="dialog">
        <p>一·年假</p>
        1.正式员工转正后可按照公司规定享受年假，员工连续工作满12个月以上的，可享受年假，年假期限为公历年度。员工累计工作年限已满1年不满10年的，年假5天；已满10年不满20年的，年假10天；已满20年的，年假15天；
        <br>
        2.员工在一个年度内有下列情形之一的，不享受当年的年假；如已享受，则进行倒扣
        <br>
        （1）事假累计超过30天（含）；
        <br>
        （2）累计工作满1年不满10年的员工，请病假累计2个月以上的；
        <br>
        （3）累计工作满10年不满20年的员工，已休病假累计3个月以上的；
        <br>
        （4）累计工作满20年以上的员工，已休病假累计4个月以上的；
        <br>
        3.已享有年假的员工与公司解除或终止劳动关系时，应休年假天数应按照员工在当年度在公司已工作日历天数折算，折算后不足1整天的部分不计为年假天数

        <p> 二·加班补休</p>
        1.按公司要求申报、并获批准为按“加班补休”方式补偿加班时数的正式员工，自获批准后的实际加班次月起半年内可享有相应小时的补休定额，员工根据工作情况妥善安排休假时间，在OA系统中填报休假申请并经部门审批人批准后方可补休；
        <br>
        2.如因工作原因无法安排补休的，可延期一次，延期不得超过180天；加班补休期间工资不变。
        <br>
        <p>三·司龄假</p>

        1.司龄假为公司福利假期，正式员工在公司连续工作满1年，享有1天司龄假；之后每满1年，增加1天，最多不超过5天；
        <br>
        2.正式员工在公司连续工作满12个月以上的，且享有的应休年假已全部休完，可请休司龄假，司龄假期限为公历年度（即每年的1月1日到12月31日）；
        <br>
        <p>四·婚假、孕检假、产假、陪产假、丧假</p>
        1.这些是临时的，由人事添加到系统后，员工申请，休假时长为正常国家法定节假日时长。
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  </div>
    </div>
  </el-container>
</template>
<script>
  import Cookie from 'js-cookie'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      parseLeaveType:{
        1:"年假",
        2:"事假",
        3:"病假",
        4:"婚假",
        5:"产假",
        6:"加班调休",
        7:"司龄假",
        8:"项目假",
        9:"陪产假"
      },
      tableData: []
    }
  },
  filters: {

  },
  mounted() {
    this.fetchData()
  },
  methods: {

    async fetchData() {
      try {
        let res = await this.$http.get(`leave/list/${JSON.parse(Cookie.get('userInfo')).jobNum}`) //用户ID
        this.tableData=res.data
        console.log(this.tableData)
      }catch (e) {
        this.$notify({
          title: '警告',
          message: '数据请求失败',
          type: 'error'
        });
      }
    },
    handleLeave(val){
      console.log(val)
      this.$router.push({ name:'employeeLeave', params: {
        LeaveName: val.leaveType ,
        id:val.id
      }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.dialog{
  p{
    margin: 10px 0;
  }
}
</style>

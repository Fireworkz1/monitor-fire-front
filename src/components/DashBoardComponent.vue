<script>


import axios from "@/axios";

export default {
  name: 'DashboardComponent',
  methods: {
    async getdata() {
      try {
        // 模拟登录请求
        const response = await axios.get('/dashboard/basicInfo');
        console.log(response)
        this.serverNum=response.data.serverNum;
        this.microserviceNum=response.data.softwareNum;
        this.userNum=response.data.userNum;
        this.warningRuleNum=response.data.warnNum;
        this.dbNum=response.data.dbNum;
        this.cacheNum=response.data.cacheNum;
        this.totalWarningNum=65;
        this.hisWarningNum=45;
        //todo:这里修改为实际数量
      } catch (error) {
        // 登录失败，显示错误信息
        this.$message(error.message);
        this.$router.push('/login');
      }
    }
  },
  props: {
    msg: String
  }, data() {
    return {
      serverNum: null,
      microserviceNum: null,
      userNum:null,
      warningRuleNum:null,
      hisWarningNum:null,
      totalWarningNum:null,
      dbNum:null,
      cacheNum:null,

      error: ''
    };
  },mounted() {
    this.getdata();
  }
}
</script>

<template>
  <div>
    <el-row :gutter="35" style="margin-top: 30px">
      <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>监控服务器数<br><br>     <h2>{{serverNum}}</h2></h4></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>监控微服务数<br><br>     <h2>{{microserviceNum}}</h2></h4></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>监控数据库数<br><br>     <h2>{{dbNum}}</h2></h4></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>监控缓存数量<br><br>     <h2>{{cacheNum}}</h2></h4></div></el-col>
  </el-row>
    <el-row :gutter="35" style="margin-top: 60px">

      <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>系统注册人数<br><br>     <h2>{{userNum}}</h2></h4></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>告警规则条数<br><br>     <h2>{{warningRuleNum}}</h2></h4></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>总计告警次数<br><br>     <h2>{{totalWarningNum}}</h2></h4></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>处理告警数量<br><br>     <h2>{{hisWarningNum}}</h2></h4></div></el-col>
    </el-row>
  </div>

</template>

<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;

}
.grid-content {
  border-radius: 16px;
  min-height: 250px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
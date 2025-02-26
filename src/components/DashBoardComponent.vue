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
        this.warningNum=response.data.warnNum;
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
      warningNum:null,

      error: ''
    };
  },mounted() {
    this.getdata();
  }
}
</script>

<template>
  <el-row :gutter="35" style="margin-top: 60px">
    <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>监控服务器数：<br><br>     {{serverNum}}</h4></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>监控微服务数：<br><br>     {{microserviceNum}}</h4></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>系统注册人数：<br><br>     {{userNum}}</h4></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light" style="display: flex; justify-content: center; align-items: center; height: 100%;"><h4>告警规则条数：<br><br>     {{warningNum}}</h4></div></el-col>
  </el-row>
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
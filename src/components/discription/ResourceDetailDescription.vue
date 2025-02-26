<script>



export default {
  props:["idd","type"],
  data(){
    return{
      res:{},
      resourceId:null,

    }
  }
  ,methods:{
    getHard(){

    },
    getSoft(){

    },
  },components:{


  },mounted() {
    this.resourceId=this.idd;
    // console.log(this.idd);
    console.log(this.type);
    if(this.type==="server"){
      // this.hardwareDetailRes=this.getHard();
      this.res=this.hardwareDetailRes;
    }else{
      // this.softwareDetailRes=this.getSoft();
      this.res=this.softwareDetailRes;
    }
  }
}
</script>

<template>
  <div>

    <el-descriptions >
      <el-descriptions-item label="资源id">11</el-descriptions-item>
      <el-descriptions-item label="资源名称">123</el-descriptions-item>
      <el-descriptions-item label="资源是否在线">
        <el-tag size="small">学校</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="监控Jobname">18100000000</el-descriptions-item>
      <el-descriptions-item label="监控实例">苏州市</el-descriptions-item>
      <el-descriptions-item label="资源ip">苏州市</el-descriptions-item>
      <el-descriptions-item label="Port" v-if="this.type==='software'">port</el-descriptions-item>
      <el-descriptions-item label="启动方式" v-if="this.type==='software'">方式</el-descriptions-item>
      <el-descriptions-item label="资源类型">苏州市</el-descriptions-item>
      <el-descriptions-item label="采集器类型">苏州市</el-descriptions-item>
      <el-descriptions-item label="资源描述">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>

      <el-descriptions-item v-if="type==='server'" label="CPU核心数量">4</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="服务器总内存/GB">155</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="可用存储空间/GB">111</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="服务器启动时间/秒">12345</el-descriptions-item>
    </el-descriptions>
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
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
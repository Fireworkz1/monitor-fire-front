<script>



import axios from "@/axios";

export default {
  props:["idd","type"],
  data(){
    return{
      res:{},
      resourceId:null,
      softwareDetailRes:{
        prometheusUp: null,
        prometheusJobname: "",
        prometheusInstance: "",
        resouceId: null,
        resouceName: "",
        resouceIp: "",
        resourceType: "",
        exporterType: "",
        resourceDescription: "",
        resourcePort: "",
        startMode: ""
      },
      hardwareDetailRes:{
        prometheusUp: null, // Integer
        prometheusJobname: "", // String
        prometheusInstance: "", // String
        resouceId: null, // Integer
        resouceName: "", // String
        resouceIp: "", // String
        resourceType: "", // String
        exporterType: "", // String
        resourceDescription: "", // String

        prometheusCpuNums: "", // String
        prometheusTotalMemoryGBs: null, // Double
        prometheusAvailableFileGBs: null, // Double
        prometheusServerloadtime: "", // String
        machine: "", // String
        sysname: "", // String
        version: "", // String
        nodename: "" // String
      }

    }
  }
  ,methods:{
    async getHard() {
      try{
        this.hardwareDetailRes= (await axios.post('/resource/selectServerDetail', null, {
          params: {
            id:this.idd
          }
        })).data;
        this.res=this.hardwareDetailRes;
      }catch (error){
        this.$message.error(error)
      }

    },
    async getSoft() {
      try {
        this.softwareDetailRes=(await axios.post('/resource/selectSoftwareDetail', null, {
          params: {
            id: this.idd
          }
        })).data;
        this.res=this.softwareDetailRes;
      } catch (error) {
        this.$message.error(error)
      }
    },
  },components:{


  },mounted() {
    this.resourceId=this.idd;
    // console.log(this.idd);
    console.log(this.type);
    if(this.type==="server"){
      this.getHard();
    }else{
      this.getSoft();
    }
  }
}
</script>

<template>
  <div>

    <el-descriptions >
      <el-descriptions-item label="资源id">{{this.res.resourceId}}</el-descriptions-item>
      <el-descriptions-item label="资源名称">{{this.res.resourceName}}</el-descriptions-item>
      <el-descriptions-item label="资源是否在线">
        <el-tag size="small">{{ this.res.prometheusUp }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="监控Jobname">{{ this.res.prometheusJobname }}</el-descriptions-item>
      <el-descriptions-item label="监控实例">{{ this.res.prometheusInstance }}</el-descriptions-item>
      <el-descriptions-item label="资源ip">{{ this.res.resourceIp }}</el-descriptions-item>
      <el-descriptions-item label="Port" v-if="this.type==='software'">{{ this.res.resourcePort }}</el-descriptions-item>
      <el-descriptions-item label="启动方式" v-if="this.type==='software'">{{ this.res.startMode }}</el-descriptions-item>
      <el-descriptions-item label="资源类型">{{ this.res.resourceType }}</el-descriptions-item>
      <el-descriptions-item label="采集器类型">{{ this.res.exporterType }}</el-descriptions-item>
      <el-descriptions-item label="资源描述">{{ this.res.resourceDescription }}</el-descriptions-item>

      <el-descriptions-item v-if="type==='server'" label="CPU核心数量">{{ this.res.prometheusCpuNums }}</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="服务器总内存">{{ this.res.prometheusTotalMemoryGBs }} GBs</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="可用存储空间">{{ this.res.prometheusAvailableFileGBs }} GBs</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="服务器启动时间">{{ this.res.prometheusServerloadtime }} seconds</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="操作系统">{{ this.res.sysname }}</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="架构">{{ this.res.machine }}</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="操作系统版本">{{ this.res.version }}</el-descriptions-item>
      <el-descriptions-item v-if="type==='server'" label="标识符">{{ this.res.nodename }}</el-descriptions-item>
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
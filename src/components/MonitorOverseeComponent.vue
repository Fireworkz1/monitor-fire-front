<script>
import axios from "@/axios";

export default {
  props:['monitorId','detail'],
  methods:{
    async fetchData() {
      //通过monitorId获取数据
      try{
        this.monitor = (await axios.post('/monitor/selectById', null, {
          params: {
            monitorId: this.monitorId
          }
        })).data;
        this.metricDescription= (await axios.post('/monitor/metricDescription', null,{
          params:{
            target:this.monitor.monitorPresetTarget
          }
        })).data;
        this.resourceList=(await axios.post('/resource/selectBatch', this.monitor.monitorResourceIds)).data;

      }catch (error){
        this.error=error;
      }

    },
  },
  data(){
    return{
      monitor:{
        id:null,
        monitorName: "",
        monitorNotpresetPromql: "",
        monitorPresetTarget: "",
        monitorDescription: "",
        monitorDemonstration: "", // 可以是 "table" 或 "graph"
        monitorGroupIds: [],
        monitorResourceIds: [],
        monitorType: "",
        monitorIspreset:null
      },
      error:'',
      resourceList:[],
      metricDescription:''
    }
  },
  mounted(){
    if(this.monitorId==null){
      this.$message.error("请设置组件传入参数");
    }else{
      this.fetchData();
    }
  }
}
</script>

<template>
  <el-container>
    <el-header v-if="!detail">
      <i :class="monitor.monitorDemonstration === 'graph' ? 'el-icon-picture-outline' :
           monitor.monitorDemonstration === 'table' ? 'el-icon-notebook-2' :
           'el-icon-question'"></i>
      {{monitor.monitorName}}


    </el-header>
    <el-main >
      <div v-if="detail">
        <p>监控id:&nbsp;{{monitor.id}}&nbsp;&nbsp;监控类型:&nbsp;{{ monitor.monitorType }}</p>

        <p>监控对象:</p>
        <p class="smallfont">
          <span v-for="(item, index) in resourceList" :key="index">
    {{ item.resourceName }}-&nbsp;&nbsp;&nbsp;{{item.resourceIp}}{{item.resourceType==='server'?'':':'+item.resourcePort}}
    <br>
  </span>
        </p>
        <p>{{ monitor.monitorIspreset===1?'监控指标: 预设指标':'监控指标: 非预设指标' }}</p>
        <p class="smallfont"> {{ monitor.monitorPresetTarget ||"Prom QL:"+ monitor.monitorNotpresetPromql }}</p>
        <p class="smallfont">{{metricDescription}}</p>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-header {
  height: 30px !important; /* 修改为需要的高度 */
  line-height: 80px; /* 保持文字垂直居中 */
}

/* 调整 el-main 的内边距 */
.el-main {
  padding: 20px; /* 修改为需要的内边距 */
  font-size: 16px;
}
.smallfont{
  font-size: 12px;
}
</style>
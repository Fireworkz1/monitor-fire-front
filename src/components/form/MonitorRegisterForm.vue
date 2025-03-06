<script>


import axios from "@/axios";

export default {
  methods:{
    async fetchData(){
      try{
        this.resourceList=(await axios.post('/resource/selectServer')).data;
        this.resourceList=(await axios.post('/resource/selectSoftware')).data.concat(this.resourceList);
        this.resourceList.sort((a,b)=>b.age-a.age);
        this.groupList=(await axios.get('/account/selectGroupInfo')).data;
        this.metricList=(await axios.get('/monitor/metricList')).data;
      }catch (error){
        this.$message.error('未正确获取分组，请重新打开表单');
      }

  },
    async onSubmit() {
      try {
        this.monitor.monitorType = this.selectedType;
        await axios.post('/monitor/create',this.monitor);
        this.monitor = {
          monitorName: "",
          monitorNotpresetPromql: "",
          monitorPresetTarget: "",
          monitorDescription: "",
          monitorDemonstration: "", // 可以是 "table" 或 "graph"
          monitorGroupIds: [],
          monitorResourceIds: [],
          monitorType: ""
        };
        this.$message.success('添加成功!');
        window.location.reload();
      } catch (error) {
        this.$message.error(error)
      }
    },
    onReset(){
      this.selectedType='';
      this.preset='';
      this.monitor={
        monitorName: "",
        monitorNotpresetPromql: "",
        monitorPresetTarget: "",
        monitorDescription: "",
        monitorDemonstration: "", // 可以是 "table" 或 "graph"
        monitorGroupIds: [],
        monitorResourceIds: [],
        monitorType: ""
      };
    }
  },
  data() {
    return {
      dialogVisible:false,
      selectedType:'',
      preset:'',
      monitor: {
        monitorName: "",
        monitorNotpresetPromql: "",
        monitorPresetTarget: "",
        monitorDescription: "",
        monitorDemonstration: "", // 可以是 "table" 或 "graph"
        monitorGroupIds: [],
        monitorResourceIds: [],
        monitorType: ""
      },
      resourceList:[],

      resource:{
        id: null,
        resourceName: "",
        resourceIp: "",
        resourcePort: "",
      },
      groupList:[],
      metricList:[]
    };
  },
  mounted() {
    this.fetchData();
  },
  computed:{
    filteredResourceList() {
      if (!this.selectedType) return this.resourceList; // 如果未设置类型，返回全部
      return this.resourceList.filter(item =>
          item.resourceType === this.selectedType
      );
    },
    filteredMetrics() {
      if (!this.selectedType) return []; // 如果没有选择类型，返回空数组
      return this.metricList.filter(metric => metric.type === this.selectedType);
    }
  },watch: {
    filteredResourceList(newVal) {
      console.log(newVal);
    }
  }
};
</script>

<template>
  <div>

    <el-button type="primary" @click="dialogVisible = true" class="registerButton">添加监控</el-button>
    <el-dialog
        title="添加监控"
        :visible.sync="dialogVisible"
        width="60%">

      <el-form label-width="100px">
        <el-form-item label="选择类型">
          <el-radio-group v-model="selectedType">
            <el-radio label="server">服务器监控</el-radio>
            <el-radio label="software">微服务监控</el-radio>
            <el-radio label="mysql">数据库监控</el-radio>
            <el-radio label="redis">高速缓存监控</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指标类型">
          <el-radio-group v-model="preset">
            <el-radio label="true">预设指标</el-radio>
            <el-radio label="false">非预设指标</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="监控指标">
          <el-select v-if="preset === 'true'" v-model="monitor.monitorPresetTarget" placeholder="请选择监控指标">
            <el-option
                v-for="metric in filteredMetrics"
                :key="metric.target"
                :label="metric.target+'  '+metric.description"
                :value="metric.target">
            </el-option>
          </el-select>
          <el-input v-if="preset==='false'" v-model="monitor.monitorNotpresetPromql" placeholder="请输入PromQL">
          </el-input>
        </el-form-item>
        <el-form-item label="监控名称">
          <el-input placeholder="请输入描述" v-model="monitor.monitorName"></el-input>
        </el-form-item>
        <el-form-item label="监控描述">
          <el-input placeholder="请输入描述" v-model="monitor.monitorDescription"></el-input>
        </el-form-item>
        <el-form-item label="监控方式">
          <el-radio-group v-model="monitor.monitorDemonstration">
            <el-radio label="table" >单点监控</el-radio>
            <el-radio label="graph" >时间序列监控</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="selectedType!==''" label="监控对象">
          <el-select v-model="monitor.monitorResourceIds" multiple placeholder="请选择">
            <el-option
                v-for="item in filteredResourceList"
                :key="item.id"
                :label="selectedType === 'server' ? `${item.resourceName} ${item.resourceIp}` : `${item.resourceName} ${item.resourceIp}:${item.resourcePort}`"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控分组">
          <el-select v-model="monitor.monitorGroupIds" multiple placeholder="请选择">
            <el-option
                v-for="item in groupList"
                :key="item.group.id"
                :label="item.group.name"
                :value="item.group.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>




      <span slot="footer" class="dialog-footer">
    <el-button @click="onReset">重 置</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 选择器 -->

  </div>
</template>

<style scoped>
.registerButton{
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start;
  margin-left: 5px;
  margin-bottom: 15px;

}
</style>
<script>


export default {
  methods:{
    onSubmit(){
      this.monitor.monitorType=this.selectedType;
      console.log(this.monitor)
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
      }
    };
  },
  mounted() {
    this.resourceList.push({ ...this.resource, id: 1,resourceName:'资源1',resourceIp:'111.111.111.111',resourcePort:'9900' }); // 创建新对象并设置 id
    this.resourceList.push({ ...this.resource, id: 2,resourceName:'资源2',resourceIp:'111.111.111.111',resourcePort:'9900' });
    this.resourceList.push({ ...this.resource, id: 3,resourceName:'资源3',resourceIp:'111.111.111.111',resourcePort:'9900' });
  }
};
</script>

<template>
  <div>

    <el-button type="primary" @click="dialogVisible = true">添加监控</el-button>
    <el-dialog
        title="添加监控"
        :visible.sync="dialogVisible"
        width="60%">

      <el-form label-width="100px">
        <el-form-item label="选择类型">
          <el-select v-model="selectedType" placeholder="请选择">
            <el-option label="服务器监控" value="server"></el-option>
            <el-option label="软件监控"  value="software"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标类型">
          <el-select v-model="preset" placeholder="请选择">
            <el-option label="预设指标" value="true"></el-option>
            <el-option label="非预设指标"  value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控指标">
          <el-select v-if="preset==='true'" v-model="monitor.monitorPresetTarget" placeholder="请选择监控指标">
            <el-option v-if="selectedType==='server'" label="指标1cpu" value="shanghai"></el-option>
            <el-option v-if="selectedType==='software'"  label="指标2？" value="beijing"></el-option>
          </el-select>
          <el-input v-if="preset==='false'" v-model="monitor.monitorNotpresetPromql" placeholder="请输入PromQL">
          </el-input>
        </el-form-item>
        <el-form-item label="监控描述">
          <el-input placeholder="请输入描述" v-model="monitor.monitorDescription"></el-input>
        </el-form-item>
        <el-form-item label="监控对象">
          <el-select v-model="monitor.monitorResourceIds" multiple placeholder="请选择">
            <el-option
                v-for="item in resourceList"
                :key="item.id"
                :label="selectedType === 'server' ? `${item.resourceName} ${item.resourceIp}` : `${item.resourceName} ${item.resourceIp}:${item.resourcePort}`"
                :value="item.id">
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

</style>
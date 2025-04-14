
<script>
import axios from "@/axios";

export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,// 控制弹窗显示
      formData: {
        autoName: "",
        autoPolicy: "",
        compareType: "",
        warnThreshold: null,
        resourceId: null,
        monitorPresetTarget: "",
      },
      formData2: {
        autoGroupName:"",
        autoPolicyIds:[],
        resourceIds:[],
        description:"",
        masterNodeResourceId:null,
      },
      loading:false,
      resourceType:'',
      startMode:'',
      resourceList: [],
      metricList:[],
      filteredResourceList: [],
      filteredResourceList1:[],
      rules: {
        // 表单验证规则
        autoName: [{ required: true, message: "请输入自动命名", trigger: "blur" }],
        autoPolicy: [{ required: true, message: "请输入自动策略", trigger: "blur" }],
        compareType: [{ required: true, message: "请选择比较类型", trigger: "change" }],
        warnThreshold: [
          { required: true, message: "请输入警告阈值", trigger: "blur" },
        ],
        resourceId: [{ required: true, message: "请输入自动化资源", trigger: "blur" }],
        monitorPresetTarget: [
          { required: true, message: "请输入监控预设目标", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    openDialog2() {
      this.dialogVisible2 = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.$refs.monitorForm.resetFields(); // 重置表单
    },
    closeDialog2() {
      this.dialogVisible2 = false;
      this.startMode=null;
      this.$refs.monitorForm2.resetFields(); // 重置表单
    },
    handleClose(done) {
      this.closeDialog();
      done();
    },
    handleClose2(done) {
      this.closeDialog2();
      done();
    },
    submitForm() {
      this.$refs.monitorForm.validate(async (valid) => {
        if (valid) {
          // 表单验证通过，提交数据到后端
          await this.submitToBackend();
          this.dialogVisible=false;
        } else {
          this.$message.error("表单填写有误，请检查！");
        }
      });
    },
    async submitForm2() {
      try {
        // 模拟提交到后端的 API 请求
        await axios.post("/auto/createGroup", this.formData2);
        this.dialogVisible2=false;
        window.location.reload();
      } catch (error) {
        this.$message.error(error);
      }
    },
    async submitToBackend() {
      try {
        // 模拟提交到后端的 API 请求
         await axios.post("/auto/create", this.formData);
      } catch (error) {
        this.$message.error(error);
      }
    },
    filterMode() {
      // 根据选择的资源类型筛选资源列表
      this.formData.resourceId=null;
      this.filteredResourceList=[];
      this.filteredResourceList1=[];
      this.resourceType='';
      if (this.startMode!=='') {
        this.filteredResourceList = this.resourceList.filter(
            (item) => item.startMode!==null&&item.startMode === this.startMode
        );
      }
    },
    filterResources() {
      // 根据选择的资源类型筛选资源列表
      this.formData.resourceId=null;
      this.filteredResourceList1=[];
      if (this.resourceType!=='') {
        this.filteredResourceList1 = this.filteredResourceList.filter(
            (item) => item.resourceType === this.resourceType
        );
      }
    },
    async fetchData() {
      try {
        this.loading=true;
        this.resourceList = (await axios.post('/resource/selectSoftware')).data;
        this.metricList=(await axios.get('/monitor/metricList')).data;
        this.loading=false;
      } catch (error) {
        this.$message.error(error);
        this.resourceList = [];
      }
    }
  },mounted() {
    this.fetchData();
  },
  computed:{
    filteredMetrics() {
      return this.metricList.filter(metric => metric.type === this.resourceType);
    }
  }
};
</script>
<template>
  <div>
    <!-- 按钮触发弹窗 -->
    <el-button type="primary" @click="openDialog">创建自动启停配置</el-button>
    <el-button type="primary" @click="openDialog2">创建动态缩扩容规则组</el-button>
    <!-- 表单弹窗 -->
    <el-dialog
        title="自动启停配置"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
        v-loading="loading"
    >
      <el-form
          ref="monitorForm"
          :model="formData"
          label-width="150px"
          :rules="rules"
      >
        <el-form-item label="自动化命名" prop="autoName">
          <el-input v-model="formData.autoName" placeholder="请输入自动化命名"></el-input>
        </el-form-item>
        <el-form-item label="资源启动方式">
          <el-select
              v-model="startMode"
              placeholder="请选择资源类型"
              @change="filterMode"
          >
            <el-option label="docker" value="docker"></el-option>
            <el-option label="systemd" value="systemd" disabled></el-option>
            <el-option label="jvm" value="jvm" disabled></el-option>
            <el-option label="其他" value="others" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作资源类型">
          <el-select
              v-model="resourceType"
              placeholder="请选择资源类型"
              v-if="startMode!==''"
              @change="filterResources"
          >
            <el-option label="微服务资源" value="software"></el-option>
            <el-option label="数据库资源" value="mysql"></el-option>
            <el-option label="高速缓存资源" value="redis"></el-option>
            <el-option label="服务器资源" value="server" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作资源" prop="resourceId">
          <el-select
              v-model="formData.resourceId"
              placeholder="请选择资源"
              filterable
              v-if="resourceType!==''&&startMode!==''"
          >
            <el-option
                v-for="item in filteredResourceList1"
                :key="item.id"
                :label="`${item.resourceName} (${item.resourceIp})`"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自动化策略" prop="autoPolicy">
          <el-select v-model="formData.autoPolicy" placeholder="请选择自动策略">
            <el-option label="停止" value="stop"></el-option>
            <el-option label="重启" value="restart"></el-option>
<!--            <el-option label="启动" value="start"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="监控指标">
          <el-select  v-model="formData.monitorPresetTarget" placeholder="请选择监控指标">
            <el-option
                v-for="metric in filteredMetrics"
                :key="metric.target"
                :label="metric.target+'  '+metric.description"
                :value="metric.target">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="比较类型" prop="compareType">
          <el-select v-model="formData.compareType" placeholder="请选择比较类型">
            <el-option label="等于" value="=="></el-option>
            <el-option label="大于" value=">="></el-option>
            <el-option label="小于" value="<="></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发阈值" prop="warnThreshold">
          <el-input-number
              v-model="formData.warnThreshold"
              :min="0"
              placeholder="请输入触发阈值"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="监控开关" prop="monitorOn" >
          <el-input  disabled placeholder="默认关闭，请创建资源后打开"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">创 建</el-button>
      </span>
    </el-dialog>



    <el-dialog
        title="缩扩容规则组配置"
        :visible.sync="dialogVisible2"
        width="50%"
        :before-close="handleClose2"
        v-loading="loading"
    >
      <el-form
          ref="monitorForm2"
          :model="formData2"
          label-width="150px"

      >
        <el-form-item label="规则组命名" >
          <el-input v-model="formData2.autoGroupName" placeholder="请输入规则组命名"></el-input>
        </el-form-item>
        <el-form-item label="规则组描述" >
          <el-input v-model="formData2.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="资源启动方式">
          <el-select
              v-model="startMode"
              placeholder="请选择资源类型"
              @change="filterMode"
          >
            <el-option label="docker" value="docker"></el-option>
            <el-option label="systemd" value="systemd" disabled></el-option>
            <el-option label="jvm" value="jvm" disabled></el-option>
            <el-option label="其他" value="others" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作资源类型">
          <el-select
              v-model="resourceType"
              placeholder="请选择资源类型"
              v-if="startMode!==''"
              @change="filterResources"
          >
            <el-option label="微服务资源" value="software"></el-option>
            <el-option label="数据库资源" value="mysql"></el-option>
            <el-option label="高速缓存资源" value="redis"></el-option>
            <el-option label="服务器资源" value="server" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集群主节点">
          <el-select
              v-model="formData2.masterNodeResourceId"
              placeholder="请选择缩扩容集群主节点"
              filterable
              v-if="resourceType!==''&&startMode!==''"
          >
            <el-option
                v-for="item in filteredResourceList1"
                :key="item.id"
                :label="`${item.resourceName} (${item.resourceIp})`"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集群从节点群" >
          <el-select
              v-model="formData2.resourceIds"
              placeholder="请选择缩扩容集群其他节点"
              filterable
              multiple
              v-if="resourceType!==''&&startMode!==''"
          >
            <el-option
                v-for="item in filteredResourceList1"
                :key="item.id"
                :label="`${item.resourceName} (${item.resourceIp})`"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-alert
          title="请选择缩扩容集群，选中的对象将根据规则被配置缩扩容"
          type="warning"
          center
          :closable="false"
          show-icon
          style="font-size: 25px !important;"
      >
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog2">取 消</el-button>
        <el-button type="primary" @click="submitForm2">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<style scoped>
/* 样式可以根据需要自定义 */
</style>
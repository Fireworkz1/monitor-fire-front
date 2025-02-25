<script>
export default {
  methods:{
    onSubmit(){
      if(this.accessible){
        this.dialogVisible = false;
        this.accessible=false;
        alert('已经启用默认监控，可在资源控制页查看详情');
      }else{
        alert('请先Ping通目标资源再添加');
      }

    },
    testAccessible(){
      alert('Pong');
      this.accessible = true;
    },
  },
  data() {
    return {
      dialogVisible:false,
      selectedType: '', // 选择器的绑定值
      accessible:false,
      serverForm: { // 服务器表单数据
        resourceType: 'server',
        resourceName: '',
        resourceIp:'',
        resourceMonitorOn:0,
        resourceDescription:'',
        hardResourceUsername:'',
        hardResourcePassword:'',

      },
      softwareForm: { // 软件表单数据
        resourceType: 'software',
        resourceName: '',
        resourceTypeSecond:'',
        resourceIp:'',
        ResourcePort:'',
        resourceMonitorOn:0,
        resourceDescription:'',
        startMode:'',
      }
    };
  }
};
</script>

<template>
  <div>

    <el-button type="primary" @click="dialogVisible = true">注册资源</el-button>
    <el-dialog
        title="注册资源"
        :visible.sync="dialogVisible"
        width="60%">

      <el-form label-width="100px">
        <el-form-item label="选择类型">
          <el-select v-model="selectedType" placeholder="请选择">
            <el-option label="服务器资源" value="server"></el-option>
            <el-option label="软件资源" value="software"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 动态表单 -->
      <div v-if="selectedType === 'server'">
        <h3>服务器表单</h3>
        <el-form label-width="120px">
          <el-form-item label="资源名称">
            <el-input v-model="serverForm.resourceName"></el-input>
          </el-form-item>
          <el-form-item label="IP 地址">
            <el-input v-model="serverForm.resourceIp"></el-input>
          </el-form-item>
          <el-form-item label="资源描述">
            <el-input v-model="serverForm.resourceDescription"></el-input>
          </el-form-item>
          <el-form-item label="登录用户名">
            <el-input v-model="serverForm.hardResourceUsername"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码">
            <el-input v-model="serverForm.hardResourcePassword"></el-input>
          </el-form-item>
          <!-- 其他服务器相关字段 -->
        </el-form>
      </div>

      <div v-if="selectedType === 'software'">
        <h3>软件表单</h3>
        <el-form label-width="120px">
          <el-form-item label="资源名称">
            <el-input v-model="softwareForm.resourceName"></el-input>
          </el-form-item>
          <el-form-item label="软件种类">
            <el-input v-model="softwareForm.resourceTypeSecond"></el-input>
          </el-form-item>
          <el-form-item label="IP 地址">
            <el-input v-model="softwareForm.resourceIp"></el-input>
          </el-form-item>
          <el-form-item label="监控暴露端口">
            <el-input v-model="softwareForm.ResourcePort"></el-input>
          </el-form-item>
          <el-form-item label="资源描述">
            <el-input v-model="softwareForm.resourceDescription"></el-input>
          </el-form-item>
          <el-form-item label="启动方式">
            <el-input v-model="softwareForm.startMode"></el-input>
          </el-form-item>
          <!-- 其他软件相关字段 -->
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testAccessible">Ping</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 选择器 -->

  </div>
</template>

<style scoped>

</style>
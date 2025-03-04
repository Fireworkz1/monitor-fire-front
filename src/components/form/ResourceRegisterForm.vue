<script>
import axios from "@/axios";


export default {
  methods:{
    async fetchData() {
      try{
        this.groupList = (await axios.get('/account/selectGroupInfo')).data;
        console.log(this.groupList)
      }catch (error){
        this.$message.error('获取分组失败，请重新打开表单');
      }

    },
    async onSubmit() {

      if (this.accessible) {
        try {
          if (this.selectedType === 'server') {
            await axios.post('/resource/addServer', {
              resource:this.serverForm,
              groupIdList:this.groupIdsform
            })
          } else {
            await axios.post('/resource/addSoftware', {
              resource:this.softwareForm,
              groupIdList:this.groupIdsform
            })
          }
          this.serverForm={
            resourceType: 'server',
            resourceName: '',
            resourceIp:'',
            resourceManageOn:0,
            resourceDescription:'',
            hardResourceUsername:'',
            hardResourcePassword:'',
          };
          this.softwareForm={
            resourceType: 'software',
            resourceName: '',
            resourceTypeSecond:'',
            resourceIp:'',
            ResourcePort:'',
            resourceManageOn:0,
            resourceDescription:'',
            startMode:'',
          };
          this.groupIdsform=[];
          this.dialogVisible = false;
          this.accessible = false;
          this.$message('资源添加成功，可在资源管理页启动资源管理');
          window.location.reload();
        } catch (error) {
          this.$message.error(error);
        }
      } else {
        this.$message.error('请先测试资源连通性！');
      }

    },
    async testAccessible(){
      try{
        if(this.selectedType==='server'){
          await axios.post('/resource/ping',this.serverForm);
        }else if(this.selectedType==='software'){
          await axios.post('/resource/testSoftware',this.softwareForm)
        }else {
          throw new Error('请选择资源类型！');
        }
        this.accessible = true;
        this.$message.success('连接成功，可添加该资源');
      }catch (error){
        this.$message.error(error);
      }



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
        resourceManageOn:0,
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
        resourceManageOn:0,
        resourceDescription:'',
        startMode:'',
      },
      groupIdsform:[],
      groupList:[]
    };
  },mounted() {
    this.fetchData();
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
            <el-input v-model="serverForm.resourceIp" @change="accessible=false"></el-input>
          </el-form-item>
          <el-form-item label="资源描述">
            <el-input v-model="serverForm.resourceDescription"></el-input>
          </el-form-item>
          <el-form-item label="登录用户名">
            <el-input v-model="serverForm.hardResourceUsername" @change="accessible=false"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码">
            <el-input v-model="serverForm.hardResourcePassword" @change="accessible=false"></el-input>
          </el-form-item>
          <!-- 其他服务器相关字段 -->
          <el-form-item label="所属分组">
            <el-select v-model="groupIdsform" multiple>
              <el-option
                  v-for="item in groupList"
                  :key="item.group.id"
                  :label="item.group.name"
                  :value="item.group.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="selectedType === 'software'">
        <h3>软件表单</h3>
        <el-form label-width="120px">
          <el-form-item label="二级类型">
            <el-select v-model="softwareForm.resourceTypeSecond">
              <el-option>springboot</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称">
            <el-input v-model="softwareForm.resourceName"></el-input>
          </el-form-item>
          <el-form-item label="软件种类">
            <el-input v-model="softwareForm.resourceTypeSecond"></el-input>
          </el-form-item>
          <el-form-item label="IP 地址">
            <el-input v-model="softwareForm.resourceIp" @change="accessible=false"></el-input>
          </el-form-item>
          <el-form-item label="监控暴露端口">
            <el-input v-model="softwareForm.ResourcePort" @change="accessible=false"></el-input>
          </el-form-item>
          <el-form-item label="资源描述">
            <el-input v-model="softwareForm.resourceDescription"></el-input>
          </el-form-item>
          <el-form-item label="启动方式">
            <el-select v-model="softwareForm.startMode" @change="accessible=false">
              <el-option>docker</el-option>
            </el-select>
          </el-form-item>
          <!-- 其他软件相关字段 -->
          <el-form-item label="所属分组">
          <el-select v-model="groupIdsform" multiple>
            <el-option
                v-for="item in groupList"
                :key="item.group.id"
                :label="item.group.name"
                :value="item.group.id">
            </el-option>
          </el-select>
          </el-form-item>
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
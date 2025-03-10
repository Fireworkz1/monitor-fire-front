<script>


import ResourceDetailDescription from "@/components/discription/ResourceDetailDescription.vue";
import axios from "@/axios";
import PageLabel from "@/components/title/PageLabel.vue";
export default {
  methods:{
    openFullScreen2() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      window.location.reload();
    },
    startContainer() {

      this.operateContainer("start", this.resId);

    },
    // 重启容器
    restartContainer() {
      this.operateContainer("restart", this.resId);
    },
    // 停止容器
    stopContainer() {
      this.operateContainer("stop", this.resId);
    },
    // 通用方法：调用后端接口
    async operateContainer(action, id) {
      try {
        if (!id) {
          this.$message.error("请先选择一个容器 ID！");
          return;
        }
        const url = `/resource/software/docker/${action}`;

        await axios.post(url, null, {
          params: {
            id: id
          }
        });
        this.$message('操作成功！请刷新查看状态');

        this.openFullScreen2();
      } catch (error) {
        this.$message.error(error);
      }
    },

    async getLog(){
      try {
        this.logs=[];
        this.logLoading=true;

        if(this.lines==null||this.lines===0)this.lines=50;
       this.logs= (await axios.post('/resource/software/docker/log', null, {
          params: {
            id: this.resId,
            lines:this.lines
          }
        })).data;

      } catch (error) {
        this.$message.error(error);
      }
      this.logLoading=false;
    },

    goBack() {
      this.$router.go(-1)
    },
    async fetchData() {
      try{
        this.dockerDetail=(await axios.post('/resource/software/docker/details',null,{
          params:{
            id:this.resId
          }
        })).data;
        this.resource = (await axios.post('/resource/selectSoftwareById', null, {
          params: {
            id: this.resId
          }
        })).data;
      }catch (error){
        this.$message.error(error);
      }
    }
  },
  components: {PageLabel, ResourceDetailDescription},
  computed: {
    resId() {
      return this.$route.query.id;
    }
  },mounted(){
    this.fetchData();
  },data(){
    return{
      resource:null,
      dockerDetail:null,
      logs:[],
      logLoading:false,
      lines:50,
    }
  }

}
</script>

<template>
  <div>
    <el-container >
      <el-header >
        <el-page-header @back="goBack"  content="Docker控制台">
        </el-page-header>
      </el-header>
      <el-main style="margin-top: 40px;">
        <page-label label="资源信息"></page-label>
        <el-descriptions title="Docker Container信息" direction="vertical" :column="2" border style="margin-top: 20px;margin-bottom: 60px">
          <el-descriptions-item label="状态">
            <el-tag  :style="dockerDetail.status === 'running' ? { background: '#67C23A', color: 'white' } : { background: '#F56C6C', color: 'white' }"
                     >{{dockerDetail.status}}</el-tag></el-descriptions-item>
          <el-descriptions-item label="创建时间">{{dockerDetail.createdAt}}</el-descriptions-item>
          <el-descriptions-item label="启动时间">{{dockerDetail.startedAt}}</el-descriptions-item>
          <el-descriptions-item label="名字">{{ dockerDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="containerId">{{dockerDetail.containerId}}</el-descriptions-item>
          <el-descriptions-item label="平台">{{dockerDetail.platform}}</el-descriptions-item>
          <el-descriptions-item label="驱动">{{dockerDetail.driver}}</el-descriptions-item>
          <el-descriptions-item label="镜像名称">{{dockerDetail.image}}</el-descriptions-item>
          <el-descriptions-item label="端口映射">{{dockerDetail.ports}}</el-descriptions-item>
          <el-descriptions-item label="驱动">{{dockerDetail.driver}}</el-descriptions-item>
          <el-descriptions-item label="桥接网络IP地址">{{dockerDetail.IPAdress}}</el-descriptions-item>
        </el-descriptions>
        <resource-detail-description docker="docker" type="software" :idd="resource.id"></resource-detail-description>
        <div style="height: 60px"></div>
        <page-label label="远程控制"></page-label>
        <!-- 按钮区域 -->
        <div class="button-group">
          <el-button type="success" style="height: 85px" @click="startContainer">启动容器</el-button>
          <el-button type="warning" style="height: 85px" @click="restartContainer">重启容器</el-button>
          <el-button type="danger" style="height: 85px" @click="stopContainer">停止容器</el-button>
        </div>
        <page-label label="容器日志"></page-label>
        <el-row style="margin-bottom: 40px">
          <el-col :span="2">
            <el-button type="primary" @click="getLog">获取日志</el-button>
          </el-col>

          <el-col :offset="1" :span="2">
            <el-input v-model="lines" placeholder="日志行数"></el-input>
          </el-col>
        </el-row>

        <div class="terminal" v-loading="logLoading"
             element-loading-text="加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <div v-for="(log, index) in logs" :key="index" class="log-line">
            {{ log }}
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.el-header{
  background-color: #dcdcdc;
  position: fixed;
  width: 100%;
  z-index: 1000;
  height: 70px !important;
}

.el-page-header{
  line-height: 70px;
  color: #797979;

  background-color: #e0e0e0;
  z-index: 1000;

  margin-bottom: 60px;
  padding: 0;
}
.custom-descriptions .el-descriptions__body {
  width: 100%;
}

.custom-descriptions .el-descriptions__table {
  width: 100%;
  table-layout: fixed; /* 固定表格布局 */
}

.custom-descriptions .el-descriptions__cell {
  word-wrap: break-word; /* 自动换行 */
}

/* 设置每列的宽度 */
.custom-descriptions .el-descriptions__cell:nth-child(1) {
  width: 10%; /* 第一列宽度 */
}

.custom-descriptions .el-descriptions__cell:nth-child(2) {
  width: 30%; /* 第二列宽度 */
}

.custom-descriptions .el-descriptions__cell:nth-child(3) {
  width: 10%; /* 第三列宽度 */
}
.el-container {
  width: 100%; /* 容器宽度为屏幕宽度的 90% */
  margin: 0 auto; /* 水平居中对齐 */
}
.el-main{
  width: 90%;
  margin: 0 auto;
}
 .button-group {
   display: flex;
   justify-content: space-around;
   margin-top: 40px;
   margin-bottom: 40px;
 }

.el-button {
  width: 100px;
}
body{
  margin: 0;
}
.terminal {
  background-color: #282c34; /* 深色背景 */
  color: #abb2bf; /* 浅色字体 */
  font-family: monospace; /* 等宽字体 */
  padding: 10px;
  border-radius: 5px;
  overflow-y: auto; /* 垂直滚动条 */
  max-height: 400px; /* 最大高度 */
  text-align: left;
  margin-bottom: 80px;
  min-height: 400px;
  font-size: 18px;
}

.log-line {
  white-space: pre-wrap; /* 保留换行符和空格 */
}
</style>
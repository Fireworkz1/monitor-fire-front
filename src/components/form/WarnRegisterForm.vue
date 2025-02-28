<script>
import axios from "@/axios";

export default {
  methods:{
    async submitForm() {
      try {
        await axios.post('/warn/create',this.warnForm);
        this.dialogVisible = false;
        this.$message("添加成功!");
        window.location.reload();
      } catch (error) {
        this.$message.error(error)
      }

    },
    handleMonitorChange() {
      // 根据选中的监控项更新 warnSourceType
      const selectedMonitor = this.monitorList.find(
          (item) => item.id === this.warnForm.monitorId
      );
      if (selectedMonitor) {
        this.warnForm.warnSourceType = selectedMonitor.monitorType;
        this.warnForm.warnSource="monitorId="+selectedMonitor.id;
        this.warnForm.monitorName=selectedMonitor.monitorName;
      }
    },
    async fetchData() {
      try {
        this.userList=(await axios.get('/account/selectUser')).data;
        this.monitorList = (await axios.post('/monitor/selectLike')).data;
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  data(){
    return{
      dialogVisible:false,
    warnForm:{
      warnName: "",
      warnLevel: null,
      warnSource: "",
      warnSourceType: "",
      compareType: "",
      warnThreshold: null,
      warnDescription: "",
      monitorId: null,
      monitorName: "",
      noticeUserIds: []
    },
      monitorList:[],
      userList:[],
    }
  }
}
</script>

<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">添加告警规则</el-button>
    <el-dialog
        title="添加告警监控规则"
        :visible.sync="dialogVisible"
        width="60%">
      <template>
        <el-form :model="warnForm" label-width="120px">
          <el-form-item label="警告名称">
            <el-input v-model="warnForm.warnName"></el-input>
          </el-form-item>

          <el-form-item label="警告级别">
            <el-select v-model="warnForm.warnLevel" placeholder="请选择警告级别">
              <el-option label="NOTHING" :value="0"></el-option>
              <el-option label="LOG_ONLY" :value="1"></el-option>
              <el-option label="STORE_INFO" :value="2"></el-option>
              <el-option label="NOTICE_USER" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监控项">
            <el-select v-model="warnForm.monitorId" @change="handleMonitorChange" placeholder="请选择监控项">
              <el-option
                  v-for="item in monitorList"
                  :key="item.id"
                  :label="item.monitorName+item.monitorPresetTarget+item.monitorNotpresetPromql+item.monitorDescription"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="警告来源">
            <el-input v-model="warnForm.warnSource" readonly placeholder="选择监控对象后默认填入"></el-input>
          </el-form-item>

          <el-form-item label="警告来源类型" >
            <el-input v-model="warnForm.warnSourceType" readonly placeholder="选择监控对象后默认填入"></el-input>
          </el-form-item>

          <el-form-item label="比较类型">
            <el-select v-model="warnForm.compareType" placeholder="请选择比较类型">
              <el-option label="大于等于" value=">="></el-option>
              <el-option label="等于" value="=="></el-option>
              <el-option label="小于等于" value="<="></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="警告阈值">
            <el-input-number v-model="warnForm.warnThreshold"></el-input-number>
          </el-form-item>

          <el-form-item label="警告描述">
            <el-input type="textarea" v-model="warnForm.warnDescription"></el-input>
          </el-form-item>



          <el-form-item label="通知用户" v-if="warnForm.warnLevel===3">
            <el-select v-model="warnForm.noticeUserIds" multiple placeholder="请选择通知用户" filterable>
              <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>
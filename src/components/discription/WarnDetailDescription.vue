<script>





import axios from "@/axios";

export default {
  props:["warnEntity","isDetail","monitorEntity"],

  data(){
    return{
      warnList:[],
      warnDetail:{
        id: null,
        monitorOn: null,
        warnName: '',
        warnLevel: null,
        warnSource: '',
        warnSourceType: '',
        compareType: '',
        warnThreshold: null,
        warnRepeatTimes: null,
        warnDescription: '',
        monitorId: null,
        noticeUserIds: '',
        currentStatus: null,
        startWarningTime: null,
        lastWarningTime: null,
        isActive: 1,
        hasSentNotice: null,
        noticeWay: ''
      },userList:[],
      user:{
        id:null,
        name:'',
      },
      monitor:{

      }
    }
  }
  ,methods:{
    async fetchData() {
      try {
        if (this.warnEntity == null)
          throw new Error("状态错误，请重新打开页面");
        this.warnDetail = this.warnEntity;
        this.monitor = (await axios.post('/monitor/selectById',null,{
          params:{
            monitorId:this.warnDetail.monitorId
          }
        })).data;
      } catch (error) {
        this.$message.error(error);
      }

    },
  },components:{


  },mounted() {
    console.log(this.warnEntity)
    this.fetchData();
  }
}
</script>

<template>
  <div>

    <el-descriptions>
      <el-descriptions-item label="告警是否启用">
        <el-tag size="small">{{ warnDetail.monitorOn === 1 ? '启用' : '未启用' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="策略名称">
        {{ warnDetail.warnName || '暂无名称' }}
      </el-descriptions-item>
      <el-descriptions-item label="告警级别">
        <el-tag size="small">{{ warnDetail.warnLevel || '暂无级别' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="告警监控对象">
        {{ warnDetail.warnSource || '暂无监控对象' }}
      </el-descriptions-item>
      <el-descriptions-item label="策略备注">
        {{ warnDetail.warnDescription || '暂无备注' }}
      </el-descriptions-item>
      <el-descriptions-item label="监控类型">
        {{ warnDetail.warnSourceType || '暂无类型' }}
      </el-descriptions-item>
      <el-descriptions-item label="监控策略">
        {{ warnDetail.compareType || '暂无策略' }}
      </el-descriptions-item>
      <el-descriptions-item label="监控阈值">
        {{ warnDetail.warnThreshold || '暂无阈值' }}
      </el-descriptions-item>
      <el-descriptions-item label="是否正在告警" v-if="isDetail && warnDetail.monitorOn === 1">
        {{ warnDetail.isActive === 1 ? '是' : '否' }}
      </el-descriptions-item>
      <el-descriptions-item label="告警次数" v-if="isDetail && warnDetail.monitorOn === 1 && warnDetail.isActive === 1">
        {{ warnDetail.warnRepeatTimes || 0 }}
      </el-descriptions-item>
      <el-descriptions-item label="告警开始时间" v-if="isDetail && warnDetail.monitorOn === 1 && warnDetail.isActive === 1">
        {{ warnDetail.startWarningTime || '暂无时间' }}
      </el-descriptions-item>
      <el-descriptions-item label="最后一次告警时间" v-if="isDetail && warnDetail.monitorOn === 1 && warnDetail.isActive === 1">
        {{ warnDetail.lastWarningTime || '暂无时间' }}
      </el-descriptions-item>
      <el-descriptions-item label="是否已经发送警告" v-if="isDetail && warnDetail.monitorOn === 1 && warnDetail.isActive === 1 && warnDetail.warnLevel === 3">
        {{ warnDetail.hasSentNotice === 1 ? '已发送' : '未发送' }}
      </el-descriptions-item>
      <el-descriptions-item label="告警方式" v-if="warnDetail.warnLevel === 3">
        {{ warnDetail.noticeWay || '暂无方式' }}
      </el-descriptions-item>
      <el-descriptions-item label="通知人员列表" v-if="warnDetail.warnLevel === 3">
        <div v-if="userList.length > 0">
          <el-tag
              v-for="(user, index) in userList"
              :key="index"
              style="margin-right: 8px; margin-bottom: 8px;">
            {{ user.name }} (ID: {{ user.id }})
          </el-tag>
        </div>
        <div v-else>
          暂无通知人员
        </div>
      </el-descriptions-item>
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
<script>





export default {
  props:["idd","isDetail"],
  data(){
    return{
      warnList:[],
      warn:{
        id: null,
        monitorOn: 1,
        warnName: '',
        warnLevel: 3,
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
      }

    }
  }
  ,methods:{

  },components:{


  },mounted() {
    this.id=this.idd;
  }
}
</script>

<template>
  <div>

    <el-descriptions >
      <el-descriptions-item label="告警是否启用">
        <el-tag size="small">{{warn.monitorOn}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="策略名称">123</el-descriptions-item>
      <el-descriptions-item label="告警级别">
        <el-tag size="small">学校</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="告警监控对象">18100000000</el-descriptions-item>
      <el-descriptions-item label="策略备注">苏州市</el-descriptions-item>
      <el-descriptions-item label="监控类型">苏州市</el-descriptions-item>
      <el-descriptions-item label="监控策略">苏州市</el-descriptions-item>
      <el-descriptions-item label="监控阈值">port</el-descriptions-item>
      <el-descriptions-item label="是否正在告警" v-if="isDetail&&warn.monitorOn===1">苏州市</el-descriptions-item>
      <el-descriptions-item label="告警次数" v-if="isDetail&&warn.monitorOn===1&&warn.isActive===1">方式</el-descriptions-item>
      <el-descriptions-item label="告警开始时间" v-if="isDetail&&warn.monitorOn===1&&warn.isActive===1">苏州市</el-descriptions-item>
      <el-descriptions-item label="最后一次告警时间" v-if="isDetail&&warn.monitorOn===1&&warn.isActive===1">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
      <el-descriptions-item label="是否已经发送警告" v-if="isDetail&&warn.monitorOn===1&&warn.isActive===1&&warn.warnLevel===3">苏州市</el-descriptions-item>
      <el-descriptions-item label="告警方式" v-if="warn.warnLevel===3">苏州市</el-descriptions-item>
      <el-descriptions-item label="通知人员列表" v-if="warn.warnLevel===3"><div v-if="userList.length > 0">
        <el-tag
            v-for="(user, index) in userList"
            :key="index"
            style="margin-right: 8px; margin-bottom: 8px;"
        >
          {{ user.name }} (ID: {{ user.id }})
        </el-tag>
      </div>
        <div v-else>
          暂无通知人员
        </div></el-descriptions-item>

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
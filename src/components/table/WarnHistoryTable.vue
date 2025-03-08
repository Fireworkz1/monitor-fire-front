<script>
import WarnDetailDescription from "@/components/discription/WarnDetailDescription.vue";
import axios from "@/axios";


export default {

  components:{

    WarnDetailDescription
  },
  methods:{
    async fetchData(){
      try{
        this.warnList=(await axios.post('/warn/warnhistory')).data;
        this.monitorList=(await axios.post('/monitor/selectLike')).data;

      }catch (error){
        this.$message.error(error);
        this.warnList=[];

      }
    },
    async searchData() {
      try {
        this.warnList = (await axios.post('/warn/warnhistory',null,{
          params: {
            str:this.searchstr
          }
        })).data;

      } catch (error) {
        this.$message.error(error);
        this.warnList = [];

      }
    },
    update(row){
      this.editDialogVisible=true;
      this.updateForm={ ...row };
    },
    handleDelete(row){
      this.warnList.splice(row.id-1, 1);
      this.dialogVisible = false;
      this.local.row=null;
    },
    saveUpdate() {
      // 保存修改
      if (this.currentEditIndex !== null) {
        this.$set(this.warnList, this.currentEditIndex, { ...this.updateForm });
      }
      this.editDialogVisible = false; // 关闭对话框
    },
    cancelUpdate() {
      // 取消修改
      this.editDialogVisible = false;
      this.updateForm = {}; // 清空表单
    },
    changeActive(row){
      if(row.monitorOn===1){
        row.monitorOn=0;
      }else if(row.monitorOn===0){
        row.monitorOn=1;
      }else{console.log()}
    },
    closeDetails(){
      this.detailDialogVisible=false;
    },
    seeDetails(row) {
      this.local.id=row.id;
      this.detailDialogVisible=true;
    },
    formatWarnLevel(row, column, cellValue) {
      // 根据 warnLevel 的值返回对应的 label
      switch (cellValue) {
        case 0:
          return "无";
        case 1:
          return "日志输出";
        case 2:
          return "存储告警";
        case 3:
          return "紧急通知";
        case 4:
          return "系统中通知";
        default:
          return "未知";
      }
    },
  },
  computed:{
    filteredWarnList(){
      // if(this.isDetail)
      //   return this.warnList.filter(item => item.monitorOn === 1);
      // else
        return this.warnList
    },
    monitorMap() {
      const map = {};
      this.monitorList.forEach(item => {
        map[item.id] = item;
      });
      return map;
    }
  },
  data(){
    return{
      searchstr:'',
      warnList:[],
      monitorList:[],
      dialogVisible:false,
      editDialogVisible:false,
      detailDialogVisible:false,
      local:{
        row:null,
        id:null,
      },
      warn:{
        id: null,
        warnPolicyId:null,
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
        monitorName:'',
        noticeUserIds: '',
        currentStatus: null,
        startWarningTime: null,
        lastWarningTime: null,
        isActive: null,
        hasSentNotice: null,
        noticeWay: ''
      },monitor:{
        id:null,
        monitorName: "",
        monitorNotpresetPromql: "",
        monitorPresetTarget: "",
        monitorDescription: "",
        monitorDemonstration: "", // 可以是 "table" 或 "graph"
        monitorGroupIds: [],
        monitorResourceIds: [],
        monitorType: ""
      },
      updateForm:{
        monitorOn: null,
        warnName: '',
        warnLevel: null,
        compareType: '',
        warnThreshold: null,
        warnDescription: '',
        noticeUserIds: '',
        noticeWay: '',
      }
    }
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<template>

  <div style="margin-top: 50px">
    <el-row>
      <el-col :span="4">
        <el-input autosize v-model="searchstr" placeholder="请输入查询目标"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button  @click="fetchData">重置</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 50px"></div>

    <el-table
        border
        :data="warnList"
        style="width: 100%;margin-bottom: 80px"
        :default-sort="{ prop: 'id', order:'descending'}"
        height="400">
      <el-table-column
          prop="warnName"
          label="告警策略名称"
          width="200">
      </el-table-column>
      <el-table-column
          prop="warnRepeatTimes"
          label="告警次数"
          width="50">
      </el-table-column>
      <el-table-column
          prop="warnLevel"
          label="告警级别"
          width="100"
          :formatter="formatWarnLevel">
      </el-table-column>
      <el-table-column
          fixed
          prop="currentStatus"
          label="当前状态"
          width="90">
      </el-table-column>
      <el-table-column
          prop="monitorName"
          label="监控对象名称"
          width="130">
      </el-table-column>

      <el-table-column
          label="告警策略"
          width="125">
        <template slot-scope="scope">
          value{{ scope.row.compareType }} {{scope.row.warnThreshold}}
        </template>
      </el-table-column>


      <el-table-column

          prop="startWarningTime"
          label="首次告警时间"
          width="230">
      </el-table-column>
      <el-table-column
          prop="lastWarningTime"
          label="最后告警时间"
          width="230">
      </el-table-column>

      <el-table-column
          label="监控对象指标"
          width="300">
        <template v-slot="scope">
          {{ monitorMap[scope.row.monitorId].monitorPresetTarget || monitorMap[scope.row.monitorId].monitorNotpresetPromql||'暂无监控对象' }}
        </template>
      </el-table-column>


    </el-table>
    <!--详情对话框 -->

    <el-dialog
        title="规则详情"
        :visible.sync="detailDialogVisible"
        width="80%"
    >
      <warn-detail-description :idd="local.id" :is-detail="true"></warn-detail-description>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="closeDetails">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<style scoped>

</style>
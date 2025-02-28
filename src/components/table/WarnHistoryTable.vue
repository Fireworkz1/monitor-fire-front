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
          return "NOTHING";
        case 1:
          return "LOG_ONLY";
        case 2:
          return "STORE_INFO";
        case 3:
          return "NOTICE_USER";
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
    }
  },
  data(){
    return{
      searchstr:'',
      warnList:[],
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
        :data="filteredWarnList"
        style="width: 100%"
        :default-sort="{ prop: 'id', order:'descending'}"
        height="400">
      <el-table-column
          fixed
          prop="id"
          label="告警历史id"
          width="100">
      </el-table-column>
      <el-table-column
          fixed
          prop="warnPolicyId"
          label="告警策略id"
          width="100">
      </el-table-column>
      <el-table-column
          prop="monitorName"
          label="监控对象名称"
          width="200">
      </el-table-column>
      <el-table-column
          fixed
          prop="warnName"
          label="告警策略名称"
          width="160">
      </el-table-column>
      <el-table-column
          prop="warnLevel"
          label="告警级别"
          width="200"
          :formatter="formatWarnLevel">
      </el-table-column>
      <el-table-column
          label="告警策略"
          width="80">
        <template slot-scope="scope">
          {{ scope.row.compareType }} {{scope.row.warnThreshold}}
        </template>
      </el-table-column>
      <el-table-column
          fixed
          prop="startWarningTime"
          label="首次告警时间"
          width="160">
      </el-table-column>
      <el-table-column
          fixed
          prop="lastWarningTime"
          label="最后告警时间"
          width="160">
      </el-table-column>



      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="seeDetails(scope.row)">显示详情</el-button>
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
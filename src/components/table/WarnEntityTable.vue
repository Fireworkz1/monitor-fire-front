<script>
import axios from "@/axios";


export default {
  props:["isDetail"],
  components:{

  },
  methods:{

    async confirmWarn(row) {
      await axios.post('/warn/warnconfirm', null, {
        params: {
          entityId:row.id,
          type:'confirm'
        }
      })
      this.local.row=null;
      this.$message('确认成功');
      this.changeDialogVisible=false;

    },
    async dismissWarn(row) {
      await axios.post('/warn/warnconfirm', null, {
        params: {
          entityId:row.id,
          type: 'dismiss'
        }
      })
      this.local.row=null;
      this.$message('已忽略告警');
      this.dialogVisible=false;
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
    async fetchData(){
      try{
        if(this.isDetail){
          this.warnList=(await axios.post('/warn/warnentity',null,{
            params:{
              onlyUser:1
            }
          })).data;
        }else{
          this.warnList=(await axios.post('/warn/warnentity')).data;
        }
        this.monitorList=(await axios.post('/monitor/selectLike')).data;

      }catch (error){
        this.$message.error(error);
        this.warnList=[];
        this.monitorList=[];

      }
    },
    async searchData() {
      try {
        this.warnList = (await axios.post('/warn/warnentity',null,{
          params: {
            str:this.searchstr
          }
        })).data;

      } catch (error) {
        this.$message.error(error);
        this.warnList = [];

      }
    },
  },
  computed:{
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
      changeDialogVisible:false,
      local1:{
        row:null,
      },
      local:{
        row:null,
        id:null,
      },
      warn:{
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
        id: null, // Integer
        monitorOn: null, // Integer
        warnName: "", // String
        warnLevel: null, // Integer
        warnSource: "", // String
        warnSourceType: "", // String
        compareType: "", // String
        warnThreshold: null, // Double
        warnRepeatTimes: null, // Integer
        warnDescription: "", // String
        monitorId: null, // Integer
        monitorName: "", // String
        noticeUserIds: "", // String
        currentStatus: "", // String
        startWarningTime: null, // Date
        lastWarningTime: null, // Date
        isActive: null, // Integer
        hasSentNotice: null, // Integer
        noticeWay: ""
      }
    }
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<template>
  <div style="margin-top: 50px" >
    <el-row v-if="!isDetail">
      <el-col :span="4">
        <el-input autosize v-model="searchstr" placeholder="请输入查询目标" ></el-input>
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
        style="width: 100%;text-align: center"
        height="400">

      <el-table-column
          fixed
          prop="id"
          label="id"
          width="50">
      </el-table-column>
      <el-table-column
          fixed
          prop="warnName"
          label="告警策略名称"
          width="200">
      </el-table-column>

      <el-table-column
          prop="warnLevel"
          label="告警级别"
          width="100"
          :formatter="formatWarnLevel">
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
          value {{ scope.row.compareType }} {{scope.row.warnThreshold}}
        </template>
      </el-table-column>
      <el-table-column
          label="告警对象"
          width="100">
        <template slot-scope="scope">
          <el-popover
              placement="top-start"
              title="当前告警数据"
              width="500"
              trigger="hover"
              :content="scope.row.currentWarningTarget"
          >
            <el-button slot="reference">点我</el-button>
          </el-popover>
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
          prop="warnRepeatTimes"
          label="告警次数"
          fixed
          width="50">
      </el-table-column>
      <el-table-column
          v-if="!isDetail"
          label="已经发送通知"
          width="160">是
      </el-table-column>
      <el-table-column
          prop="currentStatus"
          label="告警状态"
          width="160">
      </el-table-column>
      <el-table-column
          label="监控对象指标"
          width="300">
        <template v-slot="scope">
          {{ monitorMap[scope.row.monitorId].monitorPresetTarget || monitorMap[scope.row.monitorId].monitorNotpresetPromql||'暂无监控对象' }}
        </template>
      </el-table-column>




      <el-table-column label="操作" fixed width="145" v-if="isDetail">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              @click="local.row=scope.row;changeDialogVisible=true;">确定</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="local.row=scope.row;dialogVisible=true;local.row=scope.row">忽略</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        title="提示"
        :visible.sync="changeDialogVisible"
        width="30%"
    >
      <span>确定已经知晓该告警，并将告警添加到历史告警吗？</span>
      <span>确定后，指标将从告警队列中删除，若指标再次超过阈值将再次触发告警。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="local.row=null; changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmWarn(local.row)">确 定</el-button>
      </span>
    </el-dialog>


    <!--详情对话框 -->

    <el-dialog
        v-if="dialogVisible"
        title="重要提示"
        :visible.sync="dialogVisible"
        width="30%"
    >
      <span>确定忽略该告警吗？</span>
      <span>该指标再次告警将忽略，直至恢复至安全状态。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="local.row=null;dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dismissWarn(local.row)">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 编辑对话框 -->

  </div>
</template>

<style scoped>

</style>
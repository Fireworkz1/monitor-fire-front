<script>
import WarnDetailDescription from "@/components/discription/WarnDetailDescription.vue";
import axios from "@/axios";


export default {
  props:["isDetail"],
  components:{

    WarnDetailDescription
  },
  methods:{
    async fetchGroupData(){
      try{
         this.groupData= (await axios.get('/account/selectGroupInfo')).data;
      }catch (error){
        this.$message.error("分组获取失败，请刷新后重新打开表单");
      }
    },
    async update(row) {
      try{
        if(this.groupData==null){
          await this.fetchGroupData();
        }
        this.editDialogVisible = true;
        this.updateForm = {...row};
      }catch (error){
        this.$message.error(error);
      }

    },
    handleDelete(row){
      try{
        axios.post('/warn/deletePolicy',null,{
          params:{
            warnPolicyId:row.id
          }
        });
        this.warnList.splice(row.id-1, 1);
        this.dialogVisible = false;
        this.local.row=null;
      }catch (error){
        this.$message.error(error);
      }

    },
    async saveUpdate() {
      // 保存修改
      try {
        if (this.currentEditIndex !== null) {
          await axios.post('/warn/updatePolicy',this.updateForm);
          window.location.reload();
        }

        this.$message('编辑成功!');
        this.editDialogVisible = false; // 关闭对话框
      } catch (error) {
        this.$message.error(error)
      }

    },
    cancelUpdate() {
      // 取消修改
      this.editDialogVisible = false;
      this.updateForm = {}; // 清空表单
    },
    async changeActive(row) {
      try {
        let temp=null;
        if (row.monitorOn === 1) {
          temp = 0;
        } else if (row.monitorOn === 0) {
          temp = 1;
        } else {
          console.log()
        }
        await axios.post('/warn/changeMonitorOn', null,{
          params:{
            id:row.id,
            monitorOn:temp
          }
        });
        this.$message("告警监控状态已切换!");
        row.monitorOn= temp;
        this.changeDialogVisible=false;
      } catch (error) {
        this.$message.error(error);
      }

    },
    closeDetails(){


      this.detailDialogVisible=false;
      this.local.row=null;
      this.$forceUpdate();
    },
    seeDetails(row) {
      this.local.row=row;
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
    async fetchData(){
      try{
          this.warnList=(await axios.post('/warn/getWarnPolicy')).data;
          this.monitorList=(await axios.post('/monitor/selectLike')).data;
         this.groupData= (await axios.get('/account/selectGroupInfo')).data;
      }catch (error){
        this.$message.error(error);
        this.warnList=[];
        this.monitorList=[];

      }
    },
    async searchData() {
      try {
        this.warnList = (await axios.post('/warn/getWarnPolicy',null,{
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
    filteredWarnList(){
      if(this.isDetail)
      return this.warnList.filter(item => item.monitorOn === 1);
      else
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
      groupData:null,
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
        noticeGroupIds: '',
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
        warnDescription: "", // String
        noticeGroupIds: [], // String
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
          style="width: 100%"
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
            width="160">
        </el-table-column>
        <el-table-column
            prop="monitorOn"
            label="告警是否启用"
            width="120"
        >
          <template v-slot="scope">
            {{ scope.row.monitorOn === 1 ? '已启用' : '未启用' }}
          </template>
        </el-table-column>

        <el-table-column
            prop="warnLevel"
            label="告警级别"
            width="140"
            :formatter="formatWarnLevel">
        </el-table-column>

        <el-table-column
            prop="monitorName"
            label="监控对象名称"
            width="130">
        </el-table-column>
        <el-table-column
            label="监控对象指标"
            width="300">
          <template v-slot="scope">
            {{ monitorMap[scope.row.monitorId].monitorPresetTarget || monitorMap[scope.row.monitorId].monitorNotpresetPromql||'暂无监控对象' }}
          </template>
        </el-table-column>
        <el-table-column
            label="告警策略"
            width="80">
          <template slot-scope="scope">
          {{ scope.row.compareType }} {{scope.row.warnThreshold}}
        </template>
        </el-table-column>

        <el-table-column
          label="当前状态"
          width="100"
          >
        <template v-slot="scope">
          <el-tag
              :closable="false"
              :color="scope.row.isActive ? 'red' : 'success'"
              effect="dark">
            {{ scope.row.isActive ? '正在告警' : '安全' }}
          </el-tag>
        </template>
      </el-table-column>


        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="seeDetails(scope.row)">显示详情</el-button>
            <el-button
                size="mini"
                @click="update(scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="dialogVisible=true;local.row=scope.row">删除</el-button>
            <el-button
                size="mini"
                :type="scope.row.monitorOn?'danger':'primary'"
                @click="changeDialogVisible=true;local1.row=scope.row">启用/禁用告警监控</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
          title="提示"
          :visible.sync="changeDialogVisible"
          width="30%"
      >
        <span>确定要要切换监控状态吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="local1.row=null; changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeActive(local1.row)">确 定</el-button>
      </span>
      </el-dialog>


      <!--详情对话框 -->

      <el-dialog
          v-if="detailDialogVisible"
          title="规则详情"
          :visible.sync="detailDialogVisible"
          width="80%"
      >
        <warn-detail-description :warn-entity="local.row"></warn-detail-description>
        <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="closeDetails">确 定</el-button>
            </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog
          title="编辑告警策略"
          :visible.sync="editDialogVisible"
          width="50%"
      >
        <el-form label-width="120px" :model="updateForm" ref="updateFormRef" >
          <!-- 告警策略名称 -->
          <el-form-item label="告警策略名称" prop="warnName">
            <el-input
                v-model="updateForm.warnName"
                placeholder="请输入告警策略名称"
                :maxlength="20"
                show-word-limit
            ></el-input>
          </el-form-item>

          <!-- 告警级别 -->
          <el-form-item label="告警级别" prop="warnLevel">
            <el-select v-model="updateForm.warnLevel" placeholder="请选择告警级别">
              <el-option label="无" :value="0"></el-option>
              <el-option label="日志输出" :value="1"></el-option>
              <el-option label="存储告警" :value="2"></el-option>
              <el-option label="系统中通知" :value="4"></el-option>
              <el-option label="紧急通知" :value="3"></el-option>
            </el-select>
          </el-form-item>

          <!-- 比较类型 -->
          <el-form-item label="比较类型" prop="compareType">
            <el-select v-model="updateForm.compareType" placeholder="请选择比较类型">
              <el-option label="大于等于" value=">="></el-option>
              <el-option label="等于" value="=="></el-option>
              <el-option label="小于等于" value="<="></el-option>
            </el-select>
          </el-form-item>

          <!-- 告警阈值 -->
          <el-form-item label="告警阈值" prop="warnThreshold">
            <el-input-number
                v-model="updateForm.warnThreshold"
                :min="0"
                placeholder="请输入告警阈值"
            ></el-input-number>
          </el-form-item>

          <!-- 告警描述 -->
          <el-form-item label="告警描述" prop="warnDescription">
            <el-input
                type="textarea"
                v-model="updateForm.warnDescription"
                placeholder="请输入告警描述"
            ></el-input>
          </el-form-item>

          <!-- 通知方式 -->
          <el-form-item label="紧急通知方式" prop="noticeWay" v-if="updateForm.warnLevel===3">
            <el-select v-model="updateForm.noticeWay" placeholder="请选择通知方式">
              <el-option label="消息" value="message"></el-option>
              <el-option label="邮件" value="email"></el-option>
            </el-select>
          </el-form-item>

          <!-- 通知用户ID -->
          <el-form-item label="通知分组">
            <el-select v-model="updateForm.noticeGroupIds" v-if="updateForm.warnLevel>=3" multiple>
              <el-option
                  v-for="item in groupData"
                  :key="item.group.id"
                  :label="item.group.name"
                  :value="item.group.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
    <el-button @click="cancelUpdate">取 消</el-button>
    <el-button type="primary" @click="saveUpdate">保 存</el-button>
  </span>
      </el-dialog>

      <!-- 删除确认对话框 -->
      <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
      >
        <span>确定要删除该监控对象吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete(local.row)">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<style scoped>

</style>
<script>
import WarnDetailDescription from "@/components/discription/WarnDetailDescription.vue";


export default {
  props:["isDetail"],
  components:{

    WarnDetailDescription
  },
  methods:{
    search(){

    },
    update(){
      this.editDialogVisible=true;
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
  mounted() {this.warnList = [
    {
      id: 1,
      monitorOn: 1,
      warnName: '告警策略1',
      warnLevel: 2,
      compareType: '>=',
      warnThreshold: 10,
      warnDescription: '这是一个告警策略',
      noticeUserIds: '1,2,3',
      noticeWay: 'message',
      isActive: 1
    },
    {
      id: 2,
      monitorOn: 0,
      warnName: '告警策略2',
      warnLevel: 3,
      compareType: '==',
      warnThreshold: 20,
      warnDescription: '这是一个禁用的告警策略',
      noticeUserIds: '4,5',
      noticeWay: 'email',
      isActive: 0
    },
    {
      id: 3,
      monitorOn: 1,
      warnName: '告警策略3',
      warnLevel: 1,
      compareType: '<=',
      warnThreshold: 5,
      warnDescription: '这是一个活跃的告警策略',
      noticeUserIds: '6',
      noticeWay: 'message',
      isActive: 1
    }
  ];
  }
}
</script>

<template>
    <div style="margin-top: 50px">
      <el-row :gutter="80">
        <el-col :span="80">
          <el-input autosize v-model="searchstr" placeholder="请输入查询目标"></el-input>
        </el-col>
        <el-col :span="80">
          <el-button type="primary" @click="search">搜索</el-button>
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
            label="告警策略id"
            width="100">
        </el-table-column>
        <el-form-item label="当前监控名称">
          <el-input
              v-model="monitor.monitorName"
              placeholder="当前监控名称"
              disabled
          ></el-input>
        </el-form-item>
        <el-table-column
            fixed
            prop="warnName"
            label="告警策略名称"
            width="160">
        </el-table-column>
        <el-table-column
            prop="monitorOn"
            label="告警是否启用"
            width="200">
        </el-table-column>
        <el-table-column
            prop="warnLevel"
            label="告警级别"
            width="80">
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
            width="80"
        v-if="isDetail">
          <template v-slot="scope">
            {{ scope.row.isActive ? '活跃' : '不活跃' }}
          </template>
        </el-table-column>


        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="seeDetails(scope.row)">显示详情</el-button>
            <el-button
                size="mini"
                v-if="!isDetail"
                @click="update(scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                v-if="!isDetail"
                @click="dialogVisible=true;local.row=scope.row">删除</el-button>
            <el-button
                size="mini"
                type="primary"
                v-if="!isDetail"
                @click="changeActive(scope.row)">打开/关闭告警</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--详情对话框 -->

      <el-dialog
          title="规则详情"
          :visible.sync="detailDialogVisible"
          width="80%"
      >
        <warn-detail-description :idd="local.id" :is-detail="this.isDetail"></warn-detail-description>
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
                :maxlength="10"
                show-word-limit
            ></el-input>
          </el-form-item>

          <!-- 告警级别 -->
          <el-form-item label="告警级别" prop="warnLevel">
            <el-select v-model="updateForm.warnLevel" placeholder="请选择告警级别">
              <el-option label="NOTHING" :value="0"></el-option>
              <el-option label="LOG_ONLY" :value="1"></el-option>
              <el-option label="STORE_INFO" :value="2"></el-option>
              <el-option label="NOTICE_USER" :value="3"></el-option>
            </el-select>
          </el-form-item>

          <!-- 是否启用监控 -->
          <el-form-item label="监控状态">
            <el-radio-group v-model="updateForm.monitorOn">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
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
          <el-form-item label="资源描述" prop="warnDescription">
            <el-input
                type="textarea"
                v-model="updateForm.warnDescription"
                placeholder="请输入资源描述"
            ></el-input>
          </el-form-item>

          <!-- 通知方式 -->
          <el-form-item label="通知方式" prop="noticeWay">
            <el-select v-model="updateForm.noticeWay" placeholder="请选择通知方式">
              <el-option label="消息" value="message"></el-option>
              <el-option label="邮件" value="email"></el-option>
            </el-select>
          </el-form-item>

          <!-- 通知用户ID -->
          <el-form-item label="通知用户ID" prop="noticeUserIds">
            <el-input
                v-model="updateForm.noticeUserIds"
                placeholder="请输入通知用户ID"
            ></el-input>
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
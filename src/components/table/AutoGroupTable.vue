<script>

import axios from "@/axios";
import AutoGroupPolicyTable from "@/components/table/AutoGroupPolicyTable.vue";

export default {
  components: {AutoGroupPolicyTable},
  methods:{
    search() {
      this.searchData();
    },
    async changeStatus(id) {
      try {
        await axios.post('/auto/changeStatusGroup',null,{
          params:{
            autoGroupId:id
          }
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        this.$message.error(error);
      }
    },
    update(row) {
      this.local.row=row;
      this.editDialogVisible = true;
    },
    view(row) {
      this.local.row=row;
      this.infoDialogVisible = true;
    },
    async handleDelete(row) {
      try{
        // 删除逻辑
        await axios.post('/auto/deleteGroup', null, {
          params:{
            autoGroupId:row.id
          }
        });
        this.autoGroupList.splice(row.id - 1, 1);
        this.dialogVisible = false;
        this.local.row = null;
        this.$message('删除成功！');
        window.location.reload();
      }catch (error){
        this.$message.error(error);
      }

    },
    async saveUpdate() {
      try {
        await axios.post('/auto/update', this.updateForm);
        // 保存修改
        if (this.currentEditIndex !== null) {
          this.$set(this.autoList, this.currentEditIndex, {...this.updateForm});
        }
        this.updateForm={
          id: null,
          autoName: "",
          autoPolicy: "",
          compareType: "",
          warnThreshold: null,
          monitorOn: null,
        };
        this.local.row=null;
        this.$message('修改成功！');
        this.editDialogVisible = false; // 关闭对话框
      }catch (error){
        this.$message.error(error);
      }

    },
    cancelUpdate() {
      // 取消修改
      this.editDialogVisible = false;
      this.updateForm = {
        monitorName: "",
        monitorDescription: "",
        monitorResourceIds: [],
        monitorType:"",
      }; // 清空表单
      this.local.row=null
    },
    async fetchData(){
      try{
        this.autoGroupList=(await axios.post('/auto/selectGroup',null,{
          params: {
            str:this.searchstr
          }
        })).data;
        this.softwareResourceList=(await axios.post('/resource/selectSoftware')).data;
        this.softwareResourceList.forEach(resource => {
          this.softwareResourceMap[resource.id] = resource;

        });
        this.finishFetchData=true;
      }catch (error){
        this.$message.error(error);

      }
    },
    async searchData() {
      try {
        this.autoGroupList=(await axios.post('/auto/selectGroup',null,{
          params: {
            str:this.searchstr
          }
        })).data;

      } catch (error) {
        this.$message.error(error);

      }
    },
  },
  data() {
    return {
      infoDialogVisible:false,
      finishFetchData:false,
      searchstr:'',
      dialogVisible:false,
      editDialogVisible:false,
      local:{
        index:null,
        row:null
      },

      autoGroupList:[],

      softwareResourceList:[],
      softwareResourceMap: {},
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
  }
};
</script>

<template>
  <div style="margin-top: 50px">
    <el-row >
      <el-col :span="4">
        <el-input autosize v-model="searchstr" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button  @click="fetchData">重置</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 50px"></div>

    <el-table
        v-if="finishFetchData"
        border
        :data="autoGroupList"
        style="width: 100%;margin-bottom: 80px"
        height="350">
      <el-table-column
          fixed
          prop="id"
          label="规则组id"
          width="100">
      </el-table-column>

      <el-table-column label="是否启用" width="80">
        <template slot-scope="scope">
          <el-tag
              :closable="false"
              :color="scope.row.monitorOn === 1 ? '#67C23A' : '#F56C6C'"
              effect="dark"
          >
            {{ scope.row.monitorOn === 1 ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="autoGroupName"
          label="规则组名称"
          width="160">
      </el-table-column>
      <el-table-column
          prop="description"
          label="规则组描述"
          width="360">
      </el-table-column>

      <el-table-column
          label="主节点"
          width="160">
        <template slot-scope="scope">
          {{softwareResourceMap[scope.row.masterNodeResourceId].resourceName+"-"+softwareResourceMap[scope.row.masterNodeResourceId].resourceIp+":"+softwareResourceMap[scope.row.masterNodeResourceId].resourcePort|| '未知资源'}}
        </template>
      </el-table-column>


      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="changeStatus(scope.row.id)">{{ scope.row.monitorOn === 1 ? '关闭监控' : '打开监控' }}</el-button>
          <el-button
              size="mini"
              @click="view(scope.row)">查看规则组</el-button>
          <el-button
              size="mini"
              @click="update(scope.row)">编辑规则组</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="local.row=scope.row;dialogVisible=true;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--详情对话框-->
    <el-dialog
        title="规则组信息"
        :visible.sync="infoDialogVisible"
        width="90%"
        v-if="infoDialogVisible"

    >
      <auto-group-policy-table :id="local.row.id" :type="'info'"></auto-group-policy-table>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑规则组"
        :visible.sync="editDialogVisible"
        width="90%"
        v-if="editDialogVisible"

    >
      <auto-group-policy-table :id="local.row.id" :type="'edit'"></auto-group-policy-table>
    </el-dialog>
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
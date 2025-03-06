<script>

import axios from "@/axios";

export default {
  components: {},
  methods:{
    search() {
      this.searchData();
    },
    update(row) {

      // 打开编辑对话框

      // 将当前行的数据复制到表单中
      this.currentEditIndex = this.monitorList.indexOf(row);
      this.updateForm = { ...row }; // 使用扩展运算符复制对象
      this.editDialogVisible = true;
      console.log(this.updateForm.monitorResourceIds);
    },
    async handleDelete(row) {
      try{
        // 删除逻辑
        await axios.post('/monitor/delete', null, {
          params:{
           monitorId:row.id
          }
        });
        this.monitorList.splice(row.id - 1, 1);
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
        await axios.post('/monitor/update', this.updateForm);
        // 保存修改
        if (this.currentEditIndex !== null) {
          this.$set(this.monitorList, this.currentEditIndex, {...this.updateForm});
        }
        this.updateForm={
          monitorName: "",
          monitorDescription: "",
          monitorResourceIds: [],
          monitorType:"",
        };
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
        this.monitorList=(await axios.post('/monitor/selectLike')).data;
        this.softwareResourceList=(await axios.post('/resource/selectSoftware')).data;
        this.hardwareResourceList=(await axios.post('/resource/selectServer')).data;

      }catch (error){
        this.$message.error(error);
        this.monitorList=[];
        this.softwareResourceList=[];
        this.hardwareResourceList=[];

      }
    },
    async searchData() {
      try {
        this.monitorList = (await axios.post('/monitor/selectLike',null,{
          params: {
            str:this.searchstr
          }
        })).data;

      } catch (error) {
        this.$message.error(error);
        this.monitorList = [];

      }
    },
  },
  data() {
    return {
      searchstr:'',
      dialogVisible:false,
      local:{
        index:null,
        row:null
      },
      monitor: {
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
      monitorList:[],
      updateForm: { // 表单数据
        monitorName: "",
        monitorDescription: "",
        monitorResourceIds: [],
        monitorType:"",
      },
      currentEditIndex: null, // 当前编辑的行索引
      editDialogVisible: false, // 编辑对话框的可见性
      softwareResourceList:[],
      hardwareResourceList:[],
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    currentResourceList() {
      return this.updateForm.monitorType === 'server'
          ? this.hardwareResourceList
          : this.softwareResourceList.filter(item=>{
            return item.resourceType === this.updateForm.monitorType;
          })
    },
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
        border
        :default-sort="{ prop: 'id', order: 'descending' }"
        :data="monitorList"
        style="width: 100%"
        height="400">
      <el-table-column
          fixed
          prop="id"
          label="监控id"
          width="100">
      </el-table-column>
      <el-table-column
          fixed
          prop="monitorName"
          label="监控名称"
          width="160">
      </el-table-column>
      <el-table-column
          prop="monitorType"
          label="监控类型"
          width="80">
      </el-table-column>
      <el-table-column
          label="监控对象指标/自定义监控语句"
          width="300">
        <template slot-scope="scope">
          {{ scope.row.monitorPresetTarget || scope.row.monitorNotpresetPromql || '无数据' }}
        </template>
      </el-table-column>
      <el-table-column
          prop="monitorDemonstration"
          label="监控方式"
          width="80">
      </el-table-column>
      <el-table-column
          prop="monitorDescription"
          label="资源描述"
          width="200">
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="update(scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="local.row=scope.row;dialogVisible=true;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑监控对象"
        :visible.sync="editDialogVisible"
        width="50%"
    >
      <el-form label-width="120px">
        <el-form-item label="监控名称">
          <el-input v-model="updateForm.monitorName"></el-input>
        </el-form-item>
        <el-form-item label="监控对象">
          <el-select v-model="updateForm.monitorResourceIds" multiple placeholder="请选择">
            <el-option
                v-for="item in currentResourceList"
                :key="item.id"
                :label="updateForm.monitorType === 'server' ? `${item.resourceName} ${item.resourceType} ${item.resourceIp}` : (updateForm.monitorType === 'software' ?`${item.resourceName} ${item.resourceType} ${item.resourceIp}:${item.resourcePort}`:`${item.resourceName} ${item.resourceType} ${item.resourceIp}:${item.reservedParam2}`)"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源描述">
          <el-input type="textarea" v-model="updateForm.monitorDescription"></el-input>
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


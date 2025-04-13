<script>

import axios from "@/axios";

export default {
  components: {},
  methods:{
    search() {
      this.searchData();
    },
    async changeStatus(id) {
      try {
        await axios.post('/auto/changeStatus',null,{
          params:{
            autoId:id
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

      // 打开编辑对话框

      // 将当前行的数据复制到表单中
      this.currentEditIndex = this.autoList.indexOf(row);
      this.local.row=row;
      this.updateForm = { ...row }; // 使用扩展运算符复制对象
      this.editDialogVisible = true;
    },
    async handleDelete(row) {
      try{
        // 删除逻辑
        await axios.post('/auto/delete', null, {
          params:{
           autoId:row.id
          }
        });
        this.autoList.splice(row.id - 1, 1);
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
        this.autoList=(await axios.post('/auto/select',null,{
          params: {
            str:this.searchstr
          }
        })).data;
        this.softwareResourceList=(await axios.post('/resource/selectSoftware')).data;
        this.softwareResourceList.forEach(resource => {
          this.softwareResourceMap[resource.id] = resource;

        });
        this.finishFetchData=true;
        console.log(this.softwareResourceMap)
      }catch (error){
        this.$message.error(error);

      }
    },
    async searchData() {
      try {
        this.autoList=(await axios.post('/auto/select',null,{
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
      finishFetchData:false,
      searchstr:'',
      dialogVisible:false,
      editDialogVisible:false,
      local:{
        index:null,
        row:null
      },
      auto: {
        id: null,
        autoName: "",
        autoPolicy: "",
        compareType: "",
        warnThreshold: null,
        resourceId: null,
        monitorOn: null,
        monitorPresetTarget: "",
        modifiedTime: null
      },
      autoList:[],
      updateForm:{
        id: null,
        autoName: "",
        autoPolicy: "",
        compareType: "",
        warnThreshold: null,
        monitorOn: null,
        monitorPresetTarget:null,
      },
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
        :data="autoList"
        style="width: 100%;margin-bottom: 80px"
        height="350">
      <el-table-column
          fixed
          prop="id"
          label="自动化id"
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
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-tag
              :closable="false"
              :color="'#4f912c'"
              effect="dark"
          >
            {{ scope.row.autoPolicy === 'restart' ? '重启' : '停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="autoName"
          label="自动化名称"
          width="160">
      </el-table-column>
      <el-table-column
          label="资源名称"
          width="160">
        <template slot-scope="scope">
          {{softwareResourceMap[scope.row.resourceId].resourceName|| '未知资源'}}
        </template>
      </el-table-column>
      <el-table-column
          prop="monitorPresetTarget"
          label="触发指标"
          width="160">
      </el-table-column>
      <el-table-column
          label="触发条件"
          width="80">
        <template slot-scope="scope">
          {{scope.row.compareType }}{{scope.row.warnThreshold}}
        </template>
      </el-table-column>
      <el-table-column
          prop="triggerTimes"
          label="触发次数"
          width="60">
      </el-table-column>
      <el-table-column
          prop="modifiedTime"
          label="修改时间"
          width="300">
      </el-table-column>

      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="changeStatus(scope.row.id)">{{ scope.row.monitorOn === 1 ? '关闭监控' : '打开监控' }}</el-button>
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
        title="编辑自动启停对象"
        :visible.sync="editDialogVisible"
        width="50%"
        v-if="editDialogVisible"
    >
      <el-form label-width="120px">
        <el-form-item label="自动化名称">
          <el-input v-model="updateForm.autoName"></el-input>
        </el-form-item>
        <el-form-item label="资源名称"  >
          <el-input  disabled :placeholder="softwareResourceMap[local.row.resourceId].resourceName"></el-input>
        </el-form-item>
        <el-form-item label="自动化策略" prop="autoPolicy">
          <el-select v-model="updateForm.autoPolicy" placeholder="请选择自动策略">
            <el-option label="停止" value="stop"></el-option>
            <el-option label="重启" value="restart"></el-option>
            <!--            <el-option label="启动" value="start"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="监控指标"  >
          <el-input  disabled v-model="updateForm.monitorPresetTarget"></el-input>
        </el-form-item>
        <el-form-item label="比较类型" prop="compareType">
          <el-select v-model="updateForm.compareType" placeholder="请选择比较类型">
            <el-option label="等于" value="=="></el-option>
            <el-option label="大于" value=">="></el-option>
            <el-option label="小于" value="<="></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发阈值" prop="warnThreshold">
          <el-input-number
              v-model="updateForm.warnThreshold"
              :min="0"
              placeholder="请输入触发阈值"
          ></el-input-number>
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
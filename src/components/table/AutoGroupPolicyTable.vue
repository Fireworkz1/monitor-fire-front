<script>

import axios from "@/axios";

export default {
  props:["id","type"],
  components: {},
  methods:{
    search() {
      this.searchData();
    },

    addRow() {
      const newRow = {
        id: null, // 自动生成新行的 ID
        monitorPresetTarget: '',
        compareType: '',
        warnThreshold: 1,
        type:'group',
        targetIds: [],
        monitorOn:this.autoGroup.monitorOn,
        resourceId:this.autoGroup.masterNodeResourceId,
        autoPolicy: '',
        change1: 1,
      };
      console.log(newRow)
      this.autoList.push(newRow); // 将新行添加到 autoList 中
      this.$forceUpdate();
    },
    update(row) {
      row.change1=0
      // 打开编辑对话框

      // 将当前行的数据复制到表单中
      this.currentEditIndex = this.autoList.indexOf(row);

      this.updateForm = { ...row }; // 使用扩展运算符复制对象

      this.saveUpdate(row);
    },
    async handleDelete(row) {
      try{
        // 删除逻辑
        if(row.id!==null){
          await axios.post('/auto/delete', null, {
            params:{
              autoId:row.id
            }
          });
        }

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
        if(this.updateForm.id===null){
          let newAutoId=(await axios.post('/auto/create', this.updateForm)).data;
          this.autoGroup.autoPolicyIds.push(newAutoId)
          await axios.post('/auto/updateGroup', this.autoGroup)
        }else{await axios.post('/auto/update', this.updateForm);}


        // 保存修改
        if (this.currentEditIndex !== null) {
          this.$set(this.autoList, this.currentEditIndex, {...this.updateForm});
        }
        this.updateForm={
          id: null, // 自动生成新行的 ID
          monitorPresetTarget: '',
          compareType: '',
          warnThreshold: null,
          type:'',
          targetIds: [],
          monitorOn:null,
          resourceId:null,
          autoPolicy: '',

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
        id: null, // 自动生成新行的 ID
        monitorPresetTarget: '',
        compareType: '',
        warnThreshold: null,
        type:'',
        targetIds: [],
        monitorOn:null,
        resourceId:null,
        autoPolicy: '',

      }; // 清空表单
      this.local.row=null
    },
    async fetchData(){
      try{
        this.metricList=(await axios.get('/monitor/metricList')).data;
        console.log(this.metricList)
        this.autoList=(await axios.post('/auto/selectGroupPolicy',null,{
          params: {
            groupId:this.id
          }
        })).data;

        this.autoGroup=(await axios.post('/auto/selectGroupById',null,{
          params: {
            id:this.id
          }
        })).data;
        this.softwareResourceList=(await axios.post('/resource/selectSoftware')).data;
        this.softwareResourceList.forEach(resource => {
          this.softwareResourceMap[resource.id] = resource;

        });
        this.slaveSoftwareList = this.softwareResourceList.filter(item => this.autoGroup.resourceIds.includes(item.id)&&this.autoGroup.masterNodeResourceId!==item.id);

        console.log(this.softwareResourceList)
        this.finishFetchData=true;
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
    change(row){
      console.log(row.change1)
      row.change1=1
    },
    getLabelById(id) {
      const item = this.slaveSoftwareList.find(item => item.id === id);
      return item ? `${item.resourceName}-${item.resourceIp}:${item.resourcePort}` : '未知资源';
    },
  },
  data() {
    return {

      metricList:[],
      slaveSoftwareList:[],
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
      autoGroup:{
        id: null,
        autoGroupName: "",
        autoPolicyIds: [],
        resourceIds: [],
        description: "",
        monitorOn: null,
        masterNodeResourceId: null
      },
      autoList:[],

      updateForm:{
        id: null, // 自动生成新行的 ID
        monitorPresetTarget: '',
        compareType: '',
        warnThreshold: null,
        type:'',
        targetIds: [],
        monitorOn:null,
        resourceId:null,
        autoPolicy: '',

      },
      softwareResourceList:[],
      softwareResourceMap: {},
      compareOptions: [{
      value: '>=',
      label: '大于等于'
    }, {
      value: '<=',
      label: '小于等于'
    }, {
      value: '==',
      label: '等于'
    }],
      action:[{
        value: 'start',
        label: '启动'
      }, {
        value: 'stop',
        label: '停止'
      }],
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    filteredMetrics() {
      return (resourceId) => {
        return this.metricList.filter(metric => metric.type === this.softwareResourceMap[resourceId].resourceType);
      };
    },
  },
};
</script>

<template>
  <div>
    <el-button v-if="type==='edit'&&finishFetchData" type="primary" size="small" @click="addRow" style="margin-bottom: 30px">添加规则</el-button>
    <el-table
        v-if="finishFetchData"
        border
        :data="autoList"
        style="width: 100%;margin-bottom: 80px"
        height="350">

      <el-table-column
          label="主节点"
          width="300"
      >
        <template>
          {{softwareResourceMap[autoGroup.masterNodeResourceId].resourceName+"-"+softwareResourceMap[autoGroup.masterNodeResourceId].resourceIp+":"+softwareResourceMap[autoGroup.masterNodeResourceId].resourcePort|| '未知资源'}}
        </template>
      </el-table-column>

<!--      详情表格列-->
      <el-table-column
          label="触发指标"
          prop="monitorPresetTarget"
          v-if="type!=='edit'">
      </el-table-column>
      <el-table-column
          label="触发条件"
          width="180"
          v-if="type!=='edit'">
        <template slot-scope="scope">
          {{scope.row.compareType }}{{scope.row.warnThreshold}}
        </template>
      </el-table-column>

      <el-table-column
          label="则"
          width="80"
          v-if="type!=='edit'">
        <template>
          则
        </template>
      </el-table-column>
      <el-table-column
          label="响应从节点"
          width="680"
          v-if="type!=='edit'">
        <template slot-scope="scope">
          <span v-for="id in scope.row.targetIds" :key="id">
        {{ getLabelById(id) }}<span v-if="scope.row.targetIds.length > 1"><br> </span>
      </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-tag
              :closable="false"
              :color="'#4f912c'"
              effect="dark"
          >
            {{ scope.row.autoPolicy === 'start' ? '启动' : '停止' }}
          </el-tag>
        </template>
      </el-table-column>


<!--      修改表格列-->
      <el-table-column
          label="触发指标"
          width="220"
          v-if="type==='edit'">
        <template slot-scope="scope">
          <el-select v-model="scope.row.monitorPresetTarget" placeholder="请选择监控指标" @change="change(scope.row)">
            <el-option
                v-for="metric in filteredMetrics(scope.row.resourceId)"
                :key="metric.target"
                :label="metric.target+'  '+metric.description"
                :value="metric.target">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          label="比较方式"
          width="120"
          v-if="type==='edit'"
          >
        <template slot-scope="scope">
          <el-select v-model="scope.row.compareType" placeholder="请选择" size="small" @change="change(scope.row)">
            <el-option
                v-for="item in compareOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          label="触发阈值"
          width="160"
          v-if="type==='edit'">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.warnThreshold" @change="change(scope.row)"  label="描述文字" size="small"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
          label="则"
          width="40"
          v-if="type==='edit'">
        <template>
          则
        </template>
      </el-table-column>
      <el-table-column
          label="响应从节点"
          width="180"
          v-if="type==='edit'">
        <template slot-scope="scope">
          <el-select v-model="scope.row.targetIds" placeholder="请选择" size="small" @change="change(scope.row)" multiple>
            <el-option
                v-for="item in slaveSoftwareList"
                :key="item.id"
                :label="item.resourceName+'-'+item.resourceIp+':'+item.resourcePort"
                :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" v-if="type==='edit'">
        <template slot-scope="scope">
          <el-select v-model="scope.row.autoPolicy" placeholder="请选择" size="small" @change="change(scope.row)">
            <el-option
                v-for="item in action"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="操作" v-if="type==='edit'">
        <template slot-scope="scope">
          <el-button
              size="mini"
              :disabled="scope.row.change1!==1"
              :type="scope.row.change1===1?'primary':''"
              @click="update(scope.row)">保存</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="local.row=scope.row;dialogVisible=true;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>



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
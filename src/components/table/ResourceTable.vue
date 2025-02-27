<script>
import ResourceDetailComponent from "@/components/discription/ResourceDetailDescription.vue";
import axios from "@/axios";



export default {
  methods: {
    closeDetails() {
      this.local.showId=null;
      this.local.resourceType='';
      this.showDetail=false;
    },
    async handleDelete(row) {
      try {
        if (row.resourceType === "server") {
          await axios.post('/resource/deleteServer', null, {
            params: {
              id: row.id
            }
          });
        } else if (row.resourceType === "software") {
          await axios.post('/resource/deleteSoftware', null, {
            params: {
              id: row.id
            }
          });
        } else throw new Error("未知资源类型");
        this.tableData.splice(row.id - 1, 1);
        this.dialogVisible = false;
      } catch (error) {
        this.$message.error(error);
      }
      this.local.row = null;
    },
    filterHandler(value, row, column){
      const property = column['property'];
      console.log(value)
      return row[property] === value;
    },
    seeDetails(row){
      this.local.showId=row.id;
      this.local.resourceType=row.resourceType;
      this.showDetail=true;
    },
    formatterHandler(row, column, cellValue){
        // 根据 warnLevel 的值返回对应的 label
        switch (cellValue) {
          case 'server':
            return "服务器";
          case 'software':
            return "软件资源";
          default:
            return "未知";

      }
    },
    formatterHandlerForResource(row, column, cellValue){
      switch (cellValue) {
        case '0':
          return "否";
        case '1':
          return "是";
        default:
          return "未知";

      }
    },
    async fetchData(){
      try{
      let url=null;
      if(this.resourceType==='server'){
        url='/resource/selectServer';
        this.tableData=(await axios.post(url)).data;
        console.log(this.tableData)
      }else if(this.resourceType==='software'){
        url='/resource/selectSoftware';
        this.tableData=(await axios.post(url)).data;
        console.log(this.tableData)
      }else{
        this.tableData1=(await axios.post('/resource/selectSoftware')).data;
        this.tableData=(await axios.post('/resource/selectServer')).data;
        this.tableData=this.tableData1.concat(this.tableData);
        this.tableData.sort((a,b)=>b.age-a.age)
      }
      }catch (error){
        this.$message.error(error);
        this.tableData=[];
        this.tableData1=[];
      }
    },async searchData(){
      try{
          this.tableData1=(await axios.post('/resource/selectServer', null, {
            params: {
              str:this.local.searchstr
            }
          })).data;
          this.tableData=(await axios.post('/resource/selectSoftware', null, {
            params: {
              str:this.local.searchstr
            }
          })).data;
          this.tableData=this.tableData1.concat(this.tableData);
          this.tableData.sort((a,b)=>b.age-a.age)
      }catch (error){
        this.$message.error(error);
        // this.tableData=[];
        // this.tableData1=[];
      }
      this.local.searchstr='';
    },
    async changeStatus(row) {
      try {
        this.local.row = JSON.parse(JSON.stringify(row));
        if (this.local.row.resourceManageOn === 0)
          this.local.row.resourceManageOn = 1;
        else
          this.local.row.resourceManageOn = 0;
        const response= this.tableData = (await axios.post('/resource/edit',this.local.row));
        if(response.code===200)
        row.resourceManageOn=this.local.row.resourceManageOn;
        this.statusDialogVisible=false;
        this.$message('切换成功');
      }catch (error){
        this.$message.error(error);
      }
      this.local.row=null;
    }
  },
  props:["editAllow","resourceType"],
  data(){
    return{
      local:{
        index:null,
        searchstr:'',
        resourceType:'',
        showId:null,
        row:null,
      },
      showDetail:false,
      dialogVisible:false,
      statusDialogVisible:false,
      tableData:[],
      tableData1:[]
    }
  },
  components:{
    ResourceDetailComponent
  },mounted() {
    this.fetchData();
  }
};
</script>

<template>

  <div style="margin-top: 50px">
    <el-row  v-if="editAllow">
      <el-col :span="4">
        <el-input autosize v-model="local.searchstr" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button  @click="fetchData">重置</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 50px"></div>
    <el-table
        border
        :default-sort="{ prop: 'addedTime', order: editAllow? 'ascending':'descending' }"
        :data="tableData"
        style="width: 100%"
        height="400">
      <el-table-column
          fixed
          prop="id"
          label="id"
          width="60">
      </el-table-column>
      <el-table-column
          prop="resourceName"
          label="资源名称"
          width="150">
      </el-table-column>
      <el-table-column
          fixed
          :filters="[{text: '服务器', value: 'server'}, {text: '软件资源', value: 'software'}]"
          :filter-method="filterHandler"
          :formatter="formatterHandler"
          prop="resourceType"
          label="资源类型"
          v-if="resourceType==null"
          width="80">
      </el-table-column>
      <el-table-column
          prop="resourceIp"
          label="IP"
          width="150">
      </el-table-column>
      <el-table-column
          label="Port"
          v-if="resourceType!=='server'"
          width="75">
        <template slot-scope="scope">
          {{ scope.row.resourcePort ||  '——' }}
        </template>
      </el-table-column>
      <el-table-column
          label="二级类型"
          v-if="resourceType!=='server'"
          width="90">
        <template slot-scope="scope">
          {{ scope.row.resourceTypeSecond ||  '——' }}
        </template>
      </el-table-column>
      <el-table-column
          prop="addedTime"
          label="添加时间"
          width="240">
      </el-table-column>
      <el-table-column
          label="启动模式"
          v-if="resourceType!=='server'"
          width="80"
          ><template slot-scope="scope">
          {{ scope.row.startMode ||  '——' }}
        </template>
      </el-table-column>
      <el-table-column v-if="editAllow" :formatter="formatterHandlerForResource" label="资源状态" width="120">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>是否启动监控: {{ scope.row.resourceManageOn===0?'未启用':'已启用' }}</p>
            <p>资源是否上线: {{ scope.row.resourceUp===0?'否':'是' }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.resourceManageOn===0?'未启用':'已启用' }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="editAllow">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="seeDetails(scope.row)">查看详情</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="local.row=scope.row;dialogVisible=true;">删除</el-button>
          <el-button
              size="mini"
              :type="scope.row.resourceManageOn?'danger':'primary'"
              @click="local.row=scope.row;statusDialogVisible=true">切换资源启用状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        title="提示"
        :visible.sync="statusDialogVisible"
        width="30%"
    >
      <span>确定要切换资源状态吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="statusDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeStatus(local.row)">确 定</el-button>
  </span>
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

    <el-dialog
        :title="local.resourceType === 'server' ? '服务器资源详情' : '软件资源详情'"
        :visible.sync="showDetail"
        width="80%"
    >
      <resource-detail-component v-if="showDetail" :idd="local.showId" :type="local.resourceType"></resource-detail-component>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="closeDetails">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<style scoped>

</style>
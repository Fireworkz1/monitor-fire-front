<script>
import ResourceDetailComponent from "@/components/discription/ResourceDetailDescription.vue";

export default {
  methods: {
    closeDetails() {
      this.local.showId=null;
      this.local.resourceType='';
      this.showDetail=false;
    },
    handleDelete(row) {
      this.tableData.splice(row.id-1, 1);
      this.dialogVisible = false;
      this.local.row=null;
    },
    filterHandler(value, row, column){
      const property = column['property'];
      console.log(value)
      return row[property] === value;
    },search(){
      this.local.searchstr=''
    },
    seeDetails(row){
      this.local.showId=row.id;
      this.local.resourceType=row.resourceType;
      this.showDetail=true;
    }
  },
  props:["editAllow"],
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
      tableData:[{
        id:1,
        resourceName:'阿里云',
        resourceType:'server',
        resourceIp:'180.180.180.180',
        resourcePort:'9900',
        resourceTypeSecond:'nacos',
        addedTime:'2',
        resourceMonitorOn:'1',
        resourceDescription:'阿达伟大伟大达瓦',
        resourceUp:'1',
        startMode:'docker',
      },{
        id:2,
        resourceName:'不知道什么云',
        resourceType:'software',
        resourceIp:'180.180.180.180',
        resourcePort:'9900',
        resourceTypeSecond:'nacos',
        addedTime:'1',
        resourceMonitorOn:'1',
        resourceDescription:'阿达伟大伟大达瓦',
        resourceUp:'1',
        startMode:'docker',
      }]
    }
  },
  components:{
    ResourceDetailComponent
  }
};
</script>

<template>
  <div style="margin-top: 50px">
    <el-row :gutter="80" v-if="editAllow">
      <el-col :span="80">
        <el-input autosize v-model="local.searchstr" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="80">
        <el-button type="primary" @click="search">搜索</el-button>
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
          label="资源id"
          width="120">
      </el-table-column>
      <el-table-column
          fixed
          prop="resourceName"
          label="资源名称"
          width="150">
      </el-table-column>
      <el-table-column
          fixed
          :filters="[{text: '服务器', value: 'server'}, {text: '软件资源', value: 'software'}]"
          :filter-method="filterHandler"
          prop="resourceType"
          label="资源类型"
          width="120">
      </el-table-column>
      <el-table-column
          prop="resourceIp"
          label="IP"
          width="180">
      </el-table-column>
      <el-table-column
          prop="resourcePort"
          label="Port"
          width="90">
      </el-table-column>
      <el-table-column
          prop="resourceTypeSecond"
          label="二级类型"
          width="90">
      </el-table-column>
      <el-table-column
          prop="addedTime"
          label="添加时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="startMode"
          label="启动模式"
          >
      </el-table-column>
      <el-table-column v-if="editAllow" label="监控是否启动" width="80">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>监控是否启动: {{ scope.row.resourceMonitorOn }}</p>
            <p>资源是否上线: {{ scope.row.resourceUp }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.resourceMonitorOn }}</el-tag>
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
              @click="dialogVisible=true;this.local.row=scope.row">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
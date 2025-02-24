<script>
export default {
  methods: {
    handleDetails(index) {
      console.log(this.tableData[index].resourceName);
    },
    handleDelete() {
      console.log(this.local.index);
      this.local.index=0
    },
    filterHandler(value, row, column){
      const property = column['property'];
      console.log(value)
      return row[property] === value;
    },search(){
      this.local.searchstr=''
    }
  },
  props:["editAllow"],
  data(){
    return{
      local:{
        index:0,
        searchstr:'',
      },
      dialogVisible:false,
      tableData:[{
        id:1,
        resourceName:'阿里云',
        resourceType:'server',
        resourceIp:'180.180.180.180',
        resourcePort:'9900',
        resourceTypeSecond:'nacos',
        addedTime:'',
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
        addedTime:'',
        resourceMonitorOn:'1',
        resourceDescription:'阿达伟大伟大达瓦',
        resourceUp:'1',
        startMode:'docker',
      }]
    }
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
        :default-sort="{ prop: 'addedTime', order: 'descending' }"
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
          width="120">
      </el-table-column>
      <el-table-column v-if="editAllow" label="监控是否启动" width="120">
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
              @click="handleDetails(scope.$index, scope.row)">查看详情</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="dialogVisible=true;local.index=scope.$index">删除</el-button>
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
    <el-button type="primary" @click="handleDelete(local.index)">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<style scoped>

</style>
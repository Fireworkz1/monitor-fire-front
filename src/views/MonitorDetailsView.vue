<script>
import HelloWorld from "@/components/title/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import MonitorOverseeComponent from "@/components/MonitorOverseeComponent.vue";
import PageLabel from "@/components/title/PageLabel.vue";
import axios from "@/axios";


export default {
  name: 'MonitorDetailsView',
  components: {
    PageLabel,
    HelloWorld,
    NavigatorComponent,
    MonitorOverseeComponent
  },
  methods:{
    async fetchData() {
      try{
        this.items = (await axios.post('/monitor/selectLike')).data;
      }catch (error){
        this.$message.error(error);
      }
    },
    async searchData(){
      try{
          this.items = (await axios.post('/monitor/selectLike',null,{
            params: {
              str:this.searchstr
            }
          })).data;
      }catch (error){
        this.items=[]
        this.$message.error(error);
      }
    },
    jumpToDetail(item){
      if(item.monitorDemonstration==='graph'){
        this.$router.push({ name: 'MonitorDataView', query: { monitorId: item.id }});
      }else if(item.monitorDemonstration==='table'){
        this.$router.push({ name: 'MonitorDataView', query: { monitorId:item.id }});
      }else {
        this.$message.error('无法查看信息')
      }
    }
  }
  , data(){
    return{
      searchstr:'',
      items: [],
      colsPerRow: 2, // 每行显示的列数
    }
  },
  computed: {
    chunkedItems() {
      const result = [];
      for (let i = 0; i < this.items.length; i += this.colsPerRow) {
        result.push(this.items.slice(i, i + this.colsPerRow));
      }
      return result;
    },
  },
  mounted() {
    this.fetchData();
    this.searchData();
  }
}
</script>

<template>
  <div>
    <el-container style="height: 100vh">
      <el-aside width="250px" style="border: 1px solid #eee">
        <navigator-component></navigator-component>
      </el-aside>
      <el-container style="border: 1px solid #eee">
        <el-header>
          <HelloWorld msg="监控详情页" />
        </el-header>
        <el-main>
          <el-container>
            <el-header>
              <page-label label="监控列表"></page-label>
              <el-row>
                <el-col :span="4">
                  <el-input autosize v-model="searchstr" placeholder="请输入内容"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="searchData">搜索</el-button>
                  <el-button  @click="fetchData">重置</el-button>

                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <el-row
                  v-for="(group, rowIndex) in chunkedItems"
                  :key="rowIndex"
                  :gutter="40"
                  style="margin-top: 60px"
              >
                <el-col
                    v-for="(item, colIndex) in group"
                    :key="colIndex"
                    :span="11"
                    :offset="colIndex > 0 ? 1 : 0"
                >
                  <div
                      class="grid-content bg-purple-light"
                      style="display: flex; justify-content: center; align-items: center; height: 100%;"
                      @click="jumpToDetail(item)"
                  >
                    <!-- 动态内容 -->
                    <el-popover
                        placement="right"
                        title="监控对象数据"
                        width="300"
                        trigger="hover"
                        >
                      <monitor-oversee-component :key="item.id" :monitor-id="item.id" :detail="true"></monitor-oversee-component>
                      <div slot="reference">
                        <i :class="item.monitorDemonstration === 'graph' ? 'el-icon-picture-outline' :
           item.monitorDemonstration === 'table' ? 'el-icon-notebook-2' :
           'el-icon-question'"></i>
                        {{item.monitorName}}
                      </div>
                    </el-popover>

                  </div>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.bg-purple-light {
  background-color: #e5e9f2; /* 默认背景色 */
  transition: background-color 0.9s ease; /* 添加渐变动画效果 */
}

.bg-purple-light:hover {
  background-color: #c3d4ff; /* 悬停时的背景色 */
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;

}
.grid-content {
  border-radius: 16px;
  min-height: 250px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
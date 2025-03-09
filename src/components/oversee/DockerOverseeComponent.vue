<script>

import axios from "@/axios";
export default {
  components: {},
  methods:{

    async fetchData() {
      try{
        this.items=[];
        this.items=(await axios.post('/resource/software/docker/selectItems')).data;
      }catch (error){
        this.$message.error(error);
      }

    },
    jumpToDetail(item) {
      this.$router.push({ name: 'DockerConsoleView', query: { id: item.id }});
    }
  },
  data(){
    return{
      searchstr:'',
      items: [],
      colsPerRow: 3, // 每行显示的列数
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
  }

}
</script>

<template>
  <div>

    <el-row
        v-for="(group, rowIndex) in chunkedItems"
        :key="rowIndex"
        :gutter="1"
        style="margin-top: 60px"
    >
      <el-col
          v-for="(item, colIndex) in group"
          :key="colIndex"
          :span="7"
          :offset="colIndex > 0 ? 1 : 0"
      >
        <div
            :class="item.resourceUp===1 ? 'grid-content bg-green-light' : 'grid-content bg-red-light'"
            style="display: flex; justify-content: center; align-items: center; height: 100%;"
            @click="jumpToDetail(item)"
        >
          <div style="display: flex; flex-direction: column;">
            <div style="">{{item.resourceName}}<br>
              {{item.resourceIp}}:{{item.resourceType==='software'?item.resourcePort:item.reservedParam2}}</div>
            <div><i :class="item.resourceUp===1  ? 'el-icon-cpu' : 'el-icon-close'" style="font-size: 40px;margin-bottom: 10px;margin-top: 10px"></i></div>
            <div class="container-id">{{item.reservedParam!=null?"Container:\n"+item.reservedParam:"未知容器id"}}</div>
          </div>






        </div>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped>
.el-header {
  height: 30px !important; /* 修改为需要的高度 */
  line-height: 80px; /* 保持文字垂直居中 */
}

/* 调整 el-main 的内边距 */
.el-main {
  padding: 20px; /* 修改为需要的内边距 */
  font-size: 16px;
}
.smallfont{
  font-size: 12px;
}

.bg-green-light:hover {
  background-color: #c3ffc6; /* 悬停时的背景色 */
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

.bg-green-light {
  transition: background-color 0.9s ease;
  background: #e5f2e7;

}
.bg-red-light{
  background: #f2e5e5;
  transition: background-color 0.9s ease;
}
.bg-red-light:hover{
  background-color: #ffc3c3;
}
.grid-content {
  border-radius: 16px;
  min-height: 250px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.container-id {
  word-wrap: break-word; /* 允许长单词换行 */
  word-break: break-all; /* 允许在单词内换行 */
  white-space: normal;   /* 确保内容正常换行 */
  font-size: 15px;        /* 如果需要设置字体大小 */
}
</style>
<script>
import PageLabel from "@/components/title/PageLabel.vue";
import axios from "@/axios";
import * as echarts from 'echarts';
import { marked } from 'marked';

export default {
  computed: {
    performanceBottleneckHtml() {
      return marked(this.analyzeResponse.performanceBottleneck);
    },
    trendPredictionHtml() {
      return marked(this.analyzeResponse.trendPrediction);
    },
    optimizationSuggestionsHtml() {
      return marked(this.analyzeResponse.optimizationSuggestions);
    },
    monitorId() {
      return this.$route.query.monitorId;
    }
  },
  beforeDestroy() {
    // 组件销毁时，确保清除定时器
    this.stopInterval();
  },
 data(){
    return{
      analyzeStart:false,
      pickerOptions: {
        shortcuts: [
          {
            text: '三小时内',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '十二小时内',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 12);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          //   {
          //   text: '最近三个月',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          //     picker.$emit('pick', [start, end]);
          //   }
          // }
        ]
      },
      datePickerTime:null,
      chartInsatance:null,
      metricFieldsFilters:null,
      intervalId: null,
      fetchCount:0,
      isFetching:false,
      alertDialogvisible:false,
      monitor:{
        id: null,
        monitorName: "",
        monitorDescription: "",
        monitorNotpresetPromql: "",
        monitorPresetTarget: "",
        monitorIspreset: null,
        monitorDemonstration: "",
        monitorPermissionLevel: null,
        monitorGroupIds: [],
        monitorResourceIds: [],
        monitorType: "",
        monitorAddedTime: null
      },
      computedTableData:[]
      ,
      computedGraphData:[],
      resourceList:[],
      groupList:[],
      metricDescription:'',
      filteredGraphData:[],
      filteredGraphDataMetricFields:[],
      analyzeResponse:null,
      analyzeFinished:false,
      analyzeDataForm:{
        monitorId:null,
        startTime:null,
        endTime:null,
      },
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    displayMarkdown(markdownText, elementId) {
      const html = marked(markdownText);
      document.getElementById(elementId).innerHTML = html;
    },
    async startAnalysis(){
      try{
        console.log('开始分析');
        this.analyzeStart=true;
        this.analyzeFinished=false;
        this.analyzeDataForm.monitorId=this.monitorId;
        if(this.datePickerTime!==null&&this.datePickerTime[0]!==null){
          this.analyzeDataForm.startTime= this.datePickerTime[0];
        }
        if(this.datePickerTime!==null&&this.datePickerTime[1]!==null){
          this.analyzeDataForm.endTime= this.datePickerTime[1];
        }
        this.analyzeResponse=(await axios.post('/data/analyzeData', this.analyzeDataForm, {
          timeout: 30000,})).data;
        console.log(this.analyzeResponse);
        this.analyzeFinished=true;
      }catch (error){
        this.$message.error(error);
        this.analyzeStart=false;
        this.analyzeFinished=false;
      }
    },
    /*总：获取数据*/
    async fetchData() {
      try {
        if (this.getValueRepeatly){
          this.$message('正在抓取数据...');
          this.datePickerTime=null;
        }
        this.monitor = (await axios.post('/monitor/selectById', null, {
          params: {
            monitorId: this.monitorId
          }
        })).data;
        this.resourceList = (await axios.post('/resource/selectBatch', this.monitor.monitorResourceIds)).data;
        this.groupList = (await axios.get('/account/selectGroupInfo')).data;
        this.groupList = this.groupList.filter(group => this.monitor.monitorGroupIds.includes(group.group.id));
        this.metricDescription = (await axios.post('/monitor/metricDescription', null, {
          params: {
            target: this.monitor.monitorPresetTarget
          }
        })).data;
        if (this.monitor.monitorDemonstration === 'table') {
          await this.fetchTableData();
        } else {
          await this.fetchGraphData();
        }
      } catch (error) {
        this.$message.error(error)
      }
      this.metricFieldsFilters = this.computedTableData
          .map(item => item.metricFields)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map(value => ({text: value, value}));
    },
    /*图表：获取数据*/
    async fetchGraphData() {

      if(this.datePickerTime&&(this.datePickerTime[0]!=null||this.datePickerTime[1]!=null)){
        this.getValueRepeatly=false;
      }
      if (this.isFetching) {
        this.$message.error('请勿重复点击获取数据');
      } else {
        this.isFetching = true;
        this.fetchCount = this.fetchCount + 1;
        try {
          let tempData;
          if(!this.datePickerTime){
            tempData= (await axios.post('/monitor/selectGraphById', {
              monitorId: this.monitorId
            })).data;
          }else{
            tempData = (await axios.post('/monitor/selectGraphById', {
              monitorId: this.monitorId,
              startTime: this.datePickerTime[0],
              endTime: this.datePickerTime[1]
            })).data;
          }
          this.computedGraphData=tempData.map(item => {
            const metricFields = Object.values(item.metric)
                .filter(value => value) // 过滤掉空值
                .join(" - "); // 使用 " - " 拼接

            const data = item.values;
            const metric=item.metric;

            return {
              metricFields,
              metric,
              data
            };
          });

          if(this.fetchCount===1){
            this.filteredGraphData = this.computedGraphData.map(item => ({
              ...item, // 深拷贝 computedGraphData 中的每个 item
            }));
            this.initChart();
          }else{
            // 后续更新，根据 computedGraphData 更新 filteredGraphData
            this.computedGraphData.forEach(item => {
              const existingItem = this.filteredGraphData.find(
                  filteredItem => filteredItem.metricFields === item.metricFields
              );

              if (existingItem) {
                // 如果找到对应的 item，更新其数据
                existingItem.data = item.data; // 更新数据部分
              }
              // 如果没有找到对应的 item，不进行任何操作（不添加新的 item）
            });
            this.updateChart();
            if(this.getValueRepeatly){
              this.$message.success('数据已更新');
            }
          }
        } catch (error) {
          this.$message.error(error)
        }
        this.isFetching=false;
      }
    },
    /*图表：初始图表*/
    initChart() {
      const chart = echarts.init(this.$refs.chart);
      this.chartInsatance = chart;
      this.updateChart();
    },
    updateChart(){

      if(this.chartInsatance==null){
        this.initChart();
      }
      // 确保 computedGraphData 是一个数组
      if (!Array.isArray(this.filteredGraphData) || this.filteredGraphData.length === 0) {
        this.filteredGraphData=this.computedGraphData;
      }
      // 处理数据
      const seriesData = this.filteredGraphData.map((series, index) => ({
        name: series.metricFields || `Series ${index + 1}`, // 使用 metricFields 或默认名称
        type: 'line',
        data: series.data.map(item => item[1]), // 数值部分作为 series 数据
      }));


      // 获取所有时间戳（假设所有折线的时间戳相同，只取第一组数据的时间戳）
      const timestamps = this.filteredGraphData[0]?.data?.map(item => new Date(item[0] * 1000).toLocaleString()) || [];

      // ECharts 配置
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const time = params[0].name; // 获取时间轴上的时间
            let tooltipHtml = `<div style="font-size: 14px; color: #333;">${time}</div>`;
            params.forEach(param => {
              tooltipHtml += `<div style="margin-top: 10px;">
                            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                            ${param.seriesName}: ${param.value}
                          </div>`;
            });
            return tooltipHtml;
          },
        },
        legend: {
          data: this.filteredGraphData.map(item => item.metricFields || `Series`),
          orient: 'vertical',
          left: '70%',
          top:'center',
          textStyle: {
            color: '#333', // 图例文字颜色
            fontSize: 12, // 图例文字大小
          },
          padding: [5, 10], // 图例内部填充

        },
        grid: {
          left: '3%',
          right: '35%', // 为图例留出空间
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: timestamps,
        },
        yAxis: {
          type: 'value',
        },
        series: seriesData,
      };

      // 设置 ECharts 配置
      this.chartInsatance.setOption(option,true);
    },

    goBack() {

      this.$router.go(-1);
    },
  },

  components:{
    PageLabel,
  }
}
</script>

<template>
  <div>
    <el-container >
      <el-header >
        <el-page-header @back="goBack" content="数据分析">
        </el-page-header>
      </el-header>
      <el-main style="padding-top: 60px;">


        <page-label label="监控对象信息"></page-label>
        <el-descriptions
            title="监控信息详情"
            direction="vertical"
            :column="3"
            border
            class="custom-descriptions"
        >
          <template slot="extra">
            <el-popover
                placement="right"
                width="400"
                trigger="hover">
              <div>
                <!-- 使用 v-for 循环渲染 groupList -->
                <ul>
                  <li v-for="item in groupList" :key="item.group.id">
                    {{ item.group.name }}
                  </li>
                </ul>
              </div>
              <el-button slot="reference">监控分组信息</el-button>
            </el-popover>

          </template>
          <el-descriptions-item label="监控名称">{{ monitor.monitorName }}</el-descriptions-item>
          <el-descriptions-item label="监控描述">{{ monitor.monitorDescription }}</el-descriptions-item>
          <el-descriptions-item label="监控类型">{{ monitor.monitorType==='software'?'软件监控':'硬件监控' }}</el-descriptions-item>
          <el-descriptions-item label="监控展示方式">{{ monitor.monitorDemonstration==='单点'?'':'时间序列' }}</el-descriptions-item>
          <el-descriptions-item label="添加时间">{{ monitor.monitorAddedTime }}</el-descriptions-item>
          <el-descriptions-item
              v-if="monitor.monitorIspreset === 0"
              label="PromQL 查询"
          >
            {{ monitor.monitorNotpresetPromql }}
          </el-descriptions-item>
          <el-descriptions-item
              v-else-if="monitor.monitorIspreset === 1"
              label="预设目标"
          >
            {{ monitor.monitorPresetTarget}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{metricDescription}}
          </el-descriptions-item>

          <!-- 显示监控资源 -->
          <el-descriptions-item label="监控资源">
            <div v-for="(resource, index) in resourceList" :key="index">
              {{ resource.resourceName }} ({{ resource.resourceType }})
            </div>
          </el-descriptions-item>
        </el-descriptions>


        <template>
          <el-row style="margin-bottom: 20px; height: 60px">
            <el-col :span="24">
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 16px;  margin-right: 60px;height: 60px">
                <el-date-picker
                    v-model="datePickerTime"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
                <el-button type="primary" @click="fetchGraphData">获取数据</el-button>
              </div>
            </el-col>
          </el-row>
          <div>
            <div ref="chart" style="width: 100%; height: 400px; margin-bottom: 150px;"></div>
          </div>
        </template>

        <template>
          <div class="container" v-if="!(analyzeStart===true&&analyzeFinished===false)">
            <el-button
              class="analyze-button"
              type="primary"
              style="margin-bottom: 20px;margin-top: 20px"
              @click="startAnalysis"
          >
            {{analyzeFinished===false?'根据当前显示数据开始分析！':'重新分析'}}
            </el-button>
          </div>
        </template>

        <div v-if="analyzeStart&&!analyzeFinished"
             v-loading="analyzeStart&&!analyzeFinished"
             element-loading-text="数据分析中，请稍安勿躁~"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)" style="margin-top: 140px;margin-bottom: 40px"> </div>
        <el-skeleton v-if="analyzeStart&&!analyzeFinished" style="margin-bottom: 100px" :rows="6" animated />


          <div v-if="analyzeFinished" style="margin-top: 40px;margin-bottom: 160px ;text-align: left !important; font-size: 18px">
            <page-label label="性能瓶颈"></page-label>
            <div v-html="performanceBottleneckHtml" style="margin-bottom: 40px"></div>
            <page-label label="趋势预测"></page-label>
            <div v-html="trendPredictionHtml"></div>
            <page-label label="优化建议"></page-label>
            <div v-html="optimizationSuggestionsHtml"></div>
          </div>


      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.el-header{
  background-color: #dcdcdc;
  position: fixed;
  width: 100%;
  z-index: 1000;
  height: 70px !important;
}

.el-page-header{
  line-height: 70px;
  color: #797979;

  background-color: #e0e0e0;
  z-index: 1000;

  margin-bottom: 60px;
  padding: 0;
}
.custom-descriptions .el-descriptions__body {
  width: 100%;
}

.custom-descriptions .el-descriptions__table {
  width: 100%;
  table-layout: fixed; /* 固定表格布局 */
}

.custom-descriptions .el-descriptions__cell {
  word-wrap: break-word; /* 自动换行 */
}

/* 设置每列的宽度 */
.custom-descriptions .el-descriptions__cell:nth-child(1) {
  width: 10%; /* 第一列宽度 */
}

.custom-descriptions .el-descriptions__cell:nth-child(2) {
  width: 30%; /* 第二列宽度 */
}

.custom-descriptions .el-descriptions__cell:nth-child(3) {
  width: 10%; /* 第三列宽度 */
}
.el-container {
  width: 100%; /* 容器宽度为屏幕宽度的 90% */
  margin: 0 auto; /* 水平居中对齐 */
}
.el-main{
  width: 90%;
  margin: 0 auto;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5; /* 背景颜色 */
}

.analyze-button {
  padding: 15px 30px; /* 增加按钮的内边距 */
  font-size: 18px; /* 增加按钮的字体大小 */
  border-radius: 5px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  transition: transform 0.3s ease; /* 添加鼠标悬停时的动画效果 */
}


.analyze-button:hover {
  transform: scale(1.05); /* 鼠标悬停时放大按钮 */
}

.markdown-content {

}
</style>
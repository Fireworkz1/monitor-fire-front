<script>
import PageLabel from "@/components/title/PageLabel.vue";
import axios from "@/axios";
import {exportExcel} from "@/exportExcel";
import * as echarts from 'echarts';

export default {
  computed: {
    monitorId() {
      return this.$route.query.monitorId;
    }
  },
  beforeDestroy() {
    // 组件销毁时，确保清除定时器
    this.stopInterval();
  },
  watch: {
    // 监听 getValueRepeatly 的变化
    getValueRepeatly(newVal) {
      if (newVal) {
        // 如果开关打开，启动定时请求
        this.$message('已打开定时获取器');
        if(this.monitor.monitorDemonstration==='table'){
          this.fetchTableData();
        }else{
          this.datePickerTime=null;
          this.fetchGraphData();
        }
        this.startInterval();
      } else {
        // 如果开关关闭，停止定时请求
        this.stopInterval();
      }
    },
  },data(){
    return{
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
      getValueRepeatly:false,
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
      filteredGraphDataMetricFields:[]
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    /*总：定期发起请求函数*/
    startInterval() {
      // 清除之前的定时器（如果存在）
      this.stopInterval();

      // 设置新的定时器，每隔 15 秒请求一次

      this.intervalId = setInterval(this.fetchData, 15000); // 15000 毫秒 = 15 秒
    },
    stopInterval() {
      // 清除定时器
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    /*总：判断要不要触发返回弹窗*/
    askGoBack() {
      if (this.monitor.monitorDemonstration === 'table') {
        this.alertDialogvisible = true;
      } else {
        this.goBack();
      }
    },
    /*总：跳转回上个页面*/
    goBack() {

      this.$router.go(-1)
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
    /*表格：导出数据*/
    exportData() {
      // 定义表头字段（根据 el-table 的列配置）
      const headers = ['metricFields', 'time', 'value'];

      // 动态添加额外的列（根据 monitor.monitorIspreset 的值）
      if (this.monitor.monitorIspreset === 1) {
        headers.splice(2, 0, 'metric');
      } else {
        headers.splice(2, 0, 'PromQL');
      }

      // 处理数据，确保与表头一致
      const data = this.computedTableData.map(item => {
        const row = {
          metricFields: item.metricFields,
          time: item.time,
          value: item.value,
        };
        if (this.monitor.monitorIspreset === 1) {
          row['metric'] = `${this.monitor.monitorPresetTarget}<br>${this.metricDescription}`;
        } else {
          row['PromQL'] = `${this.monitor.monitorNotpresetPromql}<br>${this.monitor.monitorDescription}`;
        }
        return row;
      });

      // 调用导出函数
      exportExcel(data, headers, '表格数据.xlsx');
    },
    /*表格：获取数据*/
    async fetchTableData() {
      if (this.isFetching) {
        this.$message.error('请勿重复点击获取数据');
      } else {
        this.isFetching = true;
        this.fetchCount = this.fetchCount + 1;
        try {
          let tempData = (await axios.post('/monitor/selectTableById', null, {
            params: {id: this.monitorId}
          })).data;
          const newData = tempData.map(item => {
            const metricFields = Object.values(item.metric)
                .filter(value => value) // 过滤掉空值
                .join(" - "); // 使用 " - " 拼接

            const timestamp = item.value ? item.value[0] : null;
            const value = item.value ? item.value[1] : null;
            const time = this.formatDate(timestamp);

            return {
              metricFields,
              time,
              value,
            };
          });

          // 将新数据追加到现有的 tableData 中
          this.computedTableData.push(...newData);
        } catch (error) {
          if (this.fetchCount === 1) {
            this.$message.error('自动获取数据失败，请手动获取');
          } else {
            this.$message.error('获取数据失败,' + error);
          }
        }
        this.isFetching = false;
      }
    },
    /*表格：转换时间戳格式*/
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp * 1000); // Prometheus 时间戳通常是秒级，需要转换为毫秒
      return date.toLocaleString(); // 根据本地化格式显示时间
    },
    /*表格：分类查询筛选逻辑*/
    filterMetricFields(value, row) {
      // 筛选逻辑：根据 metricFields 字段筛选
      return row.metricFields === value;
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
            console.log(this.filteredGraphData);
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



    /*图表：表格默认选中配置，过滤器*/
    handleSelectChange(){
      this.filteredGraphData = this.computedGraphData.filter(item => {
        return this.filteredGraphDataMetricFields.includes(item.metricFields);
      });
      // this.chartInsatance.dispose();
      // this.chartInsatance = null;
      this.updateChart();
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
        <el-page-header  @back="askGoBack" content="监控数据详情页面">
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
          <el-descriptions-item label="资源详细信息">
            <el-table ref="myTable" :data="resourceList" style="width: 90%">

              <el-table-column prop="resourceName" label="资源名称"></el-table-column>
              <el-table-column prop="resourceType" label="资源类型"></el-table-column>
              <el-table-column prop="resourceIp" label="IP 地址"></el-table-column>
              <el-table-column prop="resourcePort" label="端口" v-if="monitor.monitorType==='software'"></el-table-column>
              <el-table-column prop="resourceDescription" label="描述"></el-table-column>
              <el-table-column prop="startMode" label="启动模式" v-if="monitor.monitorType==='software'"></el-table-column>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>








                                      <!-- 单点类数据-->





        <page-label label="监控数据"></page-label>
        <template v-if="this.monitor.monitorDemonstration==='table'">
          <el-row style="margin-bottom: 20px;">
            <el-col :span="24" >
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 16px; margin-bottom: 20px;">
                <el-switch
                    v-model="getValueRepeatly"
                    active-color="#13ce66"
                    active-text="每15秒获取数据">
                </el-switch>
                <el-button type="primary" @click="exportData">导出表格数据</el-button>
                <el-button type="primary" @click="fetchTableData">获取数据</el-button>
              </div>
            </el-col>
          </el-row>
          <el-table
              :data="computedTableData"
              border
              style="width: 100%;margin-bottom: 120px;"
              stripe
          >
            <el-table-column
                prop="metricFields"
                label="对象"
                width="380"
                :filters="metricFieldsFilters"
                :filter-method="filterMetricFields"
                filter-placement="bottom-end">

            </el-table-column>
            <el-table-column
                prop="time"
                label="时间"
                width="280"
                sortable>
            </el-table-column>
            <el-table-column
                v-if="monitor.monitorIspreset===1"
                label="指标">
              {{monitor.monitorPresetTarget}}<br>{{metricDescription}}
            </el-table-column>
            <el-table-column
                v-if="monitor.monitorIspreset===0"
                label="查询语句">
              {{monitor.monitorNotpresetPromql}}<br>{{monitor.monitorDescription}}
            </el-table-column>
            <el-table-column
                prop="value"
                label="值"
                sortable>
            </el-table-column>
          </el-table>
          <div v-if="getValueRepeatly" style="text-align: center; margin-bottom: 20px;font-size: 14px">
            <el-spinner></el-spinner> <!-- 使用 Element Plus 的加载动画 -->
            <p>正在每十五秒抓取数据...</p>
          </div>
        </template>



                                    <!-- 时间序列类数据-->


        <template v-if="this.monitor.monitorDemonstration==='graph'">
          <el-row style="margin-bottom: 20px; height: 60px">
            <el-col :span="24">
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 16px;  margin-right: 60px;height: 60px">
                <el-spinner v-if="getValueRepeatly" class="custom-spinner"></el-spinner>
                <el-switch
                    v-model="getValueRepeatly"
                    active-color="#13ce66"
                    active-text="每15秒获取数据">
                </el-switch>
                <el-select style="width: 500px" v-model="filteredGraphDataMetricFields" multiple placeholder="展示对象" @change="handleSelectChange" collapse-tags>
                  <el-option
                      v-for="item in computedGraphData"
                      :key="item.metricFields"
                      :label="item.metricFields"
                      :value="item.metricFields">
                  </el-option>
                </el-select>
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
      </el-main>
    </el-container>
    <el-dialog
        title="提示"
        :visible.sync="alertDialogvisible"
        width="30%">
      <span>确定要返回吗？单点监控数据不导出将不会保存</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alertDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="goBack()">确 定</el-button></span>
    </el-dialog>
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
</style>
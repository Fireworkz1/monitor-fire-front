<script>

import PageLabel from "@/components/title/PageLabel.vue";
export default {
  components: {PageLabel},
  computed: {
    resource() {
      return this.$route.query.item;
    }
  },mounted(){
    this.$message(this.resource.resourceName);
  }

}
</script>

<template>
  <div>
    <el-container >
      <el-header >
        <el-page-header  content="Docker控制台">
        </el-page-header>
      </el-header>
      <el-main style="padding-top: 60px;">
        <page-label type="special" label="Docker信息"></page-label>
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
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>
<script>
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import HelloWorld from "@/components/title/HelloWorld.vue";
import PageLabel from "@/components/title/PageLabel.vue";
import MonitorTable from "@/components/table/MonitorTable.vue";

export default {
  components: {PageLabel, HelloWorld, NavigatorComponent,MonitorTable},
  data(){
    return{
      monitorList:[]
    }
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
          <HelloWorld msg="数据分析页" />
        </el-header>
        <el-main>
          <page-label label="数据分析"></page-label>
            <monitor-table :data-analyze="true"></monitor-table>
<!--          <page-label label="11"></page-label>-->

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
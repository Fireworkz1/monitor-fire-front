<script >
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import HelloWorld from "@/components/title/HelloWorld.vue";
import WarnTable from "@/components/table/WarnTable.vue";
import PageLabel from "@/components/title/PageLabel.vue";
import WarnHistoryTable from "@/components/table/WarnHistoryTable.vue";

export default {
  components: {
    WarnHistoryTable,
    NavigatorComponent, HelloWorld,WarnTable,PageLabel

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
          <HelloWorld msg="报警查询页" />
        </el-header>
        <el-main>
          <page-label label="当前告警"></page-label>
          <warn-table :is-detail="true"></warn-table>
          <page-label label="历史告警"></page-label>
          <warn-history-table></warn-history-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
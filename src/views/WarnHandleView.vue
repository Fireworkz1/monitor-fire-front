<script>
import WarnEntityTable from "@/components/table/WarnEntityTable.vue";
import PageLabel from "@/components/title/PageLabel.vue";
import HelloWorld from "@/components/title/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";


export default {
  components:{
 NavigatorComponent,
    WarnEntityTable,PageLabel,HelloWorld
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
          <HelloWorld msg="报警处理页" />
        </el-header>
        <el-main>
          <page-label label="我的告警"></page-label>
          <warn-entity-table :is-detail="true"></warn-entity-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
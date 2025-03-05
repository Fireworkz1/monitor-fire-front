<script>
import HelloWorld from "@/components/title/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import ResourceTable from "@/components/table/ResourceTable.vue";
import PageLabel from "@/components/title/PageLabel.vue";

export default {
  name: 'ResourceManageView',
  components: {
    PageLabel,
    HelloWorld,
    NavigatorComponent,
    ResourceTable,
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
          <HelloWorld msg="资源管理页" />
        </el-header>
        <el-main>
          <page-label label="资源管理"></page-label>
          <resource-table edit-allow=true></resource-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
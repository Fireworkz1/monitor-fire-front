<script>
import HelloWorld from "@/components/title/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import MonitorRegisterForm from "@/components/form/MonitorRegisterForm.vue";
import MonitorTable from "@/components/table/MonitorTable.vue";

export default {
  name: 'MonitorManageView',
  components: {
    MonitorRegisterForm,
    HelloWorld,
    NavigatorComponent,
    MonitorTable,
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
          <HelloWorld msg="监控管理页" />
        </el-header>
        <el-main>
          <monitor-register-form></monitor-register-form>
          <monitor-table></monitor-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
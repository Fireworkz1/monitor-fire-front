<script>
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import HelloWorld from "@/components/title/HelloWorld.vue";
import PageLabel from "@/components/title/PageLabel.vue";
import AutoRegisterForm from "@/components/form/AutoRegisterForm.vue";
import AutoTable from "@/components/table/AutoTable.vue";


export default {
  components: {PageLabel, HelloWorld, NavigatorComponent, AutoRegisterForm,AutoTable}
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
          <HelloWorld msg="自动化策略" />
        </el-header>
        <el-main>
          <page-label label="创建策略"></page-label>
          <auto-register-form></auto-register-form>
          <page-label label="自动启停"></page-label>
          <auto-table style="margin-bottom: 60px"></auto-table>
          <page-label label="缩扩容规则组"></page-label>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
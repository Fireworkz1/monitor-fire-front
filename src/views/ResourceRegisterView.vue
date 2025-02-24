<script>


import HelloWorld from "@/components/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import ResourceRegisterForm from "@/components/form/ResourceRegisterForm.vue";
import ResourceTable from "@/components/table/ResourceTable.vue";
export default {
  name: 'ResourceRegisterView',
  components: {
    HelloWorld,
    NavigatorComponent,
    ResourceRegisterForm,
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
          <HelloWorld msg="资源注册页" />
        </el-header>
        <el-main>
          <resource-register-form></resource-register-form>
          <resource-table></resource-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
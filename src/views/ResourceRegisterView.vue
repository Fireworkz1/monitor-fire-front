<script>


import HelloWorld from "@/components/title/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import ResourceRegisterForm from "@/components/form/ResourceRegisterForm.vue";
import ResourceTable from "@/components/table/ResourceTable.vue";
import PageLabel from "@/components/title/PageLabel.vue";
export default {
  name: 'ResourceRegisterView',
  components: {
    HelloWorld,
    NavigatorComponent,
    ResourceRegisterForm,
    ResourceTable,
    PageLabel
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
          <template>
            <el-row gutter="20">
              <el-col :span="11">
                <page-label label="服务器资源"></page-label>
                <resource-table resource-type="server"></resource-table>
              </el-col>

              <el-col :span="12">
                <page-label label="软件资源"></page-label>
                <resource-table resource-type="software"></resource-table>
              </el-col>
            </el-row>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
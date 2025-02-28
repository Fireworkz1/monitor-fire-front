<script>
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import HelloWorld from "@/components/title/HelloWorld.vue";
import WarnTable from "@/components/table/WarnTable.vue";
import WarnRegisterForm from "@/components/form/WarnRegisterForm.vue";

export default {
  components: {
    WarnTable,
    NavigatorComponent, HelloWorld,WarnRegisterForm

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
          <HelloWorld msg="报警配置页" />
        </el-header>
        <el-main>
          <warn-register-form></warn-register-form>
          <warn-table></warn-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
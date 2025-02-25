<script >
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  components: {
    NavigatorComponent, HelloWorld

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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
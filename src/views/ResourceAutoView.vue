<script >
import HelloWorld from "@/components/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";

export default {
  name: 'ResourceAutoView',
  components: {
    HelloWorld,
    NavigatorComponent,
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
          <HelloWorld msg="资源自动配置" />
        </el-header>
        <el-main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
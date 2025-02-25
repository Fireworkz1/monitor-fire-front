<script>
import HelloWorld from "@/components/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import UserInfoComponent from "@/components/UserInfoComponent.vue";

export default {
  components: {
    NavigatorComponent, HelloWorld,UserInfoComponent

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
          <HelloWorld msg="用户详情页" />
        </el-header>
        <el-main>
          <user-info-component></user-info-component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>

</style>
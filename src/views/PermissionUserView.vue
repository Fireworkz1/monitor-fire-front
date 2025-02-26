<script>
import HelloWorld from "@/components/title/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import UserInfoDescription from "@/components/discription/UserInfoDescription.vue";

export default {
  components: {
    NavigatorComponent, HelloWorld,UserInfoDescription

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
          <user-info-description></user-info-description>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>

</style>
<script>
import HelloWorld from "@/components/title/HelloWorld.vue";
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import GroupManageComponent from "@/components/GroupManageComponent.vue";
import UserGroupComponent from "@/components/UserGroupComponent.vue";

export default {
  components: {
    NavigatorComponent, HelloWorld,GroupManageComponent,UserGroupComponent

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
          <HelloWorld msg="权限分组页" />
        </el-header>
        <el-main>
          <group-manage-component></group-manage-component>
          <user-group-component></user-group-component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>

</style>
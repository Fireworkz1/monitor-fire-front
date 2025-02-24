<template>

    <el-container style="height: 100vh">
        <el-aside width="250px" style="border: 1px solid #eee">
          <navigator-component></navigator-component>
        </el-aside>
      <el-container style="border: 1px solid #eee">
        <el-header>
          <HelloWorld msg="系统主页" />
        </el-header>
        <el-main>
          <HelloWorld msg="高院长" />
          <DashBoardComponent></DashBoardComponent>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import DashBoardComponent from "@/components/DashBoardComponent.vue";
export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    NavigatorComponent,
    DashBoardComponent,
  }
}
</script>

<script>
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import HelloWorld from "@/components/title/HelloWorld.vue";
import PageLabel from "@/components/title/PageLabel.vue";
import DockerOverseeComponent from "@/components/oversee/DockerOverseeComponent.vue";

export default {
  components: {PageLabel, HelloWorld, NavigatorComponent,DockerOverseeComponent}

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
          <HelloWorld msg="控制台" />
        </el-header>
        <el-main>
          <page-label label="Docker资源远程控制"></page-label>
            <docker-oversee-component></docker-oversee-component>
          <page-label label="Systemd资源远程控制"></page-label>
          <el-empty description="暂无"></el-empty>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>
<script>
import NavigatorComponent from "@/components/NavigatorComponent.vue";
import HelloWorld from "@/components/title/HelloWorld.vue";
import PageLabel from "@/components/title/PageLabel.vue";
import DockerOverseeComponent from "@/components/oversee/DockerOverseeComponent.vue";

export default {
  components: {PageLabel, HelloWorld, NavigatorComponent,DockerOverseeComponent},
  data(){
    return{

    }
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
          <HelloWorld msg="控制台" />
        </el-header>
        <el-main v-loading="">
          <el-alert
              title="资源控制台可以实现对资源的远程操作，如启动，停止，查看日志等。因远程操作服务器风险较大，当前只提供对软件资源（微服务，数据库，缓存等）的控制操作。"
              type="warning"
              center
              :closable="false"
              show-icon
              style="font-size: 25px !important;"
          >
          </el-alert>
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
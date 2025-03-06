<template>

    <el-container style="height: 100vh">
      <el-container style="border: 1px solid #eee">
        <el-header>
          <HelloWorld msg="欢迎来到微服务管理系统!" />
        </el-header>
        <el-main>
          <DashBoardComponent></DashBoardComponent>
        </el-main>
        <el-footer>
          <el-button type="success" plain @click="jumpToSys">点击进入系统</el-button>
        </el-footer>
      </el-container>
    </el-container>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/title/HelloWorld.vue'
import DashBoardComponent from "@/components/DashBoardComponent.vue";

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    DashBoardComponent,

  },
  methods:{
    jumpToSys(){
      this.$router.push('/form/register');
    },
    jumpToAbout(){
      this.$router.push('/about');
    }
  }
}
</script>

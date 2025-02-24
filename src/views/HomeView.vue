<template>

    <el-container style="height: 100vh; border: 1px solid #eee">
        <el-aside width="250px" >
          <navigator-component></navigator-component>
        </el-aside>
      <el-main>
        <HelloWorld msg="Welcome to Your Vue.js App" />
      </el-main>
    </el-container>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import NavigatorComponent from "@/components/NavigatorComponent.vue";
export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    NavigatorComponent
  }
}
</script>

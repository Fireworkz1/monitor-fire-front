<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    goToPage(path) {
      this.$router.push(path).catch(err => {
        if (err.name !== "NavigationDuplicated") {
          // 如果不是重复导航错误，抛出其他错误
          throw err;
        }
      });// 动态跳转到指定路径
    },
    logoff(){
      localStorage.removeItem("token");
      this.$message("成功退出登录");
      // 跳转到登录页面
      this.$router.push("/login");
    }
  }
}
</script>
<template>

  <div>
    <h5 @click="goToPage('/home')" style="height: 47px">回到主页</h5>
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>资源控制</span>
        </template>
<!--        <el-menu-item index="1-1">资源总览</el-menu-item>-->
        <el-menu-item index="1-1" @click="goToPage('/form/register')">资源配置</el-menu-item>
        <el-menu-item index="1-2" @click="goToPage('/form/manage')">资源管理</el-menu-item>

      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>资源监控</span>
        </template>
        <el-menu-item index="2-1" @click="goToPage('/monitor/manage')">监控管理</el-menu-item>
        <el-menu-item index="2-2" @click="goToPage('/monitor/details')">监控详情</el-menu-item>
      </el-submenu>

      <el-submenu index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">数据洞察</span>
      </el-submenu>
      <el-submenu index="4" >
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>监控告警</span>
        </template>
        <el-menu-item index="4-1" @click="goToPage('/warn/manage')">告警配置</el-menu-item>
        <el-menu-item index="4-2" @click="goToPage('/warn/search')">告警查询</el-menu-item>
        <el-menu-item index="4-2" @click="goToPage('/warn/handle')">告警处理</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>自动化配置</span>
        </template>

        <el-menu-item index="5-1" @click="goToPage('/auto/console')">控制台</el-menu-item>
        <el-menu-item index="5-2" @click="goToPage('/auto/policy')">自动化策略</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template>
          <span slot="title"><i class="el-icon-setting"></i>用户管理</span>
        </template>
        <el-submenu index="6-1">
          <template slot="title">权限管理</template>
          <el-menu-item index="6-1-1" @click="goToPage('/permission/group')">用户分组</el-menu-item>
          <el-menu-item index="6-1-2" @click="goToPage('/permission/level')" disabled>权限分级</el-menu-item>
        </el-submenu>
        <el-menu-item index="6-2" @click="goToPage('/permission/user')">登录信息管理</el-menu-item>
        <el-menu-item index="6-3" @click="logoff">注销</el-menu-item>

      </el-submenu>
    </el-menu>
  </div>
</template>


<style>

</style>
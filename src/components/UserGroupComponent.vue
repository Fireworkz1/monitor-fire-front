<script>
import axios from "@/axios";

export default {
  data() {
    return {
      userGroups: [], // 当前用户所在的分组
      userList: [], // 用户列表
      currentUser: {
        id:null,
        permissionLevel:null,
        account:"",
        password:"",
        name:"",
        tel:"",
        email:"",
      }
    };
  },
  methods: {
    // 获取当前用户所在的分组
    async fetchUserGroups() {
      // 模拟后端返回的当前用户所在的分组数据
      try {
        const response = await axios.get('/account/selectGroup');
        this.userGroups = response.data;
      } catch (error) {
        this.$message(error.message);
      }
    },
    // 获取用户列表
    async fetchUserList() {
      try {
        const response = await axios.get('/account/selectUser');
        this.userList = response.data;
      } catch (error) {
        this.$message(error.message);
      }
    },
    // 根据用户ID获取用户信息
    getUserById(userId) {
      return this.userList.find(user => user.id === userId);
    },
    formatLevel(row, column, cellValue) {
      // 根据 warnLevel 的值返回对应的 label
      switch (cellValue) {
        // case 0:
        //   return "NOTHING";
        // case 1:
        //   return "LOG_ONLY";
        case 2:
          return "普通权限";
        case 4:
          return "管理员";
        default:
          return "未知";
      }
    },
    async fetchCurrentUser() {
      try {

        const response = await axios.get('/account/current');
        this.currentUser = response.data;
        console.log(this.user)
      } catch (error) {
        this.$message("获取用户信息失败:" + error.message);
      }
    },
  },
  mounted() {
    this.fetchUserGroups(); // 页面加载时获取当前用户所在的分组
    this.fetchUserList(); // 页面加载时获取用户列表
    this.fetchCurrentUser()
  }
};
</script>

<template>
  <div>
    <el-table :data="userGroups" style="width: 100%">
      <el-table-column prop="id" label="分组ID" width="100"></el-table-column>
      <el-table-column prop="name" label="分组名称" width="150"></el-table-column>
      <el-table-column prop="defaultPermissionLevel" label="默认权限等级" width="150" :formatter="formatLevel"></el-table-column>
      <el-table-column label="分组负责人" width="150">
        <template slot-scope="scope">
          {{ getUserById(scope.row.groupLeaderId)?.name || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="是否为负责人" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.groupLeaderId === currentUser.id" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>
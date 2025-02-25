<script>
export default {
  data() {
    return {
      userGroups: [], // 当前用户所在的分组
      userList: [], // 用户列表
      currentUser: {
        id: 1,
        name: "张三",
        permissionLevel: 1 // 假设当前用户是管理员
      }
    };
  },
  methods: {
    // 获取当前用户所在的分组
    fetchUserGroups() {
      // 模拟后端返回的当前用户所在的分组数据
      this.userGroups = [
        {
          id: 1,
          name: "开发组",
          defaultPermissionLevel: "1",
          groupLeaderId: 1,
          userIds: [1, 2]
        },
        {
          id: 2,
          name: "测试组",
          defaultPermissionLevel: "2",
          groupLeaderId: 3,
          userIds: [1, 3, 4]
        }
      ];
    },
    // 获取用户列表
    fetchUserList() {
      this.userList = [
        { id: 1, name: "张三" },
        { id: 2, name: "李四" },
        { id: 3, name: "王五" },
        { id: 4, name: "赵六" }
      ];
    },
    // 根据用户ID获取用户信息
    getUserById(userId) {
      return this.userList.find(user => user.id === userId);
    }
  },
  mounted() {
    this.fetchUserGroups(); // 页面加载时获取当前用户所在的分组
    this.fetchUserList(); // 页面加载时获取用户列表
  }
};
</script>

<template>
  <div>
    <h3>当前用户所在的分组</h3>
    <el-table :data="userGroups" style="width: 100%">
      <el-table-column prop="id" label="分组ID" width="100"></el-table-column>
      <el-table-column prop="name" label="分组名称" width="150"></el-table-column>
      <el-table-column prop="defaultPermissionLevel" label="默认权限等级" width="150"></el-table-column>
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
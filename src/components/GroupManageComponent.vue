<template>
  <div>
    <!-- 创建分组按钮 -->
    <el-button type="primary" @click="openCreateGroupDialog">创建新分组</el-button>

    <!-- 分组列表 -->
    <el-table :data="groupList" style="width: 100%">
      <el-table-column prop="id" label="分组ID" width="100"></el-table-column>
      <el-table-column prop="name" label="分组名称" width="300"></el-table-column>
      <el-table-column prop="defaultPermissionLevel" label="默认权限等级" width="150"></el-table-column>
      <el-table-column label="分组负责人" width="200">
        <template slot-scope="scope">
          {{ getUserById(scope.row.groupLeaderId)?.name || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" @click="openEditGroupDialog(scope.row)">编辑成员</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建分组对话框 -->
    <el-dialog title="创建新分组" :visible.sync="createGroupDialogVisible">
      <el-form ref="createForm" :model="createForm" label-width="120px">
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入分组名称"></el-input>
        </el-form-item>
        <el-form-item label="默认权限等级" prop="defaultPermissionLevel">
          <el-select v-model="createForm.defaultPermissionLevel">
            <el-option label="普通用户" value="1"></el-option>
            <el-option label="管理员" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组负责人" prop="groupLeaderId">
          <el-select v-model="createForm.groupLeaderId" disabled>
            <el-option :label="currentUser.name" :value="currentUser.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createGroupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createGroup">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分组成员对话框 -->
    <el-dialog title="编辑分组成员" :visible.sync="editGroupDialogVisible">
      <el-form ref="editForm" :model="editForm" label-width="120px">
        <el-form-item label="分组名称">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="成员列表">
          <el-select v-model="editForm.userIds" multiple>
            <el-option v-for="user in userList" :key="user.id" :label="user.name" :value="user.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGroupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateGroup">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupList: [], // 分组列表
      createGroupDialogVisible: false, // 创建分组对话框的显示状态
      editGroupDialogVisible: false, // 编辑分组成员对话框的显示状态
      selectedGroup: null, // 当前选中的分组
      createForm: {
        name: '',
        defaultPermissionLevel: '',
        groupLeaderId: ''
      },
      editForm: {
        name: '',
        userIds: []
      },
      userList: [], // 用户列表
      currentUser: {
        id: 1,
        name: "张三",
        permissionLevel: 4 // 假设当前用户是管理员
      }
    };
  },
  methods: {
    // 获取分组列表
    fetchGroupList() {
      this.groupList = [
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
          userIds: [3, 4]
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
    },
    // 打开创建分组对话框
    openCreateGroupDialog() {
      this.createForm = {
        name: '',
        defaultPermissionLevel: '',
        groupLeaderId: this.currentUser.id // 默认设置为当前用户
      };
      this.createGroupDialogVisible = true;
    },
    // 创建分组
    createGroup() {
      // 校验权限等级
      if (parseInt(this.createForm.defaultPermissionLevel) > this.currentUser.permissionLevel) {
        this.$message.error('分组的默认权限等级不能高于您的权限等级');
        return;
      }

      const newGroup = {
        id: this.groupList.length + 1,
        name: this.createForm.name,
        defaultPermissionLevel: this.createForm.defaultPermissionLevel,
        groupLeaderId: this.currentUser.id,
        userIds: [this.currentUser.id]
      };
      this.groupList.push(newGroup);
      this.createGroupDialogVisible = false;
      this.$message.success('分组创建成功');
      window.location.reload();
    },
    // 打开编辑分组成员对话框
    openEditGroupDialog(group) {
      this.selectedGroup = group;
      this.editForm.name = group.name;

      // 确保分组成员列表中包含负责人
      const groupLeaderId = group.groupLeaderId;
      this.editForm.userIds = [...new Set([...(group.userIds || []), groupLeaderId])];

      this.editGroupDialogVisible = true;
    },
    // 更新分组成员
    updateGroup() {
      const groupId = this.selectedGroup.id;
      const groupIndex = this.groupList.findIndex(group => group.id === groupId);
      if (groupIndex !== -1) {
        this.groupList[groupIndex].userIds = this.editForm.userIds;
        this.editGroupDialogVisible = false;
        this.$message.success('分组成员更新成功');
        window.location.reload();
      }
    }
  },
  mounted() {
    this.fetchGroupList(); // 页面加载时获取分组列表
    this.fetchUserList(); // 页面加载时获取用户列表
  }
};
</script>

<style scoped>
</style>
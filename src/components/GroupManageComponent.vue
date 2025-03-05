<template>
  <div>
    <!-- 创建分组按钮 -->
    <page-label label="当前全部分组"></page-label>
    <el-button type="primary" @click="openCreateGroupDialog" class="registerButton">创建新分组</el-button>

    <!-- 分组列表 -->
    <el-table :data="groupList" style="width: 100%">
      <el-table-column prop="id" label="分组ID" width="100"></el-table-column>
      <el-table-column prop="name" label="分组名称" width="300"></el-table-column>
      <el-table-column prop="defaultPermissionLevel" label="默认权限等级" width="150" :formatter="formatLevel"></el-table-column>
      <el-table-column label="分组负责人" width="200">
        <template slot-scope="scope">
          {{ getUserById(scope.row.groupLeaderId)?.name || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" @click="openEditGroupDialog(scope.row)">编辑成员</el-button>
          <el-button size="mini" type="danger" @click="openDeleteGroupDialog(scope.row)" v-if="currentUser.id===scope.row.groupLeaderId||currentUser.permissionLevel===4">删除分组</el-button>
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
            <el-option label="普通用户" value="2"></el-option>
            <el-option label="管理员" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组负责人" >
          <el-select  :placeholder="currentUser.name" disabled></el-select>
        </el-form-item>
        <el-form-item label="分组人员">
          <el-select  :placeholder="currentUser.name" disabled></el-select>

        </el-form-item>
      </el-form>
      <div>注：分组中人员默认只有创建分组用户，请创建后添加人员</div>
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
    <el-dialog
        title="提示"
        :visible.sync="deleteGroupDialogVisible"
        width="30%"
    >
      <span>确定要删除该分组吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteGroupDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleDeleteGroup(local.row)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "@/axios";
import PageLabel from "@/components/title/PageLabel.vue";

export default {
  components: {PageLabel},
  data() {
    return {
      local:{
        row:null,
      },
      groupInfoList: [], // 分组列表
      groupList:[],
      createGroupDialogVisible: false, // 创建分组对话框的显示状态
      editGroupDialogVisible: false, // 编辑分组成员对话框的显示状态
      deleteGroupDialogVisible:false,
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
    // 获取分组列表
    async fetchGroupInfoList() {
      try {
        const response = await axios.get('/account/selectGroupInfo');
        this.groupInfoList = response.data;
        this.groupList = this.groupInfoList.map(item => item.group);
      } catch (error) {
        this.$message(error.message);
      }

    },
    // 获取用户列表
    async fetchUserList() {
      try {
        const response = await axios.get('/account/selectUser');
        this.userList= response.data;
      } catch (error) {
        this.$message(error.message);
      }
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
    openDeleteGroupDialog(row){
      this.local.row=row;
      this.deleteGroupDialogVisible=true;
    },
    async handleDeleteGroup(row){
      try {
        await axios.post(`/account/deleteGroup?id=${row.id}`);
        window.location.reload();
        this.$message.success('分组删除成功');
      } catch (error) {
        this.$message(error.message);
      }
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
    // 创建分组
    async createGroup() {
      // 校验权限等级
      if (parseInt(this.createForm.defaultPermissionLevel) > this.currentUser.permissionLevel) {
        this.$message.error('分组的默认权限等级不能高于您的权限等级');
        return;
      }

      const newGroup = {
        groupName: this.createForm.name,
        permissionLevel: this.createForm.defaultPermissionLevel,
        groupLeaderId: this.currentUser.id,
        userIds: [this.currentUser.id]
      };

      this.createGroupDialogVisible = false;
      try {
        // this.$message.error('123');
        await axios.post('/account/createGroup',newGroup);
        window.location.reload();
        this.$message.success('分组创建成功');
      } catch (error) {
        this.$message(error.message);
      }


    },
    // 打开编辑分组成员对话框
    openEditGroupDialog(group) {
      this.selectedGroup = group;
      this.editForm.name = group.name;

      // 确保分组成员列表中包含负责人
      const groupLeaderId = group.groupLeaderId;
      const matchingGroupInfo = this.groupInfoList.find(groupInfo =>
          groupInfo.group.id === group.id && groupInfo.group.name === group.name
      );

// 如果找到匹配的 groupInfo，提取 users 的 id 列表

        const idList = matchingGroupInfo.users.map(user => user.id);
      this.editForm.userIds = [...new Set([...(idList || []), groupLeaderId])];

      this.editGroupDialogVisible = true;
    },
    // 更新分组成员
    async updateGroup() {
      try {

        const groupId = this.selectedGroup.id;
        const groupIndex = this.groupList.findIndex(group => group.id === groupId);
        if (groupIndex !== -1) {
          this.groupList[groupIndex].userIds = this.editForm.userIds;
          await axios.post('/account/changeGroupMember', {
            groupId: groupId,
            userIdList: this.editForm.userIds,
          });
          this.editGroupDialogVisible = false;
          this.$message.success('分组成员更新成功');
          window.location.reload();
        }
      } catch (error) {
        this.$message(error.message)
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
    }
  },
  mounted() {
    this.fetchGroupInfoList(); // 页面加载时获取分组列表
    this.fetchUserList(); // 页面加载时获取用户列表
    this.fetchCurrentUser();
  }
};
</script>

<style scoped>
.registerButton{
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start;
  margin-left: 5px;
  margin-bottom: 15px;

}
</style>
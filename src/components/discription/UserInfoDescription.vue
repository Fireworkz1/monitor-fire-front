<script>
import axios from "@/axios";
import PageLabel from "@/components/title/PageLabel.vue";

export default {
  components: {PageLabel},

  data(){
    return{
      onChangeVisibility:false,
      user:{
        id:null,
        permissionLevel:null,
        account:"",
        password:"",
        name:"",
        tel:"",
        email:"",

      },editForm: {
        name: "",
        tel: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.editForm.password) {
                callback(new Error("两次输入的密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    }
  },methods:{
    saveEdit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 调用 updateInfo 方法更新用户信息
          this.updateInfo();
        } else {
          // 表单验证失败，提示用户
          this.$message.error("表单验证失败");
        }
      });
    },
    async getInfo() {
      try {

        const response = await axios.get('/account/current');
        this.user=response.data;
        console.log(this.user)
      } catch (error) {
        this.$message("获取用户信息失败:"+error.message);
      }
    },

    async updateInfo() {
      try {
        // 发起请求，修改用户信息
         await axios.post('/account/changeUserInfo', {
          name: this.editForm.name,
          tel: this.editForm.tel,
          email: this.editForm.email,
          password: this.editForm.password,
        });

        // 检查后端返回的响应，确认操作成功

          this.user.name = this.editForm.name;
          this.user.tel = this.editForm.tel;
          this.user.email = this.editForm.email;

          // 清除 localStorage 中的 token
          localStorage.removeItem("token");

          // 跳转到登录页面
          this.$router.push("/login");

          // 提示用户信息已更新
          this.$message.success("用户信息已更新，请重新登录");


        // 清空表单
        this.editForm = {
          name: "",
          tel: "",
          email: "",
          password: "",
          confirmPassword: ""
        };
      } catch (error) {
        // 捕获请求过程中的错误
        this.$message.error("用户信息更新失败: " + error.message);
      }
    },
  },watch: {
    onChangeVisibility(val) {
      if (val) {
        // 打开对话框时，初始化表单数据
        this.editForm = {
          name: this.user.name,
          tel: this.user.tel,
          email: this.user.email,
          password: "",
          confirmPassword: ""
        };
      }
    }
  }, created() {
    this.getInfo();
  },
}
</script>

<template>
<div>
  <page-label label="用户信息"></page-label>
  <el-descriptions class="margin-top" title="当前登录用户信息" :column="1"  border>
    <template slot="extra">
      <el-button type="primary" size="small" @click="onChangeVisibility=true">修改用户信息</el-button>
    </template>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        登录账号
      </template>
      {{ this.user.account }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        用户名
      </template>
      {{ this.user.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      {{ this.user.tel }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        邮箱
      </template>
      {{ this.user.email }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        权限等级
      </template>
      <el-tag size="small">{{ this.user.permissionLevel===4?"管理员":"普通用户" }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        用户id
      </template>
      {{ this.user.id }}
    </el-descriptions-item>
  </el-descriptions>
  <el-dialog
      title="修改用户信息"
      :visible.sync="onChangeVisibility"
      width="40%"
  >
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model="editForm.tel" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            v-model="editForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
            v-model="editForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="onChangeVisibility = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">保 存</el-button>
      </span>
  </el-dialog>

</div>
</template>

<style scoped>

</style>
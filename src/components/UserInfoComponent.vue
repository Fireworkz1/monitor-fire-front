<script>
export default {
  data(){
    return{
      onChangeVisibility:false,
      user:{
        id:1,
        permissionLevel:4,
        account:"fireworkz",
        password:"",
        name:"fire",
        tel:"18522117678",
        email:"smart030518@126.com",

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
          // 更新用户信息
          this.user.name = this.editForm.name;
          this.user.tel = this.editForm.tel;
          this.user.email = this.editForm.email;

          // 清除 localStorage 中的 token
          localStorage.removeItem("token");

          // 跳转到登录页面
          this.$router.push("/login");

          this.onChangeVisibility = false;
          this.$message.success("用户信息已更新，请重新登录");
        } else {
          this.$message.error("表单验证失败");
        }
      });
    }

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
  },
}
</script>

<template>
<div>
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
      <el-tag size="small">{{ this.user.permissionLevel }}</el-tag>
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
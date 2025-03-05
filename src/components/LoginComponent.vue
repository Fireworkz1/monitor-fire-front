<template>
  <div class="login-container">
    <h2>登录微服务管理系统</h2>
    <el-form ref="loginForm" label-position="top" >
      <el-form-item label="账号" prop="account">
        <el-input
            v-model="account"
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
            required
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            required
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="handleLogin">登录</el-button>
        <el-button @click="dialogVisible=true">注册</el-button>
      </el-form-item>
<!--      <p v-if="error" class="error">{{ error }}</p>-->
    </el-form>
    <el-dialog
        title="用户注册"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">

      <!-- 注册表单 -->
      <el-form
          :model="registerForm"
          :rules="rules"
          ref="registerForm"
          label-width="120px"
          class="register-form">

        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="tel">
          <el-input v-model="registerForm.tel" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="账号" prop="account">
          <el-input v-model="registerForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              show-password></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="权限等级" prop="permissionLevel">
          <el-select v-model="registerForm.permissionLevel" placeholder="请选择权限等级">
            <el-option label="普通用户" :value="2"></el-option>
            <el-option label="管理员" :value="4" disabled></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">注册</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>


</template>

<script>
import axios from '@/axios';
export default {
  data() {
    return {
      dialogVisible:false,
      account: '',
      password: '',
      error: '',
      registerForm: {
        name: "",
        tel: "",
        account: "",
        password: "",
        email: "",
        permissionLevel: null
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }
        ],
        permissionLevel: [
          { required: true, message: "请选择权限等级", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      try{
        this.$refs.registerForm.validate(async (valid) => {
          if (valid) {
            await axios.post('/account/register',this.registerForm);
            this.dialogVisible=false;
            this.$message('注册成功');
          } else {
            // 表单验证失败，提示用户
            this.$message.error("表单填写有误，请检查！");
          }
        });
      }catch (error) {
        this.$message.error(error);
      }


    },
    resetForm() {
      this.$refs.registerForm.resetFields();
    },
    async handleLogin() {
      this.error = ''; // 清除之前的错误信息
      try {
        const response = (await axios.post('/account/login', {
          account: this.account,
          password: this.password
        })).data;
        console.log(response.token)
        // 登录成功，存储 Token

        localStorage.setItem('token', response.token);
        this.$message('登录成功');
        this.$router.push('/home'); // 跳转到主页
      } catch (error) {
        // 登录失败，显示错误信息
        this.$message.error(error);
        this.error=error;
        this.password=''
      }
    },handleClose(){
      this.registerForm={
          name: "",
          tel: "",
          account: "",
          password: "",
          email: "",
          permissionLevel: null
        }
      this.dialogVisible=false;
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
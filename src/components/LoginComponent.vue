<template>
  <div class="login-container">
    <h2>登录微服务管理系统</h2>
    <el-form ref="loginForm" :model="loginForm" :rules="rules" label-position="top" @submit.prevent="handleLogin">
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
        <el-button type="primary" native-type="submit">登录</el-button>
      </el-form-item>
      <p v-if="error" class="error">{{ error }}</p>
    </el-form>
  </div>
</template>

<script>
import axios from '@/axios';
export default {
  data() {
    return {
      account: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.error = ''; // 清除之前的错误信息
      try {
        // 模拟登录请求
        const response = await axios.post('/account/login', {
          account: this.account,
          password: this.password
        });
        console.log(response)
        // 登录成功，存储 Token
        localStorage.setItem('token', response.data.token);
        this.$router.push('/home'); // 跳转到主页
      } catch (error) {
        // 登录失败，显示错误信息
        // this.error = 'Invalid username or password';
        console.error('Login failed:', error);
        this.error=error;
      }
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
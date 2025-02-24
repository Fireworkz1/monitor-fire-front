<template>
  <div class="login-container">
    <h2>登录微服务管理系统</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="account">账号:</label>
        <input
            type="text"
            id="account"
            v-model="account"
            required
            class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
        />
      </div>
      <div class="form-group">
        <button type="submit" class="btn">登录</button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
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
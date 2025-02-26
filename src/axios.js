import axios from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: 'http://localhost:9500', // 设置后端 API 的基础 URL
    timeout: 5000
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        // 从 localStorage 中获取 JWT Token
        const token = localStorage.getItem('token');
        if (token) {
            // 在请求头中添加 Authorization 字段
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    response => {
        // 检查业务状态码
        if (response.data && response.data.code === 500) {
            // 抛出业务错误
            // alert('111');
            throw new Error(response.data.msg);
        }
        return response.data; // 如果没有错误，返回响应
    },
    error => {
        // 处理 HTTP 错误
        if (error.response) {
            // 检查 HTTP 状态码
            if (error.response.status === 401) {
                // 如果返回 401 状态码，表示 Token 无效或过期
                console.error('Token 无效或已过期，请重新登录');
                // 清除无效 Token
                localStorage.removeItem('token');
                // 跳转到登录页面
                window.location.href = '/login';
            }
        } else if (error.request) {
            // 请求已发出，但未收到响应
            console.error('请求未收到响应:', error.request);
        } else {
            // 其他错误（如抛出的业务错误）
            console.error('请求失败:', error.message);
        }
        return Promise.reject(error); // 返回错误，以便在调用处捕获
    }
);

export default axiosInstance;
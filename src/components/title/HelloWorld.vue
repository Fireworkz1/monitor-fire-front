<template>
  <div class="main-title">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-title {
  font-size: 1.5rem; /* 大标题字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #333; /* 字体颜色 */
  text-align: center; /* 水平居中 */
  padding: 5px; /* 内边距 */
  background-color: #ffffff; /* 背景颜色 */
  border-bottom: 2px solid #ddd; /* 下边框 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
</style>

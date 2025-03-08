<script>
export default {
  name: "PageLabel", // 组件名称
  props: {
    label: {
      type: String,
      required: true, // 确保 label 是必须的
      default: "默认标题" // 默认值，以防未传值
    },type:{
      type:String,
      required:false,
      default:"normal"
    }
  }
};
</script>

<template>
  <div :class="type===`normal`?`title`:`title-special`">
    <h3>{{ label }}</h3>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 水平起始对齐 */
  margin-left: 0px; /* 左边距 */
  margin-top: 20px; /* 顶部外边距 */
  margin-bottom: 20px;
  padding: 10px; /* 内边距 */
  border-left: 4px solid #409EFF; /* 左侧边框，蓝色 */
   /* 背景颜色 */
  border-radius: 5px; /* 圆角 */
  //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  background: linear-gradient(to right, #f9f9f9 50%, rgba(249, 249, 249, 0) 100%);
}
.title-special{
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 水平起始对齐 */
  margin-left: 0px; /* 左边距 */
  margin-top: 20px; /* 顶部外边距 */
  margin-bottom: 20px;
  padding: 10px; /* 内边距 */
  border-left: 4px solid #252793; /* 左侧边框，蓝色 */
  /* 背景颜色 */
  border-radius: 5px; /* 圆角 */
  //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  background: linear-gradient(to right, #c0c0c0 50%, rgba(249, 249, 249, 0) 100%);
}

.title h3 {
  margin: 0; /* 去除默认外边距 */
  font-weight: 600; /* 字体粗细 */
  color: #333; /* 字体颜色 */
}
</style>
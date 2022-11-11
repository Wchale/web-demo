<template>
  <div class="content">
    <!-- 主标题 -->
    <div class="title">
      <el-input v-model="title" placeholder="请输入主标题" class="input"></el-input>
    </div>
    <!-- 副标题 -->
    <div class="sub_title">
      <el-input v-model="subtitle" placeholder="请输入副标题" class="input"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsTitle',
  data() {
    return {
      title: '',
      subtitle: ''
    }
  }
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
}

.title,
.sub_title {
  border: 1px dashed #f00;
  margin: 5px;
}

.input >>> .el-input__inner {
  text-align: center;
}
</style>
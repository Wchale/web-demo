<template>
  <div id="home">
    <el-button type="primary" @click="$router.push('/sheet-manager')">答题卡管理中心</el-button>
    <el-button type="primary" @click="$router.push('/exam-manager')">试卷管理中心</el-button>
  </div>
</template>

<script>
</script>

<style scoped>
#home {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#home >>> .el-button {
  font-size: 30px;
  padding: 32px 48px;
}
</style>
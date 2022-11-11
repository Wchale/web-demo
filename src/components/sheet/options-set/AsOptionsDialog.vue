<template>
  <el-dialog class="options_dialog" :visible.sync="visible" :title="type + title" :close-on-click-modal="false"
             :show-close="false">
    <slot></slot>
    <div slot="footer">
      <el-button type="danger" size="small" @click="$emit('cancel')">{{ '取消' + type }}</el-button>
      <el-button type="primary" size="small" @click="$emit('confirm')">{{ '确认' + type }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AsOptionsDialog",
  props: {
    visible: {type: Boolean, default: false},
    title: String,
    type: {type: String, default: '添加'},
  },
}
</script>

<style scoped>

</style>
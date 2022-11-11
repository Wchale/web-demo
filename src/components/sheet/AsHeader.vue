<template>
  <header id="as_header">
    <h2>{{ title }}</h2>
    <slot/>
  </header>
</template>

<script>
export default {
  name: 'AsHeader',
  props: {
    title: {
      type: String,
      default: '答题卡制作工具'
    }
  }
}
</script>

<style lang="scss" scoped>
#as_header {
  width: 100%;
  height: var(--header-height);
  background-color: var(--primary-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>

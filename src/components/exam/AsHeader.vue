<!--头部，标题栏-->
<template>
    <header id="as_header">
        <h2>试卷</h2>
        <slot name="header"></slot>
    </header>
</template>

<script>
    export default {
        name: 'AsHeader',
    }
</script>

<style lang="scss" scoped>
    #as_header {
        width: 100%;
        background-color: #409eff;
        height: 68px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
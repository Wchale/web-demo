<template>
  <div id="app">
    <template>
      <!-- 文本框 wrap -->
      <div 
        ref="rTextareaWrap" 
        class="drag-textarea"
      >

        <!-- 文本框 -->
        <textarea></textarea>
        <!-- 辅助线(用于调整文本框高度) -->
        <div
          ref="rResizeLine"
          class="resize-line"
          @mousedown="handleMouseDown"
        ></div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
data () {
    return {
        MaxHeight: 400,
        MinHeight: 150
    }
  },
  methods: {
    
    /**
     * 处理鼠标按下事件
     *
     * @param {MouseEvent} 鼠标事件
     */
    handleMouseDown (event) {
      // 禁止用户选择网页中文字
      document.onselectstart = () => false;
      // 禁止用户拖动元素
      document.ondragstart = () => false;

      // 保存鼠标最后移动的位置（Y轴）
      this.dragState = {
        // 鼠标开始移动的位置（Y轴）
        'startMouseTop': event.clientY,
        // 鼠标最后移动的位置（Y轴）
        'endMouseTop': event.clientY
      };

      // 绑定鼠标移动事件
      document.addEventListener('mousemove', this.handleMouseMove);
      // 绑定鼠标放开事件
      document.addEventListener('mouseup', this.handleMouseUp);
    },

    /**
     * 处理鼠标移动事件
     *
     * @param {MouseEvent} 鼠标事件
     */
    handleMouseMove (event) {
      const { rTextareaWrap, rResizeLine } = this.$refs;
      // 获取鼠标最后移动的位置（Y轴）
      const { endMouseTop } = this.dragState;
      // 获取当前的文本框高度
      const oldTextAreaHeight = rTextareaWrap.getBoundingClientRect().height;
      // 新的文本框高度
      let newTextAreaHeight = 0;

      // 计算鼠标移动的距离
      const distance = Math.abs(
        parseInt(((endMouseTop - event.clientY) * 100).toString(), 10) / 100
      );

      // 若鼠标向上移动
      if (endMouseTop > event.clientY) {
        // 发送框高度达到最大
        if (oldTextAreaHeight <= this.MinHeight)
        {
          // 修改光标为可被向下移动
          rResizeLine.style.cursor = 's-resize';
          return false;
        }

        // 计算新的发送框高度
        newTextAreaHeight = oldTextAreaHeight - distance;
      }
      // 若鼠标向下移动
      else
      {
        // 发送框高度达到最小
        if (oldTextAreaHeight >= this.MaxHeight)
        {
          // 修改光标为可被向上移动
          rResizeLine.style.cursor = 'n-resize';
          return false;
        }

        // 计算新的发送框高度
        newTextAreaHeight = oldTextAreaHeight + distance;
      }

      // 兼容鼠标快速拖动的情况：新的发送框高度不能超过最大值
      if (newTextAreaHeight > this.MaxHeight)
      {
        newTextAreaHeight = this.MaxHeight;
      }

      // 兼容鼠标快速拖动的情况：新的发送框高度不能小于最小值
      if (newTextAreaHeight < this.MinHeight)
      {
        newTextAreaHeight = this.MinHeight;
      }

      // 修改发送框高度
      rTextareaWrap.style.height = newTextAreaHeight + 'px';
      // 修改光标为可移动
      rResizeLine.style.cursor = 'move';

      // 更新鼠标最后移动的位置（Y轴）
      this.dragState.endMouseTop = event.clientY;
    },

    /**
     * 处理鼠标放开事件
     */
    handleMouseUp () {
      // 移除鼠标移动事件
      document.removeEventListener('mousemove', this.handleMouseMove);
      // 移除鼠标放开事件
      document.removeEventListener('mouseup', this.handleMouseUp);
      // 允许用户选择网页中文字
      document.onselectstart = null;
      // 允许用户拖动元素
      document.ondragstart = null;
    }
  }
}
</script>

<style scoped>
body {
  padding-top: 200px;
}
.drag-textarea {
  position: absolute;
  top: 200px;
  width: 1000px;
  height: 250px;
}
.drag-textarea .resize-line {
  height: 5px;
  cursor: move;
}
.drag-textarea textarea {
  width:100%;
  /* 重点属性 */
  height: calc(100% - 5px);
  padding: 0;
  border: 1px solid #333;
  resize: none;
}
</style>
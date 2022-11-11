<template>
  <div class="header">
    <!-- 答题卡标题 -->
    <as-title></as-title>
    <!-- 固定信息 -->
    <div class="info">
      <div class="info_left">
        <div class="info_item">
          <!-- 姓名 -->
          <div class="info_item_title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</div>
          <div class="info_item_line"></div>
        </div>
        <div class="info_item">
          <!-- 准考证号 -->
          <div class="info_item_title">准考证号:</div>
          <div class="info_item_box"
               v-for="index in 9"
               style="margin-left:-1px"
               :key="index"></div>
        </div>
        <!-- 填涂样例 -->
        <div class="info_item">
          <div class="info_item_bottom"
               style="border:1px solid #f00;width: 100%;height: 50px;margin-top: 5px;display: flex;">
            <div class="info_item_bottom_left"
                 style="justify-content: center;align-items: center;display: flex; flex-direction: column;">
              <div>填涂样例</div>
              <div class="info_item_bottom_left_right">正确填涂
                <div></div>
              </div>
            </div>
            <div class="info_item_bottom_right"
                 style="color:#f00;display: flex;justify-content: center;align-items: center;flex: 1;">贴缺考标识
            </div>
          </div>
        </div>
      </div>
      <!-- 条形码 -->
      <div class="info_right">
        贴条形码区
      </div>
    </div>
    <!-- 提示 -->
    <div class="tips">
      <div class="tips_title">
        注意事项
      </div>
      <div class="tips_content">
        <div class="tips_content_item"
             v-for="(item, index) in headerTitle.slice(0,5)"
             :key="index">
          {{ index + 1 }}、{{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsTitle from './manager/AsTitle.vue'

export default {
  name: 'AsSheetHeader',
  components: {AsTitle},
  data() {
    return {
      headerTitle: [
        {text: '请使用2B铅笔填涂选择题答案等选项及考号'},
        {text: '超出黑色矩形边框限定区域的答案无效'},
        {text: '请按照要求正确填写考号、姓名等信息'},
        {text: '主观题必须使用黑色签字笔书写'},
        {text: '请在各题目的答题区域内作答'},
        {text: '此卡不准弄脏、弄皱或弄破'},
        {text: '修改填涂时请用橡皮擦干净'},
        {text: '请检查信息是否填写完整'},
        {text: '请保持卷面整洁完整'},
        {text: '此卡严禁折叠'},
      ],
    }
  },
}
</script>

<style scoped>
.info {
  display: flex;
  width: 100%;
}

.info_left {
  flex: 1;
}

.info_item_title {
  width: 70px;
  margin-top: 5px;
  font-size: 14px;
}

.info_item {
  display: flex;
  flex: 1;
  align-items: flex-end;
}

.info_item_line {
  background-color: #f00;
  height: 1px;
  width: 100%;
  margin-left: 10px;
}

.info_item_box {
  border: 1px solid #f00;
  height: 20px;
  flex: 1;
}

.info_right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f00;
}

.tips {
  margin-top: 5px;
  width: 100%;
  padding: 5px 20px;
  border: 1px solid #f00;
  display: flex;
  box-sizing: border-box;
  align-items: center;
}

.tips_title {
  writing-mode: tb-rl;
  color: #f00;
  margin-right: 10px;
}

.tips_content {
  color: #f00;
  font-size: 12px;
}

.info_item_bottom_left {
  border-right: 1px solid #f00;
  height: 100%;
  padding: 0 10px;
}

.info_item_bottom_left > div {
  color: #f00;
}

.info_item_bottom_left_right {
  color: #f00;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.info_item_bottom_left_right > div {
  color: #f00;
  width: 10px;
  height: 5px;
  margin-left: 5px;
  background-color: black;
}

.info_right {
  border: 1px dashed #f00;
  margin-left: 10px;
}
</style>
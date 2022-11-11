<template>
  <as-options-dialog :visible.sync="visible"
                     :type="type"
                     @confirm="confirm" @cancel="$emit('update:visible', false)"
                     title="作文题">
    <!-- 标题配置项开始 -->
    <div class="option_item">
      <span>标题：</span>
      <el-input :autofocus="true" v-model.trim.lazy="title" placeholder="请输入标题"></el-input>
    </div>
    <!-- 标题配置项结束 -->

    <!-- 题号配置项开始 -->
    <div class="option_item">
      <span>题号：</span>
      <el-input-number v-model="number" controls-position="right" :min="1" size="mini"></el-input-number>
    </div>
    <!-- 题号配置项结束 -->

    <!-- 分数配置项开始 -->
    <div class="option_item">
      <span>分数：</span>
      <el-input-number v-model="score" controls-position="right" :min="1" size="mini"></el-input-number>
      <el-col class="text-center" :span="1">分</el-col>
    </div>
    <!-- 分数配置项结束 -->

    <!-- 字数配置项开始 -->
    <div class="option_item">
      <span>字数：</span>
      <el-input-number v-model="numberOfWord" controls-position="right" :min="1" size="mini"></el-input-number>
      <el-col class="text-center" :span="1">字</el-col>
    </div>
    <!-- 题型配置项结束 -->
  </as-options-dialog>
</template>

<script>
import AsOptionsDialog from "@/components/sheet/options-set/AsOptionsDialog";
import store from "@/store";
import _ from "lodash";

export default {
  name: 'AsOptionsComposition',
  components: {AsOptionsDialog},
  props: {
    visible: Boolean,
    dataId: Number
  },
  data() {
    return {
      sheet: store.state.sheet,
      type: '添加',
      title: '作文题',
      numberOfWord: 600,
      score: 30,
      module: null,
      number: 1,
    }
  },
  watch: {
    visible(value) {
      if (value) {
        const len = this.sheet.numbers.length
        this.number = len === 0 ? 1 : this.sheet.numbers[len - 1] + 1
      }
    }
  },
  async created() {
    if (this.dataId === void 0) {
      this.module = (await import('@/components/sheet/modules/AsComposition'))['default']
    } else {
      this.type = '编辑'
      const data = _.cloneDeep(store.state.sheet.moduleData.filter(item => item.dataId === this.dataId)[0].data)
      const {title, numberOfWord, score} = data
      this.title = title
      this.numberOfWord = numberOfWord
      this.score = score
    }
  },
  methods: {
    confirm() {
      if (this.title === '' || this.numberOfWord === void 0 || this.score === void 0) {
        this.$message({showClose: true, message: '有选项为空,请填写完整!', type: 'error'});
        return;
      }
      const payload = {sn: this.number, en: this.number, flag: false}
      store.commit('numberIsOnly', payload)
      if (payload.flag) {
        this.$message({showClose: true, message: '题号有重复!', type: 'error'});
        return;
      }
      this.$emit('update:visible', false)
      if (this.dataId === void 0) {
        store.commit('addModuleData', {
          module: this.module,
          ruleType: 'composition',
          data: {
            otherHeight: 19,
            itemFixedHeight: 36,
            title: this.title,
            numberOfWord: this.numberOfWord,
            score: this.score,
            number: this.number,
            count: 1
          },
        })
        this.title = '作文题'
        this.score = 30
        this.numberOfWord = 600
      } else {
        store.commit('updateModuleData', {
          dataId: this.dataId,
          data: {
            otherHeight: 19,
            itemFixedHeight: 36,
            title: this.title,
            numberOfWord: this.numberOfWord,
            score: this.score,
            number: this.number,
            count: 1
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.option_item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  span {
    display: inline-block;
    min-width: 80px;
    text-align: right;
  }
}

.review {
  width: 100%;
  height: 280px;
  border: 1px solid #bbb;
  border-radius: 6px;
  overflow-y: auto;
  padding: 10px 0;
  box-sizing: border-box;

  .top {
    padding-bottom: 20px;
  }

  .review_item {
    padding-bottom: 5px;
  }
}
</style>

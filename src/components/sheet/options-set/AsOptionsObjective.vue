<template>
  <!-- 客观题对话框开始 -->
  <as-options-dialog :visible.sync="visible"
                     :type="dialogType"
                     @confirm="confirm"
                     @cancel="cancel"
                     title="客观题">
    <!-- 标题配置项开始 -->
    <div class="option_item">
      <span>标题：</span>
      <el-input v-model.trim.lazy="title" placeholder="请输入标题"></el-input>
    </div>
    <!-- 标题配置项结束 -->

    <!-- 题型配置项开始 -->
    <div class="option_item">
      <span>题型：</span>
      <el-radio-group v-model="type" @change="type === '判断题' ? optionCount = 2 : optionCount = 4" size="small">
        <el-radio label="单选题" border>单选题</el-radio>
        <el-radio label="多选题" border>多选题</el-radio>
        <el-radio label="判断题" border>判断题</el-radio>
      </el-radio-group>
    </div>
    <!-- 题型配置项结束 -->

    <!-- 题号配置项结束 -->
    <div class="option_item" style="flex-wrap: wrap;">
      <span>题号：</span>
      <div style="display: flex;align-items: center;">
        <el-input-number v-model="startNumber" controls-position="right" :min="1" size="mini"></el-input-number>
        <el-col class="text-center" :span="1">-</el-col>
        <el-input-number v-model="endNumber" controls-position="right" :min="1" size="mini"></el-input-number>
        <el-col class="text-center" :span="1">题,</el-col>
        <el-col class="text-center" :span="2">每题</el-col>
        <el-input-number v-model="score" controls-position="right" :min="1" size="mini"></el-input-number>
        <el-col class="text-center" :span="1">分,</el-col>
        <el-col class="text-center" :span="2">每题</el-col>
        <el-input-number v-model="optionCount" :disabled="type === '判断题'" controls-position="right" :min="1" :max="7"
                         size="mini"></el-input-number>
        <el-col class="text-center" :span="2">个选项</el-col>
        <el-col :span="3" style="display: flex; justify-content: center;">
          <el-button size="small" type="primary" @click="addOptions">添加</el-button>
        </el-col>
      </div>
    </div>
    <!-- 题号配置项结束 -->
    <div class="review">
      {{sheet.numbers}}
      <el-row class="review_item" v-for="(option,index) in options" :key="option.number" type="flex"
              style="align-items: center">
        <el-col class="text-center" :span="3">第 {{ option.number }} 题</el-col>
        <el-input-number v-model="option.score" controls-position="right" :min="1" size="mini"></el-input-number>
        <el-col class="text-center" :span="1"> 分,</el-col>
        <el-input-number :disabled="option.type === '判断题'" v-model="option.optionCount" controls-position="right"
                         :min="1" :max="7" size="mini"></el-input-number>
        <el-col class="text-center" :span="2">个选项</el-col>
        <el-col :span="4">
          <el-select v-model.trim.lazy="option.type"
                     @change="option.type === '判断题' ? option.optionCount = 2 : option.optionCount = 4" placeholder="请选择"
                     size="small">
            <el-option value="单选题"/>
            <el-option value="多选题"/>
            <el-option value="判断题"/>
          </el-select>
        </el-col>
        <el-col class="flex-center" :span="4">
          <el-button @click="removeItem(index)" size="small" type="danger" icon="el-icon-delete">删除</el-button>
        </el-col>
      </el-row>
    </div>
  </as-options-dialog>
  <!-- 客观题对话框结束 -->
</template>

<script>
import store from "@/store";
import AsOptionsDialog from "@/components/sheet/options-set/AsOptionsDialog";
import _ from "lodash";

export default {
  name: "as-objective",
  components: {AsOptionsDialog},
  props: {
    visible: Boolean,
    dataId: Number
  },
  data() {
    return {
      sheet: store.state.sheet,
      dialogType: '添加',
      title: '语文部分',
      startNumber: 1,
      endNumber: 10,
      score: 3,
      optionCount: 4,
      type: '单选题',
      primaryOptions: [],
      options: [],
      module: null,
      // 会反悔的题号 -- 操作之后题号产生了变化 -> 取消编辑
      numbersOfRegret: [
        // 加了又不想加
        [],
        // 删了又不想删
        []
      ],
    }
  },
  watch: {
    visible(value) {
      if (value) {
        const len = this.sheet.numbers.length
        this.startNumber = len === 0 ? 1 : this.sheet.numbers[len - 1] + 1
        this.endNumber = this.startNumber + 9;
      }
    }
  },
  async created() {
    this.endNumber = this.startNumber + 9;
    if (this.dataId === void 0) {
      this.module = (await import('@/components/sheet/modules/AsObjective'))['default']
    } else {
      this.dialogType = '编辑'
      const data = _.cloneDeep(this.sheet.moduleData.filter(item => item.dataId === this.dataId)[0].data)
      const {title, options} = data
      this.title = title
      this.options = options
      this.primaryOptions = _.cloneDeep(options)
    }
  },
  methods: {
    // 添加选项到预览列表中
    addOptions() {
      const error = this.check()
      if (error) {
        this.$message({showClose: true, message: error, type: 'error'});
        return;
      }
      const {
        startNumber: sn, endNumber: en,
        type, score, optionCount, options
      } = this;
      console.log('%c 获取题目列表:', 'font-size: 20px;color:#84a729', this.options.length, this.options)
      for (let i = sn; i <= en; i++) {
        options.push({number: i, score, type, optionCount})
        this.numbersOfRegret[0].push(i)
      }
      options.sort((a, b) => a.number - b.number)
      this.startNumber = en + 1;
      this.endNumber = this.startNumber + 9;
    },
    removeItem(index) {
      const number = this.options[index].number
      if (this.dataId !== void 0) {
        this.numbersOfRegret[1].push(number)
      }
      store.commit('removeNumber', number)
      this.options.splice(index, 1)
    },
    check() {
      const {
        startNumber: sn, endNumber: en,
        optionCount, title, score, type,
      } = this;
      if (!title) return '标题不能为空!';
      if (!type) return '题型不能为空!';
      if (!sn) return '开始题号不能为空!';
      if (!en) return '结束题号不能为空!';
      if (!score) return '分数不能为空!';
      if (!optionCount) return '选项数不能为空!';
      if (sn > en) return '起始题号不能大于结束题号!';
      const payload = {sn, en, flag: false}
      store.commit('numberIsOnly', payload)
      if (payload.flag) return '题号有重复!'
    },
    cancel() {
      console.log(1)
      this.$emit('update:visible', false)
      if (this.dataId === void 0) {
        const numbers = this.options.map(item => item.number)
        store.commit('removeNumber', numbers)
        this.options = []
      } else {
        if (this.numbersOfRegret[0].length !== 0) {
          store.commit('removeNumber', this.numbersOfRegret[0])
        }
        if (this.numbersOfRegret[1].length !== 0) {
          store.commit('addNumber', this.numbersOfRegret[1])
        }
        this.options = _.cloneDeep(this.primaryOptions)
      }
    },
    confirm() {
      let {options} = this;
      if (options.length === 0) {
        this.$message({showClose: true, message: '请先添加题目', type: 'error'});
        return;
      }
      const score = options.reduce((pre, cur) => pre + cur.score, 0)
      if (this.dataId === void 0) {
        store.commit('addModuleData', {
          ruleType: 'objective',
          module: this.module,
          data: {
            otherHeight: 35,
            itemFixedHeight: 90,
            title: this.title, options,
            score, count: options.length
          }
        })
        console.log(store.state.sheet.moduleData)
      } else {
        store.commit('updateModuleData', {
          dataId: this.dataId,
          data: {
            otherHeight: 36,
            itemFixedHeight: 90,
            title: this.title, options,
            score, count: options.length
          }
        })
      }
      this.options = []
      this.$emit('update:visible', false)
    },
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

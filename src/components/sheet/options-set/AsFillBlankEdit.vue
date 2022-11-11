<template>
  <as-options-dialog :visible.sync="visible"
                     @confirm="confirm"
                     @cancel="cancel"
                     type="编辑"
                     :title="`填空题`">
    <div class="option_item">
      <span>标题：</span>
      <el-input v-model.trim.lazy="title" placeholder="请输入标题"></el-input>
    </div>
    <div class="option_item">
      <span>题号：</span>
      <div style="display: flex;align-items: center;"
      >
        <el-input-number v-model="startNumber" controls-position="right" :min="1" size="mini"></el-input-number>
        <el-col class="text-center" :span="2">-</el-col>
        <el-input-number v-model="endNumber" controls-position="right" :min="1" size="mini"></el-input-number>
        <el-col class="text-center" :span="1">题</el-col>
      </div>
    </div>
    <div class="option_item">
      <span>题目设置：</span>
      <el-input-number v-model="count" controls-position="right" :min="1" :max="5"
                       size="mini"></el-input-number>
      <el-col class="text-center" :span="2">个填空,</el-col>
      <el-col :span="1">每空</el-col>
      <el-input-number v-model="score" controls-position="right" :min="1" size="mini"></el-input-number>
      <el-col class="text-center" :span="1">分</el-col>
      <el-col :span="3" style="display: flex; justify-content: center;">
        <el-button size="small" type="primary" @click="addFillBlank">添加</el-button>
      </el-col>
    </div>
    <div class="review">
      <div class="review_item">
        <el-collapse v-show="options?.length !== 0" accordion>
          <el-collapse-item v-for="(option, index) in options" :key="option.number">
            <template slot="title">
              <div class="option" @click.stop>
                <el-col class="text-center" :span="4">第 {{ option.number }} 题</el-col>
                <el-input-number v-model="option.count" @change="handleCount(index)" controls-position="right"
                                 :min="1"
                                 :max="5"
                                 size="mini"></el-input-number>
                <el-col class="text-center" :span="3">个填空,</el-col>
                <el-col class="text-center" :span="2">每空</el-col>
                <el-input-number v-model="option.score"
                                 controls-position="right"
                                 :min="1"
                                 size="mini"></el-input-number>
                <el-col class="text-center" :span="2">分</el-col>
                <el-col class="flex-center" :span="4">
                  <el-button @click="removeItem(index)" size="small" type="danger" icon="el-icon-delete">删除
                  </el-button>
                </el-col>
              </div>
            </template>
            <div class="subOption" v-for="subOption in option.subOptions" :key="subOption.number">
              <el-row type="flex"
                      style="width: 100%; align-items: center">
                <el-col class="text-center" :span="3">第 {{ subOption.number }} 空</el-col>
                <el-input-number v-model="subOption.score" controls-position="right" :min="1"
                                 size="mini"></el-input-number>
                <el-col class="text-center" :span="1"> 分</el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </as-options-dialog>
</template>

<script>
import AsOptionsDialog from '@/components/sheet/options-set/AsOptionsDialog.vue'
import store from "@/store";
import _ from "lodash";

export default {
  name: "AsFillBlankEdit",
  components: {AsOptionsDialog},
  props: {visible: Boolean, dataId: Number},
  data() {
    return {
      sheet: store.state.sheet,
      type: '添加',
      title: '',
      startNumber: 1,
      endNumber: 10,
      score: 1,
      count: 1,
      primaryOptions: [],
      options: [],
      // 会反悔的题号 -- 操作之后题号产生了变化 -> 取消编辑
      numbersOfRegret: [
        // 加了又不想加
        [],
        // 删了又不想删
        []
      ],
    }
  },
  created() {
    const data = _.cloneDeep(store.state.sheet.moduleData.filter(item => item.dataId === this.dataId)[0].data)
    this.title = data.title
    this.options = data.options
    this.primaryOptions = _.cloneDeep(data.options)
  },
  watch: {
    visible(value) {
      if (value) {
        const len = this.sheet.numbers.length
        this.startNumber = len === 0 ? 1 : this.sheet.numbers[len - 1] + 1
        this.endNumber = this.startNumber + 4;
      }
    }
  },
  methods: {
    handleCount(index) {
      const option = this.options[index]
      const subOptions = []
      for (let j = 1; j <= option.count; j++) {
        subOptions.push({
          number: j,
          score: option.score,
          width: option.row === 1 ? Math.floor(100 / option.count) : 100,
          row: option.row
        })
      }
      option.subOptions = subOptions
    },
    addFillBlank() {
      const error = this.check()
      if (error) {
        this.$message({showClose: true, message: error, type: 'error'});
        return;
      }
      const {
        startNumber: sn, endNumber: en,
        score, count, row, options
      } = this;
      for (let i = sn; i <= en; i++) {
        const subOptions = []
        this.numbersOfRegret[0].push(i)
        for (let j = 1; j <= count; j++) {
          subOptions.push({
            number: j,
            score: score,
            width: row === 1 ? Math.floor(100 / count) : 100,
            row: row
          })
        }
        options.push({number: i, count, score, row, subOptions})
      }
      options.sort((a, b) => a.number - b.number)
      this.startNumber = en + 1;
      this.endNumber += 10;
    },
    removeItem(index) {
      const number = this.options[index].number
      this.numbersOfRegret[1].push(number)
      store.commit('removeNumber', number)
      this.options.splice(index, 1)
    },
    cancel() {
      this.$emit('update:visible', false)
      if (this.numbersOfRegret[0].length !== 0) {
        store.commit('removeNumber', this.numbersOfRegret[0])
      }
      if (this.numbersOfRegret[1].length !== 0) {
        store.commit('addNumber', this.numbersOfRegret[1])
      }
      this.options = _.cloneDeep(this.primaryOptions)
    },
    check() {
      const {
        startNumber: sn, endNumber: en,
        count, title, score,
      } = this;
      if (!title) return '标题不能为空!';
      if (!sn) return '开始题号不能为空!';
      if (!en) return '结束题号不能为空!';
      if (!count) return '每题多少个填空不能为空!';
      if (!score) return '每个空多少分不能为空!';
      if (sn > en) return '起始题号不能大于结束题号!';
      const payload = {sn, en, flag: false}
      store.commit('numberIsOnly', payload)
      if (payload.flag) return '题号有重复!'
    },
    confirm() {
      let {options} = this;
      if (options.length === 0) {
        this.$message({showClose: true, message: '请先添加题目', type: 'error'});
        return;
      }
      const score = options.reduce((pre, cur) => pre + cur.score, 0)
      options.forEach(item => {
        item.sum = item.subOptions.reduce((pre, cur) => {
          return pre + cur.score
        }, 0)
      })
      const contents = this.optionsToContents(options)
      const numbers = options.map(item => item.number)
      const itemScore = options.map(item => item.score)
      store.commit('updateModuleData', {
        dataId: this.dataId,
        data: {
          otherHeight: 26,
          title: this.title,
          count: options.length,
          score, contents, options,
          numbers, itemScore
        },
      })
      this.options = []
      this.$emit('update:visible', false)
    },
    // 填空题题型转换成内容
    optionsToContents(options) {
      const contents = []
      options.forEach(item => {
        contents.push(`<p><strong>第 ${item.number} 题 (${item.score})分</strong></p>`)
        item.subOptions.forEach(() => {
          contents.push(`<p><span style="color: rgb(230,0,0);">${'_'.repeat(62)}</span></p>`)
        })
      })
      return contents
    }
  }
}
</script>

<style lang="scss" scoped>
.option_item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;

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

    .option {
      display: flex;
      width: 80%;
      align-items: center;
    }

    .subOption {
      padding-bottom: 10px;
    }
  }
}
</style>
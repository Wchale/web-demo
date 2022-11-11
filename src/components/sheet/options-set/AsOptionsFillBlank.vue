<template>
  <!-- 填空题对话框开始 -->
  <as-options-dialog :visible.sync="visible"
                     @confirm="confirm"
                     @cancel="cancel"
                     type="添加"
                     title="填空题">
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
      <el-col class="text-center" :span="2">每空占</el-col>
      <el-input-number v-model="row" controls-position="right" :min="1" size="mini"></el-input-number>
      <el-col class="text-center" :span="1">行,</el-col>
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
                <el-col class="text-center" :span="2">第 {{ option.number }} 题</el-col>
                <el-input-number v-model="option.count" @change="handleCount(index)" controls-position="right"
                                 :min="1"
                                 :max="5"
                                 size="mini"></el-input-number>
                <el-col class="text-center" :span="2">个填空,</el-col>
                <el-col class="text-center" :span="2">每空占</el-col>
                <el-input-number v-model="option.row" @change="handleChange('row',index)" controls-position="right"
                                 :min="1"
                                 size="mini"></el-input-number>
                <el-col class="text-center" :span="1">行,</el-col>
                <el-col :span="1">每空</el-col>
                <el-input-number v-model="option.score" @change="handleChange('score',index)"
                                 controls-position="right"
                                 :min="1"
                                 size="mini"></el-input-number>
                <el-col class="text-center" :span="1">分</el-col>
                <el-col class="flex-center" :span="3">
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
                <el-col class="text-center" :span="1"> 分,</el-col>
                <el-col class="text-center" :span="2">占一行</el-col>
                <el-input-number v-model="subOption.width" @change="subOption.width !== 100 && (subOption.row = 1)"
                                 controls-position="right"
                                 :min="1" :max="100"
                                 size="mini"></el-input-number>
                <el-col class="text-center" :span="2">%的宽度,</el-col>
                <el-col class="text-center" :span="1">占</el-col>
                <el-input-number v-model="subOption.row" :disabled="subOption.width !== 100" controls-position="right"
                                 :min="1" :max="100"
                                 size="mini"></el-input-number>
                <el-col :span="1">行</el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </as-options-dialog>
  <!-- 填空题对话框结束 -->
</template>

<script>
import AsOptionsDialog from '@/components/sheet/options-set/AsOptionsDialog.vue'
import AsFillBlank from "@/components/sheet/modules/AsFillBlank";
import store from "@/store";

export default {
  name: 'AsOptionsFillBlank',
  props: {
    visible: Boolean,
    dataId: Number
  },
  components: {AsOptionsDialog},
  data() {
    return {
      sheet: store.state.sheet,
      module: null,
      title: '填空题',
      startNumber: 1,
      endNumber: 10,
      score: 1,
      row: 1,
      count: 1,
      options: [],
    }
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
    handleChange(key, index) {
      const option = this.options[index]
      option.subOptions.forEach(item => {
        item[key] = option[key]
        if (key === 'row' && item.row !== 1) {
          item.width = 100
        }
      })
    },
    removeItem(index) {
      store.commit('removeNumber', this.options[index].number)
      this.options.splice(index, 1)
    },
    cancel() {
      this.$emit('update:visible', false)
      const numbers = this.options.map(item => item.number)
      store.commit('removeNumber', numbers)
      this.options = []
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
      const itemScore = options.map(item => item.score)
      options.forEach(item => {
        item.sum = item.subOptions.reduce((pre, cur) => {
          return pre + cur.score
        }, 0)
      })
      const numbers = options.map(item => item.number)
      const contents = this.optionsToContents(options)
      store.commit('addModuleData', {
        ruleType: 'fillBlank',
        module: AsFillBlank,
        data: {
          otherHeight: 26,
          title: this.title,
          count: options.length,
          score, options, contents,
          numbers, itemScore
        },
      })
      this.options = []
      this.$emit('update:visible', false)
    },
    // 填空题题型转换成内容
    optionsToContents(options) {
      const color = this.sheet.themeColor
      const contents = []
      options.forEach(item => {
        contents.push(`<p><strong>第 ${item.number} 题 (${item.score})分</strong></p>`)
        let str = ''
        let preAllWidth = 0;
        item.subOptions.forEach((subItem, subIndex) => {
          if (subItem.width === 100) {
            for (let i = 0; i < subItem.row; i++) {
              if (i === 0 && item.count !== 1) {
                contents.push(`<p>(${subItem.number}) <span ${color ? 'style = "color: rgb(230,0,0);"' : ''}>${'_'.repeat(Math.floor(subItem.width / 100 * 59))}</span></p>`)
              } else {
                contents.push(`<p><span ${color ? 'style = "color: rgb(230,0,0);"' : ''}>${'_'.repeat(Math.floor(subItem.width / 100 * 62))}</span></p>`)
              }

            }
          } else {
            const preWidth = item.subOptions[subIndex - 1]?.width
            const nextWidth = item.subOptions[subIndex + 1]?.width
            const lineCount = subItem.width / 100 * (62 - item.count * 3);
            if (subIndex === 0 || preWidth === 100 || subItem.width + preAllWidth > 100) {
              str += '<p>'
              preAllWidth = 0
            }
            str += `(${subItem.number}) <span ${color ? 'style = "color: rgb(230,0,0);"' : ''}>${'_'.repeat(Math.ceil(lineCount))}</span> `;
            if (subIndex === item.count - 1 || nextWidth === 100 || subItem.width + nextWidth > 100) {
              str += '</p>'
              contents.push(str)
              str = ''
            }
            preAllWidth += subItem.width
          }
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
      width: 90%;
      align-items: center;
    }

    .subOption {
      padding-bottom: 10px;
    }
  }
}
</style>
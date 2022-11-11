<template>
  <as-options-dialog :visible.sync="visible"
                     @cancel="cancel"
                     @confirm="confirm"
                     title="解答题选项">
    <div class="option_item">
      <span>标题：</span>
      <el-input v-model.trim.lazy="title"
                placeholder="请输入标题"></el-input>
    </div>
    <div class="option_item"
         style="position:relative">
      <span>题号：</span>
      <div style="display: flex;align-items: center;">
        <el-input-number v-model="startNumber"
                         controls-position="right"
                         :min="1"
                         size="mini"></el-input-number>
        <el-col class="text-center"
                :span="1">-
        </el-col>
        <el-input-number v-model="endNumber"
                         controls-position="right"
                         :min="1"
                         size="mini"></el-input-number>
        <el-col class="text-center"
                :span="1">题,
        </el-col>
        <el-col class="text-center"
                :span="2">每题
        </el-col>
        <el-input-number v-model="score"
                         controls-position="right"
                         :min="1"
                         size="mini"></el-input-number>
        <el-col class="text-center"
                :span="2">分
        </el-col>
        <el-col :span="3"
                style="display: flex; justify-content: end;flex: 1;">
          <el-button size="small"
                     type="primary"
                     @click="addObjective">添加
          </el-button>
        </el-col>
      </div>
      <span style="font-size:12px;color: red;position: absolute;bottom: -50%; left: 10%;"
            v-if="startNumber !== '' && endNumber !=='' && startNumber > endNumber">起始题号不能小于终止题号</span>
    </div>
    <div class="review">
      <el-row class="review_item"
              v-for="(item,index) in reviewList"
              :key="index"
              type="flex"
              style="align-items: center">
        <el-col :span="3">第 {{ item.number }} 题</el-col>
        <el-input-number v-model="item.score"
                         controls-position="right"
                         :min="1"
                         size="mini"></el-input-number>
        <el-col :span="1"> 分</el-col>
        <el-col class="flex-center"
                :span="4">
          <el-button @click="removeObjItem(index)"
                     size="small"
                     type="danger"
                     icon="el-icon-delete">删除
          </el-button>
        </el-col>
      </el-row>
    </div>
  </as-options-dialog>
</template>

<script>
import store from '@/store'
import AsOptionsDialog from './AsOptionsDialog.vue'
import _ from 'lodash'

export default {
  name: 'AsFillBlank',
  props: {
    visible: Boolean,
    dataId: Number
  },
  components: {
    AsOptionsDialog,
  },
  data() {
    return {
      sheet: store.state.sheet,
      show: false,
      title: '解答题',
      startNumber: '',
      endNumber: '',
      score: '',
      reviewList: [],
      isContinuity: true,
      comHeight: 155,
      dialogType: '添加',
      module: null,
      primaryOptions: [],
      numbersOfRegret: [
        // 加了又不想加
        [],
        // 删了又不想删
        []
      ],
    }
  },
  async created() {
    this.startNumber = this.reviewList.length === 0 ? 1 : this.reviewList[this.reviewList.length - 1].number + 1
    this.endNumber = this.startNumber + 9
    if (this.dataId === void 0) {
      this.module = (await import('@/components/sheet/modules/AsAnswerQuestion'))[
          'default'
          ]
    } else {
      this.dialogType = '编辑'
      const data = _.cloneDeep(
          this.sheet.moduleData.filter((item) => item.dataId === this.dataId)[0]
              .data
      )
      const {title, list} = data
      this.title = title
      this.reviewList = list
      this.primaryOptions = _.cloneDeep(list)
    }
  },
  methods: {
    addObjective() {
      const error = this.objectiveCheck()
      if (typeof error === 'string') {
        this.$message({
          showClose: true,
          message: error + '不能为空!',
          type: 'error',
        })
        return
      } else if (typeof error === 'boolean' && error) {
        this.$message({
          showClose: true,
          message: '题号有重复,请检查后重新添加!',
          type: 'error',
        })
        return
      }
      for (let i = this.startNumber; i <= this.endNumber; i++) {
        this.reviewList.push({
          number: i,
          score: this.score,
          count: Number(this.count),
          type: this.type,
          show: false,
          content: '<p>' + i + '、</p>',
          delShow: false,
          height: 150,
          flag: i,
          uid: this.$store.state.test.uid,
        })
        store.commit('addUid')
        this.numbersOfRegret[0].push(i)
      }
      this.reviewList.sort((a, b) => a.number - b.number)
      this.startNumber = this.reviewList[this.reviewList.length - 1].number + 1
      this.endNumber = this.startNumber + 9
    },
    removeObjItem(index) {
      const number = this.reviewList[index].number
      if (this.dataId !== void 0) {
        this.numbersOfRegret[1].push(number)
      }
      store.commit('removeNumber', number)
      this.reviewList.splice(index, 1)
    },
    objectiveCheck() {
      if (!this.title) return '标题'
      if (!this.startNumber) return '开始题号'
      if (!this.endNumber) return '结束题号'
      if (!this.score) return '分数'
      if (this.reviewList.length !== 0) {
        return this.reviewList.some(
            item =>
                item.number >= this.startNumber && item.number <= this.endNumber
        )
      }
      const payload = {sn: this.startNumber, en: this.endNumber, flag: false}
      store.commit('numberIsOnly', payload)
      if (payload.flag) return '题号有重复!'
    },
    cancel() {
      this.$emit('update:visible', false)
      if (this.dataId === void 0) {
        const numbers = this.reviewList.map(item => item.number)
        store.commit('removeNumber', numbers)
        this.reviewList = []
      } else {
        if (this.numbersOfRegret[0].length !== 0) {
          store.commit('removeNumber', this.numbersOfRegret[0])
        }
        if (this.numbersOfRegret[1].length !== 0) {
          store.commit('addNumber', this.numbersOfRegret[1])
        }
        this.reviewList = _.cloneDeep(this.primaryOptions)
      }
    },
    confirm() {
      const {reviewList} = this
      if (reviewList.length === 0) {
        this.$message({
          showClose: true,
          message: '请先添加题目',
          type: 'error',
        })
        return
      }
      const score = reviewList.reduce((pre, cur) => pre + cur.score, 0)
      if (this.dataId === void 0) {
        store.commit('addModuleData', {
          ruleType: 'answer',
          module: this.module,
          data: {
            title: this.title,
            list: reviewList,
            otherHeight: 24,
            score,
            count: reviewList.length,
          },
        })
        this.reviewList = []
      } else {
        store.commit('updateModuleData', {
          dataId: this.dataId,
          data: {
            title: this.title,
            list: reviewList,
            otherHeight: 24,
            score,
            count: reviewList.length,
          },
        })
      }
      this.$emit('update:visible', false)
    },
  },
  watch: {
    visible(value) {
      if (value) {
        const len = this.sheet.numbers.length
        this.startNumber = len === 0 ? 1 : this.sheet.numbers[len - 1] + 1
        this.endNumber = this.startNumber + 9
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.option_item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  span {
    display: inline-block;
    min-width: 60px;
    text-align: right;
  }
}

.review {
  width: 100%;
  height: 280px;
  border: 1px solid #bbb;
  border-radius: 6px;
  overflow-y: auto;
  padding: 10px 20px;
  box-sizing: border-box;

  .top {
    padding-bottom: 20px;
  }

  .review_item {
    padding-bottom: 10px;
  }
}
</style>
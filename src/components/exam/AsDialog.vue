<!--选题对话框-->
<template>
  <div class="dialog">
    <el-dialog :visible.sync="visible" title="添加试题" :close-on-click-modal="false"
               :show-close="false"
               custom-class="options_dialog">
      <div class="content">
        <div style="margin-top: 20px" class="choose">
          题型：
          <el-radio-group v-model="topic" size="small" @change="changeTopic(1)">
            <el-radio-button label="单选题"></el-radio-button>
            <el-radio-button label="简答题"></el-radio-button>
            <el-radio-button label="组合题"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="chooseSubject">
          <div class="list" v-for="(item, index) in infoQuestions.list" :key="item.id">
            <!--单选题-->
            <as-options :item="item" :index="index" :is-show="true" :type="topic"
                        v-if="item.entryType.slice(0, 1) === '1'"></as-options>
            <!--组合题-->
            <as-combination :item="item" :index="index" :is-show="true"
                            v-else-if="item.entryType==='4'"></as-combination>
            <!--简答题-->
            <as-answer-question :item="item" :index="index" :is-show="true"
                                v-else-if="item.entryType==='3'"></as-answer-question>
          </div>
        </div>
        <!--分页-->
        <div class="limit">
          <el-pagination
              :hide-on-single-page="limitShow"
              :total="infoQuestions.total"
              :page-size="5"
              @current-change="currentChange"
              layout="prev, pager, next">
          </el-pagination>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="$emit('confirm')">退出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store"
import AsOptions from "@/components/exam/subject/AsOptions";
import AsCombination from "./subject/AsCombination";
import AsAnswerQuestion from "@/components/exam/subject/AsAnswerQuestion";
import {selectAllQuestion} from "@/apis/exam";

export default {
  name: "AsDialog",
  props: {
    visible: {type: Boolean, default: false},
  },
  components: {AsOptions, AsCombination, AsAnswerQuestion},
  data() {
    return {
      topic: '单选题',
      url: store.state.url,
      infoQuestions: {},
      limitShow: false
    }
  },
  methods: {
    //获取第一页的数据
    getInfoQuestion() {
      const entryType = this.choiceType()
      selectAllQuestion({entryType, pageNum: 1}).then(res => {
        this.infoQuestions = res.data.infoQuestions
        if (this.infoQuestions.total <= 5) {
          this.limitShow = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //获取每一页的数据
    changeTopic(pageNum) {
      const entryType = this.choiceType()
      selectAllQuestion({entryType, pageNum}).then(res => {
        this.infoQuestions = res.data.infoQuestions
        if (this.infoQuestions.total <= 5) {
          this.limitShow = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    currentChange(e) {
      this.changeTopic(e)
    },
    choiceType() {
      const topic = this.topic
      if (topic === "单选题") {
        return '1-1'
      } else if (topic === "多选题") {
        return '1-2'
      } else if (topic === "判断题") {
        return '1-3'
      } else if (topic === "双选题") {
        return '1-4'
      } else if (topic === "填空题") {
        return '2'
      } else if (topic === "简答题") {
        return '3'
      } else {
        return '4'
      }
    }
  },
  created() {
    this.getInfoQuestion()
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  .el-dialog__wrapper ::v-deep {
    .el-dialog {
      height: 78%;

      .el-dialog__body::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }

      .el-dialog__body {
        height: 86%;
        padding: 0 20px;
        overflow: hidden;
        overflow-y: auto;

        .content {
          .choose {
            .el-radio-group {
              .el-radio-button {
                margin: 10px;

                .el-radio-button__inner {
                  border-left: 1px solid #DCDFE6;
                  border-radius: 4px;
                  box-shadow: 0 0 0 0 #409eff;
                }
              }
            }
          }

          .limit {
            display: flex;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
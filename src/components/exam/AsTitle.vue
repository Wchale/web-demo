<!--试卷基本信息的显示和隐藏-->
<template>
  <div class="as-title">
    <div class="title">
      <!--主标题-->
      <el-input class="input main_title" v-model.trim.lazy="struct.title.content"
                type="textarea"
                autosize
                @focus="handleFocus(struct.title.content,1)"
                @blur="handleBlur(struct.title.content,1)"/>
      <!--副标题-->
      <el-input class="input sub_title" v-model.trim.lazy="struct.subTitle.content"
                type="textarea"
                autosize
                v-if="struct.subTitle.select"
                @focus="handleFocus(struct.subTitle.content,2)"
                @blur="handleBlur(struct.subTitle.content,2)"/>
    </div>
    <!--试卷信息-->
    <div class="paperInfo"
         v-if="struct.paperInfo.select">
      <el-input class="input main_title" v-model.trim.lazy="struct.paperInfo.content"
                @blur="handleBlurInfo"/>
    </div>
    <!--考生输入-->
    <div class="examineeInput"
         v-if="struct.examineeInput.select">
      <span>{{ this.struct.examineeInput.content }}</span>
    </div>
    <!--试卷介绍-->
    <div class="introduce"
         v-if="struct.introduce.select">
      <el-input class="input" v-model.trim.lazy="struct.introduce.content"
                type="textarea"
                autosize/>
    </div>
  </div>
</template>

<script>
import store from "@/store"

export default {
  name: "AsTitle",
  data() {
    return {
      struct: store.state.paper.optionsData.struct
    }
  },
  methods: {
    //主标题和副标题获取焦点时
    handleFocus(str, flag) {
      //flag === 1 是主标题
      if(flag === 1){
        if(this.struct.title.content === '请输入试卷主标题'){
          this.struct.title.content = ''
        }else {
          this.struct.title.content = str
        }
      }else {
        if(this.struct.subTitle.content === '请输入试卷副标题'){
          this.struct.subTitle.content = ''
        }else {
          this.struct.subTitle.content = str
        }
      }
    },
    //主标题和副标题失去焦点时
    handleBlur(str, flag) {
      //flag === 1 是主标题
      if (flag === 1) {
        if (this.struct.title.content !== '请输入试卷主标题') {
          this.struct.title.content = str
        }
        if(this.struct.title.content === ''){
          this.struct.title.content = '请输入试卷主标题'
        }
      } else {
        if (this.struct.subTitle.content !== '请输入试卷副标题') {
          this.struct.subTitle.content = str
        }
        if (this.struct.subTitle.content === '') {
          this.struct.subTitle.content = '请输入试卷副标题'
        }
      }
    },
    //处理试卷信息
    handleBlurInfo() {
      let count = 0
      let str = this.struct.paperInfo.content;
      let duration
      let score
      //将duration和score的具体数据取出来
      str.replace(/\d+/g, function () {
        if (count === 0) {
          duration = arguments[0]
        } else {
          score = arguments[0]
        }
        count++
      });
      this.struct.paperInfo.duration = duration
      this.struct.paperInfo.score = score
    },
  }
}
</script>

<style lang="scss" scoped>
.as-title {
  display: flex;
  flex-direction: column;
  /*height: 100px;*/
  padding-top: 20px;
  width: 100%;

  .title {
    .input ::v-deep {
      .el-textarea__inner {
        resize: none;
        border: 1px dashed transparent;
        text-align: center;
        color: black;
        padding: 0 20px;
        min-height: 30px !important;
        overflow-y: hidden;
        cursor: pointer;
      }
    }

    .main_title {
      font-size: 18px;
      margin-bottom: 6px;
    }

    .sub_title {
      font-size: 16px;
    }
  }

  .paperInfo {
    .input ::v-deep {
      .el-input__inner {
        border: 1px dashed transparent;
        text-align: center;
        cursor: pointer;
      }
    }
  }

  .examineeInput {
    display: flex;
    justify-content: center;
  }

  .introduce {
    .input ::v-deep {
      .el-textarea__inner {
        resize: none;
        border: 1px dashed transparent;
        cursor: pointer;
        min-height: 30px !important;
        overflow-y: hidden;
        font-size: 10px;
        padding: 0;
        text-align: center;
      }
    }
  }

}
</style>

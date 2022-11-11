<template>
  <div draggable="true" class="as_title">
    <input class="input main_title" :class="{red: sheet.themeColor}" v-model.trim.lazy="sheet.mainTitle"
           @focus="handleFocus('请输入试卷主标题')"
           @blur="handleBlur('请输入试卷主标题')"/>
    <input class="input sub_title" :class="{red: sheet.themeColor}" v-model.trim.lazy="sheet.subTitle"
           @focus="handleFocus('请输入试卷副标题')"
           @blur="handleBlur('请输入试卷副标题')"/>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AsTitle",
  data() {
    return {
      sheet: store.state.sheet,
    }
  },
  created() {
    console.log(this.sheet)
  },
  methods: {
    handleFocus(str) {
      if (this.sheet.mainTitle === str) {
        this.sheet.mainTitle = ''
      } else if (this.sheet.subTitle === str) {
        this.sheet.subTitle = ''
      }
    },
    handleBlur(str) {
      if (this.sheet.mainTitle === '') {
        this.sheet.mainTitle = str
      } else if (this.sheet.subTitle === '') {
        this.sheet.subTitle = str
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.as_title {
  position: absolute;

  .input {
    width: calc(100% - 10px);
    height: 30px;
    border: 1px dashed transparent;
    text-align: center;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    outline: none;
  }

  .main_title.red {
    color: var(--sheet-red);
  }

  .main_title {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .sub_title {
    font-size: 16px;
  }

  .input:hover {
    background-color: rgba(#000, .1);
  }

  .input.red:hover {
    background-color: rgba(#f52020, .1);
  }

  .input:focus {
    border-color: #000;
    background-color: rgba(#000, .1);
  }

  .input.red:focus {
    border-color: var(--sheet-red);
    background-color: rgba(#f52020, .1);
  }
}
</style>
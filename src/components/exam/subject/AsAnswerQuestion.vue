<!--解答题-->
<template>
  <div class="answer-question">
    <div class="add" v-if="isShow">
      <span>{{ index + 1 }}、</span>
      <el-button type="primary" size="small" @click="addTopic">添加</el-button>
    </div>
    <div v-else class="del">
      <span>{{ index + 1 }}、</span>
      <div>
        <el-button size="small" type="danger" @click="del(item.id)">删除</el-button>
      </div>
    </div>
    <div v-html="item.stem"></div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AsAnswerQuestion",
  props: {
    item: Object,
    index: Number,
    isShow: {
      default: false,
      type: Boolean
    },
    questionOrder: {
      default: -1,
      type: Number
    },
    volumeIndex: {
      default: 0,
      type: Number
    }
  },
  mounted() {
    if (this.questionOrder !== -1) {
      this.item.questionOrder = this.questionOrder + 1
    }
  },
  methods: {
    addTopic() {
      store.commit('addTopic', {item: this.item, title: '简答题'})
    },
    del(id) {
      store.commit('delItem', {id, volumeIndex: this.volumeIndex})
      this.$parent.refresh()
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.answer-question {
  margin: 10px 0;

  .add {
    display: flex;

    span {
      flex: 1;
    }
  }

  .del {
    display: flex;

    span {
      flex: 1;
    }
  }

}
</style>
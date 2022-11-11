<template>
  <div class="as-options">
    <!--只有在选题的时候显示添加按钮-->
    <div class="add" v-if="isShow">
      <span>{{ (index === void 0) ? '' : (index + 1) + '、' }}</span>
      <el-button type="primary" size="small" @click="addTopic">添加</el-button>
    </div>
    <!--只有在主页显示删除按钮-->
    <div v-else class="del">
      <span>{{ (index === void 0) ? '' : (index + 1) + '、' }}</span>
      <div v-if="delShow">
        <el-button size="small" type="danger" @click="del(item.id)">删除</el-button>
      </div>
    </div>
    <!--标题-->
    <div v-html="item.stem"></div>
    <!--选项-->
    <div class="options">
      <div class="option" v-if="item.option1">A.<span v-html="item.option1"></span></div>
      <div class="option" v-if="item.option2">B.<span v-html="item.option2"></span></div>
      <div class="option" v-if="item.option3">C.<span v-html="item.option3"></span></div>
      <div class="option" v-if="item.option4">D.<span v-html="item.option4"></span></div>
      <div class="option" v-if="item.option5">E.<span v-html="item.option5"></span></div>
      <div class="option" v-if="item.option6">F.<span v-html="item.option6"></span></div>
      <div class="option" v-if="item.option7">G.<span v-html="item.option7"></span></div>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AsOptions",
  props: {
    item: Object,
    index: Number,
    questionOrder: {
      default: -1,
      type: Number
    },
    isShow: {
      default: false,
      type: Boolean
    },
    type: String,
    delShow: {
      default: false,
      type: Boolean
    },
    volumeIndex: {
      default: 0,
      type: Number
    }
  },
  mounted() {
    //给题目的questionOrder赋值，忘记为什么
    if (this.questionOrder !== -1) {
      this.item.questionOrder = this.questionOrder + 1
    }
  },
  methods: {
    //添加题目
    addTopic() {
      store.commit('addTopic', {item: this.item, title: this.type, id: this.volumeIndex})
    },
    //删除题目
    del(id) {
      this.$confirm('您确定要移除当前试题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.commit('delItem', {id, volumeIndex: this.volumeIndex})
        this.$parent.refresh()
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.as-options {
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

  .options {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .option {
      display: flex;
    }
  }
}
</style>
<template>
  <div class="as_subject_preview">
    <h5 class="title">本次考试共{{ count }}题，总分{{ score }}分</h5>
    <ul>
      <li draggable="true" v-for="(subject,index) in subjects" :key="index"
          @dragstart="dragstart(index)"
          @dragenter.prevent
          @dragover.prevent
          @drop.prevent="drop(index)">
        {{ subject.title }}: 共 {{ subject.count }} 题, 总分 {{ subject.score }} 分
      </li>
    </ul>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AsSubjectPreview",
  data() {
    return {
      sheet: store.state.sheet,
      subjects: [],
      score: 0,
      count: 0,
      dragIndex: -1
    }
  },
  created() {
    const subjects = this.sheet.moduleData.filter(item => !item.disabled).map(item => item.data)
    const result = subjects.reduce((pre, cur) => {
      return {count: pre.count + cur.count, score: pre.score + cur.score}
    }, {count: 0, score: 0})
    this.score = result.score
    this.count = result.count
    this.subjects = subjects
  },
  watch: {
    "sheet.moduleData"(value) {
      const subjects = value.filter(item => !item.disabled).map(item => {
        item.data.dataId = item.dataId
        return item.data
      })
      console.log(value, subjects, 'numberTessssssssssssssssssssssssssssssssss')
      const result = subjects.reduce((pre, cur) => {
        return {count: pre.count + cur.count, score: pre.score + cur.score}
      }, {count: 0, score: 0})
      this.score = result.score
      this.count = result.count
      this.subjects = subjects
    }
  },
  methods: {
    dragstart(index) {
      this.dragIndex = index;
    },
    drop(index) {
      if (this.dragIndex !== index) {
        const sourceId = this.subjects[this.dragIndex].dataId
        const targetId = this.subjects[index].dataId
        store.commit('replacePosModuleData', {sourceId, targetId})
        const drag = this.subjects.splice(this.dragIndex, 1)
        this.subjects.splice(index, 0, ...drag)
        store.commit('executeRule')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.as_subject_preview {
  .title {
    margin-bottom: 10px;
  }

  li {
    font-size: 12px;
    width: 100%;
    background-color: var(--primary-color);
    color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 12px 10px 12px;
    cursor: move;
    margin-bottom: 5px;
    user-select: contain;

    &:hover {
      background-color: #7ea9f8;
    }

    &:active {
      background-color: #5584dd;
    }

    span {
      user-select: text;
    }
  }
}

</style>

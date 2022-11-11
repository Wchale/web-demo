<template>
  <as-module-layout :title="data.title"
                    @edit="visible = true"
                    :dataId="dataId">
    <div class="content"
         :style="{borderColor:(sheet.themeColor?'red':'black')}"
         v-for="(item, index) in list.options"
         :key="index">
      <div v-show="item.height >= 20">
        <template class="template">
          <!-- 文本框 wrap -->
          <div ref="rTextareaWrap"
               class="drag-textarea"
               :style="{height:(item.height ?(item.height+'px'):'150px'),borderColor:(sheet.themeColor?'red':'black')}"
               @mouseenter="mouseenter(index)"
               @mouseleave="mouseleave(index)">
            <!-- 文本框 -->
            <!-- 类名不能变，quill自带的类名，固定位置，否则会出现样式问题 -->
            <div class="seat ql-container ql-snow"
                 :style="{borderColor:(sheet.themeColor?'var(--sheet-red)':'black')}"
                 v-show="!item.show">
              <section v-html="item.content"
                       class=" ql-editor"></section>
            </div>
            <el-button v-show="delShow && item.delShow && !item.show && item.height>40"
                       icon="el-icon-delete"
                       class="del"
                       @click="del(index)"
                       circle></el-button>
            <el-button icon="el-icon-edit"
                       circle
                       class="edit"
                       v-show="delShow && item.delShow && !item.show && item.height>40"
                       @click="changeShow(item.show, index)"></el-button>
            <el-button type="text" class="qid">{{item.number}}</el-button>

            <!-- 辅助线(用于调整文本框高度) -->
            <div ref="rResizeLine"
                 class="resize-line"
                 :style="{borderColor:(sheet.themeColor?'var(--sheet-red)':'black'),backgroundColor:'#fff'}"
                 @mousedown="handleMouseDown($event, index)"></div>
            <div v-show="item.show"
                 class="quill_editor">
              <quill-editor ref="myLQuillEditor"
                            v-model="item.content"
                            :options="editorOption"
                            :style="{height:(item.height+3)+'px', width:'100%'}"
                            class="editor"
                            @blur="onEditorBlur"
                            @ready="onEditorReady"
                            @focus="onEditorFocus($event, index)"
                            @change="onEditorChange($event, index)"></quill-editor>
              <el-button icon="el-icon-close"
                         circle
                         class="close"
                         @click="changeShowClose(item.show, index)"></el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
    <as-options-answer v-if="data.title" :visible.sync="visible" :dataId="dataId"></as-options-answer>
  </as-module-layout>
</template>

<script>
import store from '../../../store'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor, Quill} from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
import Vue from 'vue'
import AsModuleLayout from './AsModuleLayout.vue'
import {ruleSet} from "@/utils";
import AsOptionsAnswer from '@/components/sheet/options-set/AsOptionsAnswer.vue'
// import AsAnswerQuestion from './AsAnswerQuestion.vue'
// import AsObjectiveEdit from '@/components/options-set/AsObjectiveEdit'
import _ from 'lodash'
// import AsAnswerQuestion from './AsAnswerQuestion.vue'

Quill.register('modules/imageResize', ImageResize)

// 工具栏配置项
const toolbarOptions = [
  // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
//   [{header: [1, 2, 3, 4, 5, 6, false]}],
  ['bold', 'italic', 'underline', 'strike'],
  // 引用  代码块-----['blockquote', 'code-block']
  // ['blockquote', 'code-block'],
  //   ['blockquote'],
//   1、2 级标题-----[{ header: 1 }, { header: 2 }]
//   [{ header: 1 }, { header: 2 }],
  //   [{header: 1}, {header: 2}],
  // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  //   [{list: 'ordered'}, {list: 'bullet'}],
  // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  //   [{ script: 'sub' }, { script: 'super' }],
  // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  //   [{indent: '-1'}, {indent: '+1'}],
  // 文本方向-----[{'direction': 'rtl'}]
  //   [{direction: 'rtl'}],
  // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  //   [{size: ['small', false, 'large', 'huge']}],
  // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  //   [{header: [1, 2, 3, 4, 5, 6, false]}],
  // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{color: []}],
  // 字体种类-----[{ font: [] }]
  //   [{ font: [] }],
  // 对齐方式-----[{ align: [] }]
  [{align: []}],
  // 清除文本格式-----['clean']
  ['clean'],
  // 链接、图片、视频-----['link', 'image', 'video']
  ['image'],
  //   ['image', 'video'],
  // 自定义按钮
  //  ['insertMetric'],
]

export default {
  name: 'AsAnswerQuestion',
  components: {quillEditor, AsModuleLayout, AsOptionsAnswer},
  props: {
    data: Object,
    derivation: Array,
    uid: String,
    dataId: Number,
  }, //dataId:  控制当前页面下标
  data() {
    return {
      delShow: true,
      sheet: store.state.sheet,
      list: {},
      editData: {},
      MinHeight: 90,
      myindex: 0,
      height: 0,
      visible: false,
      start: 0,
      end: 0,
      currentLength: 0,
      nextLength: 0,
      modules: [],
      contentHtml: '',
      // headHeight:318
      // 富文本
      content: '',
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions,
            // handlers: {
            //     insertMetric: this.showHandle
            // }
          },
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white',
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
          // ImageExtend:{
          //     name: "img", // 图片参数名
          //     //  size: 1, // 可选参数 图片大小，单位为M，1M = 1024kb
          // }
        },
        theme: 'snow',
        placeholder: '请输入正文',
      },
    }
  },
  created() {
    console.log(this.sheet.moduleData[2].data.list);
    console.log(this.sheet.moduleData);
  },
  methods: {
    // 删除按钮显示
    mouseenter(index) {
      Vue.set(this.data.list[index], 'delShow', true)
      this.$forceUpdate()
    },
    // 删除按钮隐藏
    mouseleave(index) {
      Vue.set(this.data.list[index], 'delShow', false)
      this.$forceUpdate()
    },
    // 删除元素
    del(index) {
      this.myindex = index
      let count = this.count()

      let j = 0
      for (; j < this.sheet.moduleData.length; j++) {
        if (this.sheet.moduleData[j].dataId === this.dataId) {
          break
        }
      }
      this.upData(j)

      store.commit('removeNumber', this.data.list[index].number)
      this.$delete(this.sheet.moduleData[j].data.list, count)
      this.$delete(this.data.list, index)

      this.upDateModuleData()
    },
    // =====================================================
    // 控制富文本的显示与隐藏
    changeShow(show, index) {
      this.myindex = index
      this.delShow = false
      Vue.set(this.data.list[index], 'show', true)
    },

    // 关闭富文本之后的逻辑处理，换栏换页，内容迁移
    changeShowClose(show, index) {
      this.myindex = index
      this.delShow = true
      this.data.list[index].show = false

      let j = 0
      for (; j < this.sheet.moduleData.length; j++) {
        if (this.sheet.moduleData[j].dataId === this.dataId) {
          break
        }
      }
      const count = this.count()
      console.log(count);
      console.log(this.sheet.moduleData[j].data.list);
      //   this.sheet.moduleData[j].data.list[count].show = false
      const lastTop = this.upData(j)
      let myData = _.cloneDeep(this.sheet.moduleData[j]?.data)
      myData.direction = true
      myData.list[count].show = false
      const result = ruleSet[this.sheet.moduleData[j].ruleType](lastTop, myData)
      let myModuleData = []
      result.forEach(item => {
        // console.log(item);
        myModuleData = _.concat(myModuleData, item.data.list)
        // console.log(myModuleData);
      })
      this.sheet.moduleData[j].data.list = _.cloneDeep(myModuleData)


      const data = this.sheet.moduleData[j].data;
      data.score = data.list.reduce((pre, cur) => pre + cur.score, 0)
      const temp = []
      for (let i = 0; i < data.list.length; i++) {
        temp.push(data.list[i].number)
      }
      data.count = _.union(temp).length
      const obj = {
        dataId: this.dataId,
        data: this.sheet.moduleData[j].data,
      }

      store.commit('updateModuleData', obj)

      this.$forceUpdate()
    },
    // 失去焦点事件
    onEditorBlur(e) {
      e
      //   console.log('onEditorBlur: ', e)
    },
    // 开始，只执行一次
    onEditorReady(e) {
      e
      // console.log("onEditorReady", e);
    },
    // 获得焦点事件
    onEditorFocus(e, index) {
      //   Vue.set(this.list.options[index], 'show', !show)
      let count = this.count()

      this.myindex = index
      console.log(this.height);
      console.log(count, this.myindex);
      let j = 0
      for (; j < this.sheet.moduleData.length; j++) {
        if (this.sheet.moduleData[j].dataId === this.dataId) {
          console.log(this.sheet.moduleData[j].data.list);
          this.height = this.sheet.moduleData[j].data.list[count].height
        }
      }
    },
    // 内容改变事件
    onEditorChange(e, index) {
      setTimeout(() => {
        let a = document.getElementsByClassName('ql-editor')
        let count = this.count()
        let count2 = this.count2()
        console.log(a, count2);
        let pre = 0
        let blot = 0
        for (let i = 0; i <= count2 * 2 + 1; i++) {
          if (a[i]._prevClass != void 0) {
            pre++
          }
          if (a[i].__blot != void 0) {
            blot++
          }
        }
        console.log(pre, blot, pre - blot);
        // 因为填空题和解答题使用的是同一个富文本组件，所以a里面包含的是填空题和解答题，但是填空题只有一个属性，解答题有两个属性
        // 通过blot和pre计算出有几个填空题，有几个解答题，算出差
        let q = blot - pre
        let b = a[count2 * 2 + 1 + q].childNodes
        let allComHeight = 0
        b.forEach((item) => {
          allComHeight = allComHeight + (item.scrollHeight > 0 ? item.scrollHeight : 17)
        })
        allComHeight += 18
        let j = 0
        if (this.data.list[index].height > allComHeight) {
          Vue.set(this.data.list[index], 'height', this.data.list[index].height)
          for (; j < this.sheet.moduleData.length; j++) {
            if (this.sheet.moduleData[j].dataId === this.dataId) {
              console.log(index, count);
              console.log(this.sheet.moduleData[j].data.list);
              console.log(this.data.list);
              this.sheet.moduleData[j].data.list[count].height =
                  this.data.list[index].height
              break
            }
          }
        } else {
          Vue.set(this.data.list[index], 'height', allComHeight + 20)
          for (; j < this.sheet.moduleData.length; j++) {
            if (this.sheet.moduleData[j].dataId === this.dataId) {
              this.sheet.moduleData[j].data.list[count].height =
                  allComHeight + 30
              break
            }
          }
        }
        for (let x = 0; x < this.modules.length; x++) {
          if (this.modules[x].uid === this.uid) {
            this.modules[x].data.list[this.myindex].content = e.html
            break
          }
        }
        this.$forceUpdate()
      }, 50)
    },

    // ============================================================
    // 拖动
    /**
     * 处理鼠标按下事件
     *
     * @param {MouseEvent} 鼠标事件
     */
    handleMouseDown(event, index) {
      const {rTextareaWrap, rResizeLine} = this.$refs
      console.clear()
      console.log('%c add1:', 'font-size: 20px;color:orange',this.sheet.moduleData[3].data.list)
      //   重置allHeight为0
      this.allHeight = 0
      //   如果是第一页allHeight就加上头高度
      if (this.dataId === 0) {
        this.allHeight = this.headHeight
      }
      //   计算当前页所有组件的高度,减去最后一个滚动条的高度
      for (var i = 0; i < rTextareaWrap.length; i++) {
        this.allHeight += rTextareaWrap[i].clientHeight + rResizeLine[i].clientHeight
        // this.allHeight +=
        if (i === rTextareaWrap.length - 1) {
          this.allHeight -= 10
        }
      }
      console.log('计算当前页所有组件的高度,减去最后一个滚动条的高度:', this.allHeight)
      // 禁止用户选择网页中文字
      document.onselectstart = () => false
      // 禁止用户拖动元素
      document.ondragstart = () => false
      // 保存鼠标最后移动的位置（Y轴）
      this.dragState = {
        // 鼠标开始移动的位置（Y轴）
        startMouseTop: event.clientY,
        // 鼠标最后移动的位置（Y轴）
        endMouseTop: event.clientY,
      }
      this.myindex = index
      // 绑定鼠标移动事件
      document.addEventListener('mousemove', this.handleMouseMove)
      // 绑定鼠标放开事件
      document.addEventListener('mouseup', this.handleMouseUp)
    },

    /**
     * 处理鼠标移动事件
     *
     * @param {MouseEvent} 鼠标事件
     */
    handleMouseMove(event) {
      const {rTextareaWrap, rResizeLine} = this.$refs
      // 获取鼠标最后移动的位置（Y轴）
      const {endMouseTop} = this.dragState
      // 获取当前的文本框高度
      //   console.log(this.data.list);
      //   console.log(this.myindex, rTextareaWrap);
      // console.log(this.myindex, this.data.list);
      const oldTextAreaHeight =
          rTextareaWrap[this.myindex].getBoundingClientRect().height
      // 新的文本框高度
      let newTextAreaHeight = 0
      // 计算鼠标移动的距离
      var distance = Math.abs(
          parseInt(((endMouseTop - event.clientY) * 100).toString(), 10) / 100
      )
      // 若鼠标向上移动
      if (endMouseTop > event.clientY) {
        rResizeLine[this.myindex].style.cursor = 's-resize'
        // 发送框高度达到最大
        if (oldTextAreaHeight <= this.MinHeight) {
          // 修改光标为可被向下移动
          rResizeLine[this.myindex].style.cursor = 's-resize'
          return false
        }
        //   兼容鼠标快速拖动的情况：新的发送框高度不能小于最小值
        // 计算新的发送框高度
        newTextAreaHeight = oldTextAreaHeight - distance
        if (newTextAreaHeight < this.MinHeight) {
          newTextAreaHeight = this.MinHeight
          distance = oldTextAreaHeight - newTextAreaHeight
        }
        this.allHeight -= distance
      }
      // 若鼠标向下移动
      else {
        rResizeLine[this.myindex].style.cursor = 'n-resize'
        // 计算新的发送框高度
        newTextAreaHeight = oldTextAreaHeight + distance
        this.allHeight += distance
      }
      if (
          rTextareaWrap[this.myindex].clientHeight >=
          this.data.list[this.myindex].height
      ) {
        rResizeLine[this.myindex].style.cursor = 'n-resize'
      } else {
        rResizeLine[this.myindex].style.cursor = 's-resize'
      }
      // 修改发送框高度
      rTextareaWrap[this.myindex].style.height = newTextAreaHeight + 'px'
      // 更新鼠标最后移动的位置（Y轴）
      this.dragState.endMouseTop = event.clientY
    },

    /**
     * 处理鼠标放开事件
     */
    handleMouseUp() {
      // 移除鼠标移动事件
      document.removeEventListener('mousemove', this.handleMouseMove)
      // 移除鼠标放开事件
      document.removeEventListener('mouseup', this.handleMouseUp)
      // 允许用户选择网页中文字
      document.onselectstart = null
      // 允许用户拖动元素
      document.ondragstart = null
      // 调用换栏换页处理函数
      this.add()
    },
    count() {
      let o = 0
      for (; o < this.modules.length; o++) {
        if (this.modules[o].module.name === 'AsAnswerQuestion') {
          break
        }
      }
      let m = 0
      for (; m < this.modules.length; m++) {
        if (this.modules[m].uid === this.uid) {
          break
        }
      }
      let count = 0
      for (; o < m; o++) {
        if (this.modules[o].dataId !== void 0 && this.dataId === this.modules[o].dataId && this.modules[o].module.name === 'AsAnswerQuestion') {
          count = count + this.modules[o].data.list.length
        }
      }
      count += this.myindex
      return count
    },
    count2() {
      let o = 0
      for (; o < this.modules.length; o++) {
        if (this.modules[o].module.name === 'AsAnswerQuestion') {
          break
        }
      }
      let m = 0
      for (; m < this.modules.length; m++) {
        if (this.modules[m].uid === this.uid) {
          break
        }
      }
      let count = 0
      for (; o < m; o++) {
        if (this.modules[o].module.name === 'AsAnswerQuestion') {
          console.log(this.modules[o].data.list.length);
          count = count + this.modules[o].data.list.length
        }
      }
      console.log(count, this.myindex);
      count += this.myindex
      return count
    },
    startAndEnd(j) {
      for (let x = 0; x < this.sheet.moduleData[j].data.list.length; x++) {
        if (this.data.list[0].uid === this.sheet.moduleData[j].data.list[x].uid) {
          this.start = x
        }
        if (this.data.list[this.data.list.length - 1].uid === this.sheet.moduleData[j].data.list[x].uid) {
          this.end = x
        }
      }
      this.currentLength = this.end - this.start + 1
    },
    upData(j) {
      const {rTextareaWrap} = this.$refs
      let myModules = _.cloneDeep(this.modules)
      let lastTop = 0
      let listData = []
      for (let y = 0; y < this.modules.length; y++) {
        if (this.modules[y].dataId === this.dataId) {
          lastTop = this.modules[y].top
        }
      }
      for (let y = 0; y < this.modules.length; y++) {
        if (this.modules[y].dataId === this.dataId) {
          listData = _.concat(listData, this.modules[y])
        }
      }
      let x = 0
      for (; x < this.modules.length; x++) {
        if (this.modules[x].dataId === this.dataId) {
          lastTop = this.modules[x].top
          break
        }
      }
      let z = x
      for (; z < this.modules.length; z++) {
        if (this.modules[z].dataId !== this.dataId) {
          break
        }
      }
      myModules = myModules.slice(x, z)
      myModules.forEach(item => {
        if (rTextareaWrap != void 0 && item.uid === this.uid) {
          item.data.list[this.myindex].height = rTextareaWrap[this.myindex].clientHeight
        }
      })
      let moduleData2 = []
      myModules.forEach(item => {
        moduleData2 = _.concat(moduleData2, item.data.list)
      })
      this.sheet.moduleData[j].data.list = _.cloneDeep(moduleData2)
      return lastTop
    },
    upDateModuleData() {
      let j = 0
      for (; j < this.sheet.moduleData.length; j++) {
        if (this.sheet.moduleData[j].dataId === this.dataId) {
          break
        }
      }
      const data = this.sheet.moduleData[j].data;
      data.score = data.list.reduce((pre, cur) => pre + cur.score, 0)
      const temp = []
      for (let i = 0; i < data.list.length; i++) {
        temp.push(data.list[i].number)
      }
      data.count = _.union(temp).length
      const obj = {
        dataId: this.dataId,
        data: this.sheet.moduleData[j].data,
      }

      console.log(this.sheet.moduleData[j].data.list);
      store.commit('updateModuleData', obj)
      this.$forceUpdate()
    },
    add() {
      const {rTextareaWrap, rResizeLine} = this.$refs
      //   找到当前题型对应的moduleData中的下标
      let j = 0
      for (; j < this.sheet.moduleData.length; j++) {
        if (this.sheet.moduleData[j].dataId === this.dataId) {
          break
        }
      }
      //   如果j等于moduleData的长度，表示没有当前题型
      if (j === this.sheet.moduleData.length) {
        return
      }
      console.log('%c add1:', 'font-size: 20px;color:green',j,this.sheet.moduleData[j].data.list)
      this.data.list[this.myindex].height = rTextareaWrap[this.myindex].clientHeight
      let direction = true
      if (rResizeLine[this.myindex].style.cursor == 's-resize') {
        direction = false
      }
      let lastTop = this.upData(j)
      // 637
      let myData = _.cloneDeep(this.sheet.moduleData[j]?.data)
      myData.direction = direction
      const result = ruleSet[this.sheet.moduleData[j].ruleType](lastTop, myData)
      console.log('%c result:', 'font-size: 20px;color:pink', myData, result)
      let myModuleData = []
      result.forEach(item => {
        myModuleData = _.concat(myModuleData, item.data.list)
      })
      this.sheet.moduleData[j].data.list = _.cloneDeep(myModuleData)
      const data = this.sheet.moduleData[j].data;
      data.score = data.list.reduce((pre, cur) => pre + cur.score, 0)
      const temp = []
      for (let i = 0; i < data.list.length; i++) {
        temp.push(data.list[i].number)
      }
      data.count = _.union(temp).length
      const obj = {
        dataId: this.dataId,
        data: this.sheet.moduleData[j].data,
      }
      console.log('%c add2:', 'font-size: 20px;color:green',j,this.sheet.moduleData[j].data.list)
      store.commit('updateModuleData', obj)
      console.log('%c add3:', 'font-size: 20px;color:green',j,this.sheet.moduleData[j].data.list)
    }
  },
  mounted() {
    this.modules = _.cloneDeep(this.sheet.modules)
    let j = 0
    for (; j < this.sheet.moduleData.length; j++) {
      if (this.sheet.moduleData[j].dataId === this.dataId) {
        break
      }
    }
    this.upData(j)
  },
  watch: {
    data: {
      immediate: true,
      handler(value) {
        const objective = this.list
        value.title && (objective.title = value.title)
        objective.options = _.flatten(value.list)
        this.$forceUpdate()
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.as_answer {
  position: absolute;
}

.drag-textarea {
  height: 150px;
  position: relative;
  margin-top: -1px;
  margin-bottom: 4px;
}

.drag-textarea .resize-line {
  height: 8px;
  cursor: move;
  border: 1px solid #333;
  border-top: 0;
  background-color: #333;
  z-index: 999;
}

.drag-textarea .seat {
  width: 100%;
  /* 重点属性 */
  height: calc(100% - 5px);
  padding: 0;
  border: 1px solid #333;
  resize: none;
  border-bottom: 0;
  overflow-y: hidden;
}

.drag-textarea .edit {
  position: absolute;
  right: 10px;
  top: 5px;
  border: 0;
}
.drag-textarea .qid {
  position: absolute;
  right: 15px;
  bottom: 0;
  color: #ef4c4c;
  font-size: 18px;
  font-style: oblique;
  opacity: .5;
}

.editor {
  height: 500px;
  top: -90px;
  position: absolute;
  background-color: #fff;
  margin-top: 40px;
}

.quill_editor {
  position: relative;
}

.close {
  z-index: 999;
  color: red;
  position: absolute;
  top: -48px;
  border: 0;
  right: 20px;
}

.del {
  position: absolute;
  top: 5px;
  right: 60px;
  border: 0;
}

.title {
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 5px;
  position: relative;

  &:hover {
    .actions {
      display: block;
    }
  }

  .actions {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
  }
}

::v-deep .ql-editor {
  overflow-y: inherit;
  padding-top: 10px;
}
</style>

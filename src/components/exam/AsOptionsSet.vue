<!--试卷设置-->
<template>
  <div class="options-set">
    <div class="title">
      <span>试卷结构</span>
    </div>
    <hr/>
    <!--试卷基本信息-->
    <div class="options">
      <table>
        <tr v-for="(item, index) of optionsData.struct" :key="index">
          <el-checkbox v-model="item.select" @change="changeSelect(item)"
                       :disabled="item.disable">{{ item.name }}
          </el-checkbox>
        </tr>
      </table>
    </div>
    <!--分栏-->
    <div class="limit-volume">
      <div class="title">
        <span>页面布局</span>
      </div>
      <div class="limit-option">
        <el-radio v-for="(item, index) in paper.pageSize" :key="index" @change="limitChange(count)" v-model="count" :label="item.count">{{item.name}}</el-radio>
      </div>
    </div>
    <!--分卷-->
    <div class="addVolume" @click="addVolume">
      <i class="el-icon-plus"></i><span>新增分卷</span>
    </div>
    <div class="title">
      <span>试卷试题</span><i class="el-icon-close" @click="clear()"></i>
    </div>
    <hr/>
    <!--所有题目信息-->
    <div class="volume" v-for="(item2, volumeIndex) in paper.volume" :key="volumeIndex">
      <div class="volume_title">
        <span>{{ item2.title }}</span><i class="el-icon-close" @click="clearVolume(volumeIndex,item2.title)"></i>
      </div>
      <!--分卷拖动切换顺序-->
      <div class="topic-list" v-for="(item, index) in item2.partTopicsDtoList" :key="index"
           draggable="true"
           @dragstart="dragstart(volumeIndex, index)"
           @dragenter.prevent
           @dragover.prevent
           @drop.prevent="drop(volumeIndex, index)"
      >
        <div class="list-title">
          <span>{{ item.partTopicsMainTitle }}（{{ item.infoQuestionList.length }}题）</span>
          <i class="el-icon-close" @click="del(volumeIndex, item, index)"></i>
        </div>
        <!--题型拖动切换顺序-->
        <div class="item-box">
          <div class="item" v-for="(obj, index2) in item.infoQuestionList" :key="obj.id"
               draggable="true"
               @dragstart.stop="dragstart2(volumeIndex, index, index2)"
               @dragenter.prevent.stop
               @dragover.prevent.stop
               @drop.prevent.stop="drop2(volumeIndex, index, index2)">
            <div class="box">{{ getIndex(volumeIndex, index, index2) + 1 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store"
import _ from 'lodash'

export default {
  name: "AsOptionsSet",
  data() {
    return {
      optionsData: store.state.paper.optionsData,
      paper: store.state.paper,
      dragIndex: -1,
      dragIndex2: -1,
      count:store.state.paper.count
    }
  },
  watch:{
    //监听count，换了页面布局就全局重新渲染数据
    "count"(value){
      console.log(value,"aa")
    }
  },
  methods: {
    addVolume() {
      store.commit('addVolume')
    },
    //切换页面布局
    limitChange(count){
      this.count = count
      store.commit('changeCount', this.count)
    },
    changeSelect(){
      store.commit('addAA')
    },
    //计算题号
    getIndex(volumeIndex, index, index2) {
      let count = 0;
      for (let i = 0; i < index; i++) {
        count += this.paper.volume[volumeIndex].partTopicsDtoList[i].infoQuestionList.length
      }
      count += index2
      return count
    },
    //清空某一分卷全部试题
    clearVolume(volumeIndex, title) {
      this.$confirm('您确定要移除' + title + '全部试题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.paper.volume.length > 1) {
          _.pullAt(this.paper.volume, volumeIndex);
          store.commit('allScore')
          this.$parent.refresh()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '至少保留一个分卷!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //删除某一题型全部试题
    del(volumeIndex, item) {
      this.$confirm('您确定要移除' + item.partTopicsMainTitle + '全部试题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _.pull(this.paper.volume[volumeIndex].partTopicsDtoList, item)
        store.commit('allScore')
        this.$parent.refresh()
        // this.$forceUpdate()
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
    },
    //清除全部试题
    clear() {
      this.$confirm('您确定要移除全部试题吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.paper.volume.length = 0
        store.commit('addVolume')
        store.commit('allScore')
        this.$parent.refresh()
        // this.$forceUpdate()
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
    },
    //保存拖动的组件的下标
    dragstart(volumeIndex, index) {
      this.dragIndex = index
    },
    //处理换位置逻辑
    drop(volumeIndex, index) {
      //如果dragIndex === -1 说明拖动有误，直接返回
      if (this.dragIndex === -1) {
        return
      }
      //初始index小于最后落地index，说明向下拖动了
      if (this.dragIndex < index) {
        let obj = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[this.dragIndex])
        let i = this.dragIndex
        //换位置，后面的item都往前移一个单位
        for (; i < index; i++) {
          this.paper.volume[volumeIndex].partTopicsDtoList[i] = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[i + 1])
        }
        //将拖动的这个item给到最后落地的位置
        this.paper.volume[volumeIndex].partTopicsDtoList[i] = _.cloneDeep(obj)
        //重新渲染
        this.$parent.refresh()
      }
      //初始index大于最后落地index，说明向上拖动了
      if (this.dragIndex > index) {
        let obj = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[this.dragIndex])
        let i = this.dragIndex
        //换位置，前面的item都往后移一个单位
        for (; i > index; i--) {
          this.paper.volume[volumeIndex].partTopicsDtoList[i] = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[i - 1])
        }
        //将拖动的这个item给到最后落地的位置
        this.paper.volume[volumeIndex].partTopicsDtoList[i] = _.cloneDeep(obj)
        //重新渲染
        this.$parent.refresh()
      }
    },
    //处理题型换位置，和分卷拖动换位置一样
    dragstart2(volumeIndex, index, index2) {
      this.dragIndex2 = index2
    },
    drop2(volumeIndex, index, index2) {
      if (this.dragIndex2 === -1) {
        return
      }
      if (this.dragIndex2 < index2) {
        let obj = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[this.dragIndex2])
        let i = this.dragIndex2
        for (; i < index2; i++) {
          this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[i] = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[i + 1])
        }
        this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[i] = _.cloneDeep(obj)
        this.$parent.refresh()
        // this.$forceUpdate()
      }
      if (this.dragIndex2 > index2) {
        let obj = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[this.dragIndex2])
        let i = this.dragIndex2
        for (; i > index2; i--) {
          this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[i] = _.cloneDeep(this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[i - 1])
        }
        this.paper.volume[volumeIndex].partTopicsDtoList[index].infoQuestionList[i] = _.cloneDeep(obj)
        this.$parent.refresh()
        // this.$forceUpdate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.options-set {
  /*position: sticky;*/
  position: fixed;
  top: 180px;
  width: 16%;
  right: 0;
  background-color: white;
  height: 80vh;

  .title {
    display: flex;
    align-items: center;
    height: 5%;
    /*background-color: #009688;*/
    span {
      flex: 1;
      font-weight: 700;
      padding-left: 10px;
    }

    i {
      padding-right: 20px;
      font-size: 25px;
      cursor: pointer;
    }
  }

  .addVolume {
    margin-left: 10px;
    cursor: pointer;

    i {
      font-size: 14px;
    }

    span {
      font-size: 14px;
    }
  }

  .options {
    padding: 10px 20px;

    table {
      display: flex;
      flex-wrap: wrap;

      tr {
        width: 33%;
      }
    }
  }

  .limit-volume {
    .limit-option {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      margin-right: 10px;
    }
  }

  .volume {
    .volume_title {
      display: flex;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;

      span {
        flex: 1;
        font-size: 15px;
        font-weight: 700;
      }

      i {
        cursor: pointer;
      }
    }

    .topic-list {
      padding: 0 20px;
      box-sizing: border-box;
      cursor: move;

      .list-title {
        display: flex;
        font-size: 14px;

        span {
          flex: 1;
        }

        i {
          cursor: pointer;
        }
      }

      .item-box {
        display: flex;
        flex-wrap: wrap;

        .item {
          cursor: pointer;
          /*flex: 1;*/
          margin: 5px 10px;

          .box {
            width: 20px;
            text-align: center;
            line-height: 20px;
            height: 20px;
            border: 1px solid #409eff;
          }
        }
      }
    }
  }
}
</style>
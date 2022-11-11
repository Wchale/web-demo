<!--首页-->
<template>
  <div class="home" :key="aa">
    <as-header>
      <div slot="header">
        <el-button type="danger" @click="gotoManager">管理试卷</el-button>
      </div>
    </as-header>
    <div class="options">
      <div class="options_div">
        <span>{{ paper.allTopicNum }}道试题</span>
        <el-button type="primary" @click="dialogShow = true">选择题目</el-button>
        <el-button type="primary" @click="preservation">保存试卷</el-button>
      </div>
    </div>
<!--    中间试卷部分-->
    <div class="content">
<!--      paperWidth控制有多少个页面，columnCount控制每页的分栏数量-->
      <div class="paper" v-for="paperIndex in paperWidth" :key="paperIndex" :style="{height:height + 'cm',width:width+'cm', columnCount:count}">
        <as-title></as-title>
        <div class="volume" v-for="(item2, i) in paper.volume" :key="i">
          <div class="volume_title">
            <el-input class="input" v-model.trim.lazy="item2.title"
                      type="textarea"
                      autosize/>
            <div class="beCareful"
                 v-if="struct.beCareful.select">
              <div>注意事项：</div>
              <el-input class="input" v-model.trim.lazy="struct.beCareful.content"
                        type="textarea"
                        autosize/>
            </div>
          </div>
          <div class="list" v-for="(item, index) in item2.partTopicsDtoList" :key="index">
            <div class="list-title">
              <span>{{ item.partTopicsMainTitle }}</span>
              <el-input class="input" v-model.trim.lazy="item.partTopicsSubTitle"
                        type="textarea"
                        autosize/>
            </div>
            <div class="item" v-for="(obj, index2) in item.infoQuestionList" :key="obj.id">
              <!--
                选择题
                index：题号
                question-order：未知
                volume-index：
                item：每道题目的对象
                del-show：控制删除按钮的显示与隐藏，这里是必须显示
                整个组件通过题目类型显示和隐藏
              -->
              <as-options :question-order="getIndex(i,index, index2)" :volume-index="i" :item="obj"
                          :index="getIndex(i,index, index2)" :del-show="true"
                          v-if="obj.entryType.slice(0, 1) === '1'"></as-options>
              <!--组合题-->
              <as-combination :question-order="getIndex(i,index, index2)" :volume-index="i" :item="obj"
                              :index="getIndex(i, index, index2)" v-else-if="obj.entryType==='4'"></as-combination>
              <!--简答题-->
              <as-answer-question :question-order="getIndex(i,index, index2)" :volume-index="i" :item="obj"
                                  :index="getIndex(i,index, index2)"
                                  v-else-if="obj.entryType==='3'"></as-answer-question>
            </div>
          </div>
        </div>
      </div>
      <!--
        界面右边的选项设置区域
        key：重新渲染
      -->
      <as-options-set :key="asOptionsSetKey" class="options_set"></as-options-set>
    </div>
    <!--
      选题对话框
    -->
    <as-dialog :visible.sync="dialogShow" @confirm="confirm"></as-dialog>
  </div>
</template>

<script>
  // @ is an alias to /src
  import AsHeader from "@/components/exam/AsHeader";
  import AsOptionsSet from "@/components/exam/AsOptionsSet";
  import AsTitle from "@/components/exam/AsTitle";
  import AsDialog from "@/components/exam/AsDialog";
  import store from "@/store";
  import AsCombination from "@/components/exam/subject/AsCombination";
  import AsAnswerQuestion from "@/components/exam/subject/AsAnswerQuestion";
  import AsOptions from "@/components/exam/subject/AsOptions";
  import {insertPaper, selectPaperContent} from "@/apis/exam";
  import _ from "lodash";

  export default {
    name: 'home',
    components: {
      AsHeader,
      AsOptionsSet,
      AsTitle,
      AsDialog,
      AsCombination,
      AsAnswerQuestion,
      AsOptions
    },
    created() {
      //获取试卷信息
      this.getVolume()
      //初始化一个分卷，必须有一个分卷
      store.commit('addVolume')
      //计算总题目数
      store.commit('allScore')
      //初始化分栏等信息
      this.getCount()
    },
    watch: {
      //监听volume是整个页面的数据，所有数据
      "paper.volume"() {
        //延迟500ms，因为通过类名获取到这个组件会有问题，第一时间获取不到完整的数据，需要延迟500ms
        setTimeout(() => {
          const a = document.getElementsByClassName("paper")
          //计算需要有几页才能将所有的数据显示出来
          const width2 = Math.ceil(a[0].scrollWidth/a[0].clientWidth)
          //控制页数
          this.paperWidth = width2
          //对样式进行处理，通过left和width控制显示区域，columnCount控制分栏数
          for (let i=1; i<= width2; i++){
            // a[i-1] : 上一个paper的样式
            // a[i] : 当前paper的样式
            // b[0] : 上一个paper的left的值，去掉px后的
            let b = []
            if(a[i-1].style.left !== ''){
              b = a[i-1].style.left.split("px")
            }
            a[i].style.left = (b.length === 0 ? (-a[0].clientWidth-3)+'px' : (b[0]-this.clientWidth)+'px')
            a[i].style.width = (this.width*(i+1))+'cm'
            a[i].style.columnCount = (i+1) * this.count
          }
          if(a.length === 1){
            a[0].style.width = this.width+'cm'
            a[0].style.columnCount = this.count
          }
          this.refresh()
        }, 500)
      },
      //不是所有时候都会执行paper.volume的监听，所以需要另外一个监听，自己控制
      "paper.paperIndex"(){
        this.getCount()
        //设置试卷有多少页
        this.setPaperWidth(this.clientWidth)
        const a = document.getElementsByClassName("paper")
        const width2 = Math.ceil(a[0].scrollWidth/this.clientWidth)
        this.paperWidth = width2
        setTimeout(() => {
          for (let i=1; i<= width2; i++){
            let b = []
            if(a[i-1].style.left !== ''){
              b = a[i-1].style.left.split("px")
            }
            a[i].style.left = (b.length === 0 ? (-a[0].clientWidth-3)+'px' : (b[0]-this.clientWidth)+'px')
            a[i].style.width = (this.width*(i+1))+'cm'
            a[i].style.columnCount = (i+1) * this.count
          }

          if(a.length === 1){
            a[0].style.width = this.width+'cm'
            a[0].style.columnCount = this.count
          }
          this.refresh()
        }, 1000)
      }
    },
    data() {
      return {
        dialogShow: false,
        test: store.state.test,
        paper: store.state.paper,
        asOptionsSetKey: 0,
        struct: store.state.paper.optionsData.struct,
        id: -1,
        url: store.state.url,
        flag: (this.$route.params.flag === void 0 ? false : true),
        updateData: {},
        paperWidth:1,
        aa:store.state.paper.aa,
        count:2,
        width:42,
        height:29.7,
        clientWidth:1590
      }
    },
    methods: {
      //初始化分栏等信息
      getCount(){
        //每页分栏数量
        this.count = this.paper.count
        //每页宽度
        this.width = this.paper.pageSize[this.count-1].width
        //每页高度
        this.height = this.paper.pageSize[this.count-1].height
        //每页客户端宽度，A3和A4不同
        this.clientWidth = this.paper.pageSize[this.count-1].clientWidth
      },
      //回到管理端
      gotoManager() {
        this.id = -1
        this.flag = false
        store.commit('allScore')
        this.$router.replace("/exam-manager")
      },
      //计算每道题题号
      getIndex(volumeIndex, index, index2) {
        let count = 0;
        for (let i = 0; i < index; i++) {
          count += this.paper.volume[volumeIndex].partTopicsDtoList[i].infoQuestionList.length
        }
        count += index2
        return count
      },
      //退出选题对话框
      confirm() {
        this.dialogShow = false
      },
      //重新渲染数据
      refresh() {
        this.asOptionsSetKey++
        this.$forceUpdate()
      },
      //保存试卷
      preservation() {
        //如果是从编辑按钮来的就更新试卷
        if (this.flag) {
          store.commit('updatePaper', this.updateData)
        } else {
          store.commit('insertPaper')
        }
        insertPaper(JSON.stringify(this.paper.insertPaper), this.flag).then(res => {
          this.id = (this.$route.params.id === void 0 ? res.message : this.$route.params.id)
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }).catch(err => {
          console.log(err)
        })
      },
      //通过编辑按钮过来的执行获取试卷信息
      getVolume() {
        if (this.flag) {
          selectPaperContent(this.$route.params.id).then(res => {
            this.updateData = res.data.paperDto
            let paperDto = res.data.paperDto

            //信息选项，主标题，副标题……
            let struct = this.paper.optionsData.struct
            //通过内容判断当时是否选择了这个选项
            //主标题
            if (paperDto.mainTitle !== '') {
              struct.title.content = paperDto.mainTitle
              struct.title.select = true
            }
            //副标题
            if (paperDto.subTitle !== '') {
              struct.subTitle.content = paperDto.subTitle
              struct.subTitle.select = true
            }
            //试卷介绍
            if (paperDto.introduce !== '') {
              struct.introduce.content = paperDto.introduce
              struct.introduce.select = true
            }
            //试卷信息，将试卷信息和考生输入合并为一个json
            const info = JSON.parse(paperDto.info)
            //通过select判断创建试卷的时候是否选中了这个选项
            if (info.paperInfo.select) {
              struct.paperInfo.content = info.paperInfo.content
              struct.paperInfo.select = true
            }
            if (info.examineeInput.select) {
              struct.examineeInput.content = info.examineeInput.content
              struct.examineeInput.select = true
            }
            //如果这个试卷有分卷，有内容，并且有注意事项这个字段ww
            if (paperDto.partDtoList[0].precautions !== void 0 && paperDto.partDtoList[0].precautions !== '') {
              struct.beCareful.content = paperDto.partDtoList[0].precautions
              struct.beCareful.select = true
            }

            //深拷贝
            let copyVolume = _.cloneDeep(paperDto.partDtoList)

            let subData = []
            //对组合题进行处理
            copyVolume.forEach(item => {
              item.partTopicsDtoList.forEach(subItem => {
                if (subItem.partTopicsMainTitle === "组合题") {
                  let length = subItem.infoQuestionList.length
                  for (let i = 0; i < length; i++) {
                    //parentId === 0 说明是父题，
                    if (subItem.infoQuestionList[i].parentId === 0) {
                      //继续对后面的题目进行处理
                      let j = i + 1
                      for (; j < length; j++) {
                        //如果再次遇到父题就退出这个循环，那么i到j之间的所有题目都是i索引对应的父题的子题
                        if (subItem.infoQuestionList[j].parentId === 0) {
                          break
                        }
                        //将i到j之间的子题放入一个数组，暂存
                        subData.push(subItem.infoQuestionList[j])
                      }
                      //i对应的索引题目没有子题了，将子题从infoQuestionList里删除
                      subItem.infoQuestionList.splice(i + 1, subData.length)
                      //减少循环次数，避免越界
                      length = subItem.infoQuestionList.length
                      //将子题放入父题中，成为父题的一个对象
                      subItem.infoQuestionList[i].infoQuestionList = subData
                      //清空暂存数组
                      subData = []
                    }
                  }
                }
              })
            })
            //将数据给渲染数据的对象
            this.paper.volume = copyVolume
            //如果是通过编辑过来的，那么不允许修改信息选项
            for (let structKey in this.struct) {
              this.struct[structKey].disable = true
            }
            //更新题目总数信息
            store.commit('allScore')
            //重新渲染数据
            this.refresh()
          }).catch(err => {
            console.log(err)
          })
        } else {
          //不是从编辑来的就初始化所有数据
          this.paper.insertPaper = {}
          this.paper.volume = []
          this.paper.optionsData.struct = _.cloneDeep(this.paper.optionsData.struct2)
          this.struct.beCareful.select = false
          this.refresh()
        }
      },
      //设置试卷有多少页
      setPaperWidth(clientWidth){
        //第一时间获取到的数据不完整,延迟500ms
        setTimeout(() => {
          const a = document.getElementsByClassName("paper")
          const width = Math.ceil(a[0].scrollWidth/clientWidth)
          this.paperWidth = width
        }, 500)
      }
    },
    mounted() {
      this.setPaperWidth(1587)
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .options {
      width: 100%;
      margin: 20px 0;
      z-index: 999;
      height: 70px;
      position: sticky;
      top: 0;

      .options_div {
        align-items: center;
        width: 100%;
        padding: 10px 20px;
        box-sizing: border-box;
        display: flex;
        background-color: white;

        span {
          flex: 1;
        }
      }

      .down {
        height: 40px;
        width: 98px;
        background-color: #409eff;
        border-radius: 4px;
        text-align: center;
        line-height: 40px;
        margin-left: 10px;

        .down_paper {
          font-size: 14px;
          text-decoration: none;
          color: white;
        }
      }
    }

    .content {
      width: 100%;
      height: 100%;

      .paper {
        width: 42cm;
        height: 29.7cm;
        background-color: white;
        -webkit-column-count: 2;
        -moz-column-count: 2;
        column-count: 2;
        column-fill:auto;
        margin-bottom: 20px;
        position: relative;
        overflow: hidden;
        padding: 10px;
        box-sizing: border-box;
        -webkit-column-break-inside:auto;
        break-before: auto;
        break-after: auto;
        -moz-column-count:4;
        -webkit-column-count:4;

        .volume {
          -webkit-column-break-inside:auto;
          break-before: auto;
          break-after: auto;
          .volume_title {
            .input ::v-deep {
              .el-textarea__inner {
                resize: none;
                border: 1px dashed transparent;
                cursor: pointer;
                min-height: 30px !important;
                /*overflow-y: hidden;*/
                padding: 0;
                font-size: 16px;
                font-weight: 700;
              }
            }

            .beCareful {
              div {
                font-size: 10px;
              }

              .input ::v-deep {
                .el-textarea__inner {
                  resize: none;
                  border: 1px dashed transparent;
                  cursor: pointer;
                  min-height: 30px !important;
                  overflow-y: hidden;
                  font-size: 10px;
                  padding: 0;
                }
              }
            }
          }

          .list {
            -webkit-column-break-inside:auto;
            break-before: auto;
            break-after: auto;
            .list-title {
              font-size: 15px;
              font-weight: 700;

              .input ::v-deep {
                .el-textarea__inner {
                  resize: none;
                  border: 1px dashed transparent;
                  cursor: pointer;
                  min-height: 30px !important;
                  overflow-y: hidden;
                  font-size: 10px;
                  padding: 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
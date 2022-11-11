<template>
  <!-- 制作答题卡页面开始 -->
  <section id="as_sheet">
    <!-- 页头开始 -->
    <as-header/>
    <!-- 页头结束 -->
<!--    <div ref="test"></div>-->
    <!-- 制作答题卡页面主要区域开始 -->
    <main class="as_sheet_main">
      <!-- 答题卡区域开始 -->
      <el-scrollbar class="answerSheet">
        <div class="wrap">
          <as-render-sheet ref="asWrapper"/>
        </div>
      </el-scrollbar>
      <!-- 答题卡区域结束 -->

      <!-- 答题卡配置项开始 -->
      <aside class="as_sheet_aside">
        <as-options-set @save="save"/>
      </aside>
      <!-- 答题卡配置项结束 -->
    </main>
    <!-- 制作答题卡页面主要区域结束 -->

  </section>
  <!-- 制作答题卡页面结束 -->
</template>

<script>
import AsHeader from '@/components/sheet/AsHeader.vue'
import AsOptionsSet from "@/components/sheet/options-set/AsOptionsSet";
import AsRenderSheet from "@/components/sheet/AsRenderSheet";
import store from "@/store";
import {detailAs, uploadAs} from '@/apis/answer-sheet'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  name: 'Sheet',
  components: {AsHeader, AsOptionsSet, AsRenderSheet},
  created() {
    // 当跳转到该页面时,在数据创建之后进行初始化
    this.init();
  },
  methods: {
    // 初始化函数
    async init() {
      if (this.$route.params.saveType === 'update') {
        const res = await detailAs(this.$route.params.id)
        console.log(res)
        if (res.success) {
          const data = JSON.parse(res.data.answerSheet.style)
          const storeData = {
            paperSize: data.paperSize,
            mainTitle: res.data.answerSheet.name === '答题卡' ? '请输入试卷主标题' : res.data.answerSheet.name,
            subTitle: data.subTitle,
            candidateNumber: data.candidateNumber,
            infoType: data.infoType,
            objectiveArrayType: data.objectiveArrayType,
            themeColor: data.themeColor,

            modules: data.modules,
            moduleData: data.moduleData,
            numbers: data.numbers,
            moduleId: data.moduleId,
            // columnHeight: data.columnHeight,
            columnHeight: 1014,
          }
          console.log(data, 'daaaaaaaaaaaaaaaaaaaaaaaaaat', storeData)
          // 初始化仓库数据
          store.commit('initSheetStore', storeData)
        }
        store.commit('executeRule')
      } else if (this.$route.params.saveType === 'create') {
        const storeData = {
          paperSize: 'A3-3',
          pageCount: 1,
          mainTitle: '请输入试卷主标题',
          subTitle: '请输入试卷副标题',
          candidateNumber: 4,
          infoType: ['姓名', '学校'],
          objectiveArrayType: true,
          themeColor: true,
          modules: [],
          moduleData: [{
            // 统计题目时不算上改题块
            disabled: true,
            ruleType: 'title',
            data: {height: 74}
          }, {
            // 统计题目时不算上改题块
            disabled: true,
            ruleType: 'mate',
            data: {type: 'Mate'}
          }],
          numbers: [],
          moduleId: 1,
          // columnHeight: 1077,
          columnHeight: 1014,
          lastTop: 45,
          // lastLeft: 52,
          lastLeft: 45.75,
          allowAddPageNum: 1,
          allowAddPageCol: 1,
        }
        store.commit('initSheetStore', storeData)
        store.commit('executeRule')
      }
    },
    async save(id, cb) {
      // 获取答题卡的dom元素, 使用画布转化为图片
      const canvas = await html2canvas(this.$refs.asWrapper.$el)
      const image = this.convertBase64ToFile(canvas.toDataURL('image/png'), 'sheet');
      /*const refs = this.$refs.asWrapper.$refs
      const sheetArr = []
      for (const key in refs) {
        console.log(refs, key, 'step3')
        key.indexOf('sheet') > -1 && sheetArr.push(refs[key])
      }*/
      // 获取答题卡每页的dom元素, 使用jsPDF转换为pdf
      const sheetArr = Array.from(this.$refs.asWrapper.$el.querySelectorAll('.sheet'))
      // console.log([this.$store.getters.paperWidth, this.$store.getters.paperHeight], '[this.$store.getters.paperWidth, this.$store.getters.paperHeight]')
      /*const pdfInstance = new JsPDF({
        orientation: 'l',
        unit: 'px',
        format: [this.$store.getters.paperWidth, this.$store.getters.paperHeight]
      })*/
      const pdfInstance = new JsPDF(this.$store.getters.paperWidth > 794 ? 'l' : 'p', 'px', [this.$store.getters.paperWidth, this.$store.getters.paperHeight])
      let pdf = null
      const canvasArr = await Promise.all(sheetArr.map(item => html2canvas(item)))
      canvasArr.forEach((canvas, index) => {
        pdfInstance.addImage({
          imageData: canvas.toDataURL('image/png'),
          format: 'PNG', x: 0, y: 0,
          width: canvas.width,
          height: canvas.height
        })
        if (index === this.$store.state.sheet.pageCount - 1) {
          pdf = this.convertBase64ToFile(pdfInstance.output("dataurlstring"), 'sheet' + index)
        } else {
          pdfInstance.addPage()
        }
      })
      const formData = new FormData()
      formData.append('image', image)
      formData.append('pdf', pdf)
      formData.append('asId', id)
      await uploadAs(formData)
      cb()
    },
    convertBase64ToFile(urlData, filename) {
      const arr = urlData.split('base64,');
      const type = arr[0].match(/:(.*?);/)[1];
      const fileExt = type.split('/')[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename + "." + fileExt, {
        type: type
      });
    },
  }
}
</script>

<style lang="scss" scoped>

.as_sheet_main {
  display: flex;
  margin-top: var(--base-gap);
  height: calc(100% - var(--header-height));
  position: relative;
  .answerSheet {
    flex: 1;
    /*height: 100%;*/
    /*height: calc(100vh - var(--header-height));*/
    /*max-height: calc(100vh - var(--header-height));*/
    /*overflow-y: auto;*/
    /*margin: 0 auto;*/
    /*display: flex;*/
    /*justify-content: center;*/
    max-height: calc(100vh - var(--header-height) - 20px);
    .el-scrollbar__wrap {
      max-height: calc(100vh - var(--header-height) - 20px);
    }
    .wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .as_sheet_aside {
    width: 300px;
    background-color: #fff;
    height: 100%;
    /*position: fixed;*/
    /*right: 0;*/
    margin: 0 10px;
  }
}
</style>

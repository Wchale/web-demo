<template>
  <section class="as_options_set">
    <h2 class="title">答题卡设置</h2>
    <el-button-group class="btns">
      <el-button type="primary" @click="$router.replace('sheet-manager')">返回列表</el-button>
      <el-button type="primary" @click="save">保存试卷</el-button>
    </el-button-group>
    <div>

      <!-- 纸张设置开始 -->
      <div class="as_set">
        <!-- 设置纸张大小开始 -->
        <div class="as_set_item">
          <span class="label" style="width: 100px">纸张大小:</span>
          <el-radio-group v-model="paperSize">
            <el-radio label="A3-3">A3纸/三栏</el-radio>
            <el-radio label="A4-1" style="margin-bottom: 10px">A4纸</el-radio>
            <el-radio label="A3-2">A3纸/两栏</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 纸张设置结束 -->

      <!-- 学生信息设置开始 -->
      <div class="as_set">
        <div class="as_set_item">
          <span class="label">信息种类：</span>
          <el-button class="edit" size="small" type="primary" @click="dialogStudent = true">编辑</el-button>
        </div>

        <div class="as_set_item">
          <span class="label">考号位数：</span>
          <el-input-number v-model="candidateNumber" :min="1" :max="10"
                           @change="commit('updateSheetValue',{key: 'candidateNumber',value: candidateNumber})"
                           size="small" controls-position="right"></el-input-number>
        </div>
      </div>
      <!-- 学生信息设置结束 -->

      <!-- 客观题设置开始 -->
      <div class="as_set">
        <div class="as_set_item">
          <span class="label">客观题：</span>
          <el-radio-group v-model="objectiveArrayType" size="small">
            <el-radio :label="true" border>横排</el-radio>
            <el-radio :label="false" border>竖排</el-radio>
          </el-radio-group>
        </div>

      </div>
      <!-- 客观题设置结束 -->

      <!-- 套红印刷设置开始 -->
      <div class="as_set">
        <div class="as_set_item">
          <div class="as_set_item">
            <el-checkbox v-model="themeColor">套红印刷
            </el-checkbox>
          </div>
        </div>
      </div>
      <!-- 套红印刷设置结束 -->

      <!-- 添加题型开始 -->
      <div class="as_set add_subject">
        <div style="margin-bottom: 10px">
          <el-button @click="dialogs.objective = true" size="small" type="primary" icon="el-icon-circle-plus-outline">
            客观题
          </el-button>
          <el-button @click="dialogs.fillBlank = true" size="small" type="primary" icon="el-icon-circle-plus-outline">
            填空题
          </el-button>
          <el-button @click="dialogs.answer = true" size="small" type="primary" icon="el-icon-circle-plus-outline">解答题
          </el-button>
        </div>
        <div>
          <el-button @click="dialogs.composition = true" size="small" type="primary" icon="el-icon-circle-plus-outline">
            作文题
          </el-button>
        </div>
      </div>
      <!-- 添加题型结束 -->

      <!-- 题目预览开始 -->
      <div class="as_set">
        <as-subject-preview></as-subject-preview>
      </div>
      <!-- 题目预览结束 -->
    </div>
    <!--  学生信息选择对话框开始  -->
    <el-dialog
        :visible.sync="dialogStudent"
        title="学生填写信息种类"
        width="40%">
      <el-checkbox-group v-model="infoType" size="small">
        <el-checkbox label="姓名" disabled border></el-checkbox>
        <el-checkbox label="学校" border></el-checkbox>
        <el-checkbox label="班级" border></el-checkbox>
        <el-checkbox label="考场" border></el-checkbox>
        <el-checkbox label="座号" border></el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStudent = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--  学生信息选择对话框结束  -->

    <!-- 客观题对话框开始 -->
    <as-options-objective :visible.sync="dialogs.objective"/>
    <!-- 客观题对话框结束 -->

    <!-- 填空题对话框开始 -->
    <as-options-fill-blank :visible.sync="dialogs.fillBlank"></as-options-fill-blank>
    <!-- 填空题对话框结束 -->

    <!-- 解答题对话框开始 -->
    <as-options-answer :visible.sync="dialogs.answer"></as-options-answer>
    <!-- 解答题对话框结束 -->

    <!-- 作文题对话框开始 -->
    <as-options-composition :visible.sync="dialogs.composition"></as-options-composition>
    <!-- 作文题对话框结束 -->

  </section>
</template>

<script>
import store from "@/store";
import AsOptionsFillBlank from "./AsOptionsFillBlank.vue";
import AsOptionsObjective from "@/components/sheet/options-set/AsOptionsObjective";
import AsOptionsAnswer from "@/components/sheet/options-set/AsOptionsAnswer";
import AsOptionsComposition from "@/components/sheet/options-set/AsOptionsComposition";
import AsSubjectPreview from "@/components/sheet/AsSubjectPreview";
import {addAsList, createAs, updateAs} from "@/apis/answer-sheet";
const sheet = store.state.sheet

export default {
  name: "AsOptionsSet",
  components: {AsOptionsFillBlank, AsOptionsObjective, AsOptionsAnswer, AsOptionsComposition, AsSubjectPreview},
  data() {
    return {
      sheet,
      commit: store.commit,
      // 学生信息种类填写和考号位数相关数据
      dialogStudent: false,
      // candidateNumber: sheet.candidateNumber,
      // themeColor: sheet.themeColor,
      // 控制对话框的显示
      dialogs: {
        objective: false,
        fillBlank: false,
        answer: false,
        composition: false
      },
    }
  },
  computed: {
    // 纸张大小
    paperSize: {
      get() {
        return this.sheet.paperSize
      },
      set(val) {
        this.change('paperSize', val)
      }
    },
    // 信息种类
    infoType: {
      get() {
        return this.sheet.infoType
      },
      set(val) {
        this.change('infoType', val)
      }
    },
    // 客观题结构
    objectiveArrayType: {
      get() {
        return this.sheet.objectiveArrayType
      },
      set(val) {
        this.change('objectiveArrayType', val)
      }
    },
    // 套红印刷
    themeColor: {
      get() {
        return this.sheet.themeColor
      },
      set(val) {
        this.change('themeColor', val)
      }
    },
    // 套红印刷
    candidateNumber: {
      get() {
        return this.sheet.candidateNumber
      },
      set(val) {
        store.commit('updateSheetValue', {key: 'candidateNumber', value: val})
      }
    },
  },
  methods: {
    preview() {
      const loading = this.$loading({
        lock: true,
        text: '正在努力渲染图片中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$emit('preview')
      loading.close()
    },
    change(name, val) {
      store.commit('updateSheetValue', {key: name, value: val})
      store.commit('executeRule')
    },
    /*change() {
      store.commit('updateSheetValue', {key: 'infoType', value: this.infoType})
      store.commit('executeRule')
    },*/
    /*paperSizeChange() {
      store.commit('updateSheetValue', {key: 'paperSize', value: this.paperSize})
      store.commit('executeRule')
    },*/
    /*changeArrayType() {
      store.commit('updateSheetValue', {key: 'objectiveArrayType', value: this.objectiveArrayType})
      store.commit('executeRule')
    },*/
    async save() {
      const loading = this.$loading({
        lock: true,
        text: '正在努力保存数据中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // 五秒以上无响应,关闭加载动画
      setTimeout(()=> {
        loading.close()
      }, 5000)
      const id = await this.saveSubjectInfo()
      this.$emit('save', id, async () => {
        loading.close()
        const posLoading = this.$loading({
          lock: true,
          text: '正在保存坐标数据......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        await this.saveSubjectPos(id)
        posLoading.close()
        await this.$router.replace('/sheet-manager')
        this.$message({showClose: true, message: '答题卡保存成功!', type: 'success'});
      })
    },
    // 保存题目定位
    async saveSubjectPos(id) {
      const pos = this.getPosition(id)
      pos.push(...this.getAnchorPointsPos(id))
      const res = await addAsList(pos)
      console.log(res)
    },
    getPosition(id) {
      const modules = store.state.sheet.modules.filter(item => item.module.name !== 'AsTitle')
      const pos = []
      modules.map(item => {
        switch (item.module.name) {
          case 'AsMate':
            pos.push(this.getQrcodePos(id, item))
            break;
          case 'AsObjective':
            pos.push(...this.getObjectivePosition(id, item))
            break;
          case 'AsFillBlank':
            pos.push(this.getFillBlankPos(id, item))
            break;
          case 'AsAnswerQuestion':
            pos.push(...this.getAnswerQPos(id, item))
            break;
          case 'AsComposition':
            pos.push(this.getCompositionPos(id, item))
            break;
        }
      })
      return pos
    },
    getAnchorPointsPos(id) {
      console.log(store.state.sheet.position, 'store.state.sheet.position')
      return store.state.sheet.position.map((item, index) => ({
        asId: id,
        x: item.x, y: item.y,
        width: 30, height: 15,
        questionCode: `${item.y < store.getters.paperHeight / 2 ? 'top' : 'bottom'}-${index + 1}`
      }))
    },
    getQrcodePos(id, meta) {
      let x = meta.left
      if (store.state.sheet.paperSize.indexOf('A3-3') > -1) {
        x += 287
      } else {
        x += 494
      }
      return {
        asId: id,
        x, y: meta.top + 40,
        width: 200,
        height: 109,
        questionCode: 0,
      }
    },
    getObjectivePosition(id, objective) {
      const {data: {options}} = objective
      let x = objective.left - 10
      let y = objective.top + (objective.pageNumber - 1) * (store.state.sheet.columnHeight + 85)
      if (objective.data.title !== void 0) {
        y += 43
      } else {
        y += 24
      }
      const pos = []
      options.map(item => {
        item.option.map(subItem => {
          const startNumber = subItem[0].number
          const endNumber = subItem[subItem.length - 1].number
          pos.push({
            asId: id,
            x, y,
            width: Math.ceil(item.width),
            height: item.height - 20,
            questionCode: `${startNumber}-${endNumber}`,
            questions: subItem.map(item => ({type: '1', score: item.score}))
          })
          x += Math.ceil(item.width)
        })
        x = objective.left - 10
        y += item.height
      })
      return pos
    },
    getFillBlankPos(id, fillBlank) {
      return {
        asId: id,
        x: fillBlank.left,
        y: fillBlank.top + (fillBlank.pageNumber - 1) * (store.state.sheet.columnHeight + 85),
        width: store.getters.paperColumnWidth,
        height: fillBlank.data.contents.length * 36 + 20,
        questionCode: `${fillBlank.data.numbers[0]}-${fillBlank.data.numbers[fillBlank.data.numbers.length - 1]}`,
        questions: fillBlank.data.itemScore.map(item => ({type: '2', score: item}))
      }
    },
    getAnswerQPos(id, aq) {
      let x = aq.left;
      let y = aq.top + (aq.pageNumber - 1) * (store.state.sheet.columnHeight + 85);
      if (aq.data.title !== void 0) {
        y += 20
      }
      return aq.data.list.map(item => {
        const data = {
          asId: id,
          x, y,
          width: store.getters.paperColumnWidth,
          height: item.height + 5,
          questionCode: item.number,
          questions: [{type: '3', score: item.score}]
        }
        y += item.height + 3
        return data
      })
    },
    getCompositionPos(id, composition) {
      return {
        asId: id,
        x: composition.left,
        y: composition.top + (composition.pageNumber - 1) * (store.state.sheet.columnHeight + 85),
        width: store.getters.paperColumnWidth,
        height: composition.data.numberOfWord / composition.data.colCount * 36 + composition.data.remainSize + 19,
        questionCode: composition.data.number,
        questions: [{type: '4', score: composition.data.score}]
      }
    },

    // 保存题目信息
    async saveSubjectInfo() {
      const type = this.$route.params.saveType
      const style = JSON.stringify({
        paperSize: sheet.paperSize,
        subTitle: sheet.subTitle,
        candidateNumber: sheet.candidateNumber,
        infoType: sheet.infoType,
        objectiveArrayType: sheet.objectiveArrayType,
        themeColor: sheet.themeColor,

        moduleData: sheet.moduleData,
        numbers: sheet.numbers,
        moduleId: sheet.moduleId,
        columnHeight: sheet.columnHeight,
      })
      const data = {
        name: sheet.mainTitle === '请输入试卷主标题' ? '答题卡' : sheet.mainTitle,
        creator: 'qiyou',
        style
      }
      let id = -1;
      if (type === 'create') {
        id = await this.createAnswerSheet(data)
      } else if (type === 'update') {
        id = await this.updateAnswerSheet(data)
      }
      return id
    },
    async createAnswerSheet(data) {
      const res = await createAs(data)
      if (res.success) {
        return res.data.id
      } else {
        this.$message({showClose: true, message: '答题卡保存失败!', type: 'error'});
      }
    },
    async updateAnswerSheet(data) {
      data.id = this.$route.params.id
      const res = await updateAs(data)
      if (res.success) {
        return data.id
      } else {
        this.$message({showClose: true, message: '答题卡保存失败!', type: 'error'});
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.as_options_set {
  background-color: #fff;

  .title {
    background-color: var(--primary-color);
    color: #fff;
    padding: 10px;
    text-align: center;
  }

  .as_set {
    padding: 10px;
    border-bottom: 1px dashed var(--primary-color);

    &.add_subject {
      padding-right: 0;

      .el-button + .el-button {
        margin-left: 7px;
      }
    }

    &:last-child {
      border-bottom: none;
    }

    .as_set_item {
      display: flex;
      //align-items: center;
    }

    .as_set_item:not(:last-child) {
      margin-bottom: 10px;
    }

    .label {
      display: inline-block;
      font-size: var(--normal-font-size);
      width: 70px;
    }
  }
}

.btns {
  margin: 10px 0;
  display: flex;
  justify-content: center;
}
</style>

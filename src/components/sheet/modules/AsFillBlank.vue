<template>
  <as-module-layout :title="data.title" :dataId="dataId" @edit="visible = true">
    <div class="fill_blank">
      <quill-editor class="editor" v-model.lazy="content" v-show="isEdit"
                    :options="editorOption" :style="{'--padding-bottom': (data.remainSize || 0) + 'px'}"/>
      <i class="close el-icon-circle-close" v-show="isEdit" @click="close"></i>
      <div class="fill_blank_preview" :class="{red: sheet.themeColor}" v-show="!isEdit">
        <div class="content" v-html="content" :style="{paddingBottom: data.remainSize + 'px'}"></div>
        <el-button-group class="btns">
          <el-button type="danger" size="mini" icon="el-icon-delete"
                     @click="remove"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="isEdit = true"></el-button>
        </el-button-group>
      </div>
    </div>
    <as-fill-blank-edit v-if="data.title" :visible.sync="visible" :data-id="dataId"/>
  </as-module-layout>
</template>

<script>
import AsModuleLayout from "@/components/sheet/modules/AsModuleLayout";
import AsFillBlankEdit from "@/components/sheet/options-set/AsFillBlankEdit";
import store from "@/store";
import _ from "lodash";

// 工具栏配置项
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{color: []}],
  ['clean'],
]

export default {
  name: "AsFillBlank",
  props: {
    data: Object,
    dataId: Number
  },
  components: {AsModuleLayout, AsFillBlankEdit},
  data() {
    return {
      sheet: store.state.sheet,
      visible: false,
      isEdit: false,
      content: ``,
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow',
      }
    }
  },
  created() {
    this.data.contents.forEach(item => {
      this.content += item
    })
  },
  methods: {
    close() {
      this.isEdit = false
      const contents = this.content.split('</p>').filter(item => item !== '').map(item => item + '</p>')
      if (contents.length !== this.data.contents.length) {
        const data = _.cloneDeep(store.state.sheet.moduleData.filter(item => item.dataId === this.dataId)[0].data)
        data.contents.splice(this.data.startIndex, this.data.len, ...contents)
        store.commit('updateModuleData', {
          dataId: this.dataId,
          data: data
        })
      }
    },
    remove() {
      const data = _.cloneDeep(store.state.sheet.moduleData.filter(item => item.dataId === this.dataId)[0].data)
      data.contents.splice(this.data.startIndex, this.data.len)
      if (data.contents.length === 0) {
        store.commit('removeModuleData', this.dataId)
      } else {
        store.commit('updateModuleData', {
          dataId: this.dataId,
          data: data
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ql-editor {
  line-height: 36px;
  padding: 0 10px var(--padding-bottom);
}

.fill_blank {
  width: 100%;
  position: relative;


  .editor {
    position: relative;
    z-index: 1;
    margin-top: -42px;
    background-color: #fff;
  }

  .close {
    position: absolute;
    right: 30px;
    top: 9px;
    z-index: 2;
    font-size: 24px;
    color: #fff;
    background-color: var(--sheet-red);
    border-radius: 50%;
    cursor: pointer;
  }

  .fill_blank_preview {
    border: 1px solid #000;
    box-sizing: border-box;
    position: relative;
    font-family: Helvetica, Arial, sans-serif;

    .content {
      font-size: 13px;
      padding: 0 10px 0;
      box-sizing: border-box;
      line-height: 36px;
      height: 100%;
      outline: none;
      overflow-y: auto;
      tab-size: 4;
      text-align: left;
      white-space: pre-wrap;
      word-wrap: break-word;

      .line {
        background-color: red;
      }
    }

    &.red {
      border-color: var(--sheet-red);
    }

    &:hover .btns {
      display: block;
    }

    .btns {
      display: none;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
</style>
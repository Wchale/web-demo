<template>
  <div class="as_module-layout">
    <div class="as_module_title" v-if="title !== void 0">
      <div class="title" :style="{paddingBottom: titlePaddingBottom + 'px', paddingTop: titlePaddingTop + 'px'}">
        {{ title }}
        <div class="actions">
          <el-button-group>
            <el-button type="danger" size="mini" icon="el-icon-delete"
                       @click="remove"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="$emit('edit')"></el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="as_module_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AsModuleLayout",
  props: {
    title: String,
    dataId: Number,
    titlePaddingBottom: {
      type: Number,
      default: 5
    },
    titlePaddingTop: {
      type: Number,
      default: 0
    }
  },
  methods: {
    remove() {
      const data = store.state.sheet.moduleData.filter(item => item.dataId === this.dataId)[0].data
      let number = null;
      if (data.options !== void 0) {
        number = data.options.map(item => item.number)
      } else if (data.number !== void 0) {
        number = data.number
      } else if (data.list !== void 0) {
        number = data.list.map(item => item.number)
      }
      store.commit('removeNumber', number)
      store.commit('removeModuleData', this.dataId)
    }
  }
}
</script>

<style lang="scss" scoped>
.as_module-layout {
  position: absolute;

  .title {
    font-weight: bold;
    font-size: 14px;
    position: relative;

    &:hover {
      .actions {
        display: block;
      }
    }

    .actions {
      display: none;
      position: absolute;
      top: -10px;
      right: 0;
    }
  }
}
</style>
<script>
import store from "@/store";
import AsAnchorPoint from "@/components/sheet/modules/AsAnchorPoint";

export default {
  name: "AsRenderSheet",
  // 渲染答题卡逻辑
  render(createElement) {
      const modulesVNode = this.renderModule(createElement)
      console.log(modulesVNode, 'modulesVNode1')
      // 渲染定位锚点
      modulesVNode.forEach(item => item.push(createElement(AsAnchorPoint)))
      console.log(modulesVNode, 'modulesVNode2')
      const pageVNode = this.renderPage(createElement, modulesVNode)
      console.log(modulesVNode, 'modulesVNode', pageVNode)
      return createElement('div', {class: 'sheet_wrap'}, pageVNode)
  },
  data() {
    return {
      sheet: store.state.sheet,
    }
  },
  methods: {
    // 渲染题块函数
    renderModule(createElement) {
      const pcw = store.getters.paperColumnWidth
      const modules = []
      for (const item of store.state.sheet.modules) {
        const index = item.pageNumber - 1;
        modules[index] || (modules[index] = [])
        modules[index].push(item)
      }
      return modules.map(pageModules =>
          pageModules.map(item => {
            const {uid} = item
            return createElement(item.module, {
              key: uid,
              ref: uid,
              props: {data: item.data, dataId: item.dataId, uid},
              style: {
                width: pcw + 'px',
                left: item.left + 'px', top: item.top + 'px'
              }
            })
          }))
    },

    // 渲染页函数
    renderPage(createElement, modulesVNode) {
      const w = store.getters.paperWidth;
      const h = store.getters.paperHeight;
      return Array
          .apply(null, {length: this.sheet.pageCount})
          .map((item, index) =>
              createElement('div', {
                class: 'sheet',
                ref: 'sheet' + index,
                style: {width: w + 'px', height: h + 'px'},
              }, modulesVNode[index]))
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet_wrap {
  height: initial;
  display: inline-block;
  position: relative;
  margin: 0 auto;
  .sheet {
    background-color: #fff;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    margin-bottom: 40px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
}
</style>

<template>
  <div class="as_anchor_points">
    <i v-for="(item,index) in position" :key="index" :style="{top: item.y + 'px',left: item.x + 'px'}"
       class="as_anchor_point"></i>
    <!--    <div class="test"></div>-->
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AsAnchorPoint",
  data() {
    return {
      sheet: store.state.sheet,
      //所有锚点的x,y坐标
      position: []
    }
  },
  watch: {
    'sheet.paperSize': {
      immediate: true,
      handler(value) {
        const pc = value.split('-')[1];
        const ph = store.getters.paperHeight; // 1104
        let pw = store.getters.paperWidth - 64; // 1495
        let baseX = 17
        const baseY = 15
        switch (pc) {
          case '1':
            this.position = [
              {x: baseX, y: baseY},
              {x: baseX, y: ph - 2 * baseY},
              {x: pw - 15 + 32, y: baseY},
              {x: pw - 15 + 32, y: ph - 2 * baseY},
            ]
            break;
          case '2':
            this.position = [
              {x: baseX, y: baseY},
              {x: baseX, y: ph - 2 * baseY},
              {x: pw / 2 - 15 + 32, y: baseY},
              {x: pw / 2 - 15 + 32, y: ph - 2 * baseY},
              {x: pw - 15 + 32, y: baseY},
              {x: pw - 15 + 32, y: ph - 2 * baseY},
            ]
            break;
          case '3':
            baseX = 17.5
            pw = store.getters.paperWidth - 65
            this.position = [
              {x: baseX, y: baseY},
              {x: baseX, y: ph - 2 * baseY},
              {x: pw / 3 - 15 + 32.5, y: baseY},
              {x: pw / 3 - 15 + 32.5, y: ph - 2 * baseY},
              {x: (pw / pc) * 2 - 15 + 32.5, y: baseY},
              {x: (pw / pc) * 2 - 15 + 32.5, y: ph - 2 * baseY},
              {x: pw - 15 + 32.5, y: baseY},
              {x: pw - 15 + 32.5, y: ph - 2 * baseY},
            ]
            break;
        }
        store.commit('updateSheetValue', {key: 'position', value: this.position})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  position: absolute;
  display: inline-block;
  width: 30px;
  height: 15px;
  top: 1053px;
  left: 544px;
  background-color: #000;
}

.as_anchor_point {
  position: absolute;
  display: inline-block;
  width: 30px;
  height: 15px;
  background-color: #000;
}
</style>

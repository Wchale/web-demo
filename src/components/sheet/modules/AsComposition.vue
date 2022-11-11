<template>
  <as-module-layout :title="data.title ? `第${data.number}题 - ${data.title}(${data.score}分)` : void 0" :data-id="dataId"
                    @edit="visible = true"
                    :titlePaddingBottom="data.remainSize / 2 - 1"
                    :titlePaddingTop="data.remainSize / 2">
    <div class="composition" :class="{red: $store.state.sheet.themeColor}">
      <template v-for="row in Math.ceil(data.numberOfWord / data.colCount)">
        <tr :key="row">
          <td v-for="col in data.colCount"
              :key="col">
            <span
                v-if="(((row - 1) * data.colCount) + col + data.preWord) % 100 === 0 && (((row - 1) * data.colCount) + col + data.preWord) <= data.sum">▲{{
                ((row - 1) * data.colCount) + col + data.preWord
              }}</span>
          </td>
        </tr>
        <tr :key="'space' + row" style="height: 6px;"></tr>
<!--        <tr :key="'space' + row" style="height: 6px;font-size: 8px;">{{index + 1}}</tr>-->
      </template>
    </div>
    <as-options-composition v-if="data.title" :visible.sync="visible" :dataId="dataId"></as-options-composition>
  </as-module-layout>
</template>

<script>
import AsModuleLayout from "@/components/sheet/modules/AsModuleLayout";
import AsOptionsComposition from "@/components/sheet/options-set/AsOptionsComposition";

export default {
  name: "AsComposition",
  components: {AsModuleLayout, AsOptionsComposition},
  props: {
    data: Object,
    dataId: Number,
  },
  data() {
    return {
      visible: false
    }
  },
  created() {
    console.log(this.data)
  }
}
</script>

<style lang="scss" scoped>
.composition {
  tr {
    td {
      width: 32px;
      height: 32px;
      border: 1px solid #000;
      border-right: none;
      box-sizing: border-box;

      &:last-child {
        border-right: 1px solid #000;
      }

      position: relative;

      span {
        font-size: 8px;
        position: absolute;
        bottom: -10.5px;
        left: -4px;
        transform: scale(0.5);
      }
    }
  }
}

.composition.red tr td {
  border-color: var(--sheet-red);

}
</style>

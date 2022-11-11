<template>
  <as-module-layout :title="data.title" :dataId="dataId" @edit="visible = true">
    <div class="objective" :class="{red: sheet.themeColor,column: !sheet.objectiveArrayType}"
         :style="{paddingBottom: data.remainSize + 'px'}">
      <div class="objective_row" v-for="(optionRow,index) in data.options" :key="index">
        <div class="options_group" v-for="(options,optionsIndex) in optionRow.option" :key="optionsIndex"
             :style="{width: optionRow.width + 'px'}"
        >
          <div class="options_item" v-for="(option,optionIndex) in options" :key="optionIndex">
            <span>{{ option.number }}</span>
            <div v-if="option.type === '判断题'" class="judgement_option">
              <div class="option">T</div>
              <div class="option">F</div>
            </div>
            <div v-else class="option" v-for="num in option.optionCount" :key="num">
              {{ String.fromCharCode(64 + num) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <as-options-objective v-if="data.title" :visible.sync="visible" :dataId="dataId"></as-options-objective>
  </as-module-layout>
</template>

<script>
import store from "@/store";
import AsModuleLayout from "@/components/sheet/modules/AsModuleLayout";
import AsOptionsObjective from "@/components/sheet/options-set/AsOptionsObjective";

export default {
  name: 'AsObjective',
  components: {AsModuleLayout, AsOptionsObjective},
  props: {
    data: Object,
    dataId: Number,
    uid: String
  },
  data() {
    return {
      sheet: store.state.sheet,
      objective: [],
      visible: false,
    }
  },
  created() {
    console.log(this.data)
  }
}
</script>

<style lang="scss" scoped>
.objective {
  border: 1px solid #000;
  padding-top: 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .objective_row {
    width: 100%;
    display: flex;
  }

  .options_group {
    margin-bottom: 10px;

    .options_item {
      font-size: 12px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 6px;

      span {
        display: inline-block;
        text-align: center;
        width: 0.6cm;
      }

      .judgement_option {
        display: flex;
      }

      .option {
        border: 1px solid #000;
        width: 18px;
        height: 10px;
        line-height: 10px;
        font-size: 11px;
        text-align: center;
        margin-right: 8px;
        color: #000;
      }
    }
  }
}

.objective.red {
  border-color: var(--sheet-red);

  .options_group > .options_item .option {
    border-color: var(--sheet-red);
    color: var(--sheet-red);
  }
}

.objective.column {
  .options_group {
    display: flex;

    .options_item {
      flex-direction: column;
      padding-left: 2px;

      &:first-child {
        padding-left: 6px;
      }

      .judgement_option {
        flex-direction: column;
      }

      .option {
        margin-right: 0;
        margin-bottom: 6px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
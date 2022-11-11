<template>
  <div class="as_mate" :class="{red: sheet.themeColor}">
    <div :class="`as_base_info as_base_info_${sheet.paperSize}`">
      <ul class="as_student_info">
        <!--      <li v-for="item in sheet.infoType" :key="item">{{ item }}</li>-->
        <li>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</li>
        <li>
          <div class="top">
            <h3 class="id">准考证号</h3>
            <ul>
              <li v-for="item in sheet.candidateNumber" :key="item"></li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-if="sheet.paperSize === 'A3-3'" class="qrcode">贴条形码区</div>
    </div>
    <div :class="`as_notice_qrcode as_notice_qrcode_${sheet.paperSize}`">
      <div class="notice">
        <div class="bottom">
          <h3 class="text">注意事项</h3>
          <div class="content">
            <!--<div class="content">
              <p>1.答题前，考生先将自己的姓名、学校、班级、准考证号填写清楚，并认真核准条形码上准考证号、姓名及科目，在规定位置贴好条形码。如无条码，请务必按照准考证号正确填涂。</p>
              <p>2.选择题部分使用2B铅笔按图示规范填涂；非选择题必须使用0.5毫米及以上黑色字迹的签字笔书写，要求字体工整，笔迹清楚。</p>
              <p>3.严格按照题号在相应答题区域内作答，超出答题区域书写的答案无效；在草稿纸、试卷上答题无效。</p>
              <p>4.保持卡面清洁、完整，不装订，不要折叠，严禁使用涂改液、修正带。</p>
            </div>-->
            <div class="inner">
              <p>1.答题前,考生先将自己的姓名、学校、班级、准考证号填写清楚，并认真核准条形码上准考证号、姓名及科目。</p>
              <p>2.选择题部分请按题号用2B铅笔填涂方框,修改时用橡皮擦擦干净,不留痕迹;</p>
              <p>3.非选择题部分请按题号用0.5毫米黑色墨水签字笔书写,否则作答无效;</p>
              <p>4.在草稿纸、试题卷上答题无效;</p>
              <p>5.请勿折叠答题卡。保持字体工整、笔记清晰、卡面清洁。</p>
            </div>
            <div class="sign">
              <i class="block"></i>
              <span> ← 此方框为缺考生标记，由监考员用2B铅笔填涂。</span>
            </div>
          </div>

          <div class="fill_item">
            <h3>正确填涂示例</h3>
            <span class="fill_block"><i class="block" style="background-color:#000;"></i></span>
          </div>
        </div>
        <!--<div class="top">
          <h3 class="id"></h3>
          <span>正确填涂</span>
          <span class="fill_block"><i class="block" style="background-color:#000;"></i></span>
        </div>-->
      </div>
      <div class="code_wrap">
        <div v-if="sheet.paperSize !== 'A3-3'" class="qrcode">贴条形码区</div>
        <!--<div class="fill">
          <div class="fill_item">
            <span>正确填涂</span>
            <span class="fill_block"><i class="block" style="background-color:#000;"></i></span>
          </div>
          <div class="fill_item">
            <span>错误填涂</span>
            <span class="fill_block">
              <img v-if="sheet.themeColor" class="error_fill" src="@/assets/fill-red.png" alt="">
              <img v-else class="error_fill" src="@/assets/fill.png" alt="">
            </span>
          </div>
          <div class="fill_item">
            <span>缺考标记</span>
            <span class="fill_block"><i class="block"></i></span>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "AsMate",
  data() {
    return {
      sheet: store.state.sheet
    }
  },
}
</script>

<style lang="scss" scoped>
  div {
    box-sizing: border-box;
  }
.as_mate {
  position: absolute;

  h3 {
    font-size: var(--normal-font-size);
    font-weight: normal;
  }
  .as_base_info {
    display: flex;
    justify-content: space-between;
    .as_student_info {
      display: flex;
      flex-wrap: wrap;
      border: 1px solid transparent;
      margin-bottom: 10px;
      position: relative;
      font-size: var(--normal-font-size);
      line-height: 30px;

      .edit {
        position: absolute;
        right: 0;
        bottom: 0;
      }

      > li {
        position: relative;
        width: 60%;
        margin-bottom: 10px;
        &:first-child::after {
          content: '';
          display: inline-block;
          width: 75%;
          height: 1px;
          background-color: #000;
          position: absolute;
          bottom: 0;
          left: 60px
        }
      }

      .top {
        display: flex;
        align-items: center;
        /*border-bottom: 1px solid #000;*/

        .id {
          width: 60px;
          height: 30px;
          text-align: left;
          line-height: 30px;
          font-size: var(--normal-font-size);
        }

        ul {
          display: flex;
        }

        li {
          width: 20px;
          height: 20px;
          border: 1px solid #000;
          border-right: none;
          margin: 0;
          &:last-child{
            border-right: 1px solid #000;
          }
        }

        .fill_block {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .qrcode {
      box-sizing: border-box;
      width: 200px;
      height: 110px;
      border: 1px dashed #000;
      border-radius: 4px;
      color: #000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .as_base_info_A3-2,
  .as_base_info_A4-1 {
    .as_student_info {
      width: 100%;
      > li {
        width: 50%;
      }
    }
    .qrcode {
      display: none;
    }
  }

  .as_base_info_A3-3 {
    .as_student_info {
      width: calc(100% - 200px);
        flex-direction: column;
        > li {
          width: 100%;
        }
      }
  }

  .as_notice_qrcode {
    display: flex;

    .notice {
      border: 1px solid #000;

      .top {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #000;

        .id {
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          border-right: 1px solid #000;
        }

        ul {
          display: flex;
        }

        li {
          width: 20px;
          height: 20px;
          border: 1px solid #000;
          margin: 0 6px;
        }

        .fill_block {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
        }
      }

      .bottom {
        display: flex;

        .text {
          width: 16px;
          padding: 0 10px;
          border-right: 1px solid #000;
          display: flex;
          align-items: center;
        }

        .content {
          font-size: var(--small-font-size);

          color: #000;
          border-right: 1px solid #000;
          .inner {
            padding: 5px;
            p {
              line-height: 14px;
            }
          }
          .sign {
            padding: 5px;
            border-top: 1px solid #000;
            display: flex;
            .block {
              display: inline-block;
              width: 28px;
              height: 14px;
              border: 1px solid #000;
            }
            span {
              margin-left: 10px;
            }
          }
        }

        .fill_item {
          text-align: center;
          width: 50px;
          /*display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-content: space-around;*/
          padding: 15px 5px;
          .fill_item > span:nth-child(1) {
            height: inherit;
            font-size: 14px;
            display: inline-block;
            padding: 8px 8px;
            border-right: 1px solid #000;
          }

          .fill_item:last-child {
            flex: 1;
            border-bottom: none;
          }

          .block {
            display: inline-block;
            width: 28px;
            height: 14px;
            border: 1px solid #000;
          }

          .fill_block {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            margin-top: 15px;
          }
        }
      }
    }

    .code_wrap {
      display: flex;
      .qrcode {
        width: 200px;
        height: 110px;
        border: 1px dashed #000;
        border-radius: 4px;
        color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /*.fill {
        border: 1px solid #000;
        display: flex;
        flex-direction: column;
        flex: 1;

        .fill_item {
          border-bottom: 1px solid #000;
          display: flex;
        }

        .fill_item > span:nth-child(1) {
          height: inherit;
          font-size: 14px;
          display: inline-block;
          padding: 8px 8px;
          border-right: 1px solid #000;
        }

        .fill_item:last-child {
          flex: 1;
          border-bottom: none;
        }

        .block {
          display: inline-block;
          width: 28px;
          height: 14px;
          border: 1px solid #000;
        }

        .fill_block {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
        }

        .error_fill {
          width: 120px;
        }
      }*/
    }

  }
  .as_notice_qrcode_A3-2,
  .as_notice_qrcode_A4-1 {
    justify-content: space-between;

    .notice {
      width: 568px;
      display: flex;
      flex-direction: column;

      .bottom {
        flex: 1;
        /*align-items: center;*/

        .text {
          height: 100%;
        }
      }
    }

    .code_wrap {
      justify-content: center;
      flex-direction: column;
      width: 5.2cm;
      margin-left: 10px;

      .fill {
        flex: 1;
      }
    }
  }
  .as_notice_qrcode_A3-3 {
    flex-direction: column-reverse;
    .notice {
      .bottom {
        .content {
          .inner {
            padding: 5px;
            p {
              line-height: 12px;
            }
          }
        }
      }
    }
    .code_wrap {
      margin-bottom: 10px;
      flex-direction: row-reverse;

      .fill {
        margin-right: 10px;
      }
    }
  }
}

.as_mate.red {
  .as_base_info {
    .as_student_info > li::after {
      background-color: var(--sheet-red);
    }
    .as_student_info .top {
      border-bottom-color: var(--sheet-red);

      .id {
        border-right-color: var(--sheet-red);
      }

      li {
        border-color: var(--sheet-red);
      }
    }
    .qrcode {
      border-color: var(--sheet-red);
      color: var(--sheet-red);
    }
  }
  .as_notice_qrcode > .notice {
    border-color: var(--sheet-red);

    .top {
      border-bottom-color: var(--sheet-red);

      .id {
        border-right-color: var(--sheet-red);
      }

      li {
        border-color: var(--sheet-red);
      }
    }

    .bottom {
      .text {
        border-right-color: var(--sheet-red);
      }

      .content {
        color: var(--sheet-red);
        border-right-color: var(--sheet-red);
        .sign{
          border-color: var(--sheet-red);
        }
        .block {
          border-color: var(--sheet-red);
        }
      }
    }
  }

  .as_notice_qrcode > .code_wrap {
    .qrcode {
      border-color: var(--sheet-red);
      color: var(--sheet-red);
    }

    .fill {
      border-color: var(--sheet-red);

      .fill_item {
        border-bottom-color: var(--sheet-red);
      }

      .fill_item > span:nth-child(1) {
        border-right-color: var(--sheet-red);
      }

      .block {
        border-color: var(--sheet-red);
      }
    }
  }
}

</style>

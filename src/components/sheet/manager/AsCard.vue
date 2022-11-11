<template>
  <div class="as-card">
    <div class="content">
      <div class="item" v-for="(item, index) in obj" :key="index">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.img"
               class="image">
          <div style="padding: 14px;" class="card_bottom">
            <span>{{item.pageTitle}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.createDate }}</time>
              <div class="button">
                进入>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsCard',
  props:['obj'],
  data() {
    return {
    }
  },
}
</script>

<style scoped>
.content {
    display: flex;
    flex-wrap: wrap;
}
.item {
    width: 260px;
    /* min-width: 200px; */
    margin-right: 20px;
    margin-bottom: 20px;
}
.item:nth-child(4n){
    margin-right: 0;
}
.time {
  font-size: 13px;
  color: #bcc1cc;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
  color: #4883f0;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.card_bottom > span {
    color: #3b3f47;
}
</style>
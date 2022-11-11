<template>
  <section class="as_manager">
    <as-header title="答题卡管理中心">
      <el-button @click="$router.push('/')" type="success">返回首页</el-button>
    </as-header>
    <main class="as_manager_main">
      <div class="add_as">
        <el-switch
            v-model="previewType"
            active-text="预览图片"
            inactive-text="预览PDF" style="margin-right: 8px">
        </el-switch>
        <el-button type="primary" @click="$router.push({name: 'sheet', params: {saveType: 'create'}})">添加答题卡</el-button>
      </div>
      <el-table
          border
          stripe
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="试卷主标题"
            min-width="150">
        </el-table-column>
        <el-table-column
            prop="creator"
            label="创建者"
            align="center"
            width="100">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="80">
          <template slot-scope="scope">
            {{ scope.row.status ? '已发布' : '待发布' }}
          </template>
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="时间"
            align="center"
            width="180"
        >
        </el-table-column>
        <el-table-column
            prop="handle"
            label="操作"
            align="center"
            min-width="100">
          <template slot-scope="scope">
            <el-button @click="del(scope.row.id)" type="danger" size="small">删除</el-button>
            <el-button @click="preview(scope.row)" type="success" size="small">预览</el-button>
            <el-button @click="download(scope.row.id)" type="success" size="small">下载</el-button>
            <el-button @click="cutImg(scope.row.id)" type="success" size="small">切图</el-button>
            <el-button @click="edit(scope.row.id)" type="primary" size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </section>
</template>

<script>
import AsHeader from "@/components/sheet/AsHeader"
import {listAs, deleteAs, cutImg} from '@/apis/answer-sheet'

export default {
  name: 'AsManager',
  components: {AsHeader},
  data() {
    return {
      previewType: true,
      tableData: []
    }
  },
  async created() {
    const res = await listAs('qiyou')
    if (res.success) {
      this.tableData = res.data.answerSheets.map(item => {
        item.createDate = item.createDate.split('T').join(' ')
        return item
      });
    }
  },
  methods: {
    async del(id) {
      const res = await deleteAs(id)
      if (res.success) {
        this.$message({showClose: true, message: '删除成功!', type: 'success'});
        this.tableData.forEach((item, index) => {
          item.id === id && this.tableData.splice(index, 1)
        })
      }
    },
    edit(id) {
      console.log(id)
      this.$router.push({name: 'sheet', params: {saveType: 'update', id}})
    },
    preview(row) {
      const a = document.createElement('a')
      if (this.previewType) {
        a.href = 'http://192.168.0.186:8086/' + row.image
        a.target = '_blank'
      } else {
        a.href = 'http://192.168.0.186:8086/' + row.pdf
        a.target = '_blank'
      }
      a.click()
    },
    download(id) {
      const a = document.createElement('a')
      a.href = `http://192.168.0.186:8086/answerSheet/pdf/${id}`
      a.target = '_blank'
      a.click()
    },
    async cutImg(id) {
      const curImgRes = await cutImg(id)
      console.log(curImgRes)
      /*curImgRes.data.cutImage.forEach(item => {
        const a = document.createElement('a')
        a.href = 'http://192.168.0.186:8086/' + item.image
        a.target = '_blank'
        a.click()
      })*/
    }
  }
}
</script>

<style scoped>
.as_manager {


}

.add_as {
  margin-bottom: 10px;
  text-align: right;
}

.as_manager_main {
  width: 1400px;
  min-height: calc(100vh - 40px - var(--header-height));
  background-color: #fff;
  margin: 20px auto;
  padding: 12px 24px;
  box-sizing: border-box;
}
</style>

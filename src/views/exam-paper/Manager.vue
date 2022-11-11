<template>
  <!-- 试卷管理端页面 -->
  <div class="pages">
    <as-header>
      <div slot="header">
        <el-button @click="$router.push('/')" type="success">返回首页</el-button>
      </div>
    </as-header>
<!--    这个key用来重新渲染数据     -->
    <div class="mypage" :key="pageIndex">
      <el-button class="new_paper" type="primary" size="small" @click="newPaper">新建试卷</el-button>
      <el-table
          :data="papers"
          border
          style="width: 100%">
        <el-table-column
            prop="cts"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="mainTitle"
            label="试卷名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="introduce"
            label="试卷介绍">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="240">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click.native.prevent="downPaper(scope.$index)">试卷下载
            </el-button>
            <el-button type="text" size="small"
                       @click.native.prevent="gotoHome(scope.$index)">编辑试卷
            </el-button>
            <el-button type="text" size="small"
                       @click.native.prevent="deleteRow(scope.$index)">删除试卷
            </el-button>
            <el-button type="text" size="small"
                       @click.native.prevent="preview(scope.$index)">预览
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import AsHeader from '@/components/exam/AsHeader.vue'
import _ from 'lodash'
import {deletePaper, selectAllPaper, preview} from "@/apis/exam";

export default {
  name: 'manager',
  components: {
    AsHeader,
  },
  created() {
    this.getAllPaper()
  },
  data() {
    return {
      url: store.state.url,
      papers: [],
      pageIndex: 0,
      paperDto: {}
    }
  },
  methods: {
    //预览
    preview(index) {
      this.$message({
        type: 'info',
        message: '正在前往预览'
      })
      preview(this.papers[index].id).then(res => {
        res.data.imagePath.forEach(item => {
          let a = document.createElement('a')
          //获取预览图片
          a.href = 'http://192.168.0.186:8080' + item
          a.target = '_blank'
          a.click()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    //从编辑进入首页
    gotoHome(index) {
      this.$router.replace({
        name: 'exam-home',
        params: {
          flag: true,
          //在首页获取试卷内容
          id: this.papers[index].id
        }
      })
    },
    //新建试卷进入首页
    newPaper() {
      this.$router.replace('/exam-home')
    },
    //下载试卷，word
    downPaper(index) {
      this.$message({
        type: 'info',
        message: '正在下载'
      })
      let a = document.createElement('a')
      const id = this.papers[index].id
      console.log(id)
      const url = 'http://192.168.0.186:8080/conversionWord?id=' + id
      a.setAttribute('href', url)
      document.body.appendChild(a)
      a.click()
    },
    //获取所有试卷信息
    getAllPaper() {
      selectAllPaper().then(res => {
        this.papers = res.data.papers
      }).catch(err => {
        console.log(err)
      })
    },
    //删除试卷
    deleteRow(index) {
      this.$confirm('您确定要移除当前试卷吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = this.papers[index].id
        deletePaper(id).then(() => {
          //根据索引 indexes，移除array中对应的元素
          _.pullAt(this.papers, index);
          //更新key值，重新渲染
          this.pageIndex++
          this.$message({
            type: "success",
            message: "删除成功"
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.pages {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .mypage {
    padding: 50px;
    width: 80%;
    min-height: 80vh;
    background-color: white;
    margin-top: 50px;
    box-sizing: border-box;

    .new_paper {
      float: right;
    }
  }
}
</style>

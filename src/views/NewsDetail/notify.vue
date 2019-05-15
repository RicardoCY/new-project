<template>
    <el-container class="news-detail-container">
      <el-header class="news-detail-header">
        <el-container>
          <el-aside width="60px" class="left">
            <div class="el-icon-news"></div>
          </el-aside>
          <el-container class="right">
            <el-header height="36px" class="top">
              {{newsDetail.title}}
              <p style="font-size:12px;margin-top:-10px">发表时间 : {{createdTime}}</p> 
              </el-header>
          
          </el-container>
        </el-container>
      </el-header>
      <el-main class="news-detail-main ql-editor" v-html="newsDetail.content"></el-main>
    </el-container>
</template>

<script>
  import '@/styles/NewsDetail/index.scss'

  export default {
    name: 'notify',
    data(){
      return {
        newsId:null,
        newsDetail:{},
        createdTime:""
      }
    },
    mounted(){
      console.log(this.$route.query.id)
      this.newsId = this.$route.query.id
      this.getNewsDetail()
    },
    methods:{
      getNewsDetail(){
        let url = "/notify/" + this.newsId
        this.$http.get(url).then(res => {
          this.newsDetail = res.data
          this.createdTime = this.newsDetail.createdTime.substring(0,10)+" "+this.newsDetail.createdTime.substring(11,19)
        })
      }
    }
  }
</script>
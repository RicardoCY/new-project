<template>
  <el-container>
    <div class="main-bg">
      <div class="dashboard-company-container">
        <div class="home-container">
          <div class="home-container-info">
            <div class="news-container" v-loading="newsLoad" style="height:480px;padding-top:10px;background-color:#fff">
              <div class="company-header">
                <h3>公司新闻</h3>
                <!-- <i class="el-icon-refresh" @click="refreshNews"></i> -->
              </div>
              <div
                class="news-item"
                style="width:90%;margin:0 auto;display:flex;justify-content: space-between;height:56px;align-items:center;border-bottom:1px solid #eee"
                v-for="item in newsData"
                :key="item.id"
                @click="handleToDetail(item.id)"
              >
                <span  class="news-item-title">{{item.title}}</span>
                <span
                  class="news-item-time"
                >{{item.createdTime.slice(0,10)}}</span>
              </div>
              <div class="pagination-container">
                <el-pagination
                v-if="newsTotal"
                  small
                  :current-page="newsRequest.pageNum"
                  :page-size="newsRequest.pageSize"
                  @current-change="newsCurrentChange"
                  layout="prev, pager, next"
                  :total="newsTotal"
                ></el-pagination>
              </div>
            </div>
            <div class="news-container" style="height:360px;margin-top: 30px;padding-top:10px;background-color:#fff">
              <div class="company-header">
                <h3>公司制度</h3>
                <!-- <i class="el-icon-refresh"></i> -->
              </div>
              <router-link target="_blank" :to="{path:'/CompanySystemStaff'}" class="news-item">
                <div
                  style="width:90%;margin:0 auto;display:flex;justify-content: space-between;height:56px;align-items:center;border-bottom:1px solid #eee"
                >
                  <span class="news-item-title">员工管理方法</span>
                  <span style="float:right" class="news-item-time">2019-03-13</span>
                </div>
              </router-link>
              <router-link target="_blank" :to="{path:'/CompanySystemLeave'}" class="news-item">
                <div
                  style="width:90%;margin:0 auto;display:flex;justify-content: space-between;height:56px;align-items:center;border-bottom:1px solid #eee"
                >
                  <span class="news-item-title">考勤和请休假管理规定</span>
                  <span style="float:right" class="news-item-time">2019-03-13</span>
                </div>
              </router-link>
              <router-link target="_blank" :to="{path:'/CompanySystemSalary'}" class="news-item">
                <div
                  style="width:90%;margin:0 auto;display:flex;justify-content: space-between;height:56px;align-items:center;border-bottom:1px solid #eee"
                >
                  <span class="news-item-title">薪酬管理规定</span>
                  <span style="float:right" class="news-item-time">2019-03-13</span>
                </div>
              </router-link>
              <router-link target="_blank" :to="{path:'/CompanySystemBreach'}" class="news-item">
                <div
                  style="width:90%;margin:0 auto;display:flex;justify-content: space-between;height:56px;align-items:center;border-bottom:1px solid #eee"
                >
                  <span class="news-item-title">违纪管理规定</span>
                  <span style="float:right" class="news-item-time">2019-03-13</span>
                </div>
              </router-link>
              <router-link target="_blank" :to="{path:'/CompanySystemRecommend'}" class="news-item">
                <div
                  style="width:90%;margin:0 auto;display:flex;justify-content: space-between;height:56px;align-items:center;border-bottom:1px solid #eee"
                >
                  <span class="news-item-title">内部推荐流程及奖励方法</span>
                  <span style="float:right" class="news-item-time">2019-03-13</span>
                </div>
              </router-link>
            </div>
          </div>
          <div class="home-container-slider">
            <div
              style="margin-left:20px;height:480px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);padding-top:10px;background-color:#fff"
              v-loading="photoLoad"
            >
              <div class="company-header">
                <h3>图片新闻</h3>
                <!-- <i class="el-icon-refresh" @click="getPhotoData"></i> -->
              </div>
              <el-carousel indicator-position="outside" height="400px">
                <el-carousel-item v-for="item in photoData" :key="item.id">
                  <div class="photo-item" @click="handleToDetail(item.id)">
                    <img :src="item.picUrl">
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div
              style="margin-left:20px;height:360px;margin-top: 30px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);padding-top:10px;background-color:#fff"
            >
              <div class="company-header">
                <h3>倾听邮箱</h3>
                <!-- <i class="el-icon-refresh"></i> -->
              </div>
              <el-container class="email-box">
                <el-aside width="100px">
                  <img :src="qingtingyouxiang" alt>
                </el-aside>
                <el-container>
                  <el-header height="30px">建议意见 ● 倾听邮箱</el-header>
                  <el-main>info@prosuntech.com</el-main>
                </el-container>
              </el-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import "@/styles/Dashboard/company.scss";
import qingtingyouxiang from "@/assets/qingtingyouxiang.png";

export default {
  name: "company",
  data() {
    return {
      qingtingyouxiang, //---倾听邮箱背景图
      //公司新闻
      newsLoad: false,
      newsData: [],
      newsTotal: 0,
      newsRequest: {
        pageNum: 1,
      pageSize: 7,
        paramData: {
          isPublish: true,
          newsType: 1
        }
      },
      //图片新闻
      photoLoad: false,
      photoData: [],
      photoRequest: {
        pageNum: 1,
        pageSize: 10,
        paramData: {
          isPublish: true,
          newsType: 2
        }
      }
    };
  },
  mounted() {
    this.getNewsData();
    this.getPhotoData();
  },
  methods: {
    handleToDetail(id) {
      //跳转新闻详细
      window.open(
        this.$router.resolve({ path: `/NewsDetail`, query: { id } }).href,
        "_blank"
      );
    },
    //刷新公司新闻
    refreshNews() {
      this.newsCurrentChange(1);
    },
    //公司新闻当前页
    newsCurrentChange(val) {
      this.newsRequest.pageNum = val;
      this.getNewsData();
    },
    //获取公司新闻
    getNewsData() {
      this.newsLoad = true;
      this.$http.post("/news/pager", this.newsRequest).then(res => {
        this.newsTotal = res.data.pagination.totalCount;
        this.newsData = res.data.resultData;
        this.newsLoad = false;
      });
    },

    //获取图片新闻
    getPhotoData() {
      this.photoLoad = true;
      this.$http.post("/news/pager", this.photoRequest).then(res => {
        this.photoData = res.data.resultData;
        this.photoLoad = false;
      });
    }
  }
};
</script>
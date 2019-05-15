<template>
  <el-container>
    <div class="main-bg">
      <div class="main-inside" >
       
          <div v-show="activeName=='个人门户'" class="tab-btn">
            <el-button class="btn-add btn-80" type="primary" size="medium" @click="newsDialog('add')">添加</el-button>
          </div>
          <div v-show="activeName=='公司门户'" class="tab-btn">
            <el-button class="btn-add btn-80" type="primary" size="medium" @click="notifyDialog('add')">添加</el-button>
          </div>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane name="公司门户" label="通知">
                  <div style="width:100%"  v-loading="notifyLoad">
                      <el-table :data="notifyData" empty-text="暂无数据" border>
                      <el-table-column prop="title" label="标题" min-width="1"></el-table-column>
                      <el-table-column label="是否发布" width="100px">
                        <template slot-scope="scope">
                          <div>{{scope.row.isPublish?"是":"否"}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="发布时间" width="200px">
                        <template slot-scope="scope">
                          <div>{{scope.row.createdTime.substring(0,10)+" "+scope.row.createdTime.substring(11,19)}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="80px">
                        <template slot-scope="scope">
                          <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                   <i
                            class="hover-i el-icon-edit-outline"
                            @click="notifyDialog('update',scope.row)"
                          ></i>
                      
</el-tooltip >  
                       
                          <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                
                      <i
                            style="margin-left:20px"
                            class="hover-i el-icon-delete"
                            @click="deleteNotify(scope.row)"
                          ></i>
</el-tooltip >  
                          
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <!-- <el-main class="box-main">
                    <el-table :data="notifyData" empty-text="暂无数据" border>
                      <el-table-column prop="title" label="标题" min-width="1"></el-table-column>
                      <el-table-column label="是否发布" width="100px">
                        <template slot-scope="scope">
                          <div>{{scope.row.isPublish?"是":"否"}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="发布时间" width="200px">
                        <template slot-scope="scope">
                          <div>{{scope.row.createdTime.substring(0,10)+" "+scope.row.createdTime.substring(11,19)}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="80px">
                        <template slot-scope="scope">
                          <i
                            class="hover-i el-icon-edit-outline"
                            @click="notifyDialog('update',scope.row)"
                          ></i>
                          <i
                            style="margin-left:20px"
                            class="hover-i el-icon-delete"
                            @click="deleteNotify(scope.row)"
                          ></i>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-main> -->
               
              
            </el-tab-pane>
            <el-tab-pane name="个人门户" label="新闻">
                <div style="width:100%" v-loading="newsLoad">
                 
                    <el-table :data="newsData" empty-text="暂无数据" border>
                      <el-table-column prop="title" label="标题" min-width="1"></el-table-column>
                      <el-table-column label="新闻类型" width="100px">
                        <template slot-scope="scope">
                          <div v-if="scope.row.newsType == 1">普通新闻</div>
                          <div v-if="scope.row.newsType == 2">图片新闻</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="是否发布" width="100px">
                        <template slot-scope="scope">
                          <div>{{scope.row.isPublish?"是":"否"}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="发布时间" width="200px">
                        <template slot-scope="scope">
                          <div>{{scope.row.createdTime.substring(0,10)+" "+scope.row.createdTime.substring(11,19)}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="80px">
                        <template slot-scope="scope">
                          <!-- <el-button
                      type="success"
                      size="small"
                      @click="newsDialog('update',scope.row)"
                    >编辑</el-button>
                          <el-button type="danger" size="small" @click="deleteNews(scope.row)">删除</el-button>--> 
  <el-tooltip class="i-tips" effect="light" placement="bottom" content="编辑" >  
                      <i
                         
                            class="hover-i el-icon-edit-outline"
                            @click="newsDialog('update',scope.row)"
                          ></i>
    </el-tooltip>

                       <el-tooltip class="i-tips" effect="light" placement="bottom" content="删除" >  
                          <i
                          
                            style="margin-left:20px"
                            class="hover-i el-icon-delete"
                            @click="deleteNews(scope.row)"
                          ></i>

  </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                 
                </div>
            </el-tab-pane>
          </el-tabs>
          <el-dialog
            :title="notifyState == 'add'?'添加通知':'编辑通知'"
            :visible.sync="notifyVisible"
            :close-on-click-modal="false"
            width="80%"
            center
          >
            <el-form :model="notifyForm" label-width="70px" v-if="notifyVisible">
              <el-form-item label="标题">
                <el-input v-model="notifyForm.title"></el-input>
              </el-form-item>
              <div class="editor-box">
                <div class="editor-label">内容</div>
                <div class="editor-content">
                  <!-- <quill-editor
              v-model="notifyForm.content"
              ref="myQuillEditor"
              class="quill-editor"
              :options="notifyOption"
                  ></quill-editor>-->
                  <div>
                    <edit v-model="notifyForm.content"></edit>
                  </div>
                </div>
              </div>
              <el-form-item label="是否发布">
                <el-select v-model="notifyForm.isPublish" placeholder="请选择">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
              <div style="text-align:right" slot="footer" class="dialog-footer">
              <el-button type="danger" @click="notifyVisible=false" v-if="notifyState == 'add'">取消</el-button>
              <el-button  @click="addNotify('add')" v-if="notifyState == 'add'">确定</el-button>
           
               <el-button type="danger" @click="notifyVisible=false"  v-if="notifyState == 'update'">取消</el-button>
              <el-button
               
                @click="addNotify('update')"
                v-if="notifyState == 'update'"
              >修改</el-button>
            </div>
          </el-dialog>
          <el-dialog
            :title="newsState == 'add'?'添加新闻':'编辑新闻'"
            :visible.sync="newsVisible"
            :close-on-click-modal="false"
            width="80%"
            center
          >
            <el-form :model="newsForm" label-width="70px" v-if="newsVisible">
              <el-form-item label="标题">
                <el-input v-model="newsForm.title"></el-input>
              </el-form-item>
              <div class="editor-box">
                <div class="editor-label">内容</div>
                <div class="editor-content">
                  <!-- <quill-editor
              v-model="newsForm.content"
              ref="myQuillEditor"
              class="quill-editor"
              :options="newsOption"
                  ></quill-editor>-->
                  <div>
                    <edit v-model="newsForm.content"></edit>
                  </div>
                </div>
              </div>
              <el-form-item label="是否发布">
                <el-select v-model="newsForm.isPublish" placeholder="请选择">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="新闻类别">
                <el-select v-model="newsForm.newsType" placeholder="请选择">
                  <el-option label="普通新闻" :value="1"></el-option>
                  <el-option label="图片新闻" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择图片" v-if="newsForm.newsType == 2">
                <el-upload
                  class="avatar-uploader"
                  :action="`${$http.defaults.url_base}/pst-v2-api/v2/file/uploadImg`"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="newsForm.picUrl" :src="newsForm.picUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-form>
            <div style="text-align:right" slot="footer" class="dialog-footer">
                <el-button type="danger" v-if="newsState == 'add'"  @click="newsVisible=false" >取消</el-button>
              <el-button  @click="addNews('add')" v-if="newsState == 'add'">确定</el-button>
               <el-button type="danger" v-if="newsState == 'update'"  @click="newsVisible=false" >取消</el-button>
              <el-button  @click="addNews('update')" v-if="newsState == 'update'">修改</el-button>
            </div>
          </el-dialog>
      
      </div>
    </div>
  </el-container>
</template>

<script>
import "@/styles/Dashboard/manage.scss";
import { quillEditor } from "vue-quill-editor";
import edit from "@/components/edit";

export default {
  name: "manage",
  components: {
    edit
  },
  data() {
    return {
      //通知
      activeName: "个人门户",
      notifyLoad: false,
      notifyData: [],
      notifyTotal: 0,
      notifyRequest: {
        pageNum: 1,
        pageSize: 5,
        paramData: {}
      },
      //通知弹窗
      notifyVisible: false,
      notifyState: "add",
      notifyForm: {
        title: "",
        content: "",
        isPublish: true
      },
      notifyOption: {},
      //公司新闻
      newsLoad: false,
      newsData: [],
      newsTotal: 0,
      newsRequest: {
        pageNum: 1,
        pageSize: 5,
        paramData: {}
      },
      //公司新闻弹窗
      newsVisible: false,
      newsState: "add",
      newsForm: {
        title: "",
        content: "",
        isPublish: true,
        newsType: 1,
        picUrl: ""
      },
      newsOption: {}
    };
  },
  mounted() {
    this.getNotifyData();
    this.getNewsData();
  },
  methods: {
    //通知弹窗
    notifyDialog(val, row) {
      this.notifyState = val;
      this.notifyVisible = true;
      if (this.notifyState == "update") {
        this.$http.get("/notify/" + row.id).then(res => {
          this.notifyForm = {
            title: row.title,
            content: res.data.content,
            isPublish: row.isPublish,
            id: row.id
          };
        });
      } else if (this.notifyState == "add") {
        this.notifyForm = {
          title: "",
          content: "",
          isPublish: true
        };
      }
    },
    //--添加/修改--通知
    addNotify(val) {
      if (this.notifyForm.title && this.notifyForm.content) {
        console.log(this.notifyForm);
        if (val == "add") {
          this.$http.post("/notify/add", this.notifyForm).then(res => {
            this.notifyVisible = false;
            this.$notify({
              title: "成功",
              message: "通知添加成功",
              type: "success"
            });
            this.getNotifyData();
          });
        } else if (val == "update") {
          this.$http.post("/notify/update", this.notifyForm).then(res => {
            this.notifyVisible = false;
            this.$notify({
              title: "成功",
              message: "通知详情修改成功",
              type: "success"
            });
            this.getNotifyData();
          });
        }
      } else {
        this.$message({
          message: "标题和内容不能为空",
          type: "warning"
        });
      }
    },
    //删除通知
    deleteNotify(row) {
      this.$confirm("该通知将被删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.notifyLoad = true;
          this.$http
            .post("/notify/delete", {
              id: row.id
            })
            .then(res => {
              this.$notify({
                title: "成功",
                message: "该通知已被删除",
                type: "success"
              });
              this.notifyCurrentChange(1);
            });
        })
        .catch(() => {});
    },
    //通知当前页
    notifyCurrentChange(val) {
      this.notifyRequest.pageNum = val;
      //console.log(`当前页: ${this.notifyRequest.pageNum}`);
      this.getNotifyData();
    },
    //通知每页条数
    notifySizeChange(val) {
      this.notifyRequest.pageSize = val;
      //console.log(`每页 ${this.ntifyRequest.pageSize} 条`);
      this.notifyCurrentChange(1);
    },
    //获取通知
    getNotifyData() {
      this.notifyLoad = true;
      this.$http.post("/notify/pager", this.notifyRequest).then(res => {
        this.notifyTotal = res.data.pagination.totalCount;
        this.notifyData = res.data.resultData;
        this.notifyLoad = false;
      });
    },

    //公司新闻弹窗
    newsDialog(val, row) {
      this.newsState = val;
      this.newsVisible = true;
      if (this.newsState == "update") {
        this.$http.get("/news/" + row.id).then(res => {
          this.newsForm = {
            title: row.title,
            content: res.data.content,
            isPublish: row.isPublish,
            newsType: row.newsType,
            picUrl: row.picUrl,
            id: row.id
          };
          console.log(this.newsForm);
        });
      } else if (this.newsState == "add") {
        this.newsForm = {
          title: "",
          content: "",
          isPublish: true,
          newsType: 1,
          picUrl: ""
        };
      }
    },
    //图片上传成功
    handleAvatarSuccess(res) {
      //this.newsForm.picUrl = URL.createObjectURL(file.raw);
      this.newsForm.picUrl = res.data[0];
    },
    //图片上传前验证
    beforeAvatarUpload(file) {
      //const isJPG = file.type === 'image/jpeg';
      let isJPG = ["image/jpg", "image/png", "image/jpeg"].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传的图片只能是 JPG,JPEG,PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //--添加/修改--公司新闻
    addNews(val) {
      if (this.newsForm.title && this.newsForm.content) {
        if (this.newsForm.newsType == 2 && !this.newsForm.picUrl) {
          this.$message({
            message: "图片新闻必须上传图片",
            type: "warning"
          });
        } else {
          if (this.newsForm.newsType == 1) {
            this.newsForm.picUrl = "";
          }
          if (val == "add") {
            this.$http.post("/news/add", this.newsForm).then(res => {
              this.newsVisible = false;
              this.$notify({
                title: "成功",
                message: "公司新闻添加成功",
                type: "success"
              });
              this.getNewsData();
            });
          } else if (val == "update") {
            this.$http.post("/news/update", this.newsForm).then(res => {
              this.newsVisible = false;
              this.$notify({
                title: "成功",
                message: "公司新闻详情修改成功",
                type: "success"
              });
              this.getNewsData();
            });
          }
        }
      } else {
        this.$message({
          message: "标题和内容不能为空",
          type: "warning"
        });
      }
    },
    //删除公司新闻
    deleteNews(row) {
      this.$confirm("该公司新闻将被删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.newsLoad = true;
          this.$http
            .post("/news/delete", {
              id: row.id
            })
            .then(res => {
              this.$notify({
                title: "成功",
                message: "该公司新闻已被删除",
                type: "success"
              });
              this.newsCurrentChange(1);
            });
        })
        .catch(() => {});
    },
    //公司新闻当前页
    newsCurrentChange(val) {
      this.newsRequest.pageNum = val;
      //console.log(`当前页: ${this.newsRequest.pageNum}`);
      this.getNewsData();
    },
    //公司新闻每页条数
    newsSizeChange(val) {
      this.newsRequest.pageSize = val;
      //console.log(`每页 ${this.newsRequest.pageSize} 条`);
      this.newsCurrentChange(1);
    },
    //获取公司新闻
    getNewsData() {
      this.newsLoad = true;
      this.$http.post("/news/pager", this.newsRequest).then(res => {
        this.newsTotal = res.data.pagination.totalCount;
        this.newsData = res.data.resultData;
        this.newsLoad = false;
      });
    }
  }
};
</script>
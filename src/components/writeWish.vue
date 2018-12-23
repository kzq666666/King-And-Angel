<template>
  <div class="writeWish">
    <div class="wishWrp">
      <el-input
        type="textarea"
        :rows="6"
        placeholder="写下你的圣诞心愿吧，也许就有小天使帮你实现了呢！"
        v-model="wish"
      >
      </el-input>
      <el-button class="start_button" type="primary" @click="go_main"
        >写好了</el-button
      >
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        wish: ""
      };
    },
    methods: {
      go_main() {
        if (!this.wish) {
          this.$message({
            type: "warning",
            center: true,
            message: "请写下你的小愿望"
          });
        } else {
          this.$confirm("填写愿望之后就不能更改了哦，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          }).then(() => {
            this.$http
              .post(localStorage.url + "/api/king-and-angle/wish", {
                wish: this.wish
              })
              .then(res => {
                localStorage.wish = this.wish;
                this.$router.push("/");
              });
          });
        }
      }
    },
    created() {
      if (localStorage.wish) {
        this.$router.push("/");
      }
    }
  };
</script>
<style>
  .writeWish {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(../assets/wishBG.jpg);
    background-size: cover;
  }
  .writeWish {
    text-align: center;
  }
  .writeWish textarea {
    resize: none;
    border-radius: 1rem;
    opacity: 0.5;
  }
  .el-textarea {
    width: 75%;
    font-size: 17px;
    border-radius: 1rem;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.24);
  }
  .writeWish .start_button {
    font-size: 1.2rem;
    margin-top: 3.5rem;
  }
  .el-message-box{
    width: 85%;
  }
</style>

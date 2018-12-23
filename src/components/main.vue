<template>
  <div class="main">
    <div class="king" :class="{overTurn:isTurn}">
      <i class="el-icon-refresh" @click="turn"></i>
      <img src="../assets/exit.png" alt="退出" class="exit" @click="exit"/>
      <!-- <span>溜 </span> -->
      <div class="avator"></div>
      <div class="kingDetail">
        <div class="myKing">
          <el-button type="primary">我的国王</el-button>
          <div id="king">{{ king }}</div>
        </div>
        <div class="kingWish">
          <el-button type="danger">ta的心愿</el-button>
          <div id="hisWish">{{ kingWish }}</div>
        </div>
      </div>
      <div class="mainButton">
        <el-button type="danger" class="dailyTask" @click="dialogVisible=true"
          >圣诞祝福</el-button
        >
        <el-button type="primary" @click="goChat('king')">聊聊</el-button>
      </div>
    </div>
    <div class="angle" :class="{overTurn:!isTurn}">
      <i class="el-icon-refresh" @click="turn"></i>
      <img src="../assets/exit.png" alt="退出" class="exit" @click="exit"/>
      <div class="avator"></div>
      <div class="angleDetail">
        <div class="myAngle">
          <el-button type="primary">我的小天使</el-button>
          <div id="angle">XXX</div>
        </div>
        <div class="angleWish">
          <el-button type="danger">我的心愿</el-button>
          <div class="myWish">{{ myWish }}</div>
        </div>
      </div>
      <div class="mainButton">
        <el-button type="danger" class="dailyTask" @click="showRecWish=true"
          >收到的祝福</el-button
        >
        <el-button type="primary" @click="goChat('angle')">聊聊</el-button>
      </div>
    </div>
    <el-dialog
      title="🎄圣诞祝福"
      :visible.sync="dialogVisible"
      width="80%"
      top="50%"
      class="myDialog"
    >
      <el-input
        type="textarea"
        :rows="3"
        placeholder="写下你对国王的圣诞祝福吧~"
        v-model="blessing"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendBless">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="来自你的小天使的祝福"
      :visible.sync="showRecWish"
      width="80%"
      top="50%"
      class="mydialog"
    >
      <div id="recWish">{{ angleBless }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRecWish = false">取 消</el-button>
        <el-button type="primary" @click="showRecWish = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isTurn: false,
        dialogVisible: false,
        showRecWish: false,
        king: "",
        kingUsername: "",
        kingWish: "",
        angle: "",
        angleUsername: "",
        myWish: "",
        angleBless: "",
        blessing: ""
      };
    },
    methods: {
      turn() {
        this.myWish = localStorage.wish;
        this.isTurn = !this.isTurn;
      },
      exit(){
        localStorage.clear();
        this.$router.push('/login')
      },
      goChat(obj) {
        localStorage.chatType = obj;
        this.$router.push("/chat");
      },
      sendBless() {
        this.dialogVisible = false;
        this.$http
          .post(localStorage.url + "/api/blessing/king", {
            blessing: this.blessing
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                center: true,
                message: "你的国王会收到你的圣诞祝福，如需修改，再次发送即可"
              });
            }
          });
      }
    },
    created() {
      localStorage.url = "https://king-api.ncu204.com";
      this.$http
        .get(localStorage.url + "/api/king-and-angle/king", {
          headers: { Authorization: localStorage.token }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.king = res.data.data.king;
            this.kingWish = res.data.data.king_wish
              ? res.data.data.king_wish
              : "暂无";
            this.kingUsername = res.data.data.king_username;
            localStorage.kingName = this.king;
            localStorage.kingUsername = this.kingUsername;
          } else if (res.data.message == "授权已过期") {
            localStorage.clear();
            this.$router.push("/");
          }
        });
      this.$http
        .get(localStorage.url + "/api/king-and-angle/angle", {
          headers: { Authorization: localStorage.token }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.angle = res.data.data.angle_name;
            this.angleBless = res.data.data.angle_blessing;
            this.angleUsername = res.data.data.angle_username;
            localStorage.angleName = this.angle;
            localStorage.angleUsername = this.angleUsername;
          } else if (res.data.message == "授权已过期") {
            localStorage.clear();
            this.$router.push("/");
          }
        });
    }
  };
</script>
<style>
  .main {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: url(../assets/mainBG.jpg);
    background-size: contain;
  }
  .exit {
    position: absolute;
    width: 2rem;
    left: 1.3rem;
    top: 1rem;
  }
  .king,
  .angle {
    position: absolute;
    top: 3rem;
    bottom: 3rem;
    left: 1.5rem;
    right: 1.5rem;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.24);
    text-align: center;
    transition: all 1s ease;
    backface-visibility: hidden;
    background: url(../assets/kingBG.jpg);
    background-size: cover;
  }
  .angle {
    background: url(../assets/angleBG.jpg);
    background-size: cover;
  }
  .el-icon-refresh {
    position: absolute;
    font-size: 1.5rem;
    right: 1rem;
    top: 1rem;
  }

  .kingDetail,
  .angleDetail {
    width: 100%;
    font-size: 1.1rem;
    text-align: center;
  }
  .myKing button,
  .kingWish button,
  .myAngle button,
  .angleWish button {
    width: 40%;
    font-size: 1.1rem;
    padding: 0;
    height: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  #king,
  #angle {
    font-weight: bold;
    font-size: 1.5rem;
    vertical-align: text-top;
  }
  #hisWish,.myWish{
    color: #ffcdd2;
    font-weight: bold;
    font-size: 1.2rem;
  }
  .avator {
    display: inline-block;
    width: 9rem;
    height: 9rem;
    border-radius: 50%;
    margin: 2rem 0;
  }

  .myKing,
  .myAngle {
    margin-bottom: 1rem;
  }
  .is-light {
    width: 30%;
  }
  .mainButton {
    width: 100%;
    position: absolute;
    bottom: 1.8rem;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
  }
  .mainButton button {
    width: 7rem;
  }
  .dailyTask {
    margin-right: 2rem;
  }
  .showAngle {
    height: 1.5rem;
    width: 2.6rem;
    padding: 0;
    line-height: 1.5rem;
  }

  .main .el-textarea {
    width: 100%;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__footer button {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
  .overTurn {
    transform: rotateY(180deg);
  }
  #recWish {
    font-size: 1.2rem;
    text-indent: 2rem;
    color: brown;
  }
  .king .avator {
    background: url(../assets/king.png);
    background-size: cover;
  }
  .angle .avator {
    background: url(../assets/angel.png);
    background-size: contain;
  }
  .main .el-dialog{
    background:salmon;
  }
  .main .el-dialog textarea{
    opacity: 0.7;
  }
</style>

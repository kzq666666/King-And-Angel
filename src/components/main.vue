<template>
  <div class="main">
    <div class="king" :class="{overTurn:isTurn}">
      <i class="el-icon-refresh" @click="turn"></i>
      <img src="../assets/exit.png" alt="退出" class="exit" @click="exit" />
      <div class="avator"></div>
      <div class="kingDetail">
        <div class="myKing">
          <el-button type="primary">我的国王</el-button>
          <div id="king"></div>
        </div>
        <div class="kingWish">
          <el-button type="danger"
            >TA的心愿
            <i
              :class="{'el-icon-error':hisFinished==false,'el-icon-success':hisFinished==true}"
            ></i>
          </el-button>
          <div class="hisWish">{{ kingWish }}</div>
        </div>
      </div>
      <div class="mainButton">
        <el-button type="danger" class="dailyTask" @click="dialogVisible=true"
          >圣诞祝福</el-button
        >
        <el-button type="primary" @click="goChat('king')">聊一聊</el-button>
      </div>
    </div>
    <div class="angel" :class="{overTurn:!isTurn}">
      <i class="el-icon-refresh" @click="turn"></i>
      <img src="../assets/exit.png" alt="退出" class="exit" @click="exit" />
      <div class="avator"></div>
      <div class="angelDetail">
        <div class="myangel">
          <el-button type="primary">我的小天使</el-button>
          <div id="angel"></div>
        </div>
        <div class="angelWish">
          <el-button type="danger" @click="changeWishState"
            >我的心愿
            <i
              :class="{'el-icon-error':isFinished==false,'el-icon-success':isFinished==true}"
            ></i>
          </el-button>
          <div class="myWish">{{ myWish }}</div>
        </div>
      </div>
      <div class="mainButton">
        <el-button type="danger" class="dailyTask" @click="showRecWish=true"
          >收到的祝福</el-button
        >
        <el-button type="primary" @click="goChat('angel')">聊一聊</el-button>
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
      <div id="recWish">{{ angelBless }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRecWish = false">取 消</el-button>
        <el-button type="primary" @click="showRecWish = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { Lottery } from "../Lottery.js";
  export default {
    data() {
      return {
        isTurn: false,
        dialogVisible: false,
        showRecWish: false,
        king: "",
        kingUsername: "",
        kingWish: "",
        angel: "",
        angelUsername: "",
        myWish: "",
        angelBless: "",
        blessing: "",
        isFinished: null,
        hisFinished: null,
        kingLottery: null,
        angelLottery: null
      };
    },
    methods: {
      turn() {
        this.myWish = localStorage.wish;
        this.isTurn = !this.isTurn;
      },
      exit() {
        localStorage.clear();
        this.$router.push("/login");
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
      },
      changeWishState() {
        let op = !this.isFinished;
        this.$http
          .post(
            localStorage.url + "/api/king-and-angle/wish_status",
            { wish_status: Number(op) },
            { headers: { Authorization: localStorage.token } }
          )
          .then(res => {
            if (res.data.code == 0) {
              this.isFinished = !this.isFinished;

              if (this.isFinished) {
                this.$message.success("你的愿望被实现了(￣▽￣)！");
              } else {
                this.$message.error("你的愿望还没实现呢(￣、￣)");
              }
            }
          });
      },
      returnData(data) {
        return this.data;
      }
    },
    created() {},
    mounted() {
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
              : "TA暂时还没填写";
            this.kingUsername = res.data.data.king_username;
            localStorage.kingName = this.king;
            localStorage.kingUsername = this.kingUsername;
            this.kingLottery = new Lottery(
              "king",
              "#CCC",
              "color",
              120,
              30,
              "#b94747"
            );
            this.kingLottery.init(localStorage.kingName, "text");
            this.hisFinished =
              res.data.data.king_wish_status == 1 ? true : false;
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
            this.angel = res.data.data.angle_name;
            this.angelBless = res.data.data.angle_blessing;
            this.angelUsername = res.data.data.angle_username;
            localStorage.angelName = this.angel;
            localStorage.angelUsername = this.angelUsername;
            this.angelLottery = new Lottery(
              "angel",
              "#CCC",
              "color",
              120,
              30,
              "#16427f"
            );

            this.angelLottery.init(localStorage.angelName, "text");
          } else if (res.data.message == "授权已过期") {
            localStorage.clear();
            this.$router.push("/");
          }
        });
      this.$http
        .get(localStorage.url + "/api/king-and-angle/wish", {
          headers: { Authorization: localStorage.token }
        })
        .then(res => {
          this.isFinished = res.data.wish_status == 1 ? true : false;
        });

      if (!localStorage.token) {
        this.$router.push("/login");
      }
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
    overflow: hidden;
  }
  .exit {
    position: absolute;
    width: 2rem;
    left: 1.3rem;
    top: 1rem;
  }
  .king,
  .angel {
    position: absolute;
    top: 1.2rem;
    bottom: 1.2rem;
    left: 1.5rem;
    right: 1.5rem;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.24);
    text-align: center;
    transition: all 1s ease;
    backface-visibility: hidden;
    background: url(../assets/kingBG.jpg);
    background-size: cover;
  }
  .angel {
    background: url(../assets/angelBG.jpg);
    background-size: cover;
  }
  .el-icon-refresh {
    position: absolute;
    font-size: 1.5rem;
    right: 1rem;
    top: 1rem;
  }

  .kingDetail,
  .angelDetail {
    width: 100%;
    font-size: 1.1rem;
    text-align: center;
  }
  .myKing button,
  .kingWish button,
  .myangel button,
  .angelWish button {
    width: 40%;
    font-size: 1.1rem;
    padding: 0;
    height: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  #king,
  #angel {
    position: relative;
    width: 120px;
    height: 50px;
    margin: 0 auto;
  }
  .hisWish,
  .myWish {
    width: 100%;
    color: #ffeb3b;
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
  .avator {
    display: inline-block;
    width: 9rem;
    height: 9rem;
    border-radius: 50%;
    margin: 2rem 0;
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
  .showangel {
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
  .angel .avator {
    background: url(../assets/angel.png);
    background-size: contain;
  }
  .main .el-dialog {
    background: salmon;
  }
  .main .el-dialog textarea {
    opacity: 0.7;
  }
</style>

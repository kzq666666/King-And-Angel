<template>
  <div id="chat">
    <div class="chatHeader">
      <i class="el-icon-arrow-left" @click="back"></i>
      <div class="chatKing " :class="{chatActive:curObj=='king',online:kingState==0}" @click="chat('king')">
        <span>国王</span>
        <span class="outline" v-if="kingState">（离线）</span>
      </div>
      <div class="chatAngel" :class="{chatActive:curObj=='angel',online:angelState==0}" @click="chat('angel')">
        <span>天使</span>
        <span class="outline" v-if="angelState">（离线）</span>
      </div>
    </div>
    <div class="chatBody" v-if="curObj=='king'">
      <div class="message" v-for="(item, index) in kingMessage" :key="index">
        <div class="self" v-if="item.from == 'self'">
          <div class="time">{{item.time}}</div>
          <div class="chatBubble">{{ item.msg }}</div>
          <div class="temp"></div>
          <div class="selfAvtor angelAvator"></div>
        </div>
        <div class="others" v-else>
          
          <div class="selfAvtor kingAvator"></div>
          <div class="temp"></div>
          <div class="chatBubble">{{ item.msg }}</div>
          <div class="time">{{item.time}}</div>
        </div>
      </div>
    </div>
    <div class="chatBody" v-if="curObj=='angel'">
        <div class="message" v-for="(item, index) in angelMessage" :key="index">
          <div class="self" v-if="item.from == 'self'">
            <div class="time">{{item.time}}</div>
            <div class="chatBubble">{{ item.msg }}</div>
            <div class="temp"></div>
            <div class="selfAvtor kingAvator"></div>
          </div>
          <div class="others" v-else>
            <div class="time">{{item.time}}</div>
            <div class="selfAvtor angelAvator"></div>
            <div class="temp"></div>
            <div class="chatBubble">{{ item.msg }}</div>
          </div>
        </div>
      </div>
    <div class="chatFooter">
      <el-input
        type="text"
        v-model="msg.message"
        @keydown.enter.native="send"
        autofocus
        id="sendInput"
      ></el-input>
      <el-button type="success" @click="send">发送</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        socket: null,
        kingName:localStorage.kingName,
        angelName:localStorage.angelName,
        authortaion: {
          token: null
        },
        curObj:'king',
        kingMessage: [],
        kingState:null,
        angelMessage:[],
        angelState:null,
        msg: {
          from: "",
          to: "",
          message: "",
          send_time:null
        },
        reg: /^\s*\s*$/g,
        kingCurTime:null,
        angelCurTime:null
        // chatAvtor:'url'
      };
    },
    methods: {
      back() {
        this.$router.push("/");
      },
      chat(obj){
        this.curObj = obj;
      },
      initWebsocket() {
        this.socket = new WebSocket("wss://king-api.ncu204.com/ws");
        // this.socket = new WebSocket("ws://192.168.1.105:8003/ws")
        this.socket.onopen = this.socketOpen;
        this.socket.onclose = this.socketClose;
        this.socket.onmessage = this.socketMessage;
        this.authortaion.token = localStorage.token;
      },
      socketOpen() {
        this.socketSend(this.authortaion);
        console.log(new Date().toLocaleString() + " connection open");
        let that = this;
        setInterval(function(){
          that.socketSend({type:'ping',username:localStorage.kingUsername});
          that.socketSend({type:'ping',username:localStorage.angelUsername});
          that.socketSend({type:'ping',username:localStorage.myUsername});
        },1000)
      },
      socketClose() {
        console.log(new Date().toLocaleString() + " connection closed");
      },
      socketMessage(e) {
        let data = JSON.parse(e.data);
        if(data.code==1){
          this.$message({
            type:'error',
            message:'对方不在线，无法接受你的消息',
            duration:1500,
            center:true
          });
        }
        if (data.from==localStorage.kingUsername) {
          if(data.send_time){
            let time = new Date(data.send_time*1000);
            let minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
            let curDateTime = (time.getMonth()+1)+'月'+time.getDate()+'日'+time.getHours()+':'+minutes;
            this.kingMessage.push({ msg: data.message, from: "king",time:curDateTime });
          }else{
            this.kingMessage.push({ msg: data.message, from: "king"});
          }
          // this.kingMessage.push({ msg: data.message, from: "king" });
        }else if(data.from==localStorage.angelUsername){
          
          if(data.send_time){
            let time = new Date(data.send_time*1000);
            let minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
            let curDateTime = (time.getMonth()+1)+'月'+time.getDate()+'日'+time.getHours()+':'+minutes;
            this.angelMessage.push({ msg: data.message, from: "angel",time:curDateTime });
          }else{
            this.angelMessage.push({ msg:data.message,from:"angel"})
          }
        }else if(data.from == localStorage.myUsername && data.to == localStorage.kingUsername){
          if(data.send_time){
            let time = new Date(data.send_time*1000);
            let minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
            let curDateTime = (time.getMonth()+1)+'月'+time.getDate()+'日'+time.getHours()+':'+minutes;
            this.kingMessage.push({ msg: data.message, from: "self",time:curDateTime });
          }else{
            this.kingMessage.push({ msg:data.message,from:"self"})
          }
        }else if(data.from == localStorage.myUsername && data.to == localStorage.angelUsername){
          if(data.send_time){
            let time = new Date(data.send_time*1000);
            let minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
            let curDateTime = (time.getMonth()+1)+'月'+time.getDate()+'日'+time.getHours()+':'+minutes;
            this.angelMessage.push({ msg: data.message, from: "self",time:curDateTime });
          }else{
            this.angelMessage.push({ msg:data.message,from:"self"})
          }
        }
        if(data.username==localStorage.kingUsername){
          
          this.kingState = data.online;
        }else if(data.username==localStorage.angelUsername){
          this.angelState = data.online;
        }
        if(localStorage.angelUsername==localStorage.kingUsername){
          this.angelState = this.kingState;
        }
      },
      socketSend(data) {
        this.socket.send(JSON.stringify(data));
      },
      send() {
        let input = document.getElementById("sendInput");
        if (!this.msg.message) {
          this.$message.error("消息不能为空");
          input.focus();
        } else {
          if(this.curObj=="king"){
            this.msg.to = localStorage.kingUsername;
            let time = new Date();
            if(!this.kingCurTime || time.getTime()-this.kingCurTime.getTime()>60000){
              this.kingCurTime = time;
              let minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
              let curDateTime = (time.getMonth()+1)+'月'+time.getDate()+'日'+time.getHours()+':'+minutes;
              this.msg.send_time = parseInt(time.getTime()/1000)
              this.kingMessage.push({ msg: this.msg.message, from: "self",time: curDateTime});
            }else{
              this.msg.send_time = Number(0);
              this.kingMessage.push({ msg: this.msg.message, from: "self"});
            }
          }else if(this.curObj=="angel"){
            this.msg.to = localStorage.angelUsername;
            let time = new Date();
            if(!this.angelCurTime || time.getTime()-this.angelCurTime.getTime()>60000){
              this.angelCurTime = time;
              let minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
              let curDateTime = (time.getMonth()+1)+'月'+time.getDate()+'日'+time.getHours()+':'+minutes;
              this.msg.send_time = parseInt(time.getTime()/1000)
              this.angelMessage.push({ msg: this.msg.message, from: "self",time: curDateTime});
            }else{
              this.msg.send_time = Number(0);
              this.angelMessage.push({ msg: this.msg.message, from: "self"});
            }
          }
          this.socketSend(this.msg);
          this.msg.message = null;
          input.focus();
        }
      }
    },
    created() {
      this.curObj = localStorage.chatType;
      this.msg.from = localStorage.myUsername;
    },
    mounted() {
      this.initWebsocket();
      
    },
    updated() {
      this.$nextTick(function() {
        var chatBody = document.querySelector(".chatBody");
        chatBody.scrollTop = chatBody.scrollHeight;
      });
    }
  };
</script>

<style>
  #chat {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url(../assets/mainBG.jpg);
    background-size: cover;
  }
  #chat::-webkit-scrollbar{
    display: none;
  }
  .el-icon-arrow-left {
    position: absolute;
    font-size: 1.5rem;
    line-height: 3rem;
    left: 0.5rem;
  }
  .chatHeader {
    display: flex;
    text-align: center;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    font-size: 1.2rem;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  }
  .chatKing{
    width: 50%;
    color: grey;
  }
  .chatAngel{
    width: 50%;
    color: grey;
  }
  .online{
    color: #67c23a;
  }
  .chatActive{
    border-bottom:2px solid #f44336; 
  }
  .kingAvator{
    background: url(../assets/king.png);
    background-size:cover;
  }
  .angelAvator{
    background: url(../assets/angel.png);
    background-size:cover;
  }
  /* body */
  .chatBody {
    width: 100%;
    height: calc(100% - 3rem - 4rem);
    overflow: scroll;
  }
  .message {
    position: relative;
    width: 100%;
    /* height: 4rem; */
    padding-top: 0.5rem;
    margin-bottom: 0.1rem;
  }
  .time {
    text-align: center;
    margin: 0 0.3rem 0.3rem 0;
    color: #9e9e9e;
  }
  .self,
  .others {
    /* position: absolute; */
    display: flex;
    align-items: center;
  }
  .self {
    justify-content: flex-end;
  }
  .others {
    justify-content: flex-start;
  }
  .selfAvtor,
  .othersAvtor {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  
  .chatBubble {
    display: inline-block;
    /* height: 2.5rem; */
    max-width: 15rem;
    min-height: 1.5rem;
    line-height: 2.2rem;
    background-color: rgb(198, 205, 243);
    font-size: 16px;
    color: rgb(58, 58, 58);
    border-radius: 10px;
    padding: 0 1rem;
  }
  .temp {
    display: inline-block;
    border-left: 10px solid rgb(198, 205, 243);
    border-bottom: 10px solid #32322a03;
    margin-right: 0.2rem;
  }
  .others .temp {
    border-left: none;
    border-right: 10px solid rgb(198, 205, 243);
    margin-right: 0;
    margin-left: 0.2rem;
  }

  /* footer */
  .chatFooter {
    position: absolute;
    width: 100%;
    height: 4rem;
    bottom: 0;
    padding: 6px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #f4f4f4;
  }
  .chatFooter .el-input {
    margin-right: 0.5rem;
  }
  .chatFooter .el-input input {
    font-size: 1rem;
    border-radius: 0.5rem;
  }
  .chatFooter button {
    font-size: 1rem;
    border-radius: 0.5rem;
  }
  
</style>

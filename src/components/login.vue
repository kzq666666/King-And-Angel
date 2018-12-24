<template>
  <div class="login">
    <el-form class="loginForm"  :model="loginForm">
      <el-form-item>
        <el-input
          class="stuId"
          placeholder="学号"
          v-model="loginForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          id="password"
          type="password"
          placeholder="密码（初始密码和学号相同）"
          v-model="loginForm.password"
          @keydown.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-button class="start_button" type="primary" @click="login">Start!</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sId: null,
        loginForm:{
            username:null,
            password:null
        }
      };
    },
    methods: {
      login(){
        // this.$router.push({
        //   name:'changePWD'
        // })
        this.$http.post(localStorage.url+'/api/user/token',this.loginForm).then(
          (res)=>{
            if(res.data.code == 0){
              localStorage.myUsername = this.loginForm.username;
              localStorage.wish = res.data.wish;
              localStorage.token = res.data.token;
              localStorage.isInitial = res.data.isInitial;
              this.$message({
                type:'success',
                message:'登录成功，欢迎来到国王与天使的活动',
                center:true,
                duration:1500
              })
              if(localStorage.isInitial == 'true'){
                this.$router.push('/changePWD');
              }else if(localStorage.isInitial == 'false' && !localStorage.wish){
                this.$router.push('/writeWish'); 
              }else{
                this.$router.push('/')
              }
                        
            }
          }
        ).catch(
          (err)=>{
            if(err){
              this.$message({
                type:'error',
                message:'学号或密码错误',
                center:true,
                duration:1500
              })
            }
          }
        )
      }
    },
    created () {
      localStorage.url = "https://king-api.ncu204.com";
      if(localStorage.token){
        this.$router.push('/writeWish')
      }
    }
  };
</script>

<style>
  .login {
    display: flex;
    width: 100%;
    height: 100%;
    text-align: center;
    background: url(../assets/loginBG.jpeg);
    background-size: cover;
    align-items: center;
    justify-content: center;
  }

  /* .logo img {
    width: 10rem;
    margin: 3rem 0 2rem 0;
  } */
  .loginForm .el-input {
    width: 100%;
    margin: 0.5rem;
  }
  .loginForm input {
    height: 3rem;
    font-size: 1.1rem;
  }
  .el-form-item__error{
      left: 16%;
      /* transform: translateX(-50%) */
  }
  .start_button {
    width: 8rem;
    height: 3rem;
    font-size: 1.5rem;
    margin-top: 2rem;
  }
</style>

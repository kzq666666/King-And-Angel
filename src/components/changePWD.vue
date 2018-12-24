<template>
  <div class="changePWD">
    <div class="changeForm">
      <el-input type="password" v-model="changeForm.password" placeholder="密码" autofocus></el-input>
      <el-input type="password" v-model="mksurePWD" placeholder="确认密码" @keydown.enter.native="changePWD"></el-input>
      <el-button type="success" @click="changePWD">改好了</el-button>
    </div>
    
  </div>
</template>
<script>
  export default {
      data () {
          return {
              mksurePWD:'',
              changeForm:{
                  password:''
              }
          }
      },
      methods:{
        changePWD(){
            if(this.mksurePWD!==this.changeForm.password){
                this.$message.error('两次输入的密码不一样');
            }else if(!this.changeForm.password){
                this.$message.error('密码不能为空');
            }else{
                this.$http.post(localStorage.url+'/api/user/password',this.changeForm,{headers:{"Authorization":localStorage.token}}).then(
                (res)=>{
                    if(res.data.code==0){
                        localStorage.isInitial = false;
                        this.$router.push('/writeWish');
                    }
                }
            )
            }
            
        }
      },
      mounted() {
          this.$message.warning('为了防止泄露身份，请修改密码');
          
      },
  };
</script>
<style>
  .changePWD {
    width: 100%;
    height: 100%;
    background: url(../assets/loginBG.jpeg);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .changeForm{
      width: 70%;
      text-align: center;
  }
  .changeForm .el-input{
      margin-bottom: 1rem;
  }
  .changeForm input{
      height: 3rem;
      font-size: 1rem;
  }
  .changeForm button{
      margin-top: 1rem;
      font-size: 1.2rem;
  }
</style>

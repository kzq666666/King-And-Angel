import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/button.css"
import "element-ui/lib/theme-chalk/input.css"
import "element-ui/lib/theme-chalk/icon.css"
import "element-ui/lib/theme-chalk/dialog.css"
import "element-ui/lib/theme-chalk/message.css"
import "element-ui/lib/theme-chalk/message.css"
import "element-ui/lib/theme-chalk/message-box.css"

import router from "./router";
import axios from "axios";
import mojs from 'mo-js'


Vue.use(ElementUI);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
localStorage.url = "https://king-api.ncu204.com"
router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    next();
  }else{
    if(!localStorage.token){
      next({path:'/login'})
    }
    next();
  }
  // if(!localStorage.token){
  //   next({path:'/login'})
  // }
})
new Vue({
  render: h => h(App),
  router,
  mojs
}).$mount("#app");

axios.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      config.headers.Authorization = localStorage.token;
    }
    return config;
  }
);

// axios.interceptors.response.use(
//   (response) =>{
//     console.log(response.data)
//     if(response.data.message=="授权已过期"){
//       console
//       this.$message.error('登录过期，请重新登录');
//       this.$router.push('/login')
//     }
//   }
// )

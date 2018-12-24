import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/button.css";
import "element-ui/lib/theme-chalk/input.css";
import "element-ui/lib/theme-chalk/icon.css";
import "element-ui/lib/theme-chalk/dialog.css";
import "element-ui/lib/theme-chalk/message.css";
import "element-ui/lib/theme-chalk/message.css";
import "element-ui/lib/theme-chalk/message-box.css";
import "element-ui/lib/theme-chalk/message-box.css";
import "element-ui/lib/theme-chalk/checkbox.css";
import "element-ui/lib/theme-chalk/loading.css";
// import { Loading } from "element-ui";
import router from "./router";
import axios from "axios";
import mojs from "mo-js";

Vue.use(ElementUI);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
localStorage.url = "https://king-api.ncu204.com";
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    if (!localStorage.token) {
      next({ path: "/login" });
    }
    next();
  }
  if (!localStorage.token) {
    next({ path: "/login" });
  }
});
new Vue({
  render: h => h(App),
  router,
  mojs
}).$mount("#app");

axios.interceptors.request.use(config => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = localStorage.token;
  }
  return config;
});
// let loadingServe = Loading.service({
//   lock: true,
//   text: "初次加载，小主人稍等片刻",
//   spinner: "el-icon-loading",
//   background: "rgba(0, 0, 0, 0.7)"
// });
let $ = {};

$.Particle = function( opt ) {
  this.radius = 7;
  this.x = opt.x;
  this.y = opt.y;
  this.angle = opt.angle;
  this.speed = opt.speed;
  this.accel = opt.accel;
  this.decay = 0.01;
  this.life = 1;
};

$.Particle.prototype.step = function( i ) {
  this.speed += this.accel;
  this.x += Math.cos( this.angle ) * this.speed;
  this.y += Math.sin( this.angle ) * this.speed;
  this.angle += $.PI / 64;
  this.accel *= 1.01;
  this.life -= this.decay;
  
  if( this.life <= 0 ) {
    $.particles.splice( i, 1 );
  }
};

$.Particle.prototype.draw = function( i ) {
  $.ctx.fillStyle = $.ctx.strokeStyle = 'hsla(' + ( $.tick + ( this.life * 120 ) ) + ', 100%, 60%, ' + this.life + ')';
  $.ctx.beginPath();
  if( $.particles[ i - 1 ] ) {
    $.ctx.moveTo( this.x, this.y );
    $.ctx.lineTo( $.particles[ i - 1 ].x, $.particles[ i - 1 ].y );
  }
  $.ctx.stroke();
  
  $.ctx.beginPath();
  $.ctx.arc( this.x, this.y, Math.max( 0.001, this.life * this.radius ), 0, $.TWO_PI );
  $.ctx.fill();
  
  var size = Math.random() * 1.25;
  $.ctx.fillRect( ~~( this.x + ( ( Math.random() - 0.5 ) * 35 ) * this.life ), ~~( this.y + ( ( Math.random() - 0.5 ) * 35 ) * this.life ), size, size );
}

$.step = function() {
  $.particles.push( new $.Particle({
    x: $.width / 2 + Math.cos( $.tick / 20 ) * $.min / 2,
    y: $.height / 2 + Math.sin( $.tick / 20 ) * $.min / 2,
    angle: $.globalRotation + $.globalAngle,
    speed: 0,
    accel: 0.01
  }));
  
  $.particles.forEach( function( elem, index ) {
    elem.step( index );
  });
  
  $.globalRotation += $.PI / 6;
  $.globalAngle += $.PI / 6;
};

$.draw = function() {
  $.ctx.clearRect( 0, 0, $.width, $.height );
  
  $.particles.forEach( function( elem, index ) {
    elem.draw( index );
  });
};

$.init = function() {
  $.canvas = document.createElement( 'canvas' );
  $.ctx = $.canvas.getContext( '2d' );
  $.width = 300;
  $.height = 300;
  $.canvas.width = $.width * window.devicePixelRatio;
  $.canvas.height = $.height * window.devicePixelRatio;
  $.canvas.style.width = $.width + 'px';
  $.canvas.style.height = $.height + 'px';
  $.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  $.min = $.width * 0.5;
  $.particles = [];
  $.globalAngle = 0;
  $.globalRotation = 0;
  $.tick = 0;
  $.PI = Math.PI;
  $.TWO_PI = $.PI * 2;
  $.ctx.globalCompositeOperation = 'lighter';
  document.body.appendChild( $.canvas );
  $.loop();
};

$.loop = function() {
  requestAnimationFrame( $.loop );
  $.step();
  $.draw();
  $.tick++;
};

$.init();
// console.log(canvas)
document.onreadystatechange = () => {
  // console.log(this)

  if (document.readyState == "complete") {
    document.body.removeChild($.canvas)
  }
};
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

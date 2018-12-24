<template>
  <div id="app" @load="loading">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: "app",
    methods: {
      loading(){
        console.log("loading")
      }
    },
    created() {
      const OPTIONS = {
        shape: "circle",
        fill: "none",
        radius: 25,
        stroke: "cyan",
        scale: {
          0: 1
        },
        easing: "cubic.out",
        top: 0,
        left: 0
      };
      let delay = 0,
        delayStep = 150;
      let circle1 = new mojs.Shape({
        ...OPTIONS,
        strokeWidth: {
          50: 0
        }
      });

      let circle2 = new mojs.Shape({
        ...OPTIONS,
        radius: 10,
        stroke: "magenta",
        strokeWidth: {
          15: 0
        },
        delay: 200
      });

      document.addEventListener("click", e => {
        let x = e.pageX,
          y = e.pageY;

        new mojs.Shape({
          ...OPTIONS,
          strokeWidth: {
            50: 0
          },
          x,
          y,
          onComplete() {
            this.el.remove();
          }
        }).play();

        new mojs.Shape({
          ...OPTIONS,
          radius: 10,
          stroke: "magenta",
          strokeWidth: {
            15: 0
          },
          delay: 200,
          x,
          y,
          onComplete() {
            this.el.remove();
          }
        }).play();
      });
      localStorage.url = "https://king-api.ncu204.com"
    }
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  html,
  body,
  #app {
    width: 100%;
    height: 100%;
  }
  #app {
    position: relative;
  }
  canvas{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%,-50%,0);
  }
</style>

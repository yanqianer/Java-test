<script setup>

</script>

<template>
  <div style="width: 100vw;height: 100vh;overflow:hidden;display: flex">
    <div style="flex:1;background-color: black">
      <el-image style="width: 100%;height: 100%;" fit="cover"
          src="https://img2.baidu.com/it/u=3234195660,3054476289&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800"/>

    </div>
    <div class="welcome-title">
      <div style="font-size: 30px;font-weight: bolder">欢迎来到我的网站</div>
      <div style="margin-top: 10px">在这里你可以学习，emmm，学习如何打游戏，别的我也不会</div>
      <dic style="margin-top: 10px">或者来看看我瞎弄的网站</dic>
      <div></div>
    </div>
    <div class="right-card">
      <router-view v-slot="{Component}">
        <transition name="el-fade-in-linear" mode="out-in">
         <component :is="Component"/>
        </transition>
      </router-view>

    </div>
  </div>

</template>

<style scoped>
.right-card{
  width: 400px;
  z-index: 1;
  background-color: var(--el-bg-color);
}
.welcome-title{
  position: absolute;
  bottom: 30px;
  left:30px;
  color: white;
  text-shadow: 0 0 10px black;
}
</style>
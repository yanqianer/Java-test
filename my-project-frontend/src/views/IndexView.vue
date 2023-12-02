<script setup>

import {logout} from "@/net";
import router from "@/router";

function userLogout(){
  logout(()=>{router.push('/')})

}


</script>

<template>
    <div style="text-align: center">
      <div style="margin-top:70px">
        <el-button @click="userLogout" type="danger" plain style="width: 200px">退出登录</el-button>
      </div>
      <div style="margin-top: 30px">
        <el-button @click="router.push('/')" type="primary" plain style="width: 200px">还没写好</el-button>
      </div>

    </div>
</template>

<style scoped>

</style>
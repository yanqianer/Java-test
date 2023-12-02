<script setup>
import {reactive,ref,computed} from "vue";
import {Lock, User,Message,Bell} from '@element-plus/icons-vue';
import router from "@/router";
import {get} from "@/net";
import {ElMessage} from "element-plus";
import {post} from "@/net";



const codeTime= ref(0)
const formRef = ref()
const form=reactive({
  username:'',
  password:'',
  password_again:'',
  email:'',
  code:'',
})
const isMailValid=()=>{
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email)
}
const isEmailValid = computed(() =>{
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email)
})
const validateUsername=(rule,value,callback)=>{
  if(value===''){
    callback(new Error('请输入用户名'))
  }else if(!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)){
    callback(new Error('用户名不能包含特殊字符，只能是中/英文'))
  }else {
    callback()
  }
}
const validatePassword=(rule,value,callback)=>{
  if(value===''){
    callback(new Error('请输入密码'))
  }
  else if(!/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/.test(value)){
    callback(new Error('密码必须包含至少大小写字母，数字，一个特殊字符(@这样的)'))
  }
  else {
    callback()
  }
}
const validatePasswordAgain=(rule,value,callback)=>{
  if(value===''){
    callback(new Error('请再次输入密码'))
  }else if(value!==form.password){
    callback(new Error('两次输入的密码不一致'))
  }else {
    callback()
  }
}
const rule= {
  username:[
    {
      validator:validateUsername,
      trigger:['blur','change'],//失去焦点，改变的时候
    },{
      min:4,
      max:16,
      message:'用户名的长度必须在4-16之间',
      trigger:['blur','change']
    }],
  password:[{
    validator:validatePassword,
    trigger:['blur','change'],
  },{
    min:6,
    max:20,
    message:'密码长度在6-20之间'
  }],
  password_again:[{
    validator:validatePasswordAgain,
    trigger:['blur','change'],

  }],
  code:[{
    required:true,
    message:'请输入验证码'

  }],
  email:[{
    required:true,
    message:'请输入邮箱',
    trigger:['blur','change'],
  },{
    type:'email',
    message: '请输入合法的邮箱',
    trigger:['blur','change'],
  }]

}
function getCode() {
  if(isEmailValid.value){
    get(`/api/auth/code?email=${form.email}&type=register`,()=>{
      codeTime.value=60
      ElMessage.success('验证码已发送，请注意查收')
      const timer=setInterval(()=>{
        codeTime.value > 0 ? codeTime.value--:clearInterval(timer)
      },1000)
    },(message)=>{
      ElMessage.warning(message)
      codeTime.value=0
    })
  }else {
    ElMessage.warning('电子邮件的格式不正确')
  }
}
function register(){
  console.log(form.username)
  formRef.value.validate((valid)=>{
    if(valid){
      post('/api/auth/doRegister',{
        username:'111',
        email: form.email,
        code:form.code,
        password:form.password,
      },()=>{
        ElMessage.success('注册成功')
        router.push('/')
      })
    }else{
      ElMessage.warning('请完整填写表单内容')
    }
  })

}
</script>

<template>
  <div style="text-align: center;margin:0 20px;">
    <div style="margin-top: 150px">
       <div style="font-size: 25px;font-weight: bolder;margin-bottom: 20px">
         注册新用户
       </div>
      <div style="font-size: 13px;color: rgb(128,128,128)">
        欢迎注册我的网站请在下方填写相关信息
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" :rules="rule" ref="formRef">
          <el-form-item prop="username">
            <el-input v-model="form.username" maxlength="30" type="text" placeholder="用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="form.email" type="text" maxlength="30" placeholder="邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" maxlength="30" placeholder="密码" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password_again">
            <el-input v-model="form.password_again" type="password" maxlength="30" placeholder="请再输一遍密码" show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="16" style="text-align: left; ">
              <el-form-item prop="code">
                <el-input v-model="form.code" type="text" maxlength="4" placeholder="验证码">
                  <template #prefix>
                    <el-icon><Bell /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align: right">
              <el-button type="primary" plain @click="getCode" :disabled="!isEmailValid||codeTime">
              {{ codeTime > 0 ? `请稍后 ${codeTime}秒`:'获取验证码'}}
              </el-button>
            </el-col>
          </el-row>
          <div style="text-align: left">
            <el-link @click="router.push('/')">
              已有账户？立即登录
            </el-link>
          </div>
        </el-form>
        <div style="margin-top: 40px">
          <el-button style="width: 200px" type="success" plain @click="register">
            立即注册
          </el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
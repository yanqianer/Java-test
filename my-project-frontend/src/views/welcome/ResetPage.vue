<script setup>
import {computed, reactive, ref} from "vue";
import {Bell, Lock, Message} from "@element-plus/icons-vue";
import {get,post} from "@/net";
import {ElMessage} from "element-plus";
import router from "@/router";


const codeTime= ref(0)
const  active = ref(0)
const formRef = ref()
const formRef2=ref()
const form = reactive({
  email:'',
  code:'',
  password:'',
  password_again:'',
})
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
const isEmailValid = computed(() =>{
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email)
})
const rule={
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
    get(`/api/auth/code?email=${form.email}&type=reset`,()=>{
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
    ElMessage.warning('电子邮箱格式不正确')
  }
}
function nextStep(){
  formRef.value.validate((valid)=>{
    if(valid){
      post('/api/auth/verifyEmail',{
        email:form.email,
        code:form.code,
      },()=>{
        active.value++
        ElMessage.success('邮箱验证成功')
      })
    }
    else{
      ElMessage.warning('请完整填写表单内容')
    }

  })
}
function resetPassword(){
  formRef2.value.validate((valid)=>{
    if(valid){
      post('/api/auth/resetPassword',{
        password:form.password,
        password_again: form.password_again,
        email: form.email
      },()=>{
        router.push('/')
        active.value--;
        ElMessage.success('重置密码成功')
      })
    }
    else{
      ElMessage.warning('请完整填写表单内容')
    }

  })
}
</script>

<template>
  <div style="text-align: center;margin:30px 20px;">
    <div>
      <el-steps align-center :active="active" finish-status="success">
        <el-step title="验证电子邮件"/>
        <el-step title="重新设定密码" />
      </el-steps>
    </div>
    <div v-if="active===0" style="margin-top: 30px">
      <div>
        <div style="font-size: 25px;font-weight: bolder; margin-bottom: 10px">重置密码</div>
        <div style="font-size: 13px; color: rgb(128,128,128)">请输入需要重置密码的电子邮件</div>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" :rules="rule" ref="formRef">
          <el-form-item prop="email">
            <el-input v-model="form.email" maxlength="30" type="text" placeholder="请输入邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
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
        </el-form>
      </div>
      <div style="margin-top: 40px">
        <el-button style="width: 200px" type="success" plain @click="nextStep">
          验证账号
        </el-button>
    </div>
    </div>
    <div v-if="active===1" style="margin-top: 30px">
      <div style="margin-bottom: 50px">
        <div style="font-size: 25px;font-weight: bolder; margin-bottom: 10px">重置密码</div>
        <div style="font-size: 13px; color: rgb(128,128,128)">请输入你的新密码，务必牢记防止忘记</div>
      </div>
      <div style="margin-top: 40px">
        <el-form :model="form" :rules="rule" ref="formRef2">
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
        </el-form>
      </div>
      <div style="margin-top: 60px">
        <el-button style="width: 200px" type="success" plain @click="resetPassword" >
          立即重置
        </el-button>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>
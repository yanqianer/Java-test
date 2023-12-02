import axios from "axios";
import {ElMessage} from "element-plus";

const authItemName = "access_token"
const defaultFailure =(message,code,url)=>{
    console.warn(`请求地址:${url},状态码:${code},错误信息:${message}`)
    ElMessage.warning(message)

}
const defaultError =(err)=>{
    console.warn(err)
    ElMessage.warning('发生了一些错误请联系管理员')

}

//存储token如果没选remember就存在会话session中下次刷新页面就会没，选了remember就存在localStorage里面
function saveAccessToken(token,remember,expire){
    const authObj = {token:token,expire:expire}
    const str = JSON.stringify(authObj)
    if(remember){
        localStorage.setItem(authItemName,str)
    }else{
        sessionStorage.setItem(authItemName,str)
    }
}
//获取token
function takeAccessToken(){
    const str = localStorage.getItem(authItemName)||sessionStorage.getItem(authItemName)
    if(!str){
        return null
    }
    const authObj = JSON.parse(str)
    if(authObj.expire<=new Date()){
        deleteAccessToken()
        ElMessage.warning('登录状态过期，请重新登录')
        return null
    }
    return authObj.token
}//删除token
function deleteAccessToken(){
    localStorage.removeItem(authItemName)
    sessionStorage.removeItem(authItemName)
}
//内部的post方法
function internalPost(url,data,header,success,failure,error=defaultError){
    axios.post(url,data,{headers:header})
         .then(({data})=>{
             if(data.code===200){
                success(data.data)
             }else{
                 failure(data.message,data.code,url)
             }
         }).catch(err=>error(err))
}


//内部的get方法
function internalGet(url,header,success,failure,error=defaultError){
    axios.get(url,{headers:header})
        .then(({data})=>{
            if(data.code===200){
                success(data.data)
            }else{
                failure(data.message,data.code,url)
            }
        }).catch(err=>error(err))
}
//外部调用的get方法
function get(url,success,failure=defaultFailure){
    internalGet(url,accessHeader(),success,failure)

}
//外部调用post方法
function post(url,data,success,failure=defaultFailure){
    internalPost(url,data,accessHeader(),success,failure)
}
//获取Header
function accessHeader(){
    const token = takeAccessToken()
    return token?{
        'Authorization':`Bearer ${takeAccessToken()}`
    }:{}
}

//
function login(username,password,remember, success,failure= defaultFailure){
    internalPost('/api/auth/login', {
        username:username,
        password:password,
        remember:remember,
    },{
        'Content-Type': 'application/x-www-form-urlencoded'
    },(data)=>{
        saveAccessToken(data.token,remember,data.expire)
        ElMessage.success(`登录成功，欢迎${data.username}来到我的网站`)
        success()
    },failure)
}
function logout(success){
    get('/api/auth/logout',()=>{
        deleteAccessToken()
        ElMessage.success('退出登录成功，欢迎下次再来')
        success();
    })
}
function unAuthorization(){
    return !takeAccessToken();
}

//将login暴露出去供前端调用
export {login,logout,get,post,unAuthorization}
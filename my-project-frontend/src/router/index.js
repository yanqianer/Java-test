import {createRouter,  createWebHistory} from "vue-router";
import {unAuthorization} from "@/net";

const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:'/',
            name:'welcome',
            component:()=>import('@/views/WelcomeView.vue'),
            children:[
                {
                    path:'',
                    name:'welcome-login',
                    component:()=>import('@/views/welcome/LoginPage.vue'),
                },
                {
                    path:'/register',
                    name:'welcome-register',
                    component:()=>import('@/views/welcome/RegisterPage.vue'),
                },
                {
                    path:'/reset',
                    name:'welcome-reset',
                    component:()=>import('@/views/welcome/ResetPage.vue'),
                }
            ]
        },{
            path:'/index',
            name:'index',
            component:()=>import('@/views/IndexView.vue')
        }

    ]

})
router.beforeEach((to,from,next)=>{
    const isUnAuthorized = unAuthorization()
    if(to.name.startsWith('welcome')&&!isUnAuthorized){
        next('/index')
    }else if(to.fullPath.startsWith('/index')&&isUnAuthorized){
        next('/')
    }else{
        next()
    }
})
export default router
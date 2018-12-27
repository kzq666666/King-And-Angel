import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import writeWish from '../components/writeWish'
import main from '../components/main'
import chat from '../components/chat'
import notFound from '../components/404'
import changePWD from '../components/changePWD'

Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/',
            component:main,
            meta:{
                keepAlive:false
            }
        },
        {
            path: '/login',
            name:'login',
            component:login,
            meta:{
                keepAlive:false
            }
        },
        {
            path: '/changePWD',
            component:changePWD,
            name:'changePWD'
        },
        {
            path:'/writeWish',
            component:writeWish,
            meta:{
                keepAlive:false
            }
        },
       
        {
            path:'/chat',
            name:'chat',
            component:chat,
            meta:{
                keepAlive:false
            }
        },
        {
            path:'*',
            name:notFound,
            component:notFound
        }
    ]
})
export default router
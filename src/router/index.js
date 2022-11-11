import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/sheet',
        name: 'sheet',
        component: () => import('../views/answer-sheet/Sheet.vue'),
    },
    {
        path: '/sheet-preview',
        name: 'sheet-preview',
        component: () => import('../views/answer-sheet/Preview.vue')
    },
    {
        path: '/sheet-manager',
        name: 'sheet-manager',
        component: () => import('../views/answer-sheet/Manager.vue')
    },
    {
        path: '/exam-home',
        name: 'exam-home',
        component: () => import ('../views/exam-paper/Home.vue')
    },
    {
        path: '/exam-manager',
        name: 'exam-manager',
        component: () => import('../views/exam-paper/Manager.vue')
    }
]
const router = new VueRouter({
    mode: process.env.NODE_ENV === 'development' ? 'history' : 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router

import {createRouter, createWebHistory} from 'vue-router'
import home from './composables/home.vue'
import Nothome from './composables/nothome.vue'

const routes = [
    {path:"/", component:home, name:"home"},
    {path:"/not-home", component: Nothome, name:"nothome"},
    {path:"/...", component:'', name:""},
    {path:"/....", component:'', name:""},
    {path:"/.....", component:'', name:""}
]

export const router = createRouter({
    history:createWebHistory(),
    routes
})
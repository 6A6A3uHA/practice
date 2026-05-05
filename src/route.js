import {createRouter, createWebHistory} from 'vue-router'
import home from './composables/home.vue'
import Game1 from './components/Game1.vue'

const routes = [
    { path: "/", component: home, name: "home" },
    { path: "/game1", component: Game1, name: "game1" },
    { path: "/game2", component: Game2, name: "game2" },
    { path: "/game3", component: Game3, name: "game3" },
    { path: "/game4", component: Game4, name: "game4" },
    {path:"/leaderboard", component: leaderboard, name:"leaderboard", child},
]

export const router = createRouter({
    history:createWebHistory(),
    routes
})
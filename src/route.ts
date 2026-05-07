import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import home from './components/home.vue'
import Game1 from './components/Game1.vue'
import Game2 from './components/Game2.vue'
import Game3 from './components/Game3.vue'
import Game4 from './components/Game4.vue'
import leaderboard from './components/leaderboard.vue'
import not_found from './components/not_found.vue'

// TypeScript здесь добавляет подсказки для создания маршрутов

const routes: RouteRecordRaw[] = [
    { path: "/", component: home, name: "home" },
    { path: "/game1", component: Game1, name: "game1" },
    { path: "/game2", component: Game2, name: "game2" },
    { path: "/game3", component: Game3, name: "game3" },
    { path: "/game4", component: Game4, name: "game4" },
    { path: "/leaderboard/:numgame[1-4]", component: leaderboard, name: "leaderboard" },
    { path: "/:attr[*]", component: not_found, name: '404' }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    //Заранее если будут правила перехода
    to
    return true
})
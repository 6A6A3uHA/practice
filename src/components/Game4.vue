<script setup lang="ts">
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import board from './board.vue';
    import { useRoute } from 'vue-router';

    const prop_num_game = useRoute().meta.choose_game//Не трогать
    const flag_open = ref<boolean>(false)//Флаг отображения таблицы
    const flag_end_game = ref<boolean>(false)//Включать когда игра заканчивается
    const score = ref(0)//количество очков в игре

    type Bullet = {
        id: number
        x: number
        y: number
    }

    type Enemy = {
        id: number
        x: number
        y: number
    }

    const player_x = ref<number>(45)
    const bullets = ref<Bullet[]>([])
    const enemies = ref<Enemy[]>([])
    const game_start = ref<boolean>(false)
    const message = ref<string>('Двигайтесь стрелками или A/D, стреляйте на W')
    const left_pressed = ref<boolean>(false)
    const right_pressed = ref<boolean>(false)

    let game_interval: ReturnType<typeof setInterval> | null = null
    let spawn_interval: ReturnType<typeof setInterval> | null = null
    let bullet_id = 0
    let enemy_id = 0
    let last_shot_time = 0

    function stopIntervals() {
        if (game_interval) {
            clearInterval(game_interval)
            game_interval = null
        }

        if (spawn_interval) {
            clearInterval(spawn_interval)
            spawn_interval = null
        }
    }

    function resetGame() {
        stopIntervals()
        score.value = 0
        flag_end_game.value = false
        player_x.value = 45
        bullets.value = []
        enemies.value = []
        bullet_id = 0
        enemy_id = 0
        last_shot_time = 0
        game_start.value = false
        left_pressed.value = false
        right_pressed.value = false
        message.value = 'Двигайтесь стрелками или A/D, стреляйте на W'
    }

    function startGame() {
        if (game_start.value) return
        resetGame()
        flag_open.value = false
        game_start.value = true
        spawnEnemy()
        game_interval = setInterval(gameLoop, 25)
        spawn_interval = setInterval(spawnEnemy, 850)
    }

    function spawnEnemy() {
        enemies.value.push({
            id: enemy_id++,
            x: Math.floor(Math.random() * 86) + 7,
            y: -8
        })
    }

    function gameLoop() {
        movePlayer()

        const movedBullets = bullets.value
            .map((bullet) => ({ ...bullet, y: bullet.y - 2.8 }))
            .filter((bullet) => bullet.y > -10)

        const movedEnemies = enemies.value.map((enemy) => ({
            ...enemy,
            y: enemy.y + 0.62 + Math.min(score.value * 0.02, 0.6)
        }))

        const removedBulletIds = new Set<number>()
        const removedEnemyIds = new Set<number>()

        for (const enemy of movedEnemies) {
            if (enemy.y >= 82 && Math.abs(enemy.x - player_x.value) < 8) {
                endGame('Астероид столкнулся с кораблем')
                return
            }

            if (enemy.y > 104) {
                endGame('Астероид пролетел мимо')
                return
            }

            for (const bullet of movedBullets) {
                if (removedBulletIds.has(bullet.id)) continue

                if (Math.abs(enemy.x - bullet.x) < 5 && Math.abs(enemy.y - bullet.y) < 6) {
                    removedBulletIds.add(bullet.id)
                    removedEnemyIds.add(enemy.id)
                    score.value++
                    break
                }
            }
        }

        bullets.value = movedBullets.filter((bullet) => !removedBulletIds.has(bullet.id))
        enemies.value = movedEnemies.filter((enemy) => !removedEnemyIds.has(enemy.id))
    }

    function movePlayer() {
        if (left_pressed.value) player_x.value -= 1.2
        if (right_pressed.value) player_x.value += 1.2

        if (player_x.value < 4) player_x.value = 4
        if (player_x.value > 96) player_x.value = 96
    }

    function shoot() {
        if (!game_start.value) return

        const now = Date.now()
        if (now - last_shot_time < 260) return

        last_shot_time = now

        bullets.value.push({
            id: bullet_id++,
            x: player_x.value,
            y: 82
        })
    }

    function endGame(text: string) {
        stopIntervals()
        game_start.value = false
        message.value = text
        flag_end_game.value = true
        flag_open.value = true
    }

    function pressLeft() {
        left_pressed.value = true
    }

    function pressRight() {
        right_pressed.value = true
    }

    function stopLeft() {
        left_pressed.value = false
    }

    function stopRight() {
        right_pressed.value = false
    }

    function keydown_list(event: KeyboardEvent) {
        const key = event.key.toLowerCase()

        if (['arrowleft', 'arrowright', 'a', 'd', 'ф', 'в', 'w', 'ц'].includes(key)) {
            event.preventDefault()
        }

        if (key === 'arrowleft' || key === 'a' || key === 'ф') pressLeft()
        if (key === 'arrowright' || key === 'd' || key === 'в') pressRight()
        if (key === 'w' || key === 'ц') shoot()
    }

    function keyup_list(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'ф') stopLeft()
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'в') stopRight()
    }

    watch(flag_open, () => {
        if (!flag_open.value && !game_start.value) resetGame()
    })

    onMounted(() => {
        window.addEventListener('keydown', keydown_list)
        window.addEventListener('keyup', keyup_list)
    })

    onUnmounted(() => {
        stopIntervals()
        window.removeEventListener('keydown', keydown_list)
        window.removeEventListener('keyup', keyup_list)
    })
</script>

<template>
    <board :choosed_game="prop_num_game" v-model:flag_end_game="flag_end_game" v-model:flag_open="flag_open"
        v-model:score="score" v-if="flag_open">
    </board>

    <div class="game">
        <div class="game_panel">
            <h2>Космический стрелок</h2>
            <p>Очки: {{ score }}</p>
            <p>{{ message }}</p>
        </div>

        <div class="field">
            <div v-for="enemy in enemies" :key="enemy.id" class="enemy"
                :style="{ left: enemy.x + '%', top: enemy.y + '%' }"></div>

            <div v-for="bullet in bullets" :key="bullet.id" class="bullet"
                :style="{ left: bullet.x + '%', top: bullet.y + '%' }"></div>

            <div class="ship" :style="{ left: player_x + '%' }"></div>

            <button @click="startGame" v-if="!game_start" class="start">Начать игру</button>
        </div>

        <div class="controls">
            <button @mousedown="pressLeft" @mouseup="stopLeft" @mouseleave="stopLeft" @touchstart.prevent="pressLeft"
                @touchend.prevent="stopLeft">Влево</button>

            <button @click="shoot">W</button>

            <button @mousedown="pressRight" @mouseup="stopRight" @mouseleave="stopRight" @touchstart.prevent="pressRight"
                @touchend.prevent="stopRight">Вправо</button>
        </div>
    </div>
</template>

<style scoped>
    .game {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-color: #b8b6b6;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-width: 100%;
        min-height: 470px;
        height: 100%;
        width: 100%;
        overflow: hidden;
        gap: 12px;
        color: #111;
    }

    .game_panel {
        text-align: center;
        line-height: 1.2;
    }

    .game_panel h2,
    .game_panel p {
        margin: 4px 0;
    }

    .field {
        position: relative;
        width: min(80vw, 430px, 60vh);
        aspect-ratio: 3/4;
        background: linear-gradient(#1c2230, #5f5f66);
        outline: 2px solid black;
        overflow: hidden;
    }

    .ship {
        position: absolute;
        bottom: 7%;
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-bottom: 36px solid #f4f4f4;
        transform: translateX(-50%);
        filter: drop-shadow(0 0 2px black);
    }

    .bullet {
        position: absolute;
        width: 1.5%;
        height: 5%;
        border-radius: 4px;
        background-color: #ffe45c;
        outline: 1px solid #6d5a00;
        transform: translate(-50%, -50%);
    }

    .enemy {
        position: absolute;
        width: 8%;
        aspect-ratio: 1/1;
        border-radius: 50%;
        background-color: #e63946;
        outline: 2px solid #330000;
        transform: translate(-50%, -50%);
    }

    .start {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 8px 12px;
        z-index: 2;
    }

    .controls {
        display: flex;
        gap: 12px;
    }

    .controls button {
        padding: 7px 12px;
        user-select: none;
        touch-action: manipulation;
    }
</style>
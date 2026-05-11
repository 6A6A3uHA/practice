<script setup lang="ts">
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import board from './board.vue';
    import { useRoute } from 'vue-router';

    const prop_num_game = useRoute().meta.choose_game//Не трогать
    const flag_open = ref<boolean>(false)//Флаг отображения таблицы
    const flag_end_game = ref<boolean>(false)//Включать когда игра заканчивается
    const score = ref(0)//количество очков в игре

    type FallingItem = {
        id: number
        x: number
        y: number
        bad: boolean
    }

    const player_x = ref<number>(42)
    const player_width = 16
    const items = ref<FallingItem[]>([])
    const game_start = ref<boolean>(false)
    const message = ref<string>('Ловите зеленые предметы и избегайте красных')
    const left_pressed = ref<boolean>(false)
    const right_pressed = ref<boolean>(false)

    let game_interval: ReturnType<typeof setInterval> | null = null
    let spawn_interval: ReturnType<typeof setInterval> | null = null
    let item_id = 0

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
        player_x.value = 42
        items.value = []
        item_id = 0
        game_start.value = false
        left_pressed.value = false
        right_pressed.value = false
        message.value = 'Ловите зеленые предметы и избегайте красных'
    }

    function startGame() {
        if (game_start.value) return
        resetGame()
        flag_open.value = false
        game_start.value = true
        spawnItem()
        game_interval = setInterval(gameLoop, 25)
        spawn_interval = setInterval(spawnItem, 850)
    }

    function spawnItem() {
        items.value.push({
            id: item_id++,
            x: Math.floor(Math.random() * 86) + 4,
            y: -6,
            bad: Math.random() < 0.28
        })
    }

    function gameLoop() {
        movePlayer()

        const updatedItems: FallingItem[] = []
        const speed = 0.75 + Math.min(score.value * 0.03, 0.75)

        for (const item of items.value) {
            const movedItem = { ...item, y: item.y + speed }

            const caught =
                movedItem.y >= 82 &&
                movedItem.y <= 94 &&
                movedItem.x >= player_x.value - 2 &&
                movedItem.x <= player_x.value + player_width + 2

            if (caught && movedItem.bad) {
                endGame('Вы поймали красный предмет')
                return
            }

            if (caught && !movedItem.bad) {
                score.value++
                continue
            }

            if (movedItem.y > 104) {
                if (!movedItem.bad) {
                    endGame('Зеленый предмет упал мимо корзины')
                    return
                }

                continue
            }

            updatedItems.push(movedItem)
        }

        items.value = updatedItems
    }

    function movePlayer() {
        if (left_pressed.value) player_x.value -= 1.1
        if (right_pressed.value) player_x.value += 1.1

        if (player_x.value < 0) player_x.value = 0
        if (player_x.value > 100 - player_width) player_x.value = 100 - player_width
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
        if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'ф', 'в'].includes(event.key)) {
            event.preventDefault()
        }

        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'ф') pressLeft()
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'в') pressRight()
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
            <h2>Поймай предметы</h2>
            <p>Очки: {{ score }}</p>
            <p>{{ message }}</p>
        </div>

        <div class="field">
            <div v-for="item in items" :key="item.id" class="item" :class="{ bad: item.bad }"
                :style="{ left: item.x + '%', top: item.y + '%' }"></div>

            <div class="basket" :style="{ left: player_x + '%', width: player_width + '%' }"></div>

            <button @click="startGame" v-if="!game_start" class="start">Начать игру</button>
        </div>

        <div class="controls">
            <button @mousedown="pressLeft" @mouseup="stopLeft" @mouseleave="stopLeft" @touchstart.prevent="pressLeft"
                @touchend.prevent="stopLeft">Влево</button>

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
        background-color: #6d6363;
        outline: 2px solid black;
        overflow: hidden;
    }

    .item {
        position: absolute;
        width: 7%;
        aspect-ratio: 1/1;
        border-radius: 50%;
        background-color: #4caf50;
        outline: 1px solid #0f3d12;
        transform: translate(-50%, -50%);
    }

    .bad {
        background-color: #e63946;
        outline-color: #7a0000;
    }

    .basket {
        position: absolute;
        bottom: 5%;
        height: 6%;
        border-radius: 8px 8px 2px 2px;
        background-color: #f4f4f4;
        outline: 2px solid #222;
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
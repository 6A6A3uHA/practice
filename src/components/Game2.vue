<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import board from './board.vue';
    import { useRoute } from 'vue-router';

    const prop_num_game = useRoute().meta.choose_game//Не трогать
    const flag_open = ref<boolean>(false)//Флаг отображения таблицы
    const flag_end_game = ref<boolean>(false)//Включать когда игра заканчивается
    const score = ref(0)//количество очков в игре

    type Cell = {
        x: number
        y: number
    }

    type Direction = 'up' | 'down' | 'left' | 'right'

    const boardSize = 18
    const cells = computed(() => Array.from({ length: boardSize * boardSize }, (_, index) => index))
    const gridTemplate = computed(() => `repeat(${boardSize}, 1fr)`)

    const snake = ref<Cell[]>([
        { x: 8, y: 9 },
        { x: 7, y: 9 },
        { x: 6, y: 9 }
    ])
    const food = ref<Cell>({ x: 12, y: 9 })
    const direction = ref<Direction>('right')
    const nextDirection = ref<Direction>('right')
    const game_start = ref<boolean>(false)
    const message = ref<string>('Собирайте еду и не врезайтесь в стены')

    let game_interval: ReturnType<typeof setInterval> | null = null

    function isSameCell(first: Cell, second: Cell) {
        return first.x === second.x && first.y === second.y
    }

    function isSnakeCell(x: number, y: number) {
        return snake.value.some((part) => part.x === x && part.y === y)
    }

    function isHeadCell(x: number, y: number) {
        const head = snake.value[0]
        if (!head) return false
        return head.x === x && head.y === y
    }

    function isFoodCell(x: number, y: number) {
        return food.value.x === x && food.value.y === y
    }

    function getCellClass(cellIndex: number) {
        const x = cellIndex % boardSize
        const y = Math.floor(cellIndex / boardSize)

        return {
            cell: true,
            snake: isSnakeCell(x, y),
            head: isHeadCell(x, y),
            food: isFoodCell(x, y)
        }
    }

    function placeFood() {
        const emptyCells: Cell[] = []
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                if (!isSnakeCell(x, y)) emptyCells.push({ x, y })
            }
        }

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        food.value = randomCell ? { ...randomCell } : { x: 0, y: 0 }
    }

    function resetGame() {
        stopGameInterval()
        score.value = 0
        flag_end_game.value = false
        snake.value = [
            { x: 8, y: 9 },
            { x: 7, y: 9 },
            { x: 6, y: 9 }
        ]
        direction.value = 'right'
        nextDirection.value = 'right'
        food.value = { x: 12, y: 9 }
        game_start.value = false
        message.value = 'Собирайте еду и не врезайтесь в стены'
    }

    function stopGameInterval() {
        if (!game_interval) return
        clearInterval(game_interval)
        game_interval = null
    }

    function startGame() {
        if (game_start.value) return
        resetGame()
        flag_open.value = false
        game_start.value = true
        game_interval = setInterval(moveSnake, 140)
    }

    function moveSnake() {
        direction.value = nextDirection.value
        const head = snake.value[0]
        if (!head) return

        const newHead: Cell = { ...head }
        if (direction.value === 'up') newHead.y--
        if (direction.value === 'down') newHead.y++
        if (direction.value === 'left') newHead.x--
        if (direction.value === 'right') newHead.x++

        const hitWall = newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize
        const hitSnake = snake.value.some((part, index) => index !== snake.value.length - 1 && isSameCell(part, newHead))

        if (hitWall || hitSnake) {
            endGame('Игра окончена')
            return
        }

        const newSnake = [newHead, ...snake.value]
        if (isSameCell(newHead, food.value)) {
            score.value++
            snake.value = newSnake
            placeFood()
        }
        else {
            newSnake.pop()
            snake.value = newSnake
        }
    }

    function endGame(text: string) {
        stopGameInterval()
        game_start.value = false
        message.value = text
        flag_end_game.value = true
        flag_open.value = true
    }

    function changeDirection(newDirection: Direction) {
        if (!game_start.value) return
        const current = direction.value
        if (current === 'up' && newDirection === 'down') return
        if (current === 'down' && newDirection === 'up') return
        if (current === 'left' && newDirection === 'right') return
        if (current === 'right' && newDirection === 'left') return
        nextDirection.value = newDirection
    }

    function keydown_list(event: KeyboardEvent) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'ц', 'ф', 'ы', 'в'].includes(event.key)) {
            event.preventDefault()
        }
        if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'ц') changeDirection('up')
        if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'ы') changeDirection('down')
        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'ф') changeDirection('left')
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'в') changeDirection('right')
    }

    watch(flag_open, () => {
        if (!flag_open.value && !game_start.value) resetGame()
    })

    onMounted(() => {
        window.addEventListener('keydown', keydown_list)
    })

    onUnmounted(() => {
        stopGameInterval()
        window.removeEventListener('keydown', keydown_list)
    })
</script>

<template>
    <board :choosed_game="prop_num_game" v-model:flag_end_game="flag_end_game" v-model:flag_open="flag_open"
        v-model:score="score" v-if="flag_open">
    </board>

    <div class="game">
        <div class="game_panel">
            <h2>Змейка</h2>
            <p>Очки: {{ score }}</p>
            <p>{{ message }}</p>
        </div>

        <div class="field">
            <div v-for="cell in cells" :key="cell" :class="getCellClass(cell)"></div>
            <button @click="startGame" v-if="!game_start" class="start">Начать игру</button>
        </div>

        <div class="controls">
            <button @click="changeDirection('up')">Вверх</button>
            <div>
                <button @click="changeDirection('left')">Влево</button>
                <button @click="changeDirection('down')">Вниз</button>
                <button @click="changeDirection('right')">Вправо</button>
            </div>
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
        min-height: 420px;
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
        width: min(78vw, 480px, 68vh);
        aspect-ratio: 1/1;
        background-color: #6d6363;
        outline: 2px solid black;
        display: grid;
        grid-template-columns: v-bind(gridTemplate);
        grid-template-rows: v-bind(gridTemplate);
        overflow: hidden;
    }

    .cell {
        border: 1px solid rgba(0, 0, 0, 0.12);
        box-sizing: border-box;
    }

    .snake {
        background-color: #f4f4f4;
        outline: 1px solid #222;
    }

    .head {
        background-color: #ffe45c;
    }

    .food {
        background-color: #e63946;
        border-radius: 50%;
        outline: 1px solid #7a0000;
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
        flex-direction: column;
        gap: 6px;
        align-items: center;
    }

    .controls div {
        display: flex;
        gap: 6px;
    }

    .controls button {
        padding: 5px 8px;
    }
</style>
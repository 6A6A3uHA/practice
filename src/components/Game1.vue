<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import board from './board.vue';
    import { useRoute } from 'vue-router';

    const prop_num_game = useRoute().meta.choose_game//Не трогать
    const flag_open = ref<boolean>(false)//Флаг отображения таблицы
    const flag_end_game = ref<boolean>(false)//Включать когда игра заканчивается
    const score = ref(0)//количество очков в игре

    const field_link = ref<HTMLElement | null>(null)
    const game_link = ref<HTMLElement | null>(null)

    const field_width = ref<number | null>(null)
    const field_height = ref<number | null>(null)

    const game_width = ref<number | null>(null)
    const game_height = ref<number | null>(null)

    const stick_height = computed(() => {
        if (!field_height.value) return "0px"
        return `${field_height.value * 0.2}px`
    })
    const height_field = ref<string>("80%")
    const height_message = ref<string>("0px")
    const outline_field = ref<string>("2px")


    const getDynamicSize_field = new ResizeObserver((list_of_elements) => {
        const field = list_of_elements[0]
        const { height, width } = field?.contentRect as DOMRectReadOnly
        field_height.value = height
        field_width.value = width
    })
    const getDynamicSize_game = new ResizeObserver((list_of_elements) => {
        const game = list_of_elements[0]
        const { height, width } = game?.contentRect as DOMRectReadOnly
        game_width.value = width
        game_height.value = height
    })
    onMounted(() => {
        if (!field_link.value) return
        getDynamicSize_field.observe(field_link.value)
        if (!game_link.value) return
        getDynamicSize_game.observe(game_link.value)
        window.addEventListener('keydown', keydown_list)
        window.addEventListener('keyup', keyup_list)
    })
    onUnmounted(() => {
        getDynamicSize_field.disconnect()
        stopBlink()
        window.removeEventListener('keydown', keydown_list)
        window.removeEventListener('keyup', keyup_list)
    })

    watch(game_width, () => {
        if (game_width.value as number > (field_width.value as number)) {
            height_field.value = "80%"
            height_message.value = "0px"
            outline_field.value = "2px"
        }
        else {
            outline_field.value = "0px"
            height_field.value = "0%"
            height_message.value = "auto"
        }
    })
    const size_ball = computed(() => {
        if (!field_height.value) return "0px"
        return `${field_height.value * 0.05}px`
    })

    const ball = ref<{ x: number | null, y: number | null }>({ x: null, y: null })

    const y_ball = computed(() => {
        if (!ball.value.y) return "50px"
        return `${ball.value.y}px`
    })

    const x_ball = computed(() => {
        if (!ball.value.x) return "50px"
        return `${ball.value.x}px`
    })
    const ball_transparency = ref<"0" | "1">("1")

    const game_start = ref<boolean>(false)

    let blink_interval_id: number | null = null

    function setBlink() {
        if (blink_interval_id) return
        blink_interval_id = setInterval(() => {
            ball_transparency.value = ball_transparency.value === "1" ? "0" : "1"
        }, 800);
    }

    function stopBlink() {
        if (!blink_interval_id) return
        clearInterval(blink_interval_id)
        ball_transparency.value = "1"
        blink_interval_id = null
    }

    function centerLeftStick() {
        if (!field_height.value) return
        left_stick_y_number.value = field_height.value / 2 - field_height.value * 0.1
    }

    watch(() => field_height.value, () => {
        centerLeftStick()
        ball.value.x = field_width.value ? field_width.value / 2 : 50
        ball.value.y = field_height.value ? field_height.value / 2 : 50
    })

    let game_interval: number | null = null

    /**
         * начальное направление
         * 1 -вправо, 0 - влево
         */
    const direction_x = ref<number>(Math.random() > 0.5 ? 1 : 0)
    /**
    * начальное направление
    * 0 -вниз, 1 - вверх
    */
    const direction_y = ref<number>(Math.random() > 0.5 ? 1 : 0)
    const flag_add_score = ref<boolean>(true)

    function startGame() {
        if (game_interval && !ball.value || !field_height.value) return
        score.value = 0
        game_interval = setInterval(() => {
            if (direction_x.value === 1) {
                ball.value.x = ball.value.x as number + (field_height.value as number * 0.01)
            }
            else { ball.value.x = ball.value.x as number - (field_height.value as number * 0.01) }
            if (direction_y.value === 1) {
                ball.value.y = ball.value.y as number + (field_height.value as number * 0.01)
            }
            else { ball.value.y = ball.value.y as number - (field_height.value as number * 0.01) }

            if (ball.value.x <= 10 && (ball.value.y <= left_stick_y_number.value + (field_height.value as number) * 0.2 && ball.value.y + (field_height.value as number) * 0.05 >= left_stick_y_number.value)) {
                direction_x.value = 1
                if (flag_add_score.value) {
                    score.value++
                    flag_add_score.value = false
                    setTimeout(() => {
                        flag_add_score.value = true
                    }, 300);
                }
            }

            if (ball.value.x <= 0 && direction_x.value == 0) {
                ball.value.x = field_width.value as number / 2
                ball.value.y = field_height.value as number / 2
                direction_x.value = Math.random() > 0.5 ? 1 : 0
                direction_y.value = Math.random() > 0.5 ? 1 : 0
                endGame()
            }
            if (ball.value.y +
                (field_height.value as number) * 0.05 // высота шара
                >= (field_height.value as number) && direction_y.value === 1) {
                direction_y.value = 0
            }
            if (ball.value.y <= 0 && direction_y.value === 0) {
                direction_y.value = 1
            }
            if (ball.value.x + (field_height.value as number) * 0.05 + 10 > (field_width.value as number)) {
                direction_x.value = 0
            }
        }, 10);
    }

    function endGame() {
        if (!game_interval) return
        clearInterval(game_interval)
        game_interval = null
        game_start.value = false
        flag_end_game.value = true
        flag_open.value = true
    }

    watch(game_start, () => {
        if (!game_start.value) setBlink()
        else { stopBlink(), startGame() }
    }, { immediate: true })

    const right_stick_y = computed(() => {
        if (!field_height.value || !ball.value.y) return "40%"
        let stick_height = field_height.value * 0.2
        let stick_y = ball.value.y - (stick_height / 2)
        if (stick_y >= field_height.value * 0.8) {
            return `${field_height.value * 0.8}px`
        }
        if (stick_y <= 0) {
            return "0px"
        }
        return `${stick_y}px`
    })
    const left_stick_y_number = ref<number>(0)
    const left_stick_y = computed(() => {
        return `${left_stick_y_number.value}px`
    })

    const intervalUp = ref<null | number>(null)
    /**
     * 0 - вверх
     * 1 - вниз
     */
    const first_interval = ref<null | 0 | 1>(null)
    const intervalDown = ref<null | number>(null)
    function stickUp() {
        console.log("Нажатие сработало");
        if (first_interval.value === 1) {
            clearInterval(intervalDown.value as number)
            intervalDown.value = null
        }
        else {
            if (first_interval.value === null) {
                first_interval.value = 0
            }
        }
        if (intervalUp.value) return
        intervalUp.value = setInterval(() => {
            if (!field_height.value) return
            left_stick_y_number.value = left_stick_y_number.value - field_height.value * 0.01
            if (left_stick_y_number.value <= 0) left_stick_y_number.value = 0
        }, 10);
    }
    function stop_stickUp() {
        console.log("Отпускание сработало");
        if (!intervalUp.value) return
        clearInterval(intervalUp.value)
        intervalUp.value = null
        if (first_interval.value == 1) stickDown()
        else if (first_interval.value == 0) first_interval.value = null
    }
    function stickDown() {
        console.log("Нажатие сработало");
        if (first_interval.value === 0) {
            clearInterval(intervalUp.value as number)
            intervalUp.value = null
        }
        else {
            if (first_interval.value === null) {
                first_interval.value = 1
            }
        }
        if (intervalDown.value) return
        intervalDown.value = setInterval(() => {
            if (!field_height.value) return
            left_stick_y_number.value = left_stick_y_number.value + field_height.value * 0.01
            if (left_stick_y_number.value + field_height.value * 0.2 >= field_height.value) left_stick_y_number.value = field_height.value * 0.8
        }, 10);
    }
    function stop_stickDown() {
        console.log("Отпускание сработало");
        if (!intervalDown.value) return
        clearInterval(intervalDown.value)
        intervalDown.value = null
        if (first_interval.value == 0) stickUp()
        else if (first_interval.value == 1) first_interval.value = null
    }

    function keydown_list(event: KeyboardEvent) {
        if (['ArrowUp', 'ArrowDown', 'w', 's', 'ц', 'ы'].includes(event.key)) {
            event.preventDefault()
        }
        if (event.key === "w" || event.key === "ArrowUp" || event.key === "ц") {
            stickUp()
        }
        if (event.key === "s" || event.key === "ArrowDown" || event.key === "ы") {
            stickDown()
        }
    }
    function keyup_list(event: KeyboardEvent) {
        if (event.key === "w" || event.key === "ArrowUp" || event.key === "ц") {
            stop_stickUp()
        }
        if (event.key === "s" || event.key === "ArrowDown" || event.key === "ы") {
            stop_stickDown()
        }
    }
    const move_btn_height = computed(() => {
        if (!field_height.value) return "0px"
        return `${field_height.value * 0.5}px`
    })
    const move_btn_width = computed(() => {
        if (!field_height.value) return "0px"
        return `${field_height.value * 0.2}px`
    })

    const move_btn_pos = computed(() => {
        if (!field_width.value || !field_height.value) return "0px"
        return `calc(50% - ${field_width.value / 2}px - ${field_height.value * 0.2}px - 16px)`
    })
    const watch_btn = computed(() => {
        if (!game_width.value) return false
        if (game_width.value < 1300 && height_message.value == "0px") {
            return true
        }
        else return false
    })
</script>
<template>
    <board :choosed_game="prop_num_game" v-model:flag_end_game="flag_end_game" v-model:flag_open="flag_open"
        v-model:score="score" v-if="flag_open">
    </board>
    <div class="game" ref="game_link" @keydown.w="stickUp()" @keydown.arrow-up="stickUp()" @keyup.w="stop_stickUp()"
        @keyup.arrow-up="stop_stickUp()">
        <button class="move up" @touchstart.prevent="stickUp()" @touchend.prevent="stop_stickUp()"
            @contextmenu.prevent="null" v-if="watch_btn">&#xfe3f;</button>
        <button class="move down" @touchstart.prevent="stickDown()" @touchend.prevent="stop_stickDown()"
            @contextmenu.prevent="null" v-if="watch_btn">&#xfe40;</button>
        <div class="field" ref="field_link">
            <div class="stick left"></div>
            <div class="stick right"></div>
            <div class="ball"></div>
            <p>Очки: {{ score }}</p>
            <button @click="game_start = true" v-if="!game_start" class="start">Начать игру</button>
        </div>
        <div class="message">Переверните экран вашего устройства чтобы играть</div>
    </div>
</template>
<style scoped>
    .game {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-color: #b8b6b6;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100%;
        min-height: 200px;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .field {
        position: absolute;
        height: v-bind(height_field);
        aspect-ratio: 2.3/1;
        background-color: #6d6363;
        outline: v-bind(outline_field) solid black;
        overflow: hidden;
    }

    .move {
        position: absolute;
        left: v-bind(move_btn_pos);
        z-index: 1;
        height: v-bind(move_btn_height);
        width: v-bind(move_btn_width);
        color: white;
        font-size: 12px;
        text-align: center;
        user-select: none;
        touch-action: manipulation;
    }

    .up {
        top: 5%;
    }

    .down {
        bottom: 5%;
    }

    .field>.start {
        height: fit-content;
        width: fit-content;
        padding: 6px 2px;
        position: absolute;
        left: 20%;
        bottom: 20%;
    }

    .stick {
        position: absolute;
        top: 0;
        background-color: rgb(255, 255, 255);
        outline: 1px solid rgb(0, 0, 0);
        height: v-bind(stick_height);
        width: 3px;
    }

    .left {
        left: 5px;
        transform: translateY(v-bind(left_stick_y));
    }

    .right {
        right: 5px;
        transform: translateY(v-bind(right_stick_y));
    }

    .ball {
        position: absolute;
        top: 0;
        left: 0;
        aspect-ratio: 1/1;
        height: v-bind(size_ball);
        background-color: rgba(255, 0, 0, v-bind(ball_transparency));
        border-radius: 100%;
        transform:
            translateX(v-bind(x_ball)) translateY(v-bind(y_ball));
        outline: 1px solid red;
        transition: opacity 0.15s ease-in-out;
        transition: transform 1ms linear;
    }

    .message {
        height: v-bind(height_message);
        overflow: hidden;
    }
</style>
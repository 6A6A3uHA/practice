<script setup lang="ts">
import { ref } from 'vue'
import board from './board.vue'
import { useRoute } from 'vue-router'
import pic from '../assets/pic.jpg'

const prop_num_game = useRoute().meta.choose_game

const flag_open = ref(false)
const flag_end_game = ref(false)
const score = ref(0)

// текущий уровень
const level = ref(1)

// сообщения игроку
const message = ref("")

// -------- УРОВЕНЬ 1 --------
const isPlaying1 = ref(false)
const timeLeft = ref(0)

function startLevel1(time: number) {
    score.value = 0
    timeLeft.value = time
    isPlaying1.value = true

    const timer = setInterval(() => {
        timeLeft.value--

        if (timeLeft.value <= 0) {
            clearInterval(timer)
            isPlaying1.value = false
            level.value = 2
        }
    }, 1000)
}

// клик по кнопке
function addScore() {
    if (isPlaying1.value) score.value++
}

// -------- УРОВЕНЬ 2 --------
const showPic = ref(false)
const level2Active = ref(false)

function startLevel2() {
    level2Active.value = true
    showPic.value = false
    message.value = ""

    // случайный момент появления
    const randomTime = Math.random() * 15000 + 2000

    setTimeout(() => {
        showPic.value = true

        // если не нажал вовремя → проигрыш
        setTimeout(() => {
            if (showPic.value) {
                showPic.value = false
                level2Active.value = false
                message.value = "Не успел! Попробуй снова"
            }
        }, 1500)

    }, randomTime)
}

// нажал на картинку
function clickPic() {
    showPic.value = false
    level2Active.value = false
    level.value = 3
}

// -------- УРОВЕНЬ 3 --------
const question = ref("")
const answer = ref("")
const correct = ref(0)

function startLevel3() {
    const a = Math.floor(Math.random() * 10)
    const b = Math.floor(Math.random() * 10)

    question.value = `${a} + ${b}`
    correct.value = a + b
}

// проверка ответа
function checkAnswer() {
    if (Number(answer.value) === correct.value) {
        endGame()
    } else {
        message.value = "Неправильно!"
    }
}

// -------- ФИНАЛ --------
function endGame() {
    flag_end_game.value = true
    flag_open.value = true
}
</script>

<template>
    <board :choosed_game="prop_num_game" v-model:flag_end_game="flag_end_game" v-model:flag_open="flag_open"
        v-model:score="score" v-if="flag_open">
    </board>

    <!-- описание -->
    <div class="info">
        <h2>Быстрее, ловчее, умнее</h2>
        <p>Пройди 3 уровня: клики, реакция, пример</p>
    </div>

    <!-- игровое поле -->
    <div class="game-box">

        <!-- сообщения -->
        <p class="message" v-if="message">{{ message }}</p>

        <!-- УРОВЕНЬ 1 -->
        <div v-if="level === 1">
            <p>Уровень 1: кликай как можно быстрее</p>

            <div v-if="!isPlaying1">
                <button @click="startLevel1(15)">15 сек</button>
                <button @click="startLevel1(30)">30 сек</button>
                <button @click="startLevel1(60)">60 сек</button>
            </div>

            <div v-if="isPlaying1">
                <p>Время: {{ timeLeft }}</p>
                <p>Очки: {{ score }}</p>
                <button class="main-btn" @click="addScore">ЖМИ!</button>
            </div>
        </div>

        <!-- УРОВЕНЬ 2 -->
        <div v-if="level === 2">
            <p>Уровень 2: успей нажать на картинку!</p>

            <button @click="startLevel2" v-if="!level2Active">Начать</button>

            <img v-if="showPic" :src="pic" class="pic" @click="clickPic">
        </div>

        <!-- УРОВЕНЬ 3 -->
        <div v-if="level === 3">
            <p>Уровень 3: реши пример</p>

            <button @click="startLevel3">Готов?</button>

            <div v-if="question">
                <p>{{ question }}</p>
                <input v-model="answer" type="text">
                <button @click="checkAnswer">Ответить</button>
            </div>
        </div>

    </div>
</template>

<style scoped>
.info {
    margin-bottom: 20px;
}

.game-box {
    border: 2px solid white;
    padding: 150px;
    border-radius: 12px;
    width: 400px;
    background-color: rgba(113, 114, 108, 0.873);
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

button {
    padding: 10px 20px;
    margin: 5px;
}

.main-btn {
    font-size: 20px;
    background-color: #646cff;
    color: white;
}

.pic {
    width: 120px;
    cursor: pointer;
}

.message {
    color: #ff6b6b;
}
</style>
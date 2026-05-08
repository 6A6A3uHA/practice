<script setup lang="ts">
    import { ref } from 'vue';
    import board from './board.vue';
    import { useRoute } from 'vue-router';

    const prop_num_game = useRoute().meta.choose_game//Не трогать
    const flag_open = ref<boolean>(true)//Флаг отображения таблицы
    const flag_end_game = ref<boolean>(true)//Включать когда игра заканчивается
    const score = ref(0)//количество очков в игре
</script>
<template>
    <board :choosed_game="prop_num_game" v-model:flag_end_game="flag_end_game" v-model:flag_open="flag_open"
        v-model:score="score" v-if="flag_open">
    </board>
    <div class="game">
        <!--Здесь пишем игру
            Игра начинается по кнопке, а не мгновенно
            флаги выше нужны для работы компонента    
        -->
    </div>
</template>
<style scoped>
    .for_game {
        position: relative;
        flex: 1;
        overflow: hidden;
    }

    .window {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        z-index: 1;
        flex: 1;
        margin-top: 175px;
        margin-bottom: 10px;
        inset: 0;
        overflow: hidden;
    }
</style>
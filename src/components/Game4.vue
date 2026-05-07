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
    <div v-if="flag_open" class="window">
        <board :choosed_game="prop_num_game" v-model:flag_end_game="flag_end_game" v-model:flag_open="flag_open"
            v-model:score="score">
        </board>
    </div>
    <div class="game">
        <!--Здесь пишем игру
            Игра начинается по кнопке, а не мгновенно
            флаги выше нужны для работы компонента    
        -->
    </div>
</template>
<style scoped>
    .window {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
</style>
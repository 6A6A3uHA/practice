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
    })
    onUnmounted(() => {
        getDynamicSize_field.disconnect()
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

</script>
<template>
    <board :choosed_game="prop_num_game" v-model:flag_end_game="flag_end_game" v-model:flag_open="flag_open"
        v-model:score="score" v-if="flag_open">
    </board>
    <div class="game" ref="game_link">
        <!--Здесь пишем игру
            Игра начинается по кнопке, а не мгновенно
            флаги выше нужны для работы компонента    
        -->
        <div class="field" ref="field_link">
            <div class="stick left"></div>
            <div class="stick right"></div>
            <div class="ball"></div>
            <p>Ширина: {{ field_width }}</p>
            <p>Высота: {{ field_height }}</p>
            <button @click="">Начать игру</button>
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
        aspect-ratio: 2.1/1;
        background-color: #6d6363;
        outline: v-bind(outline_field) solid black;
        overflow: hidden;
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
    }

    .right {
        right: 5px;
    }

    .ball {
        aspect-ratio: 1/1;
        height: v-bind(size_ball);
        background-color: red;
        border-radius: 100%;
    }

    .message {
        height: v-bind(height_message);
        overflow: hidden;
    }
</style>
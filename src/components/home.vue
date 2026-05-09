<script setup lang="ts">
    import { ref } from 'vue';
    import { RouterLink } from "vue-router";
    import { choosed_game_type } from '../composables/useType';
    /**
     * По умолчанию 0
     */
    const choose_game = ref<choosed_game_type | 0>(0)
</script>
<template>
    <div class="flex">
        <RouterLink :to="{ name: 'game1' }" class="card">
            <img src="#" alt="Фото этой игры">
            <button>Играть в пинг-понг</button>
        </RouterLink>
        <RouterLink :to="{ name: 'game2' }" class="card">
            <img src="#" alt="Фото этой игры">
            <button>Играть</button>
        </RouterLink>
        <RouterLink :to="{ name: 'game3' }" class="card">
            <img src="#" alt="Фото этой игры">
            <button>Играть</button>
        </RouterLink>
        <RouterLink :to="{ name: 'game4' }" class="card">
            <img src="#" alt="Фото этой игры">
            <button>Играть</button>
        </RouterLink>
    </div>
</template>
<style scoped>
    .flex {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        align-items: center;
        gap: 40px;
    }

    .card {
        min-width: 300px;
        min-height: 300px;
        max-width: 600px;
        max-height: 600px;
    }

    .card:hover {
        cursor: pointer;
    }
</style>
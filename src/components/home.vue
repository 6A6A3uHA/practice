<script setup lang="ts">
    import { RouterLink } from "vue-router";
</script>
<template>
    <div class="flex">
        <RouterLink :to="{ name: 'game1' }" class="card">
            <img src="../assets/pingpong.png" alt="Фото этой игры">
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
        position: relative;
        margin-top: 50px;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        align-items: center;
        gap: 40px;
    }

    .card {
        width: min(90vw, 400px);
        height: min(min-content, 80vh);
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1/1;
        outline: 1px solid white;
        padding: 20px;
        box-sizing: border-box;
        flex-shrink: 1;
    }

    .card>img {
        width: 100%;
        height: 40%;
        object-fit: contain;
        flex-shrink: 0;
        margin-bottom: 20px;
    }

    button {
        width: 60%;
        flex-shrink: 0;
        padding: 10px 20px;
        font-size: 16px;
    }

    .card:hover {
        cursor: pointer;
        transform: scale(1.05);
        transition: transform 0.2s;
    }
</style>
<script setup lang="ts">
    import { RouterView, useRoute, useRouter } from 'vue-router';
    import { computed, onMounted } from 'vue';
    import useNavigate from '../composables/useNavigate';

    onMounted(() => {
        const route = useRoute()
        const router = useRouter()
        if (route.name === 'leaderboard') {
            router.replace({ name: 'board', params: { numgame: 1 } })
        }
    })

    const route = useRoute()
    const game = computed(() => Number(route.params.numgame as string))
</script>

<template>
    <nav>
        <button @click="useNavigate.Navigate('board', 1)" :class="{ selected: game === 1 }">
            Рейтинг игроков: Пинг-понг
        </button>

        <button @click="useNavigate.Navigate('board', 2)" :class="{ selected: game === 2 }">
            Рейтинг игроков: Змейка
        </button>

        <button @click="useNavigate.Navigate('board', 3)" :class="{ selected: game === 3 }">
            Рейтинг игроков: Поймай предметы
        </button>

        <button @click="useNavigate.Navigate('board', 4)" :class="{ selected: game === 4 }">
            Рейтинг игроков: Космический стрелок
        </button>
    </nav>

    <RouterView />
</template>

<style scoped>
    .selected {
        outline: 2px solid rgb(153, 40, 153);
    }

    button {
        outline: 1;
        border: 0;
        font-size: 12px;
    }

    botton:focus {
        outline: 0;
        border: 0;
    }

    button:hover {
        outline: 4px solid rgb(218, 218, 113);
        border: 0;
    }

    nav {
        height: 20%;
        padding-top: 20px;
        padding-bottom: 20px;
        width: 100%;
        flex: 0.1;
        display: flex;
        justify-content: center;
        gap: 20px;
        align-items: center;
        overflow: hidden;
    }
</style>
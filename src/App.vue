<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    // import useUser from './composables/useUser';
    import { useRoute } from 'vue-router';
    const isHome = useRoute().name === 'home'

</script>

<template>
    <header>
        <div class="left_header">
            <RouterLink :to="{ name: 'home' }" v-if="isHome" title="Вернуться на главную">
                <img src="#" alt="logo or smth">
            </RouterLink>
            <div v-else>
                <img src="#" alt="logo or smth">
            </div>
        </div>
        <div>
            <RouterLink :to="{ name: 'leaderboard' }">
                Рейтинг игроков
            </RouterLink>
            <RouterLink :to="{ name: 'game1' }" v-if="useRoute().name !== 'game1' && useRoute().name !== 'home'">
                Название игры1
            </RouterLink>
            <RouterLink :to="{ name: 'game2' }" v-if="useRoute().name !== 'game2' && useRoute().name !== 'home'">
                Название игры2
            </RouterLink>
            <RouterLink :to="{ name: 'game3' }" v-if="useRoute().name !== 'game3' && useRoute().name !== 'home'">
                Назыание игры3
            </RouterLink>
            <RouterLink :to="{ name: 'game4' }" v-if="useRoute().name !== 'game4' && useRoute().name !== 'home'">
                Название игры4
            </RouterLink>
        </div>

    </header>
    <main>
        <RouterView />
    </main>
    <footer>

    </footer>
</template>

<style scoped>
    header {
        position: fixed;
        z-index: 9999;
        /**Никогда ничем не перекроется */
    }

    main {
        position: relative;
        flex-grow: 1;
    }

    footer {}
</style>

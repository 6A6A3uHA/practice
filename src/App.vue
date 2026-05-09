<script setup lang="ts">
    import { computed } from 'vue';
    import { RouterLink } from 'vue-router';
    import { useRoute } from 'vue-router';
    const isHome = computed(() => useRoute().name === 'home')
    const nav = computed(() => {
        return isHome.value ? 'end' : 'space-around'
    })

</script>

<template>
    <header>
        <div class="left_header">
            <RouterLink :to="{ name: 'home' }" title="Вернуться на главную">
                <img src="./assets/vue.svg" alt="logo or smth">
            </RouterLink>
        </div>
        <div class="navigation">
            <RouterLink :to="{ name: 'board', params: { numgame: 1 } }">
                Рейтинг игроков
            </RouterLink>
            <RouterLink :to="{ name: 'game1' }" v-if="useRoute().name !== 'game1' && !isHome">
                Пинг-понг
            </RouterLink>
            <RouterLink :to="{ name: 'game2' }" v-if="useRoute().name !== 'game2' && !isHome">
                Название игры2
            </RouterLink>
            <RouterLink :to="{ name: 'game3' }" v-if="useRoute().name !== 'game3' && !isHome">
                Назыание игры3
            </RouterLink>
            <RouterLink :to="{ name: 'game4' }" v-if="useRoute().name !== 'game4' && !isHome">
                Название игры4
            </RouterLink>
        </div>
    </header>
    <main>
        <RouterView />
    </main>
    <footer>
        <hr>
        <div>
            <p>Сайт с 4 играми</p>
            <p>Работали Семенов Михаил, Осорина София, Мамедов Арсений, Гриднев Егор</p>
        </div>
    </footer>
</template>

<style scoped>
    header {
        position: fixed;
        z-index: 9999;
        /**Никогда ничем не перекроется */
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: rgb(24, 24, 24);
        padding: 20px;
    }

    .navigation {
        display: flex;
        flex-flow: row nowrap;
        justify-content: v-bind(nav);
        align-items: center;
        width: 50%;
    }

    main {
        height: 100%;
        width: 100%;
        margin-top: 75px;
        padding: 0px;
        position: relative;
        flex-grow: 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        flex: 1;
    }

    footer {
        margin-top: 80px;
        margin-bottom: 80px;
    }
</style>

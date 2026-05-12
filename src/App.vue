<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';

const route = useRoute()
const isHome = computed(() => route.name === 'home')
const nav = computed(() => {
    return isHome.value ? 'end' : 'space-around'
})
const normal_size = ref<boolean>(true)
const width_header = ref<number | null>(null)
watch(width_header, () => {

    if (!width_header.value || width_header.value < 1300) normal_size.value = false

    else normal_size.value = true
})

const getDynamicSize = new ResizeObserver((list_of_elements) => {
    const header = list_of_elements[0]
    const { width } = header?.contentRect as DOMRectReadOnly
    width_header.value = width
})

const open_narrow_navigation = ref<boolean>(false)

const link_header = ref<HTMLElement | null>(null)

onMounted(() => {
    if (link_header.value) getDynamicSize.observe(link_header.value)
})


const height = ref<string>('0')

watch(open_narrow_navigation, () => {
    if (open_narrow_navigation.value) height.value = '100vh'
    else height.value = '0'
})
watch(route, () => {
    open_narrow_navigation.value = false
})
</script>

<template>
    <header ref="link_header">
        <div class="left_header">
            <RouterLink :to="{ name: 'home' }" title="Вернуться на главную">
                <img src="./assets/vue.svg" alt="logo or smth">
            </RouterLink>
        </div>
        <div class="navigation" v-if="normal_size">
            <RouterLink :to="{ name: 'board', params: { numgame: 1 } }">
                Рейтинг игроков
            </RouterLink>
            <RouterLink :to="{ name: 'game1' }" v-if="useRoute().name !== 'game1' && !isHome">
                Пинг-понг
            </RouterLink>
            <RouterLink :to="{ name: 'game2' }" v-if="useRoute().name !== 'game2' && !isHome">
                Змейка
            </RouterLink>
            <RouterLink :to="{ name: 'game3' }" v-if="useRoute().name !== 'game3' && !isHome">
                Поймай предметы
            </RouterLink>
            <RouterLink :to="{ name: 'game4' }" v-if="useRoute().name !== 'game4' && !isHome">
                Космический стрелок
            </RouterLink>
            <RouterLink :to="{ name: 'game5' }" v-if="useRoute().name !== 'game5' && !isHome">
                Быстрее, ловчее, умнее
            </RouterLink>
        </div>
        <div v-else class="mobile_navigation">
            <button class="icon_narrow_nav" @click="open_narrow_navigation = !open_narrow_navigation">
                {{ !open_narrow_navigation ? '&#8801;' : '&#9662;' }}
            </button>
        </div>
    </header>
    <main>
        <nav class="narrow_navigation" @click="open_narrow_navigation = false">
            <div class="nav_block">
                <RouterLink :to="{ name: 'board', params: { numgame: 1 } }"
                    :class="{ narrow_navigation_selected: route.name == 'board' ? true : false }">
                    Рейтинг игроков
                </RouterLink>
                <RouterLink :to="{ name: 'game1' }"
                    :class="{ narrow_navigation_selected: route.name == 'game1' ? true : false }">
                    Пинг-понг
                </RouterLink>
                <RouterLink :to="{ name: 'game2' }"
                    :class="{ narrow_navigation_selected: route.name == 'game2' ? true : false }">
                    Змейка
                </RouterLink>
                <RouterLink :to="{ name: 'game3' }"
                    :class="{ narrow_navigation_selected: route.name == 'game3' ? true : false }">
                    Поймай предметы
                </RouterLink>
                <RouterLink :to="{ name: 'game4' }"
                    :class="{ narrow_navigation_selected: route.name == 'game4' ? true : false }">
                    Космический стрелок
                </RouterLink>
                <RouterLink :to="{ name: 'game5' }"
                    :class="{ narrow_navigation_selected: route.name == 'game5' ? true : false }">
                    Быстрее, ловчее, умнее
                </RouterLink>
            </div>
        </nav>
        <RouterView />
    </main>
    <footer>
        <hr>
        <div>
            <p>Сайт с 5 играми</p>
            <p>Работали Семенов Михаил, Осорина София, Мамедов Арсений, Григорьев Егор</p>
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
    right: 0;
    height: 30px;
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

.icon_narrow_nav {
    margin: 0px;
    padding: 0px;
    font-size: 30px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

main {
    min-height: 40vh;
    height: max-content;
    height: 100%;
    width: 100%;
    margin-top: 70px;
    padding: 0px;
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

.narrow_navigation {
    height: v-bind(height);
    width: 100%;
    flex: 1;
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    right: 0;
    transition: height 400ms ease-in-out;
    overflow: hidden;
    background-color: rgb(32, 33, 34);
    display: flex;
    margin-top: 70px;
    align-items: start;
    justify-content: center;
}

.nav_block {
    position: sticky;
    display: flex;
    flex-flow: column nowrap;
    height: min-content;
    width: fit-content;
    justify-content: space-evenly;
}

.narrow_navigation_selected {
    color: rgb(245, 243, 112);
}

footer {
    z-index: 9999;
    min-height: 100px;
    margin-top: 80px;
    padding-bottom: 40px;
    background-color: rgb(24, 24, 24);
}
</style>

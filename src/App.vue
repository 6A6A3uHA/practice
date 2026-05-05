<script setup>
import { RouterLink } from 'vue-router';
import home from './composables/home.vue';
import Game1 from './components/Game1.vue';


</script>

<template>
    <header>
        <RouterLink :to="{ name: home }">1</RouterLink>
        <RouterLink :to="{ name: Game1 }">2</RouterLink>
    </header>
    <section v-if="home">
        <!--Карточки игр, отцентровать и т д-->
    </section>
    <section v-if="nothome">
        <RouterView/>
    </section>
</template>

<style scoped>

</style>

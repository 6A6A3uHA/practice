<script setup>
import { RouterLink } from 'vue-router';
import home from './composables/home.vue';


</script>

<template>
    <header>
        <RouterLink :to="{ name: home }">1</RouterLink>
        <RouterLink :to="{ name: 'game1' }">2</RouterLink>
    </header>
    <section>
        <RouterView/>
    </section>
</template>

<style scoped>

</style>

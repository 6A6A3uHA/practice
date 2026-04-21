<script setup>
import { RouterLink } from 'vue-router';
import home from './composables/home.vue';


</script>

<template>
    <RouterLink :to="{name: home}">1</RouterLink>
    <RouterLink :to="{name: nothome}">2</RouterLink>
    <RouterView/>
</template>

<style scoped>

</style>

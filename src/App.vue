<script setup>
    import { RouterLink } from 'vue-router';
    import useUser from './composables/useUser';

</script>

<template>
    <header>
        <RouterLink :to="{ name: 'home' }">1</RouterLink>
    </header>
    <section>
        <RouterView/>
    </section>
</template>

<style scoped>

</style>

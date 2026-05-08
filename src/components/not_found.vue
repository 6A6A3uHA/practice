<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { router } from '../route';
    if (useRoute().path != '/not_found') {
        router.push({ path: '/not_found' })
    }
</script>
<template>
    <h1>Страницы не существует</h1>
</template>
<style scoped></style>
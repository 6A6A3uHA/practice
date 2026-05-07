<script setup lang="ts">
    type choosed_game_type = (1 | 2 | 3 | 4)
    /**
     * Может быть назначено от 1 до 4
     */
    const choosed_game = defineModel<choosed_game_type>('choosed_game', { default: 1 })
</script>
<template>

</template>
<style scoped></style>
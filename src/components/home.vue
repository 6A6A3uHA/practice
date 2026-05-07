<script setup lang="ts">
    import { ref } from 'vue';
    import { choosed_game_type } from '../composables/useType';
    /**
     * По умолчанию 0
     */
    const choose_game = ref<choosed_game_type | 0>(0)
</script>
<template>

</template>
<style scoped></style>
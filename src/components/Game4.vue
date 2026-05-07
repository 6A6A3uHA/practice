<script setup lang="ts">
    import { ref } from 'vue';
    import board from './board.vue';

    import { choosed_game_type, flag_type } from '../composables/useType';

    const ref_prop = ref < choosed_game_type > (4)
    const flag = ref < flag_type > (true)//Включать когда игра заканчивается
</script>
<template>
    <div v-if="flag" class="window">
        <board v-model="ref_prop"></board>
    </div>
</template>
<style scoped>
    .window {
        position: absolute;
        display: flex;
        justify-content: center;
        align-self: center;
        min-width: 200px;
        max-width: 600px;
        min-height: 400px;
        max-height: 800px;
    }
</style>
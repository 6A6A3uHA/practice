<script setup lang="ts">
    import { RouterView, useRoute, useRouter } from 'vue-router';
    import { computed, onMounted } from 'vue';
    import useNavigate from '../composables/useNavigate';
    onMounted(() => {
        if (useRoute().name === 'leaderboar') {
            useRouter().push({ name: 'board', params: { numgame: 1 } })
        }
    })
    const route = useRoute()
    const game = computed(() => Number(route.params.numgame as string))

</script>
<template>
    <nav>
        <button @click="useNavigate.Navigate('board', 1)" :class="{ selected: game === 1 }">Игра 1</button>
        <button @click="useNavigate.Navigate('board', 2)" :class="{ selected: game === 2 }">Игра 2</button>
        <button @click="useNavigate.Navigate('board', 3)" :class="{ selected: game === 3 }">Игра 3</button>
        <button @click="useNavigate.Navigate('board', 4)" :class="{ selected: game === 4 }">Игра 4</button>
    </nav>
    <RouterView />
</template>
<style scoped>
    .selected {
        outline: 2px solid rgb(153, 40, 153);

    }

    button {
        outline: 1;
        border: 0;
    }

    botton:focus {
        outline: 0;
        border: 0;
    }

    button:hover {
        outline: 4px solid rgb(218, 218, 113);
        border: 0;
    }

    nav {
        height: 20%;
        padding-top: 20px;
        padding-bottom: 20px;
        width: 100%;
        flex: 0.1;
        display: flex;
        justify-content: center;
        gap: 20px;
        align-items: center;
        overflow: hidden;
    }
</style>
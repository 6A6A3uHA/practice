<script setup lang="ts">
    import { computed, ref, watch } from 'vue'
    import { choosed_game_type } from '../composables/useType'
    import { useRoute } from 'vue-router';
    import useUser from '../composables/useUser';

    const props = defineProps<{
        choosed_game?: choosed_game_type | 0
        score?: number
        flag_end_game?: boolean
        flag_open?: boolean
    }>()
    const emit = defineEmits<{
        'update:choosed_game': [value: choosed_game_type | 0],
        'update:flag_end_game': [value: boolean],
        'update:flag_open': [value: boolean]
    }>()

    const route = useRoute()
    const where_i = ref()
    watch(() => route, () => {
        where_i.value = { name: route.name, numgame: route.params.numgame }
    }, { deep: true })

    const flag_page_leaderboard = computed(() => typeof route?.params?.numgame === 'string')

    const flag_updated = ref(0)

    /**
     * Принимает как :chosed_game, так и v-model:choosed_game или значение из атрибута страницы
     */
    const game = computed({
        get: () => {
            if (flag_page_leaderboard.value) {
                return Number(route.params.numgame) as choosed_game_type
            }
            return props?.choosed_game ?? 0
        },
        set(val: choosed_game_type) {
            if (flag_page_leaderboard.value) {
                return
            }
            emit('update:choosed_game', val)
        }
    })

    /**
     * Флаг того что человек отыграл и получил некое количество очков, допустимое для записи в таблицу
     */
    const flag_write = computed({
        get: () => {
            if (flag_page_leaderboard.value) {
                return false
            }
            return props?.flag_end_game ?? false
        },
        set(val: boolean) {
            if (flag_page_leaderboard.value) {
                return
            }
            emit('update:flag_end_game', val)
        }
    })

    /**
     * Флаг открытого окна, если false окно должно быть закрыто
     */
    const flag_open = computed<boolean>({
        get: () => {
            if (flag_page_leaderboard.value) {
                return true
            }
            return props?.flag_open ?? true
        },
        set: (val: boolean) => {
            if (flag_page_leaderboard.value) {
                return
            }
            emit('update:flag_open', val)
        }
    })

    /**
     * Неизменяемый компонентом пропс
     */
    const score = computed<number>({
        get: () => {
            if (flag_page_leaderboard.value) {
                return 0
            }
            return props?.score ?? -1
        },
        set: (val) => {
            val
            return
        }
    })

    const name = ref<string>("")

    const counter = ref(0)

    const sorted_list_users = computed(() => {
        void flag_write.value
        void flag_updated.value
        void flag_open.value
        void score.value
        if (game.value !== 0) {
            return useUser.getUsers(game.value)
        }
        else return { 1: { name: "Возникла ошибка", score: "-1" } }
    })

    watch(sorted_list_users, () => {// Debug
        counter.value++
    })
    function write_user() {
        flag_updated.value++
        if (game.value === 0) return

        useUser.setUser(game.value, { name: name.value, score: score.value })
        flag_write.value = false

        name.value = ''
        return
    }

    const height = computed(() => { return flag_write.value ? '40%' : flag_page_leaderboard.value ? '100%' : '80%' })
    const width = computed(() => { return flag_write.value ? '40%' : flag_page_leaderboard.value ? '80%' : '60%' })
</script>
<template>
    <div class="block">
        <div class="board">
            <div class="close" @click="flag_open = false" v-if="!flag_page_leaderboard">&#65336;</div>
            <div class="scroller">
                <div class="grid" v-for="value, id in sorted_list_users" :key="id">
                    <div class="grid_cell">{{ value.name }}</div>
                    <div class="grid_cell">{{ value.score }}</div>
                </div>
            </div>
            <div class="interactive" v-if="!flag_page_leaderboard">
                <div class="write_box" v-if="flag_write">
                    <div>Вы набрали {{ score }} очков. Желаете записать свое имя в таблицу рейтинга?</div>
                    <div class="input_name">
                        <input type="text" v-model="name">
                        <button @click="write_user()">Записать свое имя</button>
                    </div>
                </div>
                <button @click="flag_open = !flag_open;">Играть еще раз</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .block {
        z-index: 1;
        width: 100%;
        min-height: 100%;
        max-height: 100%;
        flex: 1;
        background-color: rgba(128, 128, 128, 0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 10px;
        margin-top: 0px;
        margin-bottom: 0px;
        overflow: hidden;
    }

    .board {
        z-index: 2;
        position: relative;
        border: 1px solid rgb(32, 32, 32);
        border-radius: 10px;
        box-shadow: 1px 1px black;
        flex: 0.8;
        width: v-bind(width);
        height: v-bind(height);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        margin-top: 20px;
        margin-bottom: 20px;
        background-color: rgb(40, 41, 41);
    }

    .scroller {
        flex: 1;
        min-height: 0;
        min-width: 100%;
        overflow-y: scroll;
        border: 1px solid rgb(22, 22, 22);
        max-height: 350px;
    }

    /* Остальные стили без изменений */
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        align-items: center;
    }

    .grid_cell {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 30px;
        border: 1px solid rgb(68, 68, 68);
        box-sizing: border-box;
    }

    .interactive {
        width: 60%;
        padding: 10px 0;
    }

    .interactive>button {
        padding: 3px 5px 3px 5px;
    }

    .write_box {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        margin: 10px;
    }

    .input_name {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 50%;
    }

    .input_name>input {
        max-width: 50%;
        min-width: 50px;
        width: auto;
    }

    .input_name>button {
        padding: 3px 5px 3px 5px;
        white-space: nowrap;
    }

    .close {
        position: absolute;
        top: 10px;
        right: 10px;
        height: 20px;
        width: 20px;
        cursor: pointer;
        z-index: 3;
        background: rgba(0, 0, 0, 0.5);
        /* Чтобы крестик был виден на фоне */
        color: white;
        text-align: center;
        line-height: 20px;
        border-radius: 4px;
    }
</style>
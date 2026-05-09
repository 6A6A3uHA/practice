function initLS() {
    if (!localStorage.getItem('1') || !localStorage.getItem('2') || !localStorage.getItem('3') || !localStorage.getItem('4')) {
        localStorage.setItem('1', JSON.stringify({
            0: { name: 'game1-1', score: 1 },
            1: { name: 'game1-2', score: 2 },
            2: { name: 'game1-3', score: 3 }
        }))
        localStorage.setItem('add1', String(3))
        localStorage.setItem('2', JSON.stringify({
            0: { name: 'game2-1', score: 1 },
            1: { name: 'game2-2', score: 2 },
            2: { name: 'game2-3', score: 3 }
        }))
        localStorage.setItem('add2', String(3))
        localStorage.setItem('3', JSON.stringify({
            0: { name: 'game3-1', score: 1 },
            1: { name: 'game3-2', score: 2 },
            2: { name: 'game3-3', score: 3 }
        }))
        localStorage.setItem('add3', String(3))
        localStorage.setItem('4', JSON.stringify({
            0: { name: 'game4-1', score: 1 },
            1: { name: 'game4-2', score: 2 },
            2: { name: 'game4-3', score: 3 }
        }))
        localStorage.setItem('add4', String(3))
    }
}

try {
    initLS()
}
catch (e) {
    console.warn("Storage init failed", e)
}

interface User {
    name: string,
    score: number
}

type Id = number
type Users = Record<Id, User>

type Number_from_game = 1 | 2 | 3 | 4


function setUser(number_game: Number_from_game, user: User): void {
    let new_id: Id = Number(localStorage.getItem(`add${number_game}`) as string)
    const users_from_game: Users = JSON.parse(localStorage.getItem(String(number_game)) as string)

    users_from_game[new_id] = user

    localStorage.setItem(String(number_game), JSON.stringify(users_from_game))
    localStorage.setItem(`add${number_game}`, String(new_id + 1))
    return
}

function getUsers(number_game: Number_from_game) {
    const users_from_game: Users = JSON.parse(localStorage.getItem(String(number_game)) as string)
    return Object.fromEntries(//Собирает record по ключу и значению : [key, user]
        Object.values(users_from_game).sort((a, b) => b.score - a.score) // Создает [] где пользователи расположены в порядке убывания score
            .map((user, index) => [index, user])//Возвращает [index, user], где пользователь уже отсортирован по убыванию очков
    )
}

export default {
    setUser,
    getUsers
}
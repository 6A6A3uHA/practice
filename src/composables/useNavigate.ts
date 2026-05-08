import { router } from "../route"

function Navigate(name: 'board', numgame: 1 | 2 | 3 | 4): void
function Navigate(name: 'home' | 'game1' | 'game2' | 'game3' | 'game4' | 'leaderboard' | '404'): void

function Navigate(name: string, numgame?: number): void {
    if (numgame) {
        router.push({ name: name, params: { numgame: String(numgame) } })
    }
    else router.push({ name: name })
}

export default { Navigate }
import Game from "../classes/models/game.class.js"
import { gameSessions } from "./sessions.js";

export const addGameSession = (gameId) => {
    const session = new Game(gameId);
    gameSessions.push(session);

    return session;
}

export const removeGameSession = (gameId) => {
    const index = gameSessions.findIndex((game) => game.id === gameId);
    if (index !== -1) {
        return gameSessions.splice(index, 1)[0]
    }
}

export const getGameSession = (gameId) => {
    return gameSessions.find((game) => game.id === gameId)
}

// 현재 활성화된 게임의 총 개수 확인용
export const getAllGameSessions = () => {
    return gameSessions;
}


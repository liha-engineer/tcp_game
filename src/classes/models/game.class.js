import { gameStartNotification } from "../../utils/notification/game.notification.js";
import IntervalManager from "../managers/interval.manager.js";

const MAX_PLAYERS = 4;

class Game {
    constructor(gameId) {
        this.id = gameId;
        this.users = [];
        this.intervalManager = new IntervalManager();
        this.state = 'waiting' // waiting, progress
    }

    addUser(user) {
        if (this.users.length >= MAX_PLAYERS) {
            throw new Error ('Game session is full!');
        }
        this.users.push(user);

        this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000)
        if (this.users.length === MAX_PLAYERS) {
            const interval = 3000;
            alert(`${Math.floor(interval / 1000)} 초 후에 게임이 시작됩니다`)
            setTimeout(() => {
                this.startGame()
            }, interval)
        }
    }

    getUser(userId) {
        return this.users.find((user => user.id === userId));
    }

    removeUser(userId) {
        this.users = this.users.filter((user) => user.id !== userId);
        this.intervalManager.removePlayer(userId);

        if (this.users.length < MAX_PLAYERS) {
            this.state = 'waiting';
        }
    }

    getMaxLatency() {
        let maxLatency = 0;
        this.users.forEach((user) => {
            maxLatency = Math.max(maxLatency, user.latency);
        });
        return maxLatency;
    }

    startGame() {
        this.state = 'progress';
        const startPacket = gameStartNotification(this.gameId, Date.now());
        console.log(`현재 레이턴시: ${this.getMaxLatency()}`);

        this.users.forEach((user) => {
            user.socket.write(startPacket);
        })
    }

    
    getAllLocation() {
        const maxLatency = this.getMaxLatency();
        const locationData = this.users.map((user) => {
            const {x , y} = user.calculateLocation(maxLatency);
            return {id: user.id, x, y};
        });

        return createLocationPacket(locationData);
    }

}

export default Game;
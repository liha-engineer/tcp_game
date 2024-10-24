const MAX_PLAYERS = 4;

class Game {
    constructor(gameId) {
        this.id = gameId;
        this.users = [];
        this.state = 'waiting' // waiting, progress
    }

    addUser(user) {
        if (this.users.length >= MAX_PLAYERS) {
            throw new Error ('Game session is full!');
        }
        this.users.push(user);

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

        if (this.users.length < MAX_PLAYERS) {
            this.state = 'waiting';
        }
    }

    startGame() {
        this.state = 'progress';
    }

}

export default Game;
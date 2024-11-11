import { createPingPacket } from "../../utils/notification/game.notification.js";

// user.session.js에 User 클래스가 추가될 것 
class User {
    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.sequence = 0;
        this.lastUpdateTime = Date.now();
        this.latency = 0;
    }

    updateLocation(x, y) {
        this.x = x;
        this.y = y;
        this.lastUpdateTime = Date.now();
    }

    
    getNextSequence() {
        return ++this.sequence;
    }

    ping() {
        const now = Date.now();

        console.log(`[${this.id}] ping`);
        this.socket.write(createPingPacket(now));
    }

    handlePong(data) {
        const now = Date.now();
        this.latency = (now - data.timestamp) / 2;
        console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency} ms`);
    }


    calculateLocation(latency) {
        const timeDiff = latency / 1000;
        // 속도는 무조건 1로 고정
        const speed = 1;
        const distance = speed * timeDiff;

        return {
            x: this.x + distance,
            y: this.y,
        }
    }
}

export default User;
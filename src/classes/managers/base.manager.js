class BaseManager {
    constructor() {
        // 부모 클래스 그대로 생성하지 못하도록 방어로직
        if(new.target === BaseManager) {
            throw new Error ("Cannot construct BaseManager instance as abstract class!");
        }
    }

    addPlayer(playerId, ...args) {
        throw new Error("Method not implemented.")
    }

    removePlayer(playerId) {
        throw new Error("Method not implemented.")
    }

    clearAll() {
        throw new Error("Method not implemented.")
    }

}

export default BaseManager;

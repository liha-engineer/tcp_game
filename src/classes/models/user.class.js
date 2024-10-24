// user.session.js에 User 클래스가 추가될 것 
class User {
    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.sequence = 0;
        this.lastUpdateTime = Date.now();
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.lastUpdateTime = Date.now();
    }

    
    getNextSequence() {
        return ++this.sequence;
    }
}

export default User;
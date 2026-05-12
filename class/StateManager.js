// class/StateManager.js
class StateManager {
    constructor(initialState = {}) {
        this.state = JSON.parse(JSON.stringify(initialState));
        this.io = null;
    }

    set(key, value) {
        const keys = key.split('.');
        let obj = this.state;
        for (let i = 0; i < keys.length - 1; i++) {
            if (obj[keys[i]] === undefined) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;

        this.emitChange();
        return value;
    }

    get(key) {
        if (!key) return this.state;
        const keys = key.split('.');
        let obj = this.state;
        for (let k of keys) {
            if (obj === undefined || obj === null) return undefined;
            obj = obj[k];
        }
        return obj;
    }

    setIO(ioInstance) {
        this.io = ioInstance;
    }

    emitChange() {
        if (this.io) {
            const fullState = this.state;
            const guiState = this.get('GUI') || {};

            // Belangrijk voor jouw client code
            this.io.sockets.emit('s', fullState);        // <--- dit verwacht de map
            this.io.sockets.emit('state', guiState);
            this.io.sockets.emit('update', fullState);
        }
    }
}

module.exports = StateManager;
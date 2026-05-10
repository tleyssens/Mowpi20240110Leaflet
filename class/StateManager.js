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
        this.emitChange(key, value);
        return value;
    }

    get(key) {
        if (!key) return this.state;
        const keys = key.split('.');
        let obj = this.state;
        for (let k of keys) {
            obj = obj ? obj[k] : undefined;
        }
        return obj;
    }

    update(partial) {
        Object.assign(this.state, partial);
        this.emitChange('update', partial);
    }

    setIO(ioInstance) {
        this.io = ioInstance;
    }

    emitChange(key, value) {
        if (this.io) {
            // Volledige backward compatibility voor client
            const fullState = this.get();
            this.io.emit('s', fullState);
            this.io.emit('state', fullState.GUI || fullState);
        }
    }
}

module.exports = StateManager;
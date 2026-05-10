// class/StateManager.js
// Beheert globale state op centraal punt - refactor van losse s object

class StateManager {
    constructor(initialState) {
        this.state = { ...initialState };
        this.io = null;
    }

    set(key, value) {
        // Ondersteunt geneste keys zoals 'GUI.MaaiMES' of 'mission.active'
        const keys = key.split('.');
        let obj = this.state;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
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
            if (obj === undefined) return undefined;
            obj = obj[k];
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
            this.io.sockets.emit('state', this.get('GUI'));
            this.io.sockets.emit('s', this.state);
        }
    }
}

module.exports = StateManager;
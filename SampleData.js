'use strict';

module.exports = class SampleData {
    constructor(name, message) {
        this._name = name;
        this._message = message;
        this._timestamp = Date.now();
    }

    get timestamp() {
        return this._timestamp;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    toJSON() {
        return {
            name: this._name,
            message:  this._message,
            timestamp:   this._timestamp
        };
    }
};

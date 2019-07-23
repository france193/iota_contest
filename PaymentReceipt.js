'use strict';

module.exports = class PaymentReceipt {
    constructor(tailhash, address, amount) {
        this._tailhash = tailhash;
        this._address = address;
        this._amount = amount;
    }

    get tailhash() {
        return this._tailhash;
    }

    set tailhash(value) {
        this._tailhash = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get amount() {
        return this._amount;
    }

    set amount(value) {
        this._amount = value;
    }

    toJSON() {
        return {
            tailhash: this.tailhash,
            address: this.address,
            amount: this.amount
        };
    }
};

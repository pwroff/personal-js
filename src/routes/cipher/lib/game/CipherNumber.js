/**
 * Created by Leonid on 10/12/16.
 */

const possibleState = {
    'IDLE': 'IDLE',
    'ACTIVE': 'ACTIVE',
    'MATCHES': 'MATCHES',
    'CIPHER': 'CIPHER'
};

export default class CipherNumber{
    constructor(value, cords) {
        this._value = value;
        this._cords = cords;
        this._siblings = {
            top: null,
            left: null,
            right: null,
            bottom: null
        };
        this._currenState = possibleState.IDLE;

        this.onidle = (state) => {};
        this.onactive = (cords) => {};
        this.oncipher = (cords) => {};
    }

    updateSiblings(obj) {
        this._siblings = Object.assign(this._siblings, obj);
    }

    setActive() {
        if (this._currenState != possibleState.CIPHER) {
            this._currenState = possibleState.ACTIVE;
            this.onactive(this._cords);
        }
    }

    setIdle() {
        if (this._currenState != possibleState.CIPHER) {
            this._currenState = possibleState.IDLE;
            this.onidle();
        }
        this._siblings = {
            top: null,
            left: null,
            right: null,
            bottom: null
        };
    }

    setCipher() {
        this._currenState = possibleState.CIPHER;
        this.oncipher(this._cords);
    }

    setMatches() {
        this._currenState = possibleState.MATCHES;
    }

    get isPlaying() {
        return this._currenState != possibleState.CIPHER;
    }

    get isActive() {
        return this._currenState == possibleState.ACTIVE;
    }

    get isMatches() {
        return this._currenState == possibleState.MATCHES;
    }

    get value() {
        return this._value;
    }

    get cords() {
        return this._cords;
    }

    get state() {
        return this._currenState;
    }
}

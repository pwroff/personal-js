/**
 * Created by Leonid on 10/12/16.
 */

import Column from './Column';
import Row from './Row';
import CipherNumber from './CipherNumber';

export default class GameBoard {
    constructor() {
        this._rowsC = 3;
        this._columnsC = 9;
        this._cells = {};
        this._numbers = [];
        this._cipherNumbers = [];
        this._possibleVals = [];
        this._selctedNumber = null;
        this._lastI = 1;
        this._lastY = 1;
        this._lastX = 1;
        this._hiddenRows = {};
        this.onchange = ()=>{};
        this.onrowdone = (c)=>{};

        this._spreadCells();
    }

    _spreadCells(){
        let aR = this._lastX,
            aC = this._lastY;

        let aT = 1,
            aN = 1;

        for (let i = this._lastI; i <= this._rowsC*this._columnsC; i++) {

            this._cells[aC] = this._cells[aC] || {};

            if (!this._cells[aC][aR]) {

                let val = aT;

                if (i < 10) {
                    val = i;
                } else if ((i+1)%2 == 0){
                    val = aN;
                    aN += 1;
                }


                this._cells[aC][aR] = this._getNewNumber(val, {x: aR, y: aC});
                this._lastX = aR;
                this._lastY = aC;
            }

            if (i%this._columnsC == 0) {
                aR = 1;
                aC += 1;
            } else {
                aR += 1;
            }

            this._lastI = i;
        }
    }

    addNumbers() {
        let aR = this._lastX,
            aC = this._lastY;

        this._numbers.map((n,i)=>{
            if (n) {
                aR = aR == 9? 1: aR +1;
                aC = aR == 1? aC + 1: aC;
                this._cells[aC] = this._cells[aC] || {};
                let val = n.value;

                this._cells[aC][aR] = this._getNewNumber(val, {x: aR, y: aC});
                this._lastX = aR;
                this._lastY = aC;
            }
        });
        this.onchange();
    }

    getCondition(p, n) {
        return  p.value == n.value || p.value + n.value == 10;
    }

    _getNewNumber(val, cords) {
        const n = new CipherNumber(val, cords);
        n.onactive = (cords)=>{

            if (!this._selctedNumber || this._selctedNumber == n) {
                this._selctedNumber = n;
            } else {
                let a = this._possibleVals.indexOf(n) != -1;
                let b = this.getCondition(this._selctedNumber, n);
                if (a && b) {
                    this._cipherNumber(n);
                } else {
                    this._selctedNumber.setIdle();
                    n.setIdle();
                }
                this._selctedNumber = null;
            }

            this.onchange();
        };

        n.onidle = ()=>{
            if (this._selctedNumber == n) {
                this._selctedNumber = null;
                this._possibleVals.map((p)=>{
                    p.setIdle();
                });
            }
            this.onchange();
        };

        n.oncipher = (cords)=>{
            this._checkColumns(cords.y);
        };

        this._numbers.push(n);
        return n;
    }

    selectNumber(n) {
        if (!n.isPlaying) {
            this.onchange();
            return;
        }
        if (!this._selctedNumber) {
            const end = ()=>{
                n.setActive();
                this.onchange();
            };

            this._findPossibleNumbers(n, end)

        } else if (this._selctedNumber != n && n.isMatches){
            n.setActive();
            this.onchange();
        } else if (this._selctedNumber == n){
            n.setIdle();
            this.onchange();
        } else {
            n.setIdle();
            this._selctedNumber.setIdle();
            this.onchange();
        }

    }

    _findPossibleNumbers(n, end) {
        const {x, y} = n.cords;
        const siblings = {};
        this._possibleVals.map((p)=>{
            p.setIdle();
        });
        this._possibleVals = [];
        this._findTop(x, y).then((top)=>{
            this._possibleVals.push(top);
            siblings.top = top;
            this._findBottom(x, y).then((b)=>{
                this._possibleVals.push(b);
                siblings.bottom = b;
                this._findLeft(x, y).then((l)=>{
                    this._possibleVals.push(l);
                    siblings.left = l;
                    this._findRight(x, y).then((r)=>{
                        siblings.right = r;
                        this._possibleVals.push(r);
                        let ar = [];
                        this._possibleVals.map((p)=>{
                            if (p) {
                                if (this.getCondition(p, n)) {
                                    p.setMatches();
                                }
                                ar.push(p);
                            }
                        });
                        this._possibleVals = ar;
                        end();
                    });
                });
            });
        });
    }

    _findTop(x, y) {
        return new Promise((resolve)=>{
            const exec = (x, y) =>{
                if (y == 1) {
                    resolve(null);
                } else {
                    y-=1;
                    let pre = this._cells[y][x];
                    if (pre.isPlaying) {
                        resolve(pre);
                    } else {
                        exec(x, y);
                    }
                }
            };
            exec(x, y);
        });

    }

    _findBottom(x, y) {

        return new Promise((resolve)=>{
            const exec = (x, y) =>{
                if (y == this._lastY) {
                    resolve(null);
                } else {
                    y = y+1;
                    let pre = this._cells[y][x];
                    if (pre && pre.isPlaying) {
                        resolve(pre);
                    } else {
                        exec(x, y);
                    }
                }
            };

            exec(x, y);
        });
    }

    _findRight(x, y) {
        return new Promise((resolve)=>{
            const exec = (x, y) =>{
                if (y == this._lastY && x == this._lastX) {
                    resolve(null);
                } else {
                    x = x == 9? 1 : x+1;
                    y = x == 1? y+1 : y;
                    let pre = this._cells[y][x];
                    if (pre.isPlaying) {
                        resolve(pre);
                    } else {
                        exec(x, y);
                    }
                }
            };

            exec(x, y);
        });

    }

    _findLeft(x, y){
        return new Promise((resolve)=>{
            const exec = (x, y) =>{
                if (y == 1 && x == 1) {
                    resolve(null);
                } else {
                    x = x==1? 9: x - 1;
                    y = x == 9 ? y-1 : y;
                    let pre = this._cells[y][x];
                    if (pre.isPlaying) {
                        resolve(pre);
                    } else {
                        exec(x, y);
                    }
                }
            };
            exec(x, y);
        });
    }

    _cipherNumber(n) {
        this._selctedNumber.setCipher();
        n.setCipher();
        this._numbers.splice(this._numbers.indexOf(n), 1);
        this._numbers.splice(this._numbers.indexOf(this._selctedNumber), 1);
        this._cipherNumbers.push(this._selctedNumber);
        this._cipherNumbers.push(n);
        this._possibleVals.map((p)=>{
            p.setIdle();
        });
    }

    _checkColumns(y) {
        let all = 0;
        Object.keys(this._cells[y]).map((r, i)=>{
            let curr = this._cells[y][r];

            if (curr && !curr.isPlaying) {
                all += 1;
            }
        });
        if (all == this._columnsC) {
            this._hiddenRows[y] = true;
            this.onrowdone(this._hiddenRows);
        }
    }

    get cells() {
        return this._cells;
    }
}

/**
 * Created by Leonid on 10/12/16.
 */
import GameBoard from './GameBoard';


const possibleState = {
    'IDLE': 'IDLE',
    'BUSY': 'BUSY'
};

export default class Game{
    constructor() {
        this.board = new GameBoard();

        this.state = possibleState.IDLE;

        this.onupdate = ()=>{};
        this.onrow = (r) => {};

        this.board.onchange = ()=>{
            this.state = possibleState.IDLE;
            this.onupdate();
        };

        this.board.onrowdone = (r) => {
            this.onrow(r);
        };
    }

    selectNumber(n) {
        if (this.isReady) {
            this.state = possibleState.BUSY;
            this.board.selectNumber(n);
        }
    }

    addNumbers() {
        if (this.isReady) {
            this.state = possibleState.BUSY;
            this.board.addNumbers();
        }
    }

    get isReady() {
        return this.state == possibleState.IDLE;
    }
}


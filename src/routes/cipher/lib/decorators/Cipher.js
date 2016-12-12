/**
 * Created by Leonid on 10/12/16.
 */

import React, {Component} from 'react';
import Game from '../game/Game';

export default class Cipher extends Component {

    constructor(props) {
        super(props);

        const g = new Game();

        this.state = {
            game: g,
            log: false,
            hiddenRows: {},
            gameRuns: false
        };

        g.onupdate = ()=>{
            this.forceUpdate();
        };

        g.onrow = (hiddenRows) => {
            this.setState({hiddenRows});
        };

    }



    render() {

        const g = this.state.game;


        const inner = this._renderInner();

        return (
            <section className='page'>

                <h3>Cipher Game Page</h3>
                <hr />

                {inner}
                <pre style={{display: this.state.log ? 'block': 'none'}}>
                    <code>
                        {JSON.stringify(g.board.cells, null, 2)}
                    </code>
                </pre>
            </section>
        )
    }

    _renderInner() {

        if (!this.state.gameRuns){
            return (
                <div>
                    <input type="button" value="START THE GAME" onClick={()=>{
                        this.setState({gameRuns:true})
                    }}/>
                </div>
            )
        }

        const grid = this._getGrid();
        return(
            <div className='game-overlay'>

                <div className='game-panel'>
                    <input type="button" value="RESTART" onClick={()=>{
                        const g = new Game();

                        g.onupdate = ()=>{
                            this.forceUpdate();
                        };
                        g.onrow = (hiddenRows) => {
                            this.setState({hiddenRows});
                        };

                        this.setState({game: g, hiddenRows: {}});
                    }}/>
                    <input type="button" value="ADD NUMBERS" onClick={()=>{
                        this.state.game.addNumbers();
                    }}/>
                    <input type="button" value="CLOSE THE GAME" onClick={()=>{
                        this.setState({gameRuns:false})
                    }}/>
                </div>
                <div className='cipher-board'>
                    {grid}
                </div>

            </div>
        )
    }

    _getGrid() {
        let ret = [];
        let cells = this.state.game.board.cells;

        for (let c of Object.keys(cells)) {
            if (!this.state.hiddenRows[c]) {


                const columns = Object.keys(cells[c]).map((r, i)=> {

                    const n = cells[c][r];

                    const sA = ()=> {
                        this.state.game.selectNumber(n);
                    };

                    return <div onClick={sA} className={`${n.state} column`} key={`${r + c}`}>
                        <span>{n.value}</span>
                    </div>
                });

                ret.push(
                    <div className='row' key={c + Date.now()}>{
                        columns
                    }</div>
                )
            }

        }

        return ret;

    }
}

/**
 * Created by Leonid on 05/12/16.
 */
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import SVGCanvas from '../components/SVGCanvas';

export default class Drawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            difs: [],
            shapes: [],
            width: 500,
            height: 700,
            fill: 'rgba(22,122,222,.5)',
            stroke: '#0055bb',
            strokeWidth: '1',
            tool: 'path',
            mode: 'draw',
            selectedShape: null
        };

        this._key = 0;

        this._refs = [];
        this._availableTools = ['path', 'circle', 'ellipse', 'rect'];
    }

    render() {

        return (
            <section className='drawer' ref={(e)=>{
                if (e && !this._sizeSet) {
                    const rect = e.getBoundingClientRect();
                    const width = rect.width,
                        height = rect.height;

                    this._sizeSet = true;

                    this.setState({
                        width,
                        height
                    })
                }
            }}>
                {this.getPannel()}
                <div onMouseDown={this.state.mode == 'draw' ? this._startDrawing.bind(this) : null} className={this.state.mode}>
                    <SVGCanvas width={this.state.width}
                               height={this.state.height}
                               onPositionChange={this._setCords.bind(this)}
                               shapes={this.state.shapes}
                               selectedShape={this.state.selectedShape}
                    />
                </div>
            </section>
        )
    }

    _startDrawing(e) {
        const tar = e.currentTarget;

        this._setRecords = true;

        this._updateRecord(true);

        const {shapes} = this.state;
        shapes.push(
            this._updateActiveShape()
        );
        this.setState({shapes});

        document.body.onmouseup = ()=>{
            this._setRecords = false;
            document.body.onmouseup = null;
            shapes[this._key] = this._updateActiveShape();
            this._key += 1;
            this.setState({shapes}, this._clearVars.bind(this));
        };
    }

    _clearVars() {
        this._sX = null;
        this._sY = null;
        this._dX = null;
        this._dY = null;

    }

    _shapeMouseDown(i, e){
        const {mode, shapes} = this.state;
        this.setState({
            selectedShape: i
        });
        switch (mode) {
            case 'edit':
                return this._handleShapeMove(i, e);
                break;
            default:
                return;
        }
    }

    _handleShapeMove(i, e) {
        const {shapes} = this.state,
            shape = shapes[i],
            {props} = shape,
            moveTarget = e.currentTarget.parentNode;

        let vX = props.x || props.cx || 0;
        let vY = props.y || props.cy|| 0;
        let sX = e.pageX - vX, sY = e.pageY - vY;

        const mousemove = (e)=>{
            let dX = e.pageX - sX, dY = e.pageY - sY;

            if (props.hasOwnProperty('x')) {
                props.x = dX;
                props.y = dY;
            } else if (props.hasOwnProperty('cx')) {
                props.cx = dX;
                props.cy = dY;
            } else {
                props.transform = `translate(${dX}, ${dY})`;
            }

            shapes[i] = Object.assign({}, shape);

            this.setState({shapes});
        };

        document.body.onmouseup = (e) => {
            shapes[i] = Object.assign({}, shape);
            this.setState({shapes});
            moveTarget.removeEventListener('mousemove', mousemove, false);
            document.body.onmouseup = null;
        };

        moveTarget.addEventListener('mousemove', mousemove, false);

    }

    _updateActiveShape(start) {
        const {tool, fill, stroke, strokeWidth} = this.state;

        let props = {};

        const defaults = {
            fill,
            stroke,
            strokeWidth,
            onMouseEnter: (e)=>{
            },
            onMouseLeave: (e)=>{
            },
            onMouseDown: this._shapeMouseDown.bind(this, this._key),
            id: this._key,
            ref: this._addRef.bind(this, this._key)
        };

        switch(tool) {
            case 'path':
                props = {
                    ...defaults,
                    d: this._dX,
                    fill: 'none'
                };

                break;

            case 'circle':
                props = {
                    ...defaults,
                    cx: this._sX,
                    cy: this._sY
                };
                break;
            case 'ellipse':
                props = {
                    ...defaults,
                    cx: this._sX,
                    cy: this._sY,
                    rx: Math.max(this._dX, this._dX*-1) || 0,
                    ry: Math.max(this._dY, this._dY*-1) || 0
                };
                break;
            case 'rect':
                props = {
                    ...defaults,
                    x: this._sX,
                    y: this._sY,
                    width: Math.max(this._dX, 1) || 0,
                    height: Math.max(this._dY, 1) || 0
                };
                break;
            default:

        }

        return {shape: tool, props};
    }

    _updateRecord(start) {
        const {tool, shapes} = this.state;
        let changes = {};
        if (this._setRecords) {

            switch(tool){
                case 'circle':
                    if (start) {
                        this._sX = this._x;
                        this._sY = this._y;
                    } else {
                        this._dX = this._x - this._sX;
                        this._dY = this._y - this._sY;
                        let r = Math.max(this._dX, this._dY);
                        changes.r = Math.max(r, r*-1);
                    }
                    break;
                case 'ellipse':
                    if (start) {
                        this._sX = this._x;
                        this._sY = this._y;
                    } else {
                        this._dX = this._x - this._sX;
                        this._dY = this._y - this._sY;
                        changes.rx = Math.max(this._dX, this._dX*-1);
                        changes.ry = Math.max(this._dY, this._dY*-1);
                    }
                    break;
                case 'rect':
                    if (start) {
                        this._sX = this._x;
                        this._sY = this._y;
                    } else {
                        this._dX = this._x - this._sX;
                        this._dY = this._y - this._sY;
                        changes.width = Math.max(this._dX, 1);
                        changes.height = Math.max(this._dY, 1);
                    }
                    break;
                case 'path':
                default:
                    if (start) {
                        this._dX = `M${this._x},${this._y}`;
                    } else {
                        this._dX += ` L${this._x},${this._y}`;
                        changes.d = this._dX
                    }
                    break;
            }

            if (this._refs[this._key]) {
                for (let attr of Object.keys(changes)){
                    let val = changes[attr];
                    this._refs[this._key].setAttribute(attr, val);
                }

            }

        }
    }

    _setCords(c) {
        this._x = c.x;
        this._y = c.y;
        this._updateRecord();
    }

    _addRef(i ,el) {
        if (el && !this._refs[i]) {
            this._refs[i] = el;
        }
    }

    getPannel() {


        return (
            <div className='control-panel'>
                {this._shapeActions()}
                {this._toolsActions()}
            </div>
        )
    }

    _shapeActions() {

        const change = (e)=>{
            const updated = {
                [e.target.name] : e.target.value
            };

            this.setState(updated);
        };

        let mode = this.state.mode == 'draw' ? 'edit' : 'draw';

        return (
            <div className='panel-row'>
                <input
                    onChange={change}
                    type='text'
                    key='strokeColor'
                    name='stroke'
                    value={this.state.stroke}
                    style={{color:this.state.stroke}}
                    placeholder="Enter Stroke Color"
                />
                <input
                    onChange={change}
                    type='text'
                    key='fillColor'
                    name='fill'
                    value={this.state.fill}
                    style={{color:this.state.fill}}
                    placeholder="Enter Fill Color"
                />
                <input
                    onChange={change}
                    type='text'
                    key='strokeWidth'
                    name='strokeWidth'
                    value={this.state.strokeWidth}
                    placeholder="Enter Stroke Width"
                />
                <input type='button'
                       value={'Clear'}
                       onClick={()=>{
                           this._key = 0;
                           this._refs = [];
                           this.setState({shapes: []})
                       }}
                />
                <span>Change Mode To </span>
                <input type='button'
                       value={mode}
                       onClick={()=>{
                           if (mode != this.state.mode) {
                               this._switchMode(mode);
                           }
                       }}
                />
            </div>
        )
    }

    _toolsActions(){
        const btns = this._availableTools.map((t, i)=>{
            return <input type='button'
                          key={t}
                          className={t == this.state.tool ? 'active toolButton' : 'toolButton default'}
                          value={t}
                          onClick={()=>{
                              this.setState({tool: t})
                          }}
            />
        });
        return (
            <div className='panel-row action-row'>
                {btns}
            </div>
        )
    }

    _switchMode(mode) {
        let selectedShape = null;
        if (mode == 'edit'){
            selectedShape = this.state.shapes.length-1;
        }
        this.setState({mode, selectedShape});
    }
}

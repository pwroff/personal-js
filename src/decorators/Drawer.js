/**
 * Created by Leonid on 05/12/16.
 */
import React,{Component} from 'react';
import SVGCanvas from '../components/SVGCanvas';

export default class Drawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            difs: [],
            shapes: [],
            width: 500,
            height: 500,
            fill: 'transparent',
            stroke: '#000',
            strokeWidth: '1'
        };

        this._key = 0;

        this._refs = [];
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
                <div onMouseDown={this._startDrawing.bind(this)}>
                    <SVGCanvas width={this.state.width} height={this.state.height} onPositionChange={this._setCords.bind(this)}>
                        {this.state.shapes}
                    </SVGCanvas>
                </div>
            </section>
        )
    }

    _startDrawing(e) {
        const tar = e.currentTarget;

        this._d = `M${this._x},${this._y}`;
        this._setRecords = true;
        const {shapes, fill, stroke, strokeWidth} = this.state;
        shapes.push(
            React.createElement('path', {
                d: this._d,
                fill,
                stroke,
                strokeWidth,
                key: this._key,
                ref: this._addRef.bind(this, this._key)
            })
        );

        this.setState({shapes});

        tar.onmouseup = ()=>{
            this._setRecords = false;
            tar.onmouseup = null;
            shapes[this._key] = React.createElement('path', {
                d: this._d,
                fill,
                stroke,
                strokeWidth,
                key: this._key,
                ref: this._addRef.bind(this, this._key)
            });
            this._key += 1;
            this.setState({shapes});
        };
    }

    _setCords(c) {
        this._x = c.x;
        this._y = c.y;

        if (this._setRecords) {
            this._d+=` L${this._x},${this._y}`;

            if (this._refs[this._key]) {
                this._refs[this._key].setAttribute('d', this._d);
            }
        }
    }

    _addRef(i ,el) {
        if (el && !this._refs[i]) {
            this._refs[i] = el;
        }
    }

    getPannel() {
        const change = (e)=>{
            const updated = {
                [e.target.name] : e.target.value
            };

            this.setState(updated);
        };
        return (
            <div className='control-panel'>
                <input
                    onChange={change}
                    type='text'
                    name='stroke'
                    value={this.state.stroke}
                    style={{color:this.state.stroke}}
                    placeholder="Enter Stroke Color"
                />
                <input
                    onChange={change}
                    type='text'
                    name='fill'
                    value={this.state.fill}
                    style={{color:this.state.fill}}
                    placeholder="Enter Fill Color"
                />
                <input
                    onChange={change}
                    type='number'
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
            </div>
        )
    }
}

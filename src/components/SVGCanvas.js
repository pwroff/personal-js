/**
 * Created by Leonid on 05/12/16.
 */
import React,{Component, PropTypes} from 'react';

export default class SVGCanvas extends Component {

    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        onPositionChange: PropTypes.func
    };

    render() {
        const {width, height, selectedShape} = this.props;
        const sh = this.props.shapes.map((el, i)=>{
            let className = el.props.className || '' + ` shape`;
            className += selectedShape == el.props.id ? ' selected' : '';
            return React.createElement(el.shape, {...el.props, key: el.props.id, className});
        });
        return(
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} onMouseMove={this._onMove.bind(this)}>
                {sh}
            </svg>
        )
    }

    _onMove(e) {
        const event = e,
            rect = event.currentTarget.getBoundingClientRect();

        const x = event.pageX - rect.left,
            y = event.pageY - rect.top;

        this.props.onPositionChange({x, y});
    }
}

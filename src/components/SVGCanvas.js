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
        const {width, height} = this.props;
        return(
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} onMouseMove={this._onMove.bind(this)}>
                {this.props.children}
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

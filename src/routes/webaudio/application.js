/**
 * Created by Leonid on 30/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import draw from './src/draw';

class Container extends Component {

    componentDidMount(){
        draw(0, 0, this.refs.container);
    }

    render() {
        return (
            <div ref='container'>
                <audio controls autoPlay="true" id="audioP">
                    <source src="./build/public/Was_It_Me.mp3" type="audio/mpeg"/>
                </audio>
            </div>
        )
    }
}

const container = document.createElement('section');
container.className = "container";
document.body.appendChild(container);

ReactDOM.render(<Container />, container);

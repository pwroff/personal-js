/**
 * Created by Leonid on 30/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import draw from './src/draw';

class Container extends Component {

    componentDidMount(){
        draw();
    }

    render() {
        return <div id="container"></div>
    }
}

const container = document.createElement('section');
container.className = "container";
document.body.appendChild(container);

ReactDOM.render(<Container />, container);

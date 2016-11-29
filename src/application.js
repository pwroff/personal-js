/**
 * Created by Leonid on 29/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const container = document.createElement('section');
container.className = "container";
document.body.appendChild(container);

class HW extends Component {
    render() {
        return (
            <h1>
                Hello from React
            </h1>
        )
    }
}

ReactDOM.render(<HW/>, container);

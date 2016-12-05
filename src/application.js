/**
 * Created by Leonid on 29/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import renderToContainer from './helpers/renderToContainer';

class HW extends Component {
    render() {
        return (
            <h1>
                Hello from React
            </h1>
        )
    }
}

renderToContainer(<HW/>, {class: 'whatever'});

/**
 * Created by Leonid on 30/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import renderToContainer from '../../helpers/renderToContainer';

class Container extends Component {

    render() {
        return <div id="container"></div>
    }
}

renderToContainer(<Container />);

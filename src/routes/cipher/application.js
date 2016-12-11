/**
 * Created by Leonid on 30/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import renderToContainer from '../../helpers/renderToContainer';
import Cipher from './lib/decorators/Cipher';

class Container extends Component {

    render() {
        return <Cipher/>
    }
}


renderToContainer(<Container />);

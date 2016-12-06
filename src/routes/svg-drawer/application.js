/**
 * Created by Leonid on 30/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import renderToContainer from '../../helpers/renderToContainer';
import Drawer from '../../decorators/Drawer';

class Container extends Component {

    render() {
        return <Drawer/>
    }
}


renderToContainer(<Container />);

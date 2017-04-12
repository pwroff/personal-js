/**
 * Created by Leonid on 30/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import renderToContainer from '../../helpers/renderToContainer';
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo';
import Cipher from './lib/decorators/Cipher';

class Container extends Component {

    createClient() {
        return new ApolloClient({
            networkInterface: createNetworkInterface({
                uri: '/graphql',
            }),
        });
    }

    render() {
        return (
            <ApolloProvider client={this.createClient()}>
                <Cipher />
            </ApolloProvider>
        );
    }
}

renderToContainer(<Container />);

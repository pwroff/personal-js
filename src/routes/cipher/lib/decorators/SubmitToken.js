/**
 * Created by Leonid on 10/12/16.
 */

import React, {Component} from 'react';
import { gql, graphql } from 'react-apollo';

class NewEntry extends Component {

    componentDidMount() {
        const st = sessionStorage.getItem('cipher-question-session');

        if (st) {
            this._sendToken(st);
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const token = this.refs.token.value;
        this._sendToken(token);
    }

    render() {
        return (
            <div className='cipher-form'>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className='input-line'>
                        <input type='text' placeholder='Access token' ref='token'/>
                    </div>
                    <div className='input-line'>
                        <input type="submit" value="Log in" />
                    </div>
                </form>
            </div>
        );
    }

    _sendToken(token) {
        this.props.mutate({
            variables: { token }
        }).then(({ data }) => {
                sessionStorage.setItem('cipher-question-session', token);
                this.props.onTokenSended(data.submitToken, token);
            }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    }
}

const SubmitToken = graphql(gql`
    mutation submitToken($token: String!) {
        submitToken(token: $token) {
            isValid
            isAnswered
            message
            showAnswers
        }
    }
`)(NewEntry);

export default SubmitToken;

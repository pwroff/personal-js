/**
 * Created by Leonid on 10/12/16.
 */

import React, {Component} from 'react';
import Answers from './Answers';
import SubmitToken from './SubmitToken';
import QuestionsForm from './QuestionsForm';

export default class QuestionPage extends Component{

    constructor(...args) {
        super(...args);

        const st = {
                isValid: false,
                message: 'Log in'
            };

        this.state = st;
    }


    render() {
        return (
            <section className='cipher-main-layout'>
                <div className='ci-container'>
                    <h3>{this.state.message}</h3>
                    <div>{this.renderInner()}</div>
                </div>
            </section>
        )
    }

    renderInner() {
        if (this.state.isValid) {
            return this.renderForm();
        }

        return this.renderTForm();
    }

    renderForm() {
        if (this.state.showAnswers) {
            return <Answers token={this.state.token}/>
        }
        if (this.state.isAnswered) {
            return null;
        }

        return <QuestionsForm token={this.state.token} onSuccess={(data)=>{
            this.setState(data);
        }}/>
    }

    renderTForm() {
        return (
            <SubmitToken onTokenSended={this._onToken.bind(this)} />
        )
    }

    _onToken(data, token) {
        const received = {
            ...data,
            token
        };
        this.setState(received);
    }
};

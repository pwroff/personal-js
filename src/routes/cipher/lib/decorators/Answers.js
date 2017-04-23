/**
 * Created by Leonid on 19/04/17.
 */
import React, {Component} from 'react';
import { gql, graphql } from 'react-apollo';

class Answers extends Component {

    render() {
        if (this.props.data.loading) {
            return <h2>Answers Loading</h2>
        }

        return this._renderAnswers();
    }

    _renderAnswers() {
        const answers = this.props.data.answers;
        const answ = Object.keys(answers).map((k) => {
            const curr = answers[k];

            return <li key={k} className='answ-line'>
                <div>
                    <strong>Token:</strong>
                    <pre>{k}</pre>
                    <br />
                    <small>{new Date(curr.createdAt).toLocaleString()}</small>
                </div>
                <ul className='answ-detail'>
                    {Object.keys(curr.answer).map((ak)=> {
                        const answer = curr.answer[ak];
                        return (
                            <li key={ak}>
                                <strong>{answer.question}</strong>
                                <br />
                                <stron>{answer.answer}</stron>
                                <br />
                                <strong>{answer.specificAnswer}</strong>
                            </li>
                            )
                        }
                    )}
                </ul>
            </li>
        });

        return <ul className="answers-list">{answ}</ul>;
    }
}

const AnswersQuery = gql`
    query CurrentAnswers($token: String!) {
        answers(token: $token)
    }
`;

export default graphql(AnswersQuery, {
    options: ({token}) => ({ variables: {token} }),
})(Answers);

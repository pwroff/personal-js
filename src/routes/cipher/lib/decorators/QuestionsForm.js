/**
 * Created by Leonid on 18/04/17.
 */

import React, {Component} from 'react';
import { gql, graphql } from 'react-apollo';

const QInput = (props) => {

    return (
        <div className='input-line'>
            <div className='input-label'>
                <span>{props.label}</span>
            </div>
            {
                props.ranged &&
                <div className='input-inner'>
                    <select
                        name={props.name}
                        onChange={props.onRangedChange}
                        value={props.ranswer}
                    >
                        {
                            props.roptions.map(
                                o => <option key={o} value={o}>{o}</option>
                            )
                        }
                    </select>
                </div>
            }
            {
                props.specify &&
                <div className='input-inner'>
                    <input
                        type='text'
                        name={props.name}
                        onChange={props.onChange}
                        value={props.answer}
                        placeholder={props.placeholder}
                    />
                </div>
            }
        </div>
    )
};

class QuestionsForm extends Component {

    constructor(...args) {
        super(...args);

        this.state = {
            questions: {
                rulesDifficulty: {
                    ranswer: 'Very hard',
                    answer: '',
                    label: 'How hard was it to understand the rules?',
                    specify: false,
                    ranged: true,
                    roptions: [
                        'Very hard', 'Hard', 'Ok', 'Easy', 'Very easy'
                    ]
                },
                overallDifficulty: {
                    ranswer: 'Very hard',
                    answer: '',
                    label: 'How hard was the overall gaming experience?',
                    specify: false,
                    ranged: true,
                    roptions: [
                        'Very hard', 'Hard', 'Ok', 'Easy', 'Very easy'
                    ]
                },
                undoMove: {
                    ranswer: 'Yes',
                    answer: '',
                    label: 'During the game did you feel like you wanted to undo your last move?',
                    specify: false,
                    ranged: true,
                    roptions: [
                        'Yes', 'Don\'t know' , 'No'
                    ]
                },
                roundsPlayed: {
                    ranswer: '0',
                    answer: '',
                    label: 'How many rounds did you play?',
                    placeholder: 'Please specify',
                    specify: false,
                    ranged: true,
                    roptions: [
                        0,1,2,3,'Other'
                    ]
                },
                similarity: {
                    ranswer: 'No',
                    answer: '',
                    label: 'Did the game remind you of any other game?',
                    placeholder: 'Please specify',
                    specify: false,
                    ranged: true,
                    roptions: [
                        'No', 'Don\'t know' , 'Yes'
                    ]
                },
                interest: {
                    ranswer: 'Indifferent',
                    answer: '',
                    label: 'How interested were you in the game?',
                    specify: false,
                    ranged: true,
                    roptions: [
                        'Uninterested', 'Not very interested', 'Indifferent', 'Somehow interested', 'Interested'
                    ]
                }
            }
        };
    }

    render() {
        return (
            <div className="cipher-form">
                <form onSubmit={this._onSubmit.bind(this)}>
                    {this._renderQuestions()}
                    <div className='input-inner'>
                        <input type='submit' value='Send' />
                    </div>
                </form>
            </div>
        )
    }

    _onSubmit(e) {
        e.preventDefault();

        const answerJSON = {};
        const {questions} = this.state;
        const {token} = this.props;

        Object.keys(questions).forEach((question) => {
            const curr = questions[question];

            answerJSON[question] = {};
            answerJSON[question].answer = curr.ranswer || '';
            answerJSON[question].specificAnswer = curr.answer;
            answerJSON[question].question = curr.label;
        });

        this.props.mutate({
            variables: {
                token,
                answer: JSON.stringify(answerJSON)
            }
        }).then(({data}) => {
            this.props.onSuccess(data.submitAnswers.state);

        }).catch((e) => {
            console.error('Unsuccessful sending a form', e);
        })
    }

    _renderQuestions() {
        return Object.keys(this.state.questions).map((q, i) => {
            const c = this.state.questions[q];

            return <QInput
                {...c}
                key={q}
                onChange={this._changed.bind(this)}
                onRangedChange={this._rangedChanged.bind(this)}
                name={q}
            />
        });
    }

    _rangedChanged(e) {
        const {name, value} = e.target;
        const {questions} = Object.assign({}, this.state);

        questions[name].ranswer = value;

        switch (name) {
            case 'roundsPlayed':
                questions[name].specify = value === 'Other';
                break;
            case 'similarity':
                questions[name].specify = value === 'Yes';
                break;
            default:
        }
        this.setState({questions});
    }

    _changed(e) {
        const {questions} = Object.assign({}, this.state);

        questions[e.target.name].answer = e.target.value;
        this.setState({questions});
    }
}

const QuestionFormWithMutation = graphql(gql`
    mutation submitAnswers($token: String!, $answer: String!) {
        submitAnswers(token: $token, answer: $answer) {
            answer
            token
            state {
                isAnswered
                message
                isValid
            }
        }
    }
`)(QuestionsForm);

export default QuestionFormWithMutation;

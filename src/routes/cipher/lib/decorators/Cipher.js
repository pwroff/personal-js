/**
 * Created by Leonid on 10/12/16.
 */

import React, {Component} from 'react';
import { gql, graphql } from 'react-apollo';

class Cipher extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return <h4>Loading...</h4>
        }
        console.log(this.props.data);
        return (
            <div className='cipher-form'>
                <form>
                    <div className='input-line'>
                        <input type='text' placeholder='something'/>
                    </div>
                </form>
            </div>
        )
    }
}

const CipherWithData = graphql(gql`
    query Answers {
        answers {
            answer
            createdAt
            token
        }
    }
`)(Cipher);
export default CipherWithData;

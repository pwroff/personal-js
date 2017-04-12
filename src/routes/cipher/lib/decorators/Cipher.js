/**
 * Created by Leonid on 10/12/16.
 */

import React, {Component} from 'react';

export default class Cipher extends Component {

    constructor(props) {
        super(props);
    }

    render() {
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

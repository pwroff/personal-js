/**
 * Created by Leonid on 29/11/16.
 */
import 'babel-polyfill';
import React, {Component} from 'react';
import renderToContainer from './helpers/renderToContainer';

class HW extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showLicense: false
        }
    }

    render() {
        return (
            <div>
                <h1>Hello and welcome to Leonid's playground</h1>
                <h3>This is the place of all unfinished, unrealised projects and/or educational materials</h3>
                <p>All source code you can find in <a href="https://github.com/pwroff/personal-js.git" target="_blank">this Github project</a></p>
                <div>
                    {this._getLicense()}
                </div>
            </div>
        )
    }

    _getLicense() {
        if (!this.state.showLicense) {
            return <a href="#" onClick={() => this.setState({showLicense: true})}>Click here to Read a License</a>
        }

        return <p>
            The MIT License (MIT)
            <br/>
            Copyright (c) 2016 Leonid Lazaryev [leonidlazaryev@gmail.com]
            <br/>
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
            <br/>
            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
            <br/>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
    }
}

renderToContainer(<HW/>);

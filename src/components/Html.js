/**
 * Created by Leonid on 30/11/16.
 */
const React =  require('react');
const {createElement, Component} = React;

module.exports = class Html extends Component {
    render() {

        const bundle = this.props.bundle ? createElement('script', {
            src: this.props.bundle,
            type: 'application/javascript',
            key: 'bundle'
        }) : null;

        const head = this.props.data.head? this.props.data.head.map((e,i)=>{
            return createElement(e.element, Object.assign({}, {key: i},e.attributes));
        }) : [];

        const body = this.props.data.body? this.props.data.body.map((e, i) => {
            return createElement(e.element, Object.assign({}, {key: i},e.attributes));
        }):[];

        return createElement('html', null,
            [
                createElement('head', {key: 'head'},
                    [
                        createElement('title', {key: 'title'},
                            this.props.data.title || 'Leonid Lazaryevs projects'
                        ),
                        ...head
                    ]
                ),
                createElement('body', {key: 'body'}, [
                    ...body,
                    bundle
                    ]
                )
            ]
        );
    }
};

/**
 * Created by Leonid on 05/12/16.
 */
const ReactDOM = require('react-dom');

const renderToContainer = (component, ...rest) => {

    let callback = ()=>{},
        attributes = {
            class: 'container'
        };

    rest.find((e)=>{
        if (typeof e == 'function') {
            callback = e;
        } else if (typeof e == 'object') {
            attributes = Object.assign({}, attributes, e);
        }
    });

    const container = document.createElement('section');

    for (let key of Object.keys(attributes)) {
        container.setAttribute(key, attributes[key]);
    }

    document.body.insertBefore(container,document.body.firstElementChild);
    ReactDOM.render(component, container, callback);
};

module.exports = renderToContainer;

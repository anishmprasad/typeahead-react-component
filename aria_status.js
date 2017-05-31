'use strict';

var React = require('react'),
 ReactDOM = require('react-dom');
 import PropTypes from 'prop-types';

export default class AriaStatus extends React.Component{
    static displayName: 'Aria Status'

    constructor(props) {
        super(props);
        this.setTextContent = this.setTextContent.bind(this);
    }

    componentDidMount() {
        var _this = this;
        // This is needed as `componentDidUpdate`
        // does not fire on the initial render.
        _this.setTextContent(_this.props.message);
    }

    componentDidUpdate() {
        var _this = this;
        _this.setTextContent(_this.props.message);
    }

    render() {
        return (
            React.createElement("span", {
                role: "status", 
                "aria-live": "polite", 
                style: {
                    left: '-9999px',
                    position: 'absolute'
                }}
            )
        );
    }

    // We cannot set `textContent` directly in `render`,
    // because React adds/deletes text nodes when rendering,
    // which confuses screen readers and doesn't cause them to read changes.
    setTextContent(textContent) {
        // We could set `innerHTML`, but it's better to avoid it.
        ReactDOM.findDOMNode(this).textContent = textContent || '';
    }
}

AriaStatus.propTypes ={
        message: PropTypes.string
    }

'use strict';

// var React = require('react'),
// ReactDOM = require('react-dom');
import React from 'react';
import ReactDom from 'react-dom'; 
import PropTypes from 'prop-types';

export default class  Input extends React.Component{
    static displayName: 'Input'
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            onChange: function() {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.blur = this.blur.bind(this);
        this.isCursorAtEnd = this.isCursorAtEnd.bind(this);
    }
    

    // static defaultProps() {
    //     return {
    //         value: '',
    //         onChange: function() {}
    //     };
    // }

    componentDidUpdate() {
        var _this = this,
            dir = _this.props.dir;

        if (dir === null || dir === undefined) {
            // When setting an attribute to null/undefined,
            // React instead sets the attribute to an empty string.

            // This is not desired because of a possible bug in Chrome.
            // If the page is RTL, and the input's `dir` attribute is set
            // to an empty string, Chrome assumes LTR, which isn't what we want.
            ReactDOM.findDOMNode(_this).removeAttribute('dir');
        }
    }

    render() {
        var _this = this;
//        console.log(React.__spread({},_this.props,{onChange: _this.handleChange}))

        return (
            React.createElement("input", Object.assign({}, 
                _this.props, 
                {
                onChange: _this.handleChange,
                type: "text",
                value: ""
                })
            )
//            <Input
//                {..._this.props}
//                onChange={_this.handleChange}
//            />
        );
    }

    handleChange(event) {
        var props = this.props;

        // There are several React bugs in IE,
        // where the `input`'s `onChange` event is
        // fired even when the value didn't change.
        // https://github.com/facebook/react/issues/2185
        // https://github.com/facebook/react/issues/3377
        if (event.target.value !== props.value) {
            props.onChange(event);
        }
    }

    blur() {
        ReactDOM.findDOMNode(this).blur();
    }

    isCursorAtEnd() {
        var _this = this,
            inputDOMNode = ReactDOM.findDOMNode(_this),
            valueLength = _this.props.value.length;

        return inputDOMNode.selectionStart === valueLength &&
               inputDOMNode.selectionEnd === valueLength;
    }
}

Input.propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func
    }

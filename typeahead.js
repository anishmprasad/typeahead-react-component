'use strict';
    
    import React from 'react';
    import Input from './input';
    import ReactDOM from 'react-dom';
    import AriaStatus from './aria_status';
    import getTextDirection from './utils/get_text_direction';
    import PropTypes from 'prop-types';

let noop = function() {};
let count = 0;
export default class  Typeahead extends React.Component{
    static displayName: 'Typeahead'

    static getInstanceCount() {
        return ++count;
    }


    // static getInstanceCount: (function() {
    //         var count = 0;

    //         return function() {
    //             return ++count;
    //         };
    //     }())

    constructor(props) {
//        debugger;
        super(props);
        console.log(this.props)
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.renderAriaMessageForOptions = this.renderAriaMessageForOptions.bind(this);
        this.renderAriaMessageForIncomingOptions = this.renderAriaMessageForIncomingOptions.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.renderDropdown = this.renderDropdown.bind(this);
        this.showDropdown = this.showDropdown.bind(this);
        this.hideDropdown = this.hideDropdown.bind(this);
        this.showHint = this.showHint.bind(this);
        this.hideHint = this.hideHint.bind(this);
        this.setSelectedIndex = this.setSelectedIndex.bind(this);
        this.focus = this.focus.bind(this);
        this.navigate = this.navigate.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOptionMouseOver = this.handleOptionMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleWindowClose = this.handleWindowClose.bind(this);

        this.state = {
                selectedIndex: -1,
                isHintVisible: false,
                isDropdownVisible: false
        }

       
    }
   

    // static defaultProps() {
    //     return {
    //         className: '',
    //         inputValue: '',
    //         options: [],
    //         hoverSelect: true,
    //         onFocus: noop,
    //         onKeyDown: noop,
    //         onChange: noop,
    //         onInputClick: noop,
    //         handleHint() {
    //             return '';
    //         },
    //         onOptionClick: noop,
    //         onOptionChange: noop,
    //         onComplete:  noop,
    //         onDropdownOpen: noop,
    //         onDropdownClose: noop,
            
            
    //     };
    //  }

    getMessageForOption() {
                return '';
            }
    getMessageForIncomingOptions(number) {
                return (
                    number + ' suggestions are available. Use up and down arrows to select.'
                );
            }

    componentWillMount() {
        let _this = this,
            uniqueId = this.constructor.getInstanceCount();

        _this.userInputValue = null;
        _this.previousInputValue = null;
        _this.activeDescendantId = 'react-typeahead-activedescendant-' + uniqueId;
        _this.optionsId = 'react-typeahead-options-' + uniqueId;
    }

    componentDidMount() {
        let addEvent = window.addEventListener,
            handleWindowClose = this.handleWindowClose;

        // The `focus` event does not bubble, so we must capture it instead.
        // This closes Typeahead's dropdown whenever something else gains focus.
        addEvent('focus', handleWindowClose, true);

        // If we click anywhere outside of Typeahead, close the dropdown.
        addEvent('click', handleWindowClose, false);
    }

    componentWillUnmount() {
        let removeEvent = window.removeEventListener,
            handleWindowClose = this.handleWindowClose;

        removeEvent('focus', handleWindowClose, true);
        removeEvent('click', handleWindowClose, false);
    }

    componentWillReceiveProps(nextProps) {
        let nextValue = nextProps.inputValue,
            nextOptions = nextProps.options,
            valueLength = nextValue.length,
            isHintVisible = valueLength > 0 &&
                // A visible part of the hint must be
                // available for us to complete it.
                nextProps.handleHint(nextValue, nextOptions).slice(valueLength).length > 0;

        this.setState({
            isHintVisible: isHintVisible
        });
    }

    render() {
        let _this = this;

        return (
            React.createElement("div", {
                style: {
                    position: 'relative'
                },
                className: 'react-typeahead-container ' + _this.props.className},
                _this.renderInput(),
                _this.renderDropdown(),
                _this.renderAriaMessageForOptions(),
                _this.renderAriaMessageForIncomingOptions()
            )
        );
    }

    renderInput() {
        let _this = this,
            state = _this.state,
            props = _this.props,
            inputValue = props.inputValue,
            className = 'react-typeahead-input',
            inputDirection = getTextDirection(inputValue);
//        debugger;
        
        return (
            <div className="react-typeahead-input-container" style={{position:'relative'}} >
               <Input style = {{ color: 'silver', WebkitTextFillColor: 'silver', position: 'absolute' }}
                   type="text"
                   disabled= "true"
                    role= "presentation"
                    aria-hidden= "true"
                    dir= {inputDirection}
                    className= {className + ' react-typeahead-hint'}
                    
                    value={ state.isHintVisible ? props.handleHint(inputValue, props.options) : ''}
                   />
                 <Input className= {className + ' react-typeahead-usertext'} style= {{ position: 'relative', background: 'transparent'}}
                    ref = "input"
                    role = "combobox"
                    aria-owns = {_this.optionsId}
                    aria-expanded = {state.isDropdownVisible}
                    aria-autocomplete = "both"
                    aria-activedescendant = {_this.activeDescendantId}
                    value= {_this.props.inputValue || ''}
                    spellCheck= {false}
                    autoComplete= {false}
                    autoCorrect= {false}
                    dir= {inputDirection}
                    onClick= {_this.handleClick}
                    onFocus= {_this.handleFocus}
                    onBlur= {props.onBlur}
                    onChange= {_this.handleChange}
                    onKeyDown= {_this.handleKeyDown}
                    id= {props.inputId}
                    name= {props.inputName}
                    autoFocus= {props.autoFocus}
                    placeholder= {props.placeholder}
                    onSelect= {props.onSelect}
                    onKeyUp= {props.onKeyUp}
                    onKeyPress= {props.onKeyPress}
                    
                    
                   />
            </div>
        )

//        return (
//            React.createElement("div", {
//                style: {
//                    position: 'relative'
//                },
//                className: "react-typeahead-input-container"},
//                React.createElement(Input, {
//                    disabled: true,
//                    role: "presentation",
//                    "aria-hidden": true,
//                    dir: inputDirection,
//                    className: className + ' react-typeahead-hint',
//                    style: {
//                        color: 'silver',
//                        WebkitTextFillColor: 'silver',
//                        position: 'absolute'
//                    },
//                    value: state.isHintVisible ? props.handleHint(inputValue, props.options) : null}
//                ),
//                React.createElement(Input, {
//                    ref: "input",
//                    role: "combobox",
//                    "aria-owns": _this.optionsId,
//                    "aria-expanded": state.isDropdownVisible,
//                    "aria-autocomplete": "both",
//                    "aria-activedescendant": _this.activeDescendantId,
//                    value: _this.props.inputValue,
//                    spellCheck: false,
//                    autoComplete: false,
//                    autoCorrect: false,
//                    dir: inputDirection,
//                    onClick: _this.handleClick,
//                    onFocus: _this.handleFocus,
//                    onBlur: props.onBlur,
//                    onChange: _this.handleChange,
//                    onKeyDown: _this.handleKeyDown,
//                    id: props.inputId,
//                    name: props.inputName,
//                    autoFocus: props.autoFocus,
//                    placeholder: props.placeholder,
//                    onSelect: props.onSelect,
//                    onKeyUp: props.onKeyUp,
//                    onKeyPress: props.onKeyPress,
//                    className: className + ' react-typeahead-usertext',
//                    style: {
//                        position: 'relative',
//                        background: 'transparent'
//                    }}
//                )
//            )
//        );
    }

    renderDropdown() {
        let _this = this,
            state = _this.state,
            props = _this.props,
            OptionTemplate = props.optionTemplate,
            selectedIndex = state.selectedIndex,
            isDropdownVisible = state.isDropdownVisible,
            activeDescendantId = _this.activeDescendantId;

        if (this.props.options.length < 1) {
            return null;
        }

        return (
            React.createElement("ul", {id: _this.optionsId,
                ref: "dropdown",
                role: "listbox",
                "aria-hidden": !isDropdownVisible,
                style: {
                    width: '100%',
                    background: '#fff',
                    position: 'absolute',
                    boxSizing: 'border-box',
                    display: isDropdownVisible ? 'block' : 'none'
                },
                className: "react-typeahead-options",
                onMouseOut: this.handleMouseOut},

                    props.options.map(function(data, index) {
                        let isSelected = selectedIndex === index;

                        return (
                            React.createElement("li", {id: isSelected ? activeDescendantId : null,
                                "aria-selected": isSelected,
                                role: "option",
                                key: index,
                                onClick: _this.handleOptionClick.bind(_this, index),
                                onMouseOver: _this.handleOptionMouseOver.bind(_this, index)},

                                React.createElement(OptionTemplate, {
                                    data: data,
                                    index: index,
                                    userInputValue: _this.userInputValue,
                                    inputValue: props.inputValue,
                                    isSelected: isSelected}
                                )
                            )
                        );
                    })

            )
        );
    }

    renderAriaMessageForOptions() {
        let _this = this,
            props = _this.props,
            inputValue = props.inputValue,
            option = props.options[_this.state.selectedIndex] || inputValue;

        return (
            React.createElement(AriaStatus, {
                message: _this.getMessageForOption(option) || inputValue}
            )
        );
    }

    renderAriaMessageForIncomingOptions() {
        let props = this.props;

        return (
            React.createElement(AriaStatus, {
                message: this.getMessageForIncomingOptions(props.options.length)}
            )
        );
    }

    showDropdown() {
        let _this = this;

        if (!_this.state.isDropdownVisible) {
            _this.setState({
                isDropdownVisible: true
            }, function() {
                _this.props.onDropdownOpen();
            });
        }
    }

    hideDropdown() {
        let _this = this;

        if (_this.state.isDropdownVisible) {
            _this.setState({
                isDropdownVisible: false
            }, function() {
                _this.props.onDropdownClose();
            });
        }
    }

    showHint() {
        let _this = this,
            props = _this.props,
            inputValue = props.inputValue,
            inputValueLength = inputValue.length,
            isHintVisible = inputValueLength > 0 &&
                // A visible part of the hint must be
                // available for us to complete it.
                props.handleHint(inputValue, props.options).slice(inputValueLength).length > 0;

        _this.setState({
            isHintVisible: isHintVisible
        });
    }

    hideHint() {
        this.setState({
            isHintVisible: false
        });
    }

    setSelectedIndex(index, callback) {
        this.setState({
            selectedIndex: index
        }, callback);
    }

    handleChange(event) {
//        this.setState({
//                inputValue : event.target.value
//        });
        let _this = this;
//        debugger;
        _this.showHint();
        _this.showDropdown();
        _this.setSelectedIndex(-1);
        _this.props.onChange(event);
        _this.userInputValue = event.target.value;
    }

    focus() {
//        debugger;
//        console.log(ReactDOM.findDOMNode(this.refs.input));
//        this.refs.input.ReactDOM.findDOMNode().focus();
//        ReactDOM.findDOMNode(this)
//        this.refs.input.getDOMNode().focus(); // depreciated
        ReactDOM.findDOMNode(this.refs.input).focus();
//        ReactDOM.findDOMNode(this).refs.input.getDOMNode().focus();
    }

    handleFocus(event) {
        let _this = this;

        _this.showDropdown();
//         debugger
//        _this.refs.input.props.onFocus(event);
        _this.props.onFocus(event);
    }

    handleClick(event) {
        let _this = this;

        _this.showHint();
        _this.props.onInputClick(event);
    }

    navigate(direction, callback) {
        let _this = this,
            minIndex = -1,
            maxIndex = _this.props.options.length - 1,
            index = _this.state.selectedIndex + direction;

        if (index > maxIndex) {
            index = minIndex;
        } else if (index < minIndex) {
            index = maxIndex;
        }

        _this.setSelectedIndex(index, callback);
    }

    handleKeyDown(event) {
        let _this = this,
            key = event.key,
            props = _this.props,
            input = _this.refs.input,
            isDropdownVisible = _this.state.isDropdownVisible,
            isHintVisible = _this.state.isHintVisible,
            hasHandledKeyDown = false,
            index,
            optionData,
            dir;

        switch (key) {
        case 'End':
        case 'Tab':
            if (isHintVisible && !event.shiftKey) {
                event.preventDefault();
                props.onComplete(event, props.handleHint(props.inputValue, props.options));
            }
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            if (isHintVisible && !event.shiftKey && input.isCursorAtEnd()) {
                dir = getTextDirection(props.inputValue);

                if ((dir === 'ltr' && key === 'ArrowRight') || (dir === 'rtl' && key === 'ArrowLeft')) {
                    props.onComplete(event, props.handleHint(props.inputValue, props.options));
                }
            }
            break;
        case 'Enter':
            _this.focus();
            _this.hideHint();
            _this.hideDropdown();
            break;
        case 'Escape':
            _this.hideHint();
            _this.hideDropdown();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            if (props.options.length > 0) {
                event.preventDefault();

                _this.showHint();
                _this.showDropdown();

                if (isDropdownVisible) {
                    dir = key === 'ArrowUp' ? -1: 1;
                    hasHandledKeyDown = true;

                    _this.navigate(dir, function() {
                        let selectedIndex = _this.state.selectedIndex,
                            previousInputValue = _this.previousInputValue,
                            optionData = previousInputValue,
                            optionOffsetTop = 0,
                            selectedOption,
                            dropdown;

                        // We're currently on an option.
                        if (selectedIndex >= 0) {
                            // Save the current `input` value,
                            // as we might arrow back to it later.
                            if (previousInputValue === null) {
                                _this.previousInputValue = props.inputValue;
                            }

                            optionData = props.options[selectedIndex];
                            // Make selected option always scroll to visible
                            dropdown = ReactDOM.findDOMNode(_this.refs.dropdown);
                            selectedOption = dropdown.children[selectedIndex];
                            optionOffsetTop = selectedOption.offsetTop;
                            if(optionOffsetTop + selectedOption.clientHeight > dropdown.clientHeight ||
                                optionOffsetTop < dropdown.scrollTop) {
                                dropdown.scrollTop = optionOffsetTop;
                            }
                        }

                        props.onOptionChange(event, optionData, selectedIndex);
                        props.onKeyDown(event, optionData, selectedIndex);
                    });
                }
            }

            break;
        }

        if (!hasHandledKeyDown) {
            index = this.state.selectedIndex;
            optionData = index < 0 ? props.inputValue : props.options[index];
            props.onKeyDown(event, optionData, index);
        }
    }

    handleOptionClick(selectedIndex, event) {
        let _this = this,
            props = _this.props;

        _this.focus();
        _this.hideHint();
        _this.hideDropdown();
        _this.setSelectedIndex(selectedIndex);
        props.onOptionClick(event, props.options[selectedIndex], selectedIndex);
    }

    handleOptionMouseOver(selectedIndex) {
        let _this = this;

        if (_this.props.hoverSelect) {
            _this.setSelectedIndex(selectedIndex);
        }
    }

    handleMouseOut() {
        let _this = this;

        if (_this.props.hoverSelect) {
            _this.setSelectedIndex(-1);
        }
    }

    handleWindowClose(event) {
        let _this = this,
            target = event.target;

        if (target !== window && !ReactDOM.findDOMNode(this).contains(target)) {
            _this.hideHint();
            _this.hideDropdown();
        }
    }
}

Typeahead.propTypes = {
        inputId: PropTypes.string,
        inputName: PropTypes.string,
        className: PropTypes.string,
        autoFocus: PropTypes.bool,
        hoverSelect: PropTypes.bool,
        inputValue: PropTypes.string,
        options: PropTypes.array,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyPress: PropTypes.func,
        onKeyUp: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onSelect: PropTypes.func,
        onInputClick: PropTypes.func,
        handleHint: PropTypes.func,
        onComplete: PropTypes.func,
        onOptionClick: PropTypes.func,
        onOptionChange: PropTypes.func,
        onDropdownOpen: PropTypes.func,
        onDropdownClose: PropTypes.func,
        optionTemplate: PropTypes.func.isRequired,
        getMessageForOption: PropTypes.func,
        getMessageForIncomingOptions: PropTypes.func
    }

    Typeahead.defaultProps = {
        className: '',
        inputValue: '',
        options: [],
        hoverSelect: true,
        onFocus: noop,
        onKeyDown: noop,
        onChange: noop,
        onInputClick: noop,
        handleHint() {
            return '';
        },
        onOptionClick: noop,
        onOptionChange: noop,
        onComplete:  noop,
        onDropdownOpen: noop,
        onDropdownClose: noop,
    }

 module.exports = Typeahead;

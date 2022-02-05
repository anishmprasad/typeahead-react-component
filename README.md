# typeahead-react-component
Typeahead Component for React ES6

Typeahead, written using the React ES6 library.
==============================================


Features
========
* Typeahead with React15 with ES6 Support
* Typeahead with Elasticsearch client Support (using elasticsearch package)



Getting started
---------------

If you're developing using npm and CommonJS modules:
```
npm i typeahead-react-component
```
```jsx
React.render(
    // Pass in the desired props
    <Typeahead
        inputValue = {this.state.inputValue}
        onChange={ this.handleChange }
        onComplete={this.handleComplete}
        handleHint={this.handleHint}
        options={this.state.options}
        optionTemplate={Template}
        onOptionChange={this.handleOptionChange}
        onOptionClick={this.handleOptionClick}
            
    />,

    // Render Typeahead into the container of your choice.
    document.body
);
```

You may also want to download one of the distributions from the `dist` folder, and load it in the browser that way. A global variable named `Typeahead` will be available to use.

Class names
-----------

These are some default classes names provided by the component. You may override and provide your own styling.

**react-typeahead-container**
  * A `div` element containing the entire Typeahead.

**react-typeahead-input-container**
  * A `div` element containing the usertext and hint.

**react-typeahead-usertext**
  * An `input` element containing the usertext.

**react-typeahead-hint**
  * An `input` element containing the hint.

**react-typeahead-options**
  * A `ul` element containing the rendered list of options.

Available props:
----------------

#### *ReactElement* optionTemplate ***required***
This determines how to render each option. It is required. It should a reference to a ReactElement. It is instantiated for every item in `options`.

When instantiated, it is passed these props:

 * `index` - The position of this option in the `options` list.
 * `data` - The raw data of this option.
 * `userInputValue` - The value the user has **actually typed**.
 * `inputValue` - Typeahead's current input value. Note: this may be different than `userInputValue`.
 * `isSelected` - Is this option currently selected? This will be `true` on when hovered over, or arrowed to.

**Example**:

```jsx
let client = new elasticsearch.Client({
    host: '[API_URL]',
    log: 'trace'
})
class Template extends React.Component{
	constructor(props) {
		super(props);
		
	}
    render() {
        let classes = cx({
            'yt-option': true,
            'yt-selected-option': this.props.isSelected
        });
        return (
            <div className={classes}>
                {this.renderOption()}
            </div>
        );
    }
    renderOption() {
        var optionData = this.props.data,
            inputValue = this.props.userInputValue;
        if (optionData.indexOf(inputValue) === 0) {
            return (
                <span>
                    {inputValue}
                    <strong>
                        {optionData.slice(inputValue.length)}
                    </strong>
                </span>
            );
        }
        return optionData;
    }
}
Template.propTypes = {
    data: PropTypes.any,
    inputValue: PropTypes.string,
    isSelected: PropTypes.bool
}

class Search extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleHint = this.handleHint.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.setInputValue = this.setInputValue.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.handleStoreChange = this.handleStoreChange.bind(this);
        this.state = {
            results: [],
            inputValue: '',
            options: []
        }
    }
    componentWillMount() {
        window.hint= [];
    }
    handleChange ( event ) {
        let value = event.target.value;
        this.setInputValue(value);
        const search_query = event.target.value
        client.search({
            query: search_query,
            output:"JSON"
        }).then(function ( body ) {
            if(body.success == true){
                for (var key in body.results) {
                  hint.push(body.results[key].name);
                }
                hint = hint.filter(function(n){ return n != undefined }); 
                hint = hint.slice(1,10)
                this.setState({ options: hint })
                this.setState({ results: body.results })
            }
        }.bind(this), function ( error ) {
            console.trace( error.message );
        });
    }
    handleComplete(event, completedInputValue) {
        this.setState({
            inputValue: completedInputValue
        });
    }
    handleHint(inputValue, options) {
        if (new RegExp('^' + inputValue).test(options[0])) {
            return options[0];
        }
        return '';
    }
    handleOptionChange(event, option) {
        this.setInputValue(option);
    }
    handleOptionClick(event, option) {
        this.setInputValue(option);
    }

    setInputValue(value) {
        this.setState({
            inputValue: value
        });
    }
    handleStoreChange(newOptions) {
        this.setState({
            options: newOptions
        });
    }
    render () {
        return (
            <div className="container">
                <Typeahead
                	inputValue = {this.state.inputValue}
                    onChange={ this.handleChange }
                    onComplete={this.handleComplete}
                    handleHint={this.handleHint}
                    options={this.state.options}
                    optionTemplate={Template}
                    onOptionChange={this.handleOptionChange}
                    onOptionClick={this.handleOptionClick}
            
                />
                <SearchResults results={ this.state.results } />
            </div>
        )
    }
}
class SearchResults extends React.Component{
	constructor(props) {
		super(props);	
	}
    SearchResults () {
        return { results: [] }
    }
    render () {
        return (
            <div className="search_results">
                <div>
                {                         
                          this.props.results.map((post,i) =>
                            <div>
                              <h3 key={i}>{post.name}</h3>
                                {post.key.map((option,p) => 
                                <div key={p}>
                                  <p key={option.cta}>{option.cta}</p>
                                  <p key={option.sort_bit}>{option.sort_bit}</p>
                                  <p key={option.type}>{option.type}</p>
                                  <p key={option.url}>{option.url}</p>
                                </div>
                                )}
                            </div>
                          )

             	}
                </div>
            </div>
        )
    }
}
SearchResults.propTypes = {
    results: PropTypes.array
}
```
#### *string* inputId ***optional***
This input id is used for the Typeahead's input element.

For example, this allows us to associate a label with the Typeahead's input element. Screen readers will then be able to read the label once the Typeahead is focused.

```jsx
<label for="message-to-field">To</label>

<Typeahead
    inputId="message-to-field"
    ...
/>
```

#### *string* inputName ***optional***
* This input name is used for the Typeahead's input element. Useful if the Typeahead happens to be inside of a `form` element.

#### *string* className ***optional***
* This class name is used for the Typeahead's container.

#### *string* inputValue ***optional***
* The input element's `value` attribute. **NOTE**: You must pass this prop to Typeahead display the value. You have control of the current input value.

#### *array* options ***optional***
* These options are used when rendering the options list. It can contain data of any type.

#### *boolean* autoFocus ***optional***
* If true, the input element is focused on the initial render.

#### *string* placeholder ***optional***
* The input element's `placeholder` attribute.

#### *string* hoverSelect ***optional***
* By default, hovering over an option causes it to be selected.

#### *function* onComplete(*event*, *completedInputValue*) ***optional***
Fires when the user is attempting to complete the input element's hint. If there is no hint, it will not be called.

This function is called when the user presses the `ArrowRight`, `Tab`, or `End` keys. `ArrowLeft` is used instead of `ArrowRight` **if** the input value is RTL.

**Example**:

```jsx
handleComplete: function(event, completedInputValue) {
    this.setState({
        inputValue: completedInputValue
    });
}

<Typeahead
    inputValue={this.state.inputValue}
    onComplete={this.handleComplete}
/>
```

#### *function* onDropdownOpen() ***optional***
* Fires when the dropdown is opened. The dropdown opens as soon as something is typed, or up/down arrow keys are pressed, or when the input is focused.

#### *function* onDropdownClose() ***optional***
* Fires when the dropdown is closed. The dropdown may be closed when `Escape` or `Enter` is pressed, or if any option is clicked on, or if anywhere outside the Typeahead is clicked.

#### *function* onChange(*event*) ***optional***
* Fires when a change occurs on the input element.

#### *function* onInputClick(*event*) ***optional***
* Fires when the input element is clicked.

#### *function* onKeyDown(*event*, optionData, selectedIndex) ***optional***
Fires when a key down occurs on the input element.
It is also passed the currently selected option, and its index.
If no option is selected, `optionData` is the input value, and `selectedIndex` is `-1`.

#### *function* onKeyPress(*event*) ***optional***
* Fires when a key press occurs on the input element.

#### *function* onKeyUp(*event*) ***optional***
* Fires when a key up occurs on the input element.

#### *function* onFocus(*event*) ***optional***
* Fires when the input element is focused.

#### *function* onBlur(*event*) ***optional***
* Fires when the input element is blurred.

#### *function* onSelect(*event*) ***optional***
* Fires when the input element's text is selected.

#### *function* onOptionClick(*event*, optionData, index) ***optional***
* Fires when an option is clicked. `optionData` is the option that was clicked.

#### *function* onOptionChange(*event*, optionData, index) ***optional***
* Fires when the user arrows up or down to an option. It is also called if the user arrows back to the input element, and in that case `index` is `-1`. `optionData` is the option, or input text, data that has been navigated to.

#### *function* handleHint(inputValue, options) ***optional***
This function determines what the hint is. It is called whenever the input has changed. If a hint is considered available, it should return the entire string, otherwise return a default string.

**Example**:

```jsx
handleHint: function(inputValue, options) {
    // If the current input value matches the first option,
    // return that option. It will be used to display the hint.
    if (new RegExp('^' + inputValue).test(options[0].first_name)) {

        // This must return a string!
        return options[0].first_name;
    }

    // No hint is available.
    return '';
}

// Now pass it as a prop...
<Typeahead
    handleHint={this.handleHint}
/>
```

#### *function* getMessageForOption(*optionData*) ***optional***
This is for accessibility. It is called when an option is clicked or arrowed to. `optionData` is the option we're currently on. The return value is then read by the screen reader. It is also called if the user arrows back to the input element. The string returned should be localized so it is read in the correct language.

```js
getMessageForOption: function(optionData) {

    switch (optionData.type) {
    case 'PERSON':
        return 'Search for the person ' + optionData.name;

    case 'PLACE':
        return 'Search for the place ' + optionData.name;

    default:
        return 'Search for the thing ' + optionData.name;
    }
}
```

#### *function* getMessageForIncomingOptions() ***optional***
This is for accessibility. It is called when a new set of options is passed into Typeahead. The return value is then read by the screen reader. The string returned should be localized so it is read in the correct language.

```js
getMessageForIncomingOptions: function() {
    return 'There are new options available. Use the up and down arrows to navigate.';
}
```

Don't see your prop? explaining your use case, and I will add it.

Packages Needed
---------------
* elasticsearch : ^10.1.3
* prop-types : ^15.5.4
* classnames : ^2.1.1
* react : ^15.4.2
* react-dom : ^15.4.2

Testing
-------
The tests are written using [mocha](https://github.com/mochajs/mocha), and ran using [Karma](https://github.com/karma-runner/karma). Run the command `npm test` to perform a single run of the tests in PhantomJS, and `npm run test:dev` to debug the tests in Chrome.

Issues
------
Please [file an issue](https://github.com/Anishmprasad/typeahead-react-component/issues) if you find a bug, or need help.

License
-------
The MIT License (MIT)
Copyright (c) 2022 Anish M Prasad

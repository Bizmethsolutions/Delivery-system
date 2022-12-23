import React, { Component } from 'react'
import Geosuggest from 'react-geosuggest'

const google = window.google

class AddressAutoComplete extends Component {

  constructor(props) {
    super(props);
    this.onSuggestSelect = this.onSuggestSelect.bind(this);
  }


  /**
   * When the input receives focus
   */
  onFocus() {
    //console.log('onFocus'); // eslint-disable-line
  }

  /**
   * When the input loses focus
   * @param {String} value The user input
   */
  onBlur(value) {
    //console.log('onBlur', value); // eslint-disable-line
  }

  /**
   * When the input got changed
   * @param {String} value The new value
   */
  onChange(value) {
    // console.log('input changes to :' + value); // eslint-disable-line
    this.props.onChange(value)
  }

  /**
   * When a suggest got selected
   * @param  {Object} suggest The suggest
   */
  onSuggestSelect(suggest) {
    // console.log(JSON.stringify(suggest)); // eslint-disable-line
    this.props.onSelect(suggest);
  }

  /**
   * When there are no suggest results
   * @param {String} userInput The user input
   */
  onSuggestNoResults(userInput) {
    //console.log('onSuggestNoResults for :' + userInput); // eslint-disable-line
  }

  /**
   * Render the example app
   * @return {Function} React render function
   */
  render() {

    return ( // eslint-disable-line
      <Geosuggest
        initialValue={this.props.initialValue}
        placeholder={""}
        inputClassName={this.props.inputClassName}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange.bind(this)}
        onSuggestSelect={this.onSuggestSelect}
        onSuggestNoResults={this.onSuggestNoResults}
        location={new google.maps.LatLng(40.730610, -73.935242)}
        radius="100"
        country={"us"}
        highlightMatch={false} />
    );
  }
}

export default AddressAutoComplete;

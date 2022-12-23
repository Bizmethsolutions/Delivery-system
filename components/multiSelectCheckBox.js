import React from 'react';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import _ from 'lodash'

const options = [
  { label: 'Roofing', value: "Roofing"},
  { label: 'Dirt/Sand', value: 'Dirt/Sand'},
  { label: 'Concrete', value: 'Concrete'},
  { label: 'Brick', value: 'Brick'},
  { label: 'Metal', value: 'Metal'},
  { label: 'Wood', value: 'Wood'},
  { label: 'Cardboard', value: 'Cardboard'},
  { label: 'Asphalt', value: 'Asphalt'},
  { label: 'Sheetrock', value: 'Sheetrock'},
  { label: 'Glass', value: 'Glass'},
  { label: 'Waste', value: 'Waste'},
  { label: 'Plastic', value: 'Plastic'},
  { label: 'Furniture', value: 'Furniture'},
  { label: 'Appliances', value: 'Appliances'},
  { label: 'Stone', value: 'Stone'},
  { label: 'Other', value: 'Other'},
];

export default class Multiselect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedOptions: null
    }
  }

  componentDidMount() {
    let {customValue} = this.props

  }


  render() {
    // const { selectedOptions } = this.state
    // console.log(selectedOptions, 'selectedOptions')
    let {customValue} = this.props
    let selectedOptions = []
    if(customValue) {
      if (Array.isArray(_.get(this.props, 'customValue', [])))  {
        customValue.forEach((data, index) => {
          selectedOptions.push({ label: data, value: data })
        })
      }
    }
    // console.log('selectedOptions', selectedOptions)
    if(selectedOptions.length > 0) {
     return (
       <ReactMultiSelectCheckboxes
        className="multi-select-checkbox"
        options={options}
        placeholderButtonLabel='Type of Debris'
        value={selectedOptions}
        {...this.props}
       />
     );
   }
   else {
     return (
       <ReactMultiSelectCheckboxes
          className="multi-select-checkbox"
          options={options}
          placeholderButtonLabel='Type of Debris'
          {...this.props}
       />
     );
   }
  }
}

import React, { PureComponent } from 'react'
import { DateRange } from 'react-date-range'
import DatePicker from "react-datepicker"
// import Close from '../../assets/images/cancelicon.svg'
import ReactModal from 'react-modal'
import moment from 'moment'

import { CloseIcon } from './icons'

export default class ModalComponent extends PureComponent {
  constructor ()  {
    super()
    this.state = {
      startDate: '',
      endDate: '',
    }
  }

  handleDateChange (key, date) {
    if (date) {
      this.setState({ [key]: date })
    } else {
      this.setState({ [key]: '' })
    }
  }

  onSubmitDateRanges () {
    if (this.state.startDate && this.state.endDate ) {      
      this.props.onSubmitDateRanges(this.state.startDate , this.state.endDate)
    }
  }

// const ModalComponent = ({ datePickerModal, datePickerToggle, className, handleSelect, onSubmitDateRanges }) => (
  render() {
    return (
      <ReactModal
        isOpen={this.props.datePickerModal}
        toggle={this.props.datePickerToggle}
        className={this.props.className}
        modalClassName="md__modal--container date__picker--modal"
        centered
        ariaHideApp={false}
      >

      <div className="react-modal-dialog small-mob react-modal-dialog-centered">
        <div className="react-modal-header">
            <h5 className="react-modal-title">Custom Date</h5>
          <button onClick={this.props.datePickerToggle} type="button" className="btn react-modal-close">
          <CloseIcon />
          </button>
        </div>
        <div className="divider-line"></div>
        <div className="react-modal-body datepicker-body">
            <div>
              <div className="inputflex customedate">
              <div className="form-group material-textfield">
                <DatePicker
                  className="form-control material-textfield-input"
                  selected={this.state.startDate}
                  onChange={this.handleDateChange.bind(this, 'startDate')}
                  //minDate={new Date()}
                  placeholderText="Select"
                  required />
                <label className={"material-textfield-label address-focus-label"}>From </label>
              </div>
              <div className="form-group material-textfield">
                <DatePicker
                  className="form-control material-textfield-input"
                  selected={this.state.endDate}
                  onChange={this.handleDateChange.bind(this, 'endDate')}
                  minDate={this.state.startDate}
                  placeholderText="Select"
                  readOnly={this.state.startDate ? false : true}
                  required />
                <label className={"material-textfield-label address-focus-label"}>To </label>
              </div>
            </div>
            </div>
            {/* <DateRange
              onInit={handleSelect}
              onChange={handleSelect}
              // maxDate= {moment()}
            /> */}
            <button color="secondary" className="btn btn-dark btn-lg w-100 font-800" onClick={this.onSubmitDateRanges.bind(this)}>Submit</button>
        </div>
        </div>
      </ReactModal>
    )
  }
}
// export default ModalComponent

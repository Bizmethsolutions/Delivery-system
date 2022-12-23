import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import _ from 'lodash'
import InputMask from 'react-text-mask'

import config from './../config'

// import { Menu, Dropdown, Popconfirm, message } from 'antd'
import { CloseIcon, MoreIcon } from './icons'

const phoneNumberMask = config.phoneNumberMask

export default class CustomersComponent extends PureComponent {

  constructor() {
    super()
    this.state={
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      error: {}
    }
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {

  }

  onHandleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  closeModal() {
    this.props.closeCustomerModal()
  }

  validate() {
    let fields = ['firstname', 'email', 'phone']
    let error = {}
    const self = this
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    _.forEach(fields, function(field, i) {
      if (self.state[field] == undefined || self.state[field] == "") {
        error[field] = 'Field is required'
        require = true
      } else if (field === 'email') {
        let testR = regex.test(String(self.state[field]).toLowerCase())
        if (!testR) {
          error[field] = 'Invalid email'
          require = true
        } else {
          //error[field] = ''
        }
      }
      else if (field === 'phone') {
        let phone = self.state.phone.replace(/\-/g, '').replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '').replace(/^(-)+|(-)+$/g, '').replace('-', '')
        if (phone.toString().length !== 10) {
          require = true
          error[field] = 'Please enter 10 digit Phone Number'
        } else {
          // error[field] = ''
        }
      }
    })
    this.setState({ error })
  }

  addNewCustomer = async() => {
    await this.validate()
    const { firstname, lastname, email, phone, error } = this.state
    let data = {
      firstname, lastname, email: email && email.toLowerCase(), phone
    }
    if(Object.keys(error).length === 0) {
      this.props.addNewCustomer(data)
    }
  }
  render() {
    const { error } = this.state
    return (
      <div>
        <ReactModal
          isOpen={this.props.newContactModalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add New Contact"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">New Contact</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-6">
                <div className="form-group material-textfield">
                  <input
                    type="text"
                    className="form-control material-textfield-input"
                    name= "firstname"
                    value={this.state.firstname}
                    onChange={this.onHandleChange.bind(this)}
                    required />
                    <label className="material-textfield-label">First Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{error && error.firstname ? error.firstname : ""}</p>
                    </div>
                </div>
                <div className="col-md-6">
                <div className="form-group material-textfield">
                  <input
                    type="text"
                    className="form-control material-textfield-input"
                    name= "lastname"
                    value={this.state.lastname}
                    onChange={this.onHandleChange.bind(this)}
                    required />
                    <label className="material-textfield-label">Last Name</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                <div className="form-group material-textfield">
                  <input
                    type="text"
                    className="form-control material-textfield-input"
                    name= "email"
                    value={this.state.email}
                    onChange={this.onHandleChange.bind(this)}
                    required />
                    <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                    <p className="text-danger">{error && error.email ? error.email : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <InputMask
                      guide={false}
                      type="text"
                      keepCharPositions={false}
                      mask={phoneNumberMask}
                      className="form-control material-textfield-input"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Phone Number <span className="text-danger">*</span></label>
                    <p className="text-danger">{error && error.phone ? error.phone : ""}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {this.props.customerAddMessage && <p className="text-danger">{this.props.customerAddMessage}</p>}
                  <div className="d-flex justify-content-end">
                    <button onClick={this.addNewCustomer.bind(this)} className="btn btn-dark btn-lg w-100 font-800">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

import React, { Component } from 'react';
import ReactModal from 'react-modal'
import base64 from "base-64"

import { connect } from 'react-redux';
import _ from 'lodash'
// import { Modal } from 'react-bootstrap';
import InputMask from 'react-text-mask'
// import axios from "axios";
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import InfoIcon from '../../../images/info-icon.svg'

// import { apiCallDispatcher, dispatcher as responseHandler } from '../action';
// import { send_message, get_message } from '../request-builder';
// import { actions, loading } from './constant';
import moment from 'moment'
import config from '../../../config';
const load = require("load-stripe");
// import styles from './style.css';

class AddCardForm extends Component {
  constructor(props) {
  super(props);
  this.state = {
    
  }
  this.closeModal = this.closeModal.bind(this)
}
componentDidMount() {
  this.setState({
    cardNumber: "",
    nameoncard: "",
    cvv: "",
    expDate: ""
  })
  let data = { user : {
    id: localStorage.getItem("userid"),
    usertype: localStorage.getItem("usertype")
    }
  }
  this.props.getUser(data)
}
closeModal() {
  this.setState({
    cardNumber: "",
    nameoncard: "",
    cvv: "",
    expDate: ""
  })
  this.props.closeCardModal()
}

onHandleChange (e) {
  if (e.target.name === 'live_load_yard') {
    this.setState({ live_load_yard: e.target.value, half_yrd_qty: 0 })
  } else if (e.target.name === 'half_yrd_qty') {
    this.setState({ live_load_yard: 0, half_yrd_qty: e.target.value })
  } else {
    this.setState({ [e.target.name]: e.target.value })
  }
}
addCard = async() => {
  const { cardNumber, nameoncard, cvv, expDate } = this.state
  const obj = {
    id: this.props.customerid,
    cardNumber,
    name: nameoncard,
    cvv,
    expDate
  }
  try {
    const stripePublishKey = _.get(this.props.user, 'companyInfo.stripePublishKey', '') !== "" ? base64.decode(_.get(this.props.user, 'companyInfo.stripePublishKey', '')) : ""
    const stripe = await load(stripePublishKey);
      const data = {
        number: cardNumber,
        exp_month: expDate.split("/")[0],
        exp_year: `${moment().format("YY")}${expDate.split("/")[1]}`,
        cvc: cvv
      };
      const { id, ...stripeData } = await stripe.card.createToken(data);
        const data2 = {
          customerid: this.props.customerid,
          id,
          stripeData
        }
        const { value } = await this.props.addCard(data2)
        if(value.type === "success") {
          this.closeModal()
        } else {
          this.setState({error: "Error in processing your request at the moment"})
        }
  } catch ({ message, param }) {
    this.setState({error: message });
  }

}

render() {
    let user = this.props.user ? this.props.user  : {}
    return (
      <ReactModal
      isOpen={this.props.openCardModal}
      onRequestClose={this.closeModal}
      contentLabel="Add Team Member"
      ariaHideApp={false}
    >
      <div className="react-modal-dialog react-modal-dialog-centered">
        <div className="react-modal-header d-flex align-items-center">
          <div>
            <h5 className="react-modal-title">Add Card</h5>
          </div>
          <div className="marg-left-auto">
            {/* <button className="btn btn-dark btn-md mr-4 font-800">Draft</button> */}
            <button type="button" className="btn react-modal-close pos-static" onClick={this.closeModal}><CloseIcon /></button>
          </div>
        </div>
        <div className="divider-line"></div>

        <div className="react-modal-body">

            <div className="row">
              <div className="col-md-12">
            <div className="form-group material-textfield material-textfield-lg">
                <InputMask
                  guide={false}
                  type="text"
                  keepCharPositions={false}
                  mask={config.cardNumberMask}
                  className="form-control material-textfield-input h-66 lockicons"
                  name="cardNumber"
                  value={this.state.cardNumber}
                  onChange={this.onHandleChange.bind(this)}
                  required />
                <label className="material-textfield-label">Card Number </label>
              </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-group material-textfield material-textfield-lg">
                <input
                  type="text"
                  className="form-control material-textfield-input h-66"
                  name="nameoncard"
                  value={this.state.nameoncard}
                  onChange={this.onHandleChange.bind(this)}
                  required />
                <label className="material-textfield-label">Name on card</label>
              </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group material-textfield material-textfield-lg">
                <InputMask
                  guide={false}
                  type="text"
                  keepCharPositions={false}
                  mask={config.expDateMask}
                  className="form-control material-textfield-input h-66"
                  name="expDate"
                  value={this.state.expDate}
                  onChange={this.onHandleChange.bind(this)}
                  required />
                <label className="material-textfield-label">Expiration Date (MM/YY)</label>
              </div>
              </div>
              <div className="col-md-6">
                <div className="form-group material-textfield material-textfield-lg">
                <InputMask
                  guide={false}
                  type="text"
                  keepCharPositions={false}
                  mask={config.cvvMask}
                  className="form-control material-textfield-input h-66"
                  name="cvv"
                  value={this.state.cvv}
                  onChange={this.onHandleChange.bind(this)}
                  required />
                <label className="material-textfield-label">Security Code </label>
              </div>
                <span className="rel">
                  <p className="tooltip--bottom" data-tooltip="3-digit security code usually found on the back of your card. American Express cards have a 4-digit code located on the front."><img src={InfoIcon} alt="" /></p>
                </span>
              </div>
            </div>
   
            <div className="row">
              <div className="col-md-12">
              <div className="text-danger">{this.state.error}</div>
                <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.addCard.bind(this)}>Save</button>
              </div>
            </div>

   
        </div>
        </div>
        </ReactModal>
        )
    }
}

export default AddCardForm

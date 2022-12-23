import React, { Component } from 'react';
import ReactModal from 'react-modal'

import { connect } from 'react-redux';
import _ from 'lodash'
// import { Modal } from 'react-bootstrap';
import InputMask from 'react-text-mask'
// import axios from "axios";
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'

// import { apiCallDispatcher, dispatcher as responseHandler } from '../action';
// import { send_message, get_message } from '../request-builder';
// import { actions, loading } from './constant';
import moment from 'moment'
import config from '../../../config';

// import styles from './style.css';


class CardListForm extends Component {
  constructor(props) {
  super(props);
  this.state = {
    amount: 0
  }
  this.closeModal = this.closeModal.bind(this)
}

closeModal() {
  this.props.closeCardModal()
}

onHandleChange (e) {
  if(e.target.name === "additionaltons") {
    this.calculate(e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  } else {
    this.setState({ [e.target.name]: e.target.value })
    this.props.updateCardId(e.target.value, this.state.amount)
  }
    
}

calculate(noOfTons) {
  const { order } = this.props
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
  const { value } = await this.props.addCard(obj)

}
getContainerSize(id) {
    if (this.props.containerList) {
        let master = this.props.containerList;
        for (let index = 0; index < master.length; index++) {
            let element = master[index];
            if (String(element.id) === String(id)) {
                return element.size;
            }
        }
    }
}

render() {
    let user = this.props.user ? this.props.user  : {}
    const { order, container } = this.props
    return (
        <div className="order__sms-form">
          <div>
            <p>Container Size: 20 Yards</p>
            <p>Allowed Tons: 2</p>
            <div className="form-group material-textfield material-textfield-lg">
              <input
                type="text"
                className="form-control material-textfield-input h-66"
                name="additionaltons"
                value={this.state.additionaltons}
                onChange={this.onHandleChange.bind(this)}
                required />
              <label className="material-textfield-label">Enter Additional Tons<span className="text-danger">*</span> </label>
            </div>
            <p>Additional Tons: 2</p>
            <p>Additional Rate: 2</p>
            <p>Additional Price: 2</p>
          </div>
          {this.props.selectedCustomer && _.get(this.props.selectedCustomer, 'payment_info', []).length !== 0 &&
            <select onChange={this.onHandleChange.bind(this)} value={this.state.cardId}>
            {_.get(this.props.selectedCustomer, 'payment_info', []).map((payment) => {
                return (
                  <option value={_.get(payment.stripe, 'card.id', '')}>
                    **************{_.get(payment.stripe, 'card.last4', '')}
                  </option>
                )
              })
              }
              </select>
            }
        </div>
        )
    }
}

export default CardListForm

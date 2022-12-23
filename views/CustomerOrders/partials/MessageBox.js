import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'
// import { Modal } from 'react-bootstrap';

// import config from "../config"
// import axios from "axios";

// import { apiCallDispatcher, dispatcher as responseHandler } from '../action';
// import { send_message, get_message } from '../request-builder';
// import { actions, loading } from './constant';
import moment from 'moment'

// import styles from './style.css';


class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaderInit: false,
      street_no: "", floor: "", route: "", new_address: "",
      address: "", state: "", geoPlaceId: "", city: "",
      updateAt: "",
      neighborhood: "", zipcode: "",
      deliveryday: "", deliverydate: new Date(),
      typeofdebris: "", containersize: "",
      parking: 'no', location: "",
      purchaseorderno: "", permit: 'yes',
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      paymenttype: "", orderedby: "", orderedbycontact: "",
      specialinstruction: "", id: "", status: "", customer: "", dumpcost: "", weight: ""
      , containerlocation: "", confirm: false, exception: { status: false, msg: [] },
      liveOrder: '', halfYardQty: 0, created_by: "", created_at: "", is_admin: false,
      orderid: '', message: ''
    }
  }

  // getDate(input) {
  //     if (input) {
  //         return DateUtility.getDateMMDDYYY(input);
  //     }
  // }
  //
  // getDay(input) {
  //     if (input) {
  //         return DateUtility.getDay(new Date(input).getDay());
  //     }
  // }

  componentWillMount = async () => {
    const value2 = await this.props.getMessage(this.props.orderData.orderid)
    if (value2) {
      this.setState({ messages: _.get(value2.value, 'data', []) })
    }
    // if(this.props.selected && this.props.selected.orderid) {
    //     //this.props.getMessage(this.props.match.params.orderid)
    // }
  }
  // componentWillReceiveProps(nextProps) {
  //     if(nextProps.newMessages === true && this.props.selected.orderid !== '') {
  //         this.props.getMessage(this.props.selected.orderid)
  //     }
  // }


  handleChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSelectChange(event) {
    var last2 = this.props.orderData.orderid.slice(-2);
    if (event.target.value === 'sensor_full_message') {
      this.setState({
        messageBox: `Hi! Our sensor in your container at ${this.props.orderData.new_address} shows it's full.

REPLY:
[1#${last2}] to place an exchange
[2#${last2}] to place a removal

No action will be taken if we do not receive a reply.

Thanks!
The Curbside Team

Questions? Contact us at (718) 384-6357 or hello@mycurbside.com`})
    }
  }

  sendMessage = async () => {
    let user = this.props.user ? this.props.user : {}
    const obj = {}
    obj.message = this.state.messageBox
    obj.orderid = this.props.orderData.orderid
    obj.objectid = this.props.orderData.id
    obj.to_number = this.props.orderData.contactnumber
    obj.haulerid = this.props.orderData.haular && this.props.orderData.haular._id
    obj.receiver = {
      name: this.props.selectedCustomer.contactname,
      phone: this.props.orderData.contactnumber
    }
    obj.sender = {
      name: user && user.username,
      phone: ''
    }
    const timezone = {}
    const date = new Date().getTimezoneOffset()
    timezone.clientoffset = date
    timezone.clienttimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    obj.timezone = timezone
    let { value } = await this.props.enterpriseMessage(obj)
    if (value) {
      const value2 = await this.props.getMessage(this.props.orderData.orderid)
      if (value2) {
        this.setState({ messages: _.get(value2.value, 'data', []) })
      }
      this.setState({ messageBox: "", selected: "" })
    }
    // const self = this
    // setTimeout(function(){
    //     self.setState({ messageBox: '' })
    //     self.props.getMessage(self.props.selected.orderid)
    // }, 2000);

  }

  getFormatedDateAndTimeWithoutUTC = (input, timezone, user, type) => {
    if(input !== "" && input !== null && input !== undefined) {
        const newdate = new Date()
        let clientoffset = newdate.getTimezoneOffset()
        const dateStr = String(input).split("T")[0];
        const timeStr = String(input).split("T")[1];
        const dateArr = dateStr.split('-');
        const timeArr = timeStr.split(":")
        let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
        const utc = created.getMinutes() + (timezone && timezone.clientoffset)
        created.setMinutes(created.getMinutes() + timezone.clientoffset)
        //created = new Date((created) + (timezone.clientoffset*60*1000))
        if(user && user.timezone && user.timezone.tzName ) {
            const timezone = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
            clientoffset = user && user.timezone ? moment.tz(moment(), timezone).utcOffset() : clientoffset
        } else {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            clientoffset = user && user.timezone ? moment.tz(moment(), timezone).utcOffset() : clientoffset
        }
        created.setMinutes(created.getMinutes() + clientoffset)
        if(type === 'date') {
          return moment(created).format('MM-DD-YYYY')
        } else {
          return moment(created).format('hh:mm')
        }
        
    }
}

  getFormatedDateAndTime(input, type) {
    //return ""
    const timezone = _.get(this.props, 'orderData.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return this.getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user, type)
    } else {
      return ""
    }
}

getFormatedDateAndTimeByUTCDate = (input, timezone, user, type) => {
  if(input !== "" && input !== null && input !== undefined) {
      const newdate = new Date()
      let clientoffset = newdate.getTimezoneOffset()
      const dateStr = String(input).split("T")[0];
      const timeStr = String(input).split("T")[1];
      const dateArr = dateStr.split('-');
      const timeArr = timeStr.split(":")
      let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
      //const utc = created.getMinutes() + (timezone && timezone.clientoffset)
      //created.setMinutes(created.getMinutes() + timezone.clientoffset)
      //created = new Date((created) + (timezone.clientoffset*60*1000))
      if(user && user.timezon && user.timezone.tzName ) {
          const timezone = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
          clientoffset = user && user.timezone ? moment.tz(moment(), timezone).utcOffset() : clientoffset
      } else {
          const timezone = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
          clientoffset = moment.tz(moment(), timezone).utcOffset()
      }
      created.setMinutes(created.getMinutes() + clientoffset)
      if(type === 'date') {
        return moment(created).format('MM-DD-YYYY')
      } else {
        return moment(created).format('hh:mm')
      }
  }
}

getFormatedDateAndTimeByUTC(input, type) {
  //return ""
  const timezone = _.get(this.props, 'orderData.timezone', {})
  if(Object.keys(this.props.user).length !== 0 && timezone) {
    return this.getFormatedDateAndTimeByUTCDate(input, timezone, this.props.user, type)
  } else {
    return ""
  }
}

  render() {
    let user = this.props.user ? this.props.user : {}
    let twillonumber = process.env.REACT_APP_TWILLO_NUMBER
    
    return (

      <div className="order__sms-form pad-15-lr">
        <div className="container">
        <div className="row">
          <div className="col-md-12 mt-4 mb-4">

            <div className="form-group material-textfield">
              {(this.props.orderstatus !== "Complete" && this.props.orderstatus !== "Pending Removal" && this.props.orderstatus !== "Removed") ? 
                <select className="form-control material-textfield-input custom-select pt-0" name="selected" value={this.state.selected} onChange={this.handleSelectChange.bind(this)}>
                  <option value="">Select Message Template</option>
                  <option value="sensor_full_message">Sensor Full Message</option>
                </select> : ""}
              
            </div>

            {/* {(this.props.orderstatus !== "Complete" && this.props.orderstatus !== "Pending Removal" && this.props.orderstatus !== "Removed") ? 
            <select className="form-control custom__select" name="selected" value={this.state.selected} onChange={this.handleSelectChange.bind(this)}>
              <option value="">Select Message Template</option>
              <option value="sensor_full_message">Sensor Full Message</option>
            </select> : ""} */}


            <div className="form-group material-textfield">
              {(this.props.orderstatus !== "Complete" && this.props.orderstatus !== "Pending Removal" && this.props.orderstatus !== "Removed") ?
                <textarea className="form-control material-textfield-input h-150" type="text" name="messageBox" value={this.state.messageBox} onChange={this.handleChange.bind(this)}></textarea>
                : ""}
              {/* <label className="material-textfield-label">Special Instructions </label> */}
            </div>

            {/* {(this.props.orderstatus !== "Complete" && this.props.orderstatus !== "Pending Removal" && this.props.orderstatus !== "Removed") ? 
            <textarea className="form-control chat-sms-box" type="text" rows="5" name="messageBox" value={this.state.messageBox} onChange={this.handleChange.bind(this)}></textarea> : ""} */}
            
            {(this.props.orderstatus !== "Complete" && this.props.orderstatus !== "Pending Removal" && this.props.orderstatus !== "Removed") ? 
            <button className="btn btn-dark btn-lg w-180 font-800" onClick={this.sendMessage.bind(this)}>Send</button> : "" }

            {/* {(this.props.orderstatus !== "Complete" && this.props.orderstatus !== "Pending Removal" && this.props.orderstatus !== "Removed") ? 
            <button className="chat_submit--btn" onClick={this.sendMessage.bind(this)}>Send</button> : ""} */}
          </div>
        </div>
        
        
        <div className="msg-chat-padd removepad">
        <div className="msg-chat-section">
          <ul id="chatlist">
            {this.state.messages && this.state.messages.map((item, index) => {
              return (
                <li>
                  {item.type === 'sent' ?
                    <div className="pull-left">
                      <div className="day-date">{this.getFormatedDateAndTimeByUTC(item.created_at, 'date')} at {this.getFormatedDateAndTimeByUTC(item.created_at, 'time')}</div>
                      <span className="chat-img">{item.message_body}</span>
                      <div className="user-name">{item.sender.name} {String(item.from_number) === String(twillonumber) ? "(Enterprise)" : "(Dispatcher)"}</div>
                    </div>
                    : <div className="pull-right text-right">
                        <div className="day-date">{this.getFormatedDateAndTimeByUTC(item.created_at, 'date')} at {this.getFormatedDateAndTimeByUTC(item.created_at, 'time')}</div>
                        <div className="chat-img">{item.message_body} {item.mediaurl && item.mediaurl !== "" ? <img src={item.mediaurl} /> : ""}</div>
                      <div className="user-name">{item.sender.name} (Customer)</div>
                    </div>}
                </li>
              )
            })}
          </ul>
          </div>
        </div>
      </div>
      </div>
    )
  }
}





export default MessageForm

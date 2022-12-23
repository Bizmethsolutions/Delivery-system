import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import AddressAutoComplete from '../../../components/AddressAutoComplete'
import { formatGeoAddressComponents, formatOrderAddess, getTimeInDayAndHours, getDateMMDDYYYHHMM, getFormatedDateAndTimeWithoutUTC, formatPhoneNumber, getDay, getContainerSize, getDate } from '../../../components/commonFormate'
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'
import MapComponent from '../../../components/map'
import config from '../../../config'

const { TabPane } = Tabs;
const { Option } = Select;

const timezoneKey = config.timezone_api_key.api_key;
const timezoneApi = config.timezone_api_key.api_url;
const phoneNumberMask = config.phoneNumberMask

export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      haulerList: [],
      err: {},
      city: '',
      address: '',
      state: '',
      zipcode: '',
      new_address: '',
      borough: '',
      neighborhood: '',
      location: {},
      street_no: '',
      route: '',
      geoPlaceId: '',
      floor: '',
      contactnumber: '',
      contactname: '',
      permit: '',
      pickupday: "", pickupdate: "",
      typeofdebris: "", containersize: "",
      parking: '', location: "",
      purchaseorderno: "",
      dump: "",
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      specialinstruction: "", containerlocation: "", paymenttype: "",
      orderedby: "", orderedbycontact: "",
      additionalEmail: [],
      containerList: [],
      liveOrder: 0,
      half_yrd_qty: 0
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount = async()=> {
    const {orderDataForRemoval} = this.props
    if (this.props.pendingRemoval) {
      const pickupdateDateCal =  _.get(orderDataForRemoval, 'pickupdate', '') !== '' ? (new Date(_.get(orderDataForRemoval, 'pickupdate', ''))) : new Date()
      this.handleDateChange(pickupdateDateCal)
      this.setState({ dump: _.get(orderDataForRemoval, 'dump.id', '') })
    }
    this.setState({
      city: _.get(orderDataForRemoval, 'city', ''),
      address: _.get(orderDataForRemoval, 'address', ''),
      status: _.get(orderDataForRemoval, 'status', ''),
      state: _.get(orderDataForRemoval, 'state', ''),
      zipcode: _.get(orderDataForRemoval, 'zipcode', ''),
      new_address: _.get(orderDataForRemoval, 'new_address', ''),
      borough: _.get(orderDataForRemoval, 'borough', ''),
      neighborhood: _.get(orderDataForRemoval, 'neighborhood', ''),
      street_no: _.get(orderDataForRemoval, 'street_no', ''),
      route: _.get(orderDataForRemoval, 'route', ''),
      geoPlaceId: _.get(orderDataForRemoval, 'geoPlaceId', ''),
      floor: _.get(orderDataForRemoval, 'floor', ''),
      contactnumber: _.get(orderDataForRemoval, 'contactnumber', ''),
      contactname: _.get(orderDataForRemoval, 'contactname', ''),
      permit: _.get(orderDataForRemoval, 'permit', 'false') ? 'yes' : 'no',
      location: _.get(orderDataForRemoval, 'location', ''),
      purchaseorderno: _.get(orderDataForRemoval, 'purchaseorderno', ''),
      timezone: _.get(orderDataForRemoval, 'timezone', ''),
      consumercost: _.get(orderDataForRemoval, 'consumercost', ''),
      // haulercompany: _.get(orderDataForRemoval, 'haular.company_name', ''),
      haulercompany: _.get(orderDataForRemoval, 'haular.companyname', '') !== '' ? _.get(orderDataForRemoval, 'haular.companyname', '') : _.get(orderDataForRemoval, 'haular.company_name', ''),
      specialinstruction: _.get(orderDataForRemoval, 'specialinstruction', ''),
      containerlocation: _.get(orderDataForRemoval, 'containerlocation', ''),
      paymenttype: _.get(orderDataForRemoval, 'paymenttype', ''),
      orderedby: _.get(orderDataForRemoval, 'orderedby', ''),
      orderedbycontact: _.get(orderDataForRemoval, 'orderedbycontact', ''),
      pricingtype: _.get(orderDataForRemoval, 'pricingtype', ''),
      additionalEmail: _.get(orderDataForRemoval, 'additionalEmail', []),
      containersize: _.get(orderDataForRemoval, 'container', ''),
      typeofdebris: _.get(orderDataForRemoval, 'typeofdebris', ''),
      parking: _.get(orderDataForRemoval, 'parking', ''),
      paymenttype: _.get(orderDataForRemoval, 'paymenttype', ''),
      otherPlacement: _.get(orderDataForRemoval, 'otherPlacement', ''),
      placement: _.get(orderDataForRemoval, 'placement', ''),
      // pickupday: _.get(orderDataForRemoval, 'pickupday', ''),
      orderedby: _.get(orderDataForRemoval, 'orderedby', ''),
      half_yrd_qty: _.get(orderDataForRemoval, 'half_yrd_qty', ''),
      live_load_yard: _.get(orderDataForRemoval, 'live_load_yard', ''),
      haular: _.get(orderDataForRemoval, 'haular', ''),
      haularDetail: _.get(orderDataForRemoval, 'haular', ''),
      orderid: _.get(orderDataForRemoval, 'orderid', ''),
      geoPlaceId: _.get(orderDataForRemoval, 'geoPlaceId', ''),
      accessibilitynotes: _.get(orderDataForRemoval, 'accessibility', '') === "Other: Manual entry" ? _.get(orderDataForRemoval, 'manualaccessibility', '') : _.get(orderDataForRemoval, 'accessibility', '') !== "" && _.get(orderDataForRemoval, 'accessibility', '') !== "Select" ? _.get(orderDataForRemoval, 'accessibility', '') : "N/A",
      otherDebris: _.get(orderDataForRemoval, 'otherDebris', []),
    })



    let data = {
      limit: undefined, by: undefined, page: undefined, sort_field: ''
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []) })
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.props.closeModal()
  }

  toggleViewModal = () => {
    this.setState({ isViewModalOpen: !this.state.isViewModalOpen })
  }

  toggleEditModal = () => {
    this.setState({ isEditModalOpen: !this.state.isEditModalOpen })
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

  handleDateChange (date) {
    if (date) {
      let day = getDay(date.getDay())
      this.setState({ pickupdate: date, pickupday: day })
    } else {
      this.setState({ pickupdate: '', pickupday: '' })
    }
  }

  validate() {
    let errObj = {}
    const { state, city, new_address,zipcode, contactname, pickupdate, dump, contactnumber, consumercost, err, live_load_yard, half_yrd_qty, containersize } = this.state

    if(contactnumber === "") {
      errObj.contactnumber = "Contact number is required"
    }
    if(consumercost === "") {
      errObj.consumercost = "Total cost is required"
    }
    const phonelength = contactnumber.replace(/[^0-9]/g,"").length
    if(phonelength !== 10) {
      errObj.contactnumber = "Please enter exactly 10 digit number"
    }
    // if(zipcode === "") {
    //   errObj.zipcode = "Zipcode is required"
    // }
    // if(new_address === "" || !new_address) {
    //   errObj.address = "Address is required"
    // }
    // if(city === "") {
    //   errObj.city = "City is required"
    // }
    // if(state === "") {
    //   errObj.state = "State is required"
    // }
    if(contactname === "") {
      errObj.contactname = "Contact name is required"
    }
    if(containersize === "") {
      errObj.containersize = "container size is required"
    }
    if(pickupdate === "") {
      errObj.pickupdate = "Pickup date is required"
    }
    if (localStorage.getItem("usertype") && localStorage.getItem("usertype") === "user") {
      if(dump === undefined || dump === "") {
        errObj.dumpsite = "Dump site is required"
      }
    }
    let containerName = getContainerSize(this.props.containerList, this.state.containersize);
    if(containerName === "Live Load") {
      if (!live_load_yard) {
        errObj.live_load_yard = "Yardage is required"
      }
    } else if(containerName === "1/2 Yard") {
      if (!live_load_yard && half_yrd_qty === "") {
        errObj.half_yrd_qty = "Minis is required"
      }
    }

    this.setState({ err: errObj })
  }

  sendOrder=async()=> {
    this.setState({ disabled: true })
    await this.validate()
    const {err} = this.state
    const exception = []
    const oldOrder = this.props.orderDataForRemoval
    oldOrder.id = _.get(oldOrder, 'id', '') !== "" && _.get(oldOrder, 'id', '') !== undefined ? _.get(oldOrder, 'id', '') : _.get(oldOrder, '_id', '')    
    if(Object.keys(err).length === 0) {
      const { contactnumber, contactname,
        pickupday, pickupdate, typeofdebris, dump,
        parking, specialinstruction, containerlocation, live_load_yard } = this.state
      let orderDeliveryDate = oldOrder.deliverydate
      const timezoneOfUser = Intl.DateTimeFormat().resolvedOptions().timeZone
      let orderDate = moment().tz(timezoneOfUser).format('MM-DD-YYYY')
      let status = "";
      let queue_removal_orders = ((oldOrder && oldOrder.queue_removal_orders) ? oldOrder.queue_removal_orders : [])
      this.props.statusList.forEach(function (element) {
        if (element.status === "Future Removal" && oldOrder.futureRemoval) {
          oldOrder.status = String(element._id);
        }
        if (element.status === "Pending Removal" && !oldOrder.futureRemoval) {
            oldOrder.status = String(element._id);
        }
      })
      if (localStorage.getItem("usertype") && localStorage.getItem("usertype") === "user") {
        if (!dump) {
          message.error(`Please enter valid "Dump site"`)
          exception.push(`1`);
        }
      }
    if (queue_removal_orders.length > 0 && !oldOrder.edited) {
        message.error(`Future removal order already created for selected order.`)
        exception.push(`1`);
    }

    if(oldOrder.futureRemoval) {
        let queue_exchange_orders = ((oldOrder && oldOrder.queue_exchange_orders) ? oldOrder.queue_exchange_orders : [])
        if (queue_exchange_orders.length > 0) {
            let qeo = queue_exchange_orders[queue_exchange_orders.length - 1]
            if(qeo && moment(qeo.deliverydate).format('MM-DD-YYYY') > moment(this.state.pickupdate).format('MM-DD-YYYY')) {
                let pDate = new Date(this.state.pickupdate)
                let odDate = new Date(qeo.deliverydate)
                pDate.setHours(0, 0, 0, 0)
                odDate.setHours(0, 0, 0, 0)
                if (odDate > pDate) {
                  exception.push('1')
                  message.error(`An future exchange has been queued for this order for date ${moment(qeo.deliverydate).format('MM-DD-YYYY')}. Please correct the date for Future removal order as it can not be prior to the date of Future exchange order.`);
                }
            }
        }
    }
    const dumpsite = _.find(_.get(this.props, 'dumps', []), (d) => {
      return String(d.id) === String(dump)
    })
    let pDate = new Date(this.state.pickupdate)
    let odDate = new Date(oldOrder.deliverydate)
    pDate.setHours(0, 0, 0, 0)
    odDate.setHours(0, 0, 0, 0)
    if (pDate < odDate) {
        message.error(`Pickup date should be greater than or equal to ${moment(orderDeliveryDate).format('MM-DD-YYYY')}`);
        exception.push('2');
    }
    
    if(exception.length === 0) {
      oldOrder.pickupdate = moment(pickupdate).format('YYYY-MM-DDTHH:mm:ss')
      console.log(oldOrder.pickupdate)
      oldOrder.isQueueOrder = oldOrder.futureRemoval
      oldOrder.pickupday = pickupday
      // oldOrder.typeofdebris = typeofdebris
      let debrisArr = []
      let otherDebrisArray = []

      if (Array.isArray(_.get(this.state, 'typeofdebris', []))) {
        oldOrder.typeofdebris = typeofdebris
      } else {
        debrisArr.push("Other")
        otherDebrisArray.push(this.state.typeofdebris)
        oldOrder.typeofdebris = debrisArr
        oldOrder.otherDebris = otherDebrisArray
      }
      oldOrder.containerlocation = containerlocation
      oldOrder.parking = parking
      oldOrder.dump = dumpsite
      oldOrder.contactname = contactname
      oldOrder.contactnumber = contactnumber
      oldOrder.specialinstruction = specialinstruction
      oldOrder.updatedat = new Date();
      oldOrder["saveOnly"] = false;
      oldOrder.live_load_yard = live_load_yard
      oldOrder.ordereddate = orderDate
      oldOrder.childId = null
      oldOrder.visible= true
      if (localStorage.getItem('usertype') === 'customer') {
        oldOrder.isApproved = false
      } else {
        oldOrder.isApproved = true
      }
      delete oldOrder.job_details
      delete oldOrder.childIdJobDetails
      delete oldOrder.childIdOrderDetails
      delete oldOrder.queue_exchange_orders
      delete oldOrder.queue_removal_orders
      delete oldOrder.connectedOrders
      delete oldOrder.future_removal
      delete oldOrder.inporgress
      delete oldOrder.childIdJobDetails
      delete oldOrder.childIdJobDetails
      oldOrder.type="Removal"
      try {
        let { value } = await this.props.removalOrder(oldOrder)
        // console.log(oldOrder)
        this.closeModal()
        this.props.fetchOrders()
        if (localStorage.getItem('usertype') === 'customer') {
          this.props.sendNewOrderNotification(value)
        }
        } catch (e) {
          this.closeModal()
          message.error('Error adding removal of this order')
        }
    } else {
      //message.error('Error adding exchange of this order')
    }
    }
  }

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDataForRemoval.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
}

  render() {
    const { isViewModalOpen, isEditModalOpen, err } = this.state
    const { orderDataForRemoval, user } = this.props
    let created = orderDataForRemoval.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderDataForRemoval.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderDataForRemoval.createdat)
    return (
      <div>

        {/* order modal open */}
        <ReactModal
          isOpen={this.props.removalModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
            <div className="react-modal-header d-flex align-items-center">
            <div>
              <h5 className="react-modal-title">{getContainerSize(this.props.containerList, _.get(orderDataForRemoval, 'container', '')) === "1/2 Yard" ? "Action" : (this.props.futureRemoval ? "Future Removal" : "Removal")}</h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span>{_.get(orderDataForRemoval, 'created.name', '') !== '' ? _.get(orderDataForRemoval, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
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
                  <h4 className="single-heading">When do you want the container(s)? </h4>
                  <div className="form-group material-textfield material-textfield-lg fullwidth-wrapper">
                    <DatePicker
                      className="form-control material-textfield-input h-66 pt-0"
                      selected={this.state.pickupdate}
                      onChange={this.handleDateChange.bind(this)}
                      minDate={new Date()}
                    />
                    <label className={this.state.pickupdate ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Pick Up Date <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.pickupdate ? err.pickupdate : ""}</p>
                  </div>
                </div>
              </div>

              {/* <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      value={this.state.pickupday}
                      readOnly
                      required />
                    <label className="material-textfield-label">Pick Up Day </label>
                  </div>
                </div>
              </div> */}

              <div className="row">
                <div className="col-md-12">
                  <div className="modalmap">
                    <MapComponent position={_.get(this.state, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(this.state, 'container', ''))} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="parking"
                      value={this.state.parking}
                      readOnly
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Parking </label>
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">What are we picking up and how much of it?</h4>
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="containerlocation"
                      readOnly
                      value={this.state.containerlocation}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Container Location </label>
                  </div>
                </div>
              </div>



              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="typeofdebris"
                      // value={this.state.typeofdebris}
                      value={Array.isArray(_.get(this.state, 'typeofdebris', [])) ? _.get(this.state, 'typeofdebris', []).join(', ') : _.get(this.state, 'typeofdebris', '')}
                      readOnly
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Type of Debris <span className="text-danger">*</span></label>
                  </div>
                </div>
              </div>



              <div className="row">
                <div className="col-md-12"><h4 className="single-heading">Who’s placing this order?</h4></div>
                <div className="col-md-6">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="contactname"
                      value={this.state.contactname}
                      readOnly
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Contact Name <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.contactname ? err.contactname : ""}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group material-textfield material-textfield-lg">
                    <InputMask
                      guide={false}
                      type="text"
                      keepCharPositions={false}
                      mask={phoneNumberMask}
                      className="form-control material-textfield-input h-66"
                      name="contactnumber"
                      //readOnly
                      value={this.state.contactnumber}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Contact Number (XXX-XXX-XXXX) <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.contactnumber ? err.contactnumber : ""}</p>
                  </div>
                </div>
              </div>

              { localStorage.getItem("usertype") && localStorage.getItem("usertype") === "user" ?
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Internal Details</h4>
                  <div className="form-group material-textfield material-textfield-select">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="hauler"
                      value={this.state.haulercompany}
                      readOnly
                      disabled={true}
                      required />
                    <label className="material-textfield-label">Assigned Hauler <span className="text-danger">*</span> </label>
                  </div>
                </div>
              </div>
              :""}
              { localStorage.getItem("usertype") && localStorage.getItem("usertype") === "user" ?
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-select">
                    <select name="dump" value={this.state.dump} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option defaultValue="">Select Dump</option>
                      {_.get(this.props, "dumps", []).map((dump, i) => {
                        return (
                          <option key={i} value={dump.id}>{dump.companyname}</option>
                        )
                      })
                      }
                    </select>
                    <label className="material-textfield-label">Dump site <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.dumpsite ? err.dumpsite : ""}</p>
                  </div>
                </div>
              </div>
              : "" }
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <textarea
                      type="text"
                      className="form-control material-textfield-input h-150"
                      value={this.state.specialinstruction}
                      name="specialinstruction"
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Special Instructions </label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <textarea
                      type="text"
                      className="form-control material-textfield-input h-150"
                      value={this.state.accessibilitynotes}
                      name="specialinstruction"
                      readOnly
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Accessibility Notes </label>
                  </div>
                </div>
              </div>


              <button onClick={this.sendOrder.bind(this)} className="btn btn-dark btn-lg w-100 font-800" disabled={this.state.disabled}>Send</button>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

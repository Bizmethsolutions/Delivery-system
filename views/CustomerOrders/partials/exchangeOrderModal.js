import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import CurrencyInput from "react-currency-input"

import AddCardModal from './addCardModal'
import AddressAutoComplete from '../../../components/AddressAutoComplete'
import { formatGeoAddressComponents, formatOrderAddess, getFormatedDateAndTimeWithoutUTC,formatNumber,  getDateMMDDYYYHHMM, getTimeInDayAndHours, calculatePriceForExchange, formatPhoneNumber, getDay, getDate, getContainerSize } from '../../../components/commonFormate'
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'
import MapComponent from '../../../components/map'
import config from '../../../config'
import minusIcon from '../../../images/minusIcon.svg'
import plusIcon from '../../../images/plusIcon.svg'
import MultiSelectCheckBox from '../../../components/multiSelectCheckBox';
const { TabPane } = Tabs;
const { Option } = Select;

const timezoneKey = config.timezone_api_key.api_key;
const timezoneApi = config.timezone_api_key.api_url;
const phoneNumberMask = config.phoneNumberMask
const debrisTypes = config.debrisTypes
const debrisTypes20 = config.debrisTypes20
const debrisTypes30 = config.debrisTypes30
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
      dump: "",
      deliveryday: "", deliverydate: "",
      typeofdebris: [], containersize: "",
      parking: '', location: "",
      purchaseorderno: "",
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      permitPrice: 0,
      specialinstruction: "", containerlocation: "", paymenttype: "",
      orderedby: "", orderedbycontact: "",
      additionalEmail: [],
      containerList: [],
      liveOrder: 0,
      half_yrd_qty: 0,
      messageShown: true,
      placement: "",
      otherPlacement: "",
      amount: 120,
      cardId: "select",
      divTag: [],
      otherSelect: true,
      debrisType: debrisTypes,
      live_load_yard: 0,
      half_yrd_qty: 0
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.checkPricing = this.checkPricing.bind(this)
  }

  componentDidMount = async()=> {
    const {orderDataForExchange} = this.props
    const today = new Date()
    this.setState({
      city: _.get(orderDataForExchange, 'city', ''),
      address: _.get(orderDataForExchange, 'address', ''),
      status: _.get(orderDataForExchange, 'status', ''),
      state: _.get(orderDataForExchange, 'state', ''),
      zipcode: _.get(orderDataForExchange, 'zipcode', ''),
      new_address: _.get(orderDataForExchange, 'new_address', ''),
      borough: _.get(orderDataForExchange, 'borough', ''),
      neighborhood: _.get(orderDataForExchange, 'neighborhood', ''),
      street_no: _.get(orderDataForExchange, 'street_no', ''),
      route: _.get(orderDataForExchange, 'route', ''),
      geoPlaceId: _.get(orderDataForExchange, 'geoPlaceId', ''),
      floor: _.get(orderDataForExchange, 'floor', ''),
      contactnumber: _.get(orderDataForExchange, 'contactnumber', ''),
      permit: _.get(orderDataForExchange, 'permit', 'false') ? 'yes' : 'no',
      location: _.get(orderDataForExchange, 'location', ''),
      purchaseorderno: _.get(orderDataForExchange, 'purchaseordernumber', ''),
      timezone: {dstOffset: '', rawOffset: '', timeZoneId: '', timeZoneName: '', clientoffset: today.getTimezoneOffset()},
      consumercost: _.get(orderDataForExchange, 'consumercost', ''),
      // haulercompany: _.get(orderDataForExchange, 'haular.companyname', ''),
      haulercompany: _.get(orderDataForExchange, 'haular.companyname', '') !== '' ? _.get(orderDataForExchange, 'haular.companyname', '') : _.get(orderDataForExchange, 'haular.company_name', ''),
      specialinstruction: _.get(orderDataForExchange, 'specialinstruction', ''),
      containerlocation: _.get(orderDataForExchange, 'containerlocation', ''),
      otherPlacement: _.get(orderDataForExchange, 'otherPlacement', ''),
      placement: _.get(orderDataForExchange, 'placement', ''),
      paymenttype: _.get(orderDataForExchange, 'paymenttype', ''),
      orderedby: _.get(orderDataForExchange, 'orderedby', ''),
      orderedbycontact: _.get(orderDataForExchange, 'orderedbycontact', ''),
      pricingtype: _.get(orderDataForExchange, 'pricingtype', ''),
      additionalEmail: _.get(orderDataForExchange, 'additionalEmail', ''),
      containersize: _.get(orderDataForExchange, 'container', ''),
      contactname:  _.get(orderDataForExchange, 'contactname', ''),
      id: _.get(orderDataForExchange, '_id', ''),
      oldDebris: _.cloneDeep(_.get(orderDataForExchange, 'typeofdebris', '')),
      accessibilitynotes: _.get(orderDataForExchange, 'accessibility', '') === "Other: Manual entry" ? _.get(orderDataForExchange, 'manualaccessibility', '') : _.get(orderDataForExchange, 'accessibility', '') !== "" && _.get(orderDataForExchange, 'accessibility', '') !== "Select" ? _.get(orderDataForExchange, 'accessibility', '') : "N/A" ,
      parking: _.get(orderDataForExchange, 'parking', ''),
      paymenttype: _.get(orderDataForExchange, 'paymenttype', ''),
      orderedby: _.get(orderDataForExchange, 'orderedby', ''),
      half_yrd_qty: _.get(orderDataForExchange, 'half_yrd_qty', ''),
      live_load_yard: _.get(orderDataForExchange, 'live_load_yard', ''),
      haular: _.get(orderDataForExchange, 'haular', ''),
      haularDetail: _.get(orderDataForExchange, 'haular', ''),
      orderid: _.get(orderDataForExchange, 'orderid', ''),
      geoPlaceId: _.get(orderDataForExchange, 'geoPlaceId', ''),
      otherDebris: _.get(orderDataForExchange, 'otherDebris', []),
      cardId: _.get(orderDataForExchange, 'cardId', ''),
      addminis: _.get(orderDataForExchange, 'addminis', ''),
      emptyamount: _.get(orderDataForExchange, 'emptyamount', ''),
      looseyardage: _.get(orderDataForExchange, 'looseyardage', ''),
      removeminis: _.get(orderDataForExchange, 'removeminis', ''),
    })
    
    let divTag = []
    _.get(orderDataForExchange, 'otherDebris', []).map((other)=>{
      divTag.push({ otherDebris: other })
    })
    let typeofdebris = []
    if (Array.isArray(_.get(orderDataForExchange, 'typeofdebris', ''))) {
      typeofdebris= _.get(orderDataForExchange, 'typeofdebris', [])
    } else {
      typeofdebris.push("Other")
      divTag.push({ otherDebris: _.get(orderDataForExchange, 'typeofdebris', '') })
    }
    if (divTag.length !== 0) {
      this.setState({ divTag, otherSelect: false })
    }
    this.setState({ typeofdebris })
    let data = {
      limit: undefined, by: undefined, page: undefined, sort_field: ''
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []) })
    this.checkPricing()
    this.updateCustomer()
    this.updateDebris()
  }

  updateDebris() {
    const containersize = this.getContainerName(this.state.containersize)
    if(containersize === '20 Yard') {
      this.setState({ debrisType: debrisTypes20 })
    } else if(containersize === '30 Yard') {
      this.setState({ debrisType: debrisTypes30 })
    } else {
      this.setState({ debrisType: debrisTypes })
    }
  }

  checkPricing = async() => {
    const {value} = await this.props.checkZip({zipcode: this.state.zipcode})
    if(value && value.type === "success") {
      this.setState({ addressErr: false, county: _.get(value, 'data[0].place', '') }, () => {
        this.updateCalculation()
      })
    }
  }

  updateCustomer = async() => {
    let data = {
      search_string: "",
      //limit: 20,
      by: 1,
      //page: 0,
      sort: ''
    }
    let { value } = await this.props.fetchCustomers(data)
    if (_.get(value, 'customers', []).length > 0) {
      let idx = _.get(value, 'customers', []).findIndex(obj => obj.customerid === this.props.customerId)
      let selectedCustomer =  value.customers[idx]
      this.setState({ selectedCustomer })
    }
    this.updateCalculation()
  }

  updateCalculation() {
    let containerName = getContainerSize(this.props.containerList, this.state.containersize);
    const cal = calculatePriceForExchange(containerName, this.state.typeofdebris)
    var permit = 0
    if(this.state.permit === 'yes') {
      permit = 54.44
    }
    let amount = cal.base
    let taxes = (8.875 * (amount + permit))/100
    let totalamount = amount + taxes
    if(containerName !== 'Live Load') {
      totalamount = totalamount + permit
    } else {
      const p = amount * parseInt(_.get(this.state, 'live_load_yard', 0))
      amount = p
      totalamount = p + 250
      taxes = (8.875 * totalamount)/100
      totalamount = totalamount + taxes
      this.setState({ baseprice : amount,amount: p, taxes: taxes, truckingrate: 250, estimatedprice: p.toFixed(2)})
    }
    if(containerName === '1/2 Yard') {
      const p = amount * parseInt(_.get(this.state, 'half_yrd_qty', 0))
      amount = p
      totalamount = p + 250 + permit
      taxes = (8.875 * totalamount)/100
      totalamount = totalamount + taxes
      this.setState({ baseprice : amount,amount: p, taxes: taxes, estimatedprice: p.toFixed(2)})
    }
    this.setState({ totalamount, taxes, amount, permitPrice : permit })
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
      this.setState({ live_load_yard: e.target.value, half_yrd_qty: 0 }, () => {
        this.updateCalculation()
      })
    } else if (e.target.name === 'half_yrd_qty') {
      this.setState({ live_load_yard: 0, half_yrd_qty: e.target.value }, () => {
        this.updateCalculation()
      })
    } else {
      this.setState({ [e.target.name]: e.target.value }, () => {
        this.updateCalculation()
        this.updateDebris()
      })
    }
  }

  handleDateChange (date) {
    // let day = getDay(date.getDay())
    // this.setState({ deliverydate: date, deliveryday: day })
    if (date) {
      let day = getDay(date.getDay())
      this.setState({ deliverydate: date, deliveryday: day })
    } else {
      this.setState({ deliverydate: '', deliveryday: '' })
    }
  }


  validate() {
    let errObj = {}
    const { state, city, new_address,zipcode, contactname, dump, deliverydate, typeofdebris, haulercompany, contactnumber, consumercost, err, live_load_yard, half_yrd_qty, containersize, containerlocation, otherPlacement, placement } = this.state
    if(contactnumber === "") {
      errObj.contactnumber = "Contact number is required"
    }
    if(consumercost === "") {
      errObj.consumercost = "Total cost is required"
    }
    if(deliverydate === "") {
      errObj.deliverydate = "Delivery date is required"
    }
    const phonelength = contactnumber.replace(/[^0-9]/g,"").length
    if(phonelength !== 10) {
      errObj.contactnumber = "Please enter exactly 10 digit number"
    }
    if(zipcode === "") {
      errObj.zipcode = "Zipcode is required"
    }
    if(new_address === "" || !new_address) {
      errObj.address = "Address is required"
    }
    // if(city === "") {
    //   errObj.city = "City is required"
    // }
    if(state === "") {
      errObj.state = "State is required"
    }
    if(contactname === "") {
      errObj.contactname = "Contact name is required"
    }
    if(containersize === "") {
      errObj.containersize = "Container size is required"
    }
    if(typeofdebris.length === 0) {
      errObj.typeofdebris = "Type of debris is required"
    }
    // if(haulercompany === "") {
    //   errObj.haular = "Hauler is required"
    // }
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

    if(placement === "Other") {
      if (!otherPlacement && otherPlacement === "") {
        errObj.otherPlacement = "Other placement is required"
      }
    }
    if(this.state.selectedCustomer && this.state.selectedCustomer.isHomeCustomer) {
      if(this.state.cardId === "" || this.state.cardId === "select") {
        errObj.cardId = "Card is required"
        this.setState({ errMessage: "Please select a valid card."})
      } else {
        this.setState({ errMessage: ""})
      }
    }

    this.setState({ err: errObj })
  }

  sendOrder=async()=> {
    await this.validate()
    const {err} = this.state
    const oldOrder = this.props.orderDataForExchange
    let containerName = getContainerSize(this.props.containerList, this.state.containersize);
    const isHomeCustomer = _.get(this.state, 'selectedCustomer.isHomeCustomer', false)
    if(Object.keys(err).length === 0) {
      const { cardId, totalamount } = this.state
      const timezoneOfUser = Intl.DateTimeFormat().resolvedOptions().timeZone
      const today = new Date()

      if(isHomeCustomer && !this.props.futureExchange) {
        const { chargeForExchange } = this.props
        const data = {
          cardId,
          amount: totalamount,
          customerId: this.state.selectedCustomer && this.state.selectedCustomer.id,
          orderId: this.props.orderDataForExchange.id,
          couponCode: this.state.couponCode
        }
        if (localStorage.getItem('usertype') === 'customer') {
          this.doExchnage()
        } else {
          const { value } = await chargeForExchange(data)
          if(value && value.type === "success") {
            this.doExchnage()
          } else {
            message.error("Charge was unsuccessfull!")
          }
        }
      } else {
        this.doExchnage()
      }
    }
  }

  doExchnage =  async() => {
    this.setState({ disabled: true })
    const {err} = this.state
    let oldOrder = this.props.orderDataForExchange
    let containerName = getContainerSize(this.props.containerList, this.state.containersize);
    const { city, address, state, zipcode, new_address,
      borough, neighborhood, street_no, route,
      geoPlaceId, floor, contactnumber, contactname, otherPlacement, placement,
      permit, deliveryday, deliverydate, typeofdebris, containersize,
      parking, location, purchaseorderno, timezone,live_load_yard,
      consumercost, haulercompany, specialinstruction, containerlocation, paymenttype,
      orderedby, orderedbycontact, pricingtype, additionalEmail, haularDetail, cardId, totalamount } = this.state
    const timezoneOfUser = Intl.DateTimeFormat().resolvedOptions().timeZone
    const today = new Date()
    let ordereddate = moment().tz(timezoneOfUser).format('MM-DD-YYYY')
        let obj = {
          city, address, state, zipcode, new_address,
          borough, neighborhood, location, street_no, route,
          geoPlaceId, floor, timezone,
          visible: true, parentId: null,
          isQueueOrder: this.props.futureExchange === true ? true: false,
          ordereddate: ordereddate,
          contactnumber: formatPhoneNumber(contactnumber),
          permit, deliveryday, container: containersize,
          parking, purchaseordernumber: purchaseorderno, contactname,
          consumercost: consumercost && consumercost !== "" && consumercost !== undefined? consumercost : '',
          specialinstruction, containerlocation, paymenttype, placement,
          orderedby, orderedbycontact: formatPhoneNumber(orderedbycontact), pricingtype, cardId, "amount": totalamount,
          "chargeAmount": totalamount ? totalamount.toFixed(2) : '',
          "isHomeCustomer": _.get(this.state, 'selectedCustomer.isHomeCustomer', false)
        }
        if (localStorage.getItem('usertype') === 'customer') {
          obj.isApproved = false
        } else {
          obj.isApproved = true
        }
        obj.orderEmail = _.get(oldOrder, 'orderEmail', {})
        obj.contactEmail = _.get(oldOrder, 'contactEmail', {})
        obj.accessibility = _.get(oldOrder, 'accessibility', '')
        obj.manualaccessibility = _.get(oldOrder, 'manualaccessibility', '')
        let exception = []
        obj.type ="Exchange"
        let idx = typeofdebris.indexOf("Other")
        let otherDebris = []
        if (idx !== -1) {
          for(let i=0; i< this.state.divTag.length; i++) {
            if(this.state.divTag[i].otherDebris){
              otherDebris.push(this.state.divTag[i].otherDebris);
            }
          }
        }
        let debrisArr = []
        let otherDebrisArray = []
        if (Array.isArray(_.get(this.state, 'typeofdebris', []))) {
          obj.typeofdebris = typeofdebris
          //oldOrder.typeofdebris = typeofdebris
          //oldOrder.otherDebris = otherDebris
          obj.otherDebris = otherDebris
        } else {
          debrisArr.push("Other")
          obj.typeofdebris = debrisArr
          otherDebrisArray.push(this.state.typeofdebris)
          //oldOrder.typeofdebris = debrisArr
          //oldOrder.otherDebris = otherDebrisArray
          obj.otherDebris = otherDebrisArray
        }
        // obj.otherDebris = otherDebris
        let haular ={}
        let haulerIndex = _.get(this.state, 'haulerList', []).findIndex(x => x.id === _.get(haularDetail, 'id', ''))
        if (haulerIndex !== -1) {
          haular = this.state.haulerList[haulerIndex]
        }
        obj.haular = haular
        if (placement === 'Other') {
          obj.otherPlacement = otherPlacement
        } else {
          obj.otherPlacement = ''
        }
        obj.created = {id: this.props.user && this.props.user._id ? this.props.user._id : "",
          name : this.props.user && this.props.user.username? this.props.user.username : ""}
        //obj.created = {id: "5e6a14befaf8f82ea8bd6ccd", name: "Curbside, Inc"}
        obj.deliverydate = moment(deliverydate).format('YYYY-MM-DDTHH:mm:ss')
        obj.customer = _.get(oldOrder, 'customer', '')
        obj.createdat = moment().toISOString()
        obj.permit = permit === "yes" ? true : false
        obj.live_load_yard = live_load_yard
        obj.status = ""
        oldOrder.status = String(this.state.status)
        if (oldOrder._id) {
          let id = oldOrder._id
          oldOrder.id = id
          obj.parentId = id
          oldOrder = _.omit(oldOrder, '_id')
        }
        if (oldOrder.id) {
          const id = oldOrder.id
          obj.parentId = id
          oldOrder.id = id
        }
        let pendingremoval = ""
        let pendingdelivery = ""
        const self = this
        this.props.statusList.forEach(function (element) {
          if (element.status === "Future Exchange" && self.props.futureExchange) {
            pendingdelivery = element._id;
          } else if(element.status === "In Use") {
            pendingremoval = element._id;
          }
          else if (element.status === "Pending Delivery") {
            pendingdelivery = element._id;
          }
          else if(containerName === "1/2 Yard" && element.status === "Pending Action") {
            pendingdelivery = element._id
          }
        })
        if(containerName === "1/2 Yard") {
          obj.addminis = this.state.addminis
          obj.removeminis = this.state.removeminis
          obj.emptyamount = this.state.emptyamount
          obj.looseyardage = this.state.looseyardage
          obj.half_yrd_qty = oldOrder.half_yrd_qty
        }
        if(!this.props.futureExchange) {
          oldOrder.status = String(pendingremoval);
        }
        obj.status = pendingdelivery
        let orderDeliveryDate = oldOrder.deliverydate
        let queue_removal_orders = ((oldOrder && oldOrder.queue_removal_orders) ? oldOrder.queue_removal_orders : [])
        if (queue_removal_orders.length > 0) {
          if (this.state.messageShown) {
            this.setState({ messageShown: false })
            message.error(`A removal has been queued for this order, please delete the removal order to place any exchange orders.`, () => {
              this.setState({ messageShown: true })
            })
          }
          exception.push('1');
        }
        let dDate = new Date(this.state.deliverydate)
        let odDate = new Date(oldOrder.deliverydate)
        dDate.setHours(0, 0, 0, 0)
        odDate.setHours(0, 0, 0, 0)
        if (dDate < odDate) {
          if (this.state.messageShown) {
            this.setState({ messageShown: false })
            message.error(`Delivery date should be greater than or equal to ${moment(orderDeliveryDate).format('MM-DD-YYYY')}`, () => {
              this.setState({ messageShown: true })
            })
          }
          exception.push('1');
        }
        if(exception.length === 0 ) {
          try {
            const dumpsite = _.find(this.props.dumps, (d) => {
              return String(d.id) === String(this.state.dump)
            })
            let { value } = await this.props.addOrder(obj)
            if (localStorage.getItem('usertype') === 'customer') {
              this.props.sendNewOrderNotification(value)
            }
            oldOrder.pickupdate = moment(deliverydate).format('YYYY-MM-DDTHH:mm:ss')
            oldOrder.dump = dumpsite
            if(containerName === "1/2 Yard") {
              const self = this
              if(parseInt(obj.removeminis) === parseInt(oldOrder.half_yrd_qty)) {
                  this.props.statusList.forEach(function (element) {
                      if(element.status === "Pending Removal" && !self.props.futureExchange) {
                          oldOrder.status = element._id
                      }
                  })
              }
            } else {
                if(!this.props.futureExchange) {
                  this.props.statusList.forEach(function (element) {
                    if(element.status === "Pending Removal") {
                        oldOrder.status = element._id
                    }
                  })
                }
            }
            // if (localStorage.getItem('usertype') === 'customer') {
            //   oldOrder.isApproved = false
            // } else {
            //   obj.isApproved = true
            // }
            oldOrder.isApproved = true
            delete oldOrder.queue_exchange_orders
            delete oldOrder.queue_removal_orders
            delete oldOrder.connectedOrders
            delete oldOrder.futureExchange
            delete oldOrder.inporgress
            delete oldOrder.childIdJobDetails
            delete oldOrder.childIdJobDetails
            try {
              const olddebris = this.state.oldDebris
              oldOrder.typeofdebris = olddebris
              await this.props.exchangeOrder(oldOrder)
              console.log(oldOrder, 'oldOrder')
              // if(oldOrder.permit) {
              //   this.addPermit(oldOrder, value.id) 
              // }
            } catch (e) {
              message.error('Error adding exchange of this order')
            }
            this.closeModal()
            this.props.fetchOrders()
          } catch (e) {
            //this.closeModal()
            // console.log(e, 'e')
            message.error('Error adding exchange of this order')
          }
        }
  }
  addPermit = async(orderDetail, childid) => {
    const { getPermitByOrderId } = this.props
    let id = ''
    if (orderDetail._id) {
      id = orderDetail._id
    } else if (orderDetail.id) {
      id = orderDetail.id
    }
    const data = {
      id
    }
    const {value} = await getPermitByOrderId(data)
    const permit  = _.get(value, 'permit', '')
    if(permit && permit.visible === true) {
      let obj = {
        customerid: _.get(permit, 'customerid', ''),
        orderid: childid,
        permitnumber: _.get(permit, 'permitnumber', ''),
        enddate: _.get(permit, 'enddate', ''),
        startdate: _.get(permit, 'startdate', ''),
        uploadedFile: _.get(permit, 'uploadedFile', ''),
        timezone:  _.get(permit, 'timezone', ''),
        createdat: new Date()
      }
      try {
        let { value } = await this.props.addPermit(obj)
      } catch (e) {
        this.setState({errMessage: _.get(e, 'error.message', '')})
      }
    }
  }

  selectDebrish (type) {
    const typeofdebris = this.state.typeofdebris
    if(typeofdebris.indexOf(type) !== -1) {
      const index = _.findIndex(typeofdebris, function(m) {
        return String(m) === String(type)
      })
      if(index !== -1) {
        typeofdebris.splice(index, 1)
      }
    } else {
      typeofdebris.push(type)
    }
    this.setState({ typeofdebris }, ()=>{
      this.updateCalculation()
      if (typeofdebris.indexOf("Other") !== -1) {
        if (this.state.otherSelect) {
          this.addDivTag()
          this.setState({ otherSelect: false })
        }
      } else {
        this.setState({ divTag: [], otherSelect: true })
      }
    })
    this.forceUpdate()
  }

  addDivTag(){
    this.setState({
      divTag: this.state.divTag.concat([{
        otherDebris: '',
      }])
    })
  }

  additionalDebris(){
    return this.state.divTag.map((object, index)=>(
      <div key={index}>
        <div className="form-group material-textfield material-textfield-lg">
          <input
            type="text"
            className="form-control material-textfield-input h-66"
            value={object.otherDebris}
            onChange={this.handleDivOnChange('otherDebris', index)}
            required />
          <label className="material-textfield-label">Debris {index+1} <span className="text-danger">*</span></label>
        </div>
        {index > 0 ?
        <div className="mb-2">
          <img src={minusIcon} onClick={(event)=> this.removeDivTag(index)} className="remove-field" />
        </div> : "" }
      </div>
    ))
  }
  removeDivTag(idx) {
    this.setState({
      divTag: this.state.divTag.filter((s, sidx) => idx !== sidx)
    }, ()=>{
      this.forceUpdate()
    })
  }

  handleDivOnChange(field, idx){
    let self = this;
    return function(evt) {
      const newDivTag = self.state.divTag.map((divObject, sidx) => {
        // console.log("idx: ", idx, " sidx: ", sidx);
        if (idx !== sidx) return divObject
        if(field === 'otherDebris')
          return { ...divObject, otherDebris: evt.target.value };
      });
      self.setState({ divTag: newDivTag })
    }
  }

  openAddCard() {
    this.setState({ openCard: true })
  }

  closeCardModal() {
    this.setState({ openCard: false }, ()=> {
      this.updateCustomer()
    })
  }

  applyCouponCode = async() => {
    const { couponCode } = this.state
    const { applyCoupon } = this.props
    const obj = {
      couponCode,
      customerId: this.state.selectedCustomer && this.state.selectedCustomer.id
    }
    try {
      this.updateCalculation()
      const { value } = await applyCoupon(obj)
      if(value) {
        var discount = 0
        var totalamount = this.state.totalamount
        if(value && value.data.percent_off !== null) {
          discount = (value.data.percent_off * this.state.totalamount)/100
          totalamount = totalamount - discount
        }
        if(value && value.data.amount_off !== null) {
          discount = value.data.amount_off
          totalamount = totalamount - discount
        }
        this.setState({ discount, totalamount, errMessage: "" })
      }
    } catch (e){
      this.updateCalculation()
      this.setState({ discount: "" , errMessage: _.get(e, 'error.message', 'Invalid Coupon')})
    }
  }

  handleChangeMoney(event, maskedvalue, floatvalue) {
    if (maskedvalue === '0' || maskedvalue === '') {
      this.setState({ [event.target.name]: '' }, () => {
       })
    } else {
      this.setState({ [event.target.name]: maskedvalue }, () => {
      })
    }
  }

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDataForExchange.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
}
getContainerName(containerId) {
  let containerObj = this.props.containerList
  let containerLen = containerObj.length
  for (let i = 0; i < containerLen; i++) {
    if (containerObj[i]._id === containerId)
      return containerObj[i].size
  }
}

getContainerTemplate() {
  let containerName = this.getContainerName(this.state.containersize);
  if (containerName === '1/2 Yard')
    return (

        <div className="form-group material-textfield">
          <input
            type="number"
            name= "half_yrd_qty"
            min='0'
            disabled={true}
            value={this.state.half_yrd_qty}
            onChange={this.onHandleChange.bind(this)}
            className="form-control material-textfield-input h-66"
            required />
          <label className="material-textfield-label">Number of Minis <span className="text-danger">*</span></label>
          <p className="text-danger">{this.state.err && this.state.err.half_yrd_qty ? this.state.err.half_yrd_qty : ""}</p>
        </div>

    )
  else if (containerName === 'Live Load')
    return (

        <div className="form-group material-textfield">
          <input
            type="number"
            name= "live_load_yard"
            min='0'
            value={this.state.live_load_yard}
            onChange={this.onHandleChange.bind(this)}
            className="form-control material-textfield-input h-66"
            required />
          <label className="material-textfield-label">Yardage <span className="text-danger">*</span></label>
          <p className="text-danger">{this.state.err && this.state.err.live_load_yard ? this.state.err.live_load_yard : ""}</p>
        </div>

    )
  else
    return
}

formatNumber(number) {
  const nfObject = new Intl.NumberFormat('en-US');
  const output = nfObject.format(number);
  return output
}

  render() {
    const { isViewModalOpen, isEditModalOpen, err } = this.state
    const { orderDataForExchange, user } = this.props
    const isHomeCustomer = _.get(this.state, 'selectedCustomer.isHomeCustomer', false)
    let containerName = getContainerSize(this.props.containerList, _.get(orderDataForExchange, 'container', ''));
    let created = orderDataForExchange.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderDataForExchange.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderDataForExchange.createdat)
    return (
      <div>

        {/* order modal open */}
        <ReactModal
          isOpen={this.props.exchangeModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
            <div className="react-modal-header d-flex align-items-center">
              <div>
                <h5 className="react-modal-title">{getContainerSize(this.props.containerList, _.get(orderDataForExchange, 'container', '')) === "1/2 Yard" ? (this.props.futureExchange ? "Future Action" : "Action") : (this.props.futureExchange ? "Future Exchange" : "Exchange")}</h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span> {_.get(orderDataForExchange, 'created.name', '') !== '' ? _.get(orderDataForExchange, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
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
                      className="form-control material-textfield-input h-66"
                      selected={this.state.deliverydate}
                      onChange={this.handleDateChange.bind(this)}
                      minDate={new Date()}
                    />
                    <label className={this.state.deliverydate ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Date <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.deliverydate ? err.deliverydate : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      defaultValue={this.state.deliveryday}
                      readOnly
                      required />
                    <label className="material-textfield-label">Delivery Day </label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Where do you want the container(s)?</h4>
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="purchaseorderno"
                      value={this.state.purchaseorderno}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Purchase Order No. </label>
                  </div>
                </div>
              </div>

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
                  <div className="form-group material-textfield material-textfield-select">
                    <select name="containersize" value={this.state.containersize} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option>Select Container Size</option>
                      {_.get(this.props, 'containerList', []).map((container, i) => {
                        return (
                          <option key={i} value={container._id}>{container.size}</option>
                        )
                      })
                      }
                    </select>
                    <label className="material-textfield-label">Container Size <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.containersize ? err.containersize : ""}</p>
                  </div>
                  {this.getContainerTemplate()}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">

                  {containerName === "1/2 Yard" &&
                    <div>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="number"
                          min="0"
                          className="form-control material-textfield-input h-66"
                          name="looseyardage"
                          value={this.state.looseyardage}
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Loose Yardage </label>
                        <p className="text-danger">{err && err.looseyardage ? err.looseyardage : ""}</p>
                      </div>
                    </div>}
                  {containerName === "1/2 Yard" &&
                    <div>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="number"
                          min="0"
                          className="form-control material-textfield-input h-66"
                          name="removeminis"
                          value={this.state.removeminis}
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Remove Minis </label>
                        <p className="text-danger">{err && err.removeminis ? err.removeminis : ""}</p>
                      </div>
                    </div>}
                    {containerName === "1/2 Yard" &&
                    <div>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="number"
                          min="0"
                          className="form-control material-textfield-input h-66"
                          name="emptyamount"
                          value={this.state.emptyamount}
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Empty Amount </label>
                        <p className="text-danger">{err && err.emptyamount ? err.emptyamount : ""}</p>
                      </div>
                    </div>}
                  {containerName === "1/2 Yard" &&
                    <div>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="number"
                          min="0"
                          className="form-control material-textfield-input h-66"
                          name="addminis"
                          value={this.state.addminis}
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Add Minis </label>
                        <p className="text-danger">{err && err.addminis ? err.addminis : ""}</p>
                      </div>
                    </div>}
                    <div>
                    <div className="form-group material-textfield material-textfield-lg">
                      <select
                        name="placement"
                        value={this.state.placement}
                        onChange={this.onHandleChange.bind(this)}
                        className="form-control custom-select h-66 w-100 font-16 material-textfield-input"
                        required>
                          <option value="">Select Placement</option>
                          <option value="On Street">On Street</option>
                          <option value="In Lot/Yard">In Lot/Yard</option>
                          <option value="Inside Building">Inside Building</option>
                          <option value="In Driveway">In Driveway</option>
                          <option value="Other">Other</option>
                      </select>
                      <label className="material-textfield-label">Placement </label>
                    </div>

                    {this.state.placement === 'Other' ?
                      <div className="form-group material-textfield material-textfield-select">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="otherPlacement"
                          value={this.state.otherPlacement}
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Other Placement <span className="text-danger">*</span> </label>
                        <p className="text-danger">{err && err.otherPlacement ? err.otherPlacement : ""}</p>
                      </div>
                      :
                      ""
                    }
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="containerlocation"
                          value={this.state.containerlocation}
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Container Location</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-md-12 change-debris">
                  <div className="row">
                    <div className="col-md-12 mb-2">
                      <h4 className="single-heading-sm">Type of Debris <span className="text-danger">*</span></h4>
                    </div>
                    <div className="col-md-12">
                      <ul className="checkboxlists">
                        {this.state.debrisType.length !== 0 && this.state.debrisType.map((type, index) => {
                          return (
                            <li key={index} onClick={this.selectDebrish.bind(this, type)}>
                              <div className="form-group">
                                <input readOnly type="checkbox" checked={this.state.typeofdebris.indexOf(type) !== -1 ? true : false} />
                                <label>{type}</label>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                      <p className="text-danger">{err && err.typeofdebris ? err.typeofdebris : ""}</p>
                    </div>
                  </div>
                  {this.state.typeofdebris.indexOf("Other") !== -1 ?
                  <div className="row">
                    <div className="col-md-12">
                      <h4 className="single-heading-sm">Other Debris </h4>
                        {this.additionalDebris()}
                    </div>
                    <img src={plusIcon} onClick={(event) => this.addDivTag()} className="remove-field mb-2" />
                  </div> : ""}
                  {/* <div>
                    <div className="form-group material-textfield material-textfield-lg btn-multiselect">
                      <MultiSelectCheckBox
                        placeholder="Type of Debris"
                        onChange={this.selectDebrish.bind(this)}
                        customValue={this.state.typeofdebris}
                      />
                      <p className="text-danger">{err && err.typeofdebris ? err.typeofdebris : ""}</p>
                    </div>
                    {this.state.typeofdebris.indexOf("Other") !== -1 ?
                      <div>
                        {this.additionalDebris()}
                        <img src={plusIcon} onClick={(event) => this.addDivTag()} className="remove-field" />
                      </div>
                      :
                      ''}
                  </div> */}

                </div>
              </div>


              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Who’s placing this order?</h4>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="contactname"
                      value={this.state.contactname}
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
                      value={this.state.contactnumber}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Contact Number (XXX-XXX-XXXX) <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.contactnumber ? err.contactnumber : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="orderedby"
                      value={this.state.orderedby}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Ordered By </label>
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
                      name="orderedbycontact"
                      value={this.state.orderedbycontact}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Ordered By Contact (XXX-XXX-XXXX) </label>
                  </div>
                </div>
              </div>

              {/* <div className="row">

              </div> */}

              { localStorage.getItem("usertype") && localStorage.getItem("usertype") === "user" ?
               <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Payment Information?</h4>
                  <div className="form-group material-textfield material-textfield-select">
                    <select
                      className="form-control custom-select h-66 w-100 font-16 material-textfield-input"
                      name="paymenttype"
                      value={this.state.paymenttype}
                      onChange={this.onHandleChange.bind(this)}
                      required>
                      <option defaultValue="">Select Payment Type</option>
                      <option value="Active Account">Active Account</option>
                      <option value="Check">Check</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                    <label className="material-textfield-label">Payment Type </label>
                  </div>
                </div>
              </div> : "" }
              { localStorage.getItem("usertype") && localStorage.getItem("usertype") === "user" ?
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-select">
                    <select name="pricingtype" value={this.state.pricingtype} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option defaultValue="">Select Pricing Type</option>
                      <option value="Matrix">Matrix</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                    <label className="material-textfield-label">Pricing Type </label>
                  </div>
                </div>
              </div>
              : ""}
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
                      disabled={true}
                      required />
                    <label className="material-textfield-label">Assigned Hauler <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.haular ? err.haular : ""}</p>
                  </div>
                </div>
              </div>
                : ""}
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
                :"" }
              { localStorage.getItem("usertype") && localStorage.getItem("usertype") === "user" ?
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg dollarsign">
                    <CurrencyInput
                      precision={0}
                      className="form-control material-textfield-input h-66"
                      placeholder=''
                      name="consumercost"
                      value={this.state.consumercost}
                      onChangeEvent={this.handleChangeMoney.bind(this)}
                      required
                    />
                    <label className="material-textfield-label address-focus-label">Total Price <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.consumercost ? err.consumercost : ""}</p>
                  </div>
                </div>
              </div>
                : ""}

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







              <div className="row">
                <div className="col-md-12">

                  {!this.props.futureExchange && isHomeCustomer ?
                    <div>
                    <div className="totalpayment">
                      <h4>Price Breakdown</h4>
                      <p>Base <span>{this.state.amount !== '' ? `$${this.formatNumber(this.state.amount)}` : ''}</span></p>
                      {getContainerSize(this.props.containerList, this.state.containersize) !== "Live Load" ? <p> Permit <span>{this.state.permitPrice !== '' ? `$${this.formatNumber(this.state.permitPrice)}` : '' }</span></p>: ""}
                      {getContainerSize(this.props.containerList, this.state.containersize) === "1/2 Yard" ? <p> Delivery Fee <span>$250</span></p> : "" }
                      {this.state.discount && this.state.discount !== "" && <p>Discount <span>${this.formatNumber(this.state.discount.toFixed(2))}</span></p>}
                      <p>Taxes <span>{this.state.taxes !== '' ? `$${this.formatNumber(this.state.taxes)}` : ''}</span></p>
                      <p>Total <span>{this.state.totalamount !== "" &&this.state.totalamount && this.state.totalamount.toFixed(2) ? `$${this.formatNumber(this.state.totalamount.toFixed(2))}` : "" }</span></p>
                    </div>
                      <div className="mt-3">
                      {_.get(this.state.selectedCustomer, 'payment_info', []).length !== 0 ?
                        <div className="form-group material-textfield material-textfield-select mb-0">
                          <select className="form-control custom-select h-66 w-100 font-16 material-textfield-input" onChange={this.onHandleChange.bind(this)} name="cardId" value={this.state.cardId} required>
                            <option value="select">
                              Select
                            </option>
                            {_.get(this.state.selectedCustomer, 'payment_info', []).map((payment, i) => {
                              return (
                                <option key={i} value={_.get(payment.stripe, 'card.id', '')}>
                                {_.get(payment.stripe, 'card.brand', '')}****{_.get(payment.stripe, 'card.last4', '')}
                                </option>
                              )
                            })
                            }
                          </select>
                          <label className="material-textfield-label">Card on file </label>
                          <p className="text-danger">{err && err.consumercost ? err.consumercost : ""}</p>
                        </div> : "" }
                      </div>
                      <div>
                        <button className=" btn-new-card" onClick={this.openAddCard.bind(this)}>Add a New Card </button>
                      </div>
                      <div className="d-flex">
                        <div className="form-group material-textfield material-textfield-lg w-100">
                          <input
                            type="text"
                            className="form-control material-textfield-input h-66 border-radi-input"
                            name="couponCode"
                            value={this.state.couponCode}
                            onChange={this.onHandleChange.bind(this)}
                            required />
                          <label className="material-textfield-label">Coupon Code </label>
                        </div>
                        <button className="btn btn-dark btn-md w-180 font-600 h-66 border-radi-btn" onClick={this.applyCouponCode.bind(this)}>Apply</button>
                      </div>
                    </div> : ""}
                </div>
              </div>
              <p className="text-danger">{this.state.errMessage}</p>
              <button onClick={this.sendOrder.bind(this)} className="btn btn-dark btn-lg w-100 font-800" disabled={this.state.disabled}>Send</button>
            </div>
          </div>
        </ReactModal>
        <AddCardModal
          openCardModal = {this.state.openCard}
          closeCardModal ={this.closeCardModal.bind(this)}
          customerid = {_.get(this.props.orderDataForExchange, 'customer', '')}
          {...this.props}
        />
      </div>
    )
  }
}

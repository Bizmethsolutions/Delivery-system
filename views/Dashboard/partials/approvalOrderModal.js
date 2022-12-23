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
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'
import gtag, { install } from 'ga-gtag';

import AddCardModal from '../../CustomerOrders/partials/addCardModal'
import AddressAutoComplete from '../../../components/AddressAutoComplete'
import ErrorModal from '../../../components/errorModal'
import MapComponent from '../../../components/map'
import plusIcon from '../../../images/plusIcon.svg'
import minusIcon from '../../../images/minusIcon.svg'
import { formatGeoAddressComponents, formatOrderAddess, getAddress, getAllowedTons, calculatePriceForExchange, formatPhoneNumber, formatNumber, getTimeInDayAndHours, getDateMMDDYYYHHMM, getDay, getDate, getContainerSize, getFormatedDateAndTimeWithoutUTC } from '../../../components/commonFormate'
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'
import config from '../../../config'
import NewContactModal from '../../../components/newContactModal'

const { TabPane } = Tabs;
const { Option } = Select;

const timezoneKey = config.timezone_api_key.api_key;
const timezoneApi = config.timezone_api_key.api_url;
const phoneNumberMask = config.phoneNumberMask
const debrisTypes = config.debrisTypes
const debrisTypes20 = config.debrisTypes20
const debrisTypes30 = config.debrisTypes30
const heavyMaterials = config.heavyMaterials
install('UA-116870437-1');

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
      deliveryday: "", deliverydate: "",
      typeofdebris: [], containersize: "",
      parking: '', location: "",
      purchaseorderno: "",
      parentId: "",
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      specialinstruction: "", containerlocation: "", paymenttype: "",
      orderedby: "", orderedbycontact: "",
      additionalEmail: [],
      containerList: [],
      liveOrder: 0,
      half_yrd_qty: 0,
      debrisType: debrisTypes,
      timezone: {},
      rejectModelIsOpen : false,
      divTag: [],
      otherSelect: true,
      sort: "deliverydate",
      search_string: '',
      by: -1,
      page: 0,
      limit: 20,
      type: 'live',
      dump: "",
      damps: '',
      placement: "",
      otherPlacement: "",
      email: "",
      contactemail: "",
      newContactModalIsOpen: false,
      cardId: '',
      errModal: false,
      addressErr: false,
      live_load_yard: 0,
      half_yrd_qty: 0,
      addminis: '',
      looseyardage: '',
      removeminis: '',
      emptyamount: ''
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
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

  componentDidMount = async()=> {
    const {orderDataForEdit} = this.props
    const { limit, by, page, sort_field, search_string, type } = this.state
    let deliverydateCal =  _.get(orderDataForEdit, 'deliverydate', '') !== '' ? (new Date(getDate(_.get(orderDataForEdit, 'deliverydate', '')))) : new Date()
    let pickupdateCal = _.get(orderDataForEdit, 'pickupdate', '') !== '' ? (new Date(getDate(_.get(orderDataForEdit, 'pickupdate', '')))) : new Date()
    let dumpdata = {
      limit, by, page, sort_field, search_string, type: 'd'
    }
    let  dumpval  = await this.props.getDumps(dumpdata)
    this.setState({ dumps: _.get(dumpval, 'value.dumps', []) })
    let zipPricing = await this.props.getZipPricing()
    this.setState({
      city: _.get(orderDataForEdit, 'city', ''),
      address: _.get(orderDataForEdit, 'address', ''),
      state: _.get(orderDataForEdit, 'state', ''),
      zipcode: _.get(orderDataForEdit, 'zipcode', ''),
      new_address: _.get(orderDataForEdit, 'new_address', ''),
      borough: _.get(orderDataForEdit, 'borough', ''),
      neighborhood: _.get(orderDataForEdit, 'neighborhood', ''),
      street_no: _.get(orderDataForEdit, 'street_no', ''),
      route: _.get(orderDataForEdit, 'route', ''),
      geoPlaceId: _.get(orderDataForEdit, 'geoPlaceId', ''),
      floor: _.get(orderDataForEdit, 'floor', ''),
      contactnumber: _.get(orderDataForEdit, 'contactnumber', ''),
      // permit: _.get(orderDataForEdit, 'permit', false) ? 'yes' : 'no',
      permit: _.get(orderDataForEdit, 'permit', 'false') ? 'yes' : 'no',
      location: _.get(orderDataForEdit, 'location', ''),
      purchaseorderno: _.get(orderDataForEdit, 'purchaseordernumber', ''),
      timezone: _.get(orderDataForEdit, 'timezone', {}),
      consumercost: _.get(orderDataForEdit, 'consumercost', ''),
      haulercompany: _.get(orderDataForEdit, 'haular.id', ''),
      specialinstruction: _.get(orderDataForEdit, 'specialinstruction', ''),
      containerlocation: _.get(orderDataForEdit, 'containerlocation', ''),
      otherPlacement: _.get(orderDataForEdit, 'otherPlacement', ''),
      placement: _.get(orderDataForEdit, 'placement', ''),
      paymenttype: _.get(orderDataForEdit, 'paymenttype', ''),
      orderedby: _.get(orderDataForEdit, 'orderedby', ''),
      orderedbycontact: _.get(orderDataForEdit, 'orderedbycontact', ''),
      pricingtype: _.get(orderDataForEdit, 'pricingtype', ''),
      additionalEmail: _.get(orderDataForEdit, 'additional_email', []),
      containersize: _.get(orderDataForEdit, 'container', ''),
      container: _.get(orderDataForEdit, 'container', ''),
      // typeofdebris: _.get(orderDataForEdit, 'typeofdebris', ''),
      parking: _.get(orderDataForEdit, 'parking', ''),
      // paymenttype: _.get(orderDataForEdit, 'paymenttype', ''),
      deliveryday: _.get(orderDataForEdit, 'deliveryday', ''),
      orderedby: _.get(orderDataForEdit, 'orderedby', ''),
      half_yrd_qty: _.get(orderDataForEdit, 'half_yrd_qty', ''),
      haular: _.get(orderDataForEdit, 'haular', ''),
      orderid: _.get(orderDataForEdit, 'orderid', ''),
      geoPlaceId: _.get(orderDataForEdit, 'geoPlaceId', ''),
      parentId: _.get(orderDataForEdit, 'parentId', ''),
      contactname: _.get(orderDataForEdit, 'contactname', ''),
      email: _.get(orderDataForEdit, 'orderEmail.id', ''),
      contactemail: _.get(orderDataForEdit, 'contactEmail.id', ''),
      //totalamount: parseFloat(_.get(orderDataForEdit, 'chargeAmount', '')),
      cardId: _.get(orderDataForEdit, 'cardId', ''),
      discount: _.get(orderDataForEdit, 'couponAmount', ''),
      discountPercentage: _.get(orderDataForEdit, 'discountPercentage', ''),
      // purchaseorderno: _.get(orderDataForEdit, 'purchaseorderno', ''),
      live_load_yard: _.get(orderDataForEdit, 'live_load_yard', ''),
      emptyamount:  _.get(orderDataForEdit, 'emptyamount', ''),
      looseyardage:  _.get(orderDataForEdit, 'looseyardage', ''),
      addminis:  _.get(orderDataForEdit, 'addminis', ''),
      removeminis:  _.get(orderDataForEdit, 'removeminis', ''),
      totalamount: parseFloat(_.get(orderDataForEdit, 'chargeAmount', '')),
      cardId: _.get(orderDataForEdit, 'cardId', ''),
      deliverydate: deliverydateCal,
      pickupdate: pickupdateCal,
      pickupday: pickupdateCal !== "" ? getDay(pickupdateCal.getDay()) : "",
      deliveryday:  getDay(deliverydateCal.getDay()),
      zipPricing: _.get(zipPricing, 'value.data', [])
    })

    let typeofdebris = []
    let divTag = []

    _.get(orderDataForEdit, 'otherDebris', []).map((other)=>{
      divTag.push({ otherDebris: other })
    })

    if (Array.isArray(_.get(orderDataForEdit, 'typeofdebris', ''))) {
      typeofdebris= _.get(orderDataForEdit, 'typeofdebris', [])
    } else {
      typeofdebris.push("Other")
      divTag.push({ otherDebris: _.get(orderDataForEdit, 'typeofdebris', '') })
    }
    if (divTag.length !== 0) {
      this.setState({ divTag, otherSelect: false })
    }
    const { selectedCustomer } = this.props
    this.setState({
      typeofdebris,
      // addEmail: _.get(selectedCustomer, 'additionalemail', []),
      // addName: _.get(selectedCustomer, 'additionalname', []),
    })
    let datau = { user : {
        id: localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype")
      }
    }
    this.updateCustomer()
    this.props.getUser(datau)

    let data = {
      limit: undefined, by: undefined, page: undefined, sort_field: ''
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []) })
    this.fetchCustomersForList()
    this.updateDebris()
    this.updateCalculation()
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

  onAddressSelect = async(suggest) => {
    this.suggestedAddress = suggest
    if (suggest) {
      let geoDetails = formatGeoAddressComponents(suggest.gmaps, suggest.description)
      const zip = geoDetails.zipcode
      try {
        const {value} = await this.props.checkZip({zip})
        if(value && value.type === "success") {
          geoDetails.lat = suggest.location.lat
          geoDetails.lng = suggest.location.lng
          geoDetails.geoPlaceId = suggest.gmaps.place_id
          if (geoDetails.address === "") {
            geoDetails.address = suggest.gmaps.formatted_address
          }
          this.setAddressState(geoDetails, suggest.description)
          this.setState({ addressErr: false })
        }
      } catch(e) {
        this.setState({ errModal: true, addressErr: true })
      }
    }
  }

  closeErrModal() {
    this.setState({ errModal: false })
  }

  setAddressState(geoDetails, description) {
    this.setState({
      street_no: geoDetails.streetNo,
      floor: geoDetails.floor,
      route: geoDetails.route,
      new_address: geoDetails.address,
      address: description,
      location: {
          lat: geoDetails.lat,
          lng: geoDetails.lng
      },
      neighborhood: geoDetails.neighborhood,
      state: geoDetails.state,
      city: geoDetails.city,
      latitute: geoDetails.lat,
      longitude: geoDetails.lng,
      borough: geoDetails.borough,
      zipcode: geoDetails.zipcode ? geoDetails.zipcode : "",
      geoPlaceId: geoDetails.geoPlaceId
    })
    this.getTimezone()
  }
  getTimezone(){
    const { location } = this.state
    let timestamp = moment().unix() //1458000000
    let obj={}
    if(location){
      fetch(`${timezoneApi}?location=${location.lat},${location.lng}&timestamp=${timestamp}&key=${timezoneKey}`,
      {
          method:'GET',
      }
      ).then((res) => res.json()

      ).then(function(data){
          obj.dstOffset= (data.dstOffset / 60)
          obj.rawOffset= (data.rawOffset / 60)
          obj.timeZoneId= data.timeZoneId
          obj.timeZoneName= data.timeZoneName
          const date = new Date().getTimezoneOffset()
          obj.clientoffset = date
          obj.clienttimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      })
      .catch(err => console.log(err))
    }
    this.setState({timezone: obj})
  }


  onChangeAddressField (value) {
    this.setState({ onAddressInputvalue: value },()=>{
      if (this.state.onAddressInputvalue ===""){
        this.setState({ new_address: ''})
      }
    })
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
        this.updateDebris()
        this.updateCalculation()
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

  handleDateChangePickup (date) {
    // let day = getDay(date.getDay())
    // this.setState({ deliverydate: date, deliveryday: day })
    if (date) {
      let day = getDay(date.getDay())
      this.setState({ pickupdate: date, pickupday: day })
    } else {
      this.setState({ pickupdate: '', pickupday: '' })
    }
  }

  resetState(){
    this.state = {
      street_no: "", floor: "", route: "", new_address: "",
      address: "", state: "", geoPlaceId: "", city: "",
      neighborhood: "", borough: "", zipcode: "",
      deliveryday: "", deliverydate: "",
      typeofdebris: "", containersize: "",
      parking: '', location: "",
      purchaseorderno: "", permit: false,
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      specialinstruction: "", containerlocation: "", paymenttype: "",
      orderedby: "", orderedbycontact: "",
      half_yrd_qty: '',
      live_load_yard: '',
      selectedOption: '',
      timezone: {}, err: {},
      additionalEmail: [],
      placement: '', otherPlacement: ""
    }
  }

  validate() {
    let errObj = {}
    const {pricingtype, paymenttype, email, contactemail,dump, state, city, new_address,zipcode, contactname, haulercompany, typeofdebris, deliverydate, contactnumber, consumercost, err, live_load_yard, half_yrd_qty, containersize, orderedby, orderedbycontact, otherPlacement, placement } = this.state
    // if(contactnumber === "") {
    //   errObj.contactnumber = "Contact number is required"
    // }
    if(email === "") {
      errObj.email = "Contact is required"
    }
    if(contactemail === "") {
      errObj.contactemail = "Contact email is required"
    }
    if(!consumercost || consumercost === "" || consumercost == 0 || consumercost == '0') {
      errObj.consumercost = "Total price is required"
    }
    if(deliverydate === "") {
      errObj.deliverydate = "Delivery date is required"
    }

    if (this.props.getStatus(_.get(this.props.orderDataForEdit, 'status', '')) && this.props.getStatus(_.get(this.props.orderDataForEdit, 'status', '')) === "Pending Removal") {
      if(dump === undefined || dump === "") {
        errObj.dumpsite = "Dump site is required"
      }
    }

    // const phonelength = contactnumber.replace(/[^0-9]/g,"").length
    // if(phonelength !== 10) {
    //   errObj.contactnumber = "Please enter exactly 10 digit number"
    // }
    if(zipcode === "") {
      errObj.zipcode = "Zipcode is required"
    }
    if(new_address === "" || !new_address) {
      errObj.address = "Address is required"
    }
    if(city === "") {
      errObj.city = "City is required"
    }
    if(state === "") {
      errObj.state = "State is required"
    }
    // if(contactname === "") {
    //   errObj.contactname = "Contact name is required"
    // }
    if(containersize === "") {
      errObj.containersize = "Container size is required"
    }
    // if(orderedby === "") {
    //   errObj.orderedby = "Full name is required"
    // }
    // if(orderedbycontact === "") {
    //   errObj.orderedbycontact = "Phone number is required"
    // }
    // if (orderedbycontact) {
    //   const phonelength = orderedbycontact.replace(/[^0-9]/g,"").length
    //   if(phonelength !== 10) {
    //     errObj.orderedbycontact = "Please enter exactly 10 digit number"
    //   }
    // }
    if(typeofdebris.length === 0) {
      errObj.typeofdebris = "Type of debris is required"
    }
    if(haulercompany === "") {
      errObj.haular = "Hauler is required"
    }
    if(pricingtype === "") {
      errObj.pricingtype = "Pricing type is required"
    }
    if(paymenttype === "") {
      errObj.paymenttype = "Payment type is required"
    }


    let containerName = this.getContainerName(this.state.containersize);
    if(containerName === "Live Load") {
      if (!live_load_yard || live_load_yard === 0 || live_load_yard === "0" ) {
        errObj.live_load_yard = "Yardage is required"
      }
    } else if(containerName === "1/2 Yard") {
      if (!half_yrd_qty || half_yrd_qty == 0 || half_yrd_qty == "0") {
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
        errObj.card = "Card is required"
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
    const { orderDataForEdit } = this.props
    let orderData = orderDataForEdit
    let containerName = this.getContainerName(this.state.containersize);
    if(Object.keys(err).length === 0) {
      const { city, address, state, zipcode, new_address,
        borough, neighborhood, street_no, route,
        geoPlaceId, floor, cardId,
        permit, deliveryday, deliverydate, typeofdebris, containersize,
        parking, location, purchaseorderno, timezone,half_yrd_qty,
        pickupdate, pickupday,
        consumercost, haulercompany, specialinstruction, containerlocation, paymenttype,live_load_yard,
        pricingtype, additionalEmail, placement, otherPlacement, email, contactemail  } = this.state
      const timezoneOfUser = Intl.DateTimeFormat().resolvedOptions().timeZone
      let ordereddate = moment().tz(timezoneOfUser).format('MM-DD-YYYY')
      const date = new Date().getTimezoneOffset()
      timezone.clientoffset = date
      timezone.clienttimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const customerSelectedEmail = _.find(this.state.customersList, (c) => {
        return String(c.id) === String(email)
      })
      const customerSelectedContactEmail = _.find(this.state.customersList, (c) => {
        return String(c.id) === String(contactemail)
      })
      let orderedby = ""
      let orderedbycontact = ""
      let contactname = ""
      let contactnumber = ""
      let orderEmail = {}
      let contactEmail = {}
      if(customerSelectedEmail) {
        orderedby = customerSelectedEmail.firstname + " " + customerSelectedEmail.lastname
        orderedbycontact = customerSelectedEmail.phone
        orderEmail = {id: customerSelectedEmail.id, email: customerSelectedEmail.email}
      }
      if(customerSelectedContactEmail) {
        contactname = customerSelectedContactEmail.firstname + " " + customerSelectedContactEmail.lastname
        contactnumber = customerSelectedContactEmail.phone
        contactEmail ={id: customerSelectedContactEmail.id, email: customerSelectedContactEmail.email}
      }
      orderData.city = city
      orderData.address = address
      orderData.state = state
      orderData.orderEmail =  orderEmail
      orderData.contactEmail = contactEmail
      orderData.zipcode = zipcode
      orderData.new_address = new_address
      orderData.borough = borough
      orderData.location = location
      orderData.neighborhood = neighborhood
      orderData.street_no = street_no
      orderData.route = route
      orderData.geoPlaceId = geoPlaceId
      orderData.floor = floor
      //orderData.timezone = timezone
      orderData.ordereddate = ordereddate
      orderData.contactnumber = formatPhoneNumber(contactnumber)
      orderData.permit = permit === "yes" ? true : false
      orderData.deliveryday = deliveryday
      orderData.typeofdebris = typeofdebris
      orderData.container = containersize
      orderData.parking = parking
      orderData.purchaseordernumber = purchaseorderno
      orderData.contactname = contactname
      orderData.consumercost = this.state.totalamount.toFixed(2)
      orderData.specialinstruction = specialinstruction
      orderData.containerlocation = containerlocation
      orderData.placement = placement
      orderData.paymenttype = paymenttype
      orderData.orderedby = orderedby
      orderData.orderedbycontact = formatPhoneNumber(orderedbycontact)
      orderData.pricingtype = pricingtype
      orderData.live_load_yard = live_load_yard
      // orderData.half_yrd_qty = half_yrd_qty
      const id = orderData._id
      orderData.id = id
      orderData = _.omit(orderData, '_id')
      orderData.sendEmail = true
      orderData.cardId = cardId
      if(_.get(orderDataForEdit, 'type', '') == "Removal") {
      orderData.pickupdate = pickupdate
      orderData.pickupday = pickupday
      }
      orderData.chargeAmount = parseFloat(this.state.totalamount.toFixed(2))
      orderData.totalamount = this.state.totalamount      // let obj = {
      //   city, address, state, zipcode, new_address,
      //   borough, neighborhood, location, street_no, route,
      //   geoPlaceId, floor, timezone,
      //   contactnumber: formatPhoneNumber(contactnumber),
      //   permit, deliveryday, typeofdebris, containersize,
      //   parking, purchaseorderno, contactname,
      //   consumercost,specialinstruction, containerlocation, paymenttype,
      //   orderedby, orderedbycontact: formatPhoneNumber(orderedbycontact), pricingtype
      // }
      let idx = typeofdebris && typeofdebris.indexOf("Other")
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
        orderData.typeofdebris = typeofdebris
        orderData.otherDebris = otherDebris
      } else {
        debrisArr.push("Other")
        orderData.typeofdebris = debrisArr
        otherDebrisArray.push(this.state.typeofdebris)
        orderData.otherDebris = otherDebrisArray
      }
      let haular ={}
      let haulerIndex = _.get(this.state, 'haulerList', []).findIndex(x => x.id ===haulercompany)
      if (haulerIndex !== -1) {
        haular = this.state.haulerList[haulerIndex]
      }
      if (placement === 'Other') {
        orderData.otherPlacement = otherPlacement
      } else {
        orderData.otherPlacement = ''
      }

      if(containerName === "1/2 Yard" && _.get(orderDataForEdit, 'type', '') == "Exchange" ) {
        orderData.addminis = this.state.addminis
        orderData.removeminis = this.state.removeminis
        orderData.emptyamount = this.state.emptyamount
        orderData.looseyardage = this.state.looseyardage
        orderData.half_yrd_qty = half_yrd_qty
      }
      orderData.additional_email = []
      _.get(this.state, 'additionalEmail',[]).map((email)=>{
        let index = _.get(this.state, 'customersList', []).findIndex(x => x.email === email || x.id === email);
        if(index !== -1) {
          orderData.additional_email.push(this.state.customersList[index].id)
        }
      })
      orderData.haular = haular
      orderData.isApproved = true

      orderData.created = {id: this.props.user && this.props.user._id ? this.props.user._id : "",
        name : this.props.user && this.props.user.username? this.props.user.username : ""}
        orderData.deliverydate = moment(deliverydate).format('YYYY-MM-DDTHH:mm:ss')
        //orderData.createdat =new Date()

      if (this.props.getStatus(_.get(this.props.orderDataForEdit, 'status', '')) && this.props.getStatus(_.get(this.props.orderDataForEdit, 'status', '')) === "Pending Removal") {
        const dumpsite = _.find(_.get(this.state, 'dumps', []), (d) => {
          return String(d.id) === String(this.state.dump)
        })
        orderData.dump = dumpsite
      }
      if(parseFloat(this.state.totalamount) > 0 && this.state.cardId) {
        const valueCard = _.filter(_.get(this.state.selectedCustomer, 'payment_info', []), pay => {
          return _.get(pay, 'stripe.card.id', '') === this.state.cardId
        })
        const userName = `${_.get(this.props, 'user.firstname', '')} ${_.get(this.props, 'user.lastname', '')}`
        const stringCard = `${userName} accepted order ${orderData.orderid} and a $${(this.state.totalamount).toLocaleString()} payment was processed on the ${_.get(valueCard, '[0].stripe.card.brand', '')} ending in ${_.get(valueCard, '[0].stripe.card.last4', '')}.`
        orderData.isPayment = true
        orderData.activityString = stringCard
      }
      try {
        // console.log(orderData)
        this.setState({addressErr: true})
        let { value } = await this.props.updateOrder(orderData)
        if(_.get(value, 'transactionid', '') !== '') {
          gtag('event', 'purchase', {
            "transaction_id": _.get(value, 'transactionid', ''),
            "affiliation": "Curbside Inc",
            "value": _.get(value, 'chargeAmount', ''),
            "currency": "USD",
            "tax": 0,
            "shipping": 0,
            "items": [
              {
                "id": _.get(value, 'orderid', '')
              }
            ]
          });
        }
        this.closeModal()
        this.props.fetchOrders()
      } catch (e) {
        this.setState({addressErr: false})
        if (e.error && e.error.message) {
          message.error(e.error.message)
        } else {
          message.error('Error updating order')
        }
      }
    }
  }

  handleChange(selectedOption) {
    this.setState({additionalEmail: selectedOption });
  }

  handleChangeMoney(event, maskedvalue, floatvalue) {
    if (maskedvalue === '0' || maskedvalue === '') {
      this.setState({ [event.target.name]: '', totalamount: '' }, () => {
       })
    } else {
      this.setState({ [event.target.name]: maskedvalue, totalamount: floatvalue }, () => {
      })
    }
  }

  handleSelectAddEmail(options) {
    let selectedOption = options.map((data, index) => {
      return data.value;
    })
    this.setState({additionalEmail: selectedOption });
  }

  getAdditionalDropDown() {
    // const { selectedOption } = this.state
    let selectedOption = []
    _.get(this.state, 'additionalEmail', []).map((data) => {
      let index = _.get(this.state, 'customersList', []).findIndex(x => x.id === data || x.email === data);
      if (index !== -1) {
        selectedOption.push({ label: this.state.customersList[index].email, value: this.state.customersList[index].email })
      }
    })

    let options = []
    _.get(this.state, 'customersList', []).map((data, index) => {
      options.push(
        { label: data.email, value: data.email }
      )
    })

    return (
      <div className="outi">
      <div className={this.state.additionalEmail && this.state.additionalEmail.length > 0 ? "btn-select form-control padtop10" : "btn-select form-control" }>
      <ReactMultiSelectCheckboxes
        className="multi-select-checkbox"
        options={options}
        onChange={this.handleSelectAddEmail.bind(this)}
        placeholderButtonLabel='Additional Contact'
        value={selectedOption}
      />
      </div>
      {this.state.additionalEmail && this.state.additionalEmail.length > 0 ?
        <label className="material-textfield-label labelbtn lablebtnup">Additional Contact</label>
        : "" }
      </div>
    )
  }

  getContainerName(containerId) {
    let containerObj = this.props.containerList
    let containerLen = containerObj.length
    for (let i = 0; i < containerLen; i++) {
      if (containerObj[i]._id === containerId)
        return containerObj[i].size
    }
  }

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDataForEdit.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
  }

  openConfirmModal (data) {
    this.setState({ rejectModelIsOpen: true })
  }

  getContainerTemplate() {
    let containerName = this.getContainerName(this.state.containersize);
    if (containerName === '1/2 Yard')
      return (
          <div className="form-group material-textfield material-textfield-lg">
            <input
              type="number"
              name= "half_yrd_qty"
              min='0'
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
          <div className="form-group material-textfield material-textfield-lg">
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

  closeRejectModal() {
    this.setState({ rejectModelIsOpen : false })
  }

  confirmReject = async() => {
    const orderData  = this.props.orderDataForEdit
    if(orderData.type === "Removal") {
      const { revertOrder } = this.props
      try{
        const { value } = await revertOrder({id: orderData._id ? orderData._id : orderData.id})
        if(value) {
          this.props.fetchOrders()
          this.closeRejectModal()
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "can't cancel and inprogress job"))
        this.closeRejectModal()
      }
    } else if (orderData.type === "Exchange") {
      const { revertOrder } = this.props
      try{
        const { value } = await revertOrder({id: orderData.parentId , reject: true})
        if(value) {
          this.props.fetchOrders()
          this.closeRejectModal()
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "can't cancel and inprogress job"))
        this.closeRejectModal()
      }
    } else {
      let data = orderData
      let id = data._id
      data.id = id
      data.isRejected = true
      try {
        data = _.omit(data, '_id')
        let { value } = await this.props.updateOrder(data)
        this.props.fetchOrders()
        this.closeModal()
        this.closeRejectModal()
      } catch (e) {
        message.error('Error updating order')
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
      if (typeofdebris.indexOf("Other") !== -1) {
        if (this.state.otherSelect) {
          this.addDivTag()
          this.setState({ otherSelect: false })
        }
      } else {
        this.setState({ divTag: [], otherSelect: true })
      }
    })
    this.updateCalculation()
    this.forceUpdate()
  }

  additionalDebris(){
    return this.state.divTag.map((object, index)=>(
      <div>
        <div key={index} className="form-group material-textfield">
          <input
            type="text"
            className="form-control material-textfield-input"
            value={object.otherDebris}
            onChange={this.handleDivOnChange('otherDebris', index)}
            required />
          <label className="material-textfield-label">Enter other debris </label>
        </div>
        {index > 0 ?
        <div className="mb-1">
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

  addDivTag(){
    this.setState({
      divTag: this.state.divTag.concat([{
        otherDebris: '',
      }])
    },()=>{
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

  async fetchCustomersForList() {
    const { search_string, limit, by, page, sort_field  } = this.state
    let customerid = _.get(this.props.orderDataForEdit, 'customer', '')
    let data = {
      search_string,
      // limit,
      by,
      // page,
      sort: sort_field,
      customerId: customerid
    }
    let { value } = await this.props.fetchCustomers(data)
    this.setState({
      customersList: _.get(value, 'customers', [])
    })
  }

  closeCustomerModal() {
    this.setState({ newContactModalIsOpen: false }, ()=> {
      this.fetchCustomersForList()
    })
  }

  addNewCustomer = async(data) => {
    let customerid = _.get(this.props.orderDataForEdit, 'customer', '')
    // if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
    //   customerid = _.get(this.props, 'user.createdBy', undefined)
    // }
    const obj ={
      email: data.email,
      contactname: data.firstname + " " + data.lastname,
      firstname: data.firstname,
      lastname: data.lastname,
      role: "user",
      companyname: _.get(this.state, 'selectedCustomer.companyname', ''),
      status: true,
      phone: data.phone !=="" ? formatPhoneNumber(data.phone) : "",
      createdBy: customerid
    }
      try {
      let { value } = await this.props.addCostomer(obj)
        if(value) {
          this.fetchCustomersForList()
          this.closeCustomerModal()
        }
      } catch (e) {
        this.setState({ customerAddMessage: _.get(e, 'error.message', 'Email Already Exist')})
      }
  }

  openCustomerModal() {
    this.setState({ newContactModalIsOpen: true, customerAddMessage: "" })
  }

  openAddCard() {
    this.setState({ openCard: true })
  }

  closeCardModal() {
    this.setState({ openCard: false }, ()=> {
      this.updateCustomer()
    })
  }

  updateCalculation() {
    let containerName = getContainerSize(this.props.containerList, _.get(this.state, 'containersize', ''));
    const county = this.state.county
    if (this.state.selectedCustomer && this.state.selectedCustomer.isHomeCustomer) {
      const zipExists = _.find(this.state.zipPricing, (zips) => {
        return zips.zipcode === this.state.zipcode
      })
      const cal = calculatePriceForExchange(containerName, this.state.typeofdebris, county)
      if(zipExists && cal.type !== "heavyPrice") {
        const containersize = _.lowerCase(containerName).replace(/ /g,'')
        console.log(containersize, 'containersize')
        let amount = parseFloat(zipExists[containersize])
        var permit = 0
        if(this.state.permit === 'yes') {
          permit = 54.44
        }
        
        let taxes = (8.875 * (amount + permit))/100
        let totalamount = amount + taxes + permit
        let discount = this.state.discount

        if(this.state.discountPercentage && this.state.discountPercentage !== '') {
          discount = (parseFloat(totalamount)*parseFloat(this.state.discountPercentage))/100
          totalamount = parseFloat(totalamount - discount)
        }
        this.setState({ totalamount, taxes, amount, discount, consumercost: this.state.totalamount.toFixed(2) })
      } else {
      
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
        this.setState({ baseprice : amount, taxes, truckingrate: 250, estimatedprice: p.toFixed(2)})
      }
      if(containerName === '1/2 Yard') {
        const p = amount * parseInt(_.get(this.state, 'half_yrd_qty', 0))
        amount = p
        totalamount = p + 250 + permit
        taxes = (8.875 * totalamount)/100
        totalamount = totalamount + taxes
        this.setState({ baseprice : amount,amount: p, taxes: taxes, estimatedprice: p.toFixed(2)})
      }
      let discount = this.state.discount

      if(this.state.discountPercentage && this.state.discountPercentage !== '') {
        discount = (parseFloat(totalamount)*parseFloat(this.state.discountPercentage))/100
        totalamount = parseFloat(totalamount - discount)
      }
      this.setState({ totalamount, taxes, amount, permitPrice : permit, discount, consumercost: this.state.totalamount.toFixed(2) })
    }
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
      let idx = _.get(value, 'customers', []).findIndex(obj => String(obj.id) === String(_.get(this.props, 'orderDataForEdit.customer', '')))
      let selectedCustomer =  value.customers[idx]
      this.setState({
        selectedCustomer,
        addEmail: _.get(selectedCustomer, 'additionalemail', []),
        addName: _.get(selectedCustomer, 'additionalname', []),
      })
    }
  }

  formatNumber(number) {
    const nfObject = new Intl.NumberFormat('en-US');
    const output = nfObject.format(number);
    return output
  }

  applyCouponCode = async() => {
    const { couponCode } = this.state
    const { applyCoupon } = this.props
    const obj = {
      couponCode,
      customerId: this.props.selectedCustomer && this.props.selectedCustomer.id
    }
    try {
      this.updateCalculation()
      const { value } = await applyCoupon(obj)
      if(value) {
        var discount = 0
        var totalamount = this.state.totalamount
        let discountPercentage = this.state.discountPercentage
        if(value && value.data.percent_off !== null) {
          discount = (value.data.percent_off * this.state.totalamount)/100
          totalamount = totalamount - discount
          discountPercentage =  value.data.percent_off
        }
        if(value && value.data.amount_off !== null) {
          discount = value.data.amount_off
          totalamount = totalamount - discount
          discountPercentage =  value.data.percent_off
        }
        this.setState({ discount, discountPercentage, totalamount, errMessage: "" })
      }
    } catch (e){
      this.updateCalculation()
      this.setState({ discount: "" , errMessage: _.get(e, 'error.message', 'Invalid Coupon')})
    }
  }

  render() {
    const { isViewModalOpen, isEditModalOpen, err } = this.state
    const { orderDataForEdit, user } = this.props
    let created = orderDataForEdit.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderDataForEdit.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderDataForEdit.createdat)
    const allowedTons = getAllowedTons(this.getContainerName(this.state.containersize))
    let containerName = this.getContainerName(this.state.containersize);
    return (
      <div>

        {/* order modal open */}
        <ReactModal
          isOpen={this.props.editModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
            <div className="react-modal-header">
            <h5 className="react-modal-title d-flex flex-unset align-items-center">Review Order - {_.get(orderDataForEdit, 'orderid', '')} <span className={_.get(orderDataForEdit, 'type', 'Delivery') === "Delivery" ? "greenlable unapproved-status pending" : "greenlable unapproved-status exchange"}>
            { containerName === "1/2 Yard" && _.get(orderDataForEdit, 'type', '') == "Exchange" ? "Mini Action" : _.get(orderDataForEdit, 'type', 'Delivery')}</span></h5>
              <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span>  <span className="clearfixs"></span><span>By: </span>
              {
              _.get(orderDataForEdit, 'created.name', '') !== '' ? _.get(orderDataForEdit, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')
             }</h6>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">What service are we providing?</h4>
                  <div className="form-group material-textfield">
                    <select  name ="containersize" value={this.state.containersize} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select Container Size</option>
                      { _.get(this.props, 'containerList', []).map((container, i)=>{
                          return (
                            <option key={i} value={container._id}>{container.size}</option>
                          )
                        })
                      }
                    </select>
                    <label className="material-textfield-label">Container Size <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.containersize ? err.containersize : ""}</p>
                  </div>
                  {this.state.containersize ? this.getContainerTemplate() : ''}
                  <div className="row">
                    <div className="col-md-12 mb-2">
                      {containerName === "1/2 Yard" && _.get(orderDataForEdit, 'type', '') == "Exchange" &&
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
                        {containerName === "1/2 Yard" && _.get(orderDataForEdit, 'type', '') == "Exchange" &&
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
                          {containerName === "1/2 Yard" && _.get(orderDataForEdit, 'type', '') == "Exchange" &&
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
                        {containerName === "1/2 Yard" && _.get(orderDataForEdit, 'type', '') == "Exchange" &&
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
                    </div>
                    <div className="col-md-12 mb-2">
                      <h4 className="single-heading-sm">Type of Debris <span className="text-danger">*</span></h4>
                    </div>
                    <div className="col-md-12">
                      <ul className="checkboxlists">
                        {this.state.debrisType.length !== 0 && this.state.debrisType.map((type, index) => {
                          return (
                            <li onClick={this.selectDebrish.bind(this, type)} key={index}>
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
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Where do you want the container(s)? </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <AddressAutoComplete
                      inputClassName={"form-control material-textfield-input"}
                      onSelect={(suggest) => this.onAddressSelect(suggest)}
                      onChange = {(value) => this.onChangeAddressField(value)}
                      initialValue={this.state.new_address}
                    />
                    {/* <label className="material-textfield-label">Address <span className="text-danger">*</span></label> */}
                    <label className={this.state.new_address || this.state.onAddressInputvalue ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Job Address <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.address ? err.address : ""}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "city"
                      value={this.state.city}
                      onChange={this.onHandleChange.bind(this)}

                      required />
                    <label className="material-textfield-label">City <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.city ? err.city : ""}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "state"
                      value={this.state.state}
                      onChange={this.onHandleChange.bind(this)}

                      required />
                    <label className="material-textfield-label">State <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.state ? err.state : ""}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "zipcode"
                      value={this.state.zipcode}
                      onChange={this.onHandleChange.bind(this)}

                      required />
                    <label className="material-textfield-label">Zip <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.zipcode ? err.zipcode : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="modalmap">
                  {_.get(this.state, 'location', '') !== "" ?
                    <MapComponent position={_.get(this.state, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(this.state, 'container', ''))}/> : "" }
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "borough"
                      value={this.state.borough}
                      onChange={this.onHandleChange.bind(this)}

                      required />
                    <label className="material-textfield-label">Borough</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "neighborhood"
                      value={this.state.neighborhood}
                      onChange={this.onHandleChange.bind(this)}

                      required />
                    <label className="material-textfield-label">Neighborhood/Area</label>
                  </div>
                </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select
                      name="placement"
                      value= {this.state.placement}
                      onChange={this.onHandleChange.bind(this)}
                      className="form-control custom-select h-66 w-100 font-16 material-textfield-input"
                      required>
                      <option defaultValue="">Select placement</option>
                      <option value="On Street">On Street</option>
                      <option value="In Lot/Yard">In Lot/Yard</option>
                      <option value="Inside Building">Inside Building</option>
                      <option value="In Driveway">In Driveway</option>
                      <option value="Other">Other</option>
                    </select>
                    <label className="material-textfield-label">Placement </label>
                  </div>
                </div>
                { this.state.placement === 'Other' ?
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="otherPlacement"
                        value={this.state.otherPlacement}
                        onChange={this.onHandleChange.bind(this)}
                        required />
                      <label className="material-textfield-label">Other Placement <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.otherPlacement ? err.otherPlacement : ""}</p>
                    </div>
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
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="parking"
                      value={this.state.parking}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    {/* <select  name="parking" onChange={this.onHandleChange.bind(this)} value={this.state.parking} className="form-control material-textfield-input custom-select">
                      <option>Select Parking</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select> */}
                    <label className="material-textfield-label">Parking</label>
                  </div>
                </div>
                {/* {this.getContainerName(this.state.containersize) !== '1/2 Yard' ? */}
                { this.getContainerName(this.state.containersize) !== "Live Load" ?
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <select  name="permit" onChange={this.onHandleChange.bind(this)} value={this.state.permit} className="form-control material-textfield-input custom-select">
                      <option>Select Permit</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <label className="material-textfield-label">Permit</label>
                  </div>
                </div>
                 : "" }
              </div>

              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">When do you want the container(s)? </h4>
                  <div className="form-group material-textfield">
                    {_.get(orderDataForEdit,'type', '') === "Removal" ?
                      <DatePicker
                        className="form-control material-textfield-input"
                        selected={this.state.pickupdate}
                        onChange={this.handleDateChangePickup.bind(this)}
                        minDate={new Date()}

                        required />
                        : 
                        <DatePicker
                        className="form-control material-textfield-input"
                        selected={this.state.deliverydate}
                        onChange={this.handleDateChange.bind(this)}
                        minDate={new Date()}

                        required />
                        }

                    {/* <label className="material-textfield-label">Delivery Date <span className="text-danger">*</span></label> */}
                    <label className={this.state.deliverydate ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Date <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.deliverydate ? err.deliverydate : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Who’s placing this order?</h4>
                </div>
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select name="email" value={this.state.email} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select</option>
                      { _.get(this.state, "customersList", []).map((customer, i)=>{
                        return(
                          <option key={i} value={customer.id}>{customer.firstname} {customer.lastname}</option>
                        )
                      })}
                    </select>
                    <label className="material-textfield-label">Select Contact</label>
                    <p className="text-danger">{err && err.email ? err.email : ""}</p>
                    <span className="new-contact-span" onClick={this.openCustomerModal.bind(this)}>Add New Contact</span>
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "orderedby"
                      value={this.state.orderedby}
                      onChange={this.onHandleChange.bind(this)}

                      required />
                    <label className="material-textfield-label">Full Name </label>
                    <p className="text-danger">{err && err.orderedby ? err.orderedby : ""}</p>
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
                      name="orderedbycontact"
                      value={this.state.orderedbycontact}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Phone Number </label>
                    <p className="text-danger">{err && err.orderedbycontact ? err.orderedbycontact : ""}</p>
                  </div>
                </div> */}
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Who’s going to be onsite?</h4>
                </div>
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select name="contactemail" value={this.state.contactemail} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select</option>
                      { _.get(this.state, "customersList", []).map((customer, i)=>{
                        return(
                          <option key={i} value={customer.id}>{customer.firstname} {customer.lastname}</option>
                        )
                      })}
                    </select>
                    <label className="material-textfield-label">Select Contact</label>
                    <p className="text-danger">{err && err.contactemail ? err.contactemail : ""}</p>
                    <span className="new-contact-span" onClick={this.openCustomerModal.bind(this)}>Add New Contact</span>
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "contactname"
                      value={this.state.contactname}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Job Site Contact Person <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.contactname ? err.contactname : ""}</p>
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
                      name="contactnumber"
                      value={this.state.contactnumber}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Job Site Contact Person Phone <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.contactnumber ? err.contactnumber : ""}</p>
                  </div>
                </div> */}
                { this.getAdditionalDropDown() }
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Payment Information?</h4>
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="purchaseorderno"
                      value={this.state.purchaseorderno}
                      onChange={this.onHandleChange.bind(this)}

                      required />
                    <label className="material-textfield-label">Purchase Order Number </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <select name="pricingtype" value={this.state.pricingtype} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select Pricing Type</option>
                      <option value="Matrix">Matrix</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                    <label className="material-textfield-label">Pricing Type </label>
                    <p className="text-danger">{err && err.pricingtype ? err.pricingtype : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <select
                      className="form-control custom-select h-66 w-100 font-16 material-textfield-input"
                      name= "paymenttype"
                      value={this.state.paymenttype}
                      onChange={this.onHandleChange.bind(this)}
                      required>
                      <option value="">Select Payment Type</option>
                      <option value="Active Account">Active Account</option>
                      <option value="Check">Check</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                    <label className="material-textfield-label">Payment Type </label>
                    <p className="text-danger">{err && err.paymenttype ? err.paymenttype : ""}</p>
                  </div>
                </div>
              </div>
              {this.state.selectedCustomer && !this.state.selectedCustomer.isHomeCustomer ?
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <CurrencyInput
                        precision={0}
                        className="form-control material-textfield-input"
                        placeholder=''
                        name="consumercost"
                        value={this.state.consumercost}
                        onChangeEvent={this.handleChangeMoney.bind(this)}
                        required
                      />
                      <label className="material-textfield-label">Total Price <span className="text-danger">*</span></label>
                      <p className="text-danger">{err && err.consumercost ? err.consumercost : ""}</p>
                    </div>
                  </div>
                </div>
                :
                ""
              }

              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Internal Details</h4>
                </div>

                { this.props.getStatus(_.get(orderDataForEdit, 'status', '')) && this.props.getStatus(_.get(orderDataForEdit, 'status', '')) === "Pending Removal" ?
                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-select">
                    <select name="dump" value={this.state.dump} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select Dump</option>
                      {_.get(this.state, "dumps", []).map((dump, i) => {
                        return (
                          <option key={i} value={dump.id}>{dump.companyname}</option>
                        )
                      })
                      }
                    </select>
                    <label className="material-textfield-label">Dump site <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.dumpsite ? err.dumpsite : ""}</p>
                  </div>
                </div> : "" }

                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select
                      disabled={this.props.getStatus(_.get(orderDataForEdit, 'status', '')) && this.props.getStatus(_.get(orderDataForEdit, 'status', '')) === "Pending Removal" ? true : false}
                      className="form-control material-textfield-input custom-select" name="haulercompany" value= {this.state.haulercompany} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select Hauler</option>
                      { _.get(this.state, "haulerList", []).map((hauler, i)=>{
                          return (
                            <option key={i} value={hauler.id}>{hauler.company_name}</option>
                          )
                        })
                      }
                    </select>
                    <label className="material-textfield-label">Hauler <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.haular ? err.haular : ""}</p>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <textarea
                      className="form-control material-textfield-input h-150"
                      value={this.state.specialinstruction}
                      name="specialinstruction"
                      onChange={this.onHandleChange.bind(this)}
                      required>
                    </textarea>
                    <label className="material-textfield-label">Special Instructions </label>
                  </div>
                </div>
              </div>
              {this.state.selectedCustomer && this.state.selectedCustomer.isHomeCustomer && _.get(orderDataForEdit, 'type', 'Delivery') !== 'Removal' ?
                <div>
                    <div className="mt-3">
                    {_.get(this.state.selectedCustomer, 'payment_info', []).length !== 0 ?
                      <div className="form-group material-textfield material-textfield-select mb-0">
                        <select className="form-control custom-select h-66 w-100 font-16 material-textfield-input"
                          onChange={this.onHandleChange.bind(this)} name="cardId" value={this.state.cardId} required>
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
                        <p className="text-danger">{err && err.card ? err.card : ""}</p>
                      </div>
                      : "" }
                    </div>

                  <div>
                    <button className=" btn-new-card" onClick={this.openAddCard.bind(this)}>Add a New Card </button>
                  </div>
                  {this.state.discount && this.state.discount !== '' ?
                  ''
                  :
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
                  }
                  {this.getContainerName(this.state.containersize) !== 'Live Load' ?
                  <div className="totalpayment">
                  <p>Included Tonnage <span>{_.intersection(heavyMaterials, _.get(this.state,'typeofdebris', [])).length === 0 ? `${_.get(allowedTons, 'tons', '')} tons` : "N/A"}</span></p>
                    <p>Container Size <span>{this.getContainerName(this.state.containersize) }</span></p>
                    <p>Materials <span>{this.state.typeofdebris.join(",")}</span></p>
                    <p>Delivery Date <span>{this.state.deliveryday} - {moment(this.state.deliverydate).format("MM/DD/YYYY")}</span></p>
                    <p>Address <span>{getAddress(this.state)}</span></p>
                    <p>Base <span>{this.state.amount !== "" &&this.state.amount && this.state.amount.toFixed(2) ? `$${this.formatNumber(this.state.amount.toFixed(2))}` : "" }</span></p>
                    {this.getContainerName(this.state.containersize) !== "Live Load" && (this.state.permit === true || this.state.permit === 'yes')? <p>Permit <span>{this.state.permit !== "" &&this.state.permit ? `$54.44` : "" }</span></p> : "" }
                    {this.getContainerName(this.state.containersize) === "1/2 Yard" ? <p>Permit <span>{this.state.deliveryfee !== "" &&this.state.deliveryfee ? `$250` : "" }</span></p> : "" }
                    <p>Estimated Taxes <span>{this.state.taxes !== "" &&this.state.taxes && this.state.taxes.toFixed(2) ? `$${this.formatNumber(this.state.taxes.toFixed(2))}` : "" }</span></p>
                    {this.state.discount && this.state.discount !== '' ? <p>Discount <span>{this.state.discount !== "" &&this.state.discount ? `$${this.formatNumber(this.state.discount.toFixed(2))}` : "" }</span></p> : ''}
                    <p>Total <span>{this.state.totalamount !== "" &&this.state.totalamount && this.state.totalamount.toFixed(2) ? `$${this.formatNumber(this.state.totalamount.toFixed(2))}` : "" }</span></p>
                  </div> :
                  <div className="totalpayment">
                    <p>Estimated Yardage <span>{_.get(this.state, 'live_load_yard', '')} yards</span></p>
                    <p>Price per yard <span>${_.get(this.state, 'baseprice', 0)}</span></p>
                    <p>Estimated Yardage Price <span>${_.get(this.state, 'estimatedprice', 0) }</span></p>
                    <p>Delivery Date <span>{this.state.deliveryday} - {getDate(this.state.deliverydate)}</span></p>
                    <p>Address <span>{getAddress(this.state)}</span></p>
                    <p>Trucking Rate <span>{this.state.truckingrate !== "" &&this.state.truckingrate && this.state.truckingrate.toFixed(2) ? `$${this.formatNumber(this.state.truckingrate.toFixed(2))}` : "" }</span></p>
                    <p>Estimated Taxes <span>{this.state.taxes !== "" &&this.state.taxes && this.state.taxes.toFixed(2) ? `$${this.formatNumber(this.state.taxes.toFixed(2))}` : "" }</span></p>
                    {this.state.discount && this.state.discount !== '' ? <p>Discount <span>{this.state.discount !== "" &&this.state.discount ? `$${this.formatNumber(this.state.discount.toFixed(2))}` : "" }</span></p> : ''}
                    <p>Estimated Total Price <span>{this.state.totalamount !== "" &&this.state.totalamount && this.state.totalamount.toFixed(2) ? `$${this.formatNumber(this.state.totalamount.toFixed(2))}` : "" }</span></p>
                  </div>   }
                </div> : ""}
                {this.state.errMessage ? <p className="text-danger">{this.state.errMessage}</p> : ""}
              <button disabled={this.state.addressErr} onClick={this.sendOrder.bind(this, false)} className="btn btn-dark btn-lg w-100 font-800">Accept & Create Order</button>
              <button onClick={this.openConfirmModal.bind(this)} className="btn btn-dark-red btn-lg w-100 font-800 mt-3">Reject Order</button>
            </div>
          </div>
          {this.state.newContactModalIsOpen &&
            <NewContactModal
              newContactModalIsOpen = {this.state.newContactModalIsOpen}
              closeCustomerModal ={this.closeCustomerModal.bind(this)}
              addNewCustomer={this.addNewCustomer.bind(this)}
              customerAddMessage={this.state.customerAddMessage}
              {...this.props}
            />
          }
          {this.state.errModal &&
          <ErrorModal
            errModal={this.state.errModal}
            closeModal={this.closeErrModal.bind(this)}
          />
        }
        </ReactModal>
        <AddCardModal
          openCardModal = {this.state.openCard}
          closeCardModal ={this.closeCardModal.bind(this)}
          customerid = {_.get(this.state, 'selectedCustomer.id', '')}
          {...this.props}
        />
        <ReactModal
          isOpen={this.state.rejectModelIsOpen}
          onRequestClose={this.closeRejectModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Reject</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeRejectModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <p className="modalpara">
                    Are you sure to reject this order?
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button onClick={this.confirmReject.bind(this)} className="btn btn-danger btn-md font-16 font-600 btnfullwidth-mob">Yes, Reject</button>
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

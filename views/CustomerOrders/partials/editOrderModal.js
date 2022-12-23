import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import Dropzone from 'react-dropzone'
import "react-datepicker/dist/react-datepicker.css"
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'
import CurrencyInput from "react-currency-input"

import AddressAutoComplete from '../../../components/AddressAutoComplete'
import ErrorModal from '../../../components/errorModal'
import MapComponent from '../../../components/map'
import { calculationArray, formatGeoAddressComponents, formatOrderAddess, getFormatedDateAndTimeWithoutUTC, formatNumber, getDateMMDDYYYHHMM, getTimeInDayAndHours, formatPhoneNumber, getDay, getDate, getContainerSize } from '../../../components/commonFormate'
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'
import config from '../../../config'
import minusIcon from '../../../images/minusIcon.svg'
import plusIcon from '../../../images/plusIcon.svg'
import MultiSelectCheckBox from '../../../components/multiSelectCheckBox';
import NewContactModal from '../../../components/newContactModal'

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
      pdf: [],
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
      placement: "",
      otherPlacement: "",
      divTag: [],
      otherSelect: true,
      debrisType: debrisTypes,
      search_string: '',
      sort_field: 'companyname',
      by: 1,
      page: 0,
      limit: 20,
      yardagecalculated : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        tonnagecalculated : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        tonnagepercentage : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        tonnageweight : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        errModal: false,
        addressErr: false,
        loadervisible: false

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
    const { yardagecalculated, tonnageweight, tonnagecalculated, tonnagepercentage } = this.state
    const deliverydateCal =  _.get(orderDataForEdit, 'deliverydate', '') !== '' ? (new Date(getDate(_.get(orderDataForEdit, 'deliverydate', '')))) : new Date()
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
      email: _.get(orderDataForEdit, 'orderEmail.id', ''),
      contactemail: _.get(orderDataForEdit, 'contactEmail.id', ''),
      permit: _.get(orderDataForEdit, 'permit', 'false') ? 'yes' : 'no',
      location: _.get(orderDataForEdit, 'location', ''),
      purchaseorderno: _.get(orderDataForEdit, 'purchaseordernumber', ''),
      timezone: _.get(orderDataForEdit, 'timezone', ''),
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
      additionalEmail: _.get(orderDataForEdit, 'additional_email', []) !== null ? _.get(orderDataForEdit, 'additional_email', []) : [],
      containersize: _.get(orderDataForEdit, 'container', ''),
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
      live_load_yard: _.get(orderDataForEdit, 'live_load_yard', ''),
      deliverydate: deliverydateCal,
      deliveryday:  moment(deliverydateCal).format('dddd'),
      otherDebris: _.get(orderDataForEdit, 'otherDebris', []),
      tonnagepercentage: _.get(orderDataForEdit, 'sustainabilityinformation.tonnagepercentage', []).length > 0 ? _.get(orderDataForEdit, 'sustainabilityinformation.tonnagepercentage', []) : tonnagepercentage,
      tonnageweight: _.get(orderDataForEdit, 'sustainabilityinformation.tonnageweight', []).length > 0 ? _.get(orderDataForEdit, 'sustainabilityinformation.tonnageweight', []) : tonnageweight,
      yardagecalculated: _.get(orderDataForEdit, 'sustainabilityinformation.yardagecalculated', []).length > 0 ? _.get(orderDataForEdit, 'sustainabilityinformation.yardagecalculated', []) : yardagecalculated,
      tonnagecalculated: _.get(orderDataForEdit, 'sustainabilityinformation.tonnagecalculated', []).length > 0 ? _.get(orderDataForEdit, 'sustainabilityinformation.tonnagecalculated', []) : tonnagecalculated,
      totalpercentage: _.get(orderDataForEdit, 'sustainabilityinformation.totalpercentage', ''),
      recyclingpercentage: _.get(orderDataForEdit, 'sustainabilityinformation.recyclingpercentage', ''),
      residualpercentage: _.get(orderDataForEdit, 'sustainabilityinformation.residualpercentage', ''),
      waste: _.get(orderDataForEdit, 'sustainabilityinformation.waste', ''),
      brick: _.get(orderDataForEdit, 'sustainabilityinformation.brick', ''),
      dirt: _.get(orderDataForEdit, 'sustainabilityinformation.dirt', ''),
      concrete: _.get(orderDataForEdit, 'sustainabilityinformation.concrete', ''),
      cleanwood: _.get(orderDataForEdit, 'sustainabilityinformation.cleanwood', ''),
      metal: _.get(orderDataForEdit, 'sustainabilityinformation.metal', ''),
      paper_cardboard: _.get(orderDataForEdit, 'sustainabilityinformation.paper_cardboard', ''),
      plastic: _.get(orderDataForEdit, 'sustainabilityinformation.plastic', ''),
      drywall: _.get(orderDataForEdit, 'sustainabilityinformation.drywall', ''),
      glass: _.get(orderDataForEdit, 'sustainabilityinformation.glass', ''),
      asphalt: _.get(orderDataForEdit, 'sustainabilityinformation.asphalt', ''),
      weight_total: _.get(orderDataForEdit, 'sustainabilityinformation.weight_total', ''),
      weight:  _.get(orderDataForEdit, 'weight', ''),
      cost:  _.get(orderDataForEdit, 'dumpcost', ''),
      dumpsite:  _.get(orderDataForEdit, 'dump.id', ''),
      dumpticketnumber:  _.get(orderDataForEdit, 'dumpticketnumber', ''),
      pdf:  _.get(orderDataForEdit, 'uploadedpdf', []),
      emptyamount:  _.get(orderDataForEdit, 'emptyamount', ''),
      looseyardage:  _.get(orderDataForEdit, 'looseyardage', ''),
      addminis:  _.get(orderDataForEdit, 'addminis', ''),
      removeminis:  _.get(orderDataForEdit, 'removeminis', ''),
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
    this.props.getUser(datau)
    let data = {
      limit: undefined, by: 1, page: undefined, sort_field: ''
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []) })
    this.fetchCustomersForList()
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

  getStatus(input) {
    if (input && this.props.statusList) {
      let status = "";
      this.props.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
        return status;
    }
  }

  onAddressSelect = async(suggest) => {
    this.suggestedAddress = suggest
    if (suggest) {
      let geoDetails = formatGeoAddressComponents(suggest.gmaps, suggest.description)
      const zip = geoDetails.zipcode
      if(zip) {
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
    } else {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.onAddressInputvalue}&key=${process.env.REACT_APP_GOOGLE_KEY}`,
      {
          method:'GET',
      }
      ).then((res) => res.json()

      ).then(async (data) => {
        const result = data.results[0]
        let geoDetails = formatGeoAddressComponents(result, result.formatted_address)
        const zip = geoDetails.zipcode
        console.log(geoDetails, result)
          if(zip) {
            try {
              const {value} = await this.props.checkZip({zip})
              if(value && value.type === "success") {
                geoDetails.lat = result.geometry.location.lat
                geoDetails.lng = result.geometry.location.lng
                geoDetails.geoPlaceId = result.place_id
                if (geoDetails.address === "") {
                  geoDetails.address = result.formatted_address
                }
                console.log(geoDetails)
                this.setAddressState(geoDetails, result.formatted_address)
                this.setState({ addressErr: false })
              }
            } catch(e) {
              this.setState({ errModal: true, addressErr: true })
            }
          }
        })
        .catch(err => console.log(err))
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

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDataForEdit.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
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
      this.setState({ live_load_yard: e.target.value, half_yrd_qty: 0 })
    } else if (e.target.name === 'half_yrd_qty') {
      this.setState({ live_load_yard: 0, half_yrd_qty: e.target.value })
    } else {
      this.setState({ [e.target.name]: e.target.value }, () => {
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

  resetState(){
    this.state = {
      street_no: "", floor: "", route: "", new_address: "",
      address: "", state: "", geoPlaceId: "", city: "",
      neighborhood: "", borough: "", zipcode: "",
      deliveryday: "", deliverydate: "",
      typeofdebris: [], containersize: "",
      parking: '', location: "",
      purchaseorderno: "", permit: 'yes',
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      specialinstruction: "", containerlocation: "", paymenttype: "",
      orderedby: "", orderedbycontact: "",
      half_yrd_qty: '',
      live_load_yard: '',
      selectedOption: '',
      timezone: "", err: {},
      additionalEmail: [],
      placement: '', otherPlacement: "",
    }
  }

  validate() {
    let errObj = {}
    const {
      state, city, new_address,zipcode, contactname, orderedby, orderedbycontact,
      haulercompany, typeofdebris, deliverydate, contactnumber,
      consumercost, err, live_load_yard, half_yrd_qty, containersize,
      otherPlacement, placement, email, contactemail
    } = this.state

    if(email === "") {
      errObj.email = "Order person email is required"
    }
    if(contactemail === "") {
      errObj.contactemail = "Job-Site contact email is required"
    }

    // if(contactnumber === "") {
    //   errObj.contactnumber = "Contact number is required"
    // }

    if(consumercost === "") {
      errObj.consumercost = "Total price is required"
    }
    if(deliverydate === "") {
      errObj.deliverydate = "Delivery date is required"
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
    this.setState({ err: errObj })
  }

  sendOrder=async()=> {
    await this.validate()
    const {err} = this.state
    const { orderDataForEdit } = this.props
    let checkPermit = _.get(orderDataForEdit, 'permit', false) ? 'yes' : 'no'
    let connectedOrders = orderDataForEdit.connectedOrders
    let orderData = orderDataForEdit
    let containerName = this.getContainerName(this.state.containersize);
    if(Object.keys(err).length === 0) {
      const { city, address, state, zipcode, new_address,
        borough, neighborhood, street_no, route,
        geoPlaceId, floor,
        permit, deliveryday, deliverydate, typeofdebris, containersize,
        parking, location, purchaseorderno, timezone,half_yrd_qty,
        consumercost, haulercompany, specialinstruction, containerlocation,
        paymenttype,live_load_yard, otherPlacement, placement,
        pricingtype, additionalEmail, email, contactemail  } = this.state
      const timezoneOfUser = Intl.DateTimeFormat().resolvedOptions().timeZone
      let ordereddate = moment().tz(timezoneOfUser).format('MM-DD-YYYY')
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
      orderData.zipcode = zipcode
      orderData.new_address = new_address
      orderData.borough = borough
      orderData.location = location
      orderData.neighborhood = neighborhood
      orderData.street_no = street_no
      orderData.route = route
      orderData.geoPlaceId = geoPlaceId
      orderData.floor = floor
      orderData.timezone = timezone
      orderData.ordereddate = ordereddate
      orderData.contactnumber = formatPhoneNumber(contactnumber)
      orderData.permit = permit === "yes" ? true : false
      orderData.deliveryday = deliveryday
      orderData.container = containersize
      orderData.parking = parking
      orderData.purchaseordernumber = purchaseorderno
      orderData.contactname = contactname
      orderData.consumercost = consumercost ? consumercost.toString().replace(/,/g, '') : ''
      orderData.specialinstruction = specialinstruction
      orderData.containerlocation = containerlocation
      orderData.placement = placement
      orderData.paymenttype = paymenttype
      orderData.orderedby = orderedby
      orderData.orderedbycontact = formatPhoneNumber(orderedbycontact)
      orderData.pricingtype = pricingtype
      orderData.live_load_yard = live_load_yard
      orderData.half_yrd_qty = half_yrd_qty
      orderData.dumpcost = this.state.cost ? this.state.cost.toString().replace(/,/g, '') : ''
      orderData.orderEmail =  orderEmail
      orderData.contactEmail = contactEmail
      orderData.dumpticketnumber = this.state.dumpticketnumber
      let dump = {}
      this.props.dumps.forEach(function (element) {
          if (String(element.id) === String(this.state.dumpsite)) {
            dump = element;
          }
      }, this);
      orderData.dump = dump
      let obj = {};
      obj.waste=this.state.waste !== "" ? parseFloat(this.state.waste) : 0;
      obj.brick=this.state.brick !== "" ? parseFloat(this.state.brick) : 0;
      obj.dirt=this.state.dirt !== "" ? parseFloat(this.state.dirt) : 0;
      obj.concrete=this.state.concrete !== "" ? parseFloat(this.state.concrete) : 0;
      obj.cleanwood=this.state.cleanwood !== "" ? parseFloat(this.state.cleanwood) : 0;
      obj.metal=this.state.metal !== "" ? parseFloat(this.state.metal) : 0;
      obj.paper_cardboard=this.state.paper_cardboard !== "" ? parseFloat(this.state.paper_cardboard) : 0;
      obj.plastic=this.state.plastic !== "" ? parseFloat(this.state.plastic) : 0;
      obj.drywall=this.state.drywall !== "" ? parseFloat(this.state.drywall) : 0;
      obj.glass=this.state.glass !== "" ? parseFloat(this.state.glass) : 0;
      obj.asphalt=this.state.asphalt !== "" ? parseFloat(this.state.asphalt) : 0;
      obj.weight_total=this.state.weight_total !== "" ? parseFloat(this.state.weight_total) : 0;
      obj.yardagecalculated=this.state.yardagecalculated
      obj.tonnagecalculated=this.state.tonnagecalculated;
      obj.tonnagepercentage=this.state.tonnagepercentage;
      obj.tonnageweight=this.state.tonnageweight;
      obj.totalpercentage=this.state.totalpercentage;
      obj.recyclingpercentage=this.state.recyclingpercentage;
      obj.residualpercentage=this.state.residualpercentage;
      orderData.sustainabilityinformation = obj;
      orderData.weight = _.get(this.state, 'weight', '')
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

      if(containerName === "1/2 Yard" && _.get(orderDataForEdit, 'parentId', '') !== null) {
        orderData.addminis = this.state.addminis
        orderData.removeminis = this.state.removeminis
        orderData.emptyamount = this.state.emptyamount
        orderData.looseyardage = this.state.looseyardage
      }

      // orderData.otherDebris = otherDebris
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
      orderData.uploadedpdf = this.state.pdf.length !== 0 ? this.state.pdf : []
      orderData.isApproved = true
      orderData.sendEmail = false

      orderData.additional_email = []
      _.get(this.state, 'additionalEmail',[]).map((email)=>{
        let index = _.get(this.state, 'customersList', []).findIndex(x => x.email === email || x.id === email);
        if(index !== -1) {
          orderData.additional_email.push(this.state.customersList[index].id)
        }
      })

      orderData.haular = haular
      orderData.created = {id: this.props.user && this.props.user._id ? this.props.user._id : "",
        name : this.props.user && this.props.user.username? this.props.user.username : ""}
        orderData.deliverydate = moment(deliverydate).format('YYYY-MM-DDTHH:mm:ss')
      //orderData.createdat = moment().format('YYYY-MM-DDTHH:mm:ss')
      delete orderData.queue_exchange_orders
      delete orderData.queue_removal_orders
      delete orderData.connectedOrders
      delete orderData.futureExchange
      try {
        let { value } = await this.props.updateOrder(orderData)
        if (checkPermit !== this.state.permit && connectedOrders && connectedOrders.length > 0) {
          connectedOrders.map(async(co, i)=>{
            if (orderData.id !== co.id) {
              co.permit = permit === "yes" ? true : false
              co.id = co.id ? co.id : co._id
              delete co._id
              delete co.queue_exchange_orders
              delete co.queue_removal_orders
              delete co.connectedOrders
              delete co.futureExchange
              await this.props.updateOrder(co)
            }
            if (i === connectedOrders.length-1) {
              this.closeModal()
              this.props.fetchOrders()
            }
          })
        } else {
          this.closeModal()
          this.props.fetchOrders()
        }
      } catch (e) {
        message.error('Error updating order')
      }
    }
  }

  handleSelectAddEmail(options) {
    let selectedOption = options.map((data, index) => {
      return data.value;
    })
    this.setState({ additionalEmail: selectedOption });
  }

  getAdditionalDropDown() {
    // const { selectedOption } = this.state
    let selectedOption = []
    _.get(this.state, 'additionalEmail', []).map((data) => {
      let index = _.get(this.state, 'customersList', []).findIndex(x => x.id ===data || x.email === data);
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

  onchange(field, value) {
    const twodecimal = /^\d*\.?\d{0,2}$/;
    var isnum = /^\d+$/.test(value);
    const isdecimal=/^\d+(\.\d{2})?$/;
        switch (field) {
        case 'dumpsite':
            this.setState({ dumpsite: value });
            break;
        case 'weight':
            this.setState({ weight: value }, () => {
                this.calculateforall()
                this.forceUpdate()
            });
            break;
        case 'totalcost':
            let totalcost = value ? value.replace('$', "") : "";
            this.setState({ totalcost: totalcost.trim() });
            break;
        case 'cost':
            let cost = value ? value.replace('$', "") : "";
            this.setState({ cost: cost.trim() });
            break;
        case 'dumpticketnumber':
            this.setState({ dumpticketnumber: value});
            break;
        case 'waste':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ waste: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getResidualPercentage()
                    this.getWeightTotal()
                })
            }
            break;
        case 'brick':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ brick: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'dirt':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ dirt: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'concrete':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ concrete: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                });
            }
            break;
        case 'cleanwood':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ cleanwood: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                });
            }
            break;
        case 'metal':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ metal: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'paper_cardboard':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ paper_cardboard: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'plastic':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ plastic: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'drywall':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ drywall: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'glass':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ glass: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'asphalt':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ asphalt: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.getWeightTotal()
                    this.calculateforall()
                })
            }
            break;
    }
}

calculateforall() {
  const self = this
  const yardagecalculated = this.state.yardagecalculated
  const tonnagecalculated = this.state.tonnagecalculated
  let sum_of_all_tonnage = 0
  const arr = ['waste', 'brick', 'dirt', 'concrete', 'cleanwood','metal', 'paper_cardboard', 'plastic', 'drywall', 'glass' ,'asphalt']
  _.forEach(arr, function(item) {
      let calculationarray = calculationArray()
      let itemValue = self.state[item]
      const yard = self.getContainerValue(self.getContainerName(self.props.orderDataForEdit.container))
      let yardIndex = _.findIndex(yardagecalculated, function(y) {
          return y.key === item
      })
      let tonnageIndex = _.findIndex(tonnagecalculated, function(y) {
          return y.key === item
      })
      let calculationIndex = _.findIndex(calculationarray, function(y) {
          return y.key === item
      })
      if(itemValue === "") {
          itemValue = parseFloat(0)
      }
      if(yardIndex !== -1) {
          yardagecalculated[yardIndex].value = parseFloat((parseFloat(yard) * parseFloat(itemValue)) / 100)
      }
      if(tonnageIndex !== -1) {
          tonnagecalculated[tonnageIndex].value = parseFloat((parseFloat(yardagecalculated[yardIndex].value) * parseFloat(calculationarray[calculationIndex].tonnage)))
          sum_of_all_tonnage += parseFloat(tonnagecalculated[tonnageIndex].value)
      }
  })
  _.forEach(arr, function(a) {
      self.calculate(a, sum_of_all_tonnage, tonnagecalculated, yardagecalculated)
  })
}
getContainerValue(value) {
  const container = value
  if(container === "10 Yard") {
      return 10
  } else if(container === "15 Yard") {
      return 15
  } else if(container === "20 Yard") {
      return 20
  } else if(container === "30 Yard") {
      return 30
  } else if (container === "Live Load") {
      return parseFloat(this.props.orderDataForEdit.live_load_yard)
  } else if (container === "1/2 Yard") {
      return parseFloat(this.props.orderDataForEdit.half_yrd_qty)
  }
}

decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

calculate(item, sum_of_all_tonnage, tonnagecalculated, yardagecalculated ) {
  let calculationarray = calculationArray()
  const tonnagepercentage = this.state.tonnagepercentage
  const tonnageweight = this.state.tonnageweight
  let itemValue = this.state[item]
  //const yard = 30 //this.getContainerValue(this.props.orderDataForEdit.container)
  // let calculationIndex = _.findIndex(calculationarray, function(y) {
  //     return y.key === item
  // })
  let tonnagepercentageIndex = _.findIndex(tonnagepercentage, function(y) {
      return y.key === item
  })
  let tonnageIndex = _.findIndex(tonnagecalculated, function(y) {
      return y.key === item
  })
  let tonnageweightIndex = _.findIndex(tonnageweight, function(y) {
      return y.key === item
  })
  if(itemValue === "") {
      itemValue = parseFloat(0)
  }
  if(tonnagepercentageIndex !== -1) {
      if(sum_of_all_tonnage !== 0) {
          sum_of_all_tonnage = parseFloat(sum_of_all_tonnage)
          const tonnage = tonnagecalculated[tonnageIndex].value
          const cal = tonnage / sum_of_all_tonnage
          tonnagepercentage[tonnagepercentageIndex].value = parseFloat(cal * 100)
      } else {
          tonnagepercentage[tonnagepercentageIndex].value = 0
      }
      if(isNaN(tonnagepercentage[tonnagepercentageIndex].value)) {
          tonnagepercentage[tonnagepercentageIndex].value = 0
      }
  }
  if(tonnageweightIndex !== -1) {
          tonnageweight[tonnageweightIndex].value = parseFloat((parseFloat(tonnagepercentage[tonnagepercentageIndex].value) * parseFloat(this.state.weight)) /100)
          tonnageweight[tonnageweightIndex].value = parseFloat((tonnageweight[tonnageweightIndex].value).toFixed(2))
          if(isNaN(tonnageweight[tonnageweightIndex].value)) {
              tonnageweight[tonnageweightIndex].value = 0
          }
  }
  this.setState({ yardagecalculated, tonnagecalculated, tonnagepercentage, tonnageweight }, () => {
      this.getTotalPercentage()
      this.getRecyclingPercentage()
      this.getResidualPercentage()
      this.getWeightTotal()
  })
}

getTotalPercentage(){
  let sum = 0;
  const {waste, brick, dirt, concrete, plastic, glass,
         metal, cleanwood, paper_cardboard, drywall,
         asphalt} = this.state;
          sum = parseFloat(waste !== "" ? waste : 0 ) +  parseFloat(brick !== "" ? brick : 0 )
              + parseFloat(dirt !== "" ? dirt : 0 ) + parseFloat(concrete !== "" ? concrete : 0 )
                + parseFloat(plastic !== "" ? plastic : 0 ) + parseFloat(glass !== "" ? glass : 0 ) +
                parseFloat(metal !== "" ? metal : 0 ) + parseFloat(cleanwood !== "" ? cleanwood : 0 ) +
                parseFloat(paper_cardboard !== "" ? paper_cardboard : 0 ) + parseFloat(drywall !== "" ? drywall : 0 )
                + parseFloat(asphalt !== "" ? asphalt : 0 );

  if(sum > 0) {
      this.setState({ totalpercentage: Math.round(sum * 100) / 100})
  } else {
      this.setState({ totalpercentage: 0 })
  }
}

getWeightTotal() {
  let weight_total = 0
  const { tonnagepercentage } = this.state
  _.forEach(tonnagepercentage, function(tonnageper) {
      weight_total += Math.round(parseFloat(tonnageper.value))
  })
  this.setState({ weight_total: parseFloat(weight_total) })
}

getRecyclingPercentage(){
  let sum=0;
  const {tonnagepercentage} = this.state;
  if(tonnagepercentage.length !== 0) {
      this.setState({ recyclingpercentage: (parseFloat(this.state.totalpercentage) - parseFloat(tonnagepercentage[0].value)) })
  } else {
      this.setState({ recyclingpercentage: 0 })
  }
}

getResidualPercentage(){
  let sum=0;
  const {tonnagepercentage} = this.state;
  if(tonnagepercentage.length !== 0) {
      this.setState({ residualpercentage:  tonnagepercentage[0].value})
  }  else {
      this.setState({ residualpercentage: 0})
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
        <div className="form-group material-textfield">
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

  async fetchCustomersForList() {
    const { search_string, limit, by, page, sort_field  } = this.state
    let customerid = this.props.selectedCustomer && this.props.selectedCustomer.id
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
    let customerid = this.props.selectedCustomer && this.props.selectedCustomer.id
    const obj ={
      email: data.email,
      contactname: data.firstname + " " + data.lastname,
      firstname: data.firstname,
      lastname: data.lastname,
      role: "user",
      companyname: _.get(this.props, 'selectedCustomer.companyname', ''),
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

  handleChangeMoney(event, maskedvalue, floatvalue) {
    if (maskedvalue === '0' || maskedvalue === '') {
      this.setState({ [event.target.name]: '' }, () => {
       })
    } else {
      this.setState({ [event.target.name]: maskedvalue }, () => {
      })
    }
  }

  onDrop = async (files) => {
    const findIndex = _.findIndex(files, function(file) {
        return file.type !== "application/pdf"
    })
    if(findIndex === -1) {
        const pdf = []
        this.setState({loadervisible:true})
        const formdata = new FormData()
        _.forEach(files, (file, i) => {
            pdf.push(file)
            formdata.append(`files`, file)
        })
        const { value } = await this.props.uploadFile(formdata)
        if(value) {
          this.setState({pdf:_.get(value, 'data', []), fileError: "", loadervisible: false })
        }
        //this.setState({pdf:pdf, fileError: "" })
        //this.props.uploadFile(formdata)
    } else {
        this.setState({ fileError: "Please upload pdf file only.", pdf: [],loadervisible: false  })
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
    const container = this.getContainerName(this.state.containersize) ? this.getContainerName(this.state.containersize) : ''
    const statusCheck = this.getStatus(orderDataForEdit.status) ? this.getStatus(orderDataForEdit.status) : ''
    return (
      <div>
      { this.state.loadervisible ?
        <div className="fullpage-loader">
          <span className="loaderimg">
              <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </span>
        </div> :
      "" }

        {/* order modal open */}
        <ReactModal
          isOpen={this.props.editModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Edit Order</h5>
              <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span> {_.get(orderDataForEdit, 'created.name', '') !== '' ? _.get(orderDataForEdit, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">What are we picking up and how much of it?</h4>
                  <div className="form-group material-textfield">
                    <select name ="containersize" disabled={this.getStatus(orderDataForEdit.status) === "Complete" ? true : false} value={this.state.containersize} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
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

                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mb-2">
                  {container === "1/2 Yard" && _.get(orderDataForEdit, 'parentId', '') !== null &&
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
                    {container === "1/2 Yard" && _.get(orderDataForEdit, 'parentId', '') !== null &&
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
                      {container === "1/2 Yard" && _.get(orderDataForEdit, 'parentId', '') !== null &&
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
                    {container === "1/2 Yard" && _.get(orderDataForEdit, 'parentId', '') !== null &&
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
                    <MapComponent position={_.get(this.state, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(this.state, 'container', ''))}/>
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
                      <option value="">Select placement</option>
                      <option value="On Street">On Street</option>
                      <option value="In Lot/Yard">In Lot/Yard</option>
                      <option value="Inside Building">Inside Building</option>
                      <option value="In Driveway">In Driveway</option>
                      <option value="Other">Other</option>
                    </select>
                    <label className="material-textfield-label"> Placement </label>
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
                    {/* <select name="parking" onChange={this.onHandleChange.bind(this)} value={this.state.parking} className="form-control material-textfield-input custom-select">
                      <option>Select Parking</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select> */}
                    <label className="material-textfield-label">Parking</label>
                  </div>
                </div>
              { this.getContainerName(this.state.containersize) !== 'Live Load' && this.getContainerName(this.state.containersize) !== '1/2 Yard' ?
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <select name="permit" onChange={this.onHandleChange.bind(this)} value={this.state.permit} className="form-control material-textfield-input custom-select">
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
                  <h4 className="single-heading">When do you want the container(s)?</h4>
                  <div className="form-group material-textfield">
                    <DatePicker
                      className="form-control material-textfield-input"
                      selected={this.state.deliverydate}
                      disabled={this.getStatus(orderDataForEdit.status) === "Complete" ? true : false}
                      onChange={this.handleDateChange.bind(this)}
                      minDate={new Date()}
                      required />
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
                { this.getAdditionalDropDown() }
              </div>

              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Payment Information?</h4>
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
                <div className="row">
                    <div className="col-md-12">
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
                </div>
                <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <select name="pricingtype" value={this.state.pricingtype} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select Pricing Type</option>
                      <option value="Matrix">Matrix</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                    <label className="material-textfield-label">Pricing Type </label>
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
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group material-textfield dollarsign">
                    <CurrencyInput
                      precision={2}
                      className="form-control material-textfield-input"
                      placeholder=''
                      name="consumercost"
                      value={this.state.consumercost}
                      onChangeEvent={this.handleChangeMoney.bind(this)}
                      required
                    />
                    <label className="material-textfield-label address-focus-label">Total Price <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.consumercost ? err.consumercost : ""}</p>
                  </div>
                </div>
              </div>



              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Internal Details</h4>
                </div>
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select disabled={this.getStatus(orderDataForEdit.status) === "Complete" ? true : false} className="form-control material-textfield-input custom-select" name="haulercompany" value= {this.state.haulercompany} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
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
                { statusCheck && statusCheck === "Complete" && container && (container !== "Live Load") ?
                <div className="col-md-6">
                  <div className="form-group material-textfield material-textfield-lg dollarsign">
                    {/* <input
                      type="number"
                      className="form-control material-textfield-input h-66"
                      name="cost"
                      value={this.state.cost}
                      onChange={(event) => this.onchange('cost', event.target.value)}
                      required /> */}
                      <CurrencyInput
                        precision={2}
                        className="form-control material-textfield-input"
                        placeholder=''
                        name="cost"
                        value={this.state.cost}
                        onChangeEvent={this.handleChangeMoney.bind(this)}
                        required
                      />

                    <label className="material-textfield-label address-focus-label">Dump Cost <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.dumpcost ? err.dumpcost : ""}</p>
                  </div>
                </div> : "" }
                {statusCheck && statusCheck === "Complete" && container && (container !== "Live Load")  ?
                <div className="col-md-6">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="dumpticketnumber"
                      value={this.state.dumpticketnumber}
                      onChange={(event) => this.onchange('dumpticketnumber', event.target.value)}
                      required />
                    <label className="material-textfield-label">Dump Ticket Number<span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.dumpcost ? err.dumpcost : ""}</p>
                  </div>
                </div> : "" }
                { container && (container !== "Live Load") && ( String(statusCheck).includes('Future Exchange') || statusCheck == "Future Removal") ?
                <div className="col-md-12">
                <div className="form-group material-textfield material-textfield-select">
                  <select name="dumpsite" value= {this.state.dumpsite} onChange={(e) => this.onchange('dumpsite', e.target.value)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                    <option defaultValue="">Select Dump</option>
                    { _.get(this.props, "dumps", []).map((dump, i)=>{
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
              {this.getStatus(orderDataForEdit.status) === "Complete" ?
                <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <ul className="pdf-upload-list">
                          {this.state.pdf && this.state.pdf.length > 0 ? this.state.pdf.map((file, index) => {
                            return (
                              <li key={index}>{file.name}</li>
                            )
                          }) : ''}
                        </ul>
                        <Dropzone className="dropzone-droparea" onDrop={acceptedFiles => this.onDrop(acceptedFiles)} >
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone-text" {...getRootProps()}><input {...getInputProps()} />Upload Dump Tickets </div>
                          )}
                        </Dropzone>
                        {this.state.fileError && <p className="text-danger">{this.state.fileError}</p>}
                      </div>
                    </div>

                  <div className="col-md-12">

                  <ul className="order-listing subs-list minuslist">
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="totalpercentage"
                          value={this.state.totalpercentage}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Total % (yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="weight_total"
                          value={Math.round(this.state.weight_total)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Total % (tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="weight"
                          value={this.state.weight}
                          onChange={(event) => this.onchange('weight', event.target.value)}
                          required />
                        <label className="material-textfield-label">Weight(tons) <span className="text-danger">*</span></label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="waste"
                          value={this.state.waste}
                          onChange={(event) => this.onchange('waste', event.target.value)}
                          required />
                        <label className="material-textfield-label">Waste % (Yards)<span className="clr-red">*</span></label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[0].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Waste % (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[0].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Waste Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="brick"
                          value={this.state.brick}
                          onChange={(event) => this.onchange('brick', event.target.value)}
                          required />
                        <label className="material-textfield-label">Brick % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[1].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Brick % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[1].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Brick Weight (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="dirt"
                          value={this.state.dirt}
                          onChange={(event) => this.onchange('dirt', event.target.value)}
                          required />
                        <label className="material-textfield-label">Dirt % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[2].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Dirt % (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[2].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Dirt Weight (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="concrete"
                          value={this.state.concrete}
                          onChange={(event) => this.onchange('concrete', event.target.value)}
                          required />
                        <label className="material-textfield-label">Concrete % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[3].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Concrete % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[3].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Concrete Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="cleanwood"
                          value={this.state.cleanwood}
                          onChange={(event) => this.onchange('cleanwood', event.target.value)}
                          required />
                        <label className="material-textfield-label">Wood % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[4].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Wood % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[4].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Wood Weight (Tons) </label>
                      </div>
                    </li>

                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="metal"
                          value={this.state.metal}
                          onChange={(event) => this.onchange('metal', event.target.value)}
                          required />
                        <label className="material-textfield-label">Metal % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[5].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Metal % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[5].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Metal Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="paper_cardboard"
                          value={this.state.paper_cardboard}
                          onChange={(event) => this.onchange('paper_cardboard', event.target.value)}
                          required />
                        <label className="material-textfield-label">Paper/Cardboard % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[6].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Paper/Cardboard % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[6].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Paper/Cardboard Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="plastic"
                          value={this.state.plastic}
                          onChange={(event) => this.onchange('plastic', event.target.value)}
                          required />
                        <label className="material-textfield-label">Plastic % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[7].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Plastic % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[7].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Plastic Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="drywall"
                          value={this.state.drywall}
                          onChange={(event) => this.onchange('drywall', event.target.value)}
                          required />
                        <label className="material-textfield-label">Drywall % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[8].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Drywall % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[8].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Drywall Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="glass"
                          value={this.state.glass}
                          onChange={(event) => this.onchange('glass', event.target.value)}
                          required />
                        <label className="material-textfield-label">Glass % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[9].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Glass % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[9].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Glass Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="asphalt"
                          value={this.state.asphalt}
                          onChange={(event) => this.onchange('asphalt', event.target.value)}
                          required />
                        <label className="material-textfield-label">Asphalt % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[10].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Asphalt % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[10].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Asphalt Weight (Tons) </label>
                      </div>
                    </li>

                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66 transparent-field"
                          name="parking"
                          value={Math.round(this.state.recyclingpercentage)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label labelbold">Recycling % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66 transparent-field"
                          name="parking"
                          value={Math.round(this.state.residualpercentage)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label labelbold">Residual Waste % (Tons) </label>
                      </div>
                    </li>

                  </ul>
                </div>
              </div> : "" }
              <button disabled={this.state.addressErr} onClick={this.sendOrder.bind(this, false)} className="btn btn-dark btn-lg w-100 font-800">Update Order</button>
            </div>
          </div>
          {this.state.newContactModalIsOpen &&
        <NewContactModal
          newContactModalIsOpen = {this.state.newContactModalIsOpen}
          closeCustomerModal ={this.closeCustomerModal.bind(this)}
          addNewCustomer={this.addNewCustomer.bind(this)}
          customerAddMessage={this.state.customerAddMessage}
          {...this.props}
        /> }
        {this.state.errModal &&
          <ErrorModal
            errModal={this.state.errModal}
            closeModal={this.closeErrModal.bind(this)}
          />
        }
        </ReactModal>
      </div>
    )
  }
}

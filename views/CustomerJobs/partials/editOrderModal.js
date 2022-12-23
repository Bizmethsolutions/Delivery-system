import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'
import "react-datepicker/dist/react-datepicker.css"

import AddressAutoComplete from '../../../components/AddressAutoComplete'
import ErrorModal from '../../../components/errorModal'
import MapComponent from '../../../components/map'
import { formatGeoAddressComponents, formatOrderAddess, getTimeInDayAndHours, getFormatedDateAndTimeWithoutUTC, getDateMMDDYYYHHMM, formatPhoneNumber, getDay, getDate, getContainerSize } from '../../../components/commonFormate'
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'
import minusIcon from '../../../images/minusIcon.svg'
import plusIcon from '../../../images/plusIcon.svg'
import MultiSelectCheckBox from '../../../components/multiSelectCheckBox';
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
      purchaseorderno: "", permit: '',
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
      email: "",
      contactemail: "",
      errModal: false,
      addressErr: false
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
      permit: _.get(orderDataForEdit, 'permit', 'false') ? 'yes' : 'no',
      location: _.get(orderDataForEdit, 'location', ''),
      purchaseorderno: _.get(orderDataForEdit, 'purchaseordernumber', ''),
      timezone: _.get(orderDataForEdit, 'timezone', ''),
      email: _.get(orderDataForEdit, 'orderEmail.id', ''),
      contactemail: _.get(orderDataForEdit, 'contactEmail.id', ''),
      // consumercost: _.get(orderDataForEdit, 'consumercost', ''),
      // haulercompany: _.get(orderDataForEdit, 'haular.id', ''),
      specialinstruction: _.get(orderDataForEdit, 'specialinstruction', ''),
      containerlocation: _.get(orderDataForEdit, 'containerlocation', ''),
      otherPlacement: _.get(orderDataForEdit, 'otherPlacement', ''),
      placement: _.get(orderDataForEdit, 'placement', ''),
      // paymenttype: _.get(orderDataForEdit, 'paymenttype', ''),
      orderedby: _.get(orderDataForEdit, 'orderedby', ''),
      orderedbycontact: _.get(orderDataForEdit, 'orderedbycontact', ''),
      // pricingtype: _.get(orderDataForEdit, 'pricingtype', ''),
      additionalEmail: _.get(orderDataForEdit, 'additional_email', []),
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
      contactname: _.get(orderDataForEdit, 'contactname', ''),
      // purchaseorderno: _.get(orderDataForEdit, 'purchaseordernumber', ''),
      live_load_yard: _.get(orderDataForEdit, 'live_load_yard', ''),
      deliverydate: deliverydateCal,
      deliveryday:  getDay(deliverydateCal.getDay())
    })
    const { selectedCustomer } = this.props
    let divTag = []
    _.get(orderDataForEdit, 'otherDebris', []).map((other)=>{
      divTag.push({ otherDebris: other })
    })
    let typeofdebris = []
    // _.get(orderDataForEdit, 'otherDebris', []).map((other)=>{
    //   divTag.push({ otherDebris: other })
    // })

    if (Array.isArray(_.get(orderDataForEdit, 'typeofdebris', ''))) {
      typeofdebris= _.get(orderDataForEdit, 'typeofdebris', [])
    } else {
      typeofdebris.push("Other")
      divTag.push({ otherDebris: _.get(orderDataForEdit, 'typeofdebris', '') })
    }
    if (divTag.length !== 0) {
      this.setState({ divTag, otherSelect: false })
    }
    // const { selectedCustomer } = this.props
    this.setState({
      typeofdebris,
      addEmail: _.get(selectedCustomer, 'additionalemail', []),
      addName: _.get(selectedCustomer, 'additionalname', []),
    })
    let datau = { user : {
        id: localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype")
      }
    }
    this.props.getUser(datau)

    let data = {
      limit: 20, by: 1, page: 0, sort_field: ''
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

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDataForEdit.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
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
    const { state, city, new_address,email, contactemail,zipcode, contactname, haulercompany, typeofdebris, deliverydate, contactnumber, consumercost, err, live_load_yard, half_yrd_qty, containersize, containerlocation, otherPlacement, placement, orderedby, orderedbycontact } = this.state
    if(email === "") {
      errObj.email = "Order person email is required"
    }
    if(contactemail === "") {
      errObj.contactemail = "Job-Site contact email is required"
    }
    // if(contactnumber === "") {
    //   errObj.contactnumber = "Contact number is required"
    // }
    // if(consumercost === "") {
    //   errObj.consumercost = "Total cost is required"
    // }

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
    // if(haulercompany === "") {
    //   errObj.haular = "Hauler is required"
    // }
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
    let orderData = orderDataForEdit
    if(Object.keys(err).length === 0) {
      const { city, address, state, zipcode, new_address,
        borough, neighborhood, street_no, route,
        geoPlaceId, floor,
        permit, deliveryday, deliverydate, typeofdebris, containersize,
        parking, location, purchaseorderno, timezone,
        specialinstruction, containerlocation, placement,
        additionalEmail, otherPlacement, half_yrd_qty,live_load_yard, email, contactemail } = this.state
      const timezoneOfUser = Intl.DateTimeFormat().resolvedOptions().timeZone
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
      let ordereddate = moment().tz(timezoneOfUser).format('MM-DD-YYYY')
      orderData.city = city
      orderData.orderEmail =  orderEmail
      orderData.contactEmail = contactEmail
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
      orderData.isApproved = false
      orderData.sendEmail = false
      // orderData.typeofdebris = typeofdebris
      orderData.container = containersize
      orderData.parking = parking
      orderData.purchaseordernumber = purchaseorderno
      orderData.contactname = contactname
      // orderData.consumercost = consumercost
      orderData.specialinstruction = specialinstruction
      orderData.containerlocation = containerlocation
      orderData.placement = placement
      // orderData.paymenttype = paymenttype
      orderData.orderedby = orderedby
      orderData.orderedbycontact = formatPhoneNumber(orderedbycontact)
      // orderData.pricingtype = pricingtype
      orderData.live_load_yard = live_load_yard
      orderData.half_yrd_qty = half_yrd_qty
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
        orderData.typeofdebris = typeofdebris
        orderData.otherDebris = otherDebris
      } else {
        debrisArr.push("Other")
        orderData.typeofdebris = debrisArr
        otherDebrisArray.push(this.state.typeofdebris)
        orderData.otherDebris = otherDebrisArray
      }

      // orderData.otherDebris = otherDebris
      let haular ={}
      // let haulerIndex = _.get(this.state, 'haulerList', []).findIndex(x => x.id ===haulercompany)
      // if (haulerIndex !== -1) {
      //   haular = this.state.haulerList[haulerIndex]
      // }
      orderData.additional_email = additionalEmail
      //orderData.haular = haular
      if (placement === 'Other') {
        orderData.otherPlacement = otherPlacement
      } else {
        orderData.otherPlacement = ''
      }
      orderData.created = {id: this.props.user && this.props.user._id ? this.props.user._id : "",
        name : this.props.user && this.props.user.username? this.props.user.username : ""}
        orderData.deliverydate = moment(deliverydate).format('YYYY-MM-DDTHH:mm:ss')
        orderData.customer = this.props.customerId
        //orderData.createdat = moment().format('YYYY-MM-DDTHH:mm:ss')
      try {
        let { value } = await this.props.updateOrder(orderData)
        this.closeModal()
        this.props.fetchOrders()
      } catch (e) {
        message.error(e,'Error updating order')
      }
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
    _.get(this.state, 'additionalEmail', []).map((data, index) => {
      selectedOption.push({ label: data, value: data })
    })

    let options = []
    for(let i=0 ; i <this.state.addEmail.length; i++) {
      options.push(
        { label: this.state.addEmail[i], value: this.state.addEmail[i] }
      )
    }
    return (
      <div className="btn-select form-control">
      <ReactMultiSelectCheckboxes
        className="multi-select-checkbox"
        options={options}
        onChange={this.handleSelectAddEmail.bind(this)}
        placeholderButtonLabel='Additional Contact'
        value={selectedOption}
      />
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
    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    let data = {
      search_string,
      limit,
      by,
      page,
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
    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
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

  render() {
    const { isViewModalOpen, isEditModalOpen, err } = this.state
    const { orderDataForEdit, user } = this.props
    let created = orderDataForEdit.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderDataForEdit.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderDataForEdit.createdat)
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
              <h5 className="react-modal-title">Edit Order Information</h5>
              <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span>  <span>By:</span>
              {_.get(orderDataForEdit, 'isApproved', false) ?
              _.get(orderDataForEdit, 'created.name', '') !== '' ? _.get(orderDataForEdit, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')
               : ""}

              </h6>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">What are we picking up and how much of it?</h4>
                  <div className="form-group material-textfield">
                    <select name ="containersize" value={this.state.containersize} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
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
                  <h4 className="single-heading-sm">Type of Debris <span className="text-danger">*</span></h4>
                </div>
                <div className="col-md-12">
                  <ul className="checkboxlists">
                    {this.state.debrisType.length !== 0 && this.state.debrisType.map((type, index) => {
                      return (
                        <li key={index} onClick={this.selectDebrish.bind(this, type)}>
                          <div class="form-group">
                            <input type="checkbox" checked={this.state.typeofdebris.indexOf(type) !== -1 ? true : false} />
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
                  <h4 className="single-heading">Where do you want the container(s)? </h4>
                  {/* <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="purchaseorderno"
                      value={this.state.purchaseorderno}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Purchase Order Number </label>
                  </div> */}
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
                    {_.get(this.state, 'location', '') !== '' ?
                    <MapComponent position={_.get(this.state, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(this.state, 'container', ''))}/> : ""}
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
                    {/* <select name="parking" onChange={this.onHandleChange.bind(this)} value={this.state.parking} className="form-control material-textfield-input custom-select">
                      <option>Select Parking</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select> */}
                    <label className="material-textfield-label">Parking</label>
                  </div>
                </div>
                {/* {this.getContainerName(this.state.containersize) !== '1/2 Yard' ? */}
                { this.getContainerName(this.state.containersize) !== "Live Load" && this.getContainerName(this.state.containersize) !== '1/2 Yard' ?
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
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select name="email" value={this.state.email} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select</option>
                      { _.get(this.state, "customersList", []).map((customer, i)=>{
                        return(
                          <option value={customer.id}>{customer.firstname} {customer.lastname}</option>
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
                          <option value={customer.id}>{customer.firstname} {customer.lastname}</option>
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
                {_.get(this.state, 'addEmail', []).length > 0 ? this.getAdditionalDropDown() : ""}
              </div>



              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Internal Details</h4>
                </div>
                {/* <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select className="form-control material-textfield-input custom-select" name="haulercompany" value= {this.state.haulercompany} onChange={this.onHandleChange.bind(this)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
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
                </div> */}
                {/* <div className="col-md-12">
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
                    <label className="material-textfield-label">Total Cost <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.consumercost ? err.consumercost : ""}</p>
                  </div>
                </div> */}
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
            />
          }
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

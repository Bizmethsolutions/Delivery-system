import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'
import CurrencyInput from "react-currency-input"
import AddCardModal from './addCardModal'

import AddressAutoComplete from '../../../components/AddressAutoComplete'
import ErrorModal from '../../../components/errorModal'
import MapComponent from '../../../components/map'
import { formatGeoAddressComponents, formatOrderAddess, formatPhoneNumber, getDay, formatNumber, getContainerSize, calculatePriceForExchange } from '../../../components/commonFormate'
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import "react-datepicker/dist/react-datepicker.css"
import '../styles.scss'
import config from '../../../config'
import MultiSelectCheckBox from '../../../components/multiSelectCheckBox';
import minusIcon from '../../../images/minusIcon.svg'
import plusIcon from '../../../images/plusIcon.svg'
import NewContactModal from '../../../components/newContactModal'
const { TabPane } = Tabs;
const { Option } = Select;

const timezoneKey = config.timezone_api_key.api_key
const timezoneApi = config.timezone_api_key.api_url
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
      email: '',
      contactemail: '',
      neighborhood: '',
      location: {},
      street_no: '',
      route: '',
      newContactModalIsOpen:false,
      geoPlaceId: '',
      floor: '',
      contactnumber: '',
      contactname: '',
      permit: '',
      amount: "",
      permitPrice: "",
      taxes: "",
      totalamount: "",
      deliveryday: "", deliverydate: "",
      typeofdebris: [], containersize: "",
      parking: '', location: "",
      purchaseorderno: "",
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
      cardId: "",
      search_string: '',
      sort_field: 'companyname',
      by: 1,
      page: 0,
      limit: 20,
      errModal: false,
      addressErr: false,
      live_load_yard: 0,
      half_yrd_qty: 0
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.addNewCustomer = this.addNewCustomer.bind(this)
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
    const { selectedCustomer, orderData, addOrderModalIsOpen } = this.props
    this.setState({
      city: _.get(orderData, 'city', ''),
      address: _.get(orderData, 'address', ''),
      state: _.get(orderData, 'state', ''),
      zipcode: _.get(orderData, 'zipcode', ''),
      new_address: _.get(orderData, 'new_address', ''),
      borough: _.get(orderData, 'borough', ''),
      neighborhood: _.get(orderData, 'neighborhood', ''),
      street_no: _.get(orderData, 'street_no', ''),
      route: _.get(orderData, 'route', ''),
      geoPlaceId: _.get(orderData, 'geoPlaceId', ''),
      floor: _.get(orderData, 'floor', ''),
      contactnumber: _.get(orderData, 'contactnumber', ''),
      permit: _.get(orderData, 'permit', false) ? 'yes' : 'no',
      location: _.get(orderData, 'location', ''),
      purchaseorderno: _.get(orderData, 'purchaseordernumber', ''),
      timezone: _.get(orderData, 'timezone', {}),
      consumercost: _.get(orderData, 'consumercost', ''),
      haulercompany: _.get(orderData, 'haulercompany', ''),
      specialinstruction: _.get(orderData, 'specialinstruction', ''),
      containerlocation: _.get(orderData, 'containerlocation', ''),
      otherPlacement: _.get(orderData, 'otherPlacement', ''),
      placement: _.get(orderData, 'placement', ''),
      paymenttype: _.get(orderData, 'paymenttype', ''),
      orderedby: _.get(orderData, 'orderedby', ''),
      orderedbycontact: _.get(orderData, 'orderedbycontact', ''),
      pricingtype: _.get(orderData, 'pricingtype', ''),
      additionalEmail: _.get(orderData, 'additionalEmail', []),
      containersize: _.get(orderData, 'containersize', ''),
      typeofdebris: _.get(orderData, 'typeofdebris', []),
      otherDebris: _.get(orderData, 'otherDebris', []),
      parking: _.get(orderData, 'parking', ''),
      // paymenttype: _.get(orderData, 'paymenttype', ''),
      // orderedby: _.get(orderData, 'orderedby', ''),
      half_yrd_qty: _.get(orderData, 'half_yrd_qty', ''),
      live_load_yard: _.get(orderData, 'live_load_yard', ''),
      haular: _.get(orderData, 'haular', ''),
      orderid: _.get(orderData, 'orderid', ''),
      geoPlaceId: _.get(orderData, 'geoPlaceId', ''),
      // additional_email: _.get(orderData, 'additional_email', ''),
      additionalEmail: _.get(orderData, 'additional_email', []) !== null ? _.get(orderData, 'additional_email', []) : [],
    })

    let typeofdebris = []
    let divTag = []


    if (orderData && orderData.typeofdebris) {
      _.get(orderData, 'otherDebris', []).map((other)=>{
        divTag.push({ otherDebris: other })
      })

      if (Array.isArray(_.get(orderData, 'typeofdebris', ''))) {
        typeofdebris= _.get(orderData, 'typeofdebris', [])
      } else {
        typeofdebris.push("Other")
        divTag.push({ otherDebris: _.get(orderData, 'typeofdebris', '') })
      }
    }

    if (divTag.length !== 0) {
      this.setState({ divTag, otherSelect: false })
    }

    this.setState({
      typeofdebris,
      // addEmail: _.get(selectedCustomer, 'additionalemail', []),
      // addName: _.get(selectedCustomer, 'additionalname', []),
      selectedCustomer
    })
    let datau = { user : {
        id: localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype")
      }
    }
    this.props.getUser(datau)

    let data = {
      limit: undefined, by: undefined, page: undefined, sort_field: ''
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []) })
    this.updateCustomer()
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
            this.setState({ addressErr: false, county: _.get(value, 'data[0].place', '') }, () => {
              this.updateCalculation()
            })
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
                this.setAddressState(geoDetails, result.formatted_address)
                this.setState({ addressErr: false, county: _.get(value, 'data[0].place', '') }, () => {
                  this.updateCalculation()
                })
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
        this.updateCalculation()
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
      purchaseorderno: "", permit: 'no',
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      specialinstruction: "", containerlocation: "", paymenttype: "",
      orderedby: "", orderedbycontact: "", placement: '', otherPlacement: "",
      half_yrd_qty: '',
      live_load_yard: '',
      // additionalEmail: '',
      selectedOption: '',
      timezone: {}, err: {},
      additionalEmail: []
    }
  }

  validate() {
    let errObj = {}
    const {
      state, city, new_address,zipcode, orderedby, orderedbycontact,
      typeofdebris, deliverydate ,haulercompany, contactname,
      contactnumber, consumercost, err, live_load_yard, half_yrd_qty,
      containersize, otherPlacement, placement, email, contactemail
    } = this.state

    if(email === "") {
      errObj.email = "Order person email is required"
    }
    if(contactemail === "") {
      errObj.contactemail = "Job-Site contact email is required"
    }

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
      if (!live_load_yard) {
        errObj.live_load_yard = "Yardage is required"
      }
    } else if(containerName === "1/2 Yard") {
      if (!half_yrd_qty && live_load_yard === "") {
        errObj.half_yrd_qty = "Minis is required"
      }
    }
    if(placement === "Other") {
      if (!otherPlacement && otherPlacement === "") {
        errObj.otherPlacement = "Other placement is required"
      }
    }

    if(this.props.selectedCustomer && this.props.selectedCustomer.isHomeCustomer) {
      if(this.state.cardId === "" || this.state.cardId === "select") {
        errObj.card = "Card is required"
        this.setState({ errMessage: "Please select a valid card."})
      } else {
        this.setState({ errMessage: ""})
      }
    }
    this.setState({ err: errObj })
  }

  sendOrder=async(isDraft)=> {
    await this.validate()
    const {err} = this.state

    if(Object.keys(err).length === 0) {
      const { user } = this.props
      const { city, address, state, zipcode, new_address,
        borough, neighborhood, street_no, route,
        geoPlaceId, floor,
        permit, deliveryday, deliverydate, typeofdebris, containersize,
        parking, location, purchaseorderno, timezone,live_load_yard,half_yrd_qty, email, contactemail,
        consumercost, haulercompany, specialinstruction, containerlocation, otherPlacement, paymenttype, placement,
        pricingtype, additionalEmail, cardId, totalamount, couponCode } = this.state
      const timezoneOfUser = user && _.get(user, 'timezone.tzName', '') !== '' ? _.get(user, 'timezone.tzName', '')
       : Intl.DateTimeFormat().resolvedOptions().timeZone
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
      let obj = {
        city, address, state, zipcode, new_address,
        borough, neighborhood, location, street_no, route,
        geoPlaceId, floor, timezone,
        visible: true, parentId: null,
        isQueueOrder: false,
        isCustomerOrder: false,
        ordereddate: ordereddate, save_as_draft: isDraft,
        contactnumber: formatPhoneNumber(contactnumber),
        permit, deliveryday, typeofdebris, container: containersize,
        parking, purchaseordernumber: purchaseorderno, contactname,
        consumercost: consumercost && consumercost !== "" && consumercost !== undefined? consumercost.toString().replace(/,/g, '') : '',
        specialinstruction, containerlocation, paymenttype, placement,
        orderedby, orderedbycontact: orderedbycontact !== "" ? formatPhoneNumber(orderedbycontact) : "", pricingtype,
        isApproved: true, orderEmail, contactEmail
      }
      const isHomeCustomer = _.get(this.props, 'selectedCustomer.isHomeCustomer', false)
      let idx = typeofdebris.indexOf("Other")
      let otherDebris = []
      if (idx !== -1) {
        for(let i=0; i< this.state.divTag.length; i++) {
      		if(this.state.divTag[i].otherDebris){
      			otherDebris.push(this.state.divTag[i].otherDebris);
      		}
        }
        obj.otherDebris = otherDebris
      }
      let haular ={}
      let haulerIndex = _.get(this.state, 'haulerList', []).findIndex(x => x.id ===haulercompany)
      if (haulerIndex !== -1) {
        haular = this.state.haulerList[haulerIndex]
      }
      if (placement === 'Other') {
        obj.otherPlacement = otherPlacement
      }
      obj.live_load_yard = live_load_yard
      obj.half_yrd_qty = half_yrd_qty
      obj.permit = permit === "yes" ? true : false
      obj.additional_email = []
      _.get(this.state, 'additionalEmail',[]).map((email)=>{
        let index = _.get(this.state, 'customersList', []).findIndex(x => x.email === email || x.id === email);
        if(index !== -1) {
          obj.additional_email.push(this.state.customersList[index].id)
        }
      })
      obj.haular = haular
      obj.created = {id: this.props.user && this.props.user._id ? this.props.user._id : "",
        name : this.props.user && this.props.user.username? _.get(this.props.user, 'username', '') : _.get(this.props.user, 'firstname', '')}
      obj.deliverydate = moment(deliverydate).format('YYYY-MM-DDTHH:mm:ss')
      obj.customer = _.get(this.props.orderData, 'customer', '') !== "" ? _.get(this.props.orderData, 'customer', '') : this.props.customerId
      obj.createdat =new Date()
      obj.isApproved =true
      obj.chargeAmount = totalamount ? totalamount.toFixed(2) : ''
      this.props.statusList.forEach(function (element) {
        if (element.status === "Pending Delivery") {
          obj.status = element._id
        }
      })
      if(isHomeCustomer) {
        const { chargeForExchange } = this.props
        const data = {
          cardId,
          amount: totalamount,
          customerId: this.props.selectedCustomer && this.props.selectedCustomer.id,
          orderId: "",
          couponCode: this.state.couponCode,

        }
        const { value } = await chargeForExchange(data)
        if(value && value.type === "success") {
          try {
            let { value } = await this.props.addOrder(obj)
            this.closeModal()
            this.props.fetchOrders()
          } catch (e) {
            this.setState({errMessage: _.get(e, 'error.message', '')})
          }
        } else {
          message.error("Charge was unsuccessfull!")
        }
      } else {
        try {
          let { value } = await this.props.addOrder(obj)
          this.closeModal()
          this.props.fetchOrders()
        } catch (e) {
          this.setState({errMessage: _.get(e, 'error.message', '')})
        }
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
    // _.get(this.state, 'additionalEmail', []).map((data, index) => {
    //   selectedOption.push({ label: data, value: data })
    // })
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
      this.updateCalculation()
      if (typeofdebris.indexOf("Other") !== -1) {
        if (this.state.otherSelect) {
          this.addDivTag()
          this.setState({ otherSelect: false })
        }
      } else {
        this.setState({ divTag: [], otherSelect: true })
      }
      this.updateCalculation()
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

  closeCardModal() {
    this.setState({ openCard: false }, ()=> {
      this.updateCustomer()
    })
  }

  closeCustomerModal() {
    this.setState({ newContactModalIsOpen: false }, ()=> {
      this.fetchCustomersForList()
    })
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
      let idx = _.get(value, 'customers', []).findIndex(obj => obj.customerid === _.get(this.props.selectedCustomer, 'customerid', ''))
      let selectedCustomer =  value.customers[idx]
      this.setState({ selectedCustomer })
    }
    this.updateCalculation()
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

  updateCalculation() {
    let containerName = getContainerSize(this.props.containerList, _.get(this.state, 'containersize', ''));
    const county = this.state.county
    const cal = calculatePriceForExchange(containerName, this.state.typeofdebris, county)
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

  openAddCard() {
    this.setState({ openCard: true })
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

  formatNumber(number) {
    const nfObject = new Intl.NumberFormat('en-US');
    const output = nfObject.format(number);
    return output
  }

  openCustomerModal() {
    this.setState({ newContactModalIsOpen: true, customerAddMessage: "" })
  }

  render() {
    const { isViewModalOpen, isEditModalOpen, err } = this.state
    const isHomeCustomer = _.get(this.props, 'selectedCustomer.isHomeCustomer', false)
    return (
      <div>
        {/* order modal open */}
        <ReactModal
          isOpen={this.props.addOrderModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Add Order</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">What are we picking up and how much of it? </h4>
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
                          <div className="form-group">
                            <input type="checkbox" readOnly checked={this.state.typeofdebris.indexOf(type) !== -1 ? true : false} />
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
              {_.get(this.state, 'location', '') !== '' ?
              <div className="row">
                <div className="col-md-12">
                  <div className="modalmap">
                  {_.get(this.state, 'location', '') !== '' ?
                    <MapComponent position={_.get(this.state, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(this.state, 'container', ''))}/>
                  : ""}
                  </div>
                </div>
              </div>: ""}

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
                    <option value="">Select Placement</option>
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
                      <label className="material-textfield-label">Other Placement<span className="text-danger">*</span> </label>
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
                      className="form-control material-textfield-input h-66"
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
                </div> */}
                {/* <div className="col-md-6">
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
                {/* <div className="col-md-12">
                <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "email"
                      value={this.state.email}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Email</label>
                    <p className="text-danger">{err && err.email ? err.email : ""}</p>
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
              </div>
              <div className="row">
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
                {/* <div className="col-md-12">

                <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name= "contactemail"
                      value={this.state.contactemail}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Job-Site Contact Person Email </label>
                    <p className="text-danger">{err && err.contactemail ? err.contactemail : ""}</p>
                  </div>
                </div> */}
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="single-heading">Payment Information?</h4>
                </div>
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

                {/* <div className="col-md-12"> */}

                {/* </div> */}
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield dollarsign">
                    <CurrencyInput
                      precision={0}
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
              {isHomeCustomer ?
                <div>
                  <div className="totalpayment">
                    <h4>Price Breakdown</h4>
                    <p>Base <span>{this.state.amount !== '' ? `$${this.formatNumber(this.state.amount)}` : ''}</span></p>
                    {getContainerSize(this.props.containerList, this.state.containersize) === "Live Load" ? <p>Trucking Rate <span>{this.state.truckingrate !== '' ? `$${this.formatNumber(this.state.truckingrate)}` : ''}</span></p> : "" }
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
                        <p className="text-danger">{err && err.card ? err.card : ""}</p>
                      </div>
                      : "" }
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
                {this.state.errMessage ? <p className="text-danger">{this.state.errMessage}</p> : ""}
              <button disabled={this.state.addressErr} onClick={this.sendOrder.bind(this, false)} className="btn btn-dark btn-lg w-100 font-800">Create Order</button>
            </div>
          </div>
          <AddCardModal
          openCardModal = {this.state.openCard}
          closeCardModal ={this.closeCardModal.bind(this)}
          customerid = {_.get(this.props.selectedCustomer, 'id', '')}
          {...this.props}
        />
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

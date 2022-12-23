import React, { PureComponent } from 'react'
// import { Link } from 'react-router-dom'
import { Menu, Dropdown, Popconfirm, message } from 'antd'
// import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import _ from "lodash"

import config from '../../config/index'
// import { Menu, Dropdown, Popconfirm, message } from 'antd'
import { CloseIcon, MoreIcon } from '../../components/icons'
import { formatPhoneNumber, formatGeoAddressComponents ,formatOrderAddess } from '../../components/commonFormate'
import AddressAutoComplete from '../../components/AddressAutoComplete'
import minusIcon from './../../images/minusIcon.svg'
import plusIcon from './../../images/plusIcon.svg'

import './styles.scss'
const phoneNumberMask = config.phoneNumberMask

export default class CustomersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      search_string: '',
      sort_field: 'companyname',
      by: 1,
      page: 0,
      limit: 20,
      customers: [],
      companyname: "", email: "",
			streetname: "", phone: "",
			townname: "", fax: "",
			zipcode: "", other: "",
			contactname: "", website: "",
			mobile: "", exception: { status: false, msg: [] },
			confirm: false,
			divTag: [],
			additionalname: [],
      additionalemail: [],
      firstname: "",
      lastname: "",
      additionalErrors: [],
      error: {},
      customerid: '',
      id: '',
      state: '',
      messageShown: true,
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount () {
    let divTag = []
    // this.fetchCustomers()
    let { customerInfo } =this.props
    if (_.get(customerInfo, 'additionalname', []) .length > 0 &&
    _.get(customerInfo, 'additionalemail', []).length> 0) {
      _.get(customerInfo, 'additionalemail', []).map((obj, i)=>{
        divTag.push({
          companyname: customerInfo.additionalname[i],
          email: customerInfo.additionalemail[i],
        })
      })
    }

    this.setState({
      companyname: _.get(customerInfo, 'companyname', ''),
      email: _.get(customerInfo, 'email', ''),
      streetname: _.get(customerInfo, 'streetname', ''),
      phone: _.get(customerInfo, 'phone', ''),
      townname: _.get(customerInfo, 'townname', ''),
      mobile: _.get(customerInfo, 'mobile', ''),
      state: _.get(customerInfo, 'state', ''),
      fax: _.get(customerInfo, 'fax', ''),
      zipcode: _.get(customerInfo, 'zipcode', ''),
      other: _.get(customerInfo, 'other', ''),
      contactname: _.get(customerInfo, 'contactname', ''),
      firstname: _.get(customerInfo, 'firstname', ''),
      lastname: _.get(customerInfo, 'lastname', ''),
      website: _.get(customerInfo, 'website', ''),
      // additionalname: _.get(customerInfo, 'additionalname', []),
      // additionalemail: _.get(customerInfo, 'additionalemail', []),
      customerid: _.get(customerInfo, 'customerid', []),
      id: _.get(customerInfo, 'id', []),
      divTag
    })

  }

  addDivTag(){
		this.setState({
			divTag: this.state.divTag.concat([{
				 companyname: '',
				 email: ''
			}])
		})
	}

  additional(){
		return this.state.divTag.map((object, index)=>(
      <div className="row" key={index}>
        <div className="col-md-6">
          <div className="form-group material-textfield">
            <input
              readOnly
              type="text"
              className="form-control material-textfield-input"
              value={object.companyname}
              onChange={this.handleDivOnChange('companyname', index)}
              required />
            <label className="material-textfield-label">Additional Name {index+1}</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group material-textfield">
            <input
              readOnly
              type="text"
              className="form-control material-textfield-input"
              value={object.email}
              onChange={this.handleDivOnChange('email', index)}
              required />
            <label className="material-textfield-label">Additional Email {index+1} </label>
          </div>
        </div>
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

  onHandleChange (e) {
    if ( e.target.name === 'phone' || e.target.name === 'mobile' || e.target.name === 'fax' ) {
      this.setState({ [e.target.name]: formatPhoneNumber(e.target.value) })
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  handleDivOnChange(field, idx){
		let self = this
		return function(evt) {
			const newDivTag = self.state.divTag.map((divObject, sidx) => {
				// console.log("idx: ", idx, " sidx: ", sidx);
				if (idx !== sidx) return divObject
				if(field === 'companyname')
					return { ...divObject, companyname: evt.target.value }
				else if(field === 'email')
					return { ...divObject, email: evt.target.value }
			})
			self.setState({ divTag: newDivTag })
		}
	}

  closeModal () {
    this.props.closeModal()
  }

  onAddressSelect(suggest) {
    this.suggestedAddress = suggest
    if (suggest) {
      let geoDetails = formatGeoAddressComponents(suggest.gmaps, suggest.description)
      geoDetails.lat = suggest.location.lat
      geoDetails.lng = suggest.location.lng
      geoDetails.geoPlaceId = suggest.gmaps.place_id
      if (geoDetails.address === "") {
        geoDetails.address = suggest.gmaps.formatted_address
      }
      this.setAddressState(geoDetails, suggest.description)
    }
  }

  setAddressState(geoDetails, description) {
    this.setState({
      street_no: geoDetails.streetNo,
      floor: geoDetails.floor,
      route: geoDetails.route,
      streetname: geoDetails.address,
      address: description,
      location: {
          lat: geoDetails.lat,
          lng: geoDetails.lng
      },
      neighborhood: geoDetails.neighborhood,
      state: geoDetails.state,
      townname: geoDetails.city,
      latitute: geoDetails.lat,
      longitude: geoDetails.lng,
      borough: geoDetails.borough,
      zipcode: geoDetails.zipcode ? geoDetails.zipcode : "",
      geoPlaceId: geoDetails.geoPlaceId
    })
  }

  onChangeAddressField (value) {
    this.setState({ onAddressInputvalue: value },()=>{
      if (this.state.onAddressInputvalue ===""){
        this.setState({ streetname: ''})
      }
    })
  }

  render() {
    return (
      <div className="react-modal-dialog react-modal-dialog-centered">
        <div className="react-modal-header">
          <h5 className="react-modal-title">Customer Info </h5>
          <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
        </div>
        <div className="divider-line"></div>
        <div className="react-modal-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  type="text"
                  readOnly
                  className="form-control material-textfield-input"
                  name="companyname"
                  value={this.state.companyname}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Customer Name </label>
                <p className="text-danger">{_.get(this.state, 'error.companyname', '')}</p>
              </div>
            </div>
            </div>
            <div className="row">
            <div className="col-md-6">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="firstname"
                  value={this.state.firstname}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">First Name </label>
                <p className="text-danger">{_.get(this.state, 'error.firstname', '')}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="lastname"
                  value={this.state.lastname}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Last Name </label>
                <p className="text-danger">{_.get(this.state, 'error.lastname', '')}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="email"
                  value={this.state.email}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Email </label>
                <p className="text-danger">{_.get(this.state, 'error.email', '')}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group material-textfield">
              <InputMask
                readOnly
                guide={false}
                type="text"
                keepCharPositions={false}
                mask={phoneNumberMask}
                className="form-control material-textfield-input"
                name="phone"
                value={this.state.phone}
                onChange={this.onHandleChange}
                required/>
                <label className="material-textfield-label">Phone Number </label>
                <p className="text-danger">{_.get(this.state, 'error.phone', '')}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="streetname"
                  value={this.state.streetname}
                  onChange={this.onHandleChange}
                  required />
                <label className={this.state.streetname || this.state.onAddressInputvalue ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Address </label>
                <p className="text-danger">{_.get(this.state, 'error.streetname', '')}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="townname"
                  value={this.state.townname}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">City </label>
                <p className="text-danger">{_.get(this.state, 'error.townname', '')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="state"
                  value={this.state.state}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">State </label>
                <p className="text-danger">{_.get(this.state, 'error.state', '')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="zipcode"
                  value={this.state.zipcode}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Zip </label>
                <p className="text-danger">{_.get(this.state, 'error.zipcode', '')}</p>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="form-group material-textfield">
              <InputMask
                guide={false}
                type="text"
                keepCharPositions={false}
                mask={phoneNumberMask}
                className="form-control material-textfield-input"
                name="mobile"
                value={this.state.mobile}
                onChange={this.onHandleChange}
                required/>
                <label className="material-textfield-label">Mobile</label>
                <p className="text-danger">{_.get(this.state, 'error.mobile', '')}</p>
              </div>
            </div> */}
          </div>
          {/* <div className="row">
            <div className="col-md-6">
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="fax"
                  value={this.state.fax}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Fax</label>
                <p className="text-danger">{_.get(this.state, 'error.fax', '')}</p>
              </div>
            </div>
          </div> */}
          <div className="row">
            <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="other"
                  value={this.state.other}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Other</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  readOnly
                  type="text"
                  className="form-control material-textfield-input"
                  name="website"
                  value={this.state.website}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label"> Website</label>
                <p className="text-danger">{_.get(this.state, 'error.website', '')}</p>
              </div>
            </div>
          </div>
          {/* {this.additional()} */}
        </div>
      </div>
    )
  }
}

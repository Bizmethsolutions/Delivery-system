import React, { PureComponent } from 'react'
import { Switch, message } from 'antd'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import _ from "lodash"
import Dropzone from 'react-dropzone'

import { ArrowIcon, CloseIcon, MoreIcon } from '../../components/icons'
import TopNavigation from './../TopNavigation/container'
import { formatOrderAddess, formatGeoAddressComponents } from '../../components/commonFormate'
import AddressAutoComplete from '../../components/AddressAutoComplete'

import './styles.scss'

export default class SuperAdminComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      companyname: '',
      firstname: '',
      lastname: '',
      email: '',
      hauleremail: '',
      switchStatus: true,
      fields: ['companyname', 'lastname', 'firstname', 'email', 'hauleremail', 'domainurl'],
      error: {},
      searchKey: '',
      errorMessage: '',
      companies: [],
      image: "",
      sameEmail: false,
      address: "",
      state: "",
      city: "",
      zip: "",
      streetname: "",
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onChangeToggle = this.onChangeToggle.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.props.closeModal()
    // this.setState({ modalIsOpen: false })
  }

  onChangeToggle(checked) {
    this.setState({ switchStatus: checked })
    // console.log(`switch to ${checked}`);
  }

  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  componentDidMount () {
    console.log(this.props.companyDetail, 'updateeee')
    const { companyDetail } = this.props
    this.setState({
      companyname: _.get(companyDetail, 'companyname', ''),
      firstname: _.get(companyDetail, 'firstname', ''),
      lastname: _.get(companyDetail, 'lastname', ''),
      email: _.get(companyDetail, 'email', ''),
      hauleremail: _.get(companyDetail, 'hauleremail', ''),
      switchStatus: _.get(companyDetail, 'isActive', true),
      sameEmail: _.get(companyDetail, 'sameEmail', false),
      domainurl: _.get(companyDetail, 'domainurl', ''),
      showImage: _.get(companyDetail, 'logoUrl', ''),
      address: _.get(companyDetail, 'address', ''),
      state: _.get(companyDetail, 'state', ''),
      city: _.get(companyDetail, 'city', ''),
      zip: _.get(companyDetail, 'zip', ''),
      streetname:  _.get(companyDetail, 'streetname', ''),
    })
  }

  checkValidations () {
    const self = this
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let require = false
    let error = {}
    let errObj = {}
    // const { businessname, address, state, city, zip, streetname, image, businessemail } = this.state
    const { companyname, address, state, city, zip, lastname, streetname, firstname, email, hauleremail, switchStatus, domainurl, image } = this.state

    if(address === "" || streetname === "") {
      errObj.address = "Address is required"
      require = true
    }
    if(state === "") {
      errObj.state = "State is required"
      require = true
    }
    if(city === "") {
      errObj.city = "City is required"
      require = true
    }
    if(zip === "") {
      errObj.zip = "Zipcode is required"
      require = true
    }
    if(companyname === "") {
      errObj.companyname = "Companyname is required"
      require = true
    }
    if(lastname === "") {
      errObj.lastname = "Last name is required"
      require = true
    }
    if(lastname === "") {
      errObj.firstname = "First name is required"
      require = true
    }
    this.setState({ error: errObj })
    return require
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
      city: geoDetails.city,
      latitute: geoDetails.lat,
      longitude: geoDetails.lng,
      borough: geoDetails.borough,
      zip: geoDetails.zipcode ? geoDetails.zipcode : "",
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

  async updateCompany () {
    const { companyname,address, state, city, zip, lastname, streetname, firstname, email, hauleremail, switchStatus, domainurl, image } = this.state
    let validate = this.checkValidations()
    if (!validate) {
      let companyObj = {
        companyname,
        lastname,
        firstname,
        address, state, city, zip, lastname, streetname,
        email: email && email.toLowerCase(),
        hauleremail : this.state.sameEmail ? email && email.toLowerCase() :hauleremail && hauleremail.toLowerCase() ,
        // domainurl,
        image,
        sameEmail: this.state.sameEmail,
        isActive:switchStatus
      }
      const data = {companyObj}
      data.companyId =  _.get(this.props, 'companyDetail._id', '')
      try {
        let { value } = await this.props.updateCompany(data)
        this.setState({ companyname: '', firstname: '', lastname: '', email: '', hauleremail: '', switchStatus: true, errorMessage: '', domainurl: '', image: '' }, ()=>{
          message.success(value.message)
          this.props.getCompanyInfo()
          this.closeModal()
        })
      } catch (e) {
        this.setState({errorMessage: _.get(e, 'error.message', 'Error adding company') })
        // message.error(e.error.message)
      }
    }
  }

  onDrop (files) {
    const _URL = window.URL || window.webkitURL
    const image = []
    files.forEach(file => {
      if (file.type.split('/')[0] === 'image') {
        const img = new Image()
        const self = this
        const reader = new FileReader()
        reader.onloadend = () => {
          img.src = _URL.createObjectURL(file)
          img.onload = function () {
            /* eslint-disable */
            const name = file.name ? file.name.replace(/-|\s/g, '-').trim() : Math.floor(Math.random() * 100)
            image.push({ name, imagePreviewUrl: reader.result, imgIndex: image.length })
            if (image.length === 1) {
              self.setState({ image: image[0], showImage:  reader.result})
            } else {
              self.setState({ images: [] })
            }
          }
        }
        reader.readAsDataURL(file)
      } else {
        /* eslint-disable */
        alert('File Type Invalid')
      }
    })
  }

  changeSameEmail(checked) {
    this.setState({ sameEmail: !this.state.sameEmail })
  }

  render() {

    const { error } = this.state
    return (
      <div>
        <ReactModal
          isOpen={this.props.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Edit Company</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="companyname"
                      value={this.state.companyname}
                      required />
                    <label className="material-textfield-label">Company Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'error.companyname', '')}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="firstname"
                      value={this.state.firstname}
                      required />
                    <label className="material-textfield-label">First Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'error.firstname', '')}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="lastname"
                      value={this.state.lastname}
                      required />
                    <label className="material-textfield-label">Last Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'error.lastname', '')}</p>
                  </div>
                </div>
              </div>
              {/* <div className="row">
                <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  onChange= {this.onHandleChange}
                  name="email"
                  value={this.state.email}
                  required />
                <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                <p className="text-danger">{_.get(this.state, 'error.email', '')}</p>
              </div>
                </div>
                </div>
              <div class="form-group checkboxlists" onClick={this.changeSameEmail.bind(this)}>
                  <input type="checkbox" checked={this.state.sameEmail} />
                  <label>Hauler email is same as primary email</label>
              </div>
              {!this.state.sameEmail ?
              <div className="row">
                <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  onChange= {this.onHandleChange}
                  name="hauleremail"
                  value={this.state.hauleremail}
                  required />
                <label className="material-textfield-label">Hauler Email <span className="text-danger">*</span></label>
                <p className="text-danger">{_.get(this.state, 'error.hauleremail', '')}</p>
              </div>
                </div>
              </div> : "" } */}

              {/* <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="domainurl"
                      value={this.state.domainurl}
                      required />
                    <label className="material-textfield-label">Domain Name<span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'error.domainurl', '')}</p>
                  </div>
                </div>
              </div> */}

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <AddressAutoComplete
                      inputClassName={"form-control material-textfield-input"}
                      onSelect={(suggest) => this.onAddressSelect(suggest)}
                      onChange={(value) => this.onChangeAddressField(value)}
                      initialValue={this.state.streetname}
                    />
                    <label className={this.state.streetname || this.state.onAddressInputvalue ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Address <span className="text-danger">*</span></label>
                    <p className="text-danger">{error && error.address ? error.address : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="city"
                      value={this.state.city}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">City <span className="text-danger">*</span></label>
                    <p className="text-danger">{error && error.city ? error.city : ""}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="state"
                      value={this.state.state}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">State <span className="text-danger">*</span></label>
                    <p className="text-danger">{error && error.state ? error.state : ""}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="zip"
                      value={this.state.zip}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Zip <span className="text-danger">*</span></label>
                    <p className="text-danger">{error && error.zip ? error.zip : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
              <Dropzone
                  onDrop={this.onDrop.bind(this)}
                  multiple={false}
                >
                  {({ getRootProps, getInputProps }) => (
              <div className="profile-wrapper--avatar dropzone-border" {...getRootProps()}>
                    <input {...getInputProps()} /> Upload Image <br /> or<br />
                    <button className="btn btn-dark btn-sm font-600 mt-2 pl-4 pr-4">Drag & Drop</button>
                    <img src={this.state.showImage} alt="" className="previewimg"/>
              </div>
                  )}
              </Dropzone>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mt-4">
              <div className="form-group d-flex align-item-center">
                <Switch checked={this.state.switchStatus} onChange={this.onChangeToggle} />
                <label className="switchlabel">Active<span className={this.state.switchStatus ? "switchstatus": "switchstatus-no"}>{this.state.switchStatus ? "Yes" : "No"}</span></label>
              </div>
              </div>
              </div>
              <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.updateCompany.bind(this)}>Update Company</button>
              <p className="m-0 p-0">{_.get(this.state,'errorMessage', '')}</p>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}

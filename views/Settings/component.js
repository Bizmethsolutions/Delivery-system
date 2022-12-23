import React, { PureComponent } from 'react'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import { message } from 'antd'
import InputMask from 'react-text-mask'
import base64 from "base-64"

import { CloseIcon } from '../../components/icons'
import config from '../../config/index'
import './styles.scss'
import { formatOrderAddess, formatGeoAddressComponents } from '../../components/commonFormate'
import AddressAutoComplete from '../../components/AddressAutoComplete'
const phoneNumberMask = config.phoneNumberMask

export default class SettingsComponent extends PureComponent {
  constructor(){
    super()
    this.state= {
      businessname: "",
      address: "",
      state: "",
      city: "",
      zip: "",
      image: {},
      logourl: "",
      user: {},
      messageShown: false,
      err: {},
      angle: 0,
      imagename: "",
      secretKey: "",
      publishkey: "",
      businessemail: "",
      streetname: "",
      phone: ""
    }
  }
  static propTypes = {
    // PropTypes go here
  }
  componentDidMount = async() => {
    document.title = 'Business Settings | CurbWaste'
    let data = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
      }
    }
    this.props.getUser(data)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.user !== prevState.user) {
      return {
        user: nextProps.user,
        businessname: _.get(nextProps.user, 'companyInfo.businessname', ''),
        address: _.get(nextProps.user, 'companyInfo.address', ''),
        state: _.get(nextProps.user, 'companyInfo.state', ''),
        city: _.get(nextProps.user, 'companyInfo.city', ''),
        zip: _.get(nextProps.user, 'companyInfo.zip', ''),
        logourl: _.get(nextProps.user, 'companyInfo.logoUrl', ''),
        showImage:  _.get(nextProps.user, 'companyInfo.logoUrl', ''),
        imagename:  _.get(nextProps.user, 'companyInfo.imagename', ''),
        businessemail:  _.get(nextProps.user, 'companyInfo.businessemail', ''),
        phone:  _.get(nextProps.user, 'companyInfo.businessphone', ''),
        streetname:  _.get(nextProps.user, 'companyInfo.streetname', ''),
        secretKey:  _.get(nextProps.user, 'companyInfo.stripeSecretKey', '') !== "" ? base64.decode(_.get(nextProps.user, 'companyInfo.stripeSecretKey', '')) : "",
        publishkey:  _.get(nextProps.user, 'companyInfo.stripePublishKey', '') !== "" ? base64.decode(_.get(nextProps.user, 'companyInfo.stripePublishKey', '')) : ""
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
  }

  goBack () {
    const usertype = localStorage.getItem('usertype')
    if(usertype !== "haluer")
      this.props.history.push('/dashboard')
    else
      this.props.history.push('/dispatcher')
  }

  validate() {
    let errObj = {}
    const { businessname, address, state, city, zip, streetname, image, businessemail } = this.state
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(address === "" || streetname === "") {
      errObj.address = "Address is required"
    }
    if(state === "") {
      errObj.state = "state is required"
    }
    if(city === "") {
      errObj.city = "city is required"
    }
    if(zip === "") {
      errObj.zip = "zipcode is required"
    }
    if(businessemail === "") {
      errObj.businessemail = "Email is required"
    }
    let testR = regex.test(String(businessemail).toLowerCase())
    if (!testR) {
      errObj.businessemail = 'Invalid email'
      require = true
    }
    this.setState({ err: errObj })
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
              self.setState({ image: image[0], imagename: name,  showImage:  reader.result})
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

  handleChange(e) {
    this.setState({ [e.target.name] : e.target.value})
  }

  submit = async() => {
    const companyId = localStorage.getItem('companyId')
    await this.validate()
    const { businessname, address, state, city, zip, image,imagename, err, secretKey, publishkey, streetname ,businessemail, phone } = this.state
    const { updateCompany } = this.props
    const companyObj = {
      businessname, address, state, city, zip, image, imagename, businessemail, businessphone: phone, streetname
    }
    if(secretKey !== "" && publishkey !== "") {
      companyObj.stripeSecretKey = base64.encode(secretKey)
      companyObj.stripePublishKey =  base64.encode(publishkey)
    }
    if(Object.keys(err).length === 0) {
      const { value } = await updateCompany({companyObj, companyId})
      // console.log(companyObj, 'value', companyId)
      if(value.type === "success") {
        if(!this.state.messageShown) {
          this.setState({ messageShown: true })
          message.success("Information updated sucessfully.", () => {
            this.setState({ messageShown: false })
          })
        }

      } else {
        if(!this.state.messageShown) {
          this.setState({ messageShown: true })
          message.error("Error in processing your request", () => {
            this.setState({ messageShown: false })
          })
        }
      }
    }
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

  imageRotate(index){
    const { angle, showImage, image, imagename } = this.state
    // this.setState({ rotateImageId: val.id })
    var img=document.getElementById("imgId")
    // img.setAttribute('style',`transform:rotate(${(angle + 90)%360}deg)`)
    let angleDeg = (angle + 90)%360
    let rotate = 0
    if(angleDeg == 0){
      rotate = 1
    }else if(angleDeg == 90){
      rotate = 8
    } else if(angleDeg == 180){
      rotate = 3
    } else if(angleDeg == 270){
      rotate = 6
    } else {
      rotate = 1
    }
    let self = this
    self.setState({ angle: angleDeg, rotate: rotate })
    // var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    let targetUrl
    if (Object.keys(image).length !== 0) {
      targetUrl = image.imagePreviewUrl
    } else {
      targetUrl = this.state.showImage
    }

    const n = targetUrl.indexOf("base64")
    if (n !== -1) {
      self.resetOrientation(targetUrl, 6, (resetBase64Image) => {
        image.imagePreviewUrl = resetBase64Image
        self.setState({ image, showImage: resetBase64Image },()=>{
          self.forceUpdate()
        })
      })
    } else {
      self.base64(targetUrl, function(dataUrl) {
        self.resetOrientation(dataUrl, 6, (resetBase64Image) => {
          image.imagePreviewUrl = resetBase64Image
          image.name = imagename
          self.setState({ image, showImage: resetBase64Image },()=>{
            self.forceUpdate()
          })
        })
      })
    }
  }

  base64(url, callback) {
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    url = proxyUrl + url
    var httpRequest = new XMLHttpRequest()
    httpRequest.onload = function() {
       var fileReader = new FileReader()
       fileReader.onloadend = function() {
          callback(fileReader.result)
       }
       fileReader.readAsDataURL(httpRequest.response)
    }
    httpRequest.open('GET', url)
    httpRequest.responseType = 'blob'
    httpRequest.send()
  }

  resetOrientation(srcBase64, srcOrientation, callback) {
    var img = new Image();
    img.onload = function() {
      var width = img.width,
      height = img.height,
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext("2d");
      // set proper canvas dimensions before transform & export
    if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
    // transform context before drawing image
    switch (srcOrientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
      case 7: ctx.transform(0, -1, -1, 0, height , width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
      default: break;
    }

    // draw image
    ctx.drawImage(img, 0, 0);
    // export base64
    callback(canvas.toDataURL());
  }
    img.src = srcBase64;
  }

  render() {
    const { err } = this.state
    return (
      <div>
      <div className="settings-top-header d-flex align-item-center justify-bet">
          <h3 className="settings-top-heading">Business Settings</h3>
          <button onClick={this.goBack.bind(this)} className="settings-card-close"><CloseIcon /></button>
      </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pb-4">
              <div className="settings-card notfixed white-bg">
                <div className="settings-card-header">
                  <h5 className="settings-card-title">Business Information</h5>
                </div>
                <div className="divider-line"></div>
                <div className="settings-card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="businessname"
                          value={this.state.businessname}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Business Name </label>
                      </div>
                    </div>
                  </div>
                  {_.get(this.props, 'user.role', 'user') === "admin" ?
                  <div className="row">
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="businessemail"
                        value={this.state.businessemail}
                        onChange={this.handleChange.bind(this)}
                        required />
                      <label className="material-textfield-label">Business Email <span className="text-danger">*</span></label>
                      <p className="text-danger">{err && err.businessemail ? err.businessemail : ""}</p>
                    </div>
                    </div>
                    <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <InputMask
                          className="form-control material-textfield-input"
                          name="phone"
                          guide={false}
                          type="text"
                          keepCharPositions={false}
                          mask={phoneNumberMask}
                          value={this.state.phone}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Business Phone</label>
                    </div>
                    </div>
                  </div> : "" }
                  {_.get(this.props, 'user.role', 'user') === "admin" ?
                  <div className="row">
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="publishkey"
                        value={this.state.publishkey}
                        onChange={this.handleChange.bind(this)}
                        required />
                      <label className="material-textfield-label">Stripe Publish Key <span className="text-danger"></span></label>
                    </div>
                    </div>
                  </div> : "" }
                  {_.get(this.props, 'user.role', 'user') === "admin" ?
                  <div className="row">
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="secretKey"
                        value={this.state.secretKey}
                        onChange={this.handleChange.bind(this)}
                        required />
                      <label className="material-textfield-label">Stripe Secret Key <span className="text-danger"></span></label>
                    </div>
                    </div>
                  </div> : "" }
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group material-textfield">
                        {/* <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="address"
                          value={this.state.address}
                          onChange={this.handleChange.bind(this)}
                          required /> */}
                        <AddressAutoComplete
                          inputClassName={"form-control material-textfield-input"}
                          onSelect={(suggest) => this.onAddressSelect(suggest)}
                          onChange={(value) => this.onChangeAddressField(value)}
                          initialValue={this.state.streetname}
                        />
                        <label className={this.state.streetname || this.state.onAddressInputvalue ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Address <span className="text-danger">*</span></label>
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
                          name="city"
                          value={this.state.city}
                          onChange={this.handleChange.bind(this)}
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
                          name="state"
                          value={this.state.state}
                          onChange={this.handleChange.bind(this)}
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
                          name="zip"
                          value={this.state.zip}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Zip <span className="text-danger">*</span></label>
                        <p className="text-danger">{err && err.zip ? err.zip : ""}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <Dropzone
                          onDrop={this.onDrop.bind(this)}
                          multiple={false}
                        >
                          {({ getRootProps, getInputProps }) => (
                          <div className="profile-wrapper--avatar dropzone-border" {...getRootProps()}>
                            <input {...getInputProps()} /> Upload Logo <br/> or<br/>
                            <button className="btn btn-dark btn-sm font-600 mt-2 pl-4 pr-4">Drag & Drop</button>

                          </div>
                          )}
                      </Dropzone>
                      <div><img id="imgId" src={this.state.showImage} alt="" className="previewimgnew" /></div>
                      { this.state.showImage ?
                        <button type="button" className="btn p-0" onClick={this.imageRotate.bind(this)}> Rotate </button>
                      : ""}
                    </div>
                  </div>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.submit.bind(this)}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

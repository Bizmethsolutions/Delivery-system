import React, { PureComponent } from 'react'
import moment from 'moment'
import InputMask from 'react-text-mask'
import Dropzone from 'react-dropzone'
import _ from 'lodash'
import { message } from 'antd'

import { CloseIcon } from '../../components/icons'
import './styles.scss'
import config from '../../config/index'
import { formatPhoneNumber } from '../../components/commonFormate'
import ProfilepicDefault from './../../images/profilepic-default.svg'
import EditProfile from './../../images/profile-edit-icon.svg'
const timezoneoptions = config.timeZoneArr
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
      image: "",
      logourl: "",
      user: {},
      messageShown: false,
      showImage: "",
      err: {},
      timezoneoptionsIndex: '',
      timezone: {},
    }
  }
  static propTypes = {
    // PropTypes go here
  }
  componentDidMount = async() => {
    document.title = 'Edit Profile | CurbWaste'
    let data = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
      }
    }
    this.props.getUser(data)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.user !== prevState.user) {
      const usertype = localStorage.getItem('usertype')
      const obj = {}
      let timezoneoptionsIndex= ''
      if (nextProps.user.timezone && Object.keys(nextProps.user.timezone).length > 0) {
        timezoneoptionsIndex = timezoneoptions.findIndex(obj => obj.name === nextProps.user.timezone.name && obj.tzName === nextProps.user.timezone.tzName)
        var offset = moment.tz(moment(), timezoneoptions[timezoneoptionsIndex].tzName).utcOffset()
        if(Math.sign(offset) === -1) {
          offset = Math.abs(offset)
        } else {
          offset = -offset
        }
        if (timezoneoptionsIndex !== 0 && timezoneoptionsIndex !== '0') {
          obj.tzName = timezoneoptions[timezoneoptionsIndex].tzName
          obj.offset = offset
          obj.name = timezoneoptions[timezoneoptionsIndex].name
        }    
      }

      if(usertype === "user") {
        return {
          user: nextProps.user,
          firstname: _.get(nextProps.user, 'firstname', ''),
          lastname: _.get(nextProps.user, 'lastname', ''),
          username: _.get(nextProps.user, 'username', ''),
          showImage:  _.get(nextProps.user, 'image', ''),
          image: _.get(nextProps.user, 'image', ''),
          phone: _.get(nextProps.user, 'phone', ''),
          timezoneoptionsIndex: timezoneoptionsIndex,
          timezone: obj
        }
      } else if(usertype === "hauler") {
        return {
          user: nextProps.user,
          company_name: _.get(nextProps.user, 'company_name', ''),
          user_name: _.get(nextProps.user, 'user_name', ''),
          phone: _.get(nextProps.user, 'phone', ''),
          showImage:  _.get(nextProps.user, 'image', ''),
          image: _.get(nextProps.user, 'image', ''),
          timezoneoptionsIndex: timezoneoptionsIndex,
          timezone: obj
        }
      } else if(usertype === "customer") {
        return {
          user: nextProps.user,
          companyname: _.get(nextProps.user, 'companyname', ''),
          contactname: _.get(nextProps.user, 'contactname', ''),
          cphone: _.get(nextProps.user, 'phone', ''),
          showImage:  _.get(nextProps.user, 'image', ''),
          image: _.get(nextProps.user, 'image', ''),
          timezoneoptionsIndex: timezoneoptionsIndex,
          timezone: obj
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
  }

  goBack () {
    const usertype = localStorage.getItem('usertype')
    if(usertype !== "hauler")
      this.props.history.push('/dashboard')
    else
      this.props.history.push('/dispatcher')
  }

  validate() {
    let errObj = {}
    const usertype = localStorage.getItem('usertype')
    const { firstname, lastname, username, image, err, phone, company_name, cphone, user_name, companyname, contactname } = this.state
    if(usertype === "user") {
      if(firstname === "") {
        errObj.firstname = "First name is required"
      }
      if(lastname === "") {
        errObj.lastname = "Last name is required"
      }
      if(username === "") {
        errObj.username = "Username is required"
      }
    } else if (usertype === "hauler") {
      if(company_name === "") {
        errObj.company_name = "Company name is required"
      }
      if(user_name === "") {
        errObj.user_name = "User name is required"
      }
    } else if (usertype === "customer") {
      if(contactname === "") {
        errObj.contactname = "Contact name is required"
      }
      if(companyname === "") {
        errObj.city = "Company name is required"
      }
    }
    this.setState({ err: errObj })
  }

  onDrop (files) {
    const _URL = window.URL || window.webkitURL
    const image = []
    files.forEach(file => {
      const s = file.size / (1024*1024)
      if (file.type.split('/')[0] === 'image') {
        if(s <= 1) {
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
                self.setState({ images: [], image: "" })
              }
            }
          }
          reader.readAsDataURL(file)
        } else {
          if(!this.state.messageShown) {
            this.setState({ messageShown: true })
            message.success("Please upload a file less than 1 MB", () => {
              this.setState({ messageShown: false })
            })
          }
        }
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
    const userId = localStorage.getItem('userid')
    const usertype = localStorage.getItem('usertype')
    await this.validate()
    const { firstname, lastname, username, image, err, company_name, phone, cphone, user_name, companyname, contactname, timezone } = this.state
    const { updateUser } = this.props
    let obj = {}
    if(usertype === "user") {
      obj = {
        firstname, lastname, username, image, userId,phone: formatPhoneNumber(phone),
        usertype
      }
    } else if (usertype === "hauler") {
      obj = {
        company_name, phone: formatPhoneNumber(phone), user_name, image, userId,
        usertype
      }
    } else if (usertype === "customer") {
      obj = {
        companyname, phone: formatPhoneNumber(cphone), contactname, image, userId,
        usertype
      }
    }
    obj.timezone = timezone
    if(Object.keys(err).length === 0) {
      const { value } = await updateUser(obj)
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

  onTimeZonechange(e){
    let ind = e.target.value
    let obj={}
    var offset = moment.tz(moment(), timezoneoptions[ind].tzName).utcOffset()
    if(Math.sign(offset) === -1) {
      offset = Math.abs(offset)
    } else {
      offset = -offset
    }
    if (ind !== 0 && ind !== '0') {
      obj.tzName = timezoneoptions[ind].tzName
      obj.offset = offset
      obj.name = timezoneoptions[ind].name
    }    
    this.setState({timezone: obj, timezoneoptionsIndex:ind })
  }

  render() {
    const { err } = this.state
    const usertype = localStorage.getItem('usertype')
    const options = timezoneoptions.map((time,index) => {
      return (
        <option value={index} key={index} className ="txt-clr4">{time.name}</option>
      )})
    return (
      <div>
      <div className="settings-top-header d-flex align-item-center justify-bet">
          <h3 className="settings-top-heading">Profile Settings</h3>
          <button onClick={this.goBack.bind(this)} className="settings-card-close"><CloseIcon /></button>
      </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="settings-card white-bg">
                <div className="settings-card-header d-flex align-items-center justify-content-between">
                  <h5 className="settings-card-title">Edit Profile</h5>
                  </div>
                <div className="divider-line"></div>
                <div className="row">
                  <div className="col-md-12">
                    <Dropzone
                      onDrop={this.onDrop.bind(this)}
                      multiple={false}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="profile-wrapper--avatar pad-20" {...getRootProps()}>
                          <input {...getInputProps()} /> <span className="profilebtn">Photo <span className="limit-txt">[1 mb max]</span></span>
                          {this.state.showImage === "" ?
                            <span><img src={ProfilepicDefault} className="default-bg" /></span> :
                            <span className="posi-rel">
                              <img src={this.state.showImage} alt="" className="image-preview" />
                              <img src={EditProfile} alt="" className="image-preview-edit" />
                            </span>
                          }
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </div>
                {usertype === "user" ?
                <div className="settings-card-body profile-setting">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="firstname"
                          value={this.state.firstname}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">First Name</label>
                        <p className="text-danger">{err && err.firstname ? err.firstname : ""}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="lastname"
                          value={this.state.lastname}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Last Name <span className="text-danger">*</span></label>
                        <p className="text-danger">{err && err.lastname ? err.lastname : ""}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="username"
                          value={this.state.username}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Username<span className="text-danger">*</span></label>
                        <p className="text-danger">{err && err.username ? err.username : ""}</p>
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
                        <label className="material-textfield-label">Phone</label>
                        <p className="text-danger">{err && err.phone ? err.phone : ""}</p>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group material-textfield">
                        <select onChange= {this.onTimeZonechange.bind(this)}
                          value={this.state.timezoneoptionsIndex}
                          className="form-control material-textfield-input custom-select">
                          {options}
                        </select>
                        <label className="material-textfield-label">Timezone</label>
                      </div>
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-md-12 mb-3">
                      <Dropzone
                          onDrop={this.onDrop.bind(this)}
                          multiple={false}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="profile-wrapper--avatar" {...getRootProps()}>
                            <input {...getInputProps()} /> <span className="profilebtn">Profile Icon</span>
                              <img src={this.state.showImage} alt="" className="image-preview"/>
                            </div>
                          )}
                      </Dropzone>
                    </div>
                  </div> */}
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.submit.bind(this)}>Save</button>
                </div>
              : usertype === "hauler" ?
              <div className="settings-card-body profile-setting">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="company_name"
                          value={this.state.company_name}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Company Name</label>
                        <p className="text-danger">{err && err.company_name ? err.company_name : ""}</p>
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
                        <label className="material-textfield-label">Phone</label>
                        <p className="text-danger">{err && err.phone ? err.phone : ""}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="user_name"
                          value={this.state.user_name}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Username<span className="text-danger">*</span></label>
                        <p className="text-danger">{err && err.user_name ? err.user_name : ""}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <select onChange= {this.onTimeZonechange.bind(this)}
                          value={this.state.timezoneoptionsIndex}
                          className="form-control material-textfield-input custom-select">
                          {options}
                        </select>
                        <label className="material-textfield-label">Timezone</label>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.submit.bind(this)}>Save</button>
                </div>
                : <div className="settings-card-body profile-setting">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="companyname"
                          value={this.state.companyname}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Customer Name</label>
                        <p className="text-danger">{err && err.companyname ? err.companyname : ""}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <InputMask
                          className="form-control material-textfield-input"
                          name="cphone"
                          guide={false}
                          type="text"
                          keepCharPositions={false}
                          mask={phoneNumberMask}
                          value={this.state.cphone}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Phone</label>
                        <p className="text-danger">{err && err.phone ? err.phone : ""}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="contactname"
                          value={this.state.contactname}
                          onChange={this.handleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Contact Name<span className="text-danger">*</span></label>
                        <p className="text-danger">{err && err.contactname ? err.contactname : ""}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <select onChange= {this.onTimeZonechange.bind(this)}
                          value={this.state.timezoneoptionsIndex}
                          className="form-control material-textfield-input custom-select">
                          {options}
                        </select>
                        <label className="material-textfield-label">Timezone</label>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.submit.bind(this)}>Save</button>
                </div> }
                </div>
              </div>
          </div>
        </div>
      </div>
    )
  }
}

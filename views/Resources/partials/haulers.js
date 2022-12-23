import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import { Menu, Dropdown, Popconfirm, message, Pagination } from 'antd'
import moment from 'moment'
import _ from "lodash"

import EmptyComponent from '../../../components/emptyComponent'
import AddressAutoComplete from '../../../components/AddressAutoComplete'
import { formatGeoAddressComponents, formatOrderAddess, formatPhoneNumber } from '../../../components/commonFormate'
import { CloseIcon, MoreIcon } from '../../../components/icons'
import { SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, SortingNewDownIcon, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../../components/icons'
import config from '../../../config/index'
import DeleteModal from '../../../components/deleteModal'
import '../styles.scss'

const timezoneoptions = config.timeZoneArr
const phoneNumberMask = config.phoneNumberMask

export default class ResourcesComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }
  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      companyname: "",
      address: "",
      latitute: "",
      longitude: "",
      zipcode: "",
      state: "",
      neighborhood: "",
      phone: "",
      email: "",
      city: "",
      borough: "",
      haulerList: [],
      editHaulerId: "",
      err: {},
      saveClicked: false,
      haulerModalTitle: "New Hauler",
      new_address: '',
      timezoneoptionsIndex: '',
      hauler_id: '',
      haulerError: '',
      onAddressInputvalue: '',
      page: 0,
      limit: 20,
      sort_field: '',
      search_string: '',
      by: 1,
      totalHaulers: 0,
      deleteModelIsOpen: false
    }
    this.onHandleChange = this.onHandleChange.bind(this)
  }


  componentDidMount = async()=> {
    document.title = 'Haulers | CurbWaste'
    this.fetchHaulers()
  }

  fetchHaulers = async()=> {
    const {limit, by, page, sort_field, search_string } = this.state
    let data = {
      limit, by, page, sort_field, search_string
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []), totalHaulers: _.get(value, 'data.count', 0) })
  }

  onHandleChange(e) {
    this.setState({ [e.target.name] : e.target.value}, () => {
      if(this.state.saveClicked === true) {
        this.validate()
      }
    })
  }

  onSearch (key) {
    this.setState({ search_string: key}, ()=>{
      this.fetchHaulers()
    })
  }

  onPagechange (nextPage) {
    let page = nextPage - 1
    this.setState({ page }, ()=>{
      this.fetchHaulers()
    })
  }

  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1
    } else {
        this.state.sort_field = field
        this.state.by = 1;
    }
    this.fetchHaulers()
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
    obj.tzName = timezoneoptions[ind].tzName
    obj.offset = offset
    obj.name = timezoneoptions[ind].name
    this.setState({tzone: timezoneoptions[ind].name ,timezone: obj, timezoneoptionsIndex:ind })
  }

  validate() {
    let errObj = {}
    const { email, companyname, state, city, new_address, borough, neighborhood, zipcode, phone, err } = this.state
    if (email) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
        errObj.email = "Please enter a valid email address"
      }
    }
    if(email === "") {
      errObj.email = "Email is required"
    }

    if(companyname === "") {
      errObj.companyname = "Company name is required"
    }
    if(zipcode === "") {
      errObj.zipcode = "Zipcode is required"
    }
    if(phone === "" && phone === undefined) {
      errObj.phone = "Cell Phone number is required"
    }
    const phonelength = phone && phone.replace(/[^0-9]/g,"").length
    if(phonelength !== 10) {
      errObj.phone = "Please enter exactly 10 digit number"
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
    this.setState({ err: errObj })
  }

  saveHauler = async() => {
    this.setState({ saveClicked : true })
    await this.validate()
    const {err, email} = this.state
    const { addHauler, updateHauler, } = this.props
    if(Object.keys(err).length === 0) {
      const obj ={
        companyname: this.state.companyname,
        email: email && email.toLowerCase(),
        city: this.state.city,
        state: this.state.state,
        phone: formatPhoneNumber(this.state.phone),
        address: this.state.new_address,
        zipcode: this.state.zipcode,
        borough: this.state.borough,
        neighborhood: this.state.neighborhood,
        active: true,
        status: true,
        timezone: this.state.timezone,
        location: this.state.location
      }
      if(this.state.editHaulerId === "") {
        try {
          let { value } = await addHauler(obj)
          if (value.type === "success") {
            this.closeModal()
            this.fetchHaulers()
          }
        } catch (e) {
          this.setState({haulerError: e.error.message})
        }
      } else {
        obj.id = this.state.editHaulerId
        obj.hauler_id = this.state.hauler_id
        obj.company_name = this.state.companyname
        obj.company_email = email && email.toLowerCase()
        delete obj.companyname
        delete obj.email
        try {
          let { value } = await updateHauler(obj)
          if (value.type === "success") {
            this.closeModal()
            this.fetchHaulers()
          }
        } catch (e) {
          this.setState({haulerError: e.error.message})
        }
      }
    }
  }

  closeModal() {
    this.setState({ deleteModelIsOpen: false })
    this.props.closeModal()
    this.resetState()
  }

  resetState () {
    this.setState({
      companyname: "", address: "", borough: "", zipcode: "", state: "", neighborhood: "", phone: "", email: "", city: '', new_address: '', err: {}, editHaulerId: '', hauler_id: '', haulerModalTitle: "New Hauler", timezoneoptionsIndex: '', timezone: {}, haulerError: '', saveClicked: false
    })
  }

  formatAddess (hauler) {
    let address = formatOrderAddess(hauler)
    return address
  }

  confirmDelete = async() => {
    let data = {
      id: this.state.editHaulerId
    }
    let datau = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
      }
    }
    let { value } = await this.props.deleteHauler(data)
    this.closeModal()
    message.success('successfully deleted')
    this.props.getUser(datau)
    this.fetchHaulers()
  }

  openHaulerEditModal (hauler) {
    this.props.openModal('haulerModal')
    if(hauler) {
      if (hauler.timezone && Object.keys(hauler.timezone).length > 0) {
        let index = timezoneoptions.findIndex(obj => obj.name === hauler.timezone.name && obj.tzName === hauler.timezone.tzName)
        this.setState({ timezoneoptionsIndex: index })
      }
      this.setState({ driverModal: true ,
        haulerModalTitle: "Edit Hauler",
        companyname:_.get(hauler,'company_name', ''),
        email: _.get(hauler,'company_email', ''),
        new_address: _.get(hauler,'address', ''),
        phone: _.get(hauler,'phone', ''),
        state: _.get(hauler,'state', ''),
        city:  _.get(hauler,'city', ''),
        zipcode:  _.get(hauler,'zipcode', ''),
        timezone: _.get(hauler,'timezone', {}),
        borough: _.get(hauler,'borough', ''),
        neighborhood: _.get(hauler,'neighborhood', ''),
        editHaulerId: hauler._id,
        hauler_id: hauler.hauler_id,
        haulerError: "",
        err: {}
      })
    }
  }

  onChangeAddressField (value) {
    this.setState({ onAddressInputvalue: value },()=>{
      if (this.state.onAddressInputvalue ===""){
        this.setState({ new_address: ''})
      }
    })
  }

  getSortArrow(field) {
    if (this.state.sort_field === field) {
      if (this.state.by === 1)
        return (<SortingNewUpIcon />)
      else
       return (<SortingNewDownIcon />)
    } else {
       return (<SortingNewDownIcon />)
    }
  }

  setDefault = async(hauler)=> {
    let data = {
      isDefault: true,
      id: hauler.id
    }
    let { value } = await this.props.setDefaultHauler(data)
    if(value.type === 'success'){
      let datau = { user : {
        id: localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype")
        }
      }
      this.fetchHaulers()
      message.success(value.message)
      this.props.getUser(datau)
    }
  }

  redirectDispatherPage = async (hauler)=> {
    const { user } = this.props
    const data = {
      email: hauler.company_email,
      usertype: 'hauler'
    }
    let { value } = await this.props.getToken(data)
    if (value.type=== 'success') {
      localStorage.setItem('companyEmail', _.get(user, 'email', ''))
      localStorage.setItem('haulerid', value.data._id)
      localStorage.setItem('Authorization', value.data.token)
      localStorage.setItem('userid', value.data._id)
      localStorage.setItem('usertype', value.data.usertype)
      localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
      this.props.history.push('/dispatcher')
    }
  }

  openConfirmDeleteModal (id) {
    this.setState({ editHaulerId: id, deleteModelIsOpen: true })
  }

  render() {
    const { err } = this.state
    const options = timezoneoptions.map((time,index) => {
      return (
        <option value={index} key={index} className ="txt-clr4">{time.name}</option>
      )})
    return (
      <div className="row">
        <div className="col-md-12">
          <div>
            { _.get(this.state, 'haulerList', []).length > 0 ?
              <div className="table-responsive">
                <table className="table custom-table-secondary white-bg">
                  <thead className="gray-bg">
                    <tr>
                      <th onClick={() => { this.sortby('hauler_id')}}>
                        <span className="custom-table-th-title-sm for-cursor">Hauler ID {this.getSortArrow('hauler_id')}</span>
                      </th>
                      <th onClick={() => { this.sortby('company_name')}}>
                        <span className="custom-table-th-title-sm for-cursor">Company Name {this.getSortArrow('company_name')}</span>
                      </th>
                      <th onClick={() => { this.sortby('address')}}>
                        <span className="custom-table-th-title-sm for-cursor">Address {this.getSortArrow('address')}</span>
                      </th>
                      <th onClick={() => { this.sortby('company_email')}}>
                        <span className="custom-table-th-title-sm for-cursor">Email {this.getSortArrow('company_email')}</span>
                      </th>
                      <th onClick={() => { this.sortby('phone')}}>
                        <span className="custom-table-th-title-sm for-cursor">Phone {this.getSortArrow('phone')}</span>
                      </th>
                      <th>
                        <span className="custom-table-th-title-sm"></span>
                      </th>
                      <th className="width-50 rem-pad-lr">
                        <span className="custom-table-th-title-sm">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-card">
                    { _.get(this.state, 'haulerList', []).map((hauler, index)=>{
                        return (
                          <tr key={index}>
                            <td>
                              <span className="custom-table-title custom-table-title-md">{_.get(hauler, 'hauler_id', '')}</span>
                              {_.get(hauler, 'isDefault', false) ? <span className="default-hauler">Default</span> : "" }
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">{_.get(hauler, 'company_name', '')}</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md"> {this.formatAddess(hauler)}</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">{_.get(hauler, 'company_email', '')}</span>
                            </td>
                            <td>
                              <span>{_.get(hauler, 'phone', '')}</span>
                            </td>
                            <td>
                              <span onClick={this.redirectDispatherPage.bind(this, hauler)} className="view-despatcher">View Dispatcher</span>
                            </td>
                            <td>
                              <Dropdown overlay={
                                <Menu>
                                {_.get(hauler, 'isDefault', false) !== true ?
                                  <Menu.Item key="0">
                                    <a href="#" onClick ={this.setDefault.bind(this, hauler)}>Make Default Hauler</a>
                                  </Menu.Item> : "" }
                                  <Menu.Item key="1">
                                    <a href="#" onClick ={this.openHaulerEditModal.bind(this, hauler)}>Edit</a>
                                  </Menu.Item>
                                  <Menu.Item key="2">
                                    <a href="#" onClick={this.openConfirmDeleteModal.bind(this,hauler.id )}>Delete</a>
                                  </Menu.Item>
                                </Menu>
                              } trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right">
                                <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                  <DotBtnIcon />
                                </a>
                              </Dropdown>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
              :
              <EmptyComponent
                emptyText = "No Haulers"
              />
            }
          </div>
        </div>
        <ReactModal
          isOpen={this.props.haulerModal}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.haulerModalTitle}</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="companyname"
                      value={this.state.companyname}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Company Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.companyname ? err.companyname : ""}</p>
                  </div>
                </div>
              </div>
              <div className="row">
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
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Phone Number <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.phone ? err.phone : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="email"
                      value={this.state.email}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.email ? err.email : ""}</p>
                  </div>
                </div>
              </div>
              <div className="form-group material-textfield">
                <AddressAutoComplete
                  inputClassName={"form-control material-textfield-input"}
                  onSelect={(suggest) => this.onAddressSelect(suggest)}
                  onChange = {(value) => this.onChangeAddressField(value)}
                  initialValue={this.state.new_address}
                />
                <label className={this.state.new_address || this.state.onAddressInputvalue ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Address <span className="text-danger">*</span></label>
                <p className="text-danger">{err && err.address ? err.address : ""}</p>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="city"
                      value={this.state.city}
                      onChange={this.onHandleChange}
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
                      onChange={this.onHandleChange}
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
                      name="zipcode"
                      value={this.state.zipcode}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Zip <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.zipcode ? err.zipcode : ""}</p>
                  </div>
                </div>
              </div>

              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="borough"
                  value={this.state.borough}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Borough</label>
              </div>
              <div className="form-group material-textfield">
              <select onChange= {this.onTimeZonechange.bind(this)}
                value={this.state.timezoneoptionsIndex}
                  className="form-control material-textfield-input custom-select">
                {options}
              </select>
                <label className="material-textfield-label">Timezone</label>
              </div>
              <p className="text-danger">{this.state.haulerError}</p>
              <button onClick={this.saveHauler.bind(this)} className="btn btn-dark btn-lg w-100 font-800">Save</button>
            </div>
          </div>
        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'hauler'}
        />

        <Pagination
          className="pb-3 text-center pagination-wrapper w-100 mt-3"
          current={this.state.page + 1}
          onChange={this.onPagechange.bind(this)}
          pageSize={this.state.limit}
          hideOnSinglePage= {true}
          total={_.get(this.state, 'totalHaulers', 0)}
        />
      </div>
    )
  }
}

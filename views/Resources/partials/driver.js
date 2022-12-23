import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import _ from "lodash"
// import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import { Menu, Dropdown, Select, Popconfirm, message, Pagination } from 'antd'

import { formatPhoneNumber } from '../../../components/commonFormate'
import EmptyComponent from '../../../components/emptyComponent'
import { CloseIcon, MoreIcon } from '../../../components/icons'
import config from '../../../config/index'
import { SortingNewDownIcon, SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../../components/icons'
import DeleteModal from '../../../components/deleteModal'

import '../styles.scss'
const { Option } = Select
const timezoneoptions = config.timeZoneArr
const phoneNumberMask = config.phoneNumberMask
const menu = (
  <Menu>
    <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Make Default Hauler</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to={'/agent/team'}>Edit</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={'/agent/signup'}>Delete</Link>
    </Menu.Item>
  </Menu>
);

export default class ResourcesComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }
  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      driversList: [],
      driverModalText: "New Driver",
      driverError: "",
      name: "",
      email: "",
      phone: "",
      tabletId: "",
      timezone: {},
      lastname: "",
      license: "",
      editDriverId: "",
      err: {},
      timezoneoptionsIndex: '',
      haulerList: [],
      haulerId: '',
      limit:20,
      page: 0,
      by: -1,
      sort_field: 'driver_serial_id',
      search_string: '',
      totalDrivers: 0,
      oldHaulerId: '',
      status: false,
      deleteModelIsOpen: false
    }
  }

  componentDidMount = async()=> {
    document.title = 'Drivers | CurbWaste'
    const data = {
      // type: "h",
      // by: 1,
      // page: 0,
      // limit: 20
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []) })

    this.fetchDrivers()
  }

  fetchDrivers = async()=> {
    const {limit, by, page, sort_field, search_string } = this.state
    const today = moment().format('MM/DD/YYYY')
    let data = {
      limit, by, page, sort_field, search_string, date: today
    }

    let { value } = await this.props.getDrivers(data)
    this.setState({ driversList: _.get(value, 'data.dataArr', []), totalDrivers: _.get(value, 'data.count', 0)  })
  }

  onSearch (key) {
    this.setState({ search_string: key}, ()=>{
      // this.fetchDrivers()
    })
  }

  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1
    } else {
        this.state.sort_field = field
        this.state.by = 1;
    }
    this.fetchDrivers()
  }

  onPagechange (nextPage) {
    let page = nextPage - 1
    this.setState({ page }, ()=>{
      this.fetchDrivers()
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

  handleChange(e) {
    if(e.target.name === "tabletId") {
      if(e.target.value.length <= 3) {
        this.setState({ [e.target.name] : e.target.value}, () => {
          if(this.state.saveClicked === true) {
            this.validate()
          }
        })
      }
    } else {
      this.setState({ [e.target.name] : e.target.value}, () => {
        if(this.state.saveClicked === true) {
          this.validate()
        }
      })
    }
  }

  validate() {
    let errObj = {}
    const { email, lastname, name, phone, tabletId, license, err, haulerId, status } = this.state
    if (email) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
        errObj.email = "Please enter a valid email address"
      }
    }
    // if(email === "") {
    //   errObj.email = "Email is required"
    // }
    if(name.length < 3) {
      errObj.name = "Please enter atleast 3 characters"
    }
    // if(lastname.length < 2) {
    //   errObj.lastname = "Please enter atleast 2 characters"
    // }
    // if(lastname === "") {
    //   errObj.lastname = "This field is required"
    // }
    if(name === "") {
      errObj.name = "First name is required"
    }
    if(status === "") {
      errObj.status = "Status is required"
    }
    if(phone === "") {
      errObj.phone = "Cell Phone number is required"
    }
    const phonelength = phone.replace(/[^0-9]/g,"").length
    if(phonelength !== 10) {
      errObj.phone = "Please enter exactly 10 digit number"
    }
    if(tabletId === "") {
      errObj.tabletId = "Tablet ID is required"
    }
    // if(license === "") {
    //   errObj.license = "License is required"
    // }
    if(haulerId === "") {
      errObj.haulerId = "Hauler is required"
    }
    this.setState({ err: errObj })
  }

  saveDriver = async() => {
    this.setState({ saveClicked : true })
    await this.validate()
    const {err, email} = this.state
    const { addDriver, updateDriver } = this.props
    if(Object.keys(err).length === 0) {
      if(this.state.editDriverId === "") {
        const obj ={
          driverLicenseNo: this.state.license,
          email: email && email.toLowerCase(),
          lastName: this.state.lastname,
          name: this.state.name,
          phone: formatPhoneNumber(this.state.phone),
          tabletId: this.state.tabletId,
          timezone: this.state.timezone,
          haulerId: this.state.haulerId,
          status: this.state.status === "true" || this.state.status === true ? true : false
        }
        try {
          let { value } = await addDriver(obj)
          if (value.type === "success") {
            this.closeModal()
            this.resetState()
            message.success(value.message)
            this.fetchDrivers()
          }
        } catch(e) {
          this.setState({ driverError: e.error.message })
        }
      } else {
        const obj ={
          driverLicenseNo: this.state.license,
          email: email && email.toLowerCase(),
          lastName: this.state.lastname,
          name: this.state.name,
          phone: formatPhoneNumber(this.state.phone),
          tabletId: this.state.tabletId,
          timezone: this.state.timezone,
          id: this.state.editDriverId,
          haulerId: this.state.haulerId,
          oldHaulerId: this.state.oldHaulerId,
          status: this.state.status === "true" || this.state.status === true ? true : false

        }
        try {
          let { value } = await updateDriver(obj)
          if (value.type === "success") {
            this.closeModal()
            message.success(value.message)
            this.resetState()
            this.fetchDrivers()
          }
        } catch (e) {
          this.setState({ driverError: e.error.message })
        }
      }
    }
  }

  closeModal() {
    this.setState({ deleteModelIsOpen: false })
    this.resetState()
    this.props.closeModal()
  }

  openConfirmDeleteModal (driver) {
    this.setState({
      editDriverId: driver.id,
      haulerId: driver.haulerId,
      deleteModelIsOpen: true
    })
  }

  resetState () {
    this.setState({
      license: '',
      email: '',
      lastname: '',
      name: '',
      phone: '',
      tabletId: '',
      timezone: {},
      id: '',
      err: {},
      timezoneoptionsIndex: '',
      driverError: '',
      editDriverId: '',
      driverModalText: "New Driver",
      saveClicked: false,
      haulerId: "",
      status: false,
      oldHaulerId: ''
    })
  }
  openDriverEditModal (driver) {
    this.props.openModal('driverModal')
    if(driver) {
      if (driver.timezone && Object.keys(driver.timezone).length > 0) {
        let index = timezoneoptions.findIndex(obj => obj.name === driver.timezone.name && obj.tzName === driver.timezone.tzName)
        this.setState({ timezoneoptionsIndex: index })
      }
      this.setState({ driverModal: true ,
        driverModalText: "Edit Driver",
        name: driver.name,
        lastname: driver.lastName,
        phone: driver.phone,
        tabletId: driver.tabletId,
        email: driver.email,
        timezonedrivervalue: _.get(driver,'timezone.name', ''),
        timezone: _.get(driver,'timezone', {}),
        license: driver.driverLicenseNo,
        editDriverId: driver.id,
        driverError: "",
        haulerId: driver.haulerId,
        oldHaulerId: driver.haulerId,
        status: _.get(driver, 'status', ''),
        err: {}
      })
    }
  }

  confirmDelete = async() => {
    let data = {
      driverId: this.state.editDriverId,
      haulerId: this.state.haulerId
    }
    try {
      let { value } = await this.props.deleteDriver(data)
      message.success('successfully deleted')
      this.closeModal()
      this.fetchDrivers()
    } catch (e) {
      if (_.get(e.error, 'statusCode', '') === 403) {
        this.closeModal()
        message.success("Driver can't be deleted because a job is assigned")
      }
    }
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

  getHaulerName (id) {
    if (_.get(this.state, 'haulerList', []).length > 0) {
      const haulerList = this.state.haulerList
      let idx = haulerList.findIndex(obj => obj.id === id)
      if (idx !== -1) {
        return haulerList[idx].company_name
      }
    }
  }

  render() {
    const options = timezoneoptions.map((time,index) => {
      return (
        <option value={index} key={index} className ="txt-clr4">{time.name}</option>
      )})
    const { err } = this.state

    return (
      <div className="row">
        <div className="col-md-12">
          <div>
            {_.get(this.state, 'driversList', []).length > 0 ?
              <div className="table-responsive">
                <table className="table custom-table-secondary white-bg">
                  <thead className="gray-bg">
                    <tr>
                      <th onClick={() => { this.sortby('driver_serial_id')}}>
                        <span className="custom-table-th-title-sm for-cursor">User ID {this.getSortArrow('driver_serial_id')}</span>
                      </th>
                      <th onClick={() => { this.sortby('tablet_id') }}>
                        <span className="custom-table-th-title-sm for-cursor">Tablet ID {this.getSortArrow('tablet_id')}</span>
                      </th>
                      <th onClick={() => { this.sortby('hauler') }}>
                        <span className="custom-table-th-title-sm for-cursor">Hauler {this.getSortArrow('hauler')}</span>
                      </th>
                      <th onClick={() => { this.sortby('driver_license_no') }}>
                        <span className="custom-table-th-title-sm for-cursor">License Number {this.getSortArrow('driver_license_no')}</span>
                      </th>
                      <th onClick={() => { this.sortby('name') }}>
                        <span className="custom-table-th-title-sm for-cursor">First Name {this.getSortArrow('name')}</span>
                      </th>
                      <th onClick={() => { this.sortby('last_name') }}>
                        <span className="custom-table-th-title-sm for-cursor">Last Name {this.getSortArrow('last_name')}</span>
                      </th>
                      <th onClick={() => { this.sortby('email') }}>
                        <span className="custom-table-th-title-sm for-cursor">Email Address {this.getSortArrow('email')}</span>
                      </th>
                      <th onClick={() => { this.sortby('phone') }}>
                        <span className="custom-table-th-title-sm for-cursor">Phone {this.getSortArrow('phone')}</span>
                      </th>
                      <th className="width-50 rem-pad-lr">
                        <span className="custom-table-th-title-sm">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-card">
                    {_.get(this.state, 'driversList', []).map((driver, index)=>{
                      return (
                      <tr key={index}>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(driver, 'driverSerialId', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(driver, 'tabletId', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{ driver.haulerId ? this.getHaulerName(driver.haulerId) : ''}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(driver, 'driverLicenseNo', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(driver, 'name', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(driver, 'lastName', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(driver, 'email', '')}</span>
                        </td>
                        <td>
                          <span>{_.get(driver, 'phone', '')}</span>
                        </td>
                        <td>
                          <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                              <a href="#" onClick ={this.openDriverEditModal.bind(this, driver)}>Edit</a>
                            </Menu.Item>
                            <Menu.Item key="2">
                              <a href="#" onClick={this.openConfirmDeleteModal.bind(this,driver)}>Delete</a>
                            </Menu.Item>
                            </Menu>} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right">
                            <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                              <DotBtnIcon />
                            </a>
                          </Dropdown>
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
            :
              <EmptyComponent
                emptyText = "No Drivers"
              />
            }
          </div>
        </div>

        <ReactModal
          isOpen={this.props.driverModal}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.driverModalText}</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="name" value={this.state.name} onChange={this.handleChange.bind(this)}required />
                    <label className="material-textfield-label">First Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.name ? err.name : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="lastname" value={this.state.lastname} onChange={this.handleChange.bind(this)} required />
                    <label className="material-textfield-label"> Last Name </label>
                    <p className="text-danger">{err && err.lastname ? err.lastname : ""}</p>
                  </div>
                </div>
                </div>
                <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} required />
                    <label className="material-textfield-label">Email </label>
                    <p className="text-danger">{err && err.email ? err.email : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <InputMask
                      className="form-control material-textfield-input"
                      name="phone"
                      value={this.state.phone}
                      guide={false}
                      type="text"
                      keepCharPositions={false}
                      mask={phoneNumberMask}
                      onChange={this.handleChange.bind(this)} required/>
                    <label className="material-textfield-label">Phone <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.phone ? err.phone : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="tabletId" value={this.state.tabletId} onChange={this.handleChange.bind(this)} required />
                    <label className="material-textfield-label">Tablet ID <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.tabletId ? err.tabletId : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="license" value={this.state.license} onChange={this.handleChange.bind(this)} required />
                    <label className="material-textfield-label">Driver's License Number </label>
                    <p className="text-danger">{err && err.license ? err.license : ""}</p>
                  </div>
                </div>
              </div>
              <div className="row">
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
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <select onChange={this.handleChange.bind(this)}
                      name="haulerId"
                      value={this.state.haulerId}
                      className="form-control material-textfield-input custom-select">
                      <option value="">Select</option>
                      { _.get(this.state, 'haulerList', []).map((hauler, i)=>{
                          return (
                            <option key={i} value={hauler.id}>{hauler.company_name}</option>
                          )
                        })
                      }
                    </select>
                    <label className="material-textfield-label">Hauler <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.haulerId ? err.haulerId : ""}</p>
                  </div>
                </div>

              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <select
                      onChange= {this.handleChange.bind(this)}
                      value={this.state.status}
                      name="status"
                      className="form-control material-textfield-input custom-select">
                      <option value=''> Select status </option>
                      <option value={true}> Active </option>
                      <option value={false}> Inactive </option>
                    </select>
                    <label className="material-textfield-label">Status <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.status ? err.status : ""}</p>
                  </div>
                </div>
              </div>
              <p className="text-danger">{this.state.driverError}</p>
              <button onClick={this.saveDriver.bind(this)} className="btn btn-dark btn-lg w-100 font-800">Save</button>
            </div>
            </div>

        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'driver'}
        />

        <Pagination
          className="pb-3 text-center pagination-wrapper w-100 mt-3"
          current={this.state.page + 1}
          onChange={this.onPagechange.bind(this)}
          pageSize={this.state.limit}
          hideOnSinglePage= {true}
          total={_.get(this.state, 'totalDrivers', 0)}
        />
      </div>
    )
  }
}

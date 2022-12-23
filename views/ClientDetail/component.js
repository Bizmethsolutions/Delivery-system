import React, { PureComponent } from 'react'
import _ from "lodash"
import InputMask from 'react-text-mask'
import ReactModal from 'react-modal'
import { Switch, message, Menu, Dropdown } from 'antd'

import './styles.scss'
import config from '../../config/index'
import { BackArrowIcon } from '../../components/icons'
import { formatPhoneNumberWithBrackets, formatPhoneNumber } from '../../components/commonFormate'
import { DotBtnIcon } from '../../components/icons'
import { CloseIcon, MoreIcon } from '../../components/icons'
import UpdateCompanyInfo from './updateCompanyInfo.js'
const phoneNumberMask = config.phoneNumberMask

export default class ClientDetailComponent extends PureComponent {
  // static propTypes = {
  //    PropTypes go here
  // }
  constructor() {
    super()
    this.state = {
      users: [],
      modalIsOpen: false,
      err: {},
      companyDetail: {},
      switchStatusAdd: false,
      role: "",
      firstname: "",
      lastname: "",
      company_name: "",
      company_email: "",
      email: "",
      phone: "",
      username: "",
      companyUpdateModalIsOpen: false
    };
    this.onChangeToggle = this.onChangeToggle.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
    this.onChangeToggleAdd = this.onChangeToggleAdd.bind(this)
    this.createCompany = this.createCompany.bind(this)
    this.closeAddModal = this.closeAddModal.bind(this)
  }

  async componentDidMount () {
    this.getCompanyDetail()
    let { value } = await this.props.getCompanyUsers(this.props.match.params.id)
    this.setState({ users: value.data, company: _.get(this.props, 'location.state.company', {}) })
  }

  getCompanyDetail = async()=> {
    let { value } = await this.props.getCompanyDetail(this.props.match.params.id)
    this.setState({ companyDetail: value.data },()=>{
      this.forceUpdate()
    })
  }
  goBack () {
    this.props.history.goBack()
  }

  onHandleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  impersonate = async (email, type)=> {
    const { user } = this.props
    const data = {
      email: email,
      usertype: type
    }
    let { value } = await this.props.getToken(data)
    if (value.type=== 'success') {
      localStorage.setItem('superAdminEmail', localStorage.getItem('superadminemail'))
      localStorage.removeItem('isSuperadmin')
      //localStorage.setItem('customerid', value.data._id)
      localStorage.setItem('Authorization', value.data.token)
      localStorage.setItem('usertype', value.data.usertype)
      localStorage.setItem('userid', value.data._id)
      localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
      localStorage.setItem('isSuperAdminImpersonate', true)
      if(type === 'hauler') {
        localStorage.setItem('haulerid', value.data._id)
      }
      if(type === 'hauler') {
        this.props.history.push('/dispatcher')
      } else {
        this.props.history.push('/dashboard')
      }
    }
  }

  onChangeToggle = async (hauler, type, checked)  => {
    this.setState({ switchStatus: checked })
    const obj = {}
    obj.status = checked
    obj.id = hauler._id
    obj.type = type
    let { value } = await this.props.updateStatus(obj)
    if(value) {
      this.componentDidMount()

    }
    // console.log(`switch to ${checked}`);
  }

  closeModal() {
    this.setState({ modalIsOpen: false, companyUpdateModalIsOpen: false })
  }

  onOpen(user, type) {
    if(type === "user") {
      this.setState({
        firstname: _.get(user, 'firstname', ''),
        email: _.get(user, 'email', ''),
        lastname: _.get(user, 'lastname', ''),
        phone: _.get(user, 'phone', ''),
        username: _.get(user, 'username', ''),
        errorMessage: ""
      })
    } else if (type === "hauler") {
      this.setState({
        phone: _.get(user, 'phone', ''),
        company_name: _.get(user, 'company_name', ''),
        user_name: _.get(user, 'user_name', ''),
        email: _.get(user, 'company_email', ''),
        errorMessage: ""
      })
    }
    this.setState({ modalIsOpen: true, type, user })
  }
  validate() {
    let errObj = {}
    const usertype = this.state.type
    const { firstname, lastname, username, image, err, phone, company_name, email, cphone, user_name, companyname, contactname } = this.state
    if(usertype === "user") {
      if(firstname === "") {
        errObj.firstname = "First name is required"
      }
      if(lastname === "") {
        errObj.lastname = "Last name is required"
      }
      if(!username || username === "" || username === null) {
        errObj.username = "Username is required"
      }
      if(email === "") {
        errObj.email = "Email is required"
      }
    } else if (usertype === "hauler") {
      if(company_name === "") {
        errObj.company_name = "Company name is required"
      }
      if(user_name === "") {
        errObj.user_name = "User name is required"
      }
      if(email === "") {
        errObj.email = "Email is required"
      }
    }
    this.setState({ err: errObj })
  }

  updateCompany =  async() => {
    await this.validate()
    const { type, firstname, lastname, email, phone, username, user, company_name, user_name, err } = this.state
    const { updateUser } = this.props
    let obj = {}
     if(type === "user") {
      obj = {
        firstname, lastname, username, userId: user._id,phone: formatPhoneNumber(phone),email: email && email.toLowerCase(),
        usertype: type
      }
    } else if (type === "hauler") {
      obj = {
        company_name, phone: formatPhoneNumber(phone), user_name, userId: user._id,company_email: email && email.toLowerCase(),
        usertype: type
      }
    }
    if(Object.keys(err).length === 0) {
      try {
        const { value } = await updateUser(obj)
        if(value.type === "success") {
          if(!this.state.messageShown) {
            this.setState({ messageShown: true, modalIsOpen: false })
            this.componentDidMount()
            message.success("Information updated sucessfully.", () => {
              this.setState({ messageShown: false })
            })
          }
        }
      } catch(e) {
        if(!this.state.messageShown) {
          this.setState({ messageShown: true })
          message.error(_.get(e, 'error.message', ''), () => {
            this.setState({ messageShown: false })
          })
        }
      }

    }
  }
  openAddModal() {
    this.setState({ addModalIsOpen: true, firstname: "", lastname: "", email: "", phone: "", username: "" })
  }
  validateAdd() {
    const { firstname, lastname, email, phone, username, switchStatusAdd, role } = this.state
    const errObj = {}
    if(firstname === "") {
      errObj.firstname = "First name is required"
    }
    if(lastname === "") {
      errObj.lastname = "Last name is required"
    }
    if(username === "") {
      errObj.username = "Username is required"
    }
    if(email === "") {
      errObj.email = "Email is required"
    }
    if(role === "") {
      errObj.role = "Role is required"
    }
    this.setState({ err: errObj })
  }
  createCompany = async() => {
    await this.validateAdd()
    const { firstname, lastname, email, phone, username, switchStatusAdd, role, err } = this.state
    const obj = {
      email: email && email.toLowerCase(),
      lastname,
      firstname,
      username,
      role: role,
      status: switchStatusAdd ,
      phone: formatPhoneNumber(phone),
      companyId: this.props.match.params.id,
      usertype : "user",
      type : "admin",
      visible : true
    }
    if(Object.keys(err).length === 0) {
      try {
        let { value } = await this.props.addEnterpriseUser(obj)
        if(value && value.result && value.result.ok === 1) {
          this.setState({ addModalIsOpen: false })
          this.componentDidMount()
          message.success("User added successfully!")
        }
      } catch (e) {
      this.setState({ errorMessage: _.get(e, 'error.message', 'Error in adding user') })
      }
    }
  }
  onChangeToggleAdd(checked) {
    this.setState({ switchStatusAdd: checked })
  }

  closeAddModal() {
    this.setState({ addModalIsOpen: false })
  }
  openCompanyEditModal () {
    this.setState({ companyUpdateModalIsOpen: true })
  }

  render() {
    const { company, err, companyDetail } = this.state
    return (
      <div className="client-detail-container">
      <div className="row">
        <div className="col-sm-6">
          <div className="btn-back-header d-flex align-items-center">
            <button className="btn btn-link btn-back font-600" onClick={this.goBack.bind(this)}><BackArrowIcon /> Back</button>
            <h5 className="font-22 font-600 marg-left-40"> </h5>
          </div>
        </div>
      </div>



        <div className="outer">
        <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-between bord-btm">
              <h3>Company Information</h3>
              <button className="editinfo-user" onClick={this.openCompanyEditModal.bind(this)}>Edit Company Information</button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="lists">
              <ul>
                {/* <li>
                  <h4>Customer ID</h4>
                  <h6>13234</h6>
                </li> */}

                <li>
                  <h4>Company Name</h4>
                  <h6>{_.get(companyDetail, 'companyname', '')}</h6>
                </li>

                <li>
                  <h4>Company Address</h4>
                  {_.get(companyDetail, 'streetname', '') !== '' ?
                  <h6>{_.get(companyDetail, 'streetname', '')}<br/>
                  {_.get(companyDetail, 'city', '')} {_.get(companyDetail, 'state', '')}, {_.get(companyDetail, 'zip', '')}</h6> : 'N/A'}
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>

        <div className="clearfix"></div>


        <div>
        <div className="outer outer-down">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-between bord-btm">
                <h3>Company Users</h3>
                <button className="add-btn-user" onClick={this.openAddModal.bind(this)}>Add New User</button>
              </div>
            </div>
          </div>
        




          <div className="table-responsive">
            <table className="table custom-table-secondary">
              <thead>
                <tr>
                  <th>
                    <span className="custom-table-th-title">Name</span>
                  </th>
                  <th>
                    <span className="custom-table-th-title">Email</span>
                  </th>
                  <th>
                    <span className="custom-table-th-title">Phone Number</span>
                  </th>
                  <th>
                    <span className="custom-table-th-title">Role</span>
                  </th>
                  <th>
                    <span className="custom-table-th-title">Status</span>
                  </th>
                  <th>
                    <span className="custom-table-th-title"></span>
                  </th>
                    <th className="rem-pad width-50 padl0">
                    <span className="custom-table-th-title">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="table-card">
                {_.get(this.state, 'users.users', []).map((user, i)=>{
                    return (
                      <tr key={i}>
                        <td>
                          <span className="custom-table-title">{_.get(user, 'username', '') !== "" && _.get(user, 'username', '') !== undefined && _.get(user, 'username', '') !== null ? _.get(user, 'username', '') : _.get(user, 'firstname', '') }</span>
                        </td>
                        <td>
                          <span className="custom-table-title">{_.get(user, 'email', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title">{formatPhoneNumberWithBrackets(_.get(user, 'phone', ''))}</span>
                        </td>
                        <td>
                          <span className="custom-table-title">{_.get(user, 'type', '') === "admin" ? "Admin": "Regular User"}</span>
                        </td>
                        <td>
                          <span className="custom-table-title"><Switch checked={_.get(user, 'status', false)} onChange={this.onChangeToggle.bind(this, user, 'user')} /></span>
                        </td>
                        <td>
                          <button className="btn btn-impersonate font-16 font-600" onClick={this.impersonate.bind(this, user.email, 'user')}>Impersonate</button>
                        </td>
                        <td className="global-modal-alert padl0 tt">
                          <Dropdown overlay={
                            <Menu>
                              <Menu.Item key="1" onClick={this.onOpen.bind(this, user, 'user')}>
                                <a href="#">Edit</a>
                              </Menu.Item>
                            </Menu>
                          } trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm">
                            <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                              <DotBtnIcon />
                            </a>
                          </Dropdown>
                        </td>
                      </tr>
                    )
                  })
                }
                {_.get(this.state, 'users.haulers', []).map((user, i)=>{
                    return (
                      <tr key={i}>
                        <td>
                          <span className="custom-table-title">{_.get(user, 'company_name', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title">{_.get(user, 'company_email', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title">{formatPhoneNumberWithBrackets(_.get(user, 'phone', ''))}</span>
                        </td>
                        <td>
                          <span className="custom-table-title">Hauler</span>
                        </td>
                        <td>
                          <span className="custom-table-title"><Switch checked={_.get(user, 'status', false)} onChange={this.onChangeToggle.bind(this, user, 'hauler')} /></span>
                        </td>
                        <td>
                          <button className="btn btn-impersonate font-16 font-600" onClick={this.impersonate.bind(this,  user.company_email, 'hauler')}>Impersonate</button>
                        </td>
                        <td className="global-modal-alert posi-rel padl0">
                          <Dropdown overlay={
                            <Menu>
                              <Menu.Item key="1" onClick={this.onOpen.bind(this, user, 'hauler')}>
                                <a href="#">Edit</a>
                              </Menu.Item>
                            </Menu>
                          } trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm">
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
            <ReactModal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              contentLabel="Add Team Member"
              ariaHideApp={false}
            >
              <div className="react-modal-dialog react-modal-dialog-centered">
                <div className="react-modal-header">
                  <h5 className="react-modal-title">Edit User</h5>
                  <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
                </div>
                <div className="divider-line"></div>
                {this.state.type === "user" ?
                <div className="react-modal-body">
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
                        <p className="text-danger">{_.get(this.state, 'err.firstname', '')}</p>
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
                        <p className="text-danger">{_.get(this.state, 'err.lastname', '')}</p>
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
                      name="username"
                      value={this.state.username}
                      required />
                    <label className="material-textfield-label">Username <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'err.username', '')}</p>
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
                          onChange={this.onHandleChange}
                          required />
                        <label className="material-textfield-label">Phone</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
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
                        <p className="text-danger">{_.get(this.state, 'err.email', '')}</p>
                      </div>
                    </div>
                  </div>
                  <p className="m-0 p-0 text-danger">{_.get(this.state,'errorMessage', '')}</p>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.updateCompany.bind(this)}>Update</button>
                </div> :
                <div className="react-modal-body">
                <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          name="company_name"
                          value={this.state.company_name}
                          onChange={this.onHandleChange.bind(this)}
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
                          onChange={this.onHandleChange.bind(this)}
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
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Username<span className="text-danger">*</span></label>
                        <p className="text-danger">{err && err.user_name ? err.user_name : ""}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input
                          type="text"
                          className="form-control material-textfield-input"
                          onChange= {this.onHandleChange}
                          name="email"
                          value={this.state.email}
                          required />
                        <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                        <p className="text-danger">{_.get(this.state, 'err.email', '')}</p>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.updateCompany.bind(this)}>Update</button>
                  <p className="m-0 p-0">{_.get(this.state,'errorMessage', '')}</p>
                </div> }
              </div>
            </ReactModal>
            <ReactModal
              isOpen={this.state.addModalIsOpen}
              onRequestClose={this.closeAddModal}
              contentLabel="Add Team Member"
              ariaHideApp={false}
            >
              <div className="react-modal-dialog react-modal-dialog-centered">
                <div className="react-modal-header">
                  <h5 className="react-modal-title">Add User</h5>
                  <button type="button" className="btn react-modal-close" onClick={this.closeAddModal}><CloseIcon /></button>
                </div>
                <div className="divider-line"></div>
                <div className="react-modal-body">
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
                        <p className="text-danger">{_.get(this.state, 'err.firstname', '')}</p>
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
                        <p className="text-danger">{_.get(this.state, 'err.lastname', '')}</p>
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
                      name="username"
                      value={this.state.username}
                      required />
                    <label className="material-textfield-label">Username <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'err.username', '')}</p>
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
                          onChange={this.onHandleChange}
                          required />
                        <label className="material-textfield-label">Phone</label>
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
                          name="email"
                          value={this.state.email}
                          required />
                        <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                        <p className="text-danger">{_.get(this.state, 'err.email', '')}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <select
                          className="form-control material-textfield-input custom-select"
                          name="role"
                          value={this.state.role}
                          onChange={this.onHandleChange.bind(this)}
                          required>
                          <option value="">Select role</option>
                          <option value="user">Regular user</option>
                          <option value="admin">Admin</option>
                        </select>
                        <label className="material-textfield-label">Role<span className="text-danger">*</span> </label>
                        <p className="text-danger mb-0 mt-0">{err && err.role ? err.role : ""}</p>
                      </div>
                    </div>
                  </div>
                <div className="row">
                  <div className="col-md-12 mt-4">
                    <div className="form-group d-flex align-item-center">
                      <Switch checked={this.state.switchStatusAdd} onChange={this.onChangeToggleAdd} />
                      <label className="switchlabel">Active<span className={this.state.switchStatusAdd ? "switchstatus": "switchstatus-no"}>{this.state.switchStatusAdd ? "Yes" : "No"}</span></label>
                    </div>
                  </div>
                </div>
                  <p className="m-0 p-0 text-danger">{_.get(this.state,'errorMessage', '')}</p>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.createCompany.bind(this)}>Add</button>
                </div>
              </div>
            </ReactModal>
          </div>

          </div>
        </div>

        {this.state.companyUpdateModalIsOpen ?
        <UpdateCompanyInfo
          modalIsOpen= {this.state.companyUpdateModalIsOpen}
          companyDetail = {this.state.companyDetail}
          closeModal={this.closeModal.bind(this)}
          getCompanyInfo={this.getCompanyDetail.bind(this)}
          {...this.props}
        /> : ""}
      </div>
    )
  }
}

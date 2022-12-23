import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { Menu, Dropdown, Pagination, message } from 'antd'
import _ from "lodash"
import './styles.scss'

import { CloseIcon } from '../../components/icons'
import InputMask from 'react-text-mask'
import {  DotBtnIcon } from '../../components/icons'
import config from '../../config/index'
import { formatGeoAddressComponents ,formatOrderAddess ,formatPhoneNumber } from '../../components/commonFormate'
import AddressAutoComplete from '../../components/AddressAutoComplete'
import DeleteModal from '../../components/deleteModal'
import EmptyComponent from '../../components/emptyComponent'
const phoneNumberMask = config.phoneNumberMask

export default class UserManagementComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      isViewModalOpen: false,
      isEditModalOpen: false,
      email: '',
      customerEmail: '',
      lastname: '',
      firstname: '',
      phone: '',
      err: {},
      role: '',
      status: true,
      streetname: '',
      townname: '',
      state: '',
      zipcode: '',
      companyname: '',
      customers: [],
      totalCustomers: 0,
      search_string: '',
      sort_field: 'companyname',
      by: 1,
      page: 0,
      limit: 20,
      updateModalIsOpen: false,
      deleteModelIsOpen: false,
      customerId: '',
      modalTitle: 'Create User'
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ modalIsOpen: false, deleteModelIsOpen: false })
    this.setState({
      email: '', firstname: '', phone: '', zipcode: '', state: '', lastname: "",
      lastName: '', role: '', status: '', streetname: '', townname: '', companyname: '',
      customerId: '', saveClicked: false, errMessage: "", customerEmail: ''
    })
  }

  toggleViewModal = () => {
    this.setState({ isViewModalOpen: !this.state.isViewModalOpen })
  }

  toggleEditModal = () => {
    this.setState({ isEditModalOpen: !this.state.isEditModalOpen })
  }

  componentDidMount = async () => {

    document.title = 'User Management | CurbWaste'
    let id = localStorage.getItem('userid')
    this.fetchCustomers()
    let data = {
      user: {
        id: localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype")
      }
    }
    this.props.getUser(data)
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      id = _.get(this.props, 'user.createdBy', undefined)
    }
    let data2 = {
      user: {
        id: id,
        usertype: localStorage.getItem("usertype")
      }
    }
    const { getUserDetail } = this.props
    const { value } = await getUserDetail(data2)
    this.setState({ accountowner: _.get(value, 'data', '')})
  }

  handleChange(e) {
    this.setState({ [e.target.name] : e.target.value}, () => {
      if(this.state.saveClicked === true) {
        this.validate()
      }
    })
  }

  validate() {
    let errObj = {}
    const { email, companyname, lastname, firstname, phone, err, role, status, townname, state, zipcode, streetname } = this.state
    if (email) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
        errObj.email = "Please enter a valid email address"
      }
    }
    if(email === "") {
      errObj.email = "Email is required"
    }
    if(firstname.length < 3) {
      errObj.firstname = "Please enter atleast 3 characters"
    }
    if(lastname.length < 2) {
      errObj.lastname = "Please enter atleast 2 characters"
    }
    if(lastname === "") {
      errObj.lastname = "Last name is required"
    }
    if(firstname === "") {
      errObj.firstname = "First name is required"
    }

    if(role === "") {
      errObj.role = "Role is required"
    }

    if(status === "") {
      errObj.status = "Status name is required"
    }

    // if(phone === "") {
    //   errObj.phone = "Cell Phone number is required"
    // }
    // const phonelength = phone.replace(/[^0-9]/g,"").length
    // if(phonelength !== 10) {
    //   errObj.phone = "Please enter exactly 10 digit number"
    // }
    this.setState({ err: errObj })
  }

  saveUser= async ()=> {
    this.setState({ saveClicked : true })
    await this.validate()
    const {err, email} = this.state
    if (Object.keys(err).length === 0) {
      let customerid = localStorage.getItem('userid')
      if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
        customerid = _.get(this.props, 'user.createdBy', undefined)
      }
      const obj ={
        email: email && email.toLowerCase(),
        contactname: this.state.firstname + " " + this.state.lastname,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        role: this.state.role,
        streetname: this.state.streetname,
        townname: this.state.townname,
        zipcode: this.state.zipcode,
        state: this.state.state,
        companyname: _.get(this.props, 'user.companyname', ''),
        status: this.state.status,
        phone: formatPhoneNumber(this.state.phone),
        createdBy: customerid,
        customerid: _.get(this.state, 'customerid', ''),
        website: _.get(this.state, 'website', ''),
        fax: _.get(this.state, 'fax', ''),
        other: _.get(this.state, 'other', ''),
        mobile: _.get(this.state, 'mobile', ''),
      }
      if (!this.state.customerId || this.state.customerId === ''){
        try {
          let { value } = await this.props.addCostomer(obj)
          if(value) {
            this.fetchCustomers()
            this.closeModal()
          }
        } catch (e) {
          this.setState({ errMessage: _.get(e, 'error.message', 'Email Already Exist')})
        }
      } else {
        obj.id = this.state.customerId
        try {
          if (_.get(this.props, 'user.email', '') === _.get(this.state, 'customerEmail', '') && _.get(this.props, 'user.createdBy', null) === null) {
            delete obj.createdBy
          }

          let { value } = await this.props.updateCostomer(obj)
          if(value) {
            this.fetchCustomers()
            this.closeModal()
          }
        } catch (e) {
          this.setState({ errMessage: _.get(e, 'error.message', 'Email Already Exist')})
        }

      }
    }
  }

  goBack () {
    const usertype = localStorage.getItem('usertype')
    if(usertype !== "haluer")
      this.props.history.push('/dashboard')
    else
      this.props.history.push('/dispatcher')
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

  async fetchCustomers() {
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
      customers: _.get(value, 'customers', []),
      totalCustomers: _.get(value, 'total', 0)
    })
  }

  onPagechange (nextPage) {
    let page = nextPage - 1
    this.setState({ page }, ()=>{
      this.fetchCustomers()
    })
  }

  openConfirmDeleteModal (id) {
    this.setState({ customerId: id, deleteModelIsOpen: true })
  }

  async confirmDelete (){
    let id = this.state.customerId
    let { value } = await this.props.deleteCustomer(id)
    message.success('successfully deleted')
    this.fetchCustomers()
    this.closeModal()
  }

  openUpdateModel (customerInfo) {
    this.setState({
      companyname: _.get(customerInfo, 'companyname', ''),
      email: _.get(customerInfo, 'email', ''),
      customerEmail: _.get(customerInfo, 'email', ''),
      firstname: _.get(customerInfo, 'firstname', ''),
      lastname: _.get(customerInfo, 'lastname', ''),
      streetname: _.get(customerInfo, 'streetname', ''),
      phone: _.get(customerInfo, 'phone', ''),
      townname: _.get(customerInfo, 'townname', ''),
      state: _.get(customerInfo, 'state', ''),
      zipcode: _.get(customerInfo, 'zipcode', ''),
      role: _.get(customerInfo, 'role', ''),
      status: _.get(customerInfo, 'status', ''),
      customerId: _.get(customerInfo, 'id', ''),
      customerid: _.get(customerInfo, 'customerid', ''),
      website: _.get(customerInfo, 'website', ''),
      fax: _.get(customerInfo, 'fax', ''),
      other: _.get(customerInfo, 'other', ''),
      mobile: _.get(customerInfo, 'mobile', ''),
      modalTitle: "Edit User",
      modalIsOpen: true,
      errMessage: ""
    })
  }

  render() {
    const { err } = this.state
    return (
      <div>
      <div className="settings-top-header d-flex flexmanagement align-item-center justify-bet">
        <h3 className="settings-top-heading-lg">User Management</h3>

        <div class="ml-auto">
          <button class="btn btn-dark w-180 font-600 font-16 mr-4 management-adduser" onClick={this.openModal}>Add New User</button>
          <button onClick={this.goBack.bind(this)} className="settings-card-close"><CloseIcon /></button>
        </div>
      </div>

        <div className="container">
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="">
            { _.get(this.state, 'customers', []).length > 0 ?
                <div className="table-responsive">
                      <table className="table table1024 custom-table-secondary">
                    <thead>
                      <tr>
                        <th>
                            <span className="custom-table-th-title-sm">Name</span>
                        </th>
                          <th>
                            <span className="custom-table-th-title-sm">Email</span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm">Phone Number</span>
                        </th>
                        <th>
                            <span className="custom-table-th-title-sm">Role</span>
                        </th>
                          <th>
                            <span className="custom-table-th-title-sm">Status</span>
                          </th>
                          <th className="width-50">
                            <span className="custom-table-th-title-sm">Actions</span>
                          </th>
                      </tr>
                    </thead>
                    <tbody className="table-card tablewhite">
                    {/* { _.get(this.state, 'accountowner', {}) &&
                        <tr key="0">
                          <td>
                              <span className="custom-table-title-md">{_.get(this.state, 'accountowner.contactname', '')}</span>
                          </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(this.state, 'accountowner.email', '')}</span>
                            </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(this.state, 'accountowner.phone', '')}</span>
                            </td>
                            <td>
                              <span className="custom-table-title-md">Account Owner</span>
                          </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(this.state, 'accountowner.status', '') === 'true' || _.get(this.props.user, 'status', '') === true ? "Active" : "Inactive"}</span>
                            </td>
                            <td className="global-modal-alert">

                            </td>
                        </tr>} */}
                      { _.get(this.state, 'customers', []).map((customer, i)=>{
                        return (
                        <tr key={i}>
                          <td>
                              <span className="custom-table-title-md">{_.get(customer, 'contactname', '')}</span>
                          </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(customer, 'email', '')}</span>
                            </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(customer, 'phone', '')}</span>
                            </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(customer, 'role', '') === 'admin' ? "Admin" : _.get(customer, 'role', '') === 'user' ? "Regular User" : _.get(customer, 'email', '') === _.get(this.state, 'accountowner.email', '') ? "Account Owner": "Admin" }</span>
                          </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(customer, 'status', '') === 'true' || _.get(customer, 'status', '') === true ? "Active" : "Inactive"}</span>
                            </td>
                            <td className="global-modal-alert">
                              <Dropdown overlay={
                                <Menu>
                                  <Menu.Item key="1">
                                    <a href="javascript:void(0)" onClick={this.openUpdateModel.bind(this, customer)} >Edit</a>
                                  </Menu.Item>
                                  {_.get(this.props, 'user.email', '') !== _.get(customer, 'email', '') ?
                                  <Menu.Item key="2">
                                    <a href="javascript:void(0)" onClick={this.openConfirmDeleteModal.bind(this,customer.id )}>Delete</a>
                                  </Menu.Item>
                                  : "" }
                                </Menu>
                              } trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm">
                                <a className="ant-dropdown-link d-flex align-items-center justify-center" href="javascript:void(0)">
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
              <EmptyComponent emptyText = "No Users"/>
            }
          </div>
        </div>
      </div>
      </div>
        {/* order modal open */}
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.modalTitle}</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
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
                    <label className="material-textfield-label">First Name <span className="text-danger">*</span></label>
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
                  <InputMask
                    className="form-control material-textfield-input"
                    name="phone"
                    value={this.state.phone}
                    guide={false}
                    type="text"
                    keepCharPositions={false}
                    mask={phoneNumberMask}
                    onChange={this.handleChange.bind(this)} required/>
                    <label className="material-textfield-label">Phone Number</label>
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
                      onChange={this.handleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.email ? err.email : ""}</p>
                  </div>
                </div>
              </div>

              {_.get(this.props, 'user.email', '') !== _.get(this.state, 'customerEmail', '') ?
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select
                      className="form-control material-textfield-input custom-select"
                      name="role"
                      value={this.state.role}
                      onChange={this.handleChange.bind(this)}
                      required>
                      <option value="">Select role</option>
                      <option value="user">Regular user</option>
                      <option value="admin">admin</option>
                    </select>
                    <label className="material-textfield-label">Role<span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.role ? err.role : ""}</p>
                  </div>
                </div>
              </div> : ''}

              {_.get(this.props, 'user.email', '') !== _.get(this.state, 'customerEmail', '') ?
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select
                      className="form-control material-textfield-input custom-select"
                      name="status"
                      value={this.state.status}
                      onChange={this.handleChange.bind(this)}
                      required>
                      <option value="">Select status</option>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                    <label className="material-textfield-label">Status<span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.status ? err.status : ""}</p>
                  </div>
                </div>
              </div> : ''}
              <p className="text-danger">{this.state.errMessage}</p>
              <button onClick={this.saveUser.bind(this)} className="btn btn-dark btn-lg w-100 font-800">Save</button>
            </div>
          </div>
        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'customer’s'}
        />

        <Pagination
          className="pb-3 text-center pagination-wrapper w-100 mt-3"
          current={this.state.page+1}
          onChange={this.onPagechange.bind(this)}
          pageSize={this.state.limit}
          hideOnSinglePage= {true}
          total={_.get(this.state, 'totalCustomers', 0)}
        />
        {/* order modal close */}
      </div>
    )
  }
}

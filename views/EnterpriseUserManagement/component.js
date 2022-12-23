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
import { formatPhoneNumber } from '../../components/commonFormate'
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
      lastname: '',
      firstname: '',
      phone: '',
      err: {},
      users: [],
      search_string: '',
      sort_field: 'username',
      by: 1,
      page: 0,
      limit: 20,
      updateModalIsOpen: false,
      deleteModelIsOpen: false,
      userId: '',
      modalTitle: 'Create User'
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true, phone: "", modalTitle: "Create User" })
  }

  closeModal() {
    this.setState({ modalIsOpen: false, deleteModelIsOpen: false })
    this.setState({
      email: '', firstname: '', lastname: "", userId: "", username: "", error: "",
      role: '',
      saveClicked: false
    })
  }

  toggleViewModal = () => {
    this.setState({ isViewModalOpen: !this.state.isViewModalOpen })
  }

  toggleEditModal = () => {
    this.setState({ isEditModalOpen: !this.state.isEditModalOpen })
  }

  componentDidMount () {
    document.title = 'User Management | CurbWaste'
    this.fetchUsers()
  }

  fetchUsers = async()=> {
    let companyId = String(localStorage.getItem('companyId'))
    let { value } = await this.props.getCompanyUsers(companyId)
    let users = value.data.users
    var removeIndex = users.map(function(item) { return item.companyId }).indexOf(localStorage.getItem('companyId'))
    // remove object
    users.splice(removeIndex, 1);

    this.setState({ users: users, companyId: localStorage.getItem('companyId') })
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
    const { email, lastname, firstname, err, role } = this.state
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
      const obj ={
        email: email && email.toLowerCase(),
        lastname: this.state.lastname,
        firstname: this.state.firstname,
        role: this.state.role,
        status: this.state.status ,
        phone: formatPhoneNumber(this.state.phone),
        companyId: localStorage.getItem('companyId'),
        usertype : "user",
        type : "admin",
        visible : true
      }
      if (!this.state.userId || this.state.userId === ''){
        try {
          let { value } = await this.props.addEnterpriseUser(obj)
          this.fetchUsers()
          this.closeModal()
        } catch (e) {
          this.setState({ error: e && e.error.message })
        }
      } else {
        obj.id = this.state.userId
        try {
          let { value } = await this.props.updateEnterpriseUser(obj)
          this.fetchUsers()
          this.closeModal()
        } catch (e) {
          this.setState({ error: e && e.error.message })
        }
      }
    }
  }

  goBack () {
    this.props.history.goBack()
  }

  onPagechange (nextPage) {
    let page = nextPage - 1
    this.setState({ page }, ()=>{
      this.fetchUsers()
    })
  }

  openConfirmDeleteModal (id) {
    this.setState({ userId: id, deleteModelIsOpen: true })
  }

  async confirmDelete (){
    let id = this.state.userId
    let { value } = await this.props.deleteEnterpriseUser(id)
    message.success('successfully deleted')
    this.fetchUsers()
    this.closeModal()
  }

  openUpdateModel (user) {
    this.setState({
      username: _.get(user, 'username', ''),
      email: _.get(user, 'email', ''),
      oldemail: _.get(user, 'email', ''),
      firstname: _.get(user, 'firstname', ''),
      lastname: _.get(user, 'lastname', ''),
      role: _.get(user, 'role', ''),
      phone: _.get(user, 'phone', ''),
      userId: _.get(user, '_id', ''),
      status: _.get(user, 'status', ''),
      modalTitle: "Edit User",
      modalIsOpen: true
    })
  }

  render() {
    const { err, users } = this.state
    return (
      <div>
        <div className="settings-top-header d-flex unsetflex-enterprises align-item-center justify-bet">
        <h3 className="settings-top-heading-lg">User Management</h3>

        <div className="ml-auto">
            <button className="btn btn-dark w-180 font-600 font-16 mr-4" onClick={this.openModal}>Add New User</button>
          <button onClick={this.goBack.bind(this)} className="settings-card-close"><CloseIcon /></button>
        </div>
      </div>

        <div className="container">
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="">
            { _.get(this.state, 'users', []).length > 0 ?
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
                        {/* <th>
                          <span className="custom-table-th-title-sm">Username</span>
                        </th> */}
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
                      { _.get(this.state, 'users', []).map((user, i)=>{
                        return (
                        <tr key={i}>
                          <td>
                              <span className="custom-table-title-md">{_.get(user, 'firstname', '')} {_.get(user, 'lastname', '')}</span>
                          </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(user, 'email', '')}</span>
                            </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(user, 'phone', '')}</span>
                            </td>
                            {/* <td>
                              <span className="custom-table-title-md">{_.get(user, 'username', '') }</span>
                            </td> */}
                            <td>
                              <span className="custom-table-title-md">{_.get(user, 'role', '') === 'user' ? "Regular User" : "Admin"}</span>
                            </td>
                            <td>
                              <span className="custom-table-title-md">{_.get(user, 'status', '') === 'true' || _.get(user, 'status', '') === true ? "Active" : "Inactive"}</span>
                            </td>
                            <td className="global-modal-alert posi-rel">
                              <Dropdown overlay={
                                <Menu>
                                  <Menu.Item key="1">
                                    <button className="btn-menu" href="javascript:void(0)" onClick={this.openUpdateModel.bind(this, user)} >Edit</button>
                                  </Menu.Item>
                                  <Menu.Item key="2">
                                    <button className="btn-menu" onClick={this.openConfirmDeleteModal.bind(this,user._id )}>Delete</button>
                                  </Menu.Item>
                                </Menu>
                              } trigger={['click']} overlayClassName="profile--dropdown--overlay minusleft-60">
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
                  </div>
                </div>
              </div>
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
                    <p className="text-danger mb-0 mt-0">{err && err.role ? err.role : ""}</p>
                  </div>
                </div>
              </div>
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
              </div>
              <p className="text-danger mb-0 mt-0">{_.get(this.state, 'error', '')}</p>
              <button onClick={this.saveUser.bind(this)} className="btn btn-dark btn-lg w-100 font-800">Save</button>
            </div>
          </div>
        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'user’s'}
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

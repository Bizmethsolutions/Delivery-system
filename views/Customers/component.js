import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import _ from "lodash"
import { Menu, Dropdown, Popconfirm, message, Pagination } from 'antd'

import EmptyComponent from '../../components/emptyComponent'
import { CloseIcon, MoreIcon } from '../../components/icons'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { SortingNewDownIcon, SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../components/icons'
import { formatPhoneNumber, formatPhoneNumberWithBrackets, formatOrderAddess, formatGeoAddressComponents } from '../../components/commonFormate'
import AddressAutoComplete from '../../components/AddressAutoComplete'
import minusIcon from './../../images/minusIcon.svg'
import plusIcon from './../../images/plusIcon.svg'
import UpdateCustomer from './updateCustomer.js'
import ViewCustomer from './viewCustomer.js'
import DeleteModal from '../../components/deleteModal'
import config from '../../config/index'
// import PropTypes from 'prop-types'

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
			// additionalname: [],
			// additionalemail: [],
      // additionalErrors: [],
      error: {},
      updateModalIsOpen: false,
      deleteModelIsOpen: false,
      customerInfo: {},
      totalCustomers: 0,
      customerId: '',
      state: '',
      firstname: "",
      lastname: "",
      messageShown: true,
      // FOR SIDEBAR
      isSidebarOpen: false,
      viewModalIsOpen: false,
      loadervisible: false
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, deleteModelIsOpen: false })
    this.setState({ companyname: '', email: '', streetname: '', phone: '',
    townname: '', fax: '', zipcode: '', other: '',
    contactname: '', website: '', state: '',
    mobile: '' })
  }

  componentDidMount () {
    document.title = 'Customers | CurbWaste'
    this.fetchCustomers()
  }

  impersonate = async (customer)=> {
    const { user } = this.props
    const data = {
      email: customer.email,
      usertype: 'customer'
    }
    let { value } = await this.props.getToken(data)
    if (value.type=== 'success') {
      localStorage.setItem('companyEmail', _.get(user, 'email', ''))
      localStorage.setItem('customerid', value.data._id)
      localStorage.setItem('Authorization', value.data.token)
      localStorage.setItem('userid', value.data._id)
      localStorage.setItem('usertype', value.data.usertype)
      localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
      localStorage.setItem('isImpersonate', true)
      this.props.history.push('/dashboard')
    }
  }

  async fetchCustomers() {
    const { search_string, limit, by, page, sort_field  } = this.state
    this.setState({ loadervisible: true })
    let data = {
      search_string,
      limit,
      by,
      page,
      sort: sort_field
    }
    let { value } = await this.props.fetchCustomers(data)
    this.setState({
      loadervisible: false,
      customers: _.filter(_.get(value, 'customers', []), (c) => {
        return c.createdBy === undefined
      }),
      totalCustomers: _.get(value, 'total', 0)
   })
  }

  onSearch (key) {
    this.setState({ search_string: key}, ()=>{
      this.fetchCustomers()
    })
  }

  onPagechange (nextPage) {
    let page = nextPage - 1
    this.setState({ page }, ()=>{
      this.fetchCustomers()
    })
  }

  address (customer) {
    let data = {
      address: _.get(customer, 'streetname', ''),
      city: _.get(customer, 'townname', ''),
      state: _.get(customer, 'state', ''),
      zipcode: _.get(customer, 'zipcode', ''),
      borough: _.get(customer, 'borough', ''),
    }
    let address = formatOrderAddess(data)
    return address
  }

  // addDivTag(){
	// 	this.setState({
	// 		divTag: this.state.divTag.concat([{
	// 			 companyname: '',
	// 			 email: ''
	// 		}])
	// 	})
	// }

  openConfirmDeleteModal (id) {
    this.setState({ customerId: id, deleteModelIsOpen: true })
  }

  // additional(){
	// 	return this.state.divTag.map((object, index)=>(
  //     <div className="row" key={index}>
  //       <div className="col-md-12 col-sm-12">
  // 				<img src={minusIcon} onClick={(event)=> this.removeDivTag(index)} className="remove-field" />
  // 			</div>
  //       <div className="col-md-6">
  //         <div className="form-group material-textfield">
  //           <input
  //             type="text"
  //             className="form-control material-textfield-input"
  //             value={object.companyname}
  //             onChange={this.handleDivOnChange('companyname', index)}
  //             required />
  //           <label className="material-textfield-label">Additional Name {index+1} <span className="text-danger">*</span></label>
  //         </div>
  //       </div>
  //       <div className="col-md-6">
  //         <div className="form-group material-textfield">
  //           <input
  //             type="text"
  //             className="form-control material-textfield-input"
  //             value={object.email}
  //             onChange={this.handleDivOnChange('email', index)}
  //             required />
  //           <label className="material-textfield-label">Additional Email {index+1} <span className="text-danger">*</span></label>
  //         </div>
  //       </div>
  //     </div>
  // ))
	// }

  // removeDivTag(idx) {
	// 	this.setState({
	// 		divTag: this.state.divTag.filter((s, sidx) => idx !== sidx)
	// 	}, ()=>{
  //     this.forceUpdate()
  //   })
	// }

  onHandleChange (e) {
    if ( e.target.name === 'phone' || e.target.name === 'mobile' || e.target.name === 'fax' ) {
      this.setState({ [e.target.name]: formatPhoneNumber(e.target.value) })
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }

  }

  // handleDivOnChange(field, idx){
	// 	let self = this;
	// 	return function(evt) {
	// 		const newDivTag = self.state.divTag.map((divObject, sidx) => {
	// 			// console.log("idx: ", idx, " sidx: ", sidx);
	// 			if (idx !== sidx) return divObject
	// 			if(field === 'companyname')
	// 				return { ...divObject, companyname: evt.target.value };
	// 			else if(field === 'email')
	// 				return { ...divObject, email: evt.target.value }
	// 		});
	// 		self.setState({ divTag: newDivTag })
	// 	}
	// }

  checkValidations () {
    const self = this
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let require = false
    let error = {}
    let fields = ['companyname', 'email', 'phone', 'zipcode', 'firstname', 'streetname', "townname", "state" ]
    _.forEach(fields, function(field, i) {
      if (self.state[field] == undefined || self.state[field] == "") {
        error[field] = 'Required'
        require = true
      } else if (field === 'email') {
        let testR = regex.test(String(self.state[field]).toLowerCase())
        if (!testR) {
          error[field] = 'Invalid email'
          require = true
        } else {
          error[field] = ''
        }
      } else if(field === 'phone') {
        let phone = self.state.phone.replace(/\-/g, '').replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '').replace(/^(-)+|(-)+$/g, '').replace('-', '')
        if (phone.toString().length !== 10) {
          require = true
          error[field] = 'Please enter 10 digit Phone Number'
        } else {
          error[field] = ''
        }
      } else if(field === 'zipcode') {
        if (self.state.zipcode.length !== 5) {
          require = true
          error[field] = 'Please enter 5 digit Zipcode Number'
        } else {
          error[field] = ''
        }
      } else {
        error[field] = ''
      }
    })

    let additionalErrors = []
    // if (this.state.divTag.length > 0) {
    //   for (let i=0; i< self.state.divTag.length; i++) {
  	// 		if (!self.state.divTag[i].companyname) {
    //       require = true
    //       additionalErrors.push(`Please enter the companyname${i+1}`)
    //     }
  	// 		if (!self.state.divTag[i].email) {
    //       additionalErrors.push(`Please enter the email${i+1}`)
    //       require = true
    //     } else {
    //       let testR = regex.test(String(self.state.divTag[i].email).toLowerCase())
    //       if (!testR) {
    //         additionalErrors.push(`Please enter the valid email${i+1}`)
    //         require = true
    //       }
    //     }
  	// 	}
    // }

    if(self.state.mobile) {
      let mobile = self.state.mobile.replace(/\-/g, '').replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '').replace(/^(-)+|(-)+$/g, '').replace('-', '')
      if (mobile.toString().length !== 10) {
        require = true
        error['mobile'] = 'Please enter 10 digit Mobile Number'
      } else {
        error['mobile'] = ''
      }
    }
    if(self.state.fax) {
      let fax = self.state.fax.replace(/\-/g, '').replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '').replace(/^(-)+|(-)+$/g, '').replace('-', '')
      if (fax.toString().length !== 10) {
        require = true
        error['fax'] = 'Please enter 10 digit Fax'
      } else {
        error['fax'] = ''
      }
    }

    if (self.state.website) {
      var pattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
      if (!pattern.test(self.state.website)) {
        require = true
        error['website'] = 'Please enter valid url'
      } else {
        error['website'] = ''
      }
    }

    this.setState({error, additionalErrors})
    return require
  }

  async saveInfo () {
    const companyId = localStorage.getItem('companyId')
    let validate = this.checkValidations()
    if (!validate) {
      // for(let i=0; i< this.state.divTag.length; i++) {
    	// 	if(this.state.divTag[i].companyname && this.state.divTag[i].email){
    	// 		this.state.additionalname.push(this.state.divTag[i].companyname);
    	// 		this.state.additionalemail.push(this.state.divTag[i].email);
    	// 	}
      // }

      const {
        companyname, email, streetname, phone,
        townname, fax, zipcode, other,
        contactname, website,
        mobile, state, firstname, lastname } = this.state

      let data = {
        companyname, email: email && email.toLowerCase(), streetname, phone,
        townname, fax, zipcode, other,
        contactname: (firstname + " " + lastname), website,firstname, lastname,
        mobile, state, status: true, role: 'admin'
      }
      try {
        let { value } = await this.props.addCostomer(data)
        // if(value.type === 'success') {
          this.closeModal()
          this.setState({ companyname: '', email: '', streetname: '', phone: '',
          townname: '', fax: '', zipcode: '', other: '',
          contactname: '', website: '', state: '',
          mobile: ''})
          this.fetchCustomers()
          if(this.state.messageShown) {
            this.setState({messageShown: false})
            message.success("Customer added successfully.", () => {
              this.setState({messageShown: true})
            })
          }
        // }
      }
      catch(e){
        if(this.state.messageShown) {
          this.setState({messageShown: false})
          message.error(_.get(e, 'error.message', 'Error in processing requests'), () => {
            this.setState({messageShown: true})
          })
        }
      }
    }
  }

  async confirmDelete (){
    let id = this.state.customerId
    let { value } = await this.props.deleteCustomer(id)
    message.success('successfully deleted')
    this.fetchCustomers()
    this.closeModal()
  }

  cancel =(e)=> {
    // console.log(e);
    // message.error('Click on No');
  }

  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1;
    } else {
        this.state.sort_field = field;
        this.state.by = 1;
    }
    this.fetchCustomers();
  }

  updateModalClose () {
    this.setState({ updateModalIsOpen: false, viewModalIsOpen: false, customerInfo: {} })
  }

  openUpdateModel (customer) {
    this.setState({ updateModalIsOpen: true, customerInfo: customer })
  }
  openViewModel (customer) {
    this.setState({ viewModalIsOpen: true, customerInfo: customer })
  }

  getSortArrow(field) {
    if (this.state.sort_field === field) {
      if (this.state.by === 1)
             return (<SortingNewDownIcon />)
         else
             return (<SortingNewUpIcon />)
      } else {
         return (<SortingNewDownIcon />)
      }
  }

  gotoOrder(id, _id) {
   this.props.history.push(`/customer-orders/live/${id}`, {id: _id});
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
  onCustomerSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      search_string: e.target.value, page:0, typingTimeout: setTimeout(async () => {
        this.fetchCustomers();
      }, 500)
    })
  }
  // FOR SIDEBAR
  toggleSidebar = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen })
  }

  render() {
    // FOR SIDEBAR
    const { isSidebarOpen } = this.state
    return (
      <div className="layout-has-sidebar">
      { this.state.loadervisible ?
        <div className="fullpage-loader">
          <span className="loaderimg">
              <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </span>
        </div> :
      "" }
        <SidebarNavigation isSidebarOpen={isSidebarOpen} user={this.props.user} {...this.props}/>
        <TopNavigation isSidebarOpen={isSidebarOpen} toggleSidebar={this.toggleSidebar} onSearch={this.onSearch} {...this.props} />
        <main className="dashboard-layout-content">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob">
                <h5 className="heading-title">Customer List</h5>
                <div className="ml-auto">
                  <button onClick={this.openModal} className="btn btn-dark w-180 font-600 font-16 fullwidth-mobile">
                    New Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="searchbox-wrapper">
                <input value={this.state.search_string} onChange={this.onCustomerSearch.bind(this)}type="text" placeholder="Search by customer name, email or address..." />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {_.get(this.state, 'customers', []).length > 0 ?
                  <div className="table-responsive">
                    <table className="table custom-table-secondary white-bg">
                      <thead className="gray-bg">
                        <tr>
                          <th>
                            <span onClick={() => { this.sortby('_id') }} className="custom-table-th-title-sm for-cursor">Customer ID {this.getSortArrow('_id')}</span>
                          </th>
                          <th>
                            <span onClick={() => { this.sortby('companyname') }} className="custom-table-th-title-sm for-cursor">Customer Name {this.getSortArrow('companyname')}</span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor">Type </span>
                          </th>
                          <th>
                            <span onClick={() => { this.sortby('streetname') }} className="custom-table-th-title-sm for-cursor">Address {this.getSortArrow('streetname')}</span>
                          </th>
                          <th>
                            <span onClick={() => { this.sortby('email') }} className="custom-table-th-title-sm for-cursor">Email {this.getSortArrow('email')}</span>
                          </th>
                          <th>
                            <span onClick={() => { this.sortby('phone') }} className="custom-table-th-title-sm for-cursor">Phone {this.getSortArrow('phone')}</span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"></span>
                          </th>
                          <th className="rem-pad width-50">
                            <span className="custom-table-th-title-sm for-cursor">Actions</span>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="table-card">
                      { _.get(this.state, 'customers', []).map((customer, i)=>{
                          return (
                            <tr key={i} className="for-cursor">
                              <td onClick={() => { this.gotoOrder(customer.customerid, customer.id)}}>
                                <span className="custom-table-title custom-table-title-md ">{_.get(customer, 'customerid', '')}</span>
                              </td>
                              <td onClick={() => { this.gotoOrder(customer.customerid, customer.id)}}>
                                <span className="custom-table-title custom-table-title-md">{_.get(customer, 'companyname', '')}</span>
                              </td>
                              <td onClick={() => { this.gotoOrder(customer.customerid, customer.id)}}>
                                <button className={_.get(customer, 'isHomeCustomer', false) === true ? "b2c-customer": "b2b-customer" }>{_.get(customer, 'isHomeCustomer', false) === true ? "Personal & SMB" : "Corporate"}</button>
                              </td>
                              <td onClick={() => { this.gotoOrder(customer.customerid, customer.id)}}>
                                <span className="custom-table-title custom-table-title-md">{this.address(customer)}</span>
                              </td>
                              <td onClick={() => { this.gotoOrder(customer.customerid, customer.id)}}>
                                <span className="custom-table-title custom-table-title-md">{_.get(customer, 'email', '')}</span>
                              </td>
                              <td onClick={() => { this.gotoOrder(customer.customerid, customer.id)}}>
                                <span>{formatPhoneNumberWithBrackets(_.get(customer, 'phone', ''))}</span>
                              </td>
                              <td onClick={this.impersonate.bind(this, customer)}>
                                <span className="view-despatcher" >Impersonate</span>
                              </td>
                              <td className="global-modal-alert">
                                <Dropdown overlay={
                                  <Menu>
                                    <Menu.Item key="0">
                                      <a href="#" onClick={this.openViewModel.bind(this,customer )}>View</a>
                                    </Menu.Item>
                                    <Menu.Item key="1">
                                      <a href="#" onClick={this.openUpdateModel.bind(this, customer)} >Edit</a>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                      <a href="#" onClick={this.openConfirmDeleteModal.bind(this,customer.id )}>Delete</a>
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
                  <EmptyComponent emptyText = "No Customers"/>
                }
              </div>
            </div>
          </div>

          <ReactModal
            isOpen={this.state.updateModalIsOpen}
            onRequestClose={this.updateModalClose.bind(this)}
            contentLabel="Add Team Member"
            ariaHideApp={false}
          >
            <UpdateCustomer
              closeModal= {this.updateModalClose.bind(this)}
              customerInfo= {this.state.customerInfo}
              apiFunctionCall= {this.fetchCustomers.bind(this)}
              {...this.props}
            />
          </ReactModal>

          <ReactModal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Add Team Member"
            ariaHideApp={false}
          >
            <div className="react-modal-dialog react-modal-dialog-centered">
              <div className="react-modal-header">
                <h5 className="react-modal-title">Add New Customer</h5>
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
                        name="companyname"
                        value={this.state.companyname}
                        onChange={this.onHandleChange}
                        required />
                      <label className="material-textfield-label">Customer Name <span className="text-danger">*</span></label>
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
                          name="firstname"
                          value={this.state.firstname}
                          onChange={this.onHandleChange}
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
                          name="lastname"
                          value={this.state.lastname}
                          onChange={this.onHandleChange}
                          required />
                        <label className="material-textfield-label">Last Name</label>
                        <p className="text-danger">{_.get(this.state, 'error.lastname', '')}</p>
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
                        onChange={this.onHandleChange}
                        required />
                      <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                      <p className="text-danger">{_.get(this.state, 'error.email', '')}</p>
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
                        name="phone"
                        value={this.state.phone}
                        onChange={this.onHandleChange}
                        required />
                      <label className="material-textfield-label">Phone Number <span className="text-danger">*</span></label>
                      <p className="text-danger">{_.get(this.state, 'error.phone', '')}</p>
                    </div>
                  </div>
                </div>


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
                      <p className="text-danger">{_.get(this.state, 'error.streetname', '')}</p>
                    </div>
                  </div>
                </div>



                {/* <div className="row">

                  <div className="col-md-6">
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
                        required />
                      <label className="material-textfield-label">Mobile</label>
                      <p className="text-danger">{_.get(this.state, 'error.mobile', '')}</p>
                    </div>
                  </div>
                </div> */}

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="townname"
                        value={this.state.townname}
                        onChange={this.onHandleChange}
                        required />
                      <label className="material-textfield-label">City <span className="text-danger">*</span></label>
                      <p className="text-danger">{_.get(this.state, 'error.townname', '')}</p>
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
                      <p className="text-danger">{_.get(this.state, 'error.state', '')}</p>
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
                      <p className="text-danger">{_.get(this.state, 'error.zipcode', '')}</p>
                    </div>
                  </div>
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

                {/* {this.additional()}
                <img src={plusIcon} onClick={(event) => this.addDivTag()} className="remove-field" /> */}

                {/* <div className="form-group material-textfield">
                  <input type="text" class="form-control material-textfield-input" required />
                  <label className="material-textfield-label">Borough</label>
                </div> */}
                {/* { _.get(this.state, 'additionalErrors', []).map((adderr, i)=>{
                    return (
                      <p className="text-danger">{adderr}</p>
                    )
                  })
                } */}
                <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.saveInfo.bind(this)}>Save</button>
              </div>
            </div>
          </ReactModal>

          {/* global modal open */}
          {/* <ReactModal
            isOpen={this.state.deleteModelIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Add Team Member"
            ariaHideApp={false}
          >
            <div className="react-modal-dialog react-modal-dialog-centered">
              <div className="react-modal-header">
                <h5 className="react-modal-title">Delete</h5>
                <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
              </div>
              <div className="react-modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <p className="modalpara">
                    Are sure to delete this customer’s information? Once it’s deleted,
                    all the information will be removed.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-end">
                      <button onClick={this.confirmDelete.bind(this)} className="btn btn-danger btn-md font-16 font-600">Yes, Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ReactModal> */}
          <DeleteModal
            deleteModelIsOpen={this.state.deleteModelIsOpen}
            closeModal={this.closeModal.bind(this)}
            confirmDelete={this.confirmDelete.bind(this)}
            text={'customer’s'}
          />
          {/* global modal close */}

          <Pagination
            className="pb-3 text-center pagination-wrapper w-100 mt-3"
            current={this.state.page+1}
            onChange={this.onPagechange.bind(this)}
            pageSize={this.state.limit}
            hideOnSinglePage= {true}
            total={_.get(this.state, 'totalCustomers', 0)}
          />

          <ReactModal
            isOpen={this.state.viewModalIsOpen}
            onRequestClose={this.updateModalClose.bind(this)}
            contentLabel="View Team Member"
            ariaHideApp={false}
          >
            <ViewCustomer
              closeModal= {this.updateModalClose.bind(this)}
              customerInfo= {this.state.customerInfo}
              apiFunctionCall= {this.fetchCustomers.bind(this)}
              {...this.props}
            />
          </ReactModal>
        </main>
      </div>
    )
  }
}

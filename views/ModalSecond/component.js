import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import _ from "lodash"
import { Popconfirm, message, Pagination } from 'antd'
import { Menu, Dropdown, Tabs, Select } from 'antd'

import EmptyComponent from '../../components/emptyComponent'
import { CloseIcon, MoreIcon } from '../../components/icons'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { SortingNewDownIcon, SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../components/icons'
import { formatPhoneNumber, formatOrderAddess, formatGeoAddressComponents } from '../../components/commonFormate'
import AddressAutoComplete from '../../components/AddressAutoComplete'
import minusIcon from './../../images/minusIcon.svg'
import plusIcon from './../../images/plusIcon.svg'
import UpdateCustomer from './updateCustomer.js'
import DeleteModal from '../../components/deleteModal'

import ExchangeIcon from './../../images/btn-exchange.svg'
import removalIcon from './../../images/btn-removal.svg'
import copyorderIcon from './../../images/btn-copyorder.svg'
import editorderIcon from './../../images/btn-editorder.svg'
import deleteorderIcon from './../../images/btn-deleteorder.svg'


import config from '../../config/index'
// import PropTypes from 'prop-types'

import './styles.scss'

const { TabPane } = Tabs
const phoneNumberMask = config.phoneNumberMask

export default class CustomersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      search_string: '',
      sort_field: 'companyname',
      by: -1,
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
      additionalErrors: [],
      error: {},
      updateModalIsOpen: false,
      deleteModelIsOpen: false,
      customerInfo: {},
      totalCustomers: 0,
      customerId: '',
      messageShown: true
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
    let data = {
      search_string,
      limit,
      by,
      page,
      sort: sort_field
    }
    let { value } = await this.props.fetchCustomers(data)
    this.setState({
      customers: _.get(value, 'customers', []),
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

  addDivTag(){
		this.setState({
			divTag: this.state.divTag.concat([{
				 companyname: '',
				 email: ''
			}])
		})
	}

  openConfirmDeleteModal (id) {
    this.setState({ customerId: id, deleteModelIsOpen: true })
  }

  additional(){
		return this.state.divTag.map((object, index)=>(
      <div className="row" key={index}>
        <div className="col-md-12 col-sm-12">
  				<img src={minusIcon} onClick={(event)=> this.removeDivTag(index)} className="remove-field" />
  			</div>
        <div className="col-md-6">
          <div className="form-group material-textfield">
            <input
              type="text"
              className="form-control material-textfield-input"
              value={object.companyname}
              onChange={this.handleDivOnChange('companyname', index)}
              required />
            <label className="material-textfield-label">Additional Name{index+1} <span className="text-danger">*</span></label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group material-textfield">
            <input
              type="text"
              className="form-control material-textfield-input"
              value={object.email}
              onChange={this.handleDivOnChange('email', index)}
              required />
            <label className="material-textfield-label">Additional Email{index+1} <span className="text-danger">*</span></label>
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
		let self = this;
		return function(evt) {
			const newDivTag = self.state.divTag.map((divObject, sidx) => {
				// console.log("idx: ", idx, " sidx: ", sidx);
				if (idx !== sidx) return divObject
				if(field === 'companyname')
					return { ...divObject, companyname: evt.target.value };
				else if(field === 'email')
					return { ...divObject, email: evt.target.value }
			});
			self.setState({ divTag: newDivTag })
		}
	}

  checkValidations () {
    const self = this
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let require = false
    let error = {}
    let fields = ['companyname', 'email', 'phone', 'zipcode', 'contactname', 'streetname' ]
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
    if (this.state.divTag.length > 0) {
      for (let i=0; i< self.state.divTag.length; i++) {
  			if (!self.state.divTag[i].companyname) {
          require = true
          additionalErrors.push(`Please enter the companyname${i+1}`)
        }
  			if (!self.state.divTag[i].email) {
          additionalErrors.push(`Please enter the email${i+1}`)
          require = true
        } else {
          let testR = regex.test(String(self.state.divTag[i].email).toLowerCase())
          if (!testR) {
            additionalErrors.push(`Please enter the valid email${i+1}`)
            require = true
          }
        }
  		}
    }

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
      for(let i=0; i< this.state.divTag.length; i++) {
    		if(this.state.divTag[i].companyname && this.state.divTag[i].email){
    			this.state.additionalname.push(this.state.divTag[i].companyname);
    			this.state.additionalemail.push(this.state.divTag[i].email);
    		}
      }

      const {
        companyname, email, streetname, phone,
        townname, fax, zipcode, other,
        contactname, website,
        mobile, additionalname, additionalemail, state } = this.state

      let data = {
        companyname, email, streetname, phone,
        townname, fax, zipcode, other,
        contactname, website,
        mobile, additionalname, additionalemail, state
      }
      try {
        let { value } = await this.props.addCostomer(data)
        // if(value.type === 'success') {
          this.closeModal()
          this.setState({ companyname: '', email: '', streetname: '', phone: '',
          townname: '', fax: '', zipcode: '', other: '',
          contactname: '', website: '', state: '',
          mobile: '', additionalname: [], additionalemail: []  })
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
    this.setState({ updateModalIsOpen: false, customerInfo: {} })
  }

  openUpdateModel (customer) {
    this.setState({ updateModalIsOpen: true, customerInfo: customer })
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

  gotoOrder(id, _id) {
   this.props.history.push(`/customer-orders/live/${id}`, {_id: _id});
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
      <div className="layout-has-sidebar">
        <SidebarNavigation {...this.props}/>
        <TopNavigation onSearch={this.onSearch} {...this.props} />
        <main className="dashboard-layout-content fullheight">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob">
                <h5 className="table-title">Customer List</h5>
                <div className="ml-auto">
                  <button onClick={this.openModal} className="btn btn-dark w-180 font-600 font-16">
                    Add Order 2
                  </button>
                </div>
              </div>
            </div>
          </div>




          <ReactModal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Add Team Member"
            ariaHideApp={false}
          >
            <div className="react-modal-dialog react-modal-dialog-960 react-modal-dialog-centered">
              <div className="react-modal-header d-flex align-items-center">
                <div>
                  <h5 className="react-modal-title d-flex align-items-center">Edit Order Information - O0004275 <span className="greenlable">In Use</span></h5>
                  <h6 className="react-modal-title-sub"><span>Created On:</span> 02-03-2020 04:56am <span className="pipeline">|</span>  <span>By:</span> deepak</h6>
                </div>
                <div className="marg-left-auto">
                  <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
                </div>
              </div>
              {/* <div className="divider-line"></div> */}
              <div className="react-modal-body p-0">

              <div className="leftcontent">
                  <div className="tabsContainer mb-3">
                    <Tabs>
                      <TabPane tab="Order Details" key="1">
                        <div className="pannel-wrapper">
                          <ul>
                            <li>
                              <h4>When do you want the container(s)? </h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Delivery Date</label>
                                    <div className="detail">2/11/2020</div>
                                  </li>
                                  <li>
                                    <label>Delivery Day</label>
                                    <div className="detail">Monday</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Where do you want the container(s)? </h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Purchase Order Number</label>
                                    <div className="detail">0030202</div>
                                  </li>
                                  <li>
                                    <label>Address</label>
                                    <div className="detail detail-map">
                                      <p>26-14 Jackson Ave, Long Island City, NY 1110</p>
                                      <p><b>Borough:</b> Queens</p>
                                      <p><b>Neighborhood:</b> Long Island City</p>
                                    </div>
                                    <button className="btn-viewmap">View Map</button>
                                  </li>
                                  <li>
                                    <label>Container Location</label>
                                    <div className="detail">On Street</div>
                                  </li>
                                  <li>
                                    <label>Parking</label>
                                    <div className="detail">No</div>
                                  </li>
                                  <li>
                                    <label>Permit</label>
                                    <div className="detail">No</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>What are we picking up and how much of it?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Container Size</label>
                                    <div className="detail">15 Yard</div>
                                  </li>
                                  <li>
                                    <label>Type of Debris</label>
                                    <div className="detail">
                                      <div>- Roofing</div>
                                      <div>- Dirt/Sand</div>
                                      <div>- Clean metal</div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Who’s placing this order?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Full Name</label>
                                    <div className="detail">Supervisor Danny Martini</div>
                                  </li>
                                  <li>
                                    <label>Phone number</label>
                                    <div className="detail">(202) 111-1111</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Who’s going to be onsite?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Job Site Contact Person</label>
                                    <div className="detail">Adam Limoncello</div>
                                  </li>
                                  <li>
                                    <label>Job Site Contact Person Phone</label>
                                    <div className="detail">(202) 111-1111</div>
                                  </li>
                                  <li>
                                    <label>Job Site Contact Person Email</label>
                                    <div className="detail">adam@gmail.com</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Payment Information</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Payment Type</label>
                                    <div className="detail">Check</div>
                                  </li>
                                  <li>
                                    <label>Pricing Type</label>
                                    <div className="detail">Matrix</div>
                                  </li>
                                  <li>
                                    <label>Total Cost</label>
                                    <div className="detail">$200.00</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Internal Details</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Hauler</label>
                                    <div className="detail">Curbside</div>
                                  </li>
                                  <li>
                                    <label>Special Instructions</label>
                                    <div className="detail">
                                      Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                      graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century
                                      who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use
                                      in a type specimen book.
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                          </ul>
                        </div>
                      </TabPane>
                      <TabPane tab="Connected Orders" key="2">
                        2
                      </TabPane>
                      <TabPane tab="Order Activity" key="3">
                        3
                      </TabPane>
                      <TabPane tab="Message History" key="43">
                        4
                      </TabPane>
                    </Tabs>
                  </div>
                </div>

                <div className="rightbtns">
                  <h4>Actions</h4>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={ExchangeIcon} /></span> Exchange</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={removalIcon} /></span> Removal</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={copyorderIcon} /></span> Copy Order</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={editorderIcon} /></span> Edit Order</button>
                  <button className="btn btn-dark w-180 w-half redbg font-600 font-16"><span><img src={deleteorderIcon} /></span> Delete Order</button>
                </div>
              </div>
            </div>
          </ReactModal>

          {/* global modal close */}


        </main>
      </div>
    )
  }
}

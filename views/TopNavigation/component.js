import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import LogRocket from 'logrocket'
import _ from 'lodash'
import $ from 'jquery'
import ReactModal from 'react-modal'
import moment from 'moment'
import { socket } from '../../components/socket'
import { Menu, Dropdown } from 'antd'
import Logo from '../../images/curbside-logo.png'
import MenuIcon from '../../images/mobiconmenu.svg'
import MenuClose from '../../images/menucloseicon.svg'
import DefaultProfile from '../../images/default-profile.svg'
import BorderCircle from '../../images/border-circle.svg'
import FilledCircle from '../../images/filled-circle.svg'
import searchMobile from '../../images/search-icon.svg'
import closeInput from '../../images/cancel.svg'


import { NotificationIcon, DownCaretIcon, CloseIcon } from '../../components/icons'
import { formatOrderAddess, formatPhoneNumber } from '../../components/commonFormate'
import './styles.scss'

const menuForEnterprise = (
  <Menu className="widthauto">
    {/* <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Edit Profile</Link>
    </Menu.Item> */}
    <Menu.Item key="1">
      <Link to={'/edit-profile'}>Edit Profile</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={'/enterprise-user-management'}>User Management</Link>
    </Menu.Item>
    {/* <Menu.Item key="5">
      <Link to={'/integrations'}>Integration</Link>
    </Menu.Item> */}
    <Menu.Item key="3">
      <Link to={'/settings'}>Settings</Link>
    </Menu.Item>
    <Menu.Item key="4" onClick={() => {localStorage.clear()}}>
      <Link to={'/login'} >Logout</Link>
    </Menu.Item>
  </Menu>
);

const menuForEnterpriseUser = (
  <Menu className="widthauto">
    {/* <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Edit Profile</Link>
    </Menu.Item> */}
    <Menu.Item key="1">
      <Link to={'/edit-profile'}>Edit Profile</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={'/settings'}>Settings</Link>
    </Menu.Item>
    <Menu.Item key="3" onClick={() => {localStorage.clear()}}>
      <Link to={'/login'} >Logout</Link>
    </Menu.Item>
  </Menu>
);

const menuForSuperadmin = (
  <Menu>
    {/* <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Edit Profile</Link>
    </Menu.Item> */}
    <Menu.Item key="2" onClick={() => {localStorage.clear()}}>
      <Link to={'/login'} >Logout</Link>
    </Menu.Item>
  </Menu>
);

const menuForCustomer = (
  <Menu>
    {/* <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Edit Profile</Link>
    </Menu.Item> */}
    <Menu.Item key="1">
      <Link to={'/edit-profile'}>Edit Profile</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={'/user-management'}>User Management</Link>
    </Menu.Item>
    <Menu.Item key="3" onClick={() => {localStorage.clear()}}>
      <Link to={'/login'} >Logout</Link>
    </Menu.Item>
  </Menu>
);

const menuForRegularCustomer = (
  <Menu>
    {/* <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Edit Profile</Link>
    </Menu.Item> */}
    <Menu.Item key="1">
      <Link to={'/edit-profile'}>Edit Profile</Link>
    </Menu.Item>
    {/* <Menu.Item key="2">
      <Link to={'/user-management'}>User Management</Link>
    </Menu.Item> */}
    <Menu.Item key="2" onClick={() => {localStorage.clear()}}>
      <Link to={'/login'} >Logout</Link>
    </Menu.Item>
  </Menu>
)



export default class TopNavigationComponent extends PureComponent {
  static propTypes = {
    // PropTypes go here
  }
  constructor() {
    super()
    this._isMounted = false;
    this.state = {
      search_string: '',
      user: {}
    }
  }


  async componentDidMount() {
    this._isMounted = true;
    let data = {
      user: {
        id: localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype")
      }
    }
    this.props.getUser(data)
    $('body').on('click', e => {
      if (this._isMounted) {
        if (e.target.nodeName === 'INPUT') {
          if ($(e.target).attr('class') === 'SearchInputSelector') { /* eslint-disable */
            // this.setState({ searchkey: '', buildingSearchData: [] })
          }
        } else if ($(e.target).hasClass('SearchInputSelector')) {
        } else if ($(e.target).closest('.SearchInputSelector').length > 0) {
        } else {
          this.setState({ search_string: '', searchOrders: [], searchCustomers: [], searchOrdersCustomer: [], search_string_customer: "" })
        }
      }
    })
    socket(this.props, this.props.fetchOrders)
    const id = localStorage.getItem('companyId')
    const { getEnterpriseNotifications } = this.props
    getEnterpriseNotifications(id)
    setTimeout(() => {
      if((window.location.pathname.indexOf('/customer-orders') !== -1 ||
      window.location.pathname.indexOf('/active-containers') !== -1)) {
        const logRocketAppName = _.get(process.env, 'REACT_APP_LOGROCKET', '')
        if(logRocketAppName && logRocketAppName !== '') {
          LogRocket.init(logRocketAppName, {
            rootHostname: window.location.origin
          })
          LogRocket.identify(localStorage.getItem("userid"), {
            email: this.props.user.email,
            name: this.props.user.firstname,
            userId: localStorage.getItem("userid"),
            companyId: localStorage.getItem("companyId")
          })
        }
      }
    }, 3000)
  }

  handleSearch = async (e) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      search_string: e.target.value, loading: true, typingTimeout: setTimeout(async () => {
        if (this.state.search_string) {
          let data = {
            search_string: this.state.search_string
          }
          let { value } = await this.props.searchByCustomerOrOrder(data)
          if (value.type === "success") {
            this.setState({
              searchkey: this.state.search_string,
              searchOrders: value.data.orders,
              searchCustomers: value.data.customers,
              loading: false
            })
          }
        } else {
          this.setState({
            searchkey: this.state.search_string,
            searchOrders: [],
            searchCustomers: [],
            loading: false
          })
        }
      }, 1000)
    })
  }

  gotoOrder(id, _id) {
    this.props.history.push(`/customer-orders/live/${id}`, { _id: _id });
  }

  viewOrder = async (order) => {
    let type = 'live'
    let val = await this.props.getContainer()
    const container = _.find(val.value.status, (status) => {
      return status._id === order.status
    })
    const usertype = localStorage.getItem('usertype')
    if (container && container.status === "Complete") {
      type = 'history'
    }
    if(usertype === "customer") {
      const loc = window.location.pathname
      if(loc === "/active-containers" || loc === "/pending-orders" || loc === "/completed-orders") {
        this.props.history.push(`/job/${order.orderid}`, { type: type })
        window.location.reload()
      } else {
        this.props.history.push(`/job/${order.orderid}`, { type: type })
      }
    } else {
      if(order.isApproved) {
      const customerid = _.get(order.customer_info, 'customerid', '')
      this.props.history.push(`/customer-orders/${customerid}/${order.orderid}`, { type: type })
      } else {
        const customerid = _.get(order.customer_info, 'customerid', '')
        this.props.history.push(`/customer-orders/unapproved-orders/${customerid}/${order.orderid}`, { type: "pending" })
      }
    }
    // this.setState({ isViewModalOpen: true, orderDataForEdit: order })
  }

  goBack = async (type) => {
    let companyEmail = localStorage.getItem('companyEmail')
    if (type === 'admin') {
      companyEmail = localStorage.getItem('superadminemail')
    }
    if (companyEmail) {
      const data = {
        email: companyEmail,
        usertype: 'user'
      }
      let { value } = await this.props.getToken(data)
      if (value.type === 'success') {
        localStorage.removeItem('haulerid')
        if (type === 'admin') {
          localStorage.removeItem('companyEmail')
          localStorage.removeItem('isSuperAdminImpersonate')
        } else {
          localStorage.removeItem('customerid')
          localStorage.removeItem('isImpersonate')
        }
        localStorage.setItem('Authorization', value.data.token)
        localStorage.setItem('userid', value.data._id)
        localStorage.setItem('usertype', value.data.usertype)
        localStorage.setItem('companyId', value.data.companyId ? value.data.companyId : '')
        if (type === 'admin') {
          this.props.history.push('/companies')
        } else {
          this.props.history.push('/dashboard')
        }
        let data = {
          user: {
            id: localStorage.getItem("userid"),
            usertype: localStorage.getItem("usertype")
          }
        }
        this.props.getUser(data)
      }
    }
    if(window.location.pathname === "/dashboard") {
      window.location.reload()
    }
  }

  openNotification() {
    this.setState({ openNotify: !this.state.openNotify })
  }
  openPopup = async (notify, type, quantity) => {
    notify.type = type
    notify.quantity = quantity
    notify.watch = 1
    if (quantity === 'all' || quantity === 'delete') {
      notify.usertype = 'enterprise'
    }
    const { value } = await this.props.viewedNotification(notify)
    const id = localStorage.getItem('companyId')
    const { getEnterpriseNotifications } = this.props
    getEnterpriseNotifications(id)
    const { enterpriseNotifications } = this.props
    if (notify.from_number !== "" && quantity === 'single') {
      const obj = {}
      obj.contactNumber = formatPhoneNumber(_.get(notify, 'fromnumber', '').replace("+1", ""))
      obj.contactName = _.get(notify, 'contactname', '')
      obj.data = _.filter(enterpriseNotifications, function (note) {
        return note.fromnumber === notify.fromnumber
      })
      this.setState({ selectedNotification: obj }, async () => {

        if (localStorage.getItem('usertype') === 'customer') {
          const customerid = _.get(this.props, 'user.customerid', '')
          if(customerid !== '') {
            const loc = window.location.pathname
            if(loc === "/active-containers" || loc === "/pending-orders" || loc === "/completed-orders") {
              this.props.history.push(`/job/${notify.orderid}`)
              window.location.reload()
            } else {
              this.props.history.push(`/job/${notify.orderid}`)
            }
          }
        } else {
          if(notify && notify.orderid && notify.orderid !== "") {
            if(notify.orderid.length === 8) {
                this.props.history.push(`/customer-orders/${notify.customerid}/${notify.orderid}`)
            } else {
              const { getOrderDetailById, getCustomerById } = this.props
              let { value } = await getOrderDetailById(notify.orderid)
              if(value) {
                const data = await getCustomerById(value.customer)
                if(data && data.value && data.value.customerid) {
                  this.props.history.push(`/customer-orders/${data.value.customerid}/${value.orderid}`)
                }
              }
            }
          } else {
            this.setState({ openMessageBox: true })
          }

        }
      })
    } else {

    }
  }
  closeMessageBox() {
    this.setState({ openMessageBox: false })
  }

  handleSearchCustomer(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      search_string_customer: e.target.value, loading: true, typingTimeout: setTimeout(async () => {
        if (this.state.search_string_customer) {
          let id = localStorage.getItem('userid')
          if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
            id = _.get(this.props, 'user.createdBy', undefined)
          }
          let data = {
            search_string: this.state.search_string_customer,
            customerId: id
          }
          let { value } = await this.props.searchByOrder(data)
          if (value.type === "success") {
            this.setState({
              searchkey: this.state.search_string_customer,
              searchOrdersCustomer: value.data,
              loading: false
            })
          }
        } else {
          this.setState({
            searchkey: this.state.search_string_customer,
            searchOrders: [],
            searchCustomers: [],
            loading: false
          })
        }
      }, 1000)
    })
  }
  formatAddress(order) {
    let data = {
      address: _.get(order, 'new_address', ''),
      city: _.get(order, 'city', ''),
      state: _.get(order, 'state', ''),
      zipcode: _.get(order, 'zipcode', ''),
      borough: _.get(order, 'borough', ''),
    }
    let address = formatOrderAddess(data)
    return address
  }

  updateNotification = async (notify) => {
    notify.type = 'watch'
    notify.quantity = 'single'
    if (notify.watch === 1) {
      notify.watch = 0
    } else {
      notify.watch = 1
    }
    const { value } = await this.props.viewedNotification(notify)
    const id = localStorage.getItem('companyId')
    const { getEnterpriseNotifications } = this.props
    getEnterpriseNotifications(id)
  }

  onOpenSearchMobileView (key) {
    if (key === "remove") {
      $(".input-search-wrapper").removeClass("input-search-wrapper-hide")
    } else {
      $(".input-search-wrapper").addClass("input-search-wrapper-hide")
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { isSidebarOpen, user } = this.props
    const currentlocation = window.location.pathname
    const role = _.get(user, 'role', '')
    const companyEmail = localStorage.getItem('')
    const isSuperAdminImpersonate = localStorage.getItem('isSuperAdminImpersonate')
    const isImpersonate = localStorage.getItem('isImpersonate')
    let classname = "header topnavigation-layout-header d-flex align-items-center justifybettab"
    if (currentlocation === "/settings" || currentlocation.indexOf('customer-orders/') !== -1 || currentlocation.indexOf('/customer-orders/pending/') !== -1 || currentlocation.indexOf('/customer-orders/live/') !== -1 || currentlocation.indexOf('/customer-orders/rejected/') !== -1 || currentlocation.indexOf('/customer-orders/history/') !== -1) {
      classname += " hide-section custom-hide-section"
    }
    if (isImpersonate || isSuperAdminImpersonate) {
      classname += " impersonate-header"
    }
    const enterpriseNotificationCount = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.watch === 0 && n.messagetype === "enterprise" }).length
    const customerNotificationCount = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.watch === 0 && n.messagetype === "customer" && n.userid && String(n.userid) === String(_.get(this.props, 'user._id', '')) }).length
    let notifications = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.messagetype === "enterprise" })
    if(localStorage.getItem('usertype') === "customer") {
      notifications = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.messagetype === "customer" && n.userid && String(n.userid) === String(_.get(this.props, 'user._id', '')) })
    }
    const email = _.get(user, 'email', '')
    const text = _.get(this.props, 'user.type', '') === "customer" ? _.upperCase(_.get(this.props, 'user.companyname', '').charAt(0)) : `${_.upperCase(_.get(this.props, 'user.firstname', '').charAt(0))}${_.upperCase(_.get(this.props, 'user.lastname', '').charAt(0))}`
    const textname = _.get(this.props, 'user.type', '') === "customer" ? _.get(this.props, 'user.companyname', '') : `${_.get(this.props, 'user.firstname', '')} ${_.get(this.props, 'user.lastname', '')}`
    return (
      <header className={classname}>
        {isImpersonate ?
          <div className="impersonate-wrapper">You are impersonating <span className="for-brackets">{email}</span> <button className="impersonate-btn" onClick={this.goBack.bind(this, 'user')}>Click here to go back</button></div>
          : isSuperAdminImpersonate ? <div className="impersonate-wrapper">You are impersonating <span className="for-brackets">{email}</span> <button className="impersonate-btn" onClick={this.goBack.bind(this, 'admin')}>Click here to go back to superadmin</button></div>
            : ""}
        <img src={_.get(user, 'companyInfo.logoUrl', '') !== '' ? _.get(user, 'companyInfo.logoUrl', '') : Logo} alt="curbside" className="tableview-logo" />
        {localStorage.getItem('usertype') === "customer" &&
          <div className="topnavigation-layout-search hidemobileview">
            <div className="topnavigation-layout-wrapper posi-rel">
              <input
                value={this.state.search_string_customer}
                onChange={this.handleSearchCustomer.bind(this)}
                className="form-control SearchInputSelector"
                placeholder="Search by order number or address..."
              />
              {this.state.loading ?
                <span className="loaderimg">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </span> : ""}
              <div className="clearfix"></div>

              <div className={_.get(this.state, 'searchOrdersCustomer', []).length > 0 ? "searchingbox" : "searchingbox searchingbox-hide"}>
                {_.get(this.state, 'searchOrdersCustomer', []).length > 0 ?
                  <div className="">
                    <h4>Orders</h4>
                    <ul className="SearchInputSelector">
                      {_.get(this.state, 'searchOrdersCustomer', []).map((order, i) => {
                        return (
                          <li key={i} onClick={this.viewOrder.bind(this, order)}>
                            <div className="profile-img">
                              <img src={DefaultProfile} alt="" />
                            </div>
                            <div className="profile-details">
                              <h2>{_.get(order, 'orderid', '')}</h2>
                              <h3>{this.formatAddress(order)}</h3>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div> : ''}
              </div>
            </div>
          </div>
        }

        {role !== 'superadmin' && localStorage.getItem('usertype') !== "customer" ?
          <div className="topnavigation-layout-search hidemobileview">

            <div className="topnavigation-layout-wrapper posi-rel">
              <input
                value={this.state.search_string}
                onChange={this.handleSearch.bind(this)}
                className="form-control SearchInputSelector"
                placeholder="Search by customer or order #"
              />
              {this.state.loading ?
                <span className="loaderimg">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </span> : ""}
              <div className="clearfix"></div>

              <div className={_.get(this.state, 'searchCustomers', []).length > 0 || _.get(this.state, 'searchOrders', []).length > 0 ? "searchingbox" : "searchingbox searchingbox-hide"}>
                {_.get(this.state, 'searchCustomers', []).length > 0 ?
                  <div className="">
                    <h4>Customers</h4>
                    <ul className="SearchInputSelector">
                      {_.get(this.state, 'searchCustomers', []).map((customer, i) => {
                        return (
                          <li key={i} className="SearchInputSelector" onClick={() => { this.gotoOrder(customer.customerid, customer._id) }}>
                            <div className="profile-img">
                              <img src={DefaultProfile} alt="" />
                            </div>
                            <div className="profile-details" >
                              <h2>{_.get(customer, 'companyname', '')}</h2>
                              <h3>{_.get(customer, 'email', '')}</h3>
                              <h3>{_.get(customer, 'phone', '')}</h3>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div> : ''}
                {_.get(this.state, 'searchOrders', []).length > 0 ?
                  <div className="">
                    <h4>Orders</h4>
                    <ul className="SearchInputSelector">
                      {_.get(this.state, 'searchOrders', []).map((order, i) => {
                        return (
                          <li key={i} onClick={this.viewOrder.bind(this, order)}>
                            <div className="profile-img">
                              <img src={DefaultProfile} alt="" />
                            </div>
                            <div className="profile-details">
                              <h2>{_.get(order, 'orderid', '')}</h2>
                              <h3>{_.get(order, 'contactname', '')}</h3>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div> : ''}

              </div>
              <div className="search-wrapper-open-container">
                <ul className="search-wrapper-options-menu">
                  <div className="options-menu-typeahead-header"><img className="options-menu-typeahead-icon" alt="" /> Buildings</div>
                  <li className="search-wrapper-options-menu-item">
                    <Link to={`/`} target="_blank">
                      <p className="options-menu-item-title">Title</p>
                      <p className="options-menu-item-subtitle">subtitle</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          : ""}
        {/* <div className="topnavigation-layout-form">
          <Link className="btn btn-link w-120" to={'/agent/create-listing'}>Create Listing</Link>
        </div> */}
        {localStorage.getItem('usertype') === "customer" &&
        <div className="mobilesearch">
          <img src={searchMobile} onClick={this.onOpenSearchMobileView.bind(this, 'remove')} />
          <div className="input-search-wrapper input-search-wrapper-hide">
            <input
              type="search"
              className="input-search"
              value={this.state.search_string_customer}
              onChange={this.handleSearchCustomer.bind(this)}
              placeholder="Search by order number or address..."
            />
            <span onClick={this.onOpenSearchMobileView.bind(this, 'add')} className="closeinput"><img src={closeInput} /></span>
            {this.state.loading ?
              <span className="loaderimg">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </span> : ""}
            <div className={_.get(this.state, 'searchOrdersCustomer', []).length > 0 ? "searchingbox" : "searchingbox searchingbox-hide"}>
              {_.get(this.state, 'searchOrdersCustomer', []).length > 0 ?
              <div className="">
                <h4>Orders</h4>
                <ul className="SearchInputSelector">
                {_.get(this.state, 'searchOrdersCustomer', []).map((order, i) => {
                  return (
                  <li key={i} onClick={this.viewOrder.bind(this, order)}>
                    <div className="profile-img">
                      <img src={DefaultProfile} alt="" />
                    </div>
                    <div className="profile-details">
                    <h2>{_.get(order, 'orderid', '')}</h2>
                    <h3>{this.formatAddress(order)}</h3>
                    </div>
                  </li>
                  )
                })}
                </ul>
                </div> : ""}
              </div>
          </div>
        </div> }

        {role !== 'superadmin' && localStorage.getItem('usertype') !== "customer" ?
        <div className="mobilesearch">
          <img src={searchMobile} onClick={this.onOpenSearchMobileView.bind(this, 'remove')} />
          <div className="input-search-wrapper input-search-wrapper-hide">
            <input
              type="search"
              className="input-search"
              value={this.state.search_string}
              onChange={this.handleSearch.bind(this)}
              placeholder="Search by order number or address..."
            />
            <span onClick={this.onOpenSearchMobileView.bind(this, 'add')} className="closeinput"><img src={closeInput} /></span>
            {this.state.loading ?
              <span className="loaderimg">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </span> : ""}
            <div className={_.get(this.state, 'searchCustomers', []).length > 0 || _.get(this.state, 'searchOrders', []).length > 0 ? "searchingbox" : "searchingbox searchingbox-hide"}>
              {_.get(this.state, 'searchCustomers', []).length > 0 ?
              <div className="">
                <h4>Customers</h4>
                <ul className="SearchInputSelector">
                {_.get(this.state, 'searchCustomers', []).map((customer, i) => {
                  return (
                  <li key={i} onClick={() => { this.gotoOrder(customer.customerid, customer._id) }}>
                    <div className="profile-img">
                      <img src={DefaultProfile} alt="" />
                    </div>
                    <div className="profile-details">
                    <h2>{_.get(customer, 'companyname', '')}</h2>
                    <h3>{_.get(customer, 'email', '')}</h3>
                    <h3>{_.get(customer, 'phone', '')}</h3>
                    </div>
                  </li>
                  )
                })}
                </ul>
                </div> : ""}
                {_.get(this.state, 'searchOrders', []).length > 0 ?
                <div className="">
                  <h4>Orders</h4>
                  <ul className="SearchInputSelector">
                  {_.get(this.state, 'searchOrders', []).map((order, i) => {
                    return (
                    <li key={i} onClick={this.viewOrder.bind(this, order)}>
                      <div className="profile-img">
                        <img src={DefaultProfile} alt="" />
                      </div>
                      <div className="profile-details">
                      <h2>{_.get(order, 'orderid', '')}</h2>
                      <h3>{_.get(order, 'contactname', '')}</h3>
                      </div>
                    </li>
                    )
                  })}
                  </ul>
                  </div> : ""}
              </div>
          </div>
        </div>: ''}

        {role !== 'superadmin' ? <div className="topnavigation-layout-notification" onClick={this.openNotification.bind(this)}>
           <NotificationIcon />
          {localStorage.getItem('usertype') === "customer" ? customerNotificationCount !== 0 ? <span className="noti-redcircle">{customerNotificationCount !== 0 ? customerNotificationCount : ''}</span> : ""
          :
          enterpriseNotificationCount !== 0 ? <span className="noti-redcircle">{enterpriseNotificationCount !== 0 ? enterpriseNotificationCount : ''}</span> : ""}
        </div> :

        <div className="topnavigation-layout-notification">

        </div>}

        <div className={this.state.openNotify ? "notification-wrapper notification-wrapper-show noti-post-rel" : "notification-wrapper"}>
          <div className="d-flex align-items-center justify-content-between pad-heading">
            <h4 className="notifications-head">Notifications</h4>
            <button className="notifications-close" onClick={this.openNotification.bind(this)}><CloseIcon /></button>
          </div>
          <div className="notification-layout-divider"></div>
          <div className="notification-box">
            <div className="notification-box-button">
              {notifications.length !== 0 ? <button className="notification-read-all" onClick={this.openPopup.bind(this, {}, '', 'all')}>Mark All as Read</button> : ""}
              {notifications.length !== 0 ? <button className="notification-read-all" onClick={this.openPopup.bind(this, {}, '', 'delete')}>Clear All</button> : ""}
            </div>
            <ul>
              {notifications.map((notify, i) => {
                return (
                  <li key={i} className={notify.watch === 0 ? "unread-notifications" : "read-notifications"} >
                    {/* <p onClick={this.updateNotification.bind(this, notify)}>{notify.message}</p> */}
                    <img src={notify.watch === 0 ? FilledCircle: BorderCircle} onClick={this.updateNotification.bind(this, notify)} />
                    {/* <img src={FilledCircle} /> */}
                    <p onClick={this.openPopup.bind(this, notify, 'watch', 'single')}>{notify.message}</p>
                    <h6>{moment(notify.created_at).format('MMM Do YYYY hh:mm a')}</h6>
                  </li>
                )
              })
              }
            </ul>
          </div>
        </div>
        {/* <div className="topnavigation-layout-divider"></div> */}

        {role !== 'superadmin' ? <div className="topnavigation-layout-divider hidemobileview"></div> : ""}

        <div className="topnavigation-layout__profile hidemobileview">
          <Dropdown overlay={user.role === "superadmin" ? menuForSuperadmin : user.role === "admin" && _.get(this.props, 'user.type', '') !== 'customer' ? menuForEnterprise : _.get(this.props, 'user.type', '') === 'customer' ? (_.get(this.props, 'user.role', '') !== "admin" || _.get(this.props, 'user.isHomeCustomer', false) === true) ? menuForRegularCustomer : menuForCustomer : user.role === "user" ? menuForEnterpriseUser : menuForSuperadmin} trigger={['click']} overlayClassName="profile--dropdown--overlay">
            <a className="ant-dropdown-link d-flex align-items-center" href="#">
              <div className="avatar">
              {_.get(this.props, 'user.image', '') !== "" ?
                <img src={_.get(this.props, 'user.image', '')} alt=""/> :
                <span>{text}</span> }
              </div>
              <div className="avatar-info mr-2">
                <div className="avatar-name">{textname}</div>
                <div className="avatar-email">{_.get(this.props, 'user.email', '')}</div>
              </div>
              <DownCaretIcon />
            </a>
          </Dropdown>
        </div>
        <img onClick={this.props.toggleSidebar} src={isSidebarOpen ? MenuClose : MenuIcon} alt="curbside" className="menuicon openclose" />
        <ReactModal
          isOpen={this.state.openMessageBox}
          onRequestClose={this.closeMessageBox.bind(this)}
          contentLabel="Message"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title mb-4">Message Box</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeMessageBox.bind(this)}><CloseIcon /></button>
              <form>
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input type="text" value={_.get(this.state.selectedNotification, 'contactName', '')} className="form-control material-textfield-input" name="email" disabled />
                        <label className="material-textfield-label">Contact Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group material-textfield">
                        <input type="text" value={_.get(this.state.selectedNotification, 'contactNumber', '')} className="form-control material-textfield-input" name="email" disabled />
                        <label className="material-textfield-label">Contact Number (xxx-xxx-xxxx)</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="group">
                      <input type="text" placeholder={_.get(this.state.selectedNotification, 'contactName', '')} disabled/>
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label>Contact Name</label>
                    </div>
                    <div className="group">
                      <input type="text" placeholder={_.get(this.state.selectedNotification, 'contactNumber', '')} disabled/>
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label>Contact Number (xxx-xxx-xxxx)</label>
                    </div> */}
              </form>
            </div>

            <div className="react-modal-body msg-chat-padd">
              <div className="msg-chat-section">
                <ul>
                  {this.state.selectedNotification && this.state.selectedNotification.data && this.state.selectedNotification.data.map((notify, index) => {
                    return (
                      <li>
                        <div className="pull-left">
                          <div className="day-date">
                            <span>{moment(notify.created_at).format('MMM Do YYYY')} at {moment(notify.created_at).format('hh:mm a')} </span>
                          </div>
                          <div className="chat-img">{notify.message_sent} {notify.mediaurl && notify.mediaurl !== "" ? <img src={notify.mediaurl} /> : ""}</div>
                          <div className="user-name">{notify.messagetype === "enterprise" ? "Replying to Enterprise Number" : "Replying to Dispatch Number"}</div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </ReactModal>
      </header>
    )
  }
}

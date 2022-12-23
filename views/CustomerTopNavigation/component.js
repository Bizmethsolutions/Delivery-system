import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
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
import curbsideLogo from '../../images/curbsidelogo.svg'
import closeInput from '../../images/cancel.svg'
import MenuIcon2 from '../../images/mobiconmenu.svg'


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
    <Menu.Item key="1">
      <Link to={'/enterprise-user-management'}>User Management</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to={'/settings'}>Settings</Link>
    </Menu.Item>
    <Menu.Item key="2"  onClick={() => {localStorage.clear()}}>
      <Link to={'/login'}>Logout</Link>
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
    <Menu.Item key="1">
      <Link to={'/settings'}>Settings</Link>
    </Menu.Item>
    <Menu.Item key="2"  onClick={() => {localStorage.clear()}}>
      <Link to={'/login'}>Logout</Link>
    </Menu.Item>
  </Menu>
);

const menuForSuperadmin = (
  <Menu>
    {/* <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Edit Profile</Link>
    </Menu.Item> */}
    <Menu.Item key="2"  onClick={() => {localStorage.clear()}}>
      <Link to={'/login'}>Logout</Link>
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
    <Menu.Item key="2"  onClick={() => {localStorage.clear()}}>
      <Link to={'/login'}>Logout</Link>
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
    <Menu.Item key="2"  onClick={() => {localStorage.clear()}}>
      <Link to={'/login'}>Logout</Link>
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
      user: {},
      MobileMenuToggle: false
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
          // this.setState({ search_string: '', searchOrders: [], searchCustomers: [], searchOrdersCustomer: [], search_string_customer: "" })
        }
      }
    })
    socket(this.props, this.props.fetchOrders)
    const id = localStorage.getItem('companyId')
    const { getEnterpriseNotifications } = this.props
    getEnterpriseNotifications(id)
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
      notify.usertype = 'customer'
    }
    const { value } = await this.props.viewedNotification(notify)
    const id = localStorage.getItem('companyId')
    const { getEnterpriseNotifications } = this.props
    getEnterpriseNotifications(id)
    const { enterpriseNotifications } = this.props
    if (notify.from_number !== "" && quantity == 'single') {      
      const obj = {}
      obj.contactNumber = _.get(notify, 'contactname', '')
      obj.contactName = formatPhoneNumber(_.get(notify, 'fromnumber', '').replace("+1", ""))
      obj.data = _.filter(enterpriseNotifications, function (note) {
        return note.fromnumber === notify.fromnumber
      })
      this.setState({ selectedNotification: obj }, () => {

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
          this.setState({ openMessageBox: true })
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

  MobileMenuToggle () {
    this.setState({ MobileMenuToggle: !this.state.MobileMenuToggle })
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
    let classname = "customer-header topnavigation-layout-header"
    if (currentlocation === "/settings" || currentlocation.indexOf('customer-orders/') !== -1 || currentlocation.indexOf('/customer-orders/pending/') !== -1 || currentlocation.indexOf('/customer-orders/live/') !== -1 || currentlocation.indexOf('/customer-orders/rejected/') !== -1 || currentlocation.indexOf('/customer-orders/history/') !== -1) {
      classname += " hide-section"
    }
    if (isImpersonate || isSuperAdminImpersonate) {
      classname += " impersonate-header"
    }
    const enterpriseNotificationCount = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.watch === 0 && n.messagetype === "enterprise" }).length
    const customerNotificationCount = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.watch === 0 && n.messagetype === "customer" && n.userid && String(n.userid) === String(_.get(this.props, 'user._id', '')) }).length
    let notifications = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.watch === 0 && n.messagetype === "enterprise" })
    if(localStorage.getItem('usertype') === "customer") {
      notifications = _.filter(_.get(this.props, 'enterpriseNotifications', []), (n) => { return n.messagetype === "customer" && n.userid && String(n.userid) === String(_.get(this.props, 'user._id', '')) })
    }
    const email = _.get(user, 'email', '')
    // const text = _.get(this.props, 'user.type', '') === "customer" ? _.upperCase(_.get(this.props, 'user.companyname', '').charAt(0)) : `${_.upperCase(_.get(this.props, 'user.firstname', '').charAt(0))}${_.upperCase(_.get(this.props, 'user.lastname', '').charAt(0))}`
    const textname = _.get(this.props, 'user.type', '') === "customer" ? _.get(this.props, 'user.companyname', '') : `${_.get(this.props, 'user.firstname', '')} ${_.get(this.props, 'user.lastname', '')}`
    return (

      <header className={classname}>
      {isImpersonate ?
        <div className="impersonate-wrapper">You are impersonating <span className="for-brackets">{email}</span> <button className="impersonate-btn" onClick={this.goBack.bind(this, 'user')}>Click here to go back</button></div>
        : isSuperAdminImpersonate ? <div className="impersonate-wrapper">You are impersonating <span className="for-brackets">{email}</span> <button className="impersonate-btn" onClick={this.goBack.bind(this, 'admin')}>Click here to go back to superadmin</button></div>
          : ""}
        {/* <img src={_.get(user, 'companyInfo.logoUrl', '') !== '' ? _.get(user, 'companyInfo.logoUrl', '') : Logo} alt="curbside" className="tableview-logo" /> */}

        <div className="flex-inner flex-innerlist">
          <img src={_.get(user, 'companyInfo.logoUrl', '') !== '' ? _.get(user, 'companyInfo.logoUrl', '') : curbsideLogo} alt="curbside" className="logo" />
          <ul className="hide980">
            <li className={
              currentlocation === "/dashboard" ||
              currentlocation === "/results/log" ||
              currentlocation === "/results/recap"
                ? "active" : ''}>
                <Link to="/dashboard"> Dashboard </Link>
            </li>
            <li className={ currentlocation === "/active-containers" || currentlocation.indexOf('/job/') !== -1  || currentlocation === "/pending-orders" || currentlocation === "/completed-orders" ? "active" : ''} ><Link to="/active-containers" >Orders </Link> </li>
            <li className={ currentlocation === "/reports" || currentlocation === "/services-report" ||
              currentlocation === "/yardage-report" ||
              currentlocation === "/sustainability-report" ||
              currentlocation === "/tonnage-report" || currentlocation === "/sustainability-summary" ? "active" : ''}><Link to="/reports"> Reports </Link> </li>
          </ul>
        </div>

        <div>
          <div className="flex-inner pos-relative">
            {role !== 'superadmin' ? <div className="topnavigation-layout-notification" onClick={this.openNotification.bind(this)}>
              <NotificationIcon />
            {localStorage.getItem('usertype') === "customer" ? customerNotificationCount !== 0 ? <span className="noti-redcircle">{customerNotificationCount !== 0 ? customerNotificationCount : ''}</span> : ""
            :
            enterpriseNotificationCount !== 0 ? <span className="noti-redcircle">{enterpriseNotificationCount !== 0 ? enterpriseNotificationCount : ''}</span> : ""}
          </div> :
          <div className="topnavigation-layout-notification">

          </div>}
          {this.state.openNotify ?
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
          </div> : ""}
            <div className="topnavigation-layout__profile hidemobileview ml">
            <Dropdown
              ClassName="profile--dropdown--overlay"
              overlay={user.role === "superadmin" ? menuForSuperadmin : user.role === "admin" && _.get(this.props, 'user.type', '') !== 'customer' ? menuForEnterprise : _.get(this.props, 'user.type', '') === 'customer' ? (_.get(this.props, 'user.role', '') !== "admin" || _.get(this.props, 'user.isHomeCustomer', false) === true) ? menuForRegularCustomer : menuForCustomer : user.role === "user" ? menuForEnterpriseUser : menuForSuperadmin} trigger={['click']} overlayClassName="profile--dropdown--overlay">
              <a className="ant-dropdown-link d-flex align-items-center" href="#">
                <div className="avatar-info mr-2">
                  <div className="avatar-name">{textname}</div>
                  <div className="avatar-email">{_.get(this.props, 'user.email', '')}</div>
                </div>
                <DownCaretIcon />
              </a>
            </Dropdown>
          </div>
            <img onClick={this.MobileMenuToggle.bind(this)} src={this.state.MobileMenuToggle ? MenuClose : MenuIcon2} alt="" className="menuicon openclose" />
            <div className={this.state.MobileMenuToggle ? "customer-sidemenu" : "customer-sidemenu customer-sidemenu-close" }>
              <ul>
                <li><Link className={ currentlocation == "/dashboard" || currentlocation === "/results/log" ||  currentlocation === "/results/recap" ? "current-li" : ""} to="/dashboard">Dashboard</Link></li>
                <li><Link className={ currentlocation === "/active-containers" || currentlocation.indexOf('/job/') !== -1  || currentlocation === "/pending-orders" || currentlocation === "/completed-orders" ? "current-li" : ""} to="/active-containers" >Orders </Link></li>
                {/* <li><Link className={ currentlocation == "/reports" ? "current-li" : ""} to="/reports" >Reports </Link></li>*/}

                <li><Link to="/edit-profile" >Edit Profile </Link></li>
                {/* <li><Link to="/" >User Management </Link></li> */}
                {/* <li><Link to="/" >Settings </Link></li> */}
                <li><Link to="/login" >Logout </Link></li>
              </ul>
            </div>
      </div>
        </div>
      </header>
    )
  }
}

import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown } from 'antd'
import _ from 'lodash'
import $ from 'jquery'
import Logo from '../../images/curbside-logo.png'
import { NotificationIcon, CloseIcon, HomeIconDispatcher, DownCaretIcon } from '../../components/icons'
import moment from 'moment'
import './styles.scss'
import { getFormatedDateAndTimeByUTC } from '../../components/commonFormate.js'
import BorderCircle from '../../images/border-circle.svg'
import FilledCircle from '../../images/filled-circle.svg'
import MenuIcon from '../../images/mobiconmenu.svg'
import MenuClose from '../../images/menucloseicon.svg'

const menu = (
  <Menu>
    {/* <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Edit Profile</Link>
    </Menu.Item> */}
    <Menu.Item key="1">
      <Link to={'/edit-profile'}>Edit Profile</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={'/login'}  onClick={() => {localStorage.clear()}}>Logout</Link>
    </Menu.Item>
  </Menu>
);

export default class DispatcherTopNavigationComponent extends PureComponent {
  constructor() {
    super()
    this.state={
      openNotify: false,
      isSidebarOpen: false,
      haulerList: []
    }
  }
  static propTypes = {
  }

  componentDidMount() {
    this.setState({haulerid: localStorage.getItem("userid")},()=>{
      this.forceUpdate()
    })
    let data = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
    }
    }
    this.props.getUser(data)
    let id = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      id = _.get(this.props, 'user.createdBy', undefined)
    }
    const { getNotifications } = this.props
    this.getHaulers()
    getNotifications(id)

  }

  getHaulers = async()=>{
    const data = {
      // type: "h",
      // by: 1,
      // page: 0,
      // limit: 20
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({ haulerList: _.get(value, 'data.dataArr', []) })
  }
  openDriverModal() {
    this.props.openDriverModal()
  }

  goBack = async ()=> {
    const companyEmail = localStorage.getItem('companyEmail')
    if (companyEmail) {
      const data = {
        email: companyEmail,
        usertype: 'user'
      }
      let { value } = await this.props.getToken(data)
      if (value.type=== 'success') {
        localStorage.removeItem('companyEmail')
        localStorage.removeItem('haulerid')
        localStorage.setItem('Authorization', value.data.token)
        localStorage.setItem('userid', value.data._id)
        localStorage.setItem('usertype', value.data.usertype)
        localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
        this.props.history.push('/customers')
      }
    }
  }

  openNotification() {
    this.setState({ openNotify: !this.state.openNotify })
  }

  openPopup = async(notify, type, quantity) => {
    notify.type = type
    notify.quantity = quantity
    notify.watch = 1
    const {value} = await this.props.viewedNotification(notify)
    if(value) {
      let id = localStorage.getItem('userid')
      if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
        id = _.get(this.props, 'user.createdBy', undefined)
      }
      const { getNotifications } = this.props
      getNotifications(id)
      if(type === "watch" && notify.ordermongoid !== "") {
        const {getOrderDetail} = this.props
        let {value} = await getOrderDetail(notify.ordermongoid)
        if (value.type === 'success') {
          if(value && value.data.orderId && value.data.orderId !== '') {
            this.props.openOrderInfo(notify.ordermongoid)
            this.props.history.push(`/order/${value.data.orderId}`)
          }
        }
      }
    }
  }

  goBackImpersonate = async (type)=> {
    let companyEmail = localStorage.getItem('companyEmail')
    if(type === 'admin') {
      companyEmail = localStorage.getItem('superadminemail')
    }
    if (companyEmail) {
      const data = {
        email: companyEmail,
        usertype: 'user'
      }
      let { value } = await this.props.getToken(data)
      if (value.type=== 'success') {
        localStorage.removeItem('companyEmail')
        localStorage.removeItem('haulerid')
        localStorage.removeItem('isImpersonate')
        if(type === 'admin') {
          localStorage.removeItem('isSuperAdminImpersonate')
        }
        localStorage.setItem('Authorization', value.data.token)
        localStorage.setItem('userid', value.data._id)
        localStorage.setItem('usertype', value.data.usertype)
        localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
        if(type === 'admin') {
          this.props.history.push('/companies')
        } else {
          this.props.history.push('/dashboard')
        }
        let data = { user : {
          id: localStorage.getItem("userid"),
          usertype: localStorage.getItem("usertype")
        }
        }
        this.props.getUser(data)
      }
    }
  }

  updateNotification =async(notify)=> {
    notify.type = 'watch'
    notify.quantity = 'single'
    if (notify.watch === 1) {
      notify.watch = 0
    } else{
      notify.watch = 1
    }
    const {value} = await this.props.viewedNotification(notify)
    let id = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      id = _.get(this.props, 'user.createdBy', undefined)
    }
    const { getNotifications } = this.props
    getNotifications(id)
  }

  toggleSidebar () {
    $(".dis-menu").removeClass("dis-menu-hide")
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen },()=>{
      if (this.state.isSidebarOpen === false) {
        $(".dis-menu").addClass("dis-menu-hide")
      }
    })
  }

  haulerChange = async (e)=> {
    let hauler = _.get(this.state, 'haulerList', []).filter(h=>
      h.id === e.target.value
    )
    if (hauler && hauler.length > 0) {
      const data = {
        email: hauler[0].company_email,
        usertype: 'hauler'
      }
      this.setState({ haulerid: e.target.value })
      let { value } = await this.props.getToken(data)
      if (value.type=== 'success') {
        localStorage.setItem('haulerid', value.data._id)
        localStorage.setItem('Authorization', value.data.token)
        localStorage.setItem('userid', value.data._id)
        localStorage.setItem('usertype', value.data.usertype)
        let data = { user : {
          id: value.data._id,
          usertype: 'hauler'
        }
        }
        this.props.getUser(data)
        const id = value.data._id
        const { getNotifications } = this.props
        getNotifications(id)
        this.props.changeHauler()
      }
    }
  }

  render() {
    const notificationCount = _.filter(_.get(this.props, 'notifications', []), (n) => {return n.watch === 0}).length
    const { user } = this.props
    const companyEmail = localStorage.getItem('companyEmail')
    const currentlocation = window.location.pathname
    const isImpersonate = localStorage.getItem('isImpersonate')
    const isSuperAdminImpersonate = localStorage.getItem('isSuperAdminImpersonate')
    let className = "header topnavigation-layout-header white-header d-flex align-items-center justify-content-between mb-0 dispatcher-headeronly"
    if(isSuperAdminImpersonate) {
      className += " impersonate-header"
    }
    const email = _.get(user, 'company_email', '')
    const text = _.get(this.props, 'haulerDetails.user_name', '') !== '' ? _.get(this.props, 'haulerDetails.user_name', '') : _.get(this.props, 'haulerDetails.company_name', '')
    const textname = _.upperCase(text).charAt(0)
    return (

      <header className={className}>
       <div className="home-icon" onClick={this.goBack.bind(this)}> {companyEmail && companyEmail !== "" ? <HomeIconDispatcher />: "" } </div>
       { companyEmail && companyEmail !== "" ?
          <select
          value = {this.state.haulerid}
          name = "haulerid"
          onChange={this.haulerChange.bind(this)}
            className="custom-select custom-select-dispatcher"
          >
          { _.get(this.state, 'haulerList', []).map((hauler, i)=>{
              return (
                <option key={i} value={hauler.id}>{hauler.company_name}</option>
              )
            })
          }
          </select>
        : "" }
       { isSuperAdminImpersonate ?
          <div className="impersonate-wrapper-dispatcher">You are impersonating <span className="for-brackets">{email}</span> <button className="impersonate-btn" onClick={this.goBackImpersonate.bind(this, 'admin')}>Click here to go back to superadmin</button></div> : '' }
        <div className="logo-center-dispatcher"><img src={_.get(user, 'companyInfo.logoUrl', '') !== '' ? _.get(user, 'companyInfo.logoUrl', '') : Logo} alt="curbside" className="logo-dispatcher" /></div>
        <div className="d-flex align-items-center">
          {currentlocation !== "/viewmap" ? <button className="btn btn-dark btn-sm w-100 font-700 mr-2 dispatcher-hidemobile" onClick={this.openDriverModal.bind(this)}>Add Driver</button> : "" }
          <div className="topnavigation-layout-notification noti-post-rel dispatcher-noti-mobile" onClick={this.openNotification.bind(this)}>
            <NotificationIcon/>
            {notificationCount !== 0 ? <span className="noti-redcircle">{notificationCount !== 0 ? notificationCount : ''}</span> : "" }
        </div>

        <div className={this.state.openNotify ? "notification-wrapper notification-wrapper-show noti-post-rel": "notification-wrapper"}>
          <div className="d-flex align-items-center justify-content-between pad-heading">
            <h4 className="notifications-head">Notifications</h4>
            <button className="notifications-close" onClick={this.openNotification.bind(this)}><CloseIcon /></button>
          </div>
          <div className="notification-layout-divider"></div>
          <div className="notification-box">
            <div className="notification-box-button">
              { _.get(this.props, 'notifications', []).length !== 0 ? <button className="notification-read-all" onClick={this.openPopup.bind(this, {}, '', 'all')}>Mark All as Read</button> : "" }
              { _.get(this.props, 'notifications', []).length !== 0 ? <button className="notification-read-all" onClick={this.openPopup.bind(this, {}, '', 'delete')}>Clear All</button> : "" }
            </div>
            <ul>
            { _.get(this.props, 'notifications', []).map((notify, i)=>{
              return (
                <li key={i} className={notify.watch === 0 ? "unread-notifications" : "read-notifications" } >
                  {/* <p onClick={this.updateNotification.bind(this, notify)}>{notify.message}</p> */}
                  <img src={notify.watch === 0 ? FilledCircle: BorderCircle} onClick={this.updateNotification.bind(this, notify)} />
                  <p onClick={this.openPopup.bind(this, notify, 'watch', 'single')}>{notify.message}</p>
                  <h6>{getFormatedDateAndTimeByUTC(notify.created_at, this.props.user)}</h6>
                </li>
              )
            })
            }
            </ul>
          </div>
        </div>
        {/* <div className="topnavigation-layout-divider"></div> */}



        <div className="topnavigation-layout__profile ml-4 dispatcher-hidemobile">
          <Dropdown overlay={menu} trigger={['click']} overlayClassName="profile--dropdown--overlay">
            <a className="ant-dropdown-link d-flex align-items-center" href="#">
              <div className="avatar">
              {_.get(this.props, 'user.image', '') !== "" ?
                <img src={_.get(this.props, 'user.image', '')} alt=""/> :
                <span>{textname}</span> }
              </div>
              <div className="avatar-info mr-0 ml-2">
                <div className="avatar-name">{_.get(this.props, 'haulerDetails.company_name', '')}</div>
                <div className="avatar-email"> {_.get(this.props, 'haulerDetails.company_email', '')} </div>
              </div>
                <DownCaretIcon />
            </a>
          </Dropdown>
        </div>
          <img onClick={this.toggleSidebar.bind(this)} src={this.state.isSidebarOpen ? MenuClose : MenuIcon} alt="curbside" className={this.state.isSidebarOpen ? "mobmenuclose menuicon openclose" : "menuicon openclose"} />
          <div className="dis-menu dis-menu-hide">
            <ul>
              <li>
                <button className="btn btn-dark btn-sm w-100 font-700 mr-2 btn-200" onClick={this.openDriverModal.bind(this)}>Add Driver</button>
              </li>
              <li>
                <Link to={'/edit-profile'}>Edit Profile</Link>
              </li>
              <li>
                <Link to={'/login'}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    )
  }
}

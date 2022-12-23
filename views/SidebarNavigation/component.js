import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Logo from '../../images/curbside-logo.png'
import logoInventory from '../../images/ic-inventory.svg'
import logoActiveInventory from '../../images/ic-inventory-active.svg'
import './styles.scss'

import { DashboardActiveIcon, DashboardIcon, PermitIcon, PermitActiveIcon, CustomerIcon, CustomerActiveIcon, ResourceIcon, ResourceActiveIcon, ReportsIcon, ReportsActiveIcon, DispatcherIcon, DispatcherActiveIcon, SettingsIcon, SettingsActiveIcon, LogoutIcon, LogoutActiveIcon } from '../../components/icons'



export default class SidebarNavigationComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      permitCount: 0
    }
  }

  async componentDidMount() {

  this.props.getPermitCount()
    // this.setState({ permitCount: value.count })

  }


  redirectDispatherPage = async ()=> {
    const { user } = this.props
    let defaultHauler = _.get(user, 'defaultHauler', '')
    const data = {
      email: defaultHauler.company_email,
      usertype: 'hauler'
    }
    let { value } = await this.props.getToken(data)
    if (value.type === 'success') {
      localStorage.setItem('companyEmail', _.get(user, 'email', ''))
      localStorage.setItem('haulerid', value.data._id)
      localStorage.setItem('Authorization', value.data.token)
      localStorage.setItem('userid', value.data._id)
      localStorage.setItem('usertype', value.data.usertype)
      localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
      this.props.history.push('/dispatcher')
    }
  }
  redirectDispatherPageInventory = async ()=> {
    this.props.history.push('/inventory')
    // const { user } = this.props
    // let defaultHauler = _.get(user, 'defaultHauler', '')
    // const data = {
    //   email: defaultHauler.company_email,
    //   usertype: 'hauler'
    // }
    // let { value } = await this.props.getToken(data)
    // if (value.type=== 'success') {
    //   localStorage.setItem('companyEmail', _.get(user, 'email', ''))
    //   localStorage.setItem('haulerid', value.data._id)
    //   localStorage.setItem('Authorization', value.data.token)
    //   localStorage.setItem('userid', value.data._id)
    //   localStorage.setItem('usertype', value.data.usertype)
    //   localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
    //   this.props.history.push('/inventory')
    // }
  }
  render() {    
    const { isSidebarOpen, user } = this.props
    const currentLocation = window.location.pathname
    const defaultHauler = _.get(user, 'defaultHauler', '')
    return (
      <aside className={`sidebar-layout-sider ${!isSidebarOpen ? 'sidebar-layout-sider-show' : '' }`}>
        <div className="sidebar-layout-sider__children">
          <div className="sidebar-layout-sider__logo hide-logo">
            <Link to="/dashboard"><img src={_.get(user, 'companyInfo.logoUrl', '') !== '' ? _.get(user, 'companyInfo.logoUrl', '') : Logo} alt="curbside"/></Link>
          </div>
          {user && _.get(user, 'type', 'user') === "user" ?
          <ul className="sidebar-layout__menu sidebar-layout__menu__dark">
            <li className={
              currentLocation === "/dashboard" ||
              currentLocation === "/results/log" ||
              currentLocation === "/results/recap" ||
              currentLocation === "/services-report" ||
              currentLocation === "/yardage-report" ||
              currentLocation === "/sustainability-report" ||
              currentLocation === "/tonnage-report"
              ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
              <Link className="sidebar-item__link" to={'/dashboard'}>
                <span className="sidebar-item__icon">
                  {
                    currentLocation == "/dashboard" ||
                    currentLocation === "/results/log" ||
                    currentLocation === "/services-report" ||
                    currentLocation === "/yardage-report" ||
                    currentLocation === "/sustainability-report" ||
                    currentLocation === "/tonnage-report" ||
                    currentLocation === "/results/recap"
                      ? <DashboardActiveIcon/> : <DashboardIcon/>
                  }
                </span> Dashboard
              </Link>
            </li>
            <li className={ currentLocation == "/customers" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
              <Link className="sidebar-item__link" to={'/customers'}>
                <span className="sidebar-item__icon">
                  { currentLocation == "/customers" ? <CustomerActiveIcon/> : <CustomerIcon /> }
                </span> Customers
              </Link>
            </li>
              <li className={currentLocation == "/permits" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
                <Link className="sidebar-item__link" to={'/permits'}>
                  <span className="sidebar-item__icon">
                    {currentLocation == "/permits" ? <PermitActiveIcon /> : <PermitIcon />}
                  </span> Permits
                  { _.get(this.props, 'permitCount', 0) !== 0 ? <span className="sidebar-item__counter">{_.get(this.props, 'permitCount', 0)}</span> : '' }
              </Link>
              </li> 
            <li className={ currentLocation == "/haulers" || currentLocation == "/drivers" || currentLocation == "/dumps" || currentLocation == "/yards" || currentLocation == "/containers" || currentLocation == "/trucks" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
              </li>
            <li className={ currentLocation == "/haulers" || currentLocation == "/drivers" || currentLocation == "/dumps" || currentLocation == "/yards" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
              <Link className="sidebar-item__link" to={'/haulers'}>
                <span className="sidebar-item__icon">
                  { currentLocation == "/haulers" || currentLocation == "/drivers" || currentLocation == "/dumps" || currentLocation == "/yards" || currentLocation == "/containers" || currentLocation == "/trucks" ? <ResourceActiveIcon/> : <ResourceIcon /> }
                </span> Resources
              </Link>
            </li>
            <li className={ currentLocation == "/reports" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
              <Link className="sidebar-item__link" to={'/reports'}>
                <span className="sidebar-item__icon">
                  { currentLocation == "/reports" ? <ReportsActiveIcon/> : <ReportsIcon /> }
                </span> Reports

              </Link>
            </li>
            <li className={ currentLocation == "/inventory" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
              <Link onClick={this.redirectDispatherPageInventory.bind(this)} className="sidebar-item__link">
                <span className="sidebar-item__icon">
                  { currentLocation == "/inventory" ? <img src={logoActiveInventory}/> : <img src={logoInventory}/> }
                </span> Inventory
              </Link>
            </li>
            { defaultHauler ? <li className={ currentLocation == "/dispatcher" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
              <a className="sidebar-item__link" onClick={this.redirectDispatherPage.bind(this)} >
                <span className="sidebar-item__icon">
                  { currentLocation == "/dispatcher" ? <DispatcherActiveIcon/> : <DispatcherIcon /> }
                </span> View Dispatcher
              </a>
            </li> : "" }

              <li className={currentLocation == "/edit-profile" ? "sidebar-item sidebar-item-is-selected hidedesktop" : "sidebar-item hidedesktop"}>
                <Link className="sidebar-item__link" to={'/edit-profile'}>
                  <span className="sidebar-item__icon">
                    {currentLocation == "/edit-profile" ? <SettingsActiveIcon /> : <SettingsIcon />}
                  </span> Edit Profile
              </Link>
              </li>

            <li className={currentLocation == "/enterprise-user-management" ? "sidebar-item sidebar-item-is-selected hidedesktop" : "sidebar-item hidedesktop"}>
              <Link className="sidebar-item__link" to={'/enterprise-user-management'}>
                <span className="sidebar-item__icon">
                  {currentLocation == "/enterprise-user-management" ? <SettingsActiveIcon /> : <SettingsIcon />}
                </span> User Management
              </Link>
            </li>

            <li className={currentLocation == "/settings" ? "sidebar-item sidebar-item-is-selected hidedesktop" : "sidebar-item hidedesktop"}>
              <Link className="sidebar-item__link" to={'/settings'}>
                <span className="sidebar-item__icon">
                    {currentLocation == "/settings" ? <SettingsActiveIcon /> : <SettingsIcon />}
                </span> Settings
              </Link>
            </li>
              <li className={currentLocation == "/login" ? "sidebar-item sidebar-item-is-selected hidedesktop" : "sidebar-item hidedesktop"}>
              <Link className="sidebar-item__link" to={'/login'}>
                <span className="sidebar-item__icon">
                    {currentLocation == "/login" ? <LogoutActiveIcon /> : <LogoutIcon />}
                </span> Logout
              </Link>
            </li>
          </ul>
          : '' }
          {user && _.get(user, 'type', 'user') === "customer" ?
            <ul className="sidebar-layout__menu sidebar-layout__menu__dark">
              <li className={ currentLocation == "/dashboard" || currentLocation === "/results/log" ||  currentLocation === "/results/recap" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
                <Link className="sidebar-item__link" to={'/dashboard'}>
                  <span className="sidebar-item__icon">
                    { currentLocation == "/dashboard" || currentLocation === "/results/log" ||  currentLocation === "/results/recap" ? <DashboardActiveIcon/> : <DashboardIcon/> }
                  </span> Dashboard
                </Link>
              </li>
              <li className={ currentLocation === "/active-containers" || currentLocation.indexOf('/job/') !== -1  || currentLocation === "/pending-orders" || currentLocation === "/completed-orders" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
                <Link className="sidebar-item__link" to={'/active-containers'}>
                  <span className="sidebar-item__icon">
                    { currentLocation == "/active-containers" || currentLocation === "/pending-orders" || currentLocation.indexOf('/job/') !== -1  || currentLocation === "/completed-orders" ? <CustomerActiveIcon/> : <CustomerIcon /> }
                  </span> Jobs
                </Link>
              </li>
              <li className={ currentLocation == "/job-status" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
                <Link className="sidebar-item__link" to={'/job-status'}>
                  <span className="sidebar-item__icon">
                    { currentLocation == "/job-status" ? <ResourceActiveIcon/> : <ResourceIcon /> }
                  </span> Live ETA's
                  { _.get(user, 'liveetas', 0)  !== 0 ? <span className="sidebar-item__counter">{ _.get(user, 'liveetas', 0)}</span> : "" }
                </Link>
              </li>
              <li className={ currentLocation == "/reports" ? "sidebar-item sidebar-item-is-selected" : "sidebar-item"}>
                <Link className="sidebar-item__link" to={'/reports'}>
                  <span className="sidebar-item__icon">
                    { currentLocation == "/reports" ? <ReportsActiveIcon/> : <ReportsIcon /> }
                  </span> Reports
                </Link>
              </li>
            </ul>
          : ''}
        </div>
      </aside>
    )
  }
}

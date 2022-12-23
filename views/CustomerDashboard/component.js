import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import moment from "moment"
import { Menu, Dropdown } from 'antd'
// import DatePicker from './date-picker-modal'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/component'
import PageviewIcon from './../../images/pageview-icon.svg'
import LeadsIcon from './../../images/leads-icon.svg'
// import NoLeadsIcon from './../../images/no-leads-icon.svg'
import mapImg from './../../images/mapicon.jpg'
import { LocationIconRed, RightArrow, LocationIconPurple, LocationIconGreen, LocationIconYellow, LocationIconOrange } from '../../components/icons'
import './styles.scss'
// const { Option } = Select;

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

export default class DashboardComponent extends PureComponent {
  constructor() {
    super()
    this.state = {
      todayDate: moment(),
      datePickerModal: false,
      from: moment().format("ll"),
      to: moment().format("ll"),
    }
  }

  componentDidMount() {

  }

  onSubmitDateRanges() {
    this.setState({ datePickerModal: false }, () => {
      // this.props.datePickerDates({ startDate: this.state.startDate, endDate: this.state.endDate })
    })
  }

  render() {
    return (
      <div className="layout-has-sidebar">
        <SidebarNavigation {...this.props}/>
        <TopNavigation {...this.props}/>
        <main className="dashboard-layout-content">
          <div className="d-flex justify-content-between align-item-center flex-unset-mob">
            <div>
              <h2 className="heading-title mb-3">Welcome Mike!</h2>
              <h6 className="heading-subtitle mb-4">LIC Waste, Inc</h6>
            </div>
            <div className="form-group material-textfield material-textfield-select">
              <select class="form-control custom-select h-66 w-290 font-16 material-textfield-input" required>
                <option></option>
                <option value="0" selected>June 1, 2020 - June 30,2020</option>
                <option value="0">All Time</option>
                <option value="0">All Time</option>
                <option value="0">All Time</option>
              </select>
              <label className="material-textfield-label">Date </label>
            </div>
          </div>

          {/* <DatePicker
            datePickerModal={this.state.datePickerModal}
            datePickerToggle={() => this.setState({ datePickerModal: !this.state.datePickerModal })}
            className={this.props.className}
            handleSelect={({ startDate, endDate }) => this.setState({ startDate, endDate })}
            onSubmitDateRanges={() => this.onSubmitDateRanges()}
          /> */}

          <div className="row">
            <div className="col-sm-12 col-md-6 mb-4">
              <div className="card d-card">
                <div className="row">
                  <div className="col-md-6">
                    <h4 className="title">Daily Recap</h4>
                    <p className="subtitle">This shows the total number of orders created</p>
                    <div className="pageviews-count">15</div>
                  </div>
                  <div className="col-md-6 text-sm-right">
                    <div className="d-card-icon">
                      <img src={PageviewIcon} alt="" className="imgwidth" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <h6>June 1, 2020 - June 30,2020</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 mb-4">
              <div className="customer-card-list">
                <ul>
                  <li>
                    <p>Total Tonnage/Yardage Disposed</p>
                    <span>2,320 <RightArrow /></span>
                  </li>
                  <li>
                    <p>Total Tonnage Diverted</p>
                    <span>2,320 <RightArrow /></span>
                  </li>
                  <li>
                    <p>Total Containers Ordered</p>
                    <span>123 <RightArrow /></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <button className="single-primarybtn">Containers on Site  (46) </button>
            </div>
          </div>
          

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="flex-map-btn">
                <button className="btn map-btn map-btn-red"><LocationIconRed /> 10 Yard Container</button>
                <button className="btn map-btn map-btn-purple"><LocationIconPurple /> 15 Yard Container</button>

                <button className="btn map-btn map-btn-green"><LocationIconGreen /> 20 Yard Container</button>
                <button className="btn map-btn map-btn-yellow"><LocationIconYellow /> 30 Yard Container</button>

                <button className="btn map-btn map-btn-orange"><LocationIconOrange /> 1/2 Yard Container</button>
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-md-12">
              <img src={mapImg} alt="" style={{ width: '100%' }} />
            </div>
          </div>


        </main>
      </div>
    )
  }
}

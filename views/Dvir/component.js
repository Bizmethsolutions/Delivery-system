import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import _ from "lodash"
import moment from 'moment'
import { Menu, Dropdown, Popconfirm, message, Pagination } from 'antd'

import EmptyComponent from '../../components/emptyComponent'
import { BackArrowIcon } from '../../components/icons'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import config from '../../config/index'
// import PropTypes from 'prop-types'

import './styles.scss'
const phoneNumberMask = config.phoneNumberMask

export default class DvirComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      page: 1,
      limit: 20,
      dvirData: [],
      totaldvir: 0,
      loadervisible: false,
      truckNumber: ''
    };

  }


  componentDidMount () {
    document.title = 'Dvir | CurbWaste'
    this.setState({ truckNumber: _.get(this.props, 'location.state.truckNumber', '') })
    this.getTrucksDvir()

  }


  onPagechange (nextPage) {
    let page = nextPage
    this.setState({ page }, ()=>{
      this.getTrucksDvir()
    })
  }

  getTrucksDvir =async()=>{
    if (this.props.match.params.id) {
      let data = {
        page: this.state.page,
        limit: this.state.limit,
        id: this.props.match.params.id
      }
      let { value } = await this.props.getTrucksDvir(data)
      this.setState({
        dvirData: _.get(value, 'data', []),
        totaldvir: _.get(value, 'count', 0)
      })
    }
  }

  goBack () {
    this.props.history.goBack()
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
              <button className="btn btn-link btn-back font-600" onClick={this.goBack.bind(this)}><BackArrowIcon /></button>
                <h5 className="table-title"> {_.get(this.state, 'truckNumber', '')} DVIR Information</h5>
                <div className="ml-auto">
                </div>
              </div>
            </div>
          </div>
          {/* <div className="searchbox-wrapper">
            <input value={this.state.search_string} onChange={this.onCustomerSearch.bind(this)}type="text" placeholder="Search by customer name, email or address..." />
          </div> */}
          {_.get(this.state, 'dvirData', []).length > 0 ?
            <div className="row">
              <div className="col-md-12">
                <div>
                  <div className="table-responsive">
                    <table className="table custom-table-secondary white-bg">
                      <thead className="gray-bg">
                        <tr>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> Date </span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> Truck Number </span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> License Plate </span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> Odometer Reading </span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> vehicle Status </span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> Driver </span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> Mechanic Notes</span>
                          </th>
                          <th>
                            <span className="custom-table-th-title-sm for-cursor"> DVIR </span>
                          </th>

                        </tr>
                      </thead>

                      <tbody className="table-card">
                      { _.get(this.state, 'dvirData', []).map((data, i)=>{
                          return (
                            <tr key={i} className="for-cursor">
                              <td>
                                <span className="custom-table-title custom-table-title-md ">{data.createdat ? moment(data.createdat).format("MM/DD/YYYY") : '-'}</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md ">{_.get(data, 'truck_number', '-')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md ">{_.get(data, 'license_plate', '-')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md ">{_.get(data, 'reading', '-')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md ">{data && data.vehicle_status ? 'Safe' : 'Unsafe'}</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md ">{_.get(data, 'driver_info.name', '') } {_.get(data, 'driver_info.last_name', '')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md ">{_.get(data, 'notes', '-')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md ">View Report</span>
                              </td>


                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          :
          <EmptyComponent
            emptyText = "No Trucks DVIR"
          /> }

          <Pagination
            className="pb-3 text-center pagination-wrapper w-100 mt-3"
            current={this.state.page}
            onChange={this.onPagechange.bind(this)}
            pageSize={this.state.limit}
            hideOnSinglePage= {true}
            total={_.get(this.state, 'totaldvir', 0)}
          />
        </main>
      </div>
    )
  }
}

import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import Dropzone from 'react-dropzone'
import _ from "lodash"
import { Menu, Dropdown, Popconfirm, message, Pagination, Button } from 'antd'

import EmptyComponent from '../../components/emptyComponent'
import { CloseIcon, MoreIcon } from '../../components/icons'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { SortingNewDownIcon, SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../components/icons'
import { formatPhoneNumber, formatPhoneNumberWithBrackets, formatOrderAddess, formatGeoAddressComponents, getDate, getFormatedDateAndTimeWithoutUTC } from '../../components/commonFormate'
import FilterIcon from './../../images/filter-icon.svg'
import DeleteModal from '../../components/deleteModal'
import config from '../../config/index'
import AddPermitModal from './partials/addPermitModal'
import EditPermitModal from './partials/editPermitModal'
import ViewPermitModal from './partials/viewPermitModal'

// import PropTypes from 'prop-types'

import './styles.scss'
const phoneNumberMask = config.phoneNumberMask

export default class PermitComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      addPermitIsOpen: false,
      search_string: '',
      customers: [],
      orderList: [],
      filterkeys: [],
      limit: 50,
      page: 1,
      sort_field: 'orderid',
      by: -1,
      orderDetail: {},
      searchString: '',
      permitId: '',
      orderId: '',
      // FOR SIDEBAR
      isSidebarOpen: false,
      editPermitIsOpen: false,
      containerList: [],
      statusList: [],
      deleteModelIsOpen: false,
      loadervisible: true,
      filtersCount: {}
    };

    this.closeModal = this.closeModal.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  openModal(order) {
    this.setState({ addPermitIsOpen: true, orderDetail: order });
  }

  openEditModal (order) {
    this.setState({ editPermitIsOpen: true, orderDetail: order });
  }

  openViewModal(order) {
    if (Object.keys(_.get(order, 'permit_info', {})).length !== 0) {
      this.setState({ isViewModalOpen: true, orderDetail: order });
    }
  }

  viewOrder(order) {
    let { orderDetail } = this.props
    const customerid = _.get(order.customer_info, 'customerid', '')
    this.props.history.push(`/customer-orders/${customerid}/${order.orderid}`, { type: 'live' })
  }

  closeModal() {
    this.setState({
      addPermitIsOpen: false,
      editPermitIsOpen: false,
      isViewModalOpen: false,
      deleteModelIsOpen: false,
      orderDetail: {}
    })
  }

  openConfirmDeleteModal (id, orderId) {
    this.setState({ permitId: id, orderId: orderId, deleteModelIsOpen: true })
  }

  componentDidMount = async() => {
    document.title = 'Permit | CurbWaste'
    this.fetchOrderList()
    this.fetchCustomers()
    let  { value }  = await this.props.getContainer()
    this.props.getPermitCount()
    this.setState({ containerList: _.get(value, 'containers', []), statusList: _.get(value, 'status', []) })
  }


  fetchOrderList = async() => {
    this.setState({ loadervisible: true })
    const { page, limit, sort_field, searchString, filterkeys, by } = this.state
    let data = {
      page, limit, sort: sort_field, search:searchString, filterkeys, by
    }
    let { value } = await this.props.getOrderListForPermit(data)
    let val = await this.props.getPermitFiltersCount()
    this.props.getPermitCount()
    if (value && value.data) {
      this.setState({ orderList: value.data, count: value.count, loadervisible: false, filtersCount: _.get(val, 'value', {}) })
    }
  }

  onSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }   
    this.setState({ searchString: e.target.value, typingTimeout: setTimeout(() => {
      this.fetchOrderList()
    }, 500)
    })
  }

  async fetchCustomers() {
    const { search_string, limit, by, page, sort_field  } = this.state
    let data = {
      search_string: this.state.search_string,
      //limit: 20,
      by: 1,
      //page: 0,
      sort: ''
    }
    let { value } = await this.props.fetchCustomers(data)
    this.setState({
      customers: _.filter(_.get(value, 'customers', []), (c) => {
        return c.createdBy === undefined
      }),
      totalCustomers: _.get(value, 'total', 0)
   })
  }

  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1;
    } else {
        this.state.sort_field = field;
        this.state.by = 1;
    }
    this.fetchOrderList();
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

  formatAddess (order) {
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

  // FOR SIDEBAR
  toggleSidebar = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen })
  }

  confirmDelete = async() => {
    let id = this.state.permitId
    let orderId = this.state.orderId
    let data =  {
      id, orderId
    }
    try {
      let { value } = await this.props.deletePermit(data)
      message.success('successfully deleted')
      this.fetchOrderList()
      this.props.getPermitCount()
      this.closeModal()
    } catch(e) {
      // message.success(_.get(e, 'error.message', "can't cancel an inprogress job"))
      this.closeModal()
    }
  }

  filterPermits(key) {
    let filterkeys = this.state.filterkeys
    let idx = filterkeys.indexOf(key)
    if (idx !== -1) {
      filterkeys.splice(idx, 1);
    } else {
      filterkeys.push(key)
    }
    this.setState({ filterkeys, page: 1 },()=>{
      this.fetchOrderList()
    })
  }


  onPagechange (nextPage) {
    this.setState({ page: nextPage }, ()=>{
      this.fetchOrderList()
    })
  }

  getexpireDays (order){
    let daysIn = 'N/A'
    const timezone = _.get(order, 'permit_info.timezone', {})
    if (order && order.permit_info && order.permit_info.enddate) {
      const date1 = new Date();
      date1.setHours(0,0,0,0);
      // const date2 = new Date(order.permit_info.enddate);
      let date2 = getFormatedDateAndTimeWithoutUTC(order.permit_info.enddate, timezone, this.props.user)
      date2.setHours(23, 59, 59, 999);
      if (date2 < date1) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // daysIn = diffDays === 1 ? diffDays + " day overdue" : diffDays + " days overdue"
        daysIn = "Expired"
      } else {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays == 1 || diffDays == 0) {
          daysIn = "Today"
        } else {
          daysIn = diffDays + " days"
        }
        // daysIn = diffDays + " days"
      }
    }
    return daysIn
  }

  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value }, ()=>{
      this.fetchOrderList()
    })
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
              <div className="d-flex align-items-center">
                <h5 className="heading-title">Permits</h5>
                { _.get(this.state, 'orderList', []).length === 0 && this.state.filterkeys.length === 0 ?
                "" :
                <div className="ml-auto">
                  {/* <Button className="filterbtn-btn"><img src={FilterIcon} /> Filter</Button>
                  <button onClick={this.openModal} className="btn btn-dark w-180 font-600 font-16 fullwidth-mobile">
                    Add Permits
                  </button> */}
                  <div className="form-group material-textfield material-textfield-select">
                    <select name="limit" value={this.state.limit} onChange={this.onHandleChange.bind(this)} className="form-control custom-select w-150 font-16 material-textfield-input">
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                    </select>
                    <label className="material-textfield-label">Results</label>
                  </div>
                </div> }
              </div>
            </div>
          </div>
          { _.get(this.state, 'orderList', []).length === 0 && this.state.filterkeys.length === 0 ?
          "" :
          <div className="row mb-3 mt-4">
            <div className="col-md-12">
              <input type="text" onChange={this.onSearch.bind(this)} placeholder="Search by order number or permit number..." className="form-control SearchInputSelector" />
            </div>
          </div> }
          { _.get(this.state, 'orderList', []).length === 0 && this.state.filterkeys.length === 0 ?
          "" :
          <div className="row">
            <div className="col-md-12">
              <ul className="table-filter-list">
                <li className={this.state.filterkeys.indexOf('Need Permit') !== -1 ? "bluefilter bluefilter-active": "bluefilter"} onClick={this.filterPermits.bind(this,'Need Permit')}>Need Permit ({_.get(this.props, 'permitCount', 0)})</li>
                <li className={this.state.filterkeys.indexOf('Active') !== -1 ? "greenfilter greenfilter-active": "greenfilter"} onClick={this.filterPermits.bind(this,'Active')}>Active ({_.get(this.state, 'filtersCount.active', 0)}) </li>
                <li className={this.state.filterkeys.indexOf('Expires') !== -1 ? "orangefilter orangefilter-active": "orangefilter"} onClick={this.filterPermits.bind(this,'Expires')}>Expires in 2 days ({_.get(this.state, 'filtersCount.expires', 0)})</li>
                <li className={this.state.filterkeys.indexOf('Expired') !== -1 ? "redfilter redfilter-active" : "redfilter"} onClick={this.filterPermits.bind(this,'Expired')}>Expired Permits ({_.get(this.state, 'filtersCount.expired', 0)})</li>
              </ul>
            </div>
          </div>}
          { _.get(this.state, 'orderList', []).length === 0 && this.state.filterkeys.length === 0 ?
          <EmptyComponent
               emptyText = "No Orders to add permit"
                  /> :
          <div className="row">
            <div className="col-md-12">
              <div>

                  <div className="table-responsive">
                    <table className="table custom-table-secondary white-bg">
                      <thead className="gray-bg">
                        <tr>
                          <th>
                          <span onClick={() => { this.sortby('orderid') }} className="custom-table-th-title-sm for-cursor">Order # {this.getSortArrow('orderid')}</span>
                          </th>
                          <th>
                          <span onClick={() => { this.sortby('permitid') }} className="custom-table-th-title-sm for-cursor">Permit # {this.getSortArrow('permitid')}</span>
                          </th>
                          <th>
                          <span onClick={() => { this.sortby('deliverydate') }} className="custom-table-th-title-sm for-cursor">Delivery Date {this.getSortArrow('deliverydate')}</span>
                          </th>
                          <th>
                          <span onClick={() => { this.sortby('pickupdate') }} className="custom-table-th-title-sm for-cursor">Removal Date {this.getSortArrow('pickupdate')}</span>
                          </th>
                          <th>
                          <span onClick={() => { this.sortby('address') }} className="custom-table-th-title-sm for-cursor">Address {this.getSortArrow('address')}</span>
                          </th>
                          <th>
                            <span onClick={() => { this.sortby('startdate') }} className="custom-table-th-title-sm for-cursor">Permit Start {this.getSortArrow('startdate')}</span>
                          </th>
                          <th>
                            <span onClick={() => { this.sortby('enddate') }} className="custom-table-th-title-sm for-cursor">Permit End {this.getSortArrow('enddate')}</span>
                          </th>
                          <th>
                          <span className="custom-table-th-title-sm for-cursor" onClick={() => { this.sortby('days') }}>Expires In  {this.getSortArrow('days')}</span>
                          </th>
                          <th></th>
                          <th>
                          <span className="custom-table-th-title-sm for-cursor">Actions</span>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="table-card">
                        { _.get(this.state, 'orderList', []).map((order, i)=>{
                          // let daysIn = 'N/A'
                          // if (order && order.permit_info && order.permit_info.enddate) {
                          //   const date1 = new Date();
                          //   date1.setHours(0,0,0,0);
                          //   const date2 = new Date(order.permit_info.enddate);
                          //   if (date2 < date1) {
                          //     const diffTime = Math.abs(date2 - date1);
                          //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          //     daysIn = diffDays + " days overdue"
                          //   } else {
                          //     const diffTime = Math.abs(date2 - date1);
                          //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          //     if (diffDays == 1 || diffDays == 0) {
                          //       daysIn = "Today"
                          //     } else {
                          //       daysIn = diffDays + " days"
                          //     }
                          //     // daysIn = diffDays + " days"
                          //   }
                          // }
                          return(
                            <tr key={i} className="for-cursor">
                              <td onClick={this.viewOrder.bind(this, order)}>
                                <span className="custom-table-title custom-table-title-md yellowfont">{order.orderid}</span>
                              </td>
                              <td onClick={this.openViewModal.bind(this, order)}>
                                <span className= {order && order.permit_info && order.permit_info.permitnumber ? "custom-table-title custom-table-title-md yellowfont": "custom-table-title custom-table-title-md"}>{order && order.permit_info && order.permit_info.permitnumber ? order.permit_info.permitnumber: "N/A"}</span>
                              </td>
                              <td onClick={this.openViewModal.bind(this, order)}>
                                <span className="custom-table-title custom-table-title-md">{getDate(order.deliverydate)}</span>
                              </td>
                              <td onClick={this.openViewModal.bind(this, order)}>
                                <span className="custom-table-title custom-table-title-md">{order.pickupdate ? getDate(order.pickupdate) : '-'}</span>
                              </td>
                              <td onClick={this.openViewModal.bind(this, order)}>
                              <span className="custom-table-title custom-table-title-md">
                                <span className="semibold">{_.get(order, 'customer_info.companyname', '')}</span><br/>
                                {this.formatAddess(order)}
                              </span>
                              </td>
                              <td onClick={this.openViewModal.bind(this, order)}>
                                <span> {order && order.permit_info && order.permit_info.startdate ? getDate(order.permit_info.startdate): "N/A"} </span>
                              </td>
                              <td onClick={this.openViewModal.bind(this, order)}>
                                <span>{order && order.permit_info && order.permit_info.enddate ? getDate(order.permit_info.enddate): "N/A"}</span>
                              </td>
                              <td className={this.getexpireDays(order) === "Today" ? "table-yellowtxt" : this.getexpireDays(order) === "N/A" ? '' : "table-redtxt"} onClick={this.openViewModal.bind(this, order)}>
                                <span>{this.getexpireDays(order)}</span>
                              </td>
                              <td>
                                <span className="attach-permit-tab" onClick={this.openModal.bind(this, order)}>Attach Permit</span>
                              </td>
                              {Object.keys(_.get(order, 'permit_info', {})).length !== 0 && (
                              <td className="global-modal-alert">
                                <span><Dropdown overlay={
                                  <Menu>
                                    <Menu.Item key="0"onClick={this.openViewModal.bind(this, order)}>
                                      <a href="#">View</a>
                                    </Menu.Item>
                                    <Menu.Item key="1" onClick={this.openEditModal.bind(this, order)}>
                                      <a href="#">Edit</a>
                                    </Menu.Item>
                                    <Menu.Item key="2" onClick={this.openConfirmDeleteModal.bind(this, order.permit_info._id, order.permit_info.orderid  )}>
                                      <a href="#">Delete</a>
                                    </Menu.Item>
                                  </Menu>
                                } trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right">
                                  <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                    <DotBtnIcon />
                                  </a>
                                </Dropdown></span>
                              </td>)}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

              </div>
            </div>
            <Pagination
              className="pb-3 text-center pagination-wrapper w-100 mt-3"
              current={this.state.page}
              onChange={this.onPagechange.bind(this)}
              pageSize={this.state.limit}
              hideOnSinglePage= {true}
              total={_.get(this.state, 'count', 0)}
            />
          </div>
           }
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

        </main>
        {this.state.addPermitIsOpen ?
        <AddPermitModal
          orderDetail= {_.get(this.state, 'orderDetail', {})}
          addPermitIsOpen = {this.state.addPermitIsOpen}
          closeModal={this.closeModal}
          customers = {_.get(this.state, 'customers', [])}
          fetchOrderList = {this.fetchOrderList.bind(this)}
          {...this.props}
        /> : ""}
        {this.state.editPermitIsOpen ?
        <EditPermitModal
          orderDetail= {_.get(this.state, 'orderDetail', {})}
          editPermitIsOpen = {this.state.editPermitIsOpen}
          closeEditPermitModal={this.closeModal}
          containerList={_.get(this.state, 'containerList', [])}
          customers = {_.get(this.state, 'customers', [])}
          fetchOrderList = {this.fetchOrderList.bind(this)}
          {...this.props}
        /> : ""}
        {this.state.isViewModalOpen ?
        <ViewPermitModal
          orderDetail= {_.get(this.state, 'orderDetail', {})}
          isViewModalOpen = {this.state.isViewModalOpen}
          closeModal={this.closeModal}
          containerList={_.get(this.state, 'containerList', [])}
          customers = {_.get(this.state, 'customers', [])}
          fetchOrderList = {this.fetchOrderList.bind(this)}
          openConfirmDeleteModal = {this.openConfirmDeleteModal.bind(this)}
          {...this.props}
        /> : ""}

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'permit'}
        />

      </div>
    )
  }
}

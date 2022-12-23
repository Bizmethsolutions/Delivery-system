import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import TopNavigation from './../TopNavigation/container'
import CustomerTopNavigation from './../CustomerTopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { Menu, Dropdown, message, Pagination } from 'antd'
import _ from 'lodash'
import moment from "moment"
import { SortingNewUpIcon ,BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewDownIcon } from '../../components/icons'
import AddOrder from './partials/addOrderModal'
import EmptyComponent from '../../components/emptyComponent'
import { formatOrderAddess, formatPhoneNumber, getContainerSize, getDate } from '../../components/commonFormate'
import DeleteModal from '../../components/deleteModal'
import EditOrder from './partials/editOrderModal'
import ViewOrder from './partials/viewOrderModal'
import ExchangeOrder from '../CustomerOrders/partials/exchangeOrderModal'
import RemovalOrder from '../CustomerOrders/partials/removalOrderModal'
import HistoryOrders from './partials/historyOrders'

import './styles.scss'

export default class ResourcesComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }
  constructor() {
    super()
    this.state = {
      addOrderModalIsOpen: false,
      haulerModal: false,
      sort_field: "deliverydate",
      search_string: '',
      by: -1,
      page: 0,
      limit: 20,
      type: 'live',
      activeOrder: [],
      deleteModelIsOpen: false,
      orderId: '',
      isViewModalOpen: false,
      isEditModalOpen: false,
      futureRemoval: false,
      tab: 'active',
      isApproved: true,
      classname: [
        {class: "red-yard", size: '10 Yard'},
        {class: "purple-yard", size: '15 Yard'},
        {class: "green-yard", size: '20 Yard'},
        {class: "yellow-yard", size: '30 Yard'},
        {class: "orange-yard", size: '1/2 Yard'},
        {class: "blue-yard", size: 'Live Load'}
      ]
    };
    //this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.orderSorting = this.orderSorting.bind(this)
  }
  openModal(key) {
    this.setState({ [key]: true });
  }

  closeModal() {
    this.setState({
      editModalIsOpen: false,
      isViewModalOpen: false,
      orderDataForEdit: {},
      orderData: {},
      addOrderModalIsOpen: false,
      exchangeModalIsOpen: false,
      removalModalIsOpen: false,
      deleteModelIsOpen: false,
      pendingRemoval: false
    })
  }

  componentDidMount = async()=> {
    document.title = 'Active Containers | CurbWaste'
    const { limit, by, page, sort_field, search_string, type } = this.state
    let data = {
      limit, by, page, sort_field, search_string, type: 'd'
    }

    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    this.urlCheck()
    let  val  = await this.props.getContainer()
    let  dumpval  = await this.props.getDumps(data)
    this.setState({
      containerList: _.get(val, 'value.containers', []),
      statusList: _.get(val, 'value.status', []),
      customerId: customerid,
      dumps: _.get(dumpval, 'value.dumps', [])
    })
    if (this.props.match.params && this.props.match.params.id) {
      let type = "live"
      if(this.props.match.path === "/pending-orders") {
        type = "pending"
      }
      if(this.props.match.path === "/completed-orders") {
        type = "completed"
      }
      if(this.props.match.path === "/active-containers") {
        type = "active"
      }
      this.setState({ type: type})
    }
    if (this.props.match.params && this.props.match.params.id) {
      let data ={
        page: 0,
        limit: undefined,
        sort: this.state.sort_field,
        by: this.state.by,
        isRejected: false,
        isApproved: true,
        customerId: customerid //this.props.match.params.id
      }

      let { value } = await this.props.getOrderByOrderId(this.props.match.params.id)
      if(value) {
        // const order = _.find(value.data, (o) => {
        //   return String(o.orderid) === String(this.props.match.params.id)
        // })
        this.setState({ isViewModalOpen: true,  orderDataForEdit: value.data})
      }
    }
  }

  urlCheck() {
    let isApproved = true
    let type = 'live'
    let tab = "active"
    const currentLocation = this.props.location.pathname
    if(currentLocation === "/active-containers") {
      document.title = 'Active Containers | CurbWaste'
      tab = "active"
    } else if (currentLocation === "/pending-orders") {
      document.title = 'Pending Orders | CurbWaste'
      isApproved = false
      tab = "pending"
    } else if (currentLocation === "/completed-orders") {
      document.title = 'Completed Orders | CurbWaste'
      type = 'history'
      tab = "history"
    } else {
      document.title = 'Active Containers | CurbWaste'
      tab = "active"
    }
    this.setState({ isApproved, type, tab }, ()=>{
      this.fetchOrders()
      //this.props.history.push(url)
    })
  }

  tabChange (tab, url) {
    let isApproved = true
    let type = 'live'
    if(tab === 'pending') {
      document.title = 'Pending Orders | CurbWaste'
      isApproved = false
    }
    if(tab === 'history') {
      document.title = 'Completed Orders | CurbWaste'
      type = 'history'
    }
    if(tab === 'active') {
      document.title = 'Active Containers | CurbWaste'
    }
    this.setState({ isApproved, type, tab, page: 0 }, ()=>{
      this.fetchOrders()
      this.props.history.push(url)
    })
  }

  fetchOrders =async()=> {
    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    let data ={
      page: this.state.page,
      limit: this.state.limit,
      sort: this.state.sort_field,
      by: this.state.by,
      type: this.state.type,
      isApproved: this.state.isApproved,
      customerId: customerid //this.props.match.params.id
    }

    let { value } = await this.props.getOrdersBycustomer(data)
    this.setState({
      totalActiveOrder: _.get(value, 'count', 0),
      activeOrder: _.get(value, 'order', []),
    })
  }

  orderSorting (sort, by) {
    this.setState({ sort_field: sort, by: by },()=>{
      this.fetchOrders()
    })

  }

  sortby(field) {
    if (this.state.sort_field === field) {
      this.state.by = this.state.by * -1;
      this.fetchOrders()
    } else {
      this.state.sort_field = field;
      this.state.by = 1
      this.fetchOrders()
    }

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

  getStatus(input, order) {
    if (input && this.state.statusList) {
      let status = "";
      this.state.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      if(status === "Future Exchange") {
        if(order.queue_exchange_orders && order.queue_exchange_orders.length > 0) {
            const _index = _.findIndex(order.queue_exchange_orders, (o) => {
              return String(o.id) === String(order.id)
            })
            if(_index >= 0) {
                status = `${status} ${_index + 1}`
            }
            return status;
        }
      } else {
        return status;
      }
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

  confirmDelete = async() => {
    let id = this.state.orderId
    let { value } = await this.props.deleteOrder(id)
    message.success('successfully deleted')
    this.fetchOrders()
    this.closeModal()
  }

  openConfirmDeleteModal (id) {
    this.setState({ orderId: id, deleteModelIsOpen: true })
  }

  toggleAddModal (order) {
    this.setState({ orderData: order, addOrderModalIsOpen: true })
  }

  viewOrder (order) {
    const customerid = _.get(this.props, 'user.customerid', '')
    if(customerid !== '') {
      this.props.history.push(`/job/${order.orderid}`, {c: this.state.tab})
      this.setState({ isViewModalOpen: true, orderDataForEdit: order })
    }
  }

  toggleEditModal = (order) => {
    let status = order.status && this.getStatus(order.status, order) ? this.getStatus(order.status, order) : ""
    if ( status === "Pending Removal" ) {
      this.setState({ pendingRemoval: true })
      this.toggleRemovalModal(order, false)
    }
    this.setState({ editModalIsOpen: true, orderDataForEdit: order })
  }

  toggleExchangeModal (order, futureExchange) {
    order.futureExchange = futureExchange
    order.isApproved = false
    this.setState({ exchangeModalIsOpen: !this.state.exchangeModalIsOpen, orderDataForExchange: order, futureExchange: futureExchange})
  }

  toggleRemovalModal (order, futureRemoval) {
    order.futureRemoval = futureRemoval
    order.isApproved = false
    this.setState({ removalModalIsOpen: !this.state.removalModalIsOpen, orderDataForRemoval: order, futureRemoval: futureRemoval})
  }

  onPagechange(page) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    this.setState({ page: page -1 , isLoader: true }, () => {
      this.fetchOrders()
    })
  }

  render() {
    const currentLocation = this.props.location.pathname
    return (
      <div className="layout-has-sidebar">
        {/* <SidebarNavigation {...this.props}/> */}        
        <CustomerTopNavigation fetchOrders={this.fetchOrders} {...this.props}/>
        <main className="dashboard-layout-content fullheight">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob">
                <h5 className="table-title">Jobs</h5>
                <div className="ml-auto">
                  <button className="btn btn-dark w-180 font-600 font-16 btnfullwidth-mob" onClick={this.openModal.bind(this, 'addOrderModalIsOpen')}>
                    New Order
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="flex-btn flex-unset">
                <button
                  className={this.state.tab === 'active' ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'active', '/active-containers')}
                > Active Containers </button>
                <button
                  className={this.state.tab === 'pending' ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'pending', '/pending-orders')}
                > Pending Approval</button>
                <button
                  className={this.state.tab === 'history' ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'history', '/completed-orders')}
                > History </button>
              </div>
            </div>
          </div>
          { this.state.tab !== 'history' ?
            <div className="row">
              <div className="col-md-12">
                <div>
                  <div className="table-responsive">
                    {_.get(this.state, 'activeOrder', []).length !== 0 ?
                      <table className="table custom-table-secondary white-bg">
                        <thead className="gray-bg">
                          <tr>
                            <th onClick={() => { this.sortby('_id') }}>
                              <span className="custom-table-th-title-sm">Order Number {this.getSortArrow('_id')}</span>
                            </th>
                            <th onClick={() => { this.sortby('deliverydate') }}>
                              <span className="custom-table-th-title-sm">Delivery Date {this.getSortArrow('deliverydate')}</span>
                            </th>
                            <th onClick={() => { this.sortby('pickupdate') }}>
                              <span className="custom-table-th-title-sm">Removal Date {this.getSortArrow('pickupdate')}</span>
                            </th>
                            <th onClick={() => { this.sortby('location') }}>
                              <span className="custom-table-th-title-sm">JobAddress {this.getSortArrow('location')}</span>
                            </th>
                            <th onClick={() => { this.sortby('container') }}>
                              <span className="custom-table-th-title-sm">Container {this.getSortArrow('container')}</span>
                            </th>
                            <th onClick={() => { this.sortby('typeofdebris') }}>
                              <span className="custom-table-th-title-sm">Debris {this.getSortArrow('typeofdebris')}</span>
                            </th>
                            <th onClick={() => { this.sortby('haular') }}>
                              <span className="custom-table-th-title-sm">Hauler {this.getSortArrow('haular')}</span>
                            </th>
                            <th onClick={() => { this.sortby('status') }}>
                              <span className="custom-table-th-title-sm">Status {this.getSortArrow('status')}</span>
                            </th>
                            <th className="rem-pad width-50">
                              <span className="custom-table-th-title-sm">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="table-card">
                        {_.get(this.state, 'activeOrder', []).map((order, i)=>{
                          const status = this.getStatus(order.status, order) && (this.getStatus(order.status, order).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase()
                          return (
                          <tr key={i}>
                            <td onClick={this.viewOrder.bind(this, order)}>
                              <span className="custom-table-title custom-table-title-md">{_.get(order, 'orderid', '')}</span>
                            </td>
                            <td onClick={this.viewOrder.bind(this, order)}>
                              <span className="custom-table-title custom-table-title-md">{(this.getStatus(order.status, order) === "Future Exchange" || this.getStatus(order.status, order) === "Future Removal") ? getDate(order.pickupdate) : getDate(order.deliverydate)}</span>
                            </td>
                            <td onClick={this.viewOrder.bind(this, order)}>
                              <span className="custom-table-title custom-table-title-md">
                              {((this.getStatus(order.status, order) === 'Future Removal' || this.getStatus(order.status, order) === 'Pending Removal' || this.getStatus(order.status, order) === 'Removed') ? (getContainerSize(this.state.containerList, order.container) === 'Live Load' ? getDate(order.deliverydate) : getDate(order.pickupdate)) : '-')}
                              </span>
                            </td>
                            <td onClick={this.viewOrder.bind(this, order)}>
                              <span className="custom-table-title custom-table-title-md">{this.formatAddess(order)}</span>
                            </td>
                            {/* <td>
                              <button className="btn-yellow-fill">30 Yard</button>
                            </td> */}
                            {order.save_as_draft ?
                              <td onClick={this.viewOrder.bind(this, order)}>
                                <button key ={i} className="btn">Draft</button>
                              </td>
                            :  <td>
                              {
                                _.get(this.state, 'containerList', []).map((cnt, i)=>{
                                  const classIndex = _.findIndex(this.state.classname, (c) => {
                                    return c.size === _.get(cnt, 'size', '')
                                  })
                                  if (cnt._id === order.container) {
                                    return (
                                      <button key ={i} className={classIndex !== -1 ? `${this.state.classname[classIndex].class}` : `yellow-yard`}>{_.get(cnt, 'size', '')}</button>
                                    )
                                  }
                                })
                              }
                            </td>}
                            <td onClick={this.viewOrder.bind(this, order)}>
                              <span className="custom-table-title custom-table-title-md">{Array.isArray(_.get(order, 'typeofdebris', [])) ? _.get(order, 'typeofdebris', []).join(', ') : _.get(order, 'typeofdebris', '')}</span>
                            </td>
                            <td onClick={this.viewOrder.bind(this, order)}>
                              <span className="custom-table-title custom-table-title-md">{_.get(order, 'haular.company_name', '')}</span>
                            </td>
                            <td onClick={this.viewOrder.bind(this, order)}>
                              <button className="btn-purple-fill--lg status-container"  status={status}>{this.getStatus(order.status, order)}</button>
                            </td>
                            { this.getStatus(order.status, order) !== "Removed" ?
                            <td className="rem-pad global-modal-alert">
                              <Dropdown overlay={<Menu>
                              { this.getStatus(order.status, order) !== "Removed" && this.getStatus(order.status, order) !== "Future Removal" && this.getStatus(order.status, order) !== "Future Exchange" ?
                                <Menu.Item key="1"  onClick={this.toggleAddModal.bind(this,order)}>
                                  <button className="btn-menu">Copy</button>
                                </Menu.Item> : "" }
                                { this.getStatus(order.status, order) !== "Removed" ?
                                <Menu.Item key="2" onClick={this.viewOrder.bind(this, order)}>
                                  <button className="btn-menu">View</button>
                                </Menu.Item> : "" }
                                { (this.getStatus(order.status, order) === "Pending Delivery" && order && _.get(order, 'job_details.started_at', null) === null) || (this.getStatus(order.status, order) === "Future Removal" || String(this.getStatus(order.status, order)).indexOf('Future Exchange') !== -1) ?
                                <Menu.Item key="3" onClick={this.toggleEditModal.bind(this,order)}>
                                  <button className="btn-menu">Edit</button>
                                </Menu.Item> : "" }
                                { this.getStatus(order.status, order) === "In Use" && this.getStatus(order.status, order) !== "Pending Removal" ?
                                <Menu.Item key="3" onClick={this.toggleExchangeModal.bind(this,order, false)}>
                                  <button className="btn-menu">{ getContainerSize(this.state.containerList, order.container) !== "1/2 Yard" ? "Exchange" : "Action"}</button>
                                </Menu.Item> : "" }
                                { this.getStatus(order.status, order) === "In Use" && getContainerSize(this.state.containerList, order.container) !== "1/2 Yard" ?
                                <Menu.Item key="3" onClick={this.toggleRemovalModal.bind(this,order, false)}>
                                  <button className="btn-menu">Removal</button>
                                </Menu.Item> : "" }
                                  { this.getStatus(order.status, order) !== "Removed" ?
                                  <Menu.Item key="6">
                                    <a href="#" onClick={this.openConfirmDeleteModal.bind(this,order.id )}>Delete</a>
                                  </Menu.Item> : "" }
                                  {/* { this.getStatus(order.status, order) === "Removed" ?
                                  <Menu.Item key="6">
                                    <button className="btn-menu">Complete</button>
                                  </Menu.Item> : "" } */}
                              </Menu>} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right">
                                <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                  <DotBtnIcon />
                                </a>
                              </Dropdown>
                            </td> : "" }
                            {/* <td>
                              <Dropdown overlay={
                                <Menu>
                                  <Menu.Item key="1">
                                    <Link to={'/agent/team'}>Edit</Link>
                                  </Menu.Item>
                                  <Menu.Item key="2">
                                    <a href="#" onClick={this.openConfirmDeleteModal.bind(this,order.id )}>Delete</a>
                                  </Menu.Item>
                                </Menu>
                              } trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm">
                                <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                  <DotBtnIcon />
                                </a>
                              </Dropdown>
                            </td> */}
                          </tr>
                            )
                          })
                        }
                          {/* <tr>
                            <td>
                              <span className="custom-table-title custom-table-title-md">251002</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">2/11/2020</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">-</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">140 Hope St, Brooklyn, NY 11211</span>
                            </td>
                            <td>
                              <button className="btn-red-fill">10 Yard</button>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">Good QA</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">Test Hauler</span>
                            </td>
                            <td>
                              <button className="btn-yellow-fill--lg">Pending Removal</button>
                            </td>
                            <td>
                              <Dropdown overlay={menu} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm">
                                <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                  <DotBtnIcon />
                                </a>
                              </Dropdown>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span className="custom-table-title custom-table-title-md">251001</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">2/11/2020</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">-</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">26-14 Jackson Ave, Long Island City, NY 11101</span>
                            </td>
                            <td>
                              <button className="btn-red-fill">10 Yard</button>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">Good QA</span>
                            </td>
                            <td>
                              <span className="custom-table-title custom-table-title-md">Test Hauler</span>
                            </td>
                            <td>
                              <button className="btn-green-fill--lg">In Use</button>
                            </td>
                            <td>
                              <Dropdown overlay={menu} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm">
                                <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                  <DotBtnIcon />
                                </a>
                              </Dropdown>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                      :
                        <EmptyComponent
                          emptyText = "No Orders"
                        />
                      }
                  </div>
                </div>
              </div>
            </div>
          :
          <HistoryOrders
            customerId={this.state.customerId}
            {...this.props}
            liveOrders={this.state.activeOrder}
            fetchOrders={this.fetchOrders}
            containerList={this.state.containerList}
            statusList={this.state.statusList}
            orderSorting= {(sort, by)=>{this.orderSorting(sort, by)}}
            toggleAddModal = {this.toggleAddModal.bind(this)}
            toggleEditModal = {this.toggleEditModal.bind(this)}
            toggleExchangeModal = {this.toggleExchangeModal.bind(this)}
            toggleRemovalModal = {this.toggleRemovalModal.bind(this)}
            openConfirmDeleteModal= {this.openConfirmDeleteModal.bind(this)}
          />
          }

          {this.state.limit < this.state.totalActiveOrder ?
            <Pagination
              className="pb-3 text-center pagination-wrapper w-100 mt-3"
              current={this.state.page + 1}
              onChange={this.onPagechange.bind(this)}
              pageSize={this.state.limit}
              total={this.state.totalActiveOrder}
            />
            : '' }

        </main>
        {this.state.addOrderModalIsOpen ?
        <AddOrder
          addOrderModalIsOpen = {this.state.addOrderModalIsOpen}
          orderData={this.state.orderData}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          selectedCustomer= {_.get(this.props, 'user', {})}
          fetchOrders={this.fetchOrders}
          {...this.props}
        /> : ""}
        {this.state.editModalIsOpen ?

        <EditOrder
          editModalIsOpen = {this.state.editModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.props.statusList}
          fetchOrders={this.fetchOrders}
          selectedCustomer= {_.get(this.props, 'user', {})}
          orderDataForEdit = {this.state.orderDataForEdit}
          {...this.props}
        /> : ""}

        {this.state.isViewModalOpen ?
        <ViewOrder
          isViewModalOpen = {this.state.isViewModalOpen}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          fetchOrders={this.fetchOrders}
          orderData = {this.state.orderDataForEdit}
          viewOrder ={this.viewOrder.bind(this)}
          toggleAddModal = {this.toggleAddModal.bind(this)}
          toggleEditModal = {this.toggleEditModal.bind(this)}
          toggleExchangeModal = {this.toggleExchangeModal.bind(this)}
          toggleRemovalModal = {this.toggleRemovalModal.bind(this)}
          openConfirmDeleteModal= {this.openConfirmDeleteModal.bind(this)}
          {...this.props}
        /> : ""}

        {this.state.exchangeModalIsOpen ?
        <ExchangeOrder
          exchangeModalIsOpen = {this.state.exchangeModalIsOpen}
          closeModal={this.closeModal}
          customerId={_.get(this.props, 'user.customerid', '')}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          //selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.fetchOrders}
          orderDataForExchange = {this.state.orderDataForExchange}
          futureExchange={this.state.futureExchange}
          dumps={this.state.dumps}
          {...this.props}
        /> : ""}

        {this.state.removalModalIsOpen ?
        <RemovalOrder
          removalModalIsOpen = {this.state.removalModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          selectedCustomer= {_.get(this.props, 'user', {})}
          fetchOrders={this.fetchOrders}
          orderDataForRemoval = {this.state.orderDataForRemoval}
          futureRemoval={this.state.futureRemoval}
          dumps={this.state.dumps}
          {...this.props}
          pendingRemoval={this.state.pendingRemoval}
        /> : ""}

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'order’s'}
        />
      </div>
    )
  }
}

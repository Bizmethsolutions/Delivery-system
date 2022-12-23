import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import _ from "lodash"
import moment from "moment"
import { Menu, Dropdown, Popconfirm, message, Tabs, Select } from 'antd'

import ViewOrder from './viewOrderModalNew'
import AddOrder from './addOrderModal'
import CompleteOrder from './completeOrderModal'
import EmptyComponent from '../../../components/emptyComponent'
import { formatOrderAddess, formatPhoneNumber, getContainerSize, getDate, formatNumber } from '../../../components/commonFormate'
import { SortingNewUpIcon ,BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'

import EditOrder from './editOrderModal'

const { TabPane } = Tabs;
const { Option } = Select;

export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      isViewModalOpen: false,
      isEditModalOpen: false,
      customers: [],
      sort_field: 'updatedat',
      by: -1,
      editModalIsOpen: false,
      orderDataForEdit: {},
      classname: [
        {class: "red-yard", size: '10 Yard'},
        {class: "purple-yard", size: '15 Yard'},
        {class: "green-yard", size: '20 Yard'},
        {class: "yellow-yard", size: '30 Yard'},
        {class: "orange-yard", size: '1/2 Yard'},
        {class: "blue-yard", size: 'Live Load'}
      ]
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ editModalIsOpen: true })
  }

  closeModal() {
    this.setState({ editModalIsOpen: false, isViewModalOpen: false, completeModalOpen: false, addOrderModalIsOpen: false })
  }

  toggleViewModal = () => {
    this.setState({ isViewModalOpen: !this.state.isViewModalOpen })
  }

  toggleEditModal = (order) => {
    this.setState({ editModalIsOpen: true, orderDataForEdit: order })
  }

  componentDidMount = async()=> {
    if(this.props.match.params.id && this.props.match.params.orderid) {
      const customerid = this.props.match.params.id
      this.updatePopup(customerid, this.props.match.params.orderid)
    }
    // this.fetchOrders()
  }

  updatePopup =async(customerid, orderid)=> {
    let data = {
      search_string: "",
      //limit: 20,
      by: 1,
      //page: 0,
      sort: ''
    }
    let { value } = await this.props.fetchCustomers(data)
    if (_.get(value, 'customers', []).length > 0) {
      let idx = _.get(value, 'customers', []).findIndex(obj => obj.customerid === customerid)
      let selectedCustomer =  value.customers[idx]
      let data2 ={
        sort: '',
        by: 1,
        type: 'history',
        customerId: _.get(selectedCustomer, '_id', '')
      }
      let ordersValue = await this.props.getAllOrders(data2)
      const orders = _.get(ordersValue, 'value.order', [])
      let orderIndex = orders.findIndex(obj => obj.orderid === orderid)
      if (orderIndex !== -1) {
        let selectedOrder =  orders[orderIndex]
        const { value } = await this.props.getOrderById(orderid)
        const connectedOrders = _.get(value, 'data.connectedOrders', [])
        const queue_removal_orders = _.get(value, 'data.queue_removal_orders', [])
        const queue_exchange_orders = _.get(value, 'data.queue_exchange_orders', [])
        this.setState({ connectedOrders, queue_removal_orders, queue_exchange_orders})
        this.setState({ isViewModalOpen: true, orderDataForEdit: selectedOrder })
      }
    }
  }

  // fetchOrders =async()=> {
  //   let data ={
  //     page: this.state.page,
  //     limit: this.state.limit,
  //     sort: this.state.sort,
  //     by: this.state.by,
  //     type: this.state.type,
  //     customerId: this.props.customerId
  //   }
  //   let { value } = await this.props.getAllOrders(data)
  //   this.setState({
  //     totalOrder: _.get(value, 'count', 0),
  //     orders: _.get(value, 'order', []),
  //   })
  //   console.log(value)
  // }

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

  confirmDelete = async(id) => {
    let { value } = await this.props.deleteOrder(id)
    message.success('successfully deleted')
    this.props.fetchOrders()
  }

  cancel =(e)=> {
  }

  getStatus(input) {
    if (input && this.props.statusList) {
      let status = "";
      this.props.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      return status;
    }
  }

  sortby(field) {
    if (this.state.sort_field === field) {
      this.state.by = this.state.by * -1;
      this.props.orderSorting(this.state.sort_field, this.state.by)
    } else {
      this.state.sort_field = field;
      this.state.by = 1
      this.props.orderSorting(this.state.sort_field, this.state.by)
    }

  }

  viewOrder = async(order) => {
    const customerid = this.props.match.params.id
    const { value } = await this.props.getOrderById(order.orderid)
    const connectedOrders = _.get(value, 'data.connectedOrders', [])
    const queue_removal_orders = _.get(value, 'data.queue_removal_orders', [])
    const queue_exchange_orders = _.get(value, 'data.queue_exchange_orders', [])
    this.setState({ connectedOrders, queue_removal_orders, queue_exchange_orders}, () => {
    this.props.history.push(`/customer-orders/${customerid}/${order.orderid}`)
    this.setState({ isViewModalOpen: true, orderDataForEdit: order })
    })
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

  toggleAddModal (order) {
    this.setState({ orderData: order, addOrderModalIsOpen: true })
  }

  openCompleteModal(order) {
    this.setState({ completeModalOpen: true, orderDataForComplete: order })
  }

  render() {
    const { isViewModalOpen, isEditModalOpen } = this.state
    return (
      <div>
        <div className="row mb-3">
          <div className="col-md-12">
          <div className={_.get(this.props, 'liveOrders', []).length !== 0 ? "": ""}>
            <div className="table-responsive">
            {_.get(this.props, 'liveOrders', []).length !== 0 ?
              <table className="table custom-table-secondary">
                <thead>
                  <tr>
                    <th onClick={() => { this.sortby('_id') }}>
                        <span className="custom-table-th-title-sm">Order Number {this.getSortArrow('_id')}</span>
                    </th>
                    <th onClick={() => { this.sortby('ordereddate') }}>
                        <span className="custom-table-th-title-sm">Ordered Date { this.getSortArrow('ordereddate')}</span>
                    </th>
                    <th onClick={() => { this.sortby('container') }}>
                        <span className="custom-table-th-title-sm">Product/Service { this.getSortArrow('container')}</span>
                    </th>
                    <th onClick={() => { this.sortby('typeofdebris') }}>
                        <span className="custom-table-th-title-sm">Debris { this.getSortArrow('typeofdebris')}</span>
                    </th>
                    <th onClick={() => { this.sortby('otherDebris') }}>
                        <span className="custom-table-th-title-sm for-cursor">Other Debris { this.getSortArrow('otherDebris')}</span>
                    </th>
                    <th onClick={() => { this.sortby('haular') }}>
                        <span className="custom-table-th-title-sm">Hauler { this.getSortArrow('haular')}</span>
                    </th>
                    <th onClick={() => { this.sortby('deliverydate') }}>
                        <span className="custom-table-th-title-sm">Date Delivered { this.getSortArrow('deliverydate')}</span>
                    </th>
                    <th onClick={() => { this.sortby('pickupdate') }}>
                        <span className="custom-table-th-title-sm">Removal Date { this.getSortArrow('pickupdate')}</span>
                    </th>
                    <th onClick={() => { this.sortby('overload') }}>
                        <span className="custom-table-th-title-sm">Overload { this.getSortArrow('overload')}</span>
                    </th>
                    <th onClick={() => { this.sortby('location') }}>
                        <span className="custom-table-th-title-sm">JobAddress { this.getSortArrow('location')}</span>
                    </th>
                    <th onClick={() => { this.sortby('consumercost') }}>
                        <span className="custom-table-th-title-sm">Total Cost { this.getSortArrow('consumercost')}</span>
                    </th>
                        <th className="rem-pad-lr width-50">
                      <span className="custom-table-th-title-sm">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="table-card tablewhite">
                  {_.get(this.props, 'liveOrders', []).map((order, i)=>{
                    const status = this.getStatus(order.status, order) && (this.getStatus(order.status, order).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase()
                    return (
                      <tr key={i}>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{_.get(order, 'orderid', '')}</span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{getDate(order.ordereddate)}</span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          {
                            _.get(this.props, 'containerList', []).map((cnt, i)=>{
                              const classIndex = _.findIndex(this.state.classname, (c) => {
                                return c.size === _.get(cnt, 'size', '')
                              })
                              if (cnt._id === order.container) {
                                return (
                                  <button key ={i} className={classIndex !== -1 ? `${this.state.classname[classIndex].class}` : `tn-yellow-fill`} >{_.get(cnt, 'size', '')}</button>
                                )
                              }
                            })
                          }

                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{Array.isArray(_.get(order, 'typeofdebris', [])) ? _.get(order, 'typeofdebris', []).join(', ') : _.get(order, 'typeofdebris', '')}</span>
                        </td>
                        { _.get(order, 'typeofdebris', []).indexOf("Other") !== -1 && _.get(order, 'otherDebris', []).length !== 0 ?
                          <td onClick={this.viewOrder.bind(this, order)}>
                            <span className="custom-table-title-md">{Array.isArray(_.get(order, 'otherDebris', [])) ? _.get(order, 'otherDebris', []).join(', ') : _.get(order, 'otherDebris', '')}</span>
                          </td>
                          :
                          <td onClick={this.viewOrder.bind(this, order)}>
                            <span className="custom-table-title-md">N/A</span>
                          </td>
                        }
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{_.get(order, 'haular.company_name', '')} </span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                        <span className="custom-table-title-md">
                          {getDate(order.deliverydate)}
                        </span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                        <span className="custom-table-title-md">
                          {order.pickupdate && order.pickupdate !== null ? getDate(order.pickupdate) : getDate(order.completiondate)}
                        </span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{_.get(order, 'overload', '')} </span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{this.formatAddess(order)}</span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{formatNumber(_.get(order, 'consumercost', ''))} </span>
                        </td>
                        <td className="rem-pad">
                          <Dropdown overlay={<Menu>
                            <Menu.Item key="0">
                              <button className="btn-menu" onClick={this.toggleViewModal} to={'/'}>View</button>
                            </Menu.Item>
                            <Menu.Item key="1">
                              <button className="btn-menu" onClick={this.toggleAddModal.bind(this,order)} >Copy</button>
                            </Menu.Item>
                            <Menu.Item key="2">
                              <button className="btn-menu" onClick={this.toggleEditModal.bind(this,order)} >Edit</button>
                            </Menu.Item>
                          </Menu>} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right90">
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
              : <EmptyComponent
                    emptyText = "No Orders"
                  /> }
            </div>
            </div>
          </div>
        </div>
        {this.state.isViewModalOpen ?
        <ViewOrder
          isViewModalOpen = {this.state.isViewModalOpen}
          closeModal={this.closeModal}
          toggleAddModal = {this.toggleAddModal.bind(this)}
          toggleEditModal={this.toggleEditModal.bind(this)}
          customerId={this.props.customerId}
          connectedOrders={this.state.connectedOrders}
          queue_removal_orders = {this.state.queue_removal_orders}
          queue_exchange_orders={this.state.queue_exchange_orders}
          viewOrder={this.viewOrder.bind(this)}
          containerList={this.props.containerList}
          openCompleteModal={this.openCompleteModal.bind(this)}
          statusList={this.props.statusList}
          selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.props.fetchOrders}
          orderData = {this.state.orderDataForEdit}
          {...this.props}
        /> : ""}
        {this.state.addOrderModalIsOpen ?
        <AddOrder
          addOrderModalIsOpen = {this.state.addOrderModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.props.customerId}
          containerList={this.props.containerList}
          statusList={this.props.statusList}
          selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.props.fetchOrders}
          orderData = {this.state.orderData}
          {...this.props}
        /> : ""}
        {this.state.editModalIsOpen ?
        <EditOrder
          editModalIsOpen = {this.state.editModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.props.customerId}
          containerList={this.props.containerList}
          statusList={this.props.statusList}
          dumps={this.props.dumps}
          selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.props.fetchOrders}
          orderDataForEdit = {this.state.orderDataForEdit}
          {...this.props}
        /> : ""}
        {this.state.completeModalOpen ?
          <CompleteOrder
          completeModalOpen = {this.state.completeModalOpen}
          closeModal={this.closeModal}
          customerId={this.props.customerId}
          containerList={this.props.containerList}
          statusList={this.props.statusList}
          selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.props.fetchOrders}
          orderDataForComplete = {this.state.orderDataForComplete}
          futureRemoval={this.state.futureRemoval}
          dumps={this.props.dumps}
          {...this.props}
        /> : ""}
      </div>
    )
  }
}

import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import _ from "lodash"
import moment from "moment"
import { Menu, Dropdown, Popconfirm, message, Tabs, Select } from 'antd'

import EmptyComponent from '../../../components/emptyComponent'
import { formatOrderAddess, formatPhoneNumber, getContainerSize, getDate } from '../../../components/commonFormate'
import { SortingNewUpIcon ,BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'

import EditOrder from './editOrderModal'
import AddOrder from './addOrderModal'
import ApprovalModel from './approvalOrderModal'
import ExchangeOrder from './exchangeOrderModal'
import RemovalOrder from './removalOrderModal'
import CompleteOrder from './completeOrderModal'
import DeleteModal from '../../../components/deleteModal'
import CancelModal from '../../../components/cancelModal'

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
      sort_field: 'deliverydate',
      by: -1,
      editModalIsOpen: false,
      orderDataForEdit: {},
      isViewModalOpen: false,
      exchangeModalIsOpen: false,
      deleteModelIsOpen: false,
      pendingRemoval: false,
      orderId: '',
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
    this.setState({
      editModalIsOpen: false,
      isViewModalOpen: false,
      orderDataForEdit: {},
      addOrderModalIsOpen: false,
      exchangeModalIsOpen: false,
      removalModalIsOpen: false,
      deleteModelIsOpen: false,
      completeModalOpen: false,
      cancelModalIsOpen: false,
      pendingRemoval: false
    })
    this.props.fetchOrders()
    const customerid = this.props.match.params.id
    this.props.history.push(`/customer-orders/unapproved-orders/${customerid}`, {c: 'pending'})
    //this.props.updateUrl()
  }

  toggleViewModal = () => {
    this.setState({ isViewModalOpen: !this.state.isViewModalOpen })
  }

  toggleEditModal = (order) => {
    let status = order.status ? this.getStatus(order.status, order) : ""
    if ( status === "Pending Removal" ) {
      this.setState({ pendingRemoval: true })
      this.toggleRemovalModal(order, false)
    } else {
      this.setState({ editModalIsOpen: true, orderDataForEdit: order })
    }
  }

  componentDidMount = async()=> {
    if(this.props.match.params.id && this.props.match.params.orderid) {
        if(this.props.match.path === "/customer-orders/unapproved-orders/:id/:orderid") {
          const customerid = this.props.match.params.id
          this.updatePopup(customerid, this.props.match.params.orderid)
        }
    }
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
        // page: this.state.page,
        // limit: this.state.limit,
        sort: this.state.sort,
        by: this.state.by,
        type: 'live',
        isApproved: false,
        customerId: _.get(selectedCustomer, '_id', '')
      }

      let ordersValue = await this.props.getOrdersbyCompany()
      const orders = _.get(ordersValue, 'value.data', [])
      let orderIndex = orders.findIndex(obj => obj.orderid === orderid)
      if (orderIndex !== -1) {
        let selectedOrder =  orders[orderIndex]
        this.setState({ isViewModalOpen: true, orderDataForEdit: selectedOrder })
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
    const orderData = _.find(_.get(this.props, 'pendingOrders', []), (order) => {
      return String(order.id) === String(id)
    })
    if(orderData.type === "Removal") {
      const { revertOrder } = this.props
      try{
        const { value } = await revertOrder({id: orderData._id ? orderData._id : orderData.id})
        if(value) {
          this.props.fetchOrders()
          this.closeModal()
          //this.closeRejectModal()
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "can't cancel and inprogress job"))
        this.closeRejectModal()
      }
    } else if (orderData.type === "Exchange") {
      const { revertOrder } = this.props
      try{
        const { value } = await revertOrder({id: orderData.parentId , reject: true})
        if(value) {
          try {
            let { value } = await this.props.deleteOrder(id)
            message.success('successfully deleted')
            this.props.fetchOrders()
            this.closeModal()
          } catch(e) {
            message.success(_.get(e, 'error.message', "can't cancel an inprogress job"))
            this.closeModal()
          }
          //this.props.fetchOrders()
          //this.closeModal()
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "can't cancel and inprogress job"))
        this.closeRejectModal()
      }
    } else {
      try {
        let { value } = await this.props.deleteOrder(id)
        message.success('successfully deleted')
        this.props.fetchOrders()
        this.closeModal()
      } catch(e) {
        message.success(_.get(e, 'error.message', "can't cancel an inprogress job"))
        this.closeModal()
      }
    }
  }

  openConfirmDeleteModal (id) {
    this.setState({ orderId: id, deleteModelIsOpen: true })
  }

  getStatus(input, order) {
    if (input && this.props.statusList) {
      let status = "";
      this.props.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      if(status === "Future Exchange") {
        const queue_exchange_orders = _.get(order, 'queue_exchange_orders', [])
        if(order && queue_exchange_orders && queue_exchange_orders.length > 0) {
            const _index = _.findIndex(queue_exchange_orders, (o) => {
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

  viewOrder (order) {
    const customerid = this.props.match.params.id
    this.props.history.push(`/customer-orders/unapproved-orders/${customerid}/${order.orderid}`, {c: 'pending'})
    this.setState({ isViewModalOpen: true, orderDataForEdit: order })
  }

  toggleAddModal (order) {
    this.setState({ orderData: order, addOrderModalIsOpen: true })
  }

  toggleExchangeModal (order, futureExchange) {
    order.futureExchange = futureExchange
    this.setState({ exchangeModalIsOpen: !this.state.exchangeModalIsOpen, orderDataForExchange: order, futureExchange: futureExchange})
  }

  toggleRemovalModal (order, futureRemoval) {
    order.futureRemoval = futureRemoval
    this.setState({ removalModalIsOpen: !this.state.removalModalIsOpen, orderDataForRemoval: order, futureRemoval: futureRemoval})
  }

  openCompleteModal(order) {
    this.setState({ completeModalOpen: true, orderDataForComplete: order })
  }

  openCancel(id) {
    this.setState({ cancelModalIsOpen: true, cancelId: id })
  }

  confirmCancel = async() => {
    const { revertOrder } = this.props
    const { value } = await revertOrder({id: this.state.cancelId})
    if(value) {
      this.closeModal()
    }
  }

  render() {
    const { isViewModalOpen, isEditModalOpen } = this.state
    return (
      <div>
        <div className="row mb-3">
          <div className="col-md-12">
          <div className={_.get(this.props, 'pendingOrders', []).length !== 0 ? "": ""}>
            <div className="table-responsive">
            {_.get(this.props, 'pendingOrders', []).length !== 0 ?
              <table className="table custom-table-secondary">
                <thead>
                  <tr>
                    <th onClick={() => { this.sortby('_id') }}>
                        <span className="custom-table-th-title-sm for-cursor">Order Number {this.getSortArrow('_id')}</span>
                    </th>
                    <th onClick={() => { this.sortby('deliverydate') }}>
                        <span className="custom-table-th-title-sm for-cursor">Delivery Date { this.getSortArrow('deliverydate')}</span>
                    </th>
                    <th onClick={() => { this.sortby('pickupdate') }}>
                        <span className="custom-table-th-title-sm for-cursor">Removal Date { this.getSortArrow('pickupdate')}</span>
                    </th>
                    <th onClick={() => { this.sortby('location') }}>
                        <span className="custom-table-th-title-sm for-cursor">JobAddress { this.getSortArrow('location')}</span>
                    </th>
                    <th onClick={() => { this.sortby('container') }}>
                        <span className="custom-table-th-title-sm for-cursor">Product/Service { this.getSortArrow('container')}</span>
                    </th>
                    <th onClick={() => { this.sortby('typeofdebris') }}>
                        <span className="custom-table-th-title-sm for-cursor">Debris { this.getSortArrow('typeofdebris')}</span>
                    </th>
                    <th onClick={() => { this.sortby('haular') }}>
                        <span className="custom-table-th-title-sm for-cursor">Hauler { this.getSortArrow('haular')}</span>
                    </th>
                    <th onClick={() => { this.sortby('status') }}>
                        <span className="custom-table-th-title-sm for-cursor">Status { this.getSortArrow('status')}</span>
                    </th>
                      <th className="text-center width-50">
                      <span className="custom-table-th-title-sm">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="table-card tablewhite">
                  {_.get(this.props, 'pendingOrders', []).map((order, i)=>{
                    const status = this.getStatus(order.status, order) ? (this.getStatus(order.status, order).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase() : ""
                    return (
                      <tr key={i}>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{_.get(order, 'orderid', '')}</span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">
                          {(this.getStatus(order.status, order) === "Future Exchange" || this.getStatus(order.status, order) === "Future Removal") ? getDate(order.pickupdate) : getDate(order.deliverydate)}</span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">
                            {((this.getStatus(order.status, order) === 'Future Removal' || this.getStatus(order.status, order) === 'Pending Removal' || this.getStatus(order.status, order) === 'Removed') ? (getContainerSize(this.props.containerList, order.container) === 'Live Load' ? getDate(order.deliverydate) : getDate(order.pickupdate)) : '-')}
                          </span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{this.formatAddess(order)}</span>
                        </td>
                        {order.save_as_draft ?
                          <td onClick={this.viewOrder.bind(this, order)}>
                            <button key ={i} className="btn">Draft</button>
                        </td>
                        :  <td onClick={this.viewOrder.bind(this, order)}>
                          {
                            this.props.containerList.map((cnt, i)=>{
                              const classIndex = _.findIndex(this.state.classname, (c) => {
                                return c.size === _.get(cnt, 'size', '')
                              })
                              if (cnt._id === order.container) {
                                return (
                                  <button key={i} className={classIndex !== -1 ? `${this.state.classname[classIndex].class}` : `yellow-yard`}>{_.get(cnt, 'size', '')}</button>
                                )
                              }
                            })
                          }
                        </td>}
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{Array.isArray(_.get(order, 'typeofdebris', [])) ? _.get(order, 'typeofdebris', []).join(', ') : _.get(order, 'typeofdebris', '')}</span>
                        </td>
                        <td onClick={this.viewOrder.bind(this, order)}>
                          <span className="custom-table-title-md">{_.get(order, 'haular.company_name', '')} </span>
                        </td>
                        <td>
                          <button className="btn-purple-fill status-container" status={status}>{this.getStatus(order.status, order)}</button>
                        </td>
                        <td className="rem-pad">
                          <Dropdown overlay={<Menu>
                          { this.getStatus(order.status, order) !== "Removed" && this.getStatus(order.status, order) !== "Future Removal" && this.getStatus(order.status, order) !== "Future Exchange" ?
                            <Menu.Item key="1"  onClick={this.toggleAddModal.bind(this,order)}>
                              <button className="btn-menu">Copy</button>
                            </Menu.Item> : "" }
                            {/* { this.getStatus(order.status, order) !== "Removed" ?
                            <Menu.Item key="2" onClick={this.viewOrder.bind(this, order)}>
                              <button className="btn-menu">View</button>
                            </Menu.Item> : "" } */}
                            {/* { this.getStatus(order.status, order) !== "Removed" ?
                            <Menu.Item key="3" onClick={this.toggleEditModal.bind(this,order)}>
                              <button className="btn-menu">Edit</button>
                            </Menu.Item> : "" } */}
                              { this.getStatus(order.status, order) !== "Removed" ?
                              <Menu.Item key="6">
                                <a href="#" onClick={this.openConfirmDeleteModal.bind(this,order.id )}>Delete</a>
                              </Menu.Item> : "" }
                          </Menu>} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right1">
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
              :
                  <EmptyComponent
                    emptyText = "No Orders"
                  /> }
            </div>
            </div>
          </div>
        </div>
        {this.state.editModalIsOpen ?
        <EditOrder
          editModalIsOpen = {this.state.editModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.props.customerId}
          containerList={this.props.containerList}
          statusList={this.props.statusList}
          selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.props.fetchOrders}
          orderDataForEdit = {this.state.orderDataForEdit}
          {...this.props}
        /> : ""}
        {this.state.isViewModalOpen ?
          <ApprovalModel
            editModalIsOpen = {this.state.isViewModalOpen}
            closeModal={this.closeModal.bind(this)}
            customerId={this.props.customerId}
            containerList={this.props.containerList}
            statusList={this.props.statusList}
            fetchOrders={this.props.fetchOrders}
            selectedCustomer= {this.props.selectedCustomer}
            orderDataForEdit = {this.state.orderDataForEdit}
            getStatus = {this.getStatus.bind(this)}
            dumps={this.props.dumps}
            {...this.props}
          />
         : ""}
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
        {this.state.exchangeModalIsOpen ?
        <ExchangeOrder
          exchangeModalIsOpen = {this.state.exchangeModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.props.customerId}
          containerList={this.props.containerList}
          statusList={this.props.statusList}
          selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.props.fetchOrders}
          orderDataForExchange = {this.state.orderDataForExchange}
          futureExchange={this.state.futureExchange}
          dumps={this.props.dumps}
          {...this.props}
        /> : ""}
        {this.state.removalModalIsOpen ?
        <RemovalOrder
          removalModalIsOpen = {this.state.removalModalIsOpen}
          pendingRemoval = {this.state.pendingRemoval}
          closeModal={this.closeModal}
          customerId={this.props.customerId}
          containerList={this.props.containerList}
          statusList={this.props.statusList}
          selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.props.fetchOrders}
          orderDataForRemoval = {this.state.orderDataForRemoval}
          futureRemoval={this.state.futureRemoval}
          dumps={this.props.dumps}
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
        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'order’s'}
        />
         <CancelModal
          cancelModalIsOpen={this.state.cancelModalIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmCancel={this.confirmCancel.bind(this)}
          text={'order’s'}
        />
      </div>
    )
  }
}

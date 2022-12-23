import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'

import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import { getContainerSize, getFormatedDateAndTimeWithoutUTC, getFormatedDateAndTimeByUTC } from '../../../components/commonFormate'
import MapComponent from '../../../components/map'
import MessageBox from './MessageBox'

const { TabPane } = Tabs
const { Option } = Select

const styles = {
  tabsContainer : {

  },
}

export default class ViewOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      messages: [],
      timezone: {}
    }

  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    const tab = _.get(this.props, 'location.state.c', 'active')
    if(_.get(this.props, 'user.type', 'user') === "customer") {
      if(tab === 'pending') {
        this.props.history.push(`/pending-orders`)
      }
      if(tab === 'history') {
        this.props.history.push(`/completed-orders`)
      }
      if(tab === 'active') {
        this.props.history.push(`/active-containers`)
      }
      this.props.closeModal()
    } else {
      const customerid = this.props.match.params.id
      // /this.props.history.goBack()
      if (tab === 'pending') {
        this.props.history.push(`/customer-orders/pending/${customerid}`)
      } else if (tab === 'rejected') {
        this.props.history.push(`/customer-orders/rejected/${customerid}`)
      } else {
        if(this.getStatus(this.props.orderData.status, this.props.orderData) === "Complete") {
          this.props.history.push(`/customer-orders/history/${customerid}`)
        } else {
          this.props.history.push(`/customer-orders/live/${customerid}`)
        }
      }

      this.props.closeModal()
      // this.props.history.push(`/customer-orders/live/${customerid}`)
      // this.props.closeModal()
      // this.props.updateUrl()
    }

  }

  componentDidMount = async()=> {
    let data = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
    }
    }
    this.props.getUser(data)
    this.getMessages()
    const id = _.get(this.props.orderData, 'id', '') !== "" && _.get(this.props.orderData, 'id', '') !== undefined ? _.get(this.props.orderData, 'id', '') : _.get(this.props.orderData, '_id', '')
    if(id !== "" && id !== undefined && id !== "undefined") {
      let { value } = await this.props.getOrderActivity(id)
      if(value) {
        this.setState({ activity: _.get(value, 'data', [])})
      }
    }
  }

  getMessages = async()=> {
    let { value }= await this.props.getMessage(this.props.orderData.orderid)
    if(value.type === 'success') {
      this.setState({ messages: value.data })
    }
  }

  getContainerSize(id) {
    if (this.props.containerList.length > 0) {
      let master = this.props.containerList
      // console.log(id);
      for (let index = 0; index < master.length; index++) {
        let element = master[index]
        if (element._id === id) {
          return element.size
        }
      }
    }
  }

  getStatus(input, order) {
    if (input && this.props.statusList) {
      let status = "";
      this.props.statusList.forEach(function (element) {
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

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderData.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
}

getFormatedDateAndTimeByUTC(input) {
  if(Object.keys(this.props.user).length !== 0) {
    return getFormatedDateAndTimeByUTC(input, this.props.user)
  } else {
    return ""
  }
}

  render() {
    const { orderData, selectedCustomer } = this.props
    return (
      <div>
      <ReactModal
        isOpen={this.props.isViewModalOpen}
        onRequestClose={this.closeModal.bind(this)}
        contentLabel="Add Team Member"
        ariaHideApp={false}
      >
        <div className="react-modal-dialog react-modal-dialog-full react-modal-dialog-centered">
          <div className="react-modal-header d-flex align-items-center">
            <div>
              <h5 className="react-modal-title">Order Information - {_.get(orderData, 'orderid', '')}</h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {this.getFormatedDateAndTime(orderData.createdat)} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span> {_.get(orderData, 'created.name', '')}</h6>
            </div>
            <div className="marg-left-auto">
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
          </div>
          <div className="divider-line"></div>
          <div className="react-modal-body pd-t-0">
            {/* <div className="row mb-3">
              <div className="col-md-12">
                <div className="flex-btn-tabs">
                  <button className="btn primarybtn primarybtn-active">Order Details</button>
                  <button className="btn primarybtn">Connected Orders</button>
                  <button className="btn primarybtn">Order Activity</button>
                  <button className="btn primarybtn">Message History</button>
                </div>
              </div>
            </div> */}

            <div className="tabsContainer mb-3">
              <Tabs>
                <TabPane tab="Order Details" key="1">
                <div className="row">
                  <div className="col-md-8">
                    <ul className="order-listing">
                      <li>
                        <label className="view-textfield-label">Job Address</label>
                        <p className="view-textfield-details">{_.get(orderData, 'new_address', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">State</label>
                        <p className="view-textfield-details">{_.get(orderData, 'state', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">City</label>
                        <p className="view-textfield-details">{_.get(orderData, 'city', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Zipcode</label>
                        <p className="view-textfield-details">{_.get(orderData, 'zipcode', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Borough</label>
                        <p className="view-textfield-details">{_.get(orderData, 'borough', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Neighborhood</label>
                        <p className="view-textfield-details">{_.get(orderData, 'neighborhood', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Delivery Date (MM/DD/YY)</label>
                        <p className="view-textfield-details">{moment(orderData.deliverydate).format('MM/DD/YY')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Delivery Day</label>
                        <p className="view-textfield-details">{_.get(orderData, 'deliveryday', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Product/Service</label>
                        <p className="view-textfield-details">{this.getContainerSize(_.get(orderData, 'container', ''))}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Type of Debris</label>
                        <p className="view-textfield-details">{Array.isArray(_.get(orderData, 'typeofdebris', [])) ? _.get(orderData, 'typeofdebris', []).join(', ') : _.get(orderData, 'typeofdebris', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Contact # (xxx-xxx-xxxx)</label>
                        <p className="view-textfield-details">{_.get(orderData, 'contactnumber', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Contact Name</label>
                        <p className="view-textfield-details">{_.get(orderData, 'contactname', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Permit</label>
                        <p className="view-textfield-details">{_.get(orderData, 'permit', false) === true ? 'Yes' : 'No'}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Container Location</label>
                        <p className="view-textfield-details">{_.get(orderData, 'containerlocation', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Order Date (MM/DD/YYYY</label>
                        <p className="view-textfield-details">{_.get(orderData, 'ordereddate', '')}</p>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-4">
                    <div className="map-section-sm">
                    <MapComponent position={_.get(orderData, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(orderData, 'container', ''))}/>
                    </div>
                    <ul className="order-listing order-listing-100">
                      <li>
                        <label className="view-textfield-label">Purchase Order #</label>
                        <p className="view-textfield-details">{_.get(orderData, 'purchaseorderno', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Special Instructions</label>
                        <p className="view-textfield-details">{_.get(orderData, 'specialinstruction', '')}</p>
                      </li>
                    </ul>
                  </div>
                </div>
                </TabPane>
                <TabPane className={styles.tabPane} tab="Connected Orders" key="2">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table-responsive">
                            <table className="table custom-table-secondary white-bg">
                              <thead>
                                <tr>
                                  <th>
                                    <span className="custom-table-th-title-sm for-cursor">Order Number </span>
                                  </th>
                                  <th>
                                    <span className="custom-table-th-title-sm for-cursor">Delivery Date </span>
                                  </th>
                                  <th>
                                    <span className="custom-table-th-title-sm for-cursor">Removal Date </span>
                                  </th>
                                  <th>
                                    <span className="custom-table-th-title-sm for-cursor">Status </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                              {_.get(orderData, 'connectedOrders', []).map((connectedOrders, i)=>{
                                return (
                                  <tr key={i}>
                                    <td>{_.get(connectedOrders,'orderid', '')}</td>
                                    <td>{moment(connectedOrders.deliverydate).format('MM/DD/YYYY')}</td>
                                    <td>{connectedOrders.pickupdate ? moment(connectedOrders.pickupdate).format('MM/DD/YYYY') : '-'}</td>
                                    <td>{this.getStatus(connectedOrders.status, orderData)}</td>
                                  </tr>
                                )
                              })}
                                {/* <tr>
                                  <td>O0004307</td>
                                  <td>2-12-2020</td>
                                  <td>2-12-2020</td>
                                  <td>Removed</td>
                                </tr> */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                </TabPane>
                <TabPane className={styles.tabPane} tab="Order Activity" key="3">

                <ul className="order-activity-list">
                {_.get(this.state, 'activity', []).map((activity, i)=>{
                                // console.log(connectedOrders)
                                return (
                                  <li>{activity.description}
                                  <div className="fordate">{this.getFormatedDateAndTimeByUTC(activity.createdat)}</div>
                                  </li>
                                )
                              })}
                </ul>
                </TabPane>
                {this.getStatus(orderData.status, orderData) !== "Pending Delivery" && this.getStatus(orderData.status, orderData) !== "Future Exchange"  && this.getStatus(orderData.status, orderData) !== "Future Removal"?
                  <TabPane className={styles.tabPane} tab={this.getStatus(orderData.status, orderData) === "In Use" ? "Message Customer" :  "Message History"} key="4">
                  <MessageBox
                      orderData={orderData}
                      orderstatus={this.getStatus(orderData.status, orderData)}
                      selectedCustomer= {this.props.selectedCustomer}
                      messages= {this.state.messages}
                      {...this.props} />
                  </TabPane>
                  : "" }
            </Tabs>
            </div>
          </div>
        </div>
      </ReactModal>
      </div>
    )
  }
}

import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'

import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import { getContainerSize, getAllowedTons, getTimeInDayAndHours, getDayDate, getFormatedDateAndTimeWithoutUTC, getFormatedDateAndTimeByUTC, formatNumber, getDate, getDateMMDDYYYHHMM, formatOrderAddess, calculatePriceForExchange } from '../../../components/commonFormate'
import MapComponent from '../../../components/map'
import MessageBox from './MessageBox'

import ExchangeIcon from '../../../images/btn-exchange.svg'
import removalIcon from '../../../images/btn-removal.svg'
import copyorderIcon from '../../../images/btn-copyorder.svg'
import editorderIcon from '../../../images/btn-editorder.svg'
import deleteorderIcon from '../../../images/btn-deleteorder.svg'

import DeleteModal from '../../../components/deleteModal'
import EditPermitModal from '../../Permits/partials/editPermitModal'


import PermitOrderIcon from '../../../images/permit-vieworder.svg'
import PermitViewIcon from '../../../images/permit-download.svg'




import DownloadArrow from '../../../images/download.svg'
import completeorderIcon from '../../../images/completeicon.svg'
import CancelIcon from '../../../images/cacelbtn.svg'
import config from '../../../config'
import DownloadReceiptsIcon from '../../../images/download-receipts-icon.svg'


import LoaderGif from '../../../images/loader.gif'

const { TabPane } = Tabs
const { Option } = Select
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const heavyMaterials = config.heavyMaterials

const styles = {
  tabsContainer : {

  },
}

export default class ViewOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      messages: [],
      timezone: {},
      activeKey: "1",
      live_load_yard: 0,
      half_yrd_qty: 0,
      receiptid: "",
      permitList: [],
      deletePermitModelIsOpen: false,
      editPermitIsOpen: false,
      orderDetailForEditPermit: {},
      permitSort: 'permitid',
      permitBy: -1
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
    this.getPermit()
    const id = _.get(this.props.orderData, 'id', '') !== "" && _.get(this.props.orderData, 'id', '') !== undefined ? _.get(this.props.orderData, 'id', '') : _.get(this.props.orderData, '_id', '')
    if(id !== "" && id !== undefined && id !== "undefined") {
      let { value } = await this.props.getOrderActivity(id)
      if(value) {
        this.setState({ activity: _.get(value, 'data', [])})
      }
    }
    this.updateCalculation()
  }

  getMessages = async()=> {
    let { value }= await this.props.getMessage(this.props.orderData.orderid)
    if(value.type === 'success') {
      this.setState({ messages: value.data })
    }
  }
  getPermit = async()=> {
    let data = {
      id: _.get(this.props.orderData, 'id', '') !== "" && _.get(this.props.orderData, 'id', '') !== undefined ? _.get(this.props.orderData, 'id', '') : _.get(this.props.orderData, '_id', ''),
      sort: this.state.permitSort,
      by: this.state.permitBy
    }
    let { value }= await this.props.getPermitsByOrder(data)
    if(value.type === 'success') {
      this.setState({ permitList: value.data })
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
        if(this.props.queue_exchange_orders && this.props.queue_exchange_orders.length > 0) {
            const _index = _.findIndex(this.props.queue_exchange_orders, (o) => {
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

  getStatusConnectedOrder(input, order) {
    const { orderData } = this.props
    if (input && this.props.statusList) {
      let status = "";
      this.props.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      //return status;
      if(status === "Future Exchange") {
        if(this.props.queue_exchange_orders && this.props.queue_exchange_orders.length > 0) {
            const _index = _.findIndex(this.props.queue_exchange_orders, (o) => {
              return String(o.id) === String(order.id)
            })
            if(_index >= 0) {
                status = `${status} ${_index + 1}`
            }
            return status;
        } else {
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
    //return ""
    const timezone = _.get(this.props, 'orderData.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeByUTC(input, this.props.user)
    } else {
      return ""
    }
  }


// toggleAddModal (order) {
//   this.setState({ orderData: order, addOrderModalIsOpen: true })
// }
  clickOrder(type, futureExchange) {
    if(type === "copy") {
      this.props.toggleAddModal(this.props.orderData)
    } else if (type === "edit") {
      this.props.toggleEditModal(this.props.orderData)
    } else if (type === "delete") {
      this.closeModal()
    this.props.openConfirmDeleteModal(this.props.orderData.id)
  } else if (type === "complete") {
    this.props.openCompleteModal(this.props.orderData)
  } else if (type === "exchange") {
    this.props.toggleExchangeModal(this.props.orderData, futureExchange)
  } else if (type === "removal") {
    this.props.toggleRemovalModal(this.props.orderData, futureExchange)
  } else if (type === "cancel") {
    this.closeModal()
    this.props.openCancel(this.props.orderData.id)
  }
}

  openMapModal() {
    this.setState({ openMapModal: true })
  }

  closeMapModal() {
    this.setState({ openMapModal: false })
  }


  getDownloadReceipt= async(jobId, e)=> {
    if(jobId && jobId !='') {
      this.setState({receiptid: jobId}, async() => {
        try {
          let { value } = await this.props.getDownloadReceipt(jobId)
          if(value.type=== 'success') {
            const invoiceUrl = value.data.invoiceUrl
            this.setState({isLoaderInit: false, receiptid: ""})
            window.open(invoiceUrl);
          } else {
            this.setState({isLoaderInit: false, receiptid: ""})
            alert(value.data && value.data.message)
          }

        } catch(error) {
          this.setState({ receiptid: "" })
          alert('Somthing went wrong in receipt fetching.')
         return false;
        }
      });
    }
  }

  changeKey(key) {
    this.setState({activeKey: key})
  }

  openConnectedOrders = async(order) => {
    if(this.props.viewOrder) {
      const { getOrderByOrderId } = this.props
      // console.log(data, 'data data')
      let { value } = await getOrderByOrderId(order.orderid)
      this.props.viewOrder(value.data)
      this.setState({ activeKey: "1" })
      let value2 = await this.props.getOrderActivity(order.id)
      if(value2) {
        this.setState({ activity: _.get(value2, 'value.data', [])})
      }
    }
      //const customerid = this.props.match.params.id
      //this.props.history.push(`/customer-orders/${customerid}/${order.orderid}`)
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

  updateCalculation =async()=> {
    const { orderData, selectedCustomer, user } = this.props
    let containerName = await getContainerSize(_.get(this.props,'containerList', []), _.get(orderData, 'container', ''))
    const county = this.state.county
    const cal = calculatePriceForExchange(containerName, orderData.typeofdebris, county)
    var permit = 0
    if(_.get(orderData, 'permit', 'false')) {
      permit = 54.44
    }
    let amount = cal.base
    let taxes = (8.875 * (amount + permit))/100
    let totalamount = amount + taxes

    if(containerName !== 'Live Load') {
      totalamount = totalamount + permit
    } else {
      const p = amount * parseInt(_.get(orderData, 'live_load_yard', 0))
      amount = p
      totalamount = p + 250
      taxes = (8.875 * totalamount)/100
      totalamount = totalamount + taxes
      this.setState({ baseprice : amount,taxes: taxes, truckingrate: 250, estimatedprice: p.toFixed(2)},()=>{
        this.forceUpdate()
      })
    }
    if(containerName === '1/2 Yard') {
      const p = amount * parseInt(_.get(this.state, 'half_yrd_qty', 0))
      amount = p
      totalamount = p + 250 + permit
      taxes = (8.875 * totalamount)/100
      totalamount = totalamount + taxes
      this.setState({ baseprice : amount,amount: p, taxes: taxes, estimatedprice: p.toFixed(2)})
    }
    let discount = orderData.discount

    if(orderData.discountPercentage && orderData.discountPercentage !== '') {
      discount = (parseFloat(totalamount)*parseFloat(orderData.discountPercentage))/100
      totalamount = parseFloat(totalamount - discount)
    }
    this.setState({ totalamount, consumercost:totalamount,  taxes, amount, permitPrice : permit, discount },()=>{
      this.forceUpdate()
    })
  }

  formatNumber(number) {
    const nfObject = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 });
    const output = nfObject.format(number);
    return output
  }

  getDay(input) {
    if (input) {
        return moment(input).utc().format("dddd")
        //return DateUtility.getDay(new Date(input).getDay());
    }
  }

  getPermitDuration (permit) {
    let daysIn = 'N/A'
    const date1 = new Date(permit.startdate);
    date1.setHours(0,0,0,0);
    const date2 = new Date(permit.enddate);
    date2.setHours(23, 59, 59, 999);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysIn = diffDays + " days"
    return daysIn
  }

  getPermitexpireDays (permit){
    let daysIn = 'N/A'
    const timezone = _.get(permit, 'timezone', {})
    if (permit && permit.enddate) {
      const date1 = new Date();
      date1.setHours(0,0,0,0);
      // const date2 = new Date(permit.enddate);
      let date2 = getFormatedDateAndTimeWithoutUTC(permit.enddate, timezone, this.props.user)
      date2.setHours(23, 59, 59, 999);
      if (date2 < date1) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // daysIn = diffDays + " days overdue"
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

  openConfirmPermitDeleteModal (id, orderId) {
    this.setState({ permitId: id, orderId: orderId, deletePermitModelIsOpen: true })
  }

  deletePermit = async() => {
    let id = this.state.permitId
    let orderId = this.state.orderId
    let data =  {
      id, orderId
    }
    let { value } = await this.props.deletePermit(data)
    this.getPermit()
    this.closeDeleteModal()

  }

  closeDeleteModal () {
    this.setState({ permitId: "", deletePermitModelIsOpen: false })
  }

  closeEditPermitModal () {
    this.setState({ editPermitIsOpen: false, orderDetailForEditPermit: {} })
  }

  openEditPermitModal (permit) {
    let orderDetail = _.cloneDeep(this.props.orderData);
    orderDetail.permit_info = permit
    orderDetail.customer_info = this.props.selectedCustomer
    this.setState({ editPermitIsOpen: true, orderDetailForEditPermit: orderDetail })
  }

  getSortArrow(field) {
    if (this.state.permitSort === field) {
      if (this.state.permitBy === 1)
             return (<SortingNewUpIcon />)
         else
             return (<SortingNewDownIcon />)
      } else {
         return (<SortingNewDownIcon />)
      }
  }

  sortby(field) {
    if (this.state.permitSort === field) {
        this.state.permitBy = this.state.permitBy * -1;
    } else {
        this.state.permitSort = field;
        this.state.permitBy = 1;
    }
    this.getPermit();
  }

  downloadPermit (permit) {
    window.open(permit.uploadedFile.uploadfileurl)
  }

  render() {
    const { orderData, selectedCustomer, user } = this.props
    console.log('---------------')
    const accessibilitynotes = _.get(orderData, 'accessibility', '') === "Other: Manual entry" ? _.get(orderData, 'manualaccessibility', '') : _.get(orderData, 'accessibility', '')
    const status = this.getStatus(orderData.status, orderData) ? (this.getStatus(orderData.status, orderData).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase() : ""
    const statusCheck = this.getStatus(orderData.status, orderData)
    let created = orderData.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    const isHomeCustomer = _.get(this.props, 'selectedCustomer.isHomeCustomer', false)
    let createdInfo = orderData.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderData.createdat)
    const tonnagepercentage = orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.tonnagepercentage
    const tonnageweight = orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.tonnageweight
    const allowedTons = getAllowedTons(this.getContainerSize(_.get(orderData, 'container', '')))
    const deliveryday = getDayDate(orderData.deliverydate)
    return (
      <div>

      {/* */}
        {/* <ReactModal
          isOpen={this.props.isViewModalOpen}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-960 react-modal-dialog-centered">
            <div className="react-modal-header d-flex align-items-center">
              <div>
                <h5 className="react-modal-title d-flex align-items-center">Order Information - {_.get(orderData, 'orderid', '')} <span className="greenlable status-container" status={status}>{this.getStatus(orderData.status, orderData)}</span></h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} | <span className="clearfixmob"></span> <span>By:</span> {_.get(orderData, 'created.name', '') !== '' ? _.get(orderData, 'created.name', '') : _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
              </div>
              <div className="marg-left-auto">
                <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
              </div>
            </div>
            <div className="react-modal-body p-0">

              <div className="leftcontent">
                <div className="tabsContainer mb-3">
                  <Tabs activeKey={this.state.activeKey} onTabClick={this.changeKey.bind(this)}>
                    <TabPane tab="Order Details" key="1"></TabPane>
                    <TabPane tab="Connected Orders" key="2"></TabPane>
                    <TabPane tab="Permits" key="3">
                      <div className="container">

                      <div className="table-responsive" style={{ padding: '15px' }}>
                        <table className="table custom-table-secondary white-bg">
                          <thead>
                            <tr>
                              <th>
                                <span className="custom-table-th-title-sm for-cursor">Permit # <SortingNewDownIcon /></span>
                              </th>
                              <th>
                                <span className="custom-table-th-title-sm for-cursor">Permit Start <SortingNewDownIcon /></span>
                              </th>
                              <th>
                                <span className="custom-table-th-title-sm for-cursor">Permit End <SortingNewDownIcon /></span>
                              </th>
                              <th>
                                <span className="custom-table-th-title-sm for-cursor">Permit Duration <SortingNewDownIcon /></span>
                              </th>
                              <th>
                                <span className="custom-table-th-title-sm for-cursor">Expires In</span>
                              </th>
                              <th>
                                <span className="custom-table-th-title-sm for-cursor">Actions</span>
                              </th>
                            </tr>
                          </thead>

                          <tbody className="table-card">

                            <tr className="for-cursor">
                              <td>
                                <span className="custom-table-title custom-table-title-md yellowfont">251003</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md">2/11/2020</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md">2/15/2020</span>
                              </td>
                              <td>
                                <span className="custom-table-title custom-table-title-md">4 days</span>
                              </td>
                              <td>
                                  <span className="custom-table-title custom-table-title-md table-redtxt">3 day</span>
                              </td>
                                <td className="text-center">
                                  <span className="custom-table-title custom-table-title-md"><DotBtnIcon /></span>
                              </td>
                            </tr>

                              <tr className="for-cursor">
                                <td>
                                  <span className="custom-table-title custom-table-title-md yellowfont">251002</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md">2/11/2020</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md">2/15/2020</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md">4 days</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md table-yellowtxt">Today</span>
                                </td>
                                <td className="text-center">
                                  <span className="custom-table-title custom-table-title-md"><DotBtnIcon /></span>
                                </td>
                              </tr>

                              <tr className="for-cursor">
                                <td>
                                  <span className="custom-table-title custom-table-title-md yellowfont">251001</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md">2/09/2020</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md">2/10/2020</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md">1 days</span>
                                </td>
                                <td>
                                  <span className="custom-table-title custom-table-title-md table-redtxt">3 days overdue </span>
                                </td>
                                <td className="text-center">
                                  <span className="custom-table-title custom-table-title-md"><DotBtnIcon /></span>
                                </td>
                              </tr>





                          </tbody>
                        </table>
                      </div>
                      </div>

                    </TabPane>
                    <TabPane tab="Order Activity" key="4"></TabPane>
                    <TabPane tab="Message History" key="5"></TabPane>
                  </Tabs>
                </div>
              </div>


                <div className="rightbtns">
                  <h4>Actions</h4>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={ExchangeIcon} /></span> Exchange</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={removalIcon} /></span> Removal</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={copyorderIcon} /></span> Copy Order</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={editorderIcon} /></span> Edit Order</button>
                  <button className="btn btn-dark w-180 w-half redbg font-600 font-16"><span><img src={deleteorderIcon} /></span> Delete Order</button>
                  <button className="btn btn-dark w-180 w-half canclbtn font-600 font-16"><span><img src={CancelIcon} /></span> Cancel Order</button>
                  <button className="btn btn-dark w-180 w-half completbtn font-600 font-16"><span><img src={completeorderIcon} /></span> Complete Order</button>
                </div>
            </div>
          </div>
        </ReactModal> */}
      {/* */}











      <ReactModal
        isOpen={this.props.isViewModalOpen}
        onRequestClose={this.closeModal.bind(this)}
        contentLabel="Add Team Member"
        ariaHideApp={false}
      >
        <div className="react-modal-dialog react-modal-dialog-960 react-modal-dialog-centered">
            <div className="react-modal-header d-flex align-items-center">
                <div>
                <h5 className="react-modal-title d-flex flexnotfixed align-items-center">Order Information - {_.get(orderData, 'orderid', '')} <span className="greenlable status-container" status={status}>{this.getStatus(orderData.status, orderData)}</span></h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span> {_.get(orderData, 'created.name', '') !== '' ? _.get(orderData, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
                </div>
                <div className="marg-left-auto">
                  <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
                </div>
                <div className="loaderdownloadbtn">
                {(statusCheck !== "Pending Delivery" && !String(statusCheck).includes('Future Exchange') && statusCheck !== "Future Removal") ?
                    <img className="arrow-loader" onClick={this.getDownloadReceipt.bind(this, orderData.id)}
                      src={String(this.state.receiptid) === String(orderData.id) ? LoaderGif : DownloadArrow}
                    />
                  : "" }
                  </div>
              </div>
              <div className="react-modal-body p-0">

              <div className="leftcontent">
                  <div className="tabsContainer mb-3">
                    <Tabs activeKey={this.state.activeKey} onTabClick={this.changeKey.bind(this)}>
                      <TabPane tab="Order Details" key="1" >
                        <div className="pannel-wrapper">
                          <ul>
                            <li>
                              <h4>What are we picking up and how much of it?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Product/Service</label>
                                    <div className="detail">{this.getContainerSize(_.get(orderData, 'container', ''))}</div>
                                  </li>
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" ?
                                  <li>
                                    <label>On Site</label>
                                    <div className="detail">{_.get(orderData, 'half_yrd_qty', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null ?
                                  <li>
                                    <label>Loose Yardage</label>
                                    <div className="detail">{_.get(orderData, 'looseyardage', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null  ?
                                  <li>
                                    <label>Empty Amount</label>
                                    <div className="detail">{_.get(orderData, 'emptyamount', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null ?
                                  <li>
                                    <label>Remove Minis</label>
                                    <div className="detail">{_.get(orderData, 'removeminis', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null ?
                                  <li>
                                    <label>Add Minis</label>
                                    <div className="detail">{_.get(orderData, 'addminis', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "Live Load" ?
                                  <li>
                                    <label> Yardage</label>
                                    <div className="detail">{_.get(orderData, 'live_load_yard', '')}</div>
                                  </li> : "" }
                                  <li>
                                    <label>Type of Debris</label>
                                    <div className="detail">
                                      {typeof _.get(orderData, 'typeofdebris', []) !== "string" && _.get(orderData, 'typeofdebris', []).map((td, i)=>{
                                        return(
                                          <div key={i}>- {td}</div>
                                        )
                                      })}
                                    </div>
                                  </li>
                                  {_.get(orderData, 'otherDebris', []).length !== 0 ?
                                  <li>
                                    <label>Other Debris</label>
                                    <div className="detail">
                                      {_.get(orderData, 'otherDebris', []).map((td, j)=>{
                                        return(
                                          <div key={j}>- {td}</div>
                                        )
                                      })}
                                    </div>
                                  </li> : ""}
                                </ul>
                              </div>

                            </li>

                            <li>
                              <h4>Where do you want the container(s)? </h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Address</label>
                                    <div className="detail detail-map">
                                      <p>{this.formatAddess(orderData)}</p>
                                      <p><b>Borough:</b> {_.get(orderData, 'borough', '') !== '' ? _.get(orderData, 'borough', '') : 'N/A'}</p>
                                      <p><b>Neighborhood:</b> {_.get(orderData, 'neighborhood', '') !== '' ? _.get(orderData, 'neighborhood', '') : 'N/A'}</p>
                                    </div>
                                    <button className="btn-viewmap" onClick={this.openMapModal.bind(this)}>View Map</button>
                                  </li>
                                  <li>
                                    <label>Container Placement</label>
                                    <div className="detail">{_.get(orderData, 'placement', '') !== '' ? _.get(orderData, 'placement', '') : 'N/A'}</div>
                                  </li>
                                  <li>
                                    <label>Container Location</label>
                                    <div className="detail">{_.get(orderData, 'containerlocation', '') !== '' ? _.get(orderData, 'containerlocation', '') : 'N/A' }</div>
                                  </li>
                                  <li>
                                    <label>Parking</label>
                                    <div className="detail">{_.get(orderData, 'parking', '') !== '' ? _.get(orderData, 'parking', '') : 'N/A'}</div>
                                  </li>
                                  { this.getContainerSize(_.get(orderData, 'container', ''))!== 'Live Load' && this.getContainerSize(_.get(orderData, 'container', ''))!== '1/2 Yard' ?
                                  <li>
                                    <label>Permit</label>
                                    <div className="detail">{_.get(orderData, 'permit', '') ? 'Yes' : 'No'}</div>
                                  </li> : "" }
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>When do you want the container(s)?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Delivery Date</label>
                                    <div className="detail">{getDate(orderData.deliverydate)}</div>
                                  </li>
                                  <li>
                                    <label>Delivery Day</label>
                                    <div className="detail">{_.get(orderData, 'deliveryday', '') !== '' ? _.get(orderData, 'deliveryday', '') : deliveryday}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Who’s placing this order?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Full Name</label>
                                    <div className="detail">{_.get(orderData, 'orderedby', '') !== '' ? _.get(orderData, 'orderedby', '') : 'N/A'}</div>
                                  </li>
                                  <li>
                                    <label>Phone number</label>
                                    <div className="detail">{_.get(orderData, 'orderedbycontact', '') !== '' ? _.get(orderData, 'orderedbycontact', ''): 'N/A'}</div>
                                  </li>
                                  <li>
                                    <label>Email</label>
                                    <div className="detail">{_.get(orderData, 'orderEmail.email', '') !== '' ? _.get(orderData, 'orderEmail.email', ''): 'N/A'}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Who’s going to be onsite?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Job Site Contact Person</label>
                                    <div className="detail">{_.get(orderData, 'contactname', '') !== '' ? _.get(orderData, 'contactname', ''): 'N/A'}</div>
                                  </li>
                                  <li>
                                    <label>Job Site Contact Person Phone</label>
                                    <div className="detail">{_.get(orderData, 'contactnumber', '') !== '' ? _.get(orderData, 'contactnumber', '') : 'N/A'}</div>
                                  </li>
                                  <li>
                                    <label>Job Site Contact Person Email</label>
                                    <div className="detail">{_.get(orderData, 'contactEmail.email', '') !== '' ? _.get(orderData, 'contactEmail.email', ''): 'N/A'}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Payment Information</h4>
                              <div className="boxwrapper">
                                {!isHomeCustomer ?
                                <ul>
                                  <li>
                                    <label>Purchase Order Number</label>
                                    <div className="detail">{_.get(orderData, 'purchaseordernumber', '') !== "" ? _.get(orderData, 'purchaseordernumber', '') : 'N/A'}</div>
                                  </li>
                                  {_.get(orderData, 'pricingtype', '') !== '' ?
                                  <li>
                                    <label>Pricing Type</label>
                                    <div className="detail">{_.get(orderData, 'pricingtype', '')}</div>
                                  </li> : ""}
                                  {_.get(orderData, 'paymenttype', '') !== '' ?
                                  <li>
                                    <label>Payment Type</label>
                                    <div className="detail">{_.get(orderData, 'paymenttype', '')}</div>
                                  </li> : ""}
                                  {orderData.consumercost && orderData.consumercost !== "" ?
                                  <li>
                                    <label>Total Price</label>
                                    <div className="detail">{ orderData.consumercost && orderData.consumercost !== "" && parseFloat(orderData.consumercost).toFixed(2) ? `$${this.formatNumber(parseFloat(orderData.consumercost).toFixed(2))}` : "" }</div>
                                  </li> : ""}
                                </ul>
                                :
                                this.getContainerSize(_.get(orderData, 'container', ''))!== 'Live Load' ?
                                  <ul>
                                    <li>
                                      <label>Purchase Order Number</label>
                                      <div className="detail">{_.get(orderData, 'purchaseordernumber', '')}</div>
                                    </li>
                                    {_.get(orderData, 'pricingtype', '') !== '' ?
                                    <li>
                                      <label>Pricing Type</label>
                                      <div className="detail">{_.get(orderData, 'pricingtype', '')}</div>
                                    </li> : ""}
                                    {_.get(orderData, 'paymenttype', '') !== '' ?
                                    <li>
                                      <label>Payment Type</label>
                                      <div className="detail">{_.get(orderData, 'paymenttype', '')}</div>
                                    </li> : ""}
                                    <li>
                                      <label>Included Tonnage</label>
                                      <div className="detail">{_.intersection(heavyMaterials, _.get(orderData,'typeofdebris', [])).length === 0 ? `${_.get(allowedTons, 'tons', '')} tons` : "N/A"}</div>
                                    </li>
                                    <li>
                                      <label>Base</label>
                                      <div className="detail">{this.state.amount !== "" &&this.state.amount && this.state.amount.toFixed(2) ? `$${formatNumber(this.state.amount.toFixed(2))}` : "" }</div>
                                    </li>
                                    {this.getContainerSize(_.get(orderData, 'container', '')) === '1/2 Yard' ?
                                      <li>
                                        <label>Delivery Fee</label>
                                        <div className="detail">$250</div>
                                      </li> : ""
                                    }
                                    {(_.get(orderData, 'permit', false) === true || _.get(orderData, 'permit', "no") === 'yes') ?
                                      <li>
                                        <label>Permit</label>
                                        <div className="detail">$54.44</div>
                                      </li> : ""
                                    }
                                    <li>
                                      <label>Estimated Taxes</label>
                                      <div className="detail">{this.state.taxes !== "" &&this.state.taxes && this.state.taxes.toFixed(2) ? `$${this.formatNumber(this.state.taxes.toFixed(2))}` : "" }</div>
                                    </li>
                                    {this.state.discount && this.state.discount !== '' ?
                                    <li>
                                      <label>Discount</label>
                                      <div className="detail">{this.state.discount !== "" && this.state.discount ? `$${formatNumber(this.state.discount.toFixed(2))}` : "" }</div>
                                    </li> :""}
                                    <li>
                                      <label>Total</label>
                                      <div className="detail">{this.state.totalamount !== "" &&this.state.totalamount && this.state.totalamount.toFixed(2) ? `$${this.formatNumber(this.state.totalamount.toFixed(2))}` : "" }</div>
                                    </li>
                                  </ul>
                                :
                                <ul>
                                  <li>
                                    <label>Purchase Order Number</label>
                                    <div className="detail">{_.get(orderData, 'purchaseordernumber', '')}</div>
                                  </li>
                                  {_.get(orderData, 'pricingtype', '') !== '' ?
                                  <li>
                                    <label>Pricing Type</label>
                                    <div className="detail">{_.get(orderData, 'pricingtype', '')}</div>
                                  </li> : ""}
                                  {_.get(orderData, 'paymenttype', '') !== '' ?
                                  <li>
                                    <label>Payment Type</label>
                                    <div className="detail">{_.get(orderData, 'paymenttype', '')}</div>
                                  </li> : ""}
                                  <li>
                                    <label>Estimated Yardage</label>
                                    <div className="detail">{_.get(orderData, 'live_load_yard', '')} yards</div>
                                  </li>
                                  <li>
                                    <label>Price per yard </label>
                                    <div className="detail">${_.get(this.state, 'baseprice', 0)}</div>
                                  </li>
                                  <li>
                                    <label>Estimated Yardage Price </label>
                                    <div className="detail">${_.get(this.state, 'estimatedprice', 0) }</div>
                                  </li>
                                  <li>
                                    <label>Base</label>
                                    <div className="detail">{this.state.amount !== "" &&this.state.amount && this.state.amount.toFixed(2) ? `$${formatNumber(this.state.amount.toFixed(2))}` : "" }</div>
                                  </li>
                                  {(_.get(orderData, 'permit', false) === true || _.get(orderData, 'permit', "no") === 'yes') ?
                                    <li>
                                      <label>Permit</label>
                                      <div className="detail">$54.44</div>
                                    </li> : ""
                                  }
                                  <li>
                                    <label>Trucking Rate</label>
                                    <div className="detail">{this.state.truckingrate !== "" &&this.state.truckingrate && this.state.truckingrate.toFixed(2) ? `$${formatNumber(this.state.truckingrate.toFixed(2))}` : "" }</div>
                                  </li>
                                  <li>
                                    <label>Estimated Taxes</label>
                                    <div className="detail">{this.state.taxes !== "" &&this.state.taxes && this.state.taxes.toFixed(2) ? `$${this.formatNumber(this.state.taxes.toFixed(2))}` : "" }</div>
                                  </li>
                                  {this.state.discount && this.state.discount !== '' ?
                                  <li>
                                    <label>Discount</label>
                                    <div className="detail">{this.state.discount !== "" && this.state.discount ? `$${formatNumber(this.state.discount.toFixed(2))}` : "" }</div>
                                  </li> :""}
                                  <li>
                                    <label>Estimated Total Price</label>
                                    <div className="detail">{this.state.totalamount !== "" &&this.state.totalamount && this.state.totalamount.toFixed(2) ? `$${this.formatNumber(this.state.totalamount.toFixed(2))}` : "" }</div>
                                  </li>
                                </ul>
                              }
                              </div>
                            </li>

                            <li>
                              <h4>Internal Details</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Hauler</label>
                                    <div className="detail">{_.get(orderData, 'haular.companyname', '') !== '' ? _.get(orderData, 'haular.companyname', '') : _.get(orderData, 'haular.company_name', '')}</div>
                                  </li>
                                  <li>
                                    <label>Special Instructions</label>
                                    <div className="detail">
                                    {_.get(orderData, 'specialinstruction', '') !== '' ? _.get(orderData, 'specialinstruction', '') : 'N/A'}
                                    </div>
                                  </li>
                                  <li>
                                    <label>Accessibility Notes</label>
                                    <div className="detail">
                                    {accessibilitynotes !== "" && accessibilitynotes !== "Select" ? accessibilitynotes : 'N/A'}
                                    </div>
                                  </li>
                                  {statusCheck === "Complete" || orderData.type === "Removal" &&
                                  <li>
                                    <label>Removal Date</label>
                                    <div className="detail">{orderData.pickupdate ? getDate(_.get(orderData, 'pickupdate', '')) : getDate(_.get(orderData, 'completiondate', ''))}</div>
                                  </li>
                                  }
                                  {statusCheck === "Complete" || orderData.type === "Removal" &&
                                  <li>
                                    <label>Removal Day</label>
                                    <div className="detail">{orderData.pickupdate ? moment(_.get(orderData, 'pickupdate', '')).format('dddd') : moment(_.get(orderData, 'completiondate', '')).format('dddd')}</div>
                                  </li>
                                  }
                                  <li>
                                  <label>Dump Ticket Number</label>
                                  <div className="detail">{_.get(orderData, 'dumpticketnumber', '') !== '' ? _.get(orderData, 'dumpticketnumber', '') : 'N/A'}</div>
                                </li>
                                <li>
                                  <label>Dump Cost</label>
                                  <div className="detail">{_.get(orderData, 'dumpcost', '') !== '' ?`$${this.formatNumber(_.get(orderData, 'dumpcost', ''))}` : 'N/A'}</div>
                                </li>
                                <li>
                                  <label>Dump Site</label>
                                  <div className="detail">{_.get(orderData, 'dump.companyname', '') !== '' ? _.get(orderData, 'dump.companyname', '') : 'N/A'}</div>
                                </li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                          <ul>
                            <li>
                            {_.get(orderData, 'uploadedpdf', '') && _.get(orderData, 'uploadedpdf', []).length !== 0 ?
                              <div className="col-md-12 col-sm-12 padd-lft0">
                                  <h4>Uploaded Files</h4>
                                  <ul className="uploaded-list">
                                      {_.get(orderData, 'uploadedpdf', []).map((file, index) => {
                                          return(
                                              <li>
                                                  <p>{file.name}</p>
                                                  <a href={file.url} target="_blank" className="btn btn-download" download><img src={DownloadArrow} width="18"/> </a>
                                              </li>
                                          )
                                      })
                                      }
                                  </ul>
                              </div>
                              : "" }
                            </li>
                          </ul>
                          { statusCheck === "Complete" && orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation !== undefined ?
                          <div className="subs-box-wrapper">
                            <h4>Sustainability Information</h4>
                              <ul>
                                <li>
                                  <label className="view-textfield-label">Total % (yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation &&  orderData.sustainabilityinformation.totalpercentage && Math.round(orderData && orderData.sustainabilityinformation.totalpercentage)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Total % (tons)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.weight_total && Math.round(orderData && orderData.sustainabilityinformation.weight_total)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Weight (tons)</label>
                                  <p className="detail">{orderData && orderData.weight && orderData.weight}</p>
                                </li>

                                <li>
                                  <label className="view-textfield-label">Waste % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.waste}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Waste % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage[0].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Waste Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[0].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Brick % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.brick && orderData.sustainabilityinformation.brick}</p>
                                </li>

                                <li>
                                  <label className="view-textfield-label">Brick % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[1].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Brick Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[1].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Dirt % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.dirt && orderData.sustainabilityinformation.dirt}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Dirt % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[2].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Dirt Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[2].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Concrete % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.concrete && orderData.sustainabilityinformation.concrete}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Concrete % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[3].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Concrete Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[3].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Wood % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.cleanwood && orderData.sustainabilityinformation.cleanwood}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Wood % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[4].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Wood Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[4].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Metal % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.metal && orderData.sustainabilityinformation.metal}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Metal % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[5].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Metal Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[5].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Paper/Cardboard % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.paper_cardboard && orderData.sustainabilityinformation.paper_cardboard} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Paper/Cardboard % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[6].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Paper/Cardboard Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[6].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Plastic % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.plastic && orderData.sustainabilityinformation.plastic} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Plastic % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[7].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Plastic Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[7].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Drywall % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.drywall && orderData.sustainabilityinformation.drywall} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Drywall % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[8].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Drywall Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[8].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Glass % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.glass && orderData.sustainabilityinformation.glass} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Glass % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[9].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Glass Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[9].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Asphalt % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.asphalt && orderData.sustainabilityinformation.asphalt} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Asphalt % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[10].value)}  </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Asphalt Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[10].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Recycling % (Tons)</label>
                                  <p className="detail">{Math.round(orderData && orderData.sustainabilityinformation.recyclingpercentage && orderData.sustainabilityinformation.recyclingpercentage)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Residual Waste % (Tons)</label>
                                  <p className="detail">{Math.round(orderData && orderData.sustainabilityinformation.residualpercentage && orderData.sustainabilityinformation.residualpercentage)} </p>
                                </li>
                              </ul>
                            </div>: "" }
                        </div>
                      </TabPane>
                      <TabPane tab="Connected Orders" key="2" >
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
                              {_.get(this.props, 'connectedOrders', []).map((connectedOrders, i)=>{
                                return (
                                  <tr key={i} className={String(orderData.id) === String(connectedOrders.id) ? "selected-connected" : "" } onClick={this.openConnectedOrders.bind(this, connectedOrders)}>
                                    <td>{_.get(connectedOrders,'orderid', '')}</td>
                                    <td>{getDate(connectedOrders.deliverydate)}</td>
                                    <td>{ connectedOrders.pickupdate ? getDate(connectedOrders.pickupdate) : '-'}</td>
                                    <td>{this.getStatusConnectedOrder(connectedOrders.status, connectedOrders)}</td>
                                  </tr>
                                )
                              })}

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                      </TabPane>
                      { this.getContainerSize(_.get(orderData, 'container', ''))!== 'Live Load' && this.getContainerSize(_.get(orderData, 'container', ''))!== '1/2 Yard' ?
                      <TabPane tab="Permits" key="5" >
                      {_.get(this.state, 'permitList', []).length !== 0 ?
                        <div className="container">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="table-responsive">
                                <table className="table custom-table-secondary white-bg">
                                  <thead>
                                    <tr>
                                      <th>
                                        <span onClick={() => { this.sortby('permitid') }} className="custom-table-th-title-sm for-cursor">Permit # {this.getSortArrow('permitid')} </span>
                                      </th>
                                      <th>
                                        <span onClick={() => { this.sortby('startdate') }} className="custom-table-th-title-sm for-cursor">Permit Start {this.getSortArrow('startdate')} </span>
                                      </th>
                                      <th>
                                        <span onClick={() => { this.sortby('enddate') }} className="custom-table-th-title-sm for-cursor">Permit End {this.getSortArrow('enddate')} </span>
                                      </th>
                                      <th className="text-center">
                                        <span className="custom-table-th-title-sm for-cursor">Permit Duration </span>
                                      </th>
                                      {this.getStatus(orderData.status, orderData) !== "Removed" && (
                                      <th className="text-center">
                                        <span className="custom-table-th-title-sm for-cursor">Expires In </span>
                                      </th> )}
                                      <th className="text-center">
                                        <span className="custom-table-th-title-sm for-cursor"></span>
                                      </th>
                                      <th className="text-center">
                                        <span className="custom-table-th-title-sm for-cursor">Actions </span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {_.get(this.state, 'permitList', []).map((permit, i)=>{
                                    return (
                                      <tr key={i} className="" >
                                        <td className="permit-lightyellow-txt">{_.get(permit,'permitnumber', '')}</td>
                                        <td>{permit && permit.startdate ? getDate(permit.startdate): "N/A"}</td>
                                        <td>{permit && permit.enddate ? getDate(permit.enddate): "N/A"}</td>
                                        <td className="text-center">{this.getPermitDuration(permit)}</td>
                                        {this.getStatus(orderData.status, orderData) !== "Removed" && (
                                        <td className={this.getPermitexpireDays(permit) && this.getPermitexpireDays(permit) === "Today" ? "permit-darkyellow-txt text-center" : "permit-red-txt text-center"}>{this.getPermitexpireDays(permit)}</td>)}
                                        { permit && permit.uploadedFile && permit.uploadedFile.uploadfileurl ?
                                        <td className="text-center"> <img onClick={this.downloadPermit.bind(this, permit)} src={DownloadReceiptsIcon} /></td>
                                        : <td className="text-center"> </td>}
                                        <td className="global-modal-alert">
                                          <Dropdown overlay={
                                            <Menu>
                                              <Menu.Item key="1" onClick={this.openEditPermitModal.bind(this, permit)}>
                                                <a href="#">Edit</a>
                                              </Menu.Item>
                                              <Menu.Item key="3" onClick={this.openConfirmPermitDeleteModal.bind(this, permit._id, permit.orderid )}>
                                                <a href="#">Delete</a>
                                              </Menu.Item>
                                            </Menu>
                                          } trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-left dropdown-onmodal">
                                            <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                              <DotBtnIcon />
                                            </a>
                                          </Dropdown>
                                        </td>
                                      </tr>
                                    )
                                  })}

                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        :
                        <div className="no-activity-mdl">
                          No Permits
                        </div>
                         }
                      </TabPane> : "" }
                      <TabPane tab="Order Activity" key="3"  >
                      {_.get(this.state, 'activity', []).length !== 0 ?
                        <ul className="order-activity-list">
                          {_.get(this.state, 'activity', []).map((activity, i)=>{
                            const createdat = this.getFormatedDateAndTimeByUTC(activity.createdat)
                            let createdActivity = orderData.timezone ? getTimeInDayAndHours(createdat) : getDateMMDDYYYHHMM(activity.createdat)
                            return (
                              <li key={i}>{activity.description}
                              <div className="fordate">{createdActivity}</div>
                              </li>
                            )
                          })}
                        </ul>
                        :
                        <div className="no-activity-mdl">
                          No Activity
                        </div>
                         }
                      </TabPane>
                      {this.getStatus(orderData.status, orderData) !== "Pending Delivery" && String(this.getStatus(orderData.status, orderData)).indexOf('Future Exchange') === -1   && this.getStatus(orderData.status, orderData) !== "Future Removal"?
                      <TabPane className={styles.tabPane}  tab={this.getStatus(orderData.status, orderData) === "In Use" ? "Message Customer" :  "Message History"} key="4">
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
                { this.getStatus(orderData.status, orderData) === "Complete" || orderData.isRejected !== false ?
                  <div className="rightbtns">
                    <h4>Actions</h4>
                      <button className="btn btn-dark w-180 w-half font-600 font-16 " onClick={this.clickOrder.bind(this, 'copy')} ><span><img src={copyorderIcon} /></span> Copy Order</button>
                      { this.getStatus(orderData.status, orderData) !== "Complete" ?
                      <button className="btn btn-dark w-180 w-half redbg font-600 font-16" onClick={this.clickOrder.bind(this, 'delete')}><span><img src={deleteorderIcon} /></span> Delete Order</button>
                      :
                      <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'edit')}><span><img src={editorderIcon} /></span> Edit Order</button>
                      }
                    </div>
                    :
                  <div className="rightbtns">
                    <h4>Actions</h4>
                    {getContainerSize(this.props.containerList, orderData.container) !== "Live Load" &&
                    this.getStatus(orderData.status, orderData) !== "Removed" && this.getStatus(orderData.status, orderData) !== "Future Removal" && String(this.getStatus(orderData.status, orderData)).indexOf('Future Exchange') === -1  ?
                    this.getStatus(orderData.status, orderData) === "In Use" ?
                    <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'exchange', false)}><span><img src={ExchangeIcon} /></span> {getContainerSize(this.props.containerList, orderData.container) === "1/2 Yard" ? "Action" : "Exchange"}</button>
                    :
                    this.getStatus(orderData.status, orderData) === "Pending Removal" ?
                        "" :
                    !isHomeCustomer && this.getStatus(orderData.status, orderData) !== "Pending Action"  ?
                    <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'exchange', true)}><span><img src={ExchangeIcon} /></span> {getContainerSize(this.props.containerList, orderData.container) !== "1/2 Yard" ? "Future Exchange" : "Future Action"}</button>
                    : "" : "" }
                    {getContainerSize(this.props.containerList, orderData.container) !== "Live Load" && getContainerSize(this.props.containerList, orderData.container) !== "1/2 Yard" &&  this.getStatus(orderData.status, orderData) !== "Future Removal" && String(this.getStatus(orderData.status, orderData)).indexOf('Future Exchange') === -1  && this.getStatus(orderData.status, orderData) !== "Removed" ?
                    this.getStatus(orderData.status, orderData) === "In Use" ?
                    <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'removal', false)}><span><img src={removalIcon} /></span> Removal</button>
                    :
                    this.getStatus(orderData.status, orderData) === "Pending Removal" ?
                        ""
                    : !isHomeCustomer && <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'removal', true)}><span><img src={removalIcon} /></span> Future Removal</button>
                    : "" }
                    {this.getStatus(orderData.status, orderData) !== "Removed" && this.getStatus(orderData.status, orderData) !== "Future Removal" && String(this.getStatus(orderData.status, orderData)).indexOf('Future Exchange') === -1 ? <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'copy')}><span><img src={copyorderIcon} /></span> Copy Order</button> : "" }
                    {this.getStatus(orderData.status, orderData) !== "Removed" ? <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'edit')}><span><img src={editorderIcon} /></span> Edit Order</button> :  "" }
                    { this.getStatus(orderData.status, orderData) !== "Removed" ?
                    <button className="btn btn-dark w-180 w-half redbg font-600 font-16" onClick={this.clickOrder.bind(this, 'delete')}><span><img src={deleteorderIcon} /></span> Delete Order</button>
                    : "" }
                    {this.getStatus(orderData.status, orderData) === "Pending Removal" ?
                        <button className="btn btn-dark w-180 w-half font-600 font-16 canclbtn" onClick={this.clickOrder.bind(this, 'cancel')}><span><img src={CancelIcon} /></span> Cancel Order</button> : "" }
                    { this.getStatus(orderData.status, orderData) === "Pending Removal" ?
                        <button className="btn btn-dark w-180 w-half completbtn font-600 font-16" onClick={this.clickOrder.bind(this, 'complete', false)}><span><img src={removalIcon} /></span> Complete Order</button>
                        : ""}
                    { this.getStatus(orderData.status, orderData) === "Removed" ?
                    <button className="btn btn-dark w-180 w-half completbtn font-600 font-16" onClick={this.clickOrder.bind(this, 'complete')}><span><img src={completeorderIcon} /></span> Complete Order</button>
                    : "" }
                  </div>
                  }
              </div>
            </div>


            <ReactModal
              isOpen={this.state.openMapModal}
              onRequestClose={this.closeMapModal.bind(this)}
              ariaHideApp={false}
            >
              <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
              <div className="react-modal-header d-flex align-items-center">
                <div>
                  <h5 className="react-modal-title">View Map</h5>
                </div>
                <div className="marg-left-auto">

                  <button type="button" className="btn react-modal-close pos-static" onClick={this.closeMapModal.bind(this)}><CloseIcon /></button>
                </div>
              </div>
              <div className="divider-line"></div>

              <div className="react-modal-body">

              <div className="mapviewmodal">
                <MapComponent position={_.get(orderData, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(orderData, 'container', ''))}/>
              </div>
              </div>
              </div>
            </ReactModal>

            <DeleteModal
              deleteModelIsOpen={this.state.deletePermitModelIsOpen}
              closeModal={this.closeDeleteModal.bind(this)}
              confirmDelete={this.deletePermit.bind(this)}
              text={'permit'}
            />

            {this.state.editPermitIsOpen ?
            <EditPermitModal
              orderDetail= {_.get(this.state, 'orderDetailForEditPermit', {})}
              editPermitIsOpen = {this.state.editPermitIsOpen}
              closeEditPermitModal={this.closeEditPermitModal.bind(this)}
              containerList={_.get(this.props, 'containerList', [])}
              fetchOrderList = {this.getPermit.bind(this)}
              {...this.props}
            /> : ""}

          </ReactModal>

      </div>
    )
  }
}

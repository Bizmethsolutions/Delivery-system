import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import moment from 'moment'
import _ from "lodash"
import { Pagination, Select, message } from 'antd'

import CustomerTopNavigation from './../CustomerTopNavigation/container'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { PrintIcon, SortingNewUpIcon, SortingNewDownIcon, BackArrowIcon } from '../../components/icons'
import { formatOrderAddess, getDate } from '../../components/commonFormate'
import DatePickerRange from '../../components/date-picker-modal'
import ViewModal from './viewReport'
import EmptyComponent from '../../components/emptyComponent'
import DownloadArrow from '../../images/download.svg'
import ExportListIcon from '../../images/exportlist-icon.svg'
import DownloadReceiptsIcon from '../../images/download-receipts-icon.svg'
import LoaderGif from '../../images/loader.gif'
import './styles.scss'

const { Option } = Select

export default class ReportsComponent extends PureComponent {
  constructor(props) {
    super(props)
    let today = moment().format('MM/DD/YYYY')
    const timezone = this.props.user && this.props.user.timezone ?  this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    this.state = {
      from: today,
      to: today,
      sort_field: "orderid",
      by: -1,
      page: 0,
      limit: 10,
      statusList: [],
      containerList: [],
      daysFilter: 'today',
      textShow: `Today (${moment().format('MMM DD, YYYY')})`,
      startDate:  moment(),
      endDate: moment(),
      isExportLoaderInit: false,
      isLoaderInit: false,
      isBulkLoaderInit: false,
      resultType: '',
      receiptid: "",
      selectedDate: moment().format("MMM DD,YYYY"),
      classname: [
        {class: "red-yard", size: '10 Yard'},
        {class: "purple-yard", size: '15 Yard'},
        {class: "green-yard", size: '20 Yard'},
        {class: "yellow-yard", size: '30 Yard'},
        {class: "orange-yard", size: '1/2 Yard'},
        {class: "blue-yard", size: 'Live Load'}
      ]
    }
  }

  componentDidMount= async()=> {
    document.title = 'Results | CurbWaste'
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    let daysFilter = this.state.daysFilter
    let resultType = this.props.match.params && this.props.match.params.type ? this.props.match.params.type : "recap"
    let textShow = this.state.textShow
    if(this.props.location && this.props.location.state && this.props.location.state.daysFilter !== "today") {
      startDate = this.props.location && this.props.location.state && this.props.location.state.from
      endDate = this.props.location && this.props.location.state && this.props.location.state.to
      daysFilter = this.props.location.state.daysFilter
      textShow = this.props.location.state.textShow

    }
    this.setState({daysFilter, startDate, endDate, resultType, textShow  },()=>{
      this.fetchOrdersResults()
    })
    let  { value }  = await this.props.getContainer()
    this.setState({ statusList: value.status, containerList: value.containers })
  }

  fetchOrdersResults = async()=> {
    const { startDate , endDate, status, sort_field, by, page, limit, searchstring, searchby, resultType } = this.state
    if (resultType === "recap") {
      let data = {
        from: moment(this.state.startDate).format("MM-DD-YYYY"),
        to: moment(this.state.endDate).format("MM-DD-YYYY"),
        sort_field,
        by,
        type: resultType
      }

      if (localStorage.getItem('usertype') === 'customer') {
        let id = localStorage.getItem('userid')
        if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
          id = _.get(this.props, 'user.createdBy', undefined)
        }
        data.customerId = id
      }
      let {value} = await this.props.recapLogsResults(data)
      this.setState({ reports: value.orders })
    } else {
      let timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName  ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
      const startDate = moment(this.state.startDate).tz(timezone).format('MM/DD/YYYY')
      const endDate = moment(this.state.endDate).tz(timezone).format('MM/DD/YYYY')
      const offset = moment.tz(moment(), timezone).utcOffset()

      const obj = {
        startDate, endDate,
        All: false,
        offset:String(offset),
        sort_field,
        by,
      }
      let {value} = await this.props.getAllJobsForOrderLog(obj)
      this.setState({ reports: _.get(value, 'data.jobs', []) })
    }
  }

  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value }, ()=>{
      this.fetchOrdersResults()
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

  getDate(input) {
    if (input) {
        let date = new Date(input)
        return String(date.getUTCMonth()+1)+'/'+String(date.getUTCDate())+'/'+String(date.getUTCFullYear());
    }
  }

  getContainerSize(id) {
    if (this.state.containerList.length > 0) {
      let master = this.state.containerList
      // console.log(id);
      for (let index = 0; index < master.length; index++) {
        let element = master[index]
        if (element._id === id) {
          return element.size
        }
      }
    }
  }

  sortby(field) {
    if (this.state.sort_field === field) {
      this.state.by = this.state.by * -1;
    } else {
      this.state.sort_field = field;
      this.state.by = 1;
    }
    this.fetchOrdersResults()
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



  setStartDate (type) {
    let from = moment()
    let to = moment()
    if (type === 'today') {
      from = moment()
    }
    if (type === '7days') {
      from = moment().add(-7, 'days')
    }
    if (type === '30days') {
      from = moment().add(-30, 'days')
    }
    if (type === 'custom'){
      from = moment()
      to   = moment()
    }
    return from
  }

  handleDateChange (e) {
    let value = e.target.value
    let to = moment().format('MM/DD/YYYY')
    if (value === 'today') {
      this.setState({
        daysFilter: value,
        startDate: moment().format('MM/DD/YYYY'),
        textShow: `Today (${moment().format('MMM DD, YYYY')})`,
        endDate: moment().format('MM/DD/YYYY')
      }, ()=> {
        this.fetchOrdersResults()
      })
    } else if (value === 'week') {
      this.setState({
        daysFilter: value,
        startDate: moment().startOf('week').format('MM/DD/YYYY'),
        textShow: `This Week (${moment().startOf('week').format('MMM DD, YYYY')} - ${moment().endOf('week').format('MMM DD, YYYY')})`,
        endDate: moment().endOf('week').format('MM/DD/YYYY')
      }, ()=> {
        this.fetchOrdersResults()
      })
    } else if (value === 'month') {
      this.setState({
        daysFilter: value,
        startDate: moment().startOf('month').format('MM/DD/YYYY'),
        textShow: `This Month (${moment().startOf('month').format('MMM DD, YYYY')} - ${moment().endOf('month').format('MMM DD, YYYY')})`,
        endDate: moment().endOf('month').format('MM/DD/YYYY')
      }, ()=> {
        this.fetchOrdersResults()
      })
    } else {
      this.setState({ datePickerModal: true })
    }
  }

  onSubmitDateRanges ({ startDate, endDate }) {
    let from = startDate
    let to = endDate
    // console.log(from, to)
    this.setState({to, from, startDate, endDate , daysFilter: "custom", datePickerModal: false }, () => {
      this.setState({ textShow: `Custom ${this.getCustomDate()}`})
      this.fetchOrdersResults()
    })
  }

  getCustomDate () {
    let dataRange = ''
    if (this.state.daysFilter === 'custom') {
      dataRange = `(${moment(this.state.startDate).format('MMM DD, YYYY')} - ${moment(this.state.endDate ).format('MMM DD, YYYY')})`
    }
    return dataRange
  }

  viewReport (item) {
    this.setState({ isViewModalOpen: true, orderDataForViewModal: item})
  }

  closeModal () {
    this.setState({ isViewModalOpen: false, orderDataForViewModal: {} })
  }

  getStatus(input, order) {
    if (input && this.state.statusList) {
      let status = "";
      this.state.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      // if(status === "Future Exchange") {
      //   if(order.queue_exchange_orders && order.queue_exchange_orders.length > 0) {
      //       const _index = _.findIndex(order.queue_exchange_orders, (o) => {
      //         return String(o.id) === String(order.id)
      //       })
      //       if(_index >= 0) {
      //           status = `${status} ${_index }`
      //       }
      //       return status;
      //   }
      // } else {
      //   return status;
      // }
      return status;
    }
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

  exportList() {
    const self = this
    const orders = _.get(this.state, 'reports', [])
    if(orders.length > 0) {
      let data = []
      this.setState({ isExportLoaderInit: true }, () => {
        _.forEach(orders, function(item) {
          const status = self.getStatus(item.status, item);
          const address = self.formatAddess(item);
          data.push({
            OrderNumber: item.orderid,
            CustomerName: item.customername,
            Address: address.toString().replace(/,/g, ''),
            Container: item.containersize,
            DeliveryDate: self.getDate(item.deliverydate),
            PickupDate: (item.pickupdate ? self.getDate(item.pickupdate) : "-"),
            JobType: item.job_status,
            Status: status
          })
        })
        let csvRows = []
        let fileName = ""
        if(this.state.resultType === "log") {
          fileName = "Order-Log-List-"+self.state.selectedDate
        } else {
          fileName = "Daily-Recap-List-"+self.state.selectedDate
        }
        const headers = Object.keys(data[0])
        csvRows.push(headers.join(", "))
        for(const row of data) {
          const values = headers.map(header => {
            return row[header]
          })
          csvRows.push(values.join(", "))
        }
        csvRows = csvRows.join('\n')
        const blob = new Blob([csvRows], { type: 'text/csv'})
        const csvURL = window.URL.createObjectURL(blob);
        this.setState({ isExportLoaderInit: false})
        let a = ''
        a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', csvURL);
        a.setAttribute('download', fileName+'.csv');
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a);
      })
    }
  }

  downloadBulkReceipts(e) {
    const self = this
    const completedorder = []
    const orders = _.get(this.state, 'reports', [])
    self.setState({ isBulkLoaderInit: true }, async() => {
      _.forEach(orders, function(o) {
        let status = "";
        self.state.statusList.forEach(function (element) {
          if (o.status === element._id) {
            status = element.status
          }
        });

        if(status !== "Pending Delivery" && status !== "Future Exchange" && status !== "Future Removal" && o.job_status !== "Removal") {
          completedorder.push(o.id)
        }
      })
      try {
        const fromDate = this.state.startDate
        const toDate = this.state.endDate
        let data ={
          fromDate,
          toDate,
          completedorder
        }
        const { value } = await this.props.downloadBulkReceipts(data)
        if(value.type=== 'success') {
          const invoiceUrl = value.data.invoiceUrl
          this.setState({isBulkLoaderInit: false})
          window.open(invoiceUrl);
        } else {
          this.setState({ isBulkLoaderInit: false })
          alert(value.data && value.data.message)
        }
      } catch (e){

      }
    })
  }


  render() {
    return (
      <div className={localStorage.getItem('usertype') === 'user' ? "layout-has-sidebar" : "layout-has-sidebar-edit"}>
        { localStorage.getItem('usertype')=== 'user' ?
          <SidebarNavigation {...this.props}/>
          : ''
        }
        { localStorage.getItem('usertype')=== 'user' ?
        <TopNavigation {...this.props}/>
          :
          <CustomerTopNavigation  {...this.props}/>
        }
        <main className={localStorage.getItem('usertype') === 'user' ? "dashboard-layout-content pb-3" : "dashboard-layout-content width1033 pb-3"}>
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex align-items-center justify-content-between flex-unset-mob">
                {this.state.resultType === "recap" ?
                  <div>
                    <Link to="/dashboard" className="backbtn-dashboard for-cursor"><BackArrowIcon /> Back to Dashboard</Link>
                    <h5 className="table-title">Daily Recap</h5>
                    <span className="table-subtitle table-subtitlemob">
                        This shows the total number of orders created on {' '}
                        {this.state.daysFilter === "today" ? moment(this.state.startDate).format('MMM DD, YYYY')
                        : `${moment(this.state.startDate).format('MMM DD, YYYY')} - ${moment(this.state.endDate).format('MMM DD, YYYY')}`}
                      </span>
                  </div>
                  :
                  <div>
                    <Link to="/dashboard" className="backbtn-dashboard for-cursor"><BackArrowIcon /> Back to Dashboard</Link>
                    <h5 className="table-title">Order Log</h5>
                    <span className="table-subtitle table-subtitlemob">
                      This shows the number of Removal, Delivery, Exchange, Live Loads and minis orders during {' '}
                      {this.state.daysFilter === "today" ? moment(this.state.startDate).format('MMM DD, YYYY')
                      : `${moment(this.state.startDate).format('MMM DD, YYYY')} - ${moment(this.state.endDate).format('MMM DD, YYYY')}`}
                    </span>
                  </div>
                }
                <ul className="report-flex auto-width">
                  <li>
                    {/* <div className="form-group material-textfield material-textfield-select hidearrow w-290">
                      <Select
                        value={this.state.daysFilter}
                        onChange={this.handleDateChange.bind(this)}
                        className="form-control custom-select h-66 w-290 font-16 material-textfield-input"
                        required>
                        <Option value="today">Today ({moment().format('MMM DD, YYYY')})</Option>
                        <Option value="week">This Week ({moment().startOf('week').format('MMM DD, YYYY')} - {moment().endOf('week').format('MMM DD, YYYY')})</Option>
                        <Option value="month">This Month ({moment().startOf('month').format('MMM DD, YYYY')} - {moment().endOf('month').format('MMM DD, YYYY')})</Option>
                        <Option value="custom" onClick={() => this.setState({ datePickerModal: true })}>
                          Custom {this.getCustomDate()}
                        </Option>
                      </Select>
                      <label className="material-textfield-label">Date Range</label> */}
                      <div className="form-group material-textfield material-textfield-select">
                      <select value="" onChange={this.handleDateChange.bind(this)} className="form-control custom-select h-66 w-290 font-16 material-textfield-input auto-width">
                        <option disabled className="hideDefaultOption"></option>
                        <option value="today">Today ({moment().format('MMM DD, YYYY')})</option>
                        <option value="week">This Week ({moment().startOf('week').format('MMM DD, YYYY')} - {moment().endOf('week').format('MMM DD, YYYY')})</option>
                        <option value="month">This Month ({moment().startOf('month').format('MMM DD, YYYY')} - {moment().endOf('month').format('MMM DD, YYYY')})</option>
                        <option value="custom" onClick={() => this.setState({ datePickerModal: true })}>Custom {this.getCustomDate()}</option>
                      </select>
                      <label className="material-textfield-label">Date </label>
                      <label className=" text-value">{this.state.textShow} </label>
                      </div>
                  </li>
                </ul>
              </div>



              <div className="bothbtns">
                <span>
                  {_.get(this.state, 'reports', []).length > 0 ? <div> <button disabled={this.state.isExportLoaderInit} className="download-receipt-btn" onClick={() => { this.exportList() }}><img src={ExportListIcon} /> {this.state.isExportLoaderInit ? "Please wait..." : "Export List"}</button> </div>: ""}
                </span>
                <span>
                  {_.get(this.state, 'reports', []).length > 0 ? <div> <button disabled={this.state.isBulkLoaderInit} className="download-receipt-btn" onClick={() => { this.downloadBulkReceipts() }}><img src={DownloadReceiptsIcon} /> {this.state.isBulkLoaderInit ? "Please wait..." : "Download Receipts"}</button> </div> : ""}
                </span>
              </div>
            </div>
          </div>


            <div className="row pb-5">
            <div className="col-md-12">
                <div className="table-responsive">
                  {_.get(this.state, 'reports', []).length > 0 ?
                    <table className="table custom-table-secondary">
                      <thead>
                        <tr>
                          <th onClick={() => { this.sortby('orderid') }}>
                            <span className="custom-table-th-title-sm for-cursor">Order Number { this.getSortArrow('orderid')}</span>
                          </th>
                          <th onClick={() => { this.sortby('customername') }}>
                            <span className="custom-table-th-title-sm for-cursor">Customer Name { this.getSortArrow('customername')}</span>
                          </th>
                          <th onClick={() => { this.sortby('address') }}>
                            <span className="custom-table-th-title-sm for-cursor">Address { this.getSortArrow('address')}</span>
                          </th>
                          <th onClick={() => { this.sortby('container') }}>
                            <span className="custom-table-th-title-sm for-cursor">Product/Service { this.getSortArrow('container')}</span>
                          </th>
                          <th onClick={() => { this.sortby('deliverydate') }}>
                            <span className="custom-table-th-title-sm for-cursor">Delivery Date {this.getSortArrow('deliverydate')}</span>
                          </th>
                          <th onClick={() => { this.sortby('pickupdate') }}>
                            <span className="custom-table-th-title-sm for-cursor">Removal Date { this.getSortArrow('pickupdate')}</span>
                          </th>
                          <th onClick={() => { this.sortby('job_status') }}>
                            <span className="custom-table-th-title-sm for-cursor">Job Type { this.getSortArrow('job_status')}</span>
                          </th>
                          <th onClick={() => { this.sortby('status') }}>
                            <span className="custom-table-th-title-sm for-cursor">Status { this.getSortArrow('status')}</span>
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="table-card tablewhite">
                        {_.get(this.state, 'reports', []).map((item, i)=>{
                          const statusCheck = this.getStatus(item.status, item)
                          const status = this.getStatus(item.status, item) && (this.getStatus(item.status, item).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase()
                          const classIndex = _.findIndex(this.state.classname, (c) => {
                            return c.size === _.get(item, 'containersize', '')
                          })
                          return (
                            <tr className="for-cursor" key={i}>
                              <td onClick={this.viewReport.bind(this, item)}>
                                <span className="custom-table-title-md">{_.get(item, 'orderid', '')}</span>
                              </td>
                              <td onClick={this.viewReport.bind(this, item)}>
                                <span className="custom-table-title-md">{_.get(item, 'customername', '')}</span>
                              </td>
                              <td onClick={this.viewReport.bind(this, item)}>
                                <span className="custom-table-title-md">{this.formatAddess(item)}</span>
                              </td>
                              <td onClick={this.viewReport.bind(this, item)}>
                                {/* <span className="custom-table-title-md">{_.get(item, 'containersize', '')}</span> */}
                                <button key={i} className={classIndex !== -1 ? `${this.state.classname[classIndex].class}` : `yellow-yard`}>{_.get(item, 'containersize', '')}</button>
                              </td>
                              <td onClick={this.viewReport.bind(this, item)}>
                                <span className="custom-table-title-md">{getDate(item.deliverydate)}</span>
                              </td>
                              <td onClick={this.viewReport.bind(this, item)}>
                                <span className="custom-table-title-md">{(item.pickupdate ? getDate(item.pickupdate) : (item.completiondate ? getDate(item.completiondate) : "-"))}</span>
                              </td>
                              <td onClick={this.viewReport.bind(this, item)}>
                                <span className="custom-table-title-md">{_.get(item, 'job_status', '')}</span>
                              </td>
                              <td onClick={this.viewReport.bind(this, item)}>
                                <button className="btn-purple-fill--lg status-container" status={status}>{this.getStatus(item.status, item)}</button>
                              </td>
                              <td>
                                {(statusCheck !== "Pending Delivery" && !String(statusCheck).includes('Future Exchange') && statusCheck !== "Future Removal") ?
                                  <img className="arrow-loader" onClick={this.getDownloadReceipt.bind(this, item.id)}
                                    src={String(this.state.receiptid) === String(item.id) ? LoaderGif : DownloadArrow}
                                  />
                                : "" }
                              </td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  :
                    <EmptyComponent
                      emptyText = "No Results"
                    />
                  }

                </div>
              </div>
            </div>
            <DatePickerRange
              datePickerModal={this.state.datePickerModal}
              datePickerToggle={() => this.setState({ datePickerModal: !this.state.datePickerModal })}
              // handleSelect={({ startDate, endDate }) => this.setState({ startDate, endDate })}
              onSubmitDateRanges={(startDate, endDate) => this.onSubmitDateRanges({ startDate, endDate })}
            />
            {/* <Pagination
              className="pb-3 text-center pagination-wrapper"
              current={this.state.page + 1}
              onChange={this.onPagechange.bind(this)}
              pageSize={this.state.limit}
              hideOnSinglePage= {true}
              total={_.get(this.state, 'reportCount', 0)}
            /> */}
            { this.state.isViewModalOpen ?
              <ViewModal
                isViewModalOpen={this.state.isViewModalOpen}
                closeModal = {this.closeModal.bind(this)}
                orderData = {this.state.orderDataForViewModal}
                getContainerSize= {this.getContainerSize.bind(this)}
                getStatus = {this.getStatus.bind(this)}
                {...this.props}
              />
            : ""
            }
        </main>
      </div>
    )
  }
}

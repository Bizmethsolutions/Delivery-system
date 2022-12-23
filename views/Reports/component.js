import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

// import PropTypes from 'prop-types'
import moment from 'moment'
import _ from "lodash"
import { Pagination, Select, message } from 'antd'

import TopNavigation from './../TopNavigation/container'
import CustomerTopNavigation from './../CustomerTopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { PrintIcon, SortingNewUpIcon, SortingNewDownIcon, BackArrowIcon } from '../../components/icons'
import { formatOrderAddess } from '../../components/commonFormate'
import DatePickerRange from '../../components/date-picker-modal'
import ViewModal from './viewReport'
import EmptyComponent from '../../components/emptyComponent'
import './styles.scss'

const { Option } = Select

export default class ReportsComponent extends PureComponent {
  constructor(props) {
    super(props)
    let today = moment().format('MM/DD/YYYY')
    this.state = {
      from: today,
      to: today,
      status: '',
      sort_field: "",
      by: 1,
      page: 0,
      limit: 10,
      searchstring:'',
      searchby: '',
      statusList: [],
      containerList: [],
      reports: [],
      reportCount: 0,
      daysFilter: 'today',
      textShow: `Today (${moment().format('MMM DD, YYYY')})`,
      startDate: '',
      endDate: '',
      isViewModalOpen: '',
      orderDataForViewModal: {},
      // FOR SIDEBAR
      isSidebarOpen: false,
    }
  }

  componentDidMount= async()=> {
    document.title = 'Reports | CurbWaste'
    this.fetchOrdersReport()
    let  { value }  = await this.props.getContainer()
    this.setState({ statusList: value.status, containerList: value.containers })
  }

  fetchOrdersReport = async()=> {
    const { from , to, status, sort_field, by, page, limit, searchstring, searchby } = this.state
    let data = {
      from , to, status, sort_field, by, page, limit, searchstring, searchby
    }

    if (localStorage.getItem('usertype') === 'customer') {
      let id = localStorage.getItem('userid')
      if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
        id = _.get(this.props, 'user.createdBy', undefined)
      }
      data.customerId = id
    }
    let {value} = await this.props.fetchOrdersReport(data)
    this.setState({ reports: value.data, reportCount: value.count }, async() => {
      if(this.props.match && this.props.match.path === "/status-reports/:id"){
        const id = this.props.match.params && this.props.match.params.id
        const { getOrderByOrderId } = this.props
        // console.log(data, 'data data')
        let { value } = await getOrderByOrderId(id)
        this.setState({ isViewModalOpen: true, orderDataForViewModal: _.get(value, 'data', {})})
      }
    })

  }

  getStatusOptions() {
    if (this.state.statusList.length) {
      let options = []
      this.state.statusList.sort(function (a, b) {
          if (a.status < b.status) return -1
          if (a.status > b.status) return 1
          return 0;
      })
      options = this.state.statusList.map((node, index) => {
        let statusType = ''
        switch (node.status) {
          case "Pending Delivery":
            statusType = "Delivery Date";
            break;
          case "Pending Removal":
            statusType = "Removal Date";
            break;
          default:
            return;
        }
        return <option key={index} value={node._id}>{statusType}</option>
      })
      options = [
          <option key={-1} value=''>All</option>
      ].concat(options)
      return options
    }
  }

  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value }, ()=>{
      // this.fetchOrdersReport()
    })
  }

  onSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }   
    this.setState({ [e.target.name]: e.target.value, typingTimeout: setTimeout(() => {
        this.fetchOrdersReport()
      }, 400)
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

  onPagechange (nextPage) {
    let page = nextPage - 1
    this.setState({ page }, ()=>{
      this.fetchOrdersReport()
    })
  }

  sortby(field) {
    if (this.state.sort_field === field) {
      this.state.by = this.state.by * -1;
    } else {
      this.state.sort_field = field;
      this.state.by = 1;
    }
    // this.fetchOrdersReport()
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

  getPaymentType(selected){
    if(selected && selected.paymenttype) {
      let payment=selected.paymenttype.split('-')
      let pay = ""
      if(payment.length !== 0) {
        pay = payment[0]
        if(pay.indexOf("COD") !== -1) {
          pay = pay.replace("COD", "")
        }
        return pay
      } else {
        return payment[0]
      }
    }
  }
  getPricingType(selected){
    if (selected.pricingtype) {
      return selected.pricingtype
    } else {
      if (selected && selected.paymenttype) {
        let price=selected.paymenttype.split('-')
        return price[1]
      }
    }
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
    if (value !== 'custom') {
      let from = this.setStartDate(value)
      let today = new Date();
      if (value === 'today') {
        this.setState({
          daysFilter: value,
          today:`${(today.getMonth() + 1)}/${today.getDate()}/${today.getFullYear()}`,
          from: String(moment().format('MM/DD/YYYY')),
          to: moment().format('MM/DD/YYYY'),
          textShow: `Today (${moment().format('MMM DD, YYYY')})` }, () => {
            // this.fetchOrdersReport()
          })
      } else if (value === 'week') {
        this.setState({
          daysFilter: value,
          from: moment().startOf('week').format('MM/DD/YYYY'),
          to: moment().endOf('week').format('MM/DD/YYYY'),
          textShow: `This Week (${moment().startOf('week').format('MMM DD, YYYY')} - ${moment().endOf('week').format('MMM DD, YYYY')})`,
        }, () => {
          // this.fetchOrdersReport()
        })
      }  else if (value === 'month') {
        this.setState({
          daysFilter: value,
          from: String(moment().startOf('month').format('MM/DD/YYYY')),
          to: String(moment().endOf('month').format('MM/DD/YYYY')),
          textShow: `This month (${moment().startOf('month').format('MMM DD, YYYY')} - ${moment().endOf('month').format('MMM DD, YYYY')})`,
        }, () => {
          // this.fetchOrdersReport()
        })
      }
    } else {
      this.setState({ datePickerModal: true })
    }
  }

  onSubmitDateRanges ({ startDate, endDate }) {
    let from = startDate
    let to = endDate
    this.setState({to, from, startDate,endDate, daysFilter: "custom", datePickerModal: false }, () => {
      this.setState({ textShow: `Custom ${this.getCustomDate()}`})
      this.fetchOrdersReport()
    })
  }

  getCustomDate () {
    let dataRange = ''
    if (this.state.daysFilter === 'custom') {
      dataRange = `(${moment(this.state.startDate).format('MMM DD, YYYY')} - ${moment(this.state.endDate ).format('MMM DD, YYYY')})`
    }
    return dataRange
  }

  exportData = async(type)=> {
    if (type=== 'export') {
      const { from , to, status, searchstring, searchby } = this.state

      let data = {
        from , to, status, searchstring, searchby, email: _.get(this.props, 'user.email', '')
      }

      if (localStorage.getItem('usertype') === 'customer') {
        let id = localStorage.getItem('userid')
        if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
          id = _.get(this.props, 'user.createdBy', undefined)
        }
        data.customerId = id
      }

      try {
        let { value } = await this.props.exportreport(data)
        if (value.type === "success") {
          // let timeStamp = Math.floor(Date.now() / 1000);
          // let name = `Curbside-Report-${timeStamp}.xlsx`;
          // const save = document.createElement('a')
          // save.href = `${value.data.url}`
          // save.target = '_blank'
          // save.download = name
          // save.setAttribute('download', name);
          // document.body.appendChild(save)
          // save.click()
          message.success(value.message)
          this.setState({ export : '' })
        }
      } catch(e){
        // console.log(e)
      }
    } else {
      if (type=== 'exportAllData') {
        let data = {
          useremail: _.get(this.props, 'user.email', '')
        }
        if (localStorage.getItem('usertype') === 'customer') {
          let id = localStorage.getItem('userid')
          if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
            id = _.get(this.props, 'user.createdBy', undefined)
          }
          data.customerId = id
        }

        let { value }  = await this.props.exportall(data)
        if (value.type ==='success') {
          message.success(value.message)
          this.setState({ export : '' })
        }
      }
    }
  }

  viewReport (item) {
    this.props.history.push(`/status-reports/${item.orderid}`)
    this.setState({ isViewModalOpen: true, orderDataForViewModal: item})
  }

  closeModal () {
    this.props.history.push(`/status-reports`)
    this.setState({ isViewModalOpen: false, orderDataForViewModal: {} })
  }

  // FOR SIDEBAR
  toggleSidebar = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen })
  }

  runReport() {
    this.fetchOrdersReport()
  }

  clearfilter() {
    let today = moment().format('MM/DD/YYYY')
    this.setState({
      from: today,
      to: today,
      status: '',
      sort_field: "",
      by: 1,
      showpopup: false,
      page: 0,
      limit: 10,
      searchby: '',
      searchstring: '',
      loading: false,
      daysFilter: 'today',
      textShow: `Today (${moment().format('MMM DD, YYYY')})`,
      startDate: '',
      endDate: '',
    }, () => {
        this.fetchOrdersReport()
    })
  }

  render() {
    // FOR SIDEBAR
    const { isSidebarOpen } = this.state
    return (
      <div className={localStorage.getItem('usertype') === 'user' ? "layout-has-sidebar" : "layout-has-sidebar-edit"}>
      <section className="noprint" >
        { localStorage.getItem('usertype')=== 'user' ?
          <SidebarNavigation isSidebarOpen={isSidebarOpen} user={this.props.user} {...this.props} />
          : ''
        }
        { localStorage.getItem('usertype')=== 'user' ?
          <TopNavigation isSidebarOpen={isSidebarOpen} toggleSidebar={this.toggleSidebar} {...this.props}/>
          :
          <CustomerTopNavigation  {...this.props}/>
        } </section>
        <main className={localStorage.getItem('usertype') === 'user' ? "dashboard-layout-content pb-3" : "dashboard-layout-content width1033 pb-3"}>
        {/* <main className="dashboard-layout-content"> */}
        <div className="btn-back-header">
          <Link to="/reports" className="backbtn-dashboard cursor-pointer"><BackArrowIcon /> Back to Reports</Link>
        </div>
        <section className="noprint" >
          <div className="row mb48 noprint">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob tab980">
                <div>
                  <h5 className="table-title">Status Reports</h5>
                  <h6 className="heading-sub-sup"><span>{this.state.reportCount}</span> Orders</h6>
                </div>


                <div className="ml-auto dflex-mobile">
                  <div className="form-group material-textfield material-textfield-select dis-inline">
                    { _.get(this.state, 'reports', []).length > 0 ?
                        <button className="btn btn-dark w-150 font-600 font-16 full-mob" onClick={this.exportData.bind(this,'export')}>
                        Export
                      </button>
                    : ""
                    }
                    {localStorage.getItem('usertype') !== 'customer' ? 
                      <button className="btn btn-dark w-150 font-600 font-16 full-mob margin--left" onClick={this.exportData.bind(this, 'exportAllData')}>
                      Export All Data
                    </button> : '' }
                      <button className="btn btn-dark w-150 font-600 font-16 full-mob margin--left" onClick={this.clearfilter.bind(this)}>
                      Reset Filter
                    </button>
                    {/* <select
                      className="form-control custom-select w-180 font-16 material-textfield-input h-54"
                      onChange={this.exportData.bind(this)}
                      value={this.state.export}
                      name='export'
                      required>
                      <option>Please select </option>
                      {_.get(this.state, 'reports', []).length > 0 ?
                      <option value="export">Export</option> : "" }
                      <option value="exportAllData">Export All Data</option>
                    </select>
                    <label className="material-textfield-label">Export</label> */}
                  
                  { _.get(this.state, 'reports', []).length > 0 ?
                        <button onClick={() => { window.print() }} className="btn btn-dark w-130 font-600 font-16 icon-mr-1 full-mob margin--left">
                      <PrintIcon /> Print
                    </button>
                    : ""
                  }
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row noprint">
            <div className="col-md-12">
              <div className="d-flex align-items-center">
                  <ul className="report-flex report-flex-report moblie100">
                  <li>
                  <div className="form-group material-textfield material-textfield-select">
                    <select value="" onChange={this.handleDateChange.bind(this)} className="form-control custom-select h-66 w-290 font-16 material-textfield-input">
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
                  <li>
                    <div className="form-group material-textfield material-textfield-select">
                      <select className="form-control custom-select w-180 font-16 h-66 material-textfield-input" value={this.state.status} name="status" onChange={ this.onHandleChange.bind(this)} >
                        {this.getStatusOptions()}
                      </select>
                      <label className="material-textfield-label">Order Date Filter </label>
                    </div>
                  </li>
                  <li>
                    <div className="form-group material-textfield material-textfield-select">
                        <select className="form-control custom-select w-150 font-16 h-66 w-150 material-textfield-input"
                        value={this.state.searchby}
                        name="searchby"
                        onChange={ this.onHandleChange.bind(this)}
                        >
                        {/* <option></option> */}
                        <option value=''>All</option>
                        <option value='customer'>Customer</option>
                        <option value='location'>Location</option>
                      </select>
                      <label className="material-textfield-label">Search by</label>
                    </div>
                  </li>
                  <li>
                    <input
                        className="form-control h-66 w-150"
                      placeholder="Search Here..."
                      value={this.state.searchstring}
                      name="searchstring"
                      onChange={this.onSearch.bind(this)}
                    />
                  </li>
                </ul>
              </div>

              <div className="text-right">
                <button className="btn btn-dark w-150 font-600 font-16 full-mob mb-3" onClick={() => this.runReport()}>
                  Run Report
                </button>
              </div>

            </div>
          </div>
          </section>
            <div className="row pb-5">
            <div className="col-md-12">
                <div className="table-responsive">
                  {_.get(this.state, 'reports', []).length > 0 ?
                    <table className="table custom-table-secondary">
                      <thead>
                        <tr>
                          <th onClick={() => { this.sortby('deliverydate') }}>
                            <span className="custom-table-th-title-sm for-cursor">Delivery Date {this.getSortArrow('deliverydate')}</span>
                          </th>
                          <th onClick={() => { this.sortby('orderid') }}>
                            <span className="custom-table-th-title-sm for-cursor">Order Number { this.getSortArrow('orderid')}</span>
                          </th>
                          <th onClick={() => { this.sortby('customer') }}>
                            <span className="custom-table-th-title-sm for-cursor">Company { this.getSortArrow('customer')}</span>
                          </th>
                          <th onClick={() => { this.sortby('address') }}>
                            <span className="custom-table-th-title-sm for-cursor">Location { this.getSortArrow('address')}</span>
                          </th>
                          <th onClick={() => { this.sortby('container') }}>
                            <span className="custom-table-th-title-sm for-cursor">Container Size { this.getSortArrow('container')}</span>
                          </th>
                          <th onClick={() => { this.sortby('permit') }}>
                            <span className="custom-table-th-title-sm for-cursor">Permit { this.getSortArrow('permit')}</span>
                          </th>
                          <th onClick={() => { this.sortby('paymenttype') }}>
                            <span className="custom-table-th-title-sm for-cursor">Payment Type { this.getSortArrow('paymenttype')}</span>
                          </th>
                          <th onClick={() => { this.sortby('pricingtype') }}>
                            <span className="custom-table-th-title-sm for-cursor">Pricing Type { this.getSortArrow('pricingtype')}</span>
                          </th>
                          <th onClick={() => { this.sortby('consumercost') }}>
                            <span className="custom-table-th-title-sm for-cursor">Price { this.getSortArrow('consumercost')}</span>
                          </th>
                          <th onClick={() => { this.sortby('haular.companyname') }}>
                            <span className="custom-table-th-title-sm for-cursor">Hauler { this.getSortArrow('haular.companyname')}</span>
                          </th>
                          <th onClick={() => { this.sortby('pickupdate') }}>
                            <span className="custom-table-th-title-sm for-cursor">Removal Date { this.getSortArrow('pickupdate')}</span>
                          </th>
                          <th onClick={() => { this.sortby('dump.companyname') }}>
                            <span className="custom-table-th-title-sm for-cursor"> Dump Site {this.getSortArrow('dump.companyname')}</span>
                          </th>
                          <th onClick={() => { this.sortby('dumpticketnumber') }}>
                            <span className="custom-table-th-title-sm for-cursor"> Dump Ticket Number {this.getSortArrow('dumpticketnumber')}</span>
                          </th>
                          <th onClick={() => { this.sortby('weight') }}>
                            <span className="custom-table-th-title-sm for-cursor">Weight (tons){this.getSortArrow('weight')}</span>
                          </th>
                          <th onClick={() => { this.sortby('dumpcost') }}>
                            <span className="custom-table-th-title-sm for-cursor">Dump Cost{this.getSortArrow('dumpcost')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.waste') }}>
                            <span className="custom-table-th-title-sm for-cursor">Waste % (tons) {this.getSortArrow('sustainabilityinformation.waste')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.brick') }}>
                            <span className="custom-table-th-title-sm for-cursor">Brick % (tons) {this.getSortArrow('sustainabilityinformation.brick')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.dirt') }}>
                            <span className="custom-table-th-title-sm for-cursor">Dirt % (tons) {this.getSortArrow('sustainabilityinformation.dirt')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.concrete') }}>
                            <span className="custom-table-th-title-sm for-cursor">Concrete % (tons) {this.getSortArrow('sustainabilityinformation.concrete')}</span>
                          </th>

                          <th onClick={() => { this.sortby('sustainabilityinformation.cleanwood') }}>
                            <span className="custom-table-th-title-sm for-cursor">Wood % (tons) {this.getSortArrow('sustainabilityinformation.cleanwood')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.metal') }}>
                            <span className="custom-table-th-title-sm for-cursor">Metal % (tons) {this.getSortArrow('sustainabilityinformation.metal')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.paper_cardboard') }}>
                            <span className="custom-table-th-title-sm for-cursor">Paper/Cardboard % (tons) {this.getSortArrow('sustainabilityinformation.paper_cardboard')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.plastic') }}>
                            <span className="custom-table-th-title-sm for-cursor">Plastic % (tons) {this.getSortArrow('sustainabilityinformation.plastic')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.asphalt') }}>
                            <span className="custom-table-th-title-sm for-cursor">Asphalt % (tons) {this.getSortArrow('sustainabilityinformation.asphalt')}</span>
                          </th>

                          <th onClick={() => { this.sortby('sustainabilityinformation.drywall') }}>
                            <span className="custom-table-th-title-sm for-cursor">Drywall % (tons) {this.getSortArrow('sustainabilityinformation.drywall')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.glass') }}>
                            <span className="custom-table-th-title-sm for-cursor">Glass % (tons){this.getSortArrow('sustainabilityinformation.glass')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.totalpercentage') }}>
                            <span className="custom-table-th-title-sm for-cursor">Total % (tons) {this.getSortArrow('sustainabilityinformation.totalpercentage')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.recyclingpercentage') }}>
                            <span className="custom-table-th-title-sm for-cursor">Recycling % (tons){this.getSortArrow('sustainabilityinformation.recyclingpercentage')}</span>
                          </th>
                          <th onClick={() => { this.sortby('sustainabilityinformation.residualpercentage') }}>
                            <span className="custom-table-th-title-sm for-cursor">Residual % (tons){this.getSortArrow('sustainabilityinformation.residualpercentage')}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="table-card tablewhite">
                        {_.get(this.state, 'reports', []).map((item, i)=>{
                          let wastevalue, brickvalue, dirtvalue, concretevalue,drywallvalue, cleanwoodvalue, metalvalue, papervalue, plasticvalue, glassvalue, asphaltvalue = ''
                          if(item.sustainabilityinformation && item.sustainabilityinformation.tonnagepercentage) {
                            wastevalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "waste"
                            })
                            brickvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "brick"
                            })
                            dirtvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "dirt"
                            })
                            concretevalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "concrete"
                            })
                            cleanwoodvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "cleanwood"
                            })
                            metalvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "metal"
                            })
                            papervalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "paper_cardboard"
                            })
                            plasticvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "plastic"
                            })
                            glassvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "glass"
                            })
                            asphaltvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "asphalt"
                            })
                            drywallvalue = _.find(item.sustainabilityinformation.tonnagepercentage, function(tonnage) {
                                return tonnage.key === "drywall"
                            })
                          }
                          return (
                            <tr className="for-cursor" key={i} onClick={this.viewReport.bind(this, item)}>
                              <td>
                                <span className="custom-table-title-md">{this.getDate(item.deliverydate)}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{_.get(item, 'orderid', '')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{_.get(item, 'customer.companyname', '')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{this.formatAddess(item)}</span>
                              </td>

                              <td>
                                <span className="custom-table-title-md">{this.getContainerSize(item.container)}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{item.permit === true ? 'Yes' : 'No'} </span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{item.paymenttype ? this.getPaymentType(item) : ''} </span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{item.paymenttype ? this.getPricingType(item) : ''} </span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">${_.get(item, 'consumercost', '')} </span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{_.get(item, 'haular.company_name', '')} </span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{this.getDate(item.pickupdate) ? this.getDate(item.pickupdate) : '-'}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{_.get(item, 'dump.companyname', '')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{_.get(item, 'dumpticketnumber', '')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{_.get(item, 'weight', '')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{_.get(item, 'dumpcost', '')}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{wastevalue !== '' && wastevalue ? Math.round(wastevalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{brickvalue !== '' && brickvalue ? Math.round(brickvalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{dirtvalue !== '' && dirtvalue? Math.round(dirtvalue.value) : '' }</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{concretevalue !== '' && concretevalue ? Math.round(concretevalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{cleanwoodvalue !== '' && cleanwoodvalue ? Math.round(cleanwoodvalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{metalvalue !== '' && metalvalue ? Math.round(metalvalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{papervalue !== '' && papervalue ? Math.round(papervalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{plasticvalue !== '' && plasticvalue ? Math.round(plasticvalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{asphaltvalue !== '' && asphaltvalue? Math.round(asphaltvalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{drywallvalue !== '' && drywallvalue? Math.round(drywallvalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{glassvalue !== '' && glassvalue ? Math.round(glassvalue.value) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{item.sustainabilityinformation && item.sustainabilityinformation.totalpercentage ? Math.round(item.sustainabilityinformation.totalpercentage) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{item.sustainabilityinformation && item.sustainabilityinformation.recyclingpercentage ? Math.round(item.sustainabilityinformation.recyclingpercentage) : ''}</span>
                              </td>
                              <td>
                                <span className="custom-table-title-md">{item.sustainabilityinformation && item.sustainabilityinformation.residualpercentage ? Math.round(item.sustainabilityinformation.residualpercentage) : ''}</span>
                              </td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  :
                    <EmptyComponent
                      emptyText = "No Reports"
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
            <Pagination
            className="pb-3 text-center pagination-wrapper w-100 mt-3"
              current={this.state.page + 1}
              onChange={this.onPagechange.bind(this)}
              pageSize={this.state.limit}
              hideOnSinglePage= {true}
              total={_.get(this.state, 'reportCount', 0)}
            />
            { this.state.isViewModalOpen ?
              <ViewModal
                isViewModalOpen={this.state.isViewModalOpen}
                closeModal = {this.closeModal.bind(this)}
                orderData = {this.state.orderDataForViewModal}
                getContainerSize= {this.getContainerSize.bind(this)}
                {...this.props}
              />
            : ""
            }
        </main>
      </div>
    )
  }
}

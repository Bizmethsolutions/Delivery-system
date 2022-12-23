import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import moment from 'moment'
import _ from "lodash"
import { Pagination, Select, message } from 'antd'

import TopNavigation from './../TopNavigation/container'
import CustomerTopNavigation from './../CustomerTopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { PrintIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../components/icons'
import { formatOrderAddess } from '../../components/commonFormate'
import DatePickerRange from '../../components/date-picker-modal'
import ViewModal from './viewReport'
import ArrowRight from "./../../images/arrow_right.svg";

import EmptyComponent from '../../components/emptyComponent'
import './styles.scss'

const { Option } = Select

export default class ReportsMainComponent extends PureComponent {
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
      if(this.props.match && this.props.match.path === "/reports/:id"){
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
    this.props.history.push(`/reports/${item.orderid}`)
    this.setState({ isViewModalOpen: true, orderDataForViewModal: item})
  }

  closeModal () {
    this.props.history.push(`/reports`)
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
        <main className={localStorage.getItem('usertype') === 'user' ? "dashboard-layout-content pb-3 dashboard__wrapper" : "dashboard-layout-content width1033 pb-3 dashboard-layout-content pb-3 dashboard__wrapper"}>
        {/* <main className="dashboard-layout-content"> */}
        <section className="noprint" >
          <div className="row mb-48 noprint">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob tab980">
                <div>
                  <h5 className="heading-title">Reports</h5>
                </div>
              </div>
              {localStorage.getItem('usertype' ) !== "customers" ?
          <div className="order__section">
            <div className="row">
              <div className="col-md-12">
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <ul className="order__list">
                  <li className="card order__item" onClick={() => this.props.history.push("/services-report")}>
                    <div className="d-flex align-items-center">
                      <div>
                        <h3 className="order__title">
                          { localStorage.getItem('usertype')=== 'user' ? "Services Report" : "Services Report" }
                        </h3>
                      </div>
                    </div>
                    <div className="order__count">
                      <img className="img-fluid" src={ArrowRight} alt="" />
                    </div>
                  </li>
                  <li className="card order__item" onClick={() => this.props.history.push("/yardage-report")}>
                    <div className="d-flex align-items-center">
                      <div>
                        <h3 className="order__title">
                          { localStorage.getItem('usertype')=== 'user' ? "Yardage Report" : "Yardage Report" }
                        </h3>
                      </div>
                    </div>
                    <div className="order__count">
                      <img className="img-fluid" src={ArrowRight} alt="" />
                    </div>
                  </li>

                  <li className="card order__item" onClick={() => this.props.history.push("/sustainability-report")}>
                    <div className="d-flex align-items-center">
                      <div>
                        <h3 className="order__title">
                          { localStorage.getItem('usertype')=== 'user' ? "Sustainability Details" : "Sustainability Details" }
                        </h3>
                      </div>
                    </div>
                    <div className="order__count">
                      <img className="img-fluid" src={ArrowRight} alt="" />
                    </div>
                  </li>
                  <li className="card order__item" onClick={() => this.props.history.push("/tonnage-report")}>
                    <div className="d-flex align-items-center">
                      <div>
                        <h3 className="order__title">
                        { localStorage.getItem('usertype')=== 'user' ? "Tonnage Report" : "Tonnage Report" }
                        </h3>
                      </div>
                    </div>
                    <div className="order__count">
                      <img className="img-fluid" src={ArrowRight} alt="" />
                    </div>
                  </li>
                  <li className="card order__item" onClick={() => this.props.history.push("/sustainability-summary")}>
                    <div className="d-flex align-items-center">
                      <div>
                        <h3 className="order__title">
                        { localStorage.getItem('usertype')=== 'user' ? "Sustainability Summary" : "Sustainability Summary" }
                        </h3>
                      </div>
                    </div>
                    <div className="order__count">
                      <img className="img-fluid" src={ArrowRight} alt="" />
                    </div>
                  </li>
                  { localStorage.getItem('usertype')=== 'user' ?
                  <li className="card order__item" onClick={() => this.props.history.push("/status-reports")}>
                    <div className="d-flex align-items-center">
                      <div>
                        <h3 className="order__title">
                        { localStorage.getItem('usertype')=== 'user' ? "Curbside Status Report" : "Curbside Status Report" }
                        </h3>
                      </div>
                    </div>
                    <div className="order__count">
                      <img className="img-fluid" src={ArrowRight} alt="" />
                    </div>
                  </li> : "" }
                </ul>
              </div>
            </div>
          </div> : "" }
            </div>
          </div>
          </section>
        </main>
      </div>
    )
  }
}

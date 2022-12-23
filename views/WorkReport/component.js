import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import moment from 'moment'
import _ from "lodash"
import $ from 'jquery'
import { Pagination, Select, message, Popover, Button } from 'antd'
import YearPicker from "react-year-picker";
import DatePicker from "react-datepicker";

import Services from './partials/services'
import Tonnage from './partials/tonnage'
import Yardage from './partials/yardage'
import Substantiability from './partials/substantiability'
import SubstantiabilitySummary from './partials/substantiabilitySummary'
import CustomerTopNavigation from './../CustomerTopNavigation/container'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import { PrintIcon, SortingNewUpIcon, SortingNewDownIcon, BackArrowIcon,ExportIcon } from '../../components/icons'
import { formatOrderAddess, getDate } from '../../components/commonFormate'
import DatePickerRange from '../../components/date-picker-modal'
import EmptyComponent from '../../components/emptyComponent'
import ExportListIcon from '../../images/exportlist-icon.svg'
import FilterIcon from './../../images/filter-icon.svg'
import './styles.scss'


const dateFormat = 'MM/DD/YYYY'

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
      limit: 100,
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
      loadervisible: false,
      searchstring: "",
      selectedDate: moment().format("MMM DD,YYYY"),
      classname: [
        {class: "red-yard", size: '10 Yard'},
        {class: "purple-yard", size: '15 Yard'},
        {class: "green-yard", size: '20 Yard'},
        {class: "yellow-yard", size: '30 Yard'},
        {class: "orange-yard", size: '1/2 Yard'},
        {class: "blue-yard", size: 'Live Load'}
      ],
      visible: false,
      filterKeys: [],
      customerList: [],
      customerSearchString: '',
      customerChecked: false,
      locationChecked: false,
      customerArray: [],
      locationArray: [],
      locationAddress: [],
      ordersForLocation: [],
      poChecked: false,
      po: '',
      reports: [],
      newstartDate: new Date(),
      year: 2020,
      reportCount: 0,
      locationSearchString: ''
    }
    this.yearChange = this.yearChange.bind(this)
  }

  componentDidMount= async()=> {
    document.title = 'Reports | CurbWaste'
    // let startDate = this.state.startDate
    // let endDate = this.state.endDate
    // let daysFilter = this.state.daysFilter
    // let resultType = this.props.match.params && this.props.match.params.type ? this.props.match.params.type : "recap"
    // let textShow = this.state.textShow
    // if(this.props.location && this.props.location.state) {
    //   startDate = this.props.location && this.props.location.state && this.props.location.state.from
    //   endDate = this.props.location && this.props.location.state && this.props.location.state.to
    //   daysFilter = this.props.location.state.daysFilter
    //   textShow = this.props.location.state.textShow
    //
    // }
    // this.setState({daysFilter, startDate, endDate, resultType, textShow  },()=>{
    //   this.fetchOrdersResults()
    // })
    this.setState({ loadervisible: true })
    this.fetchOrdersForLocation()
    await this.fetchCustomers()
    this.fetchOrdersResults()
    let  { value }  = await this.props.getContainer()
    this.setState({ statusList: value.status, containerList: value.containers })
  }

  fetchCustomers = async()=> {
    let data = {
      search_string: this.state.customerSearchString,
      //limit: 20,
      by: 1,
      //page: 0,
      sort: 'companyname'
    }
    let { value } = await this.props.fetchCustomers(data)
    this.setState({
      customerList: _.get(value, 'customers', [])
    })
  }

  fetchOrdersForLocation =async ()=> {
    const currentLocation = this.props.location.pathname
    let type = ''
    if (currentLocation === '/services-report' ) {
      type = "services"
    }
    if (currentLocation === '/yardage-report' ) {
      type = "yardage"
    }
    if (currentLocation === '/sustainability-report' ) {
      type = "sustainability"
    }
    
    if (currentLocation === '/tonnage-report' ) {
      type = "tonnage"
    }
    let data = {
      from: moment(this.state.startDate).format("MM-DD-YYYY"),
      to: moment(this.state.endDate).format("MM-DD-YYYY"),
      type,
      searchstring: this.state.locationSearchString
    }

    if (localStorage.getItem('usertype') === 'customer') {
      let id = localStorage.getItem('userid')
      if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
        id = _.get(this.props, 'user.createdBy', undefined)
      }
      data.customerId = id
    }
    if (currentLocation === '/sustainability-summary' ) {
      let data = {
        search_string: this.state.customerSearchString,
        filterstring: "customer",
        customerIds: this.state.customerArray,
        //limit: 20,
        by: 1,
        from:'01-01-' + String(this.state.year),
        to:'12-31-' + String(this.state.year),
        //page: 0,
        sort: 'companyname'
      }
      let { value } = await this.props.getCompanyOrders(data)
      const uiqueOrder = await this.getUnique(_.get(value, 'data', []), 'new_address')
      this.setState({ ordersForLocation: uiqueOrder })
    } else {
      if (this.state.customerChecked) {
        data.filterstring = "customer"
        data.customerIds = this.state.customerArray
      }
      let {value} = await this.props.dashreports(data)
      const uiqueOrder = await this.getUnique(_.get(value, 'data', []), 'new_address')
      this.setState({ ordersForLocation: uiqueOrder })
    }
    
  }

  getUnique(arr, comp) {
    // store the comparison  values in array
    const unique =  arr.map(e => e[comp])
    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the false indexes & return unique objects
    .filter((e) => arr[e]).map(e => arr[e]);
   return unique;
  }
  fetchOrdersResultsSort(by, field) {
    this.setState({ by, sort_field: field }, () => {
      this.fetchOrdersResults()
    })    
  }
  fetchOrdersResults = async()=> {
    const { startDate , endDate, status, sort_field, by, page, limit, searchstring, searchby, resultType } = this.state
    const currentLocation = this.props.location.pathname
    let type = ''
    if (currentLocation === '/services-report' ) {
      type = "services"
    }
    if (currentLocation === '/yardage-report' ) {
      type = "yardage"
    }
    if (currentLocation === '/sustainability-report' ) {
      type = "sustainability"
    }
    if (currentLocation === '/tonnage-report' ) {
      type = "tonnage"
    }
    if (currentLocation === '/sustainability-summary' ) {
      this.state.startDate = '01-01-' + String(this.state.year)
      this.state.endDate = '12-31-' + String(this.state.year)
      type = "sustainabilitysummary"
    }
    let data = {
      from: moment(this.state.startDate).format("MM-DD-YYYY"),
      to: moment(this.state.endDate).format("MM-DD-YYYY"),
      sort_field,
      by,
      type,
      limit: limit,
      searchstring: searchstring
    }
    if (this.state.customerChecked) {
      data.filterstring = "customer"
      data.customerIds = this.state.customerArray
    }
    if (this.state.locationChecked) {
      data.filterstring = "location"
      // data.customerIds = this.state.locationArray
      data.location = this.state.locationAddress
    }
    if (this.state.poChecked && this.state.po !== "") {
      data.filterstring = this.state.po
      data.filterby = "PO"
      //data.customerIds = []
    }

    if (localStorage.getItem('usertype') === 'customer') {
      let id = localStorage.getItem('userid')
      if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
        id = _.get(this.props, 'user.createdBy', undefined)
      }
      data.customerId = id
    }
    this.setState({ loadervisible: true })
    let {value} = await this.props.dashreports(data)
    this.setState({ loadervisible: false })
    this.setState({ reports: value.data, reportCount: value.count, calculation: _.get(value, 'obj', '') ,
      dumpsterYardage: _.get(value, 'dumpsterYardage', ''),
      miniYardage: _.get(value, 'miniYardage', ''),
      looseYardage: _.get(value, 'looseYardage', ''),
      liveloadYardage: _.get(value, 'liveloadYardage', ''),
      totalYardage: _.get(value, 'totalYardage', ''),
      tonnage: _.get(value, 'tonnage', '')},()=>{
      this.forceUpdate()
    })
  }

  onHandleChange (e) {
    if (e.target.name !== "po") {
      this.setState({ [e.target.name]: e.target.value }, ()=>{
        this.fetchOrdersResults()
      })
    } else {
      this.setState({ [e.target.name]: e.target.value })
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

  getDate(input) {
    if (input) {
        let date = new Date(input)
        return String(date.getUTCMonth()+1)+'/'+String(date.getUTCDate())+'/'+String(date.getUTCFullYear());
    }
  }

  getContainerSize(id) {
    if (this.state.containerList.length > 0) {
      let master = this.state.containerList
      for (let index = 0; index < master.length; index++) {
        let element = master[index]
        if (element._id === id) {
          return String(element.size).replace('Yard', '')
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

  address (customer) {
    let data = {
      address: _.get(customer, 'streetname', ''),
      city: _.get(customer, 'townname', ''),
      state: _.get(customer, 'state', ''),
      zipcode: _.get(customer, 'zipcode', ''),
      borough: _.get(customer, 'borough', ''),
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
  yearChange(date) {
    const d = moment(new Date(date)).format('YYYY')
    this.setState({ loadervisible: true })
    this.setState({ year: d, newstartDate: date }, () => {
      this.fetchOrdersResults()
    })
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
        this.fetchOrdersForLocation()
      })
    } else if (value === 'week') {
      this.setState({
        daysFilter: value,
        startDate: moment().startOf('week').format('MM/DD/YYYY'),
        textShow: `This Week (${moment().startOf('week').format('MMM DD, YYYY')} - ${moment().endOf('week').format('MMM DD, YYYY')})`,
        endDate: moment().endOf('week').format('MM/DD/YYYY')
      }, ()=> {
        this.fetchOrdersResults()
        this.fetchOrdersForLocation()
      })
    } else if (value === 'month') {
      this.setState({
        daysFilter: value,
        startDate: moment().startOf('month').format('MM/DD/YYYY'),
        textShow: `This Month (${moment().startOf('month').format('MMM DD, YYYY')} - ${moment().endOf('month').format('MMM DD, YYYY')})`,
        endDate: moment().endOf('month').format('MM/DD/YYYY')
      }, ()=> {
        this.fetchOrdersResults()
        this.fetchOrdersForLocation()
      })
    } else {
      this.setState({ datePickerModal: true })
    }
  }

  onSubmitDateRanges ({ startDate, endDate }) {
    let from = startDate
    let to = endDate
    this.setState({to, from, startDate, endDate , daysFilter: "custom", datePickerModal: false }, () => {
      this.setState({ textShow: `Custom ${this.getCustomDate()}`})
      this.fetchOrdersResults()
      this.fetchOrdersForLocation()
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

  exportList = async() => {
    const self = this
    this.setState({ loadervisible: true })
    const orders = _.get(this.state, 'reports', [])
    if(orders.length > 0) {
      let data = []
      const currentLocation = this.props.location.pathname
      this.setState({ isExportLoaderInit: true }, async () => {
        const { startDate , endDate, status, sort_field, by, page, limit, searchstring, searchby, resultType } = this.state
        const currentLocation = this.props.location.pathname
        let type = ''
        if (currentLocation === '/services-report' ) {
          type = "services"
        }
        if (currentLocation === '/yardage-report' ) {
          type = "yardage"
        }
        if (currentLocation === '/sustainability-report' ) {
          type = "sustainability"
        }
        if (currentLocation === '/sustainability-summary' ) {
          this.state.startDate = '01-01-' + String(this.state.year)
          this.state.endDate = '12-31-' + String(this.state.year)
          type = "sustainabilitysummary"
        }
        if (currentLocation === '/tonnage-report' ) {
          type = "tonnage"
        }
        let data = {
          from: moment(this.state.startDate).format("MM-DD-YYYY"),
          to: moment(this.state.endDate).format("MM-DD-YYYY"),
          sort_field,
          by,
          type,
          limit: limit,
          exporttype: 'excel',
          email: _.get(this.props, 'user.email', ''),
          searchstring: searchstring
        }
        if (this.state.customerChecked) {
          data.filterstring = "customer"
          data.customerIds = this.state.customerArray
        }
        if (this.state.locationChecked) {
          data.filterstring = "location"
          // data.customerIds = this.state.locationArray
          data.location = this.state.locationAddress
        }
        if (this.state.poChecked) {
          data.filterstring = this.state.po
          data.filterby = "PO"
          //data.customerIds = []
        }

        if (localStorage.getItem('usertype') === 'customer') {
          let id = localStorage.getItem('userid')
          if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
            id = _.get(this.props, 'user.createdBy', undefined)
          }
          data.customerId = id
        }
        data.to = moment(this.state.endDate).format('MM/DD/YYYY')
        data.from = moment(this.state.startDate).format('MM/DD/YYYY')
        data.companyname = _.get(this.props, 'user.companyInfo.companyname', '')
          let {value} = await this.props.exportdashreports(data)
          if(value && value.data !== "") {
            window.open(value.data)
          } else {
            message.success(value.message)
          }
          this.setState({ loadervisible: false })
        // _.forEach(orders, function(item) {
        //   const status = self.getStatus(item.status, item);
        //   const address = self.formatAddess(item);
        //   if (currentLocation !== '/sustainability-report' ) {
        //     let datatable = {
        //       //CompanyName: _.get(item,'customer.companyname', ''),
        //       DeliveryDate: self.getDate(item.deliverydate),
        //       OrderNumber: _.get(item,'orderid', ''),
        //       Location: address.toString().replace(/,/g, ''),
        //       PO: _.get(item,'purchaseordernumber', ''),
        //       Container: item.containersize,
        //       LiveLoadYardage: item.live_load_yard && item.live_load_yard !== '' && item.containersize === "Live Load" ? item.live_load_yard : "N/A",
        //       //MinisonSite: item.half_yrd_qty && item.half_yrd_qty !== '' && item.containersize === "1/2 Yard" ? item.half_yrd_qty : "N/A",
        //       EmptyAmount: _.get(item,'emptyamount', ''),
        //       LooseYards : _.get(item,'looseyardage', ''),
        //       Addminis: _.get(item,'addminis', ''),
        //       RemoveMinis: _.get(item,'removeminis', ''),
        //       Overload: _.get(item,'overload', ''),
        //       Permit: _.get(item, 'permit', false) ? 'Yes': 'No',
        //       Hauler: _.get(item, 'haular.company_name', ''),
        //       //Material: item.typeofdebris && item.typeofdebris.length > 0 ? item.typeofdebris.join(', ') : '',
        //       //Orderedbyname: _.get(item,'orderedby', ''),
        //       //Contactname: _.get(item,'contactname', ''),
        //     }
        //     if (currentLocation === '/services-report' || currentLocation === '/tonnage-report' ) {
        //       datatable.Removaldate= item.pickupdate ? self.getDate(item.pickupdate) : "-"
        //       datatable.DumpSite= _.get(item,'dump.companyname', '')
        //       datatable.DumpTicketNumber= _.get(item,'dumpticketnumber', '')
        //       datatable["Weight(tons)"] = _.get(item,'weight', '')
        //     }
        //     data.push(datatable)
        //   } else {
        //     let datatable = {
        //       CompanyName: _.get(item,'customer.companyname', ''),
        //       DeliveryDate: self.getDate(item.deliverydate),
        //       OrderNumber: _.get(item,'orderid', ''),
        //       Address: address.toString().replace(/,/g, ''),
        //       Container: item.containersize,
        //       LiveLoadYardage: item.live_load_yard && item.live_load_yard !== '' && item.containersize === "Live Load" ? item.live_load_yard : "N/A",
        //       MinisonSite: item.half_yrd_qty && item.half_yrd_qty !== '' && item.containersize === "1/2 Yard" ? item.half_yrd_qty : "N/A",
        //       EmptyAmount: _.get(item,'emptyamount', ''),
        //       LooseYards : _.get(item,'looseyardage', ''),
        //       Addminis: _.get(item,'addminis', ''),
        //       RemoveMinis: _.get(item,'removeminis', ''),
        //       Overload: _.get(item,'overload', ''),
        //       Material: item.typeofdebris && item.typeofdebris.length > 0 ? item.typeofdebris.join(', ') : '',
        //       Orderedbyname: _.get(item,'orderedby', ''),
        //       Contactname: _.get(item,'contactname', ''),
        //       PO: _.get(item,'purchaseordernumber', ''),
        //       "Weight(tons)": _.get(item,'weight', ''),
        //       "Waste(tons)": _.get(item,'sustainabilityinformation.waste', ''),
        //       "Brick(tons)": _.get(item,'sustainabilityinformation.brick', ''),
        //       "Dirt(tons)": _.get(item,'sustainabilityinformation.dirt', ''),
        //       "Concrete(tons)": _.get(item,'sustainabilityinformation.concrete', ''),
        //       "Wood(tons)": _.get(item,'sustainabilityinformation.cleanwood', ''),
        //       "Metal(tons)": _.get(item,'sustainabilityinformation.metal', ''),
        //       "Paper/Cardboard(tons)": _.get(item,'sustainabilityinformation.paper_cardboard', ''),
        //       "Plastic(tons)": _.get(item,'sustainabilityinformation.plastic', ''),
        //       "Drywall(tons)": _.get(item,'sustainabilityinformation.drywall', ''),
        //       "Glass(tons)": _.get(item,'sustainabilityinformation.glass', ''),
        //       "Glass(tons)": _.get(item,'sustainabilityinformation.glass', ''),
        //       "Asphalt(tons)": _.get(item,'sustainabilityinformation.asphalt', ''),
        //       "Recycling(tons)": item.sustainabilityinformation && item.sustainabilityinformation.recyclingpercentage ? item.sustainabilityinformation.recyclingpercentage.toFixed(2) : "",
        //       "ResidualWaste": item.sustainabilityinformation && item.sustainabilityinformation.residualpercentage ? item.sustainabilityinformation.residualpercentage.toFixed(2) : ""
        //     }
        //     data.push(datatable)
        //   }
        // })
        // let csvRows = []
        // let fileName = ""

        // if (currentLocation === '/services-report' ) {
        //   fileName = "services-report-List-"+self.state.selectedDate
        // }
        // if (currentLocation === '/yardage-report' ) {
        //   fileName = "yardage-report-List-"+self.state.selectedDate
        // }
        // if (currentLocation === '/sustainability-report' ) {
        //   fileName = "sustainability-report-List-"+self.state.selectedDate
        // }
        // if (currentLocation === '/tonnage-report' ) {
        //   fileName = "tonnage-report-List-"+self.state.selectedDate
        // }
        // const headers = Object.keys(data[0])
        // csvRows.push(headers.join(", "))
        // for(const row of data) {
        //   const values = headers.map(header => {
        //     return row[header]
        //   })
        //   csvRows.push(values.join(", "))
        // }
        // csvRows = csvRows.join('\n')
        // window.open('data:application/vnd.ms-excel,' + encodeURIComponent( $('div[id$=ant-table-scroll]').html()));
        // const blob = new Blob([csvRows], { type: 'text/csv'})
        // const csvURL = window.URL.createObjectURL(blob);
        // this.setState({ isExportLoaderInit: false})
        // let a = ''
        // a = document.createElement('a');
        // a.setAttribute('hidden', '');
        // a.setAttribute('href', csvURL);
        // a.setAttribute('download', fileName+'.csv');
        // document.body.appendChild(a)
        // a.click();
        // document.body.removeChild(a);
      })
    }
  }

  exportListPdf = async() => {
    const self = this
    this.setState({ loadervisible: true })
    const orders = _.get(this.state, 'reports', [])
    if(orders.length > 0) {
      let data = []
      const currentLocation = this.props.location.pathname
      this.setState({ isExportLoaderInit: true }, async () => {
        const { startDate , endDate, status, sort_field, by, page, limit, searchstring, searchby, resultType } = this.state
        const currentLocation = this.props.location.pathname
        let type = ''
        if (currentLocation === '/services-report' ) {
          type = "services"
        }
        if (currentLocation === '/yardage-report' ) {
          type = "yardage"
        }
        if (currentLocation === '/sustainability-report' ) {
          type = "sustainability"
        }
        if (currentLocation === '/sustainability-summary' ) {
          this.state.startDate = '01-01-' + String(this.state.year)
          this.state.endDate = '12-31-' + String(this.state.year)
          type = "sustainabilitysummary"
        }
        if (currentLocation === '/tonnage-report' ) {
          type = "tonnage"
        }
        let data = {
          from: moment(this.state.startDate).format("MM-DD-YYYY"),
          to: moment(this.state.endDate).format("MM-DD-YYYY"),
          sort_field,
          by,
          type,
          email: _.get(this.props, 'user.email', ''),
          exporttype: 'pdf',
          limit: limit,
          searchstring: searchstring
        }
        if (this.state.customerChecked) {
          data.filterstring = "customer"
          data.customerIds = this.state.customerArray
        }
        if (this.state.locationChecked) {
          data.filterstring = "location"
          // data.customerIds = this.state.locationArray
          data.location = this.state.locationAddress
        }
        if (this.state.poChecked) {
          data.filterstring = this.state.po
          data.filterby = "PO"
          //data.customerIds = []
        }

        if (localStorage.getItem('usertype') === 'customer') {
          let id = localStorage.getItem('userid')
          if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
            id = _.get(this.props, 'user.createdBy', undefined)
          }
          data.customerId = id
        }
        data.to = moment(this.state.endDate).format('MM/DD/YYYY')
        data.from = moment(this.state.startDate).format('MM/DD/YYYY')
        data.companyname = _.get(this.props, 'user.companyInfo.companyname', '')
          let {value} = await this.props.exportdashreports(data)
          if(value && value.data !== "") {
            window.open(value.data)
          } else {
            message.success(value.message)
          }
          this.setState({ loadervisible: false })
      })
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


  onSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      searchstring: e.target.value, typingTimeout: setTimeout(async () => {
        this.fetchOrdersResults()
      }, 1000)
    })
  }

  customerSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }   
    this.setState({ customerSearchString: e.target.value, typingTimeout: setTimeout(() => {
      this.fetchCustomers()
    }, 500)
    })
  }
  locationSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }   
    this.setState({ locationSearchString: e.target.value, typingTimeout: setTimeout(() => {
      this.fetchOrdersForLocation()
    }, 500)
    })
  }

  clearFilter () {
    this.setState({
      customerChecked: false,
      locationChecked: false,
      poChecked: false,
      locationArray: [],
      locationAddress: [],
      customerArray: [],
      searchstring: '',
      po: '',
      customerSearchString: '',
      locationSearchString: '',
    },()=>{
      this.fetchOrdersResults()
      this.fetchCustomers()
      this.fetchOrdersForLocation()
    })
  }

  selectFilters = (type) => {
    if (type === "locationChecked") {
      this.setState({ poChecked: false, locationChecked: !this.state.locationChecked, customerSearchString: '', locationSearchString: '' },()=>{
        this.fetchCustomers()
      })
    } else if (type === "poChecked") {
      this.setState({poChecked: !this.state.poChecked, locationChecked: false, customerSearchString: '', locationSearchString: '', locationArray: [], locationAddress: [] },()=>{
        this.fetchCustomers()
      })
    } else {
      //const customerArray = !this.state.customerChecked === false ? [] : this.state.customerArray
      this.setState({customerChecked: !this.state.customerChecked, customerSearchString: ''}, async()=>{
        this.fetchCustomers()
        this.fetchOrdersForLocation()
      })
    }

  }

  handleVisibleChange = visible => {
    this.setState({ visible: !this.state.visible });
  };

  onfilterChangeArr (customer, type) {
    let id = ''
    let customerArray = this.state.customerArray
    let locationArray = this.state.locationArray
    let locationAddress = this.state.locationAddress

    if (type === "customerChecked") {
      id = customer.id
      if(customerArray.indexOf(id) === -1) {
        customerArray.push(id)
      } else {
        customerArray.splice(customerArray.indexOf(id), 1)
      }
    } else {
      id = customer._id
      if(locationArray.indexOf(id) === -1) {
        locationArray.push(id)
        locationAddress.push(customer.new_address)
      } else {
        locationArray.splice(locationArray.indexOf(id), 1)
        locationAddress.splice(locationAddress.indexOf(customer.new_address), 1)
      }
    }
    this.setState({ customerArray, locationArray, locationAddress }, async () => {
      this.forceUpdate()
      this.fetchOrdersForLocation()
    })
  }

  applyFilter () {
    this.fetchOrdersResults()
    this.handleVisibleChange()
  }

  render() {
    const currentLocation = this.props.location.pathname
    const companyName = _.get(this.props, 'user.companyInfo.companyname', '')
    return (
      <div className={localStorage.getItem('usertype') === 'user' ? "layout-has-sidebar" : "layout-has-sidebar-edit"}>
        { this.state.loadervisible ?
        <div className="fullpage-loader">
          <span className="loaderimg">
              <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </span>
        </div> :
      "" }
        { localStorage.getItem('usertype')=== 'user' ?
          <SidebarNavigation {...this.props}/>
          : ''
        }
        { localStorage.getItem('usertype')=== 'user' ?
        <TopNavigation {...this.props}/>
          :
          <CustomerTopNavigation  {...this.props}/>
        }
        <main className={localStorage.getItem('usertype') === 'user' ? "dashboard-layout-content pb-3 yardage__report-wrapper" : "dashboard-layout-content width1033 pb-3 yardage__report-wrapper"}>
          <div className="btn-back-header">
            <Link to="/reports" className="backbtn-dashboard cursor-pointer"><BackArrowIcon /> Back to Reports</Link>
          </div>
          <div className="page-header">
            {currentLocation === '/services-report' && (<h2 className="table-title">{localStorage.getItem('usertype') === 'user' ? `Services Report - ${companyName}` : "Services Report"}</h2>)}
            {currentLocation === '/yardage-report' && (<h2 className="table-title">{localStorage.getItem('usertype') === 'user' ? `Yardage Report - ${companyName}` : "Yardage Report"}</h2>)}
            {currentLocation === '/sustainability-report' && (<h2 className="table-title">{localStorage.getItem('usertype') === 'user' ? `Sustainability Details - ${companyName}` : "Sustainability Details"}</h2>)}
            {currentLocation === '/tonnage-report' && (<h2 className="table-title">{localStorage.getItem('usertype') === 'user' ? `Tonnage Report - ${companyName}` :"Tonnage Report"} </h2>)}
            {currentLocation === '/sustainability-summary' && (<h2 className="table-title">{localStorage.getItem('usertype') === 'user' ? `Sustainability Summary - ${companyName}` :"Sustainability Summary"}</h2>)}
            {currentLocation !== '/sustainability-summary' ?
            <div className="pageheader__inner-right">
              <div className="form-group material-textfield material-textfield-select">
                <select value="" onChange={this.handleDateChange.bind(this)} className="form-control custom-select w-150 font-16 material-textfield-input">
                  <option disabled className="hideDefaultOption"></option>
                  <option value="today">Today ({moment().format('MMM DD, YYYY')})</option>
                  <option value="week">This Week ({moment().startOf('week').format('MMM DD, YYYY')} - {moment().endOf('week').format('MMM DD, YYYY')})</option>
                  <option value="month">This Month ({moment().startOf('month').format('MMM DD, YYYY')} - {moment().endOf('month').format('MMM DD, YYYY')})</option>
                  <option value="custom" onClick={() => this.setState({ datePickerModal: true })}>Custom {this.getCustomDate()}</option>
                </select>
                <label className="material-textfield-label">Date </label>
                <label className=" text-value">{this.state.textShow} </label>
              </div>
              <div className="form-group material-textfield material-textfield-select">
                <select name="limit" value={this.state.limit} onChange={this.onHandleChange.bind(this)} className="form-control custom-select w-150 font-16 material-textfield-input">
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                </select>
                <label className="material-textfield-label">Results</label>
              </div>
            </div> : 
            <div className="form-group material-textfield material-textfield-select mb-0  custome__date-picker">
              {/*<DatePicker
                allowClear={false}
                className="form-control custom-select h-66 font-16 material-textfield-input for-cursur"
                dropdownClassName="datepicker__header--popup"
                defaultValue={moment(this.state.filterDate, dateFormat)} format={dateFormat}
                onChange={this.handleDateChange.bind(this)}
                suffixIcon={<img src="./img/down-arrow.png"/>}
              /> */}
              <DatePicker
                selected={this.state.newstartDate}
                onChange={date => this.yearChange(date)}
                className="form-control custom-select h-66 font-16 material-textfield-input for-cursur"
                showYearPicker
                dateFormat="yyyy"
                dropdownClassName="datepicker__header--popup"
                suffixIcon={<img src="./img/down-arrow.png"/>}
              />         
              <label className="material-textfield-label material-textfield-label-ant">Date </label>
            </div>
           
            }
          </div>
         
          <div className="export__section">
            <div className="cursor-pointer d-flex">
              {/*{_.get(this.state, 'reports', []).length > 0 ? <div>
              <button disabled={this.state.isExportLoaderInit} className="download-receipt-btn" onClick={() => { this.exportList() }}><img src={ExportListIcon} /> {this.state.isExportLoaderInit ? "Please wait..." : "Export List"}</button> </div>: ""}*/}
              {_.get(this.state, 'reports', []).length > 0 ?
              <div>
                <Button onClick={() => { this.exportList() }} className="btn btn-dark w-120 font-600 font-16 fullwidth-mobile">
                  Export
                </Button>
                <Button onClick={() => { this.exportListPdf() }} className="btn btn-dark w-120 font-600 font-16 filter-ml">
                  Download as PDF
                </Button>
                {/* <Button onClick={() => { this.exportList() }} className="filterbtn-btn filter-ml">
                  <ExportIcon/>
                  Export
                </Button>
                <Button onClick={() => { this.exportListPdf() }} className="filterbtn-btn filter-ml">
                  <ExportIcon/>
                  Download as pdf
                </Button> */}
               </div>
               : ""}
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-12">
              <input value={this.state.searchstring} onChange={this.onSearch.bind(this)} type="search" placeholder="Search by order #" className="customer-searchbar" />
            </div>
          </div> */}
          <div className="search__filter-section">
            <div className="search__filter-inner">
            
              <div className="search__wrapper search__wrapper-zero">
              {currentLocation !== '/sustainability-summary' ? <input value={this.state.searchstring} onChange={this.onSearch.bind(this)} type="search" placeholder="Search by location address or company name..." className="customer-searchbar" /> : "" }
              </div>
              { (
                <Popover
                  content={
                  <div className="filter filterwidth">
                    <div className="filter__header">
                      <button onClick={this.clearFilter.bind(this)} className="btn btn-secondary btn-sm">Clear</button>
                      <div className="filter__title">Filters</div>
                      <button onClick={this.handleVisibleChange} className="btn btn-dark btn-sm">Close</button>
                    </div>
                    <div className="filter__body">
                      <ul className="filter__list">
                        { localStorage.getItem('usertype')=== 'user' && (
                          <li>
                            <label className="custom-checkbox custom-checkbox-line">
                              <input
                                className="custom-checkbox--input"
                                type="checkbox"
                                onChange={this.selectFilters.bind(this, "customerChecked")}
                                checked={this.state.customerChecked ? true : false}
                              />
                              Customers
                              <span className="checkmark"></span>
                            </label>
                            <ul>
                              {_.get(this.state,'customerChecked', false)== true ?
                              <div>
                                <input type="text" onChange={this.customerSearch.bind(this)} value={this.state.customerSearchString} placeholder="Search customers..." className="customer-searchbar" />
                                {_.get(this.state, "customerList", []).map((customer, i)=>{
                                  return (
                                    <div key={i} className="innerlisting">
                                      <li>
                                        <label className="custom-checkbox custom-checkbox-line">
                                          <input
                                            className="custom-checkbox--input"
                                            type="checkbox"
                                            onChange={this.onfilterChangeArr.bind(this, customer, "customerChecked" )}
                                            checked={this.state.customerArray.indexOf(customer.id) !== -1 ? true : false}
                                          />
                                        {customer.companyname}
                                        <span className="checkmark"></span>
                                        </label>
                                      </li>
                                    </div>
                                  )
                                })}
                              </div>
                              :
                              "" }
                            </ul>
                          </li>
                        )}
                        {(
                          <li>
                            <label className="custom-checkbox custom-checkbox-line">
                              <input
                                className="custom-checkbox--input"
                                type="checkbox"
                                onChange={this.selectFilters.bind(this, "locationChecked")}
                                checked={this.state.locationChecked ? true : false}
                              />
                              Location
                              <span className="checkmark"></span>
                            </label>
                            <ul>
                              {_.get(this.state,'locationChecked', false) == true ?
                              <div className="">
                                <input type="text" onChange={this.locationSearch.bind(this)} value={this.state.locationSearchString} placeholder="Search locations..." className="customer-searchbar" />
                                {_.get(this.state, "ordersForLocation", []).map((order, i)=>{
                                  return (
                                    <div key={i} className="innerlisting">
                                    {this.formatAddess(order) !== '' ?
                                      <li>
                                        <label className="custom-checkbox custom-checkbox-line">
                                          <input
                                            className="custom-checkbox--input"
                                            type="checkbox"
                                            onChange={this.onfilterChangeArr.bind(this, order, "locationChecked")}
                                            checked={this.state.locationArray.indexOf(order._id) !== -1 ? true : false}
                                          />
                                        {this.formatAddess(order)}
                                        <span className="checkmark"></span>
                                        </label>
                                      </li> : "" }
                                    </div>
                                  )
                                }) }
                              </div>
                              :
                              "" }
                            </ul>
                          </li>
                        )}
                        <li>
                          <label className="custom-checkbox custom-checkbox-line">
                            <input
                              className="custom-checkbox--input"
                              type="checkbox"
                              onChange={this.selectFilters.bind(this, "poChecked")}
                              checked={this.state.poChecked ? true : false}
                            />
                            PO
                            <span className="checkmark"></span>
                          </label>
                          {_.get(this.state,'poChecked', false) == true ?
                          <div className="">
                            <input type="text" name="po" onChange={this.onHandleChange.bind(this)} value={this.state.po} className="customer-searchbar" />
                          </div>
                          :
                          "" }
                        </li>
                      </ul>
                    </div>
                    <div className="filter__footer">
                      <Button onClick={this.applyFilter.bind(this)} className="btn btn-dark btn-lg apply-btn"> Apply Filter </Button>
                    </div>
                  </div>
                }
                onVisibleChange={this.handleVisibleChange}
                placement="bottom"
                className="filter"
                overlayClassName="filter__overlay reports__filter-wrapper"
                // title="Title"
                trigger="click"
                visible={this.state.visible}
                // onVisibleChange={this.filterVisible}
              >
                <Button className="filterbtn-btn filter-ml"><img src={FilterIcon} /> Filter{((this.state.poChecked && this.state.po) || (this.state.locationChecked && _.get(this.state, 'locationAddress',[]).length > 0 ))  ? (this.state.customerChecked && _.get(this.state, 'customerArray',[]).length > 0) ? `(2)` :`(1)`: (this.state.customerChecked && _.get(this.state, 'customerArray',[]).length > 0) ?`(1)`: ''}</Button>
              </Popover>
            )}
            </div>
          </div>
          <DatePickerRange
            datePickerModal={this.state.datePickerModal}
            datePickerToggle={() => this.setState({ datePickerModal: !this.state.datePickerModal })}
            // handleSelect={({ startDate, endDate }) => this.setState({ startDate, endDate })}
            onSubmitDateRanges={(startDate, endDate) => this.onSubmitDateRanges({ startDate, endDate })}
          />
          { currentLocation === '/services-report' && (
            <Services
              fetchOrdersResultsSort= {this.fetchOrdersResultsSort.bind(this)}
              getContainerSize= {this.getContainerSize.bind(this)}
              getStatus = {this.getStatus.bind(this)}
              reports={_.get(this.state, 'reports', [])}
              reportCount={_.get(this.state, 'reportCount', 0)}
              pageSize={this.state.limit}
             {...this.props}
           />
          )}
          { currentLocation === '/tonnage-report' && (
            <Tonnage
              fetchOrdersResultsSort= {this.fetchOrdersResultsSort.bind(this)}
              getContainerSize= {this.getContainerSize.bind(this)}
              getStatus = {this.getStatus.bind(this)}
              reports={_.get(this.state, 'reports', [])}
              reportCount={_.get(this.state, 'reportCount', 0)}
              tonnage={_.get(this.state, 'tonnage', 0)}
              pageSize={this.state.limit}
             {...this.props}
           />
          )}
          { currentLocation === '/yardage-report' && (
            <Yardage
              fetchOrdersResultsSort= {this.fetchOrdersResultsSort.bind(this)}
              getContainerSize= {this.getContainerSize.bind(this)}
              getStatus = {this.getStatus.bind(this)}
              reports={_.get(this.state, 'reports', [])}
              reportCount={_.get(this.state, 'reportCount', 0)}
              pageSize={this.state.limit}
              dumpsterYardage={_.get(this.state, 'dumpsterYardage', '')}
              miniYardage={_.get(this.state, 'miniYardage', '')}
              looseYardage={_.get(this.state, 'looseYardage', '')}
              liveloadYardage={_.get(this.state, 'liveloadYardage', '')}
              totalYardage={_.get(this.state, 'totalYardage', '')}
             {...this.props}
           />
          )}
          { currentLocation === '/sustainability-report' && (
            <Substantiability
              fetchOrdersResultsSort= {this.fetchOrdersResultsSort.bind(this)}
              getContainerSize= {this.getContainerSize.bind(this)}
              getStatus = {this.getStatus.bind(this)}
              reports={_.get(this.state, 'reports', [])}
              calculation={_.get(this.state, 'calculation', [])}
              reportCount={_.get(this.state, 'reportCount', 0)}
              pageSize={this.state.limit}
             {...this.props}
           />
          )}
          { currentLocation === '/sustainability-summary' && (
            <SubstantiabilitySummary
              fetchOrdersResultsSort= {this.fetchOrdersResultsSort.bind(this)}
              getContainerSize= {this.getContainerSize.bind(this)}
              getStatus = {this.getStatus.bind(this)}
              reports={_.get(this.state, 'reports', [])}
              calculation={_.get(this.state, 'calculation', [])}
              reportCount={_.get(this.state, 'reportCount', 0)}
              pageSize={this.state.limit}
             {...this.props}
           />
          )}
        </main>
      </div>
    )
  }
}

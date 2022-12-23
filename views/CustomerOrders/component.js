import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Popover, Button } from 'antd'
import { Link } from 'react-router-dom'
import TopNavigation from './../TopNavigation/container'
import { Menu, Dropdown, Pagination } from 'antd'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import _ from 'lodash'
import moment from "moment"
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../components/icons'
import './styles.scss'

import LiveOrders from './partials/liveOrders'
import PendingOrders from './partials/pendingOrders'
import HistoryOrders from './partials/historyOrders'
import RejectedOrders from './partials/rejectedOrders'
import AddOrder from './partials/addOrderModal'
import ViewCustomer from '../Customers/viewCustomer.js'
import { Tabs, Select } from 'antd'
import FilterIcon from './../../images/filter-icon.svg'
import XIcon from './../../images/ic-white.svg'


const content = (
  <div>
    {/* <p>Content</p>
    <p>Content</p> */}
  </div>
);

const { TabPane } = Tabs;
const { Option } = Select;

function handleChange(value) {
  //console.log(`selected ${value}`);
}

const styles = {
  tabsContainer : {

  },
}
const filterKeysOption = [
  "Container Size",
  "Status",
  "Delivery Date Range",
  "Removal Date Range"
]

const containerSizeOptions = [
  "10 Yard", "15 Yard", "20 Yard", "30 Yard", "1/2 Yard", "Live Load"
]
const statusOptions = [
  "Pending Delivery", "In Use", "Exchange", "Removal", "Future Exchange", "Future Removal"
]

const deliveryDateRangeOptions = [
  "Today", "Yesterday", "Next Week", "Last Week", "Custom",
]
const removelDateRangeOptions = [
  "Today", "Yesterday", "Last Week", "Custom",
]

export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      isViewModalOpen: false,
      isEditModalOpen: false,
      customers: [],
      customerId: '',
      sort: "deliverydate",
      search_string: '',
      search: '',
      by: -1,
      page: 1,
      limit: 20,
      type: 'live',
      liveOrders: [],
      pendingOrders: [],
      totalLiveOrder : 0,
      selectedCustomer: {},
      containerList: [],
      statusList: [],
      visible: false,
      filterKeys: [],
      containerSize: [],
      status: [],
      deliveryDateRange: '',
      removalStartDate: '',
      removalEndDate: '',
      deliveryStartDate: '',
      deliveryEndDate: '',
      loadervisible: false,
      customerName: '',
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.updateUrl = this.updateUrl.bind(this)
    this.orderSorting = this.orderSorting.bind(this)
    this.selectFilters = this.selectFilters.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {

    this.setState({ modalIsOpen: false })
  }

  toggleViewModal = () => {
    this.setState({ isViewModalOpen: !this.state.isViewModalOpen })
  }

  toggleEditModal = () => {
    this.setState({ isEditModalOpen: !this.state.isEditModalOpen })
  }

  goBack () {
    this.props.history.push('/customers')
  }

  componentDidMount = async()=> {
    const { limit, by, page, sort_field, search_string, type } = this.state
    if (this.props.location.state && this.props.location.state.id) {
      this.setState({ customerId: this.props.location.state.id})
    }
    if (this.props.match.params && this.props.match.params.id) {
      let type = "live"
      if(this.props.match.path === "/customer-orders/history/:id") {
        type = "history"
      }
      if(this.props.match.path === "/customer-orders/unapproved-orders/:id/:orderid") {
        type = "pending"
      }
      if(this.props.match.path === "/customer-orders/unapproved-orders/:id") {
        type = "pending"
      }
      if(this.props.match.path === "/customer-orders/rejected/:id") {
        type = "rejected"
      }
      this.setState({ cid: this.props.match.params.id, type: type},()=>{
        this.forceUpdate()
      })
    }
    if (this.props.location.state && this.props.location.state.type) {
      this.setState({ type: this.props.location.state.type }, () => {
        this.fetchOrders()
        const self = this
        setTimeout(function(){
          if (self.props.match.params && self.props.match.params.orderid) {
            if(type === "pending") {
              self.props.history.push(`/customer-orders/unapproved-orders/${self.props.match.params.id}/${self.props.match.params.orderid}`)
            }  else {
              self.props.history.push(`/customer-orders/${self.props.match.params.id}/${self.props.match.params.orderid}`)
            }
          }
         }, 3000);
      })
    }
    let data = {
      limit, by, page: 0, sort_field, search_string: '', type: 'd'
    }
    await this.fetchCustomers()
    this.fetchOrders()
    this.fetchPendingOrder()
    let  val  = await this.props.getContainer()
    let  dumpval  = await this.props.getDumps(data)
    this.setState({ containerList: val.value.containers, statusList: val.value.status, dumps: _.get(dumpval, 'value.dumps', []) })
    let data2 = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
    }
    }
    this.props.getUser(data2)
  }

  updateUrl() {
    if(this.props.match.path === "/customer-orders/history/:id") {
      //type = "history"
    }
  }

  fetchCustomers = async()=> {
    let data = {
      search_string: this.state.search_string,
      //limit: 20,
      by: 1,
      //page: 0,
      sort: ''
    }
    let { value } = await this.props.fetchCustomers(data)
    this.setState({
      customers: _.get(value, 'customers', [])
    })
    if (_.get(value, 'customers', []).length > 0) {
      let idx = _.get(value, 'customers', []).findIndex(obj => obj.customerid === this.state.cid)
      let selectedCustomer =  value.customers[idx]
      let customerName = _.get(selectedCustomer, 'companyname', this.state.customerName)
      document.title = `${_.get(selectedCustomer, 'companyname', this.state.customerName)} | CurbWaste`
      this.setState({
        selectedCustomer,
        customerName,
        customerId: _.get(selectedCustomer, 'id', '')
      },()=>{
        // this.fetchOrders()
      })
    }
  }

  fetchOrders =async()=> {
    if (this.state.type === "live" || this.state.type === "history" ) {
      this.setState({ loadervisible: true })
      let data ={
        search: this.state.search,
        page: this.state.page,
        limit: this.state.limit,
        sort: this.state.sort,
        by: this.state.by,
        type: this.state.type,
        customerId: this.state.customerId//this.props.match.params.id
      }
      if (_.get(this.state,'filterKeys',[]).length > 0) {
        data.filterkeys = _.get(this.state,'filterKeys',[])
        if (_.get(this.state,'filterKeys',[]).indexOf('Status') !== -1 ) {
          if (_.get(this.state,'status', '') !== '') {
            data.status = _.get(this.state, 'status','')
          }
        }
        if (_.get(this.state,'filterKeys',[]).indexOf('Container Size') !== -1 ) {
          data.containerSize = []
          if (_.get(this.state,'containerSize', []) !== '') {
            const contArr = _.get(this.state, 'containerSize', '')
            _.forEach(contArr, (c) => {
              const con = _.find(this.state.containerList, (container) => {
                return String(c) === String(container.size)
              })
              if(con) {
                data.containerSize.push(con._id)
              }
            })
          }
        }
        if (_.get(this.state, 'filterKeys',[]).indexOf('Removal Date Range')!== -1) {
          if (_.get(this.state, 'removalDateRange', '') !== ''){
            data.removalDateRange = _.get(this.state, 'removalDateRange', '')
            data.removalStartDate = this.getRangeDate("from", _.get(this.state, 'removalDateRange', ''), "Removal")
            data.removalEndDate = this.getRangeDate("to", _.get(this.state, 'removalDateRange', ''), "Removal")
          }
        }
        if (_.get(this.state,'filterKeys',[]).indexOf('Delivery Date Range')!== -1) {
          if (_.get(this.state,'deliveryDateRange', '') !== ''){
            data.deliveryDateRange = _.get(this.state, 'deliveryDateRange', '')
            data.deliveryStartDate = this.getRangeDate("from", _.get(this.state, 'deliveryDateRange', ''), "Delivery")
            data.deliveryEndDate = this.getRangeDate("to", _.get(this.state, 'deliveryDateRange', ''), "Delivery")
          }
        }
      }
      let { value } = await this.props.getAllOrders(data)
      this.setState({
        loadervisible: false,
        totalLiveOrder: _.get(value, 'count', 0),
        liveOrders: _.get(value, 'order', []),
      })
    }
  }

  fetchPendingOrder = async()=> {
    if (this.state.type === "pending" || this.state.type === "rejected" ) {
      let data ={
        page: this.state.page,
        limit: this.state.limit,
        sort: this.state.sort,
        by: this.state.by,
        type: 'live',
        isApproved: false,
        search: this.state.search,
        customerId: this.state.customerId //this.props.match.params.id
      }
      if (this.state.type === 'rejected') {
        data.isRejected = true
      }

      if (_.get(this.state,'filterKeys',[]).length > 0) {
        data.filterkeys = _.get(this.state,'filterKeys',[])
        if (_.get(this.state,'filterKeys',[]).indexOf('Status')!== -1) {
          if (_.get(this.state,'status', '') !== ''){
            data.status = _.get(this.state, 'status','')
          }
        }
        if (_.get(this.state,'filterKeys',[]).indexOf('Container Size')!== -1) {
          data.containerSize = []
          if (_.get(this.state,'containerSize', []) !== '') {
            const contArr = _.get(this.state, 'containerSize', '')
            _.forEach(contArr, (c) => {
              const con = _.find(this.state.containerList, (container) => {
                return String(c) === String(container.size)
              })
              if(con) {
                data.containerSize.push(con._id)
              }
            })
          }
        }
        // if (_.get(this.state, 'filterKeys',[]).indexOf('Removal Date Range')!== -1) {
        //   if (_.get(this.state, 'removalDateRange', '') !== ''){
        //     data.removalDateRange = _.get(this.state, 'removalDateRange', '')
        //     data.removalStartDate = this.getRangeDate("from", _.get(this.state, 'removalDateRange', ''))
        //     data.removalEndDate = this.getRangeDate("to", _.get(this.state, 'removalDateRange', ''))
        //   }
        // }
        if (_.get(this.state,'filterKeys',[]).indexOf('Delivery Date Range')!== -1) {
          if (_.get(this.state,'deliveryDateRange', '') !== ''){
            data.deliveryDateRange = _.get(this.state, 'deliveryDateRange', '')
            data.deliveryStartDate = this.getRangeDate("from", _.get(this.state, 'deliveryDateRange', ''), "Delivery")
            data.deliveryEndDate = this.getRangeDate("to", _.get(this.state, 'deliveryDateRange', ''), "Delivery")
          }
        }
      }

      let { value } = await this.props.getOrdersBycustomer(data)
      this.setState({
        totalLiveOrder: _.get(value, 'count', 0),
        pendingOrders: _.get(value, 'order', []),
      })
    }
  }

  onCustomerChange (customer) {
    document.title = `${_.get(customer, 'companyname', '')} | CurbWaste`
    if(this.state.type === "pending") {
      this.props.history.push(`/customer-orders/unapproved-orders/${customer.customerid}`, {id: customer.id})
    } else {
      this.props.history.push(`/customer-orders/${this.state.type}/${customer.customerid}`, {id: customer.id})
    }

    this.setState({ customerId: customer.id, cid:  customer.id, page: 1},()=>{
      this.componentDidMount()
      if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
        this.fetchPendingOrder()
      } else {
        this.fetchOrders()
      }
    })
  }

  customerSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }   
    this.setState({ search_string: e.target.value, typingTimeout: setTimeout(() => {
      this.fetchCustomers()
      }, 400)
    })
  }

  orderSorting (sort, by) {
    this.setState({ sort: sort, by: by }, () => {
      if  (this.state.type === "pending" || this.state.type === "rejected") {
        this.fetchPendingOrder()
      } else{
        setTimeout(() => {
          this.fetchOrders()
        }, 1000)
      }
    })
  }

  changeOrderType (type) {
    this.setState({ type },()=>{
      this.clearFilter()
      if(type === "pending") {
        this.props.history.push(`/customer-orders/unapproved-orders/${this.props.match.params.id}`, {id: this.state.customerId})
      } else {
        this.props.history.push(`/customer-orders/${type}/${this.props.match.params.id}`, {id: this.state.customerId})
      }

      if(type === "history") {
        this.setState({ sort: "completiondate", page: 1, search: '' } , () => {
          this.fetchOrders()
        })
      }
      if (type === "live") {
        this.setState({ sort: "deliverydate", page: 1 , search: '' } , () => {
          this.fetchOrders()
        })
      }
      if (type === "pending") {
        this.setState({ sort: "deliverydate", page: 1, liveOrders:[], search: '' } , () => {
          this.fetchPendingOrder()
        })
      }
      if (type === "rejected") {
        this.setState({ sort: "deliverydate", page: 1, liveOrders:[], search: '' } , () => {
          this.fetchPendingOrder()
        })
      }

    })
  }

  onPagechange(page) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    this.setState({ page: page, isLoader: true }, () => {
      if  (this.state.type === "pending" || this.state.type === "rejected") {
        this.fetchPendingOrder()
      } else {
        this.fetchOrders()
      }
    })
  }
  impersonate = async ()=> {
    const customer = this.state.selectedCustomer
    const { user } = this.props
    const data = {
      email: customer.email,
      usertype: 'customer'
    }
    let { value } = await this.props.getToken(data)
    if (value.type=== 'success') {
      localStorage.setItem('companyEmail', _.get(user, 'email', ''))
      localStorage.setItem('customerid', value.data._id)
      localStorage.setItem('Authorization', value.data.token)
      localStorage.setItem('userid', value.data._id)
      localStorage.setItem('usertype', value.data.usertype)
      localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
      localStorage.setItem('isImpersonate', true)
      this.props.history.push('/dashboard')
    }
  }

  responsiveTabChange (e) {
    this.setState({ type: e.target.value }, ()=>{
      this.changeOrderType(this.state.type)
    })

  }

  redirectDispatherPage = async ()=> {
    const { user } = this.props
    let defaultHauler = _.get(user, 'defaultHauler', '')
    const data = {
      email: defaultHauler.company_email,
      usertype: 'hauler'
    }
    let { value } = await this.props.getToken(data)
    if (value.type=== 'success') {
      localStorage.setItem('companyEmail', _.get(user, 'email', ''))
      localStorage.setItem('haulerid', value.data._id)
      localStorage.setItem('Authorization', value.data.token)
      localStorage.setItem('userid', value.data._id)
      localStorage.setItem('usertype', value.data.usertype)
      localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
      this.props.history.push('/dispatcher')
    }
  }

  state = {
    visible: false,
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible: !this.state.visible });
  };

  onSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      page: 1,
      search: e.target.value, typingTimeout: setTimeout(async () => {
        if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
          this.fetchPendingOrder()
        } else {
          this.fetchOrders()
        }
      }, 1000)
    })
  }

  selectFilters = (type) => {
    const filterKeys = this.state.filterKeys
    let status = this.state.status
    let containerSize = this.state.containerSize
    let deliveryDateRange = this.state.deliveryDateRange
    let removalDateRange = this.state.removalDateRange
    let removalEndDate = this.state.removalEndDate
    let removalStartDate = this.state.removalStartDate
    let deliveryStartDate = this.state.deliveryStartDate
    let deliveryEndDate = this.state.deliveryEndDate

    if(filterKeys.indexOf(type) !== -1) {
      const index = _.findIndex(filterKeys, function(m) {
        return String(m) === String(type)
      })
      if(index !== -1) {
        filterKeys.splice(index, 1)
        if(type === 'Container Size'){
          containerSize = []
        }
        if(type === 'Status'){
          status = []
        }
        if(type === 'Delivery Date Range'){
          deliveryStartDate = ''
          deliveryEndDate = ''
          deliveryDateRange = ''
        }

        if(type === 'Removal Date Range'){
          removalEndDate = ''
          removalStartDate = ''
          removalDateRange = ''
        }
        this.setState({ filterKeys, status, containerSize, deliveryDateRange, removalDateRange, removalEndDate, removalStartDate, deliveryStartDate, deliveryEndDate }, ()=>{
          if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
            this.fetchPendingOrder()
          } else {
            this.fetchOrders()
          }
        })
      }
    } else {
      filterKeys.push(type)
      this.setState({ filterKeys, status, containerSize, deliveryDateRange, removalDateRange }, ()=>{
        this.forceUpdate()
      })
    }
  }

  displayDateRange (option) {
    let range = moment()
    if(option === "Today") {
      range = `${moment().format('MMM DD, YYYY')}`
      return range
    }
    if(option === "Yesterday") {
      range = `${moment().subtract(1, 'days').format('MMM DD, YYYY')}`
      return range
    }
    if(option === "Next Week") {
      range = `${moment().add(1, 'weeks').startOf('isoWeek').format('MMM DD, YYYY')} - ${moment().add(1, 'weeks').endOf('isoWeek').format('MMM DD, YYYY')}`
      return range
    }
    if(option === "Last Week") {
      range = `${moment().subtract(1, 'weeks').startOf('isoWeek').format('MMM DD, YYYY')} - ${moment().subtract(1, 'weeks').endOf('isoWeek').format('MMM DD, YYYY')}`
      return range
    }
  }

  getRangeDate (type, range, filterOption) {
    let startDate = moment().format('MM/DD/YYYY')
    let endDate = moment().format('MM/DD/YYYY')

    if (range === 'Yesterday'){
      startDate = moment().subtract(1, 'days').format('MM/DD/YYYY')
      endDate = moment().subtract(1, 'days').format('MM/DD/YYYY')
    }
    if (range === 'Last Week'){
      startDate = moment().subtract(1, 'weeks').startOf('isoWeek').format('MM/DD/YYYY')
      endDate = moment().subtract(1, 'weeks').endOf('isoWeek').format('MM/DD/YYYY')
    }
    if (range === 'Next Week'){
      startDate = moment().add(1, 'weeks').startOf('isoWeek').format('MM/DD/YYYY')
      endDate = moment().add(1, 'weeks').endOf('isoWeek').format('MM/DD/YYYY')
    }

    if (range === 'Custom' && filterOption === "Removal" && this.state.removalDateRange === "Custom"){
      startDate = this.state.removalStartDate ? moment(this.state.removalStartDate).format('MM/DD/YYYY') : ''
      endDate = this.state.removalEndDate ? moment(this.state.removalEndDate).format('MM/DD/YYYY') : ''
    }

    if (range === 'Custom' && filterOption === "Delivery" && this.state.deliveryDateRange === "Custom"){
      startDate = this.state.deliveryStartDate ? moment(this.state.deliveryStartDate).format('MM/DD/YYYY') : ''
      endDate = this.state.deliveryEndDate ? moment(this.state.deliveryEndDate).format('MM/DD/YYYY') : ''
    }

    if (type === "from") {
      return startDate
    } else {
      return endDate
    }
  }

  clearFilter () {
    this.setState({
      filterKeys: [],
      containerSize: [],
      status: [],
      deliveryDateRange: '',
      removalDateRange: '',
      removalEndDate: '',
      removalStartDate: '',
      deliveryEndDate: '',
      deliveryStartDate: '',
      // visible:false
    },()=>{
      if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
        this.fetchPendingOrder()
      } else {
        this.fetchOrders()
      }
    })
  }

  onfilterChange (value, e) {
    this.setState({ [e.target.name] : value},()=>{
      // console.log(this.state.containerSize)
      if (this.state.removalDateRange !== "Custom") {
        this.setState({ removalStartDate: '', removalEndDate: '' })
      }
      if (this.state.deliveryDateRange !== "Custom") {
        this.setState({ deliveryEndDate: '', deliveryStartDate: '' })
      }
      if (value !== "Custom") {
        if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
          this.fetchPendingOrder()
        } else {
          this.fetchOrders()
        }
      }
    })
  }

  onfilterChangeArr (value, e) {
   let status = this.state.status
   let containerSize = this.state.containerSize
   if(e.target.name === "status") {
    if(status.indexOf(value) === -1) {
      status.push(value)
    } else {
      status.splice(status.indexOf(value), 1)
    }
   } else if(e.target.name === "containerSize") {
    if(containerSize.indexOf(value) === -1) {
      containerSize.push(value)
    } else {
      containerSize.splice(containerSize.indexOf(value), 1)
    }
   }
   this.setState({ status, containerSize }, () => {
    if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
      this.fetchPendingOrder()
    } else {
      this.fetchOrders()
    }
   })
   this.forceUpdate()
  }

  cancelFilterOption (key) {
    let filterKeys = this.state.filterKeys
    let index = -1
    let value = ''
    if (key === "containerSize") {
      index = filterKeys.indexOf("Container Size")
      value= []
    }
    if (key === "status") {
      index = filterKeys.indexOf("Status")
      value = []
    }
    if (key === "removalDateRange") {
      index = filterKeys.indexOf("Removal Date Range")
      value = ''
    }
    if (key === "deliveryDateRange") {
      index = filterKeys.indexOf("Delivery Date Range")
      value = ''
    }
    if (index > -1) {
      filterKeys.splice(index, 1);
    }

    this.setState({ [key]: value, filterKeys  },()=>{
      if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
        this.fetchPendingOrder()
      } else {
        this.fetchOrders()
      }
    })
  }
  cancelFilterOptionSingle(key, value) {
    let filterKeys = this.state.filterKeys
    const containerSize = this.state.containerSize
    const status = this.state.status
    if (key === "containerSize") {
      containerSize.splice(containerSize.indexOf(value), 1)
      if(containerSize.length === 0) {
        filterKeys.splice(filterKeys.indexOf('containerSize'), 1);
      }
    }
    if (key === "status") {
      status.splice(status.indexOf(value), 1)
      if(status.length === 0) {
        filterKeys.splice(filterKeys.indexOf('status'), 1);
      }
    }
    this.setState({ status, containerSize, filterKeys}, () => {
      if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
        this.fetchPendingOrder()
      } else {
        this.fetchOrders()
      }
    })
  }

  handleDateChange (key, date) {
    if (date) {
      this.setState({ [key]: date }, ()=>{
        if ( (this.state.removalStartDate && this.state.removalEndDate && (key === "removalEndDate" || key === "removalStartDate") ) ){
          if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
            this.fetchPendingOrder()
          } else {
            this.fetchOrders()
          }
        }
        if ( (this.state.deliveryStartDate && this.state.deliveryEndDate) && (key === "deliveryStartDate" || key === "deliveryEndDate") ){
          if ( this.state.type === 'pending' || this.state.type === 'rejected' ) {
            this.fetchPendingOrder()
          } else {
            this.fetchOrders()
          }
        }
      })
    }
  }

  filterCount() {
    let count = null
    if (this.state.containerSize && this.state.containerSize.length !== 0) {
      count += 1
    }
    if (this.state.status && this.state.status.length !== 0) {
      count += 1
    }
    if (this.state.removalDateRange) {
      count += 1
    }
    if (this.state.deliveryDateRange) {
      count += 1
    }
    return count
  }

  openCustomerViewModal () {
    this.setState({ customerModalIsOpen: true })
  }
  closeCustomerViewModal () {
    this.setState({ customerModalIsOpen: false })
  }
  handleChangeCustomer(val) {
    const customer = _.filter(this.state.customers, cus => {
      return cus.id  === val
    })
    this.setState({ search_string: '' })
    if(customer && customer.length) {
      this.onCustomerChange(customer[0])
    }    
  }

  customerSearchCustomer(val) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }   
    this.setState({ search_string: val, typingTimeout: setTimeout(() => {
      this.fetchCustomers()
      }, 400)
    })
  }
  render() {
    const { Option } = Select;


    const { isViewModalOpen, isEditModalOpen } = this.state
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <button className="btn-menu" onClick={this.toggleViewModal} to={'/'}>View</button>
        </Menu.Item>
        <Menu.Item key="1">
          <button className="btn-menu" onClick={this.toggleEditModal} to={'/'}>Edit</button>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={'/'}>Delete</Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
      { this.state.loadervisible ?
        <div className="fullpage-loader">
          <span className="loaderimg">
              <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </span>
        </div> :
      "" }
        <main className="customer-orders-wrapper">
        <TopNavigation fetchOrders={this.fetchOrders} />
          <div className="row mb-5">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset flexnone">
                <ul className="customer-orders-list icon-mr-1 mbtm20">
                  <li className="for-cursor" onClick={this.goBack.bind(this)}><BackArrowIcon /> Back to Customer List</li>
                  <li className="hidden-smallview"><Link to="/dashboard">Dashboard</Link></li>
                  <li className="hidden-smallview"><Link to="/haulers">Resources</Link></li>
                  <li className="hidden-smallview"><Link to="/reports">Reports</Link></li>
                  <li className="hidden-smallview"><Link to="/permits">Permits</Link></li>
                  <li className="hidden-smallview for-cursor"  onClick={this.redirectDispatherPage.bind(this)}>View Dispatcher</li>
                </ul>
                {/* <div className="ml-auto rightfloat orderhistory-btns">
                  <button className="btn btn-dark w-150 w-half font-600 font-16 margin--right" onClick={this.openCustomerViewModal.bind(this)}>
                    View
                  </button>
                  <button className="btn btn-dark w-150 w-half font-600 font-16 margin--right" onClick={this.impersonate.bind(this)} >Impersonate</button>
                  <button className="btn btn-dark w-150 w-half font-600 font-16" onClick={this.openModal}>
                    New Order
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="customerlist-sidebar">
                <h4 className="customerlist-sidebar-head">Customer List</h4>
                <div className="customerlist-desktop">
                  <input type="text" onChange={this.customerSearch.bind(this)} value={this.state.search_string} placeholder="Search by customer" className="customerlist-sidebar-search" />
                  <ul className="customerlist-auto for-cursur">
                    {_.get(this.state, 'customers', []).map((customer, i) => {
                      return (
                        <li key={i}
                          onClick={this.onCustomerChange.bind(this, customer)}
                          className={this.state.customerId === customer.id ? "active" : ''}>
                          {_.get(customer, 'companyname', '')}
                        </li>
                      )
                    })
                    }
                  </ul>
                </div>
                <div className="search-ant">
                  <Select
                    showSearch
                    placeholder="Select a customer"
                    optionFilterProp="children"
                    value="Select a customer"//{this.state.customerId}
                    onChange={this.handleChangeCustomer.bind(this)}
                    onSearch={this.customerSearchCustomer.bind(this)}
                    // filterOption={(input, option) =>
                    //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {_.get(this.state, 'customers', []).map((customer, i) => {
                      return (
                        <Option value={customer.id} key={i}>{_.get(customer, 'companyname', '')}</Option>
                      )
                    })
                    }
                  </Select>
                </div>

              </div>
              <div className="customerlist-details customerlist-details-edits">
                <h4>{_.get(this.state, 'customerName', '')}</h4>
                <div className="ml-auto rightfloat orderhistory-btns">
                  <button className="btn btn-dark w-150 w-half font-600 font-16 margin--right" onClick={this.openCustomerViewModal.bind(this)}>
                    View
                  </button>
                  <button className="btn btn-dark w-150 w-half font-600 font-16 margin--right" onClick={this.impersonate.bind(this)} >Impersonate</button>
                  <button className="btn btn-dark w-150 w-half font-600 font-16" onClick={this.openModal}>
                    New Order
                  </button>
                </div>
                <div className="clearfix"></div>

                <div className="row mb-3">
                  <div className="col-md-12 showindesktop">
                    <div className="flex-btn">
                      <button className={this.state.type === 'live' ? "btn primarybtn primarybtn-active" : "btn primarybtn" } onClick={this.changeOrderType.bind(this, 'live')}>Live</button>
                      <button className={this.state.type === 'pending' ? "btn primarybtn primarybtn-active" : "btn primarybtn" } onClick={this.changeOrderType.bind(this, 'pending')}>Unapproved Orders</button>
                      <button className={this.state.type === 'history' ? "btn primarybtn primarybtn-active" : "btn primarybtn" } onClick={this.changeOrderType.bind(this, 'history')}>History</button>
                      <button className={this.state.type === 'rejected' ? "btn primarybtn primarybtn-active" : "btn primarybtn" } onClick={this.changeOrderType.bind(this, 'rejected')}>Rejected</button>
                    </div>
                  </div>

                  <div className="col-md-12 d-flex unset align-items-center mt-4 mb-3 test">
                    <div className="searchbox-wrapper">
                      <input value={this.state.search} onChange={this.onSearch.bind(this)} type="text" placeholder="Search by order number or job address..." />
                    </div>
                    <Popover
                      content={
                        <div className="filter filterwidth filtermarg">
                          <div className="filter__header">
                            <button onClick={this.clearFilter.bind(this)} className="btn btn-secondary btn-sm">Clear</button>
                            <div className="filter__title">Filters</div>
                            <button onClick={this.handleVisibleChange} className="btn btn-dark btn-sm">Close</button>
                          </div>
                          <div className="filter__body">
                            <ul className="filter__list">
                                  <li>
                                    <label className="custom-checkbox custom-checkbox-line">
                                      <input
                                        className="custom-checkbox--input"
                                        type="checkbox"
                                        onChange={this.selectFilters.bind(this, "Container Size")}
                                        checked={this.state.filterKeys.indexOf("Container Size") !== -1 ? true : false}
                                      />
                                      Container Size
                                      <span className="checkmark"></span>
                                    </label>
                                    <ul>
                                    {_.get(this.state,'filterKeys', []).indexOf("Container Size") !== -1 ?
                                      containerSizeOptions.map((container, i)=>{
                                      return (
                                        <div key={i} className="innerlisting">
                                          <li>
                                            <label className="custom-checkbox custom-checkbox-line">
                                              <input
                                                className="custom-checkbox--input"
                                                type="checkbox"
                                                name="containerSize"
                                                onChange={this.onfilterChangeArr.bind(this, container)}
                                                checked={this.state.containerSize.indexOf(container) !== -1 ? true : false}
                                              />
                                            {container}
                                            <span className="checkmark"></span>
                                            </label>
                                          </li>
                                        </div>
                                      )
                                    })
                                    :
                                    "" }
                                    </ul>
                                  </li>
                                  {this.state.type === "live" ?
                                  <li>
                                    <label className="custom-checkbox custom-checkbox-line">
                                      <input
                                        className="custom-checkbox--input"
                                        type="checkbox"
                                        onChange={this.selectFilters.bind(this, "Status")}
                                        checked={this.state.filterKeys.indexOf("Status") !== -1 ? true : false}
                                      />
                                      Status
                                      <span className="checkmark"></span>
                                    </label>
                                    <ul>
                                    {_.get(this.state,'filterKeys', []).indexOf("Status") !== -1 ?
                                      statusOptions.map((status, i)=>{
                                      return (
                                        <div key={i} className="innerlisting">
                                          <li>
                                            <label className="custom-checkbox custom-checkbox-line">
                                              <input
                                                className="custom-checkbox--input"
                                                type="checkbox"
                                                name="status"
                                                onChange={this.onfilterChangeArr.bind(this, status)}
                                                checked={this.state.status.indexOf(status) !== -1 ? true : false}
                                              />
                                            {status}
                                            <span className="checkmark"></span>
                                            </label>
                                          </li>
                                        </div>
                                      )
                                    })
                                    :
                                    "" }
                                    </ul>
                                  </li>
                                  : ""
                                }
                                  <li>
                                    <label className="custom-checkbox custom-checkbox-line">
                                      <input
                                        className="custom-checkbox--input"
                                        type="checkbox"
                                        onChange={this.selectFilters.bind(this, "Delivery Date Range")}
                                        checked={this.state.filterKeys.indexOf("Delivery Date Range") !== -1 ? true : false}
                                      />
                                      Delivery Date Range
                                      <span className="checkmark"></span>
                                    </label>
                                    <ul>
                                    {_.get(this.state,'filterKeys', []).indexOf("Delivery Date Range") !== -1 ?
                                      deliveryDateRangeOptions.map((option, i)=>{
                                      return (
                                        <div key={i} className="innerlisting">
                                          <li>
                                            <label className="custom-checkbox custom-checkbox-line">
                                              <input
                                                className="custom-checkbox--input"
                                                type="radio"
                                                name="deliveryDateRange"
                                                onChange={this.onfilterChange.bind(this, option)}
                                                checked={this.state.deliveryDateRange === option ? true : false}
                                              />
                                            {option} {this.displayDateRange(option) ? `(${this.displayDateRange(option)})` : ''}
                                            <span className="checkmark"></span>
                                            </label>
                                          </li>
                                        </div>
                                      )
                                    })
                                    :
                                    "" }
                                    </ul>

                                { _.get(this.state, 'deliveryDateRange', '') === "Custom" ?
                                <div>
                                  <div className="inputflex d-unset">
                                  <div className="form-group material-textfield">
                                    <DatePicker
                                      className="form-control material-textfield-input"
                                      selected={this.state.deliveryStartDate}
                                      onChange={this.handleDateChange.bind(this, 'deliveryStartDate')}
                                      //minDate={new Date()}
                                      placeholderText="Select"
                                      required />
                                    <label className={"material-textfield-label address-focus-label"}>From </label>
                                  </div>
                                  <div className="form-group material-textfield">
                                    <DatePicker
                                      className="form-control material-textfield-input"
                                      selected={this.state.deliveryEndDate}
                                      onChange={this.handleDateChange.bind(this, 'deliveryEndDate')}
                                      minDate={this.state.deliveryStartDate}
                                      placeholderText="Select"
                                      readOnly={this.state.deliveryStartDate ? false : true}
                                      required />
                                    <label className={"material-textfield-label address-focus-label"}>To </label>
                                  </div>
                                </div>
                                </div>
                                : ""
                                }
                              </li>
                                {this.state.type === "live" || this.state.type === "history" ?
                                  <li>
                                    <label className="custom-checkbox custom-checkbox-line">
                                      <input
                                        className="custom-checkbox--input"
                                        type="checkbox"
                                        onChange={this.selectFilters.bind(this, "Removal Date Range")}
                                        checked={this.state.filterKeys.indexOf("Removal Date Range") !== -1 ? true : false}
                                      />
                                      Removal Date Range
                                      <span className="checkmark"></span>
                                    </label>
                                    <ul>
                                    {_.get(this.state,'filterKeys', []).indexOf("Removal Date Range") !== -1 ?
                                      removelDateRangeOptions.map((option, i)=>{
                                      return (
                                        <div key={i} className="innerlisting">
                                          <li>
                                            <label className="custom-checkbox custom-checkbox-line">
                                              <input
                                                className="custom-checkbox--input"
                                                type="radio"
                                                name="removalDateRange"
                                                onChange={this.onfilterChange.bind(this, option)}
                                                checked={this.state.removalDateRange === option ? true : false}
                                              />
                                            {option} {this.displayDateRange(option) ? `(${this.displayDateRange(option)})` : ''}
                                            <span className="checkmark"></span>
                                            </label>
                                          </li>
                                        </div>
                                      )
                                    })
                                    :
                                    "" }
                                    </ul>

                                {_.get(this.state, 'removalDateRange', '') === "Custom" ?
                                  <div>
                                      <div className="inputflex d-unset">
                                      <div className="form-group material-textfield">
                                        <DatePicker
                                          className="form-control material-textfield-input"
                                          selected={this.state.removalStartDate}
                                          onChange={this.handleDateChange.bind(this, 'removalStartDate')}
                                          //minDate={new Date()}
                                          placeholderText="Select"
                                          required />
                                        <label className={"material-textfield-label address-focus-label"}>From </label>
                                      </div>

                                      <div className="form-group material-textfield">
                                        <DatePicker
                                          className="form-control material-textfield-input"
                                          selected={this.state.removalEndDate}
                                          onChange={this.handleDateChange.bind(this, 'removalEndDate')}
                                          minDate={this.state.removalStartDate}
                                          placeholderText="Select"
                                          readOnly={this.state.removalStartDate ? false : true}
                                          required />
                                        <label className={"material-textfield-label address-focus-label"}>To </label>
                                      </div>
                                    </div>
                                  </div>
                                  : ""
                                }
                              </li>
                              : "" }

                            </ul>
                          </div>
                        </div>
                      }
                      onVisibleChange={this.handleVisibleChange}
                      placement="bottom"
                      className="filter"
                      overlayClassName="filter__overlay"
                      // title="Title"
                      trigger="click"
                      visible={this.state.visible}
                      // onVisibleChange={this.filterVisible}
                    >
                      <Button className="filterbtn-btn"><img src={FilterIcon} /> Filter {this.filterCount() ? `(${this.filterCount()})` : ''}</Button>
                    </Popover>
                  </div>
                  <div className="col-md-12 d-flex align-items-center">
                    <div className="selected-checkbox">
                      <ul>
                        {_.get(this.state,'containerSize', []) && _.get(this.state,'containerSize', []).length !== 0 && (
                          _.get(this.state,'containerSize', []).map((option, i)=>{
                            return(
                              <li key={i}>{option}<img onClick={this.cancelFilterOptionSingle.bind(this, 'containerSize', option)} src={XIcon} /></li>
                            )
                          })
                          )
                          }
                        {_.get(this.state,'status', []) && _.get(this.state,'status', []).length !== 0 && (
                          _.get(this.state,'status', []).map((option, i)=>{
                            return(
                              <li key={i}>{option} <img onClick={this.cancelFilterOptionSingle.bind(this, 'status', option)} src={XIcon} /></li>
                            )
                          })
                          )}
                        {_.get(this.state,'deliveryDateRange', '') &&(<li>Delivery Date ({_.get(this.state,'deliveryDateRange', '')}) <img onClick={this.cancelFilterOption.bind(this, 'deliveryDateRange')} src={XIcon} /></li>)}
                        {_.get(this.state,'removalDateRange', '') &&(<li>Removal Date ({_.get(this.state,'removalDateRange', '')}) <img onClick={this.cancelFilterOption.bind(this, 'removalDateRange')} src={XIcon} /></li>)}

                      </ul>
                    </div>
                  </div>


                  <div className="col-md-12 showinmobile">
                    <div className="form-group material-textfield">
                      <select
                        name="haulerId"
                        onChange={this.responsiveTabChange.bind(this)}
                        value={this.state.type}
                        className="form-control custom-select h-66">
                        <option value="live">Live</option>
                        <option value="pending">Pending</option>
                        <option value="history">History</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
                { this.state.type === 'live' ?
                  <LiveOrders
                    customerId={this.props.match.params.id}
                    {...this.props}
                    liveOrders={this.state.liveOrders}
                    fetchOrders={this.fetchOrders}
                    containerList={this.state.containerList}
                    statusList={this.state.statusList}
                    dumps={this.state.dumps}
                    selectedCustomer= {this.state.selectedCustomer}
                    updateUrl={this.updateUrl}
                    orderSorting= {(sort, by)=>{this.orderSorting(sort, by)}}
                  />
                  :
                  this.state.type === 'pending' ?
                    <PendingOrders
                      customerId={this.props.match.params.id}
                      {...this.props}
                      pendingOrders={this.state.pendingOrders}
                      fetchOrders={this.fetchPendingOrder}
                      containerList={this.state.containerList}
                      statusList={this.state.statusList}
                      dumps={this.state.dumps}
                      selectedCustomer= {this.state.selectedCustomer}
                      updateUrl={this.updateUrl}
                      orderSorting= {(sort, by)=>{this.orderSorting(sort, by)}}
                    />
                    :
                    this.state.type === 'rejected' ?
                      <RejectedOrders
                        customerId={this.props.match.params.id}
                        {...this.props}
                        pendingOrders={this.state.pendingOrders}
                        fetchOrders={this.fetchPendingOrder}
                        containerList={this.state.containerList}
                        statusList={this.state.statusList}
                        dumps={this.state.dumps}
                        selectedCustomer= {this.state.selectedCustomer}
                        updateUrl={this.updateUrl}
                        orderSorting= {(sort, by)=>{this.orderSorting(sort, by)}}
                      />
                      :
                  <HistoryOrders
                    customerId={this.props.match.params.id}
                    {...this.props}
                    liveOrders={this.state.liveOrders}
                    fetchOrders={this.fetchOrders}
                    updateUrl={this.updateUrl}
                    dumps={this.state.dumps}
                    containerList={this.state.containerList}
                    statusList={this.state.statusList}
                    selectedCustomer= {this.state.selectedCustomer}
                    orderSorting= {(sort, by)=>{this.orderSorting(sort, by)}}
                  />
                }
              </div>
              {this.state.limit < this.state.totalLiveOrder ?
              <Pagination
                className="pb-3 text-center pagination-wrapper w-100 mt-3 pad-l-250"
                current={this.state.page}
                onChange={this.onPagechange.bind(this)}
                pageSize={this.state.limit}
                total={this.state.totalLiveOrder}
              />
              : '' }
            </div>
          </div>


        </main>
        {/* order modal open */}
        {this.state.modalIsOpen ?
        <AddOrder
          addOrderModalIsOpen = {this.state.modalIsOpen}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          selectedCustomer= {this.state.selectedCustomer}
          fetchOrders={this.fetchOrders}
          {...this.props}
        /> : ""}

        {this.state.customerModalIsOpen ?
          <ReactModal
            isOpen={this.state.customerModalIsOpen}
            onRequestClose={this.closeCustomerViewModal.bind(this)}
            contentLabel="View Team Member"
            ariaHideApp={false}
          >
            <ViewCustomer
              closeModal= {this.closeCustomerViewModal.bind(this)}
              customerInfo= {this.state.selectedCustomer}
              // apiFunctionCall= {this.fetchCustomers.bind(this)}
              {...this.props}
            />
          </ReactModal>
         : ""}

      </div>
    )
  }
}

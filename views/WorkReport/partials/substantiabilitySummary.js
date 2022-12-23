import React, { PureComponent } from 'react'
import { Table } from "antd";
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import _ from "lodash"
import moment from "moment"
import { Menu, Dropdown, Popconfirm, message, Tabs, Select } from 'antd'

import EmptyComponent from '../../../components/emptyComponent'
import { formatOrderAddess, formatPhoneNumber, getContainerSize, getDate } from '../../../components/commonFormate'
import { SortingNewUpIcon ,BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'

const { TabPane } = Tabs;
const { Option } = Select;

const columnsCalculation = [
  {
    title: 'Summary',
    width: 200,
    dataIndex: 'summary',
    key: 'summary'
  },
  {
    title: 'Jan',
    width: 200,
    dataIndex: 'jan',
    key: 'jan',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null && text !== "N/A"  ) {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Feb',
    width: 200,
    dataIndex: 'feb',
    key: 'feb',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A" ) {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Mar',
    width: 200,
    dataIndex: 'mar',
    key: 'mar',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A" ) {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Apr',
    width: 200,
    dataIndex: 'apr',
    key: 'apr',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A" ) {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'May',
    width: 200,
    dataIndex: 'may',
    key: 'may',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null && text !== "N/A" ) {  return text + "%" }  else { return "N/A"}}
  },{
    title: 'Jun',
    width: 200,
    dataIndex: 'jun',
    key: 'jun',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A") {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Jul',
    width: 200,
    dataIndex: 'jul',
    key: 'jul',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A") {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Aug',
    width: 200,
    dataIndex: 'aug',
    key: 'aug',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A") {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Sep',
    width: 200,
    dataIndex: 'sep',
    key: 'sep',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A") {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Oct',
    width: 200,
    dataIndex: 'oct',
    key: 'oct',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null && text !== "N/A" ) {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Nov',
    width: 200,
    dataIndex: 'nov',
    key: 'nov',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null && text !== "N/A" ) {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Dec',
    width: 200,
    dataIndex: 'dec',
    key: 'dec',
    render: (text, record, index) => {  if(record.summary !== "Recycling % (tons)" ) { return !isNaN(parseFloat(parseFloat(text).toFixed(2))) ? parseFloat(parseFloat(text).toFixed(2)) :  0 } else if ( record.total !== 0 && text !== null  && text !== "N/A") {  return text + "%" }  else { return "N/A"}}
  },
  {
    title: 'Total',
    width: 200,
    dataIndex: 'total',
    key: 'total',
    render: total => total && total !== "" && total !== "N/A" ? parseFloat(parseFloat(total).toFixed(2)) : "N/A"
  },
  {
    title: 'Total percentage',
    width: 200,
    dataIndex: 'totalpercent',
    key: 'totalpercent',
    render: totalpercent => totalpercent !== "" && totalpercent !== null &&  totalpercent !== "N/A" ? totalpercent + "%" : "N/A"
  },
]
const data = [];
export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {

    };

  }

  componentDidMount = async()=> {

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

  render() {
    const isHomeCustomer = _.get(this.props, 'selectedCustomer.isHomeCustomer', false)
    const { reports, pageSize } = this.props
    reports.map((data, i)=>{
      reports[i].key= i
      reports[i].containersize = this.props.getContainerSize(data.container)
      reports[i].address = this.formatAddess(data)
    })
    return (
      <div>
        <div className="work__repot-body">
          <div className="card">
            <Table
              columns={columnsCalculation}
              dataSource={_.get(this.props, 'reports', [])}
              scroll={{ x: 1600, y: 300 }}
              pagination={{ pageSize, hideOnSinglePage: true }}
            />
          </div>
        </div>
      </div>
    )
  }
}

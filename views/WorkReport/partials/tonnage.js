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
function formatNumber(number) {
  const nfObject = new Intl.NumberFormat('en-US');
  const output = nfObject.format(number);
  return output
}

export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      columns: [],
      by: 1,
      sort_field: ''
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

  
  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1;
    } else {
        this.state.sort_field = field;
        this.state.by = 1;
    }
    this.props.fetchOrdersResultsSort(this.state.by, this.state.sort_field)
    // this.fetchOrderList();
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
  render() {
    const isHomeCustomer = _.get(this.props, 'selectedCustomer.isHomeCustomer', false)
    const { reports, pageSize, tonnage } = this.props
    reports.map((data, i)=>{
      reports[i].key= i
      reports[i].containersize = this.props.getContainerSize(data.container)
      reports[i].address = this.formatAddess(data)
    })
    const columns = [
      // {
      //   title: 'Company Name',
      //   width: 150,
      //   dataIndex: 'customer.companyname',
      //   key: 'companyname',
      //   fixed: 'left',
      // },
      {
        title: <span onClick={() => { this.sortby('deliverydate') }} className="custom-table-th-title-sm for-cursor">Delivery Date {this.getSortArrow('deliverydate')}</span>,
        width: 150,
        dataIndex: 'deliverydate',
        key: 'deliverydate',
        render: deliverydate => deliverydate !== 'Total Tonnage' ? (moment(deliverydate).isValid() ? moment(deliverydate).format("MM/DD/YYYY") : "") : "Total Tonnage",
      },
      {
        title: <span onClick={() => { this.sortby('orderid') }} className="custom-table-th-title-sm for-cursor">Order Number {this.getSortArrow('orderid')}</span>,
        width: 120,
        dataIndex: 'orderid',
        key: 'orderid',
        render: orderid => orderid && orderid !== '' && orderid !== undefined ? orderid : 'N/A'
      },
      {
        title: <span onClick={() => { this.sortby('customername') }} className="custom-table-th-title-sm for-cursor">Customer {this.getSortArrow('customername')}</span>,
        width: 150,
        dataIndex: 'customername',
        key: 'customername',
        render: customername => customername && customername !== undefined && customername.trim() !== '' ? customername : 'N/A'
      },
      {
        title: <span onClick={() => { this.sortby('address') }} className="custom-table-th-title-sm for-cursor">Location {this.getSortArrow('address')}</span>,
        width: 400,
        dataIndex: 'address',
        key: 'address',
        render: address => address && address !== '' && address !== undefined ? address : 'N/A'
        
      },
      {
        title: <span onClick={() => { this.sortby('purchaseordernumber') }} className="custom-table-th-title-sm for-cursor">PO {this.getSortArrow('purchaseordernumber')}</span>,
        width: 250,
        dataIndex: 'purchaseordernumber',
        key: 'purchaseordernumber',
        render: purchaseordernumber => purchaseordernumber && purchaseordernumber !== '' && purchaseordernumber !== undefined ? purchaseordernumber : 'N/A'
      },
      {
          title: <span onClick={() => { this.sortby('typeofdebris') }} className="custom-table-th-title-sm for-cursor">Material {this.getSortArrow('typeofdebris')}</span>,
          width: 200,
          dataIndex: 'typeofdebris',
          typeofdebris: 'typeofdebris',
          render: typeofdebris => (typeofdebris && typeofdebris.length > 0 ? typeofdebris.join(', ') : 'N/A')
        },
      {
        title: <span onClick={() => { this.sortby('containersize') }} className="custom-table-th-title-sm for-cursor">Container Size {this.getSortArrow('containersize')}</span>,
        width: 120,
        dataIndex: 'containersize',
        key: 'containersize',
        render: containersize => containersize && containersize !== '' && containersize !== undefined ? containersize : 'N/A'
      },
      {
        title: <span onClick={() => { this.sortby('live_load_yard') }} className="custom-table-th-title-sm for-cursor">Live Load Yardage {this.getSortArrow('live_load_yard')}</span>,
        width: 200,
        dataIndex: 'live_load_yard',
        key: 'live_load_yard',
        render: (live_load_yard, record) => (live_load_yard && live_load_yard !== '' && record.containersize === "Live Load" ? live_load_yard : "N/A"),
      },
      // {
      //   title: 'Minis on Site',
      //   width: 120,
      //   dataIndex: 'half_yrd_qty',
      //   key: 'half_yrd_qty',
      //   render: (half_yrd_qty, record) => (half_yrd_qty && half_yrd_qty !== '' && record.containersize === "1/2 Yard" ? half_yrd_qty : "N/A"),
      //  },
      {
        title: <span onClick={() => { this.sortby('emptyamount') }} className="custom-table-th-title-sm for-cursor">Empty Amount {this.getSortArrow('emptyamount')}</span>,
        width: 200,
        dataIndex: 'emptyamount',
        key: 'emptyamount',
        render: emptyamount => emptyamount && emptyamount !== '' && emptyamount !== undefined ? emptyamount : 'N/A'
      },
      {
        title: <span onClick={() => { this.sortby('looseyardage') }} className="custom-table-th-title-sm for-cursor">Loose Yards {this.getSortArrow('looseyardage')}</span>,
        width: 120,
        dataIndex: 'looseyardage',
        key: 'looseyardage',
        render: looseyardage => looseyardage && looseyardage !== '' && looseyardage !== undefined ? looseyardage : 'N/A'
      },
      {
        title: <span onClick={() => { this.sortby('overload') }} className="custom-table-th-title-sm for-cursor">Overload {this.getSortArrow('overload')}</span>,
        dataIndex: 'overload',
        key: 'overload',
        width: 120,
        render: overload => overload && overload !== '' && overload !== undefined ? overload : 'N/A'
      },
      //
      // {
      //   title: 'Ordered by name',
      //   width: 200,
      //   dataIndex: 'orderedby',
      //   key: 'orderedby'
      // },
      // {
      //   title: 'Contact name',
      //   width: 200,
      //   dataIndex: 'contactname',
      //   key: 'contactname'
      // },
      {
        title: <span onClick={() => { this.sortby('pickupdate') }} className="custom-table-th-title-sm for-cursor">Removal date {this.getSortArrow('pickupdate')}</span>,
        width: 200,
        dataIndex: 'pickupdate',
        key: 'pickupdate',
        render: pickupdate => (pickupdate && moment(pickupdate).isValid() ? moment(pickupdate).format("MM/DD/YYYY") : "N/A"),
      },
      {
        title: <span onClick={() => { this.sortby('dumpcompanyname') }} className="custom-table-th-title-sm for-cursor">Dump Site {this.getSortArrow('dumpcompanyname')}</span>,
        width: 200,
        dataIndex: 'dump.companyname',
        key: 'dump.companyname',
        render: companyname => companyname && companyname !== '' && companyname !== undefined ? companyname : 'N/A'
      },
      {
        title: <span onClick={() => { this.sortby('dumpticketnumber') }} className="custom-table-th-title-sm for-cursor">Dump Ticket Number {this.getSortArrow('dumpticketnumber')}</span>,
        width: 200,
        dataIndex: 'dumpticketnumber',
        key: 'dumpticketnumber',
        render: dumpticketnumber => dumpticketnumber && dumpticketnumber !== '' && dumpticketnumber !== undefined ? dumpticketnumber : 'N/A'
      },
      {
        title: <span onClick={() => { this.sortby('weight') }} className="custom-table-th-title-sm for-cursor">Weight (tons) {this.getSortArrow('weight')}</span>,
        width: 120,
        dataIndex: 'weight',
        key: 'weight',
        render: weight => weight && weight !== '' ? formatNumber(parseFloat(weight)) : 'N/A'
      },
    ];
    const data = [];
    if(localStorage.getItem('usertype') === 'customer') {
      columns.splice(2, 1)
    }
    return (
      <div>
        <div className="work__repot-body">
          <div className="card">
            <Table
              columns={columns}
              dataSource={_.get(this.props, 'reports', [])}
              scroll={{ x: 1600, y: 300 }}
              pagination={{ pageSize, hideOnSinglePage: true }}
            />
          </div>
        </div>
        {/* {_.get(this.props, 'reports', []).length > 0 ?
        <div className="totalcost-wrapper">
          <h5>
            Total Tonnage <span>{tonnage && tonnage !== '' ? this.formatNumber(tonnage) : 0}</span>
          </h5>
        </div>
        : ''
        } */}
      </div>
    )
  }
}

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


const data = [];
export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      columns: [],
      by: 1,
      sort_field: ''
    };

  }
  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1;
    } else {
        this.state.sort_field = field;
        this.state.by = 1;
    }
    this.forceUpdate()
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
    const columnsCalculation = [
      {
        title: <span onClick={() => { this.sortby('dumpticketnumber') }} className="custom-table-th-title-sm for-cursor">Dump Ticket Number {this.getSortArrow('dumpticketnumber')}</span>,
        width: 200,
        dataIndex: 'dumpticketnumber',
        key: 'dumpticketnumber'
      },
      {
        title: <span onClick={() => { this.sortby('pickupdate') }} className="custom-table-th-title-sm for-cursor">Removal date {this.getSortArrow('pickupdate')}</span>,
        width: 200,
        dataIndex: 'pickupdate',
        key: 'pickupdate',
        render: pickupdate => pickupdate && pickupdate !== "Total" ? (moment(pickupdate).isValid() ? moment(pickupdate).format("MM/DD/YYYY") : "") : "N/A",
      },
      {
        title: <span onClick={() => { this.sortby('calculatedyardage') }} className="custom-table-th-title-sm for-cursor">Yardage {this.getSortArrow('calculatedyardage')}</span>,
        width: 200,
        dataIndex: 'calculatedyardage',
        key: 'calculatedyardage',
      },
      {
        title: <span onClick={() => { this.sortby('brick') }} className="custom-table-th-title-sm for-cursor">Brick Weight (tons) {this.getSortArrow('brick')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.brick',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'brick'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('dirt') }} className="custom-table-th-title-sm for-cursor">Dirt Weight(tons) {this.getSortArrow('dirt')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.dirt',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'dirt'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('concrete') }} className="custom-table-th-title-sm for-cursor">Concrete Weight(tons) {this.getSortArrow('concrete')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.concrete',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'concrete'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('cleanwood') }} className="custom-table-th-title-sm for-cursor">Wood Weight(tons) {this.getSortArrow('cleanwood')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.cleanwood',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'cleanwood'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('metal') }} className="custom-table-th-title-sm for-cursor">Metal Weight(tons) {this.getSortArrow('metal')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.metal',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'metal'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('paper_cardboard') }} className="custom-table-th-title-sm for-cursor">Paper/Cardboard Weight (tons) {this.getSortArrow('paper_cardboard')}</span>,
        width: 300,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.paper_cardboard',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'paper_cardboard'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('plastic') }} className="custom-table-th-title-sm for-cursor">Plastic Weight (tons) {this.getSortArrow('plastic')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.plastic',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'plastic'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('drywall') }} className="custom-table-th-title-sm for-cursor">Drywall Weight (tons) {this.getSortArrow('drywall')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.drywall',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'drywall'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('glass') }} className="custom-table-th-title-sm for-cursor">Glass Weight (tons) {this.getSortArrow('glass')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.glass',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'glass'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('asphalt') }} className="custom-table-th-title-sm for-cursor">Asphalt Weight (tons) {this.getSortArrow('asphalt')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.asphalt',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'asphalt'
          })
          if(s) {
            return parseFloat(parseFloat(s.value).toFixed('2'))
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('recyclingweight') }} className="custom-table-th-title-sm for-cursor">Recycling Weight (tons) {this.getSortArrow('asphalt')}</span> ,
        width: 200,
        dataIndex: 'recyclingweight',
        key: 'recyclingweight',
        render: recyclingweight => recyclingweight ? recyclingweight.toFixed(2) : "",
      },
      {
        title: <span onClick={() => { this.sortby('waste') }} className="custom-table-th-title-sm for-cursor">Waste Weight (tons) {this.getSortArrow('waste')}</span>,
        width: 200,
        dataIndex: 'sustainabilityinformation.tonnageweight',
        key: 'sustainabilityinformation.tonnageweight.waste',
        render: tonnageweight =>  {
          const s = _.find(tonnageweight, (tc) => {
            return tc.key === 'waste'
          })
          if(s) {
            return parseFloat(s.value).toFixed(2)
          } else {
            return ""
          }
        }
      },
      {
        title: <span onClick={() => { this.sortby('weight') }} className="custom-table-th-title-sm for-cursor">Weight (tons) {this.getSortArrow('weight')}</span>,
        width: 200,
        dataIndex: 'weight',
        key: 'weight'
      },
      {
        title: <span onClick={() => { this.sortby('recyclingpercentage') }} className="custom-table-th-title-sm for-cursor">Recycling % (tons) {this.getSortArrow('recyclingpercentage')}</span> ,
        width: 200,
        dataIndex: 'recyclingpercentage',
        key: 'recyclingpercentage',
        render: recyclingpercentage => recyclingpercentage ? recyclingpercentage.toFixed(2) : "",
      },
      {
        title: <span onClick={() => { this.sortby('dumpcompanyname') }} className="custom-table-th-title-sm for-cursor">Dump site {this.getSortArrow('dumpcompanyname')}</span>,
        width: 200,
        dataIndex: 'dump.companyname',
        key: 'dump.companyname',
        render: companyname => companyname && companyname !== '' ? companyname : "N/A",
    
      },
      {
        title: <span onClick={() => { this.sortby('uploadedpdfurl') }} className="custom-table-th-title-sm for-cursor">Dump Ticket File {this.getSortArrow('uploadedpdfurl')}</span>,
        width: 200,
        dataIndex: 'uploadedpdf[0].url',
        key: 'uploadedpdf[0].url',
        render: url => url ? url : "N/A",
    
      },
    
    ]
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

import React, { PureComponent, Fragment } from 'react'
import { Link } from 'react-router-dom'
import GoogleMap from 'google-map-react'
import _ from 'lodash'
import TopNavigation from './../TopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/component'
import { Menu, Dropdown } from 'antd'
import { DotBtnIcon, SortingDownArrow } from '../../components/icons'
import { formatOrderAddess } from '../../components/commonFormate'
import EmptyComponent from '../../components/emptyComponent'
import MapComponent from '../../components/map'
import config from '../../config/index'
import mapImg from '../../images/dummy-map.png'
// import YellowMark from '../../images/map-yellow-icon.svg'
import YellowMark from '../../images/yellow_img.png'
import GreenImg from '../../images/green_img.png'

import './styles.scss'

const menu = (
  <Menu>
    <Menu.Item key="0">
      <Link to={'/agent/update-profile'}>Make Default Hauler</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to={'/agent/team'}>Edit</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={'/agent/signup'}>Delete</Link>
    </Menu.Item>
  </Menu>
);


const Marker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
  }
  return (
    <Fragment>
      <img src={YellowMark} style={markerStyle} />
    </Fragment>
  );
};


const TruckMarker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
    width: props.type === "yard" ? '30px' : '30px'
  };
  let icon = GreenImg

  let name = props.name

  if (name == "point" || name == "Point" ) {
    name = 'P'
  }
  return (
    <Fragment>
      <div className="markerLabel">
        <span className="markerLabel--text">
        {name}
        </span>
        <img src={icon} style={markerStyle} width="40"/>
      </div>
    </Fragment>
  );
};


export default class ResourcesComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }
  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      haulerModal: false,
      sort_field: "deliverydate",
      search_string: '',
      by: -1,
      page: 0,
      limit: 20,
      type: 'live',
      orders: [],
      isApproved: false,
      truck: []
    };
    //this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal(key) {
    this.setState({ [key]: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, haulerModal: false });
  }

  componentDidMount =async()=> {
    document.title = 'Job Status | CurbWaste'
    this.getLocation()
    this.fetchOrders()
    let interval = setInterval(async() => {
      this.getLocation()
    }, 2000)
    this.setState({ interval: interval })
  }

  getLocation =async ()=> {
    let { value } = await this.props.getLocation()
    let truck = value.data.vehicles
    this.setState({ truck })
  }

  fetchOrders =async()=> {
    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    let data ={
      page: this.state.page,
      limit: this.state.limit,
      // sort: this.state.sort_field,
      // by: this.state.by,
      // type: this.state.type,
      // isApproved: this.state.isApproved,
      customerId: customerid //this.props.match.params.id
    }

    let { value } = await this.props.getEtasOrders(data)
    this.setState({
      // totalOrder: _.get(value, 'count', 0),
      orders: _.get(value, 'data', []),
    })
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

  createMapOptions(maps) {
    return {
      panControl: true,
      mapTypeControl: true,
      scrollwheel: true,
      styles: config.mapStyles,
      streetViewControl: true
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }
  render() {
    const currentLocation = this.props.location.pathname
    return (
      <div className="layout-has-sidebar">
        <SidebarNavigation {...this.props}/>
        <TopNavigation {...this.props}/>
        <main className="dashboard-layout-content">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center">
                <h5 className="table-title">Jobs Status</h5>
              </div>
            </div>
          </div>
          { _.get(this.state, 'orders', []).length > 0 ?
            <div className="row pb-5">
              <div className="col-md-12">
                <div className="jobstatus-wrapper">
                  <ul>
                  {_.get(this.state, 'orders', []).map((order, i)=>{
                    let idx = -1
                    let selectedTruck= ''
                    if (order.driverJobs && order.driverJobs.truck_number) {
                      idx = _.get(this.state, 'truck', []).findIndex(obj => obj.name === order.driverJobs.truck_number )
                      if (idx !== -1) {
                        selectedTruck = this.state.truck[idx]
                      }
                    }

                    return (
                      <li key ={i}>
                        <p><span>Order {order.orderid}</span> is on its way to <span>{this.formatAddess(order)}</span></p>
                        <div className="map-section-small">
                          <GoogleMap
                            id="map"
                            defaultZoom={10}
                            center={_.get(order, 'location', '')}
                            // layerTypes={layerTypes}
                            options={this.createMapOptions()}
                            bootstrapURLKeys={{ key: "AIzaSyDC4hfVQUrN7Vc45Wh0Qpx4cpxs1YPWE24" }}
                          >
                            <Marker
                              id="map"
                              lat={_.get(order, 'location.lat', '')}
                              lng={_.get(order, 'location.lng', '')}
                            />

                            { idx !== -1 && selectedTruck !== '' && (
                              <TruckMarker
                                key={selectedTruck.id}
                                id={selectedTruck.id}
                                name={selectedTruck.name}
                                lat={selectedTruck.latitude}
                                lng={selectedTruck.longitude}
                              />
                            )}

                            </GoogleMap>
                        </div>
                      </li>
                    )
                  })}
                    {/* <li>
                      <p><span>Order 251093</span> is on its way to <span>140 Hope St, Brooklyn, NY 11211</span></p>
                      <img src={mapImg} alt="" />
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          :
          <EmptyComponent
            emptyText = "No Live ETA's"
          />}
        </main>
      </div>
    )
  }
}

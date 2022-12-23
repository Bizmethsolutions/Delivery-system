import 'rxjs'
import React, { Component, Fragment } from 'react'
import { reduxForm } from 'redux-form'
import { Link } from "react-router-dom";
// import Header from "./../Header/container";
import moment from "moment"
import SidebarNavigation from './../SidebarNavigation/container'
import TopNavigation from './../TopNavigation/container'
import CustomerTopNavigation from './../CustomerTopNavigation/container'

import { Spin } from 'antd'
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {  Select } from 'antd';
import _ from 'lodash';
// import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
// import classnames from 'classnames';
import './style.scss'
import GoogleMap from 'google-map-react';
import logoYellowCircle from '../../images/ic-yellow-circle.svg'

import Closemapbtnnew from '../../images/updated-close.svg'
import GreyIcon from '../../images/graycircle.svg'
import GreenImg from '../../images/green_img.png'

import CloseModals from '../../images/map-modal-close.svg'


import config from '../../config/index'
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;

const InfoWindowForDumpsAndYards = (props) => {
  const { place, name, id } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };
  if(place) {
    let address = place.address
    if (place.city) {
        address += ", " + place.city
    }
    if (place.state) {
        address += ", " + place.state
    }
    // if (item.neighborhood) {
    //     address += "," + item.neighborhood
    // }
    // if (item.borough) {
    //     address += "," + item.borough
    // }
    if (place.zipcode) {
        address += " " + place.zipcode
    }
    return (
      <div className="infowindow__wrapper">
        <div className="infowindow__wrapper--body">
          <div className="infowindow__wrapper--close">
            <img src={Closemapbtnnew} alt="close" onClick={props.closeInfoWindow}/>
          </div>
          <ul className="infowindow__wrapper--list dump_yards">
          <li>
              <span>ID<b>: </b>  <span className="font--weight">{id}</span></span>
              {/* <p>{id}</p> */}
            </li>
            <li>
              <span>Name<b>: </b>  <span className="font--weight">{name}</span></span>
              {/* <p>{name}</p> */}
            </li>
            <li>
              <span>Location<b>: </b>  <span className="font--weight">{place[0].location}</span></span>
              {/* <p>{place[0].location}</p> */}
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return ""
  }
};


const ContainerMarker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
    width: props.type === "yard" ? '30px' : '30px'
  };
  let icon = GreyIcon
  let progressTruck = _.findIndex(props.allData, function(job) {
      return String(job.truck_id) === String(props.id) && job.status === "inprogress"
  })

  let progressTruckData = _.find(props.allData, function(job) {
    return String(job.truck_id) === String(props.id) && job.status === "inprogress"
  })

  if(progressTruck !== -1) {
    icon = GreenImg
  }
  let name = props.name
  const nameIndex = props.name.toLowerCase().indexOf('point')
  if (nameIndex !== -1) {
    name = 'P'
  }
  return (
    <Fragment>
      <div className="markerLabel">
        <span className={progressTruck !== -1 ? "markerLabel--text black" : "markerLabel--text"}>
        {/* {name} */}
        </span>
        <img src={logoYellowCircle} style={markerStyle} width="40"/>
      </div>
      {props.show && <InfoWindowForDumpsAndYards place={props.place} name={props.name} id={props.id} closeInfoWindow={props.closeInfoWindow}/>}
    </Fragment>
  );
};

class InventoryComponent extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false;
    this.state = {
      name : '',
      jobs: [],
      isSidebarOpen: false,
      showTrafficLayer: false,
      center: {
        lat: 40.706928,
        lng: -73.621788
      },
      filterdate: moment(),
      isMounted: false,
      layerTypes: [],
      setTruck: false,
      trucksSelect: [{key: "Select Truck ", value: "select"}],
      setTruck: false,
      pageloaded: false,
      orders: {},
      dumpsForFilter: [],
      yardsForFilter: [],
      containerList: [],
      statusList: [],
      dateType: "today",
      deliveryCount: 0,
      removalCount: 0,
      exchangeCount: 0,
      liveLoadCount: 0,
      minisCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      dumpCount: 0,
      yardCount: 0,
      tenYardCount: 0,
      twnntYardCount: 0,
      fifYardCount: 0,
      thirtyYardCount: 0,
      halfYardCount: 0,
      pendingCount: 0,
      unassignedCount: 0,
      containers: []
    }
    this.showInfo = this.showInfo.bind(this)
  }
  setOpenWindowIndex(id) {
  }

  popupshow =async (data)=> {
    const { getOrderDetail } = this.props
    let { value } = await getOrderDetail(data.id)
    this._isMounted && this.setState({ orderInformationModal: true, orderDetail: value.data })
  }

  componentDidMount = async () => {
    this._isMounted = true;
    document.title = 'Inventory | CurbWaste'
    let interval = setInterval(() => {
      this.getContainers()
    }, 2000);
    this.setState({ interval: interval, isMounted: true})
  }

  toggleSidebar = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen })
  }
  getContainers = async ()=> {
    const self = this
    let containers = []
    const { getContainerLoc } = this.props
    let { value } = await getContainerLoc()
    let data = value.data.assets
    _.forEach(data, function(container, i) {
      let current = _.find(self.state.containers, function(job) {
        return String(job.id) === String(container.id)
      })
      if(current) {
        container.showInfo = current.showInfo
      }
      containers.push(container)
    })
    if (self._isMounted) {
      this.setState({ containers: containers })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
    this._isMounted = false;
  }
  handleSelectChange(value) {
    this.setState({ truckid: value })
  }
  closeInformationModal(){
    this.setState({ orderInformationModal: false })
  }

  showInfo(id, data) {
    const allcontainers = this.state.containers
    const alldata = this.state.jobs
    _.forEach(alldata, function(eachM) {
        eachM.showInfo = false
    })
    _.forEach(allcontainers, function(eachM) {
      eachM.showInfo = false
    })
    const isContainer = _.findIndex(this.state.containers, function(truck) {
      return String(truck.id) === String(id)
    })
    if(isContainer !== -1) {
      let singleItem = _.findIndex(allcontainers, function(item) {
        return String(item.id) === String(id)
      })
      allcontainers[singleItem].showInfo = true
      let progressContainer = {}
      progressContainer = _.find(this.state.jobs, function(job) {
        return job.truck_id === id && job.status === "inprogress"
      })
      this._isMounted && this.setState({ containers: allcontainers, clickedData: progressContainer })
    } else {
      const {getOrderDetail} = this.props
      getOrderDetail(id)
      let singleItem = _.findIndex(alldata, function(item) {
        return String(item.id) === String(id)
      })
      alldata[singleItem].showInfo = true
      this._isMounted && this.setState({ jobs: alldata })
    }
    const center = {lat: data.lat, lng: data.lng}
    this.setState({ center})
  }
  closeInfoWindow() {
    const alldata = this.state.jobs
    _.forEach(alldata, function(eachM) {
      eachM.showInfo = false
  })
  this._isMounted && this.setState({ jobs: alldata })
  }
  closeInfoWindowContainer() {
    const alldata = this.state.containers
    _.forEach(alldata, function(eachM) {
      eachM.showInfo = false
  })
  this._isMounted && this.setState({ containers: alldata })
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
  viewDetailDumpAndYards() {
    //console.log("view")
  }
  handleChange(e) {
      this.setState({ [e.target.name] : e.target.value})
  }
  showTraffic() {
    if(!this.state.showTrafficLayer === true) {
      this._isMounted && this.setState({ showTrafficLayer: !this.state.showTrafficLayer, layerTypes: ['TrafficLayer'] })
    } else {
      this._isMounted && this.setState({ showTrafficLayer: !this.state.showTrafficLayer, layerTypes: [] })
    }

  }
  render() {
    let { orderDetail, layerTypes } = this.state
    const currentlocation = window.location.pathname
    const mapOptions = {
      styles: config.mapStyles,
      streetViewControl: true
    };
    let status = "unassigned"
    if(orderDetail) {
      status = _.find(this.props.jobs && this.props.jobs.jobs, function(order){
        return String(order.id) === String(orderDetail.id)
      })
    }
    const accessibilityOptions = config.accessibilityOptions
    const { isSidebarOpen } = this.state
    return (
      <div className="layout-has-sidebar">
        {/* <Header {...this.props} onRef={ref => (this.child = ref)} viewedNotification={this.viewedNotification.bind(this)} dropdownChange={this.dropdownChange.bind(this)}/> */}
        <SidebarNavigation isSidebarOpen={isSidebarOpen} user={this.props.user} {...this.props}/>
        <TopNavigation isSidebarOpen={isSidebarOpen} toggleSidebar={this.toggleSidebar} onSearch={this.onSearch} {...this.props} />
        <main className="dashboard-layout-content">
        <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob">
                <h5 className="heading-title">Inventory</h5>
              </div>
            </div>
          </div>
        <div className="clearfix"></div>

        {this.props.jobPhase === "loading" ?
          <Spin
            tip="Loading..."
            size="large"
            wrapperClassName="spin__color"
          >
            <div className="viewmap__section">
              <div className="viewmap__section--status"></div>
            </div>
          </Spin>
        :
        <div className="viewmap__section padding-botttom">
          <button className="show__traffic--btn traffic-inven" onClick={this.showTraffic.bind(this)}>
            Show traffic
          </button>
          <GoogleMap
            defaultZoom={11}
            id="map"
            center={this.state.center}
            layerTypes={layerTypes}
            options={this.createMapOptions()}
            bootstrapURLKeys={{ key: "AIzaSyDC4hfVQUrN7Vc45Wh0Qpx4cpxs1YPWE24" }}
            onChildClick={this.showInfo}
          >
          {this.state.containers && this.state.containers.map(container =>
              (<ContainerMarker
                key={container.id}
                id={container.id}
                name={container.name}
                lat={_.get(container, 'location[0].latitude', '')}
                lng={_.get(container, 'location[0].longitude', '')}
                allData={this.state.jobs}
                progress={container.progress}
                show={container.showInfo}
                // viewDetailsTruck={this.viewDetailsTruck.bind(this, container)}
                closeInfoWindow={this.closeInfoWindowContainer.bind(this)}
                place={container.location}
                type={this.state.dateType}
              />))}
          </GoogleMap>
        </div>
        }
        </main>
      </div>
    )
  }
}

export default reduxForm({
  form: 'maps',  // a unique identifier for this form
  destroyOnUnmount: true,
})(InventoryComponent)

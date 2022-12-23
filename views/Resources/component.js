import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import InputMask from 'react-input-mask'

import { CloseIcon, MoreIcon } from '../../components/icons'
import TopNavigation from './../TopNavigation/container'

import SidebarNavigation from './../SidebarNavigation/container'
import Haulers from './partials/haulers'
import Driver from './partials/driver'
import Yard from './partials/yard'
import Containers from './partials/containers'
import Truck from './partials/trucks'
import Dumps from './partials/dumps'
import { Menu, Dropdown } from 'antd'
import { DotBtnIcon, SortingDownArrow } from '../../components/icons'

import { Tabs } from 'antd'

import './styles.scss'

export default class ResourcesComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }
  constructor(props) {
    super(props)
    this.child = React.createRef()
    this.state = {
      modalIsOpen: false,
      haulerModal: false,
      driverModal: false,
      yardModal: false,
      dumpModal: false,
      // FOR SIDEBAR
      isSidebarOpen: false,
    };
    //this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }
  openModal(key) {
    this.setState({ [key]: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, haulerModal: false, driverModal: false, yardModal: false, dumpModal: false, truckModal: false, containerModal: false });
  }

  onSearch (key) {
    this.child.current.onSearch(key)
  }

  // FOR SIDEBAR
  toggleSidebar = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen })
  }

  responsiveTabChange (e) {
    this.props.history.push(`/${e.target.value}`)
  }

  render() {
    // FOR SIDEBAR
    const { isSidebarOpen } = this.state
    const currentLocation = this.props.location.pathname
    return (
      <div className="layout-has-sidebar">
        <SidebarNavigation isSidebarOpen={isSidebarOpen} user={this.props.user} {...this.props}/>
        <TopNavigation isSidebarOpen={isSidebarOpen} toggleSidebar={this.toggleSidebar}  onSearch={this.onSearch} {...this.props} />

        <main className="dashboard-layout-content">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob">
                <h5 className="heading-title">Resources</h5>
                <div className="ml-auto">
                {currentLocation == "/haulers" ?
                    <button className="btn btn-dark w-180 font-600 font-16 btnfullwidth-mob" onClick={this.openModal.bind(this,'haulerModal')}>
                    New Hauler
                  </button>
                : ""
                }
                {currentLocation == "/drivers" ?
                    <button className="btn btn-dark w-180 font-600 font-16 btnfullwidth-mob" onClick={this.openModal.bind(this,'driverModal')}>
                    New Driver
                  </button>
                : ""
                }
                {currentLocation == "/yards" ?
                    <button className="btn btn-dark w-180 font-600 font-16 btnfullwidth-mob" onClick={this.openModal.bind(this,'yardModal')}>
                    New Yard
                  </button>
                : ""
                }
                {currentLocation == "/containers" ?
                    <button className="btn btn-dark w-180 font-600 font-16 btnfullwidth-mob" onClick={this.openModal.bind(this,'containerModal')}>
                    New Container
                  </button>
                : ""
                }

                {currentLocation == "/dumps" ?
                    <button className="btn btn-dark w-180 font-600 font-16 btnfullwidth-mob" onClick={this.openModal.bind(this,'dumpModal')}>
                    New Dump
                  </button>
                : ""
                }
                {currentLocation == "/trucks" ?
                    <button className="btn btn-dark w-180 font-600 font-16 btnfullwidth-mob" onClick={this.openModal.bind(this,'truckModal')}>
                    New Truck
                  </button>
                : ""
                }
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12 showindesktop">
              <div className="flex-btn">
                <Link to="/haulers" className={currentLocation == "/haulers" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}>Haulers</Link>
                <Link to="/drivers" className={currentLocation == "/drivers" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}>Drivers</Link>
                <Link to="/containers" className={currentLocation == "/containers" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}>Containers</Link>
                <Link to="/trucks" className={currentLocation == "/trucks" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}>Trucks</Link>
                <Link to="/dumps" className={currentLocation == "/dumps" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}>Dumps</Link>
                <Link to="/yards" className={currentLocation == "/yards" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}>Yards</Link>
              </div>
            </div>
            <div className="col-md-12 showinmobile">
              <div className="form-group material-textfield">
                <select
                  onChange={this.responsiveTabChange.bind(this)}
                  className="form-control custom-select h-66">
                  <option value="haulers">Haulers</option>
                  <option value="drivers">Drivers</option>
                  <option value="dumps">Dumps</option>
                  <option value="yards">Yards</option>
                </select>
              </div>
            </div>
          </div>

          { currentLocation === '/haulers' &&
            <Haulers
              haulerModal = {this.state.haulerModal}
              closeModal = {this.closeModal}
              openModal = {this.openModal.bind(this)}
              ref={this.child}
              {...this.props}
            />
          }
          { currentLocation === '/drivers' &&
            <Driver
              driverModal = {this.state.driverModal}
              closeModal = {this.closeModal}
              openModal = {this.openModal.bind(this)}
              ref={this.child}
              {...this.props}
            />
          }

          { currentLocation === '/yards' &&
            <Yard
              yardModal = {this.state.yardModal}
              closeModal = {this.closeModal}
              openModal = {this.openModal.bind(this)}
              ref={this.child}
              {...this.props}
            />
          }
          { currentLocation === '/containers' &&
            <Containers
              containerModal = {this.state.containerModal}
              closeModal = {this.closeModal}
              openModal = {this.openModal.bind(this)}
              ref={this.child}
              {...this.props}
            />}
          { currentLocation === '/trucks' &&
            <Truck
              truckModal = {this.state.truckModal}
              closeModal = {this.closeModal}
              openModal = {this.openModal.bind(this)}
              ref={this.child}
              {...this.props}
            />
          }

          { currentLocation === '/dumps' &&
            <Dumps
              dumpModal = {this.state.dumpModal}
              closeModal = {this.closeModal}
              openModal = {this.openModal.bind(this)}
              ref={this.child}
              {...this.props}
            />
          }

        </main>
      </div>
    )
  }
}

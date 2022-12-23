import React, { PureComponent } from 'react'
import { CloseIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import ContainerIcon from '../../images/container-icon.png'
import MapIcon from '../../images/dummy-map1.png'
import './styles.scss'

export default class CheckAvailabilityComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }

  render() {
    return (
      <div>
        <div className="settings-top-header d-flex align-item-center justify-bet posi-fixed">
          <h3 className="settings-top-heading"><img src={Logo} alt="curbside" /></h3>
          <div className="progressbar-wrapper">
            <div className="progressbar-bg"><span className="progressbar-fill"></span></div>
            <h5>10% Completed</h5>
          </div>
          <button className="settings-card-close"><CloseIcon /></button>
        </div>

        <div className="text-wrpper mt">
          <div className="text-card">
            <h5 className="text-card-heading-md font-niveaugrotesk">Check Availability</h5>
            <h5 className="text-card-subheading-sm font-graphik">Enter your address to check availability in your area</h5>
            <div className="clearfix mb-4"></div>
            <div className="text-card-select mb-4">
              <label className="labels font-graphik">Job address</label>
              <input type="text" placeholder="What is the Job Address? (This is where the container will be delivered)" className="font-graphik inputs" />
            </div>

            <img src={MapIcon} alt="curbside" style={{width: '100%'}} />
            <div className="text-card-select mt-4 mb-4">
              <label className="labels font-graphik">Location</label>
              <select className="selects custom-select font-graphik">
                <option>Where will the container be placed at the job address</option>
              </select>
            </div>
            <button className="fill-fullwidth-yellow font-graphik mb-4">Next</button>
          </div>
        </div>
      </div>
    )
  }
}

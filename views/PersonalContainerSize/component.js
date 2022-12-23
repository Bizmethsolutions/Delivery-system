import React, { PureComponent } from 'react'
import { CloseIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import ContainerIcon from '../../images/container-icon.png'
import './styles.scss'

export default class PersonalContainerSizeComponent extends PureComponent {

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
            <h5 className="text-card-heading-md font-niveaugrotesk">How can Curbside help you?</h5>
            <div className="d-flex justify-content-between font-graphik">
            <button className="btn btn-fill">Dumpster <span>(Need container longer than a day)</span></button>
            <button className="btn btn-outline">Live Load <span>(Need it just for a day) </span></button>
            </div>
            <div className="clearfix mb-4"></div>
            <div className="text-card-select">
              <label className="labels font-graphik">Container Size</label>
              <select className="selects custom-select font-graphik">
              <option>What size container to do you think you need? </option>
            </select>
            </div>
            <h5 className="text-card-md font-graphik font-500">10 Yard Container</h5>
            <img src={ContainerIcon} alt="curbside" />
            <h5 className="text-card-sm font-graphik">A <span className="font-500">10 Yard Container</span> can usually fit X</h5>
            <button className="fill-fullwidth-yellow mb-4 font-graphik">Next</button>
            <p className="font-graphik">Back to last step</p>
          </div>
        </div>
      </div>
    )
  }
}

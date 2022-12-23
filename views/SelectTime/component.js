import React, { PureComponent } from 'react'
import { CloseIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import ContainerIcon from '../../images/container-icon.png'
import MapIcon from '../../images/dummy-map1.png'
import './styles.scss'

export default class SelectTimeComponent extends PureComponent {

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
            <h5 className="text-card-heading-md font-niveaugrotesk">Let us know when to come</h5>
            <div className="clearfix mb-4"></div>

            <div className="text-card-select mb-2">
              <label className="labels font-graphik">Requested Date</label>
              <select className="selects custom-select font-graphik">
                <option>What date would you like us to drop off your container  </option>
              </select>
              <h5 className="text-card-select-md font-graphik">* Date will be allocated based on availability </h5>
            </div>

            <div className="text-card-select mb-2">
              <label className="labels font-graphik">Requested  Time</label>
              <select className="selects custom-select font-graphik">
                <option>What time would you like us to drop off your  container  </option>
              </select>
              <h5 className="text-card-select-md font-graphik">* Time will be based on city regulations, upon placing an order we’ll send you a confirmation with the exact date and time.</h5>
            </div>

            <div className="text-card-select mb-4">
              <label className="labels font-graphik">Special Instructions (optional)</label>
              <textarea className="textarea-custom font-graphik" placeholder="Enter in any special instructions"></textarea>
            </div>

            <button className="fill-fullwidth-yellow mb-4 font-graphik">Next</button>
            <p className="font-graphik">Back to last step</p>
          </div>
        </div>
      </div>
    )
  }
}

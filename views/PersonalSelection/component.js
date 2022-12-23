import React, { PureComponent } from 'react'
import { CloseIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import './styles.scss'

export default class PersonalSelectionComponent extends PureComponent {

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

        <div className="text-wrpper">
          <div className="text-card">
            <h5 className="text-card-heading-md font-niveaugrotesk">Start your Curbside Order</h5>
            <p className="text-card-subheading-md font-graphik">Already have a Curbside Account? <span className="anchorlink">Click here to login</span></p>
            <div className="d-flex justify-content-between font-graphik">
              <button className="btn btn-fill">Home</button>
              <button className="btn btn-outline">Business</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

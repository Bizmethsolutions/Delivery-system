import React, { PureComponent } from 'react'
import { CloseIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import ContainerIcon from '../../images/container-icon.png'
import MapIcon from '../../images/dummy-map1.png'
import './styles.scss'

export default class BusinessConfirmationFormComponent extends PureComponent {

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
            <h5 className="text-card-heading-md font-niveaugrotesk">Business Information</h5>
            <p className="order-placed-subheading font-graphik">Fill out the brief form below so one our team members can get you setup with an enterprise account</p>
            <div className="row mb-3">
              <div className="col-md-6 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">What’s the name of your company?</label>
                  <input type="text" placeholder="Enter company name" className="font-graphik inputs" />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">Contact Person</label>
                  <input type="text" placeholder="Enter first and last name" className="font-graphik inputs" />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">What number can we reach you on? </label>
                  <input type="text" placeholder="Enter your phone number" className="font-graphik inputs" />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">What’s your email address?</label>
                  <input type="text" placeholder="Enter your email address" className="font-graphik inputs" />
                </div>
              </div>
            </div>

            <div className="row mb-1">
              <div className="col-md-12 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">What’s the address of your company? </label>
                  <input type="text" placeholder="Enter company address" className="font-graphik inputs" />
                </div>
              </div>
            </div>
            <button className="fill-fullwidth-yellow mt-3 mb-3 font-graphik">Submit</button>
            <p className="font-graphik">Back to last step</p>
          </div>
        </div>
      </div>
    )
  }
}

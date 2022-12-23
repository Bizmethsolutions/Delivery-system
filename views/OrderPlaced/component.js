import React, { PureComponent } from 'react'
import { CloseIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import ContainerIcon from '../../images/container-icon.png'
import MapIcon from '../../images/dummy-map1.png'
import './styles.scss'

export default class OrderPlacedComponent extends PureComponent {

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
            <h5 className="text-card-heading-md font-niveaugrotesk">Order Placed!</h5>
            <p className="order-placed-subheading font-graphik">Thank you for your order. It has been successfully placed.</p>
            <p className="order-placed-subheading font-graphik">Your order number is <span className="font-500">(2203242)</span>.</p>
            <p className="order-placed-subheading font-graphik">We also sent you an email confirmation with all the details</p>
            <button className="fill-fullwidth-yellow mt-3 font-graphik">Take me home</button>
          </div>
        </div>
      </div>
    )
  }
}

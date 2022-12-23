import React, { PureComponent } from 'react'
import { CloseIcon, LockUpdateIcon, InfoUpdateIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import ContainerIcon from '../../images/container-icon.png'
import MapIcon from '../../images/dummy-map1.png'
import ErrorIcon from '../../images/error.svg'
import './styles.scss'

export default class OrderPlaceComponent extends PureComponent {

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
            <h5 className="text-card-heading-md font-niveaugrotesk">Place Order</h5>
            
            <div className="row mb-3">
              <div className="col-md-6 col-sm-12 pad-right-10">
                <div className="text-card-select">
                  <label className="labels font-graphik">What’s your first name and last name?</label>
                  <input type="text" placeholder="Enter your first name and last name" className="font-graphik inputs" />
                </div>
              </div>
              <div className="col-md-6 col-sm-12 pad-left-10">
                <div className="text-card-select">
                  <label className="labels font-graphik">What’s your phone  number ?</label>
                  <input type="text" placeholder="Enter your phone number" className="font-graphik inputs" />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">Email address?</label>
                  <input type="text" placeholder="Enter the email address you want the confirmation email to be sent to " className="font-graphik inputs" />
                </div>
              </div>
            </div>

            <div className="row mb-1">
              <div className="col-md-12 col-sm-12">
                <div className="form-group">
                  <div className="text-left">
                    <input type="checkbox" id="html" />
                    <label for="html">I’m the point of contact </label>
                  </div>
                </div>
                <hr className="greendivider" />
              </div>
            </div>

            <h4 className="orderplace-head">Point of Contact</h4>
            <h5 className="orderplace-subhead">Enter the information for the person that will be on site</h5>
            <div className="row mb-1">
              <div className="col-md-6 col-sm-12 pad-right-10">
                <div className="text-card-select">
                  <label className="labels font-graphik">What’s their first name and last name?</label>
                  <input type="text" placeholder="Enter their first name and last name" className="font-graphik inputs" />
                </div>
              </div>
              <div className="col-md-6 col-sm-12 pad-left-10 mb-2">
                <div className="text-card-select">
                  <label className="labels font-graphik">What’s their phone  number ?</label>
                  <input type="text" placeholder="Enter their phone number" className="font-graphik inputs" />
                </div>
              </div>
              <div className="col-md-12"><hr className="greendivider" /></div>
            </div>
            

            <h4 className="orderplace-head">Payment</h4>
            <h5 className="orderplace-subhead">We use Stripe to securely store and process your payment info. All transacation are secure and encrypted</h5>

            <div className="row mb-3">
              <div className="col-md-12 col-sm-12">
                <div className="text-card-select posi-rel">
                  <label className="labels font-graphik">Card Number</label>
                  <input type="text" placeholder="Enter your card number" className="font-graphik inputs" />
                  <span className="cardnumbericon"><LockUpdateIcon /></span>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">Name on Card</label>
                  <input type="text" placeholder="Enter the name on the card" className="font-graphik inputs" />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6 col-sm-12 pad-right-10">
                <div className="text-card-select">
                  <label className="labels font-graphik">Expiration date (MM/YY)</label>
                  <input type="text" placeholder="MM/YY" className="font-graphik inputs" />
                </div>
              </div>
              <div className="col-md-6 col-sm-12 pad-left-10">
                <div className="text-card-select posi-rel">
                  <label className="labels font-graphik">Security code</label>
                  <input type="text" placeholder="Enter your security code " className="font-graphik inputs" />
                  <span className="cardnumbericon"><InfoUpdateIcon /></span>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12 col-sm-12">
                <div className="text-card-select">
                  <label className="labels font-graphik">Coupon Code</label>
                  <div className="d-flex align-items-center">
                    <input type="text" placeholder="Enter coupon code " className="font-graphik inputs" />
                    <button className="btn-apply">Apply</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-details">
              <table>
                <tr>
                  <td>Base</td>
                  <td className="text-right">$100.00</td>
                </tr>
                <tr>
                  <td>Estimated Taxes</td>
                  <td className="text-right">$98.00</td>
                </tr>
                <tr>
                  <td>Total Price</td>
                  <td className="text-right">$198.00</td>
                </tr>
              </table>
            </div>

            <button className="fill-fullwidth-yellow mt-3 mb-3 font-graphik">Book</button>
            <p className="font-graphik">Back to last step</p>
          </div>
        </div>
      </div>
    )
  }
}

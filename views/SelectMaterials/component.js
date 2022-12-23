import React, { PureComponent } from 'react'
import { CloseIcon } from '../../components/icons'
import Logo from '../../images/curbside-logo.png'
import ContainerIcon from '../../images/container-icon.png'
import MapIcon from '../../images/dummy-map1.png'
import './styles.scss'

export default class SelectMaterialsComponent extends PureComponent {

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
            <h5 className="text-card-heading-md font-niveaugrotesk">What do you plan on putting inside your container</h5>
            <p className="order-placed-subheading font-graphik">Select all that apply</p>
            
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="checkbox-listing">
                  <ul>
                  <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Concrete </label>
                        </div>
                      </div>
                  </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Bricks, Masonry & Stone Products </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Metal </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Carpet & Padding / Foam </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Wood </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper checkbox-active">
                          <input type="checkbox" id="html" checked />
                          <label for="html">eWaste </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Cardboard and Paper </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Green Waste - Yard/Landscape </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Dirt </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Bathroom Demo  </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Glass </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Plastic </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Sheetrock </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Rock, Sand, and Gravel  </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Asphalt </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Appliance and Equipment  </label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="form-group">
                        <div className="checkbox-wrapper">
                          <input type="checkbox" id="html" />
                          <label for="html">Roofing </label>
                        </div>
                      </div>
                    </li>
                </ul>
                </div>
              </div>
            </div>





            <button className="fill-fullwidth-yellow mt-3 mb-3 font-graphik">Next</button>
            <p className="font-graphik">Back to last step</p>
          </div>
        </div>
      </div>
    )
  }
}

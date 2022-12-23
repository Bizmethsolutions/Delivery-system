import 'rxjs'
import React, { Component } from 'react'
import _ from 'lodash'
import BackArrowIcon from '../../images/back-arrow.svg'
import CancelArrowIcon from '../../images/cancel-icon.svg'
// import Label from '../../config/index';

class MoveCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
     truck: 'select',
     driver: '',
    }
  }
 
  handleChange(e) {
    this.setState({[e.target.name] : e.target.value})
  }
 
  componentDidMount = async() =>{

    if(this.props.status !== "unassigned") {
      this.setState({ truck: this.props.truckid, driver: this.props.driver })
    }
    
  }
  closepopup(){
    this.props.closepopup()
  }
  backPopup() {
    this.props.backPopup()
  }
  
  manualMove(){
    const self = this
    const truck = _.find(this.props.trucks, function(truck) {
      return String(truck.value) === String(self.state.truck)
    })
    const data = {
      driver: this.state.driver,
      truck: truck && truck.key
    }
    this.props.manualMoveCard(data)
  }
  render() {
  const {labels,getLabel } = this.props
   return (
      <div>
        <div className="card__label isOpen">
          <div className="card__label--header">
           <div className="back-label" onClick={() => this.backPopup()}><img src={BackArrowIcon} alt="curbside" width="16" /></div>
            <div className="card__label--title">Move Card</div>
           <div className="close-label" onClick={() => this.closepopup()}><img src={CancelArrowIcon} alt="curbside" width="12" /></div>
          </div>
          <div className="card__label--body">
            <div className="card__label--inner">
            {this.props.status !== "completed" && this.props.status !== "inprogress" ? 
              <div>
                <div className="board__card--popover-select">
                   <div className="form-group material-textfield">
                     <select className="form-control material-textfield-input custom-select" name="driver" value={this.state.driver} onChange={this.handleChange.bind(this)}>
                       <option value="select">Select Driver</option>
                    {this.props.drivers && this.props.drivers.map((driver, index) => {
                      return (
                        <option value={driver.id} key={driver.id}>{driver.name}</option>
                      )
                    })}
                  </select>
                     <label className="material-textfield-label">Select Driver</label>
                </div>
                 </div>
                {this.props.type !== "task" ? <div className="board__card--popover-select">
                   <div className="form-group material-textfield">
                     <select className="form-control material-textfield-input custom-select" name="truck" value={this.state.truck} onChange={this.handleChange.bind(this)}>
                  {this.props.trucks && this.props.trucks.map((truck, index) => {
                    return (
                      <option value={truck.value} key={index}>{truck.key}</option>
                    )
                  })}
                  </select>
                     <label className="material-textfield-label">Select Truck</label>
                   </div>
                </div> : "" }
              </div> : "" }
              {this.props.status !== "completed" && this.props.status !== "inprogress" ? 
               <button className="btn btn-dark w-100 btn-sm font-600" onClick={this.manualMove.bind(this)}>Save</button>
                : "" } 
            </div>
          </div> 
        </div>
      </div>
    )
  }
}

export default (MoveCard)

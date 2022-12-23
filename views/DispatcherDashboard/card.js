import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { message, Spin, Popover, Icon } from 'antd'
import ThreeDots from '../../images/three-dots.svg'
import EditIcon from '../../images/plus-icon.svg'
import PlusIcon from '../../images/right-arrow.svg'
import QueueIcon from '../../images/queue.svg'
import CardLabel from './cardLabel.js'
import MoveCard from './moveCard.js'
import './style.scss'
import _ from 'lodash'

const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />

class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      label: false
    }
    this.onlabelclicked=this.onlabelclicked.bind(this);
    this.manualMove = this.manualMove.bind(this)
    this.clicked = this.clicked.bind(this)
    this.closeDriverPopup = this.closeDriverPopup.bind(this)
    this.backPopup = this.backPopup.bind(this)
  }

  oncardClick(e) {
    this.props.oncardclick(this.props.id)
  }
  unableToComplete() {
    this.props.unableToComplete(this.props.id)
  }
  handleChange(e) {
    this.setState({[e.target.name] : e.target.value})
  }
  manualMove(data) {
    const obj = {
      truck: this.props.type === "task" ? "select" : data && data.truck,
      driver: data && data.driver,
      id: this.props.id,
      type: this.props.type
    }
    this.props.manualMove(obj)
    this.setState({ visible: false, label: false, cardVisible: false })
  }
  clicked() {
    const self = this
    if(this.props.type === "job") {
      const order = _.find(this.props.orders && this.props.orders.jobs, function(job) {
        return String(job.id) === String(self.props.id)
      })
      if(order && order.assigned !== false) {
        this.setState({ truck : order&& order.truck_id , driver : order&&order.driverId })
      }
    } else {
      const order = _.find(this.props.orders && this.props.orders.tasks, function(job) {
        return String(job.id) === String(self.props.id)
      })
      if(order && order.assigned !== false) {
        this.setState({  driver : order&&order.driverId })
      }
    }
    this.setState({ visible : !this.state.visible, cardVisible: false })
  }

  handleVisibleChange = visible => {
    this.setState({ visible, label: false, cardVisible: false });
  };

  onlabelclicked(){
    this.setState({label: !this.state.label, from : "" });
  }
  closeDriverPopup() {
    this.setState({ cardVisible: false, visible: false, label: false })
  }
  backPopup() {
    this.setState({ cardVisible: false })
  }
  getLabels() {
    this.props.getLabel()
  }
  getOrder() {
    const {getOrder} = this.props
    getOrder()
  }

  labelColor(){
    return(
      <CardLabel cardlabels={this.props.cardlabels} closeAllPopup={this.closeDriverPopup} createLabelData={this.props.createLabelData} from={this.state.from} type={this.props.type} clearPhaseLabel={this.props.clearPhaseLabel} apiCallfunction={() => this.apiCallfunction()} getOrder={() => this.getOrder()} cardid={this.props.id} closepopup={this.onlabelclicked} createLabel = {this.props.createLabel} getLabel = {this.getLabels} labels={this.props.labels} deleteLabel={this.props.deleteLabel} updateLabel={this.props.updateLabel} assignLabel={this.props.assignLabel} {...this.props}
      />
    );
  }
  MoveCard(){
    return(
      <MoveCard
        cardlabels={this.props.cardlabels}
        createLabelData={this.props.createLabelData}
        from={this.state.from}
        type={this.props.type}
        clearPhaseLabel={this.props.clearPhaseLabel}
        getOrder={() => this.getOrder()}
        cardid={this.props.id}
        closepopup={this.closeDriverPopup}
        backPopup={this.backPopup}
        driver={this.state.driver}
        truckid={this.state.truck}
        orders={this.props.orders}
        drivers={this.props.drivers}
        status={this.props.status}
        type={this.props.type}
        trucks={this.props.trucks}
        manualMoveCard={this.manualMove}
        {...this.props}/>
    );
  }

  onClickCardOpen() {
    this.setState({ cardVisible: !this.state.cardVisible })
  }

  render()  {
    return (
      <div status={ this.props.assigned === true && this.props.incompleted_by !== null  && this.props.incompleted_by !== undefined && this.props.status !== 'completed' ? "unabletocomplete" : this.props.status} className="board__card board" key={this.props.id}>
          <Popover placement="leftTop" trigger="click" visible={this.state.visible} onClick={this.clicked.bind(this)} onVisibleChange={this.handleVisibleChange.bind(this)} content={
            <div>
          <div className="padd-all">
              {this.props.status !== "completed" && this.props.status !== "inprogress" ? <Popover placement="bottomLeft" overlayClassName="card__label--container" content={this.MoveCard()} trigger="click" visible={this.state.cardVisible} onClick={this.onClickCardOpen.bind(this)} >
                <button className="btn btn-label">
                Move Card <img src={PlusIcon} alt="curbside" width="14" />
                </button>
              </Popover> : "" }
              <Popover placement="bottomLeft" overlayClassName="card__label--container" content={this.labelColor()} trigger="click" visible={this.state.label} onClick={this.onlabelclicked.bind(this)} >
                <button className="btn btn-label">
                Edit Labels <img src={EditIcon} alt="curbside" width="14" />
                </button>
              </Popover>
            </div>
            </div>
          } title="">
          <button className="board__card--more-icon"><img src={ThreeDots} alt="curbside" /></button>
          </Popover>
          <div className="board__card--info pr-1" onClick={this.oncardClick.bind(this)}>
            <ul className="card__label--color-list">
            {this.props.cardlabels && this.props.cardlabels.length > 0 && this.props.cardlabels.map((label,index) => {
                const eachlabel = _.find(this.props.labels, function(lb) {
                  return String(lb._id) === String(label)
                })
                if(eachlabel) {
                  return(
                    <li key={index} className={`label-global ${eachlabel.classname}`}>{eachlabel.title}</li>
                  )
                }
            })}
            </ul>

            {/* <button className="btn btn-urgent">Urgent</button> */}
              <h4>{this.props.title} {this.props.isQueueOrder ? <img src={QueueIcon} width="15" alt=""/> : ""}</h4>
              <p>{this.props.description}</p>
              {this.props.type !== "task" ? <p><span>Borough:</span> {this.props.borough}</p> : "" }
              {this.props.type !== "task" ? <p><span>Neighborhood:</span> {this.props.neighborhood}</p> : "" }
              {/* <p>Removal</p>
              <p>20 Yard</p> */}
              {/* <h5 className="unassigned">Unassigned</h5> */}
              {(this.props.container && this.props.container !== "Live Load") ?
                ((this.props.container && this.props.container === "1/2 Yard" && this.props.jobStatus === "Exchange") ?
                  <p>Mini Action</p>
                  :
                  ((this.props.container && this.props.container === "1/2 Yard") ?
                    <p>Mini Delivery</p>
                    :
                    <p>{this.props.isQueueOrder ? "Future " : ""}{this.props.jobStatus} {((this.props.orderIndex !== -1) ? this.props.orderIndex : "")}</p>
                  )
                )
                :
                ""
              }
              <p>{this.props.container}</p>
              {/* <ul className="card__label--color-list">
              {this.props.cardlabels && this.props.cardlabels.length > 0 && this.props.cardlabels.map((label,index) => {
                  const eachlabel = _.find(this.props.labels, function(lb) {
                    return String(lb._id) === String(label)
                  })
                  if(eachlabel) {
                    return(
                      <li className={eachlabel.classname} key={index}></li>
                    )
                  }
              })}
              </ul> */}
            {(this.props.assigned === true && this.props.incompleted_by !== null  && this.props.incompleted_by !== undefined && this.props.status !== 'completed') ?
              ""
              : [
                (this.props.status === "completed" ?
                  <div className="d-flex align-items-center task__status unassigned" key={this.props.status} status={this.props.status} onClick={this.oncardClick.bind(this)}>
                     Completed At&nbsp;<span className="text-lowercase">{this.props.completedAt}</span>
                  </div>
                :
                <div className="d-flex align-items-center task__status unassigned" key={this.props.status} status={this.props.status} onClick={this.oncardClick.bind(this)}>
                     {this.props.status === "inprogress" ? "in progress" : this.props.status}
                </div>
              )]
            }
          </div>
          {this.props.assigned === true && this.props.incompleted_by !== null  && this.props.incompleted_by !== undefined && this.props.status !== 'completed' ? <button className="btn unable__complate" onClick={this.unableToComplete.bind(this)}>Unable To Complete</button> : "" }
      </div>
      )
  }
}

export default Card

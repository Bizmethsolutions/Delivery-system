import 'rxjs'
import React, { Component } from 'react'

import BackArrowIcon from '../../images/back-arrow.svg'
import CancelArrowIcon from '../../images/cancel-icon.svg'
import EditIcon from '../../images/edit-icon.svg'


import _ from 'lodash'

// import Label from '../../config/index';
const colorArray = [
    {color: "#008000", className: "color-label--checkmark card-label-green"},
    {color: "#FFFF00", className: "color-label--checkmark card-label-yellow"},
    {color: "#FFA500", className: "color-label--checkmark card-label-orange"},
    {color: "#FF0000", className: "color-label--checkmark card-label-red"},
    {color: "#800080", className: "color-label--checkmark card-label-purple"},
    {color: "#0000ff", className: "color-label--checkmark card-label-blue"},
    {color: "#87ceeb", className: "color-label--checkmark card-label-sky"},
    {color: "#00FF00", className: "color-label--checkmark card-label-lime"},
    {color: "#FFC0CB", className: "color-label--checkmark card-label-pink"},
    {color: "#000000", className: "color-label--checkmark card-label-black"}

]

class CardLabelColor extends Component {
  constructor(props) {
    super(props)
    this.state = {
     title:'',
     colorcode:colorArray[0].color,
     classname:colorArray[0].className,
     id:0,
     from:'',label:[],editId:'',
     cardlabels: []
    }
    this.create=this.create.bind(this)
  }

  handleChange(e){
    this.setState({title: e.target.value});
  }
  handleClicked(i, e){
    this.setState({colorcode: colorArray[i].color, classname: colorArray[i].className, id: i});
  }

  create =async()=>{
    const {createLabel} = this.props;
    let obj ={};
    obj.title=this.state.title
    obj.colorcode=this.state.colorcode;
    obj.classname=this.state.classname;
    let { value } = await createLabel(obj)
    this.assignLabel(value.data)
    // this.setState({from: '',title: '',label:'', newLabelCreated: true})
    // this.props.apiCallfunction()
  }

  from(){
    this.setState({from: 'create',  colorcode:colorArray[0].color, classname:colorArray[0].className, id:0,});
  }

  edit(label){
    const findIndex = _.findIndex(colorArray, function(oldlabel) {
      return String(oldlabel.className) === String(label.classname)
    })
    this.setState({from: 'edit' , id: findIndex, title:label.title, label: label, editId:label._id, colorcode: colorArray[findIndex].color, classname: colorArray[findIndex].className})
  }

  saveLabel =async()=>{
    const {updateLabel} = this.props;
    let obj ={};
    obj.id=this.state.editId
    obj.title=this.state.title
    obj.colorcode=this.state.colorcode || this.state.label.colorcode
    obj.classname=this.state.classname || this.state.label.classname
    let { value } = await updateLabel(obj)

    this.props.apiCallfunction()
    this.closepopup()
    this.setState({from: '',title: '',label:''})
  }

  assignLabel = async(newLabel) => {
    let labels = this.props.cardlabels
    if(labels.indexOf(newLabel && newLabel.id) === -1) {
      labels.push(newLabel && newLabel.id)
    }
    var unique = labels.filter(function(elem, index, self) {
      return index === self.indexOf(elem)
    })

    const obj = {}
    obj.cardid = this.props.cardid
    obj.label = unique
    obj.cardType = this.props.type
    const { assignLabel } = this.props
    let { value } = await assignLabel(obj)
    this.setState({ newLabelCreated: false, from: "" })
    this.props.apiCallfunction()
  }

  // componentWillMount(){
  //   const {getLabel} = this.props;
  //   // getLabel();
  //   this.setState({from: '',title: '',label:'', cardlabels: this.props.cardlabels })
  // }

  // componentDidMount(){
  //   const {getLabel} = this.props;
  //   // getLabel();
  //   this.setState({from: '',title: '',label:''})
  // }

  // componentWillReceiveProps(np) {
  //   this.setState({ from: np.from })
  //   if(np.newlabel === true && this.state.newLabelCreated) {
  //     let labels = this.state.cardlabels
  //     if(labels.indexOf(np.createLabelData && np.createLabelData.id) === -1) {
  //       labels.push(np.createLabelData && np.createLabelData.id)
  //     }
  //     var unique = labels.filter(function(elem, index, self) {
  //       return index === self.indexOf(elem);
  //     })
  //     const obj = {}
  //     obj.cardid = this.props.cardid
  //     obj.label = unique
  //     obj.cardType = this.props.type
  //     const { assignLabel } = this.props
  //     assignLabel(obj)
  //     this.setState({ newLabelCreated: false })
  //   }
  // }

  deleteLabel(){
    this.setState({from: 'delete'})
  }

  searchLabel(e){
    const{getLabel} = this.props
    this.setState({searchlabel:e.target.value});
    getLabel(this.state.searchlabel)
    // console.log("serach:",this.state.searchlabel)
  }

  closepopup(){
    this.props.closeAllPopup()
  }

  handleCheckBoxChange = async(label, e)=> {
    let labels = this.props.cardlabels
    if(labels.indexOf(label._id) === -1) {
      labels.push(label._id)
    } else {
      let removeIndex = _.findIndex(this.props.cardlabels, function(lb) {
        return String(lb) === String(label._id)
      })
      labels.splice(removeIndex, 1);
    }
    var unique = _.filter(labels, function(elem, index, self) {
      return index === self.indexOf(elem);
    })
    this.setState({ cardlabels: unique })
    const obj = {}
    obj.cardid = this.props.cardid
    obj.label = unique
    obj.cardType = this.props.type
    const { assignLabel } = this.props
    let { value } = await assignLabel(obj)
    // this.setState({ newLabelCreated: false })
    this.props.apiCallfunction()
    // this.props.getOrder()
    // this.props.getLabel()
  }

  removeLabel = async()=> {
    const {deleteLabel,labels} = this.props
    const obj = {
      labelId: this.state.label._id
    }
    let { value } = await deleteLabel(obj)
    this.props.apiCallfunction()
    this.closepopup()
    this.setState({ from: "", title: "", label: "" })
  }

  backPopup() {
    if(this.state.from === "delete") {
      this.setState({from: '',title: '',label:''})
      const {closepopup}=this.props;
      closepopup();
    }
    else if(!(this.state.from === 'create' || this.state.from === 'edit')){
    this.setState({from: '',title: '',label:''})
    const {closepopup}=this.props;
    closepopup();
    }
    else{
      this.setState({from: '',title: '',label:''})
    }
  }
  render() {
  const {labels,getLabel } = this.props
   return (
      <div>
        <div className="card__label isOpen">
          <div className="card__label--header">
           <div className="back-label" onClick={() => this.backPopup()}><img src={BackArrowIcon} alt="curbside" width="16" /></div>
            <div className="card__label--title">Labels</div>
           <div className="close-label" onClick={() => this.closepopup()}><img src={CancelArrowIcon} alt="curbside" width="12" /></div>
          </div>
          <div className="card__label--body">
            {this.state.from === '' &&
            <div className="card__label--inner">
              {/* <div className="card__label--search">
                <input className="form-control" placeholder="Search labels..." value={this.state.searchlabel} onChange={this.searchLabel.bind(this)}  />
              </div> */}
             <div className="card__label--update uppercase-txt">LABELS</div>
              <ul className="card__label--list">
                {labels && labels.length > 0 && labels.map((label,index) => {
                return (<li key={index}>
                  <label className="color-label">
                    <span className="color-label--title">{label.title}</span>
                    <input className="color-label--input" type="checkbox" onChange={this.handleCheckBoxChange.bind(this, label)} checked={this.props.cardlabels && this.props.cardlabels.indexOf(label._id) === -1 ? false : true }/>
                    <span className={label.classname}></span>
                  </label>
                  <div className="card__label--edit" onClick={() => this.edit(label)}><img src={EditIcon} alt="curbside" width="16" /></div>
                </li>)}) }
              </ul>
             <button className="btn btn-dark w-100 btn-sm font-600" onClick={() => this.from()}>Create a New Label</button>
            </div>
            // :
              }
             {this.state.from === 'create' &&
             <div className="card__label--inner">
              {/* <div className="card__label--search">
                <h4>Label Name</h4>
                  <input className="form-control" placeholder="Label name" value={this.state.title} onChange={this.handleChange.bind(this)} />
              </div> */}
             <div className="form-group material-textfield">
               <input
                 type="text"
                 className="form-control material-textfield-input"
                 name="user_name"
                 value={this.state.title}
                 onChange={this.handleChange.bind(this)}
                 required />
               <label className="material-textfield-label">Label Name</label>
             </div>
             <div className="card__label--update uppercase-txt">Select a color</div>
              <ul className="card__label--create-list">
              {colorArray && colorArray.length !== 0 && colorArray.map((label,index) => {
                return (
                <li key={index}>
                  <label className="color-label">
                    <input className="color-label--input" type="radio" name="radio" checked={this.state.id === index ? true : false} onClick={this.handleClicked.bind(this, index)}/>
                    <span className={label.className}></span>
                  </label>
                </li>
                )
              })}
              </ul>
             <button className="btn btn-dark w-100 btn-sm font-600" onClick={() => this.create()}>Create</button>
            </div>
             }
             {this.state.from === 'edit' &&
             <div className="card__label--inner">
               <div className="form-group material-textfield">
                 <input
                   type="text"
                   className="form-control material-textfield-input"
                   name="user_name"
                   value={this.state.title}
                   onChange={this.handleChange.bind(this)}
                   required />
                 <label className="material-textfield-label">Update Label Name</label>
               </div>

                {/* <h4>Update Label Name</h4>
                  <input name = 'title' className="form-control" placeholder="Label name" value={this.state.title} onChange={this.handleChange.bind(this)} /> */}

             <div className="card__label--update uppercase-txt">Select a color</div>
              <ul className="card__label--create-list">
              {colorArray && colorArray.length !== 0 && colorArray.map((label,index) => {
                return (
                <li key={index}>
                  <label className="color-label">
                    <input className="color-label--input" type="radio" name="radio" checked={this.state.id === index ? true : false} onClick={this.handleClicked.bind(this, index)}/>
                    <span className={label.className}></span>
                  </label>
                </li>
                )
              })}
              </ul>
              <div className="d-flex align-items-center justify-content-between">
               <button className="btn btn-success w-100 btn-sm font-600" onClick={()=>this.saveLabel()}>Save</button>
               <button className="btn btn-danger w-100 btn-sm font-600 ml-2" onClick={() => this.deleteLabel()}>Delete</button>
              </div>
            </div>
             }
             {this.state.from === 'delete' &&
             <div className="card__label--inner">
               <div className="card__label--update uppercase-txt">Delete Label?</div>
              <p>There is no undo. This will remove this label from all cards and destroy its history.</p>
             <button className="btn btn-danger w-100 btn-sm font-600" onClick={() => this.removeLabel()}>Delete</button>
              </div> }
          </div>

        </div>
      </div>
    )
  }
}

export default (CardLabelColor)

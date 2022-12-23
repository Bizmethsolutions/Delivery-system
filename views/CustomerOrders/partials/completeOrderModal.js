import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Dropzone from 'react-dropzone'
import CurrencyInput from "react-currency-input"

import AddressAutoComplete from '../../../components/AddressAutoComplete'
import AddCardModal from './addCardModal'
import CardList from './cardComponent'
import { calculationArray, formatOrderAddess, formatPhoneNumber, getTimeInDayAndHours,formatNumber, getDateMMDDYYYHHMM, getDay, getDate, getContainerSize, getAllowedTons, calculatePrice, getFormatedDateAndTimeWithoutUTC, getFormatedDateAndTimeByUTC } from '../../../components/commonFormate'
import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'
import MapComponent from '../../../components/map'
import config from '../../../config'

import minusIcon from '../../../images/minusIcon.svg'
import plusIcon from '../../../images/plusIcon.svg'
import MultiSelectCheckBox from '../../../components/multiSelectCheckBox';
const { TabPane } = Tabs;
const { Option } = Select;

const timezoneKey = config.timezone_api_key.api_key;
const timezoneApi = config.timezone_api_key.api_url;
const phoneNumberMask = config.phoneNumberMask

export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      haulerList: [],
      err: {},
      city: '',
      address: '',
      state: '',
      zipcode: '',
      new_address: '',
      borough: '',
      neighborhood: '',
      couponCode: '',
      location: {},
      street_no: '',
      route: '',
      geoPlaceId: '',
      floor: '',
      contactnumber: '',
      contactname: '',
      permit: '',
      pdf: [],
      dump: "",
      dumpsite: "",
      deliveryday: "", deliverydate: "",
      typeofdebris: [], containersize: "",
      parking: '', location: "",
      purchaseorderno: "", permit: '',
      contactname: "", contactnumber: "",
      consumercost: "", haulercompany: "",
      specialinstruction: "", containerlocation: "", paymenttype: "",
      orderedby: "", orderedbycontact: "",
      additionalEmail: [],
      containerList: [],
      liveOrder: 0,
      half_yrd_qty: 0,
      messageShown: true,
      otherContainerLocation: "",
      exception: { status: false, msg: [] },
      divTag: [],
      otherSelect: true,
      price: 0,
      yardagecalculated : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        tonnagecalculated : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        tonnagepercentage : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        tonnageweight : [
        {key: "waste" , value: 0},
        {key: "brick" ,value: 0},
        {key: "dirt" , value: 0},
        {key: "concrete" , value: 0},
        {key: "cleanwood" , value: 0},
        {key: "metal" , value: 0},
        {key: "paper_cardboard" , value: 0},
        {key: "plastic" ,value: 0},
        {key: "drywall" , value: 0},
        {key: "glass" ,value: 0},
        {key: "asphalt" , value: 0}],
        dumpticketnumber: "",
        waste: "",
        brick: "",
        dirt: "",
        concrete: "",
        cleanwood: "",
        metal: "",
        cardId: "",
        paper_cardboard: "",
        plastic: "",
        drywall: "",
        glass: "",
        asphalt: "",
        totalpercentage: 0,
        recyclingpercentage: 0,
        residualpercentage: 0,
        weight_total: 0,
        weight: "",
        additionaltons: "",
        cost: '',
        loadervisible: false
    };
    //this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.updateCardId = this.updateCardId.bind(this)
  }

  componentDidMount = async()=> {
    const {orderDataForComplete} = this.props
    this.setState({
      city: _.get(orderDataForComplete, 'city', ''),
      address: _.get(orderDataForComplete, 'address', ''),
      status: _.get(orderDataForComplete, 'status', ''),
      state: _.get(orderDataForComplete, 'state', ''),
      zipcode: _.get(orderDataForComplete, 'zipcode', ''),
      new_address: _.get(orderDataForComplete, 'new_address', ''),
      borough: _.get(orderDataForComplete, 'borough', ''),
      neighborhood: _.get(orderDataForComplete, 'neighborhood', ''),
      street_no: _.get(orderDataForComplete, 'street_no', ''),
      route: _.get(orderDataForComplete, 'route', ''),
      geoPlaceId: _.get(orderDataForComplete, 'geoPlaceId', ''),
      floor: _.get(orderDataForComplete, 'floor', ''),
      contactnumber: _.get(orderDataForComplete, 'contactnumber', ''),
      permit: _.get(orderDataForComplete, 'permit', 'false') ? 'yes' : 'no',
      location: _.get(orderDataForComplete, 'location', ''),
      purchaseorderno: _.get(orderDataForComplete, 'purchaseorderno', ''),
      timezone: _.get(orderDataForComplete, 'timezone', ''),
      consumercost: _.get(orderDataForComplete, 'consumercost', ''),
      totalcost: _.get(orderDataForComplete, 'consumercost', ''),
      haulercompany: _.get(orderDataForComplete, 'haular.company_name', ''),
      specialinstruction: _.get(orderDataForComplete, 'specialinstruction', ''),
      containerlocation: _.get(orderDataForComplete, 'containerlocation', ''),
      otherContainerLocation: _.get(orderDataForComplete, 'otherContainerLocation', ''),
      paymenttype: _.get(orderDataForComplete, 'paymenttype', ''),
      orderedby: _.get(orderDataForComplete, 'orderedby', ''),
      orderedbycontact: _.get(orderDataForComplete, 'orderedbycontact', ''),
      pricingtype: _.get(orderDataForComplete, 'pricingtype', ''),
      additionalEmail: _.get(orderDataForComplete, 'additionalEmail', ''),
      containersize: _.get(orderDataForComplete, 'container', ''),
      typeofdebris: _.get(orderDataForComplete, 'typeofdebris', ''),
      parking: _.get(orderDataForComplete, 'parking', ''),
      paymenttype: _.get(orderDataForComplete, 'paymenttype', ''),
      orderedby: _.get(orderDataForComplete, 'orderedby', ''),
      half_yrd_qty: _.get(orderDataForComplete, 'half_yrd_qty', ''),
      live_load_yard: _.get(orderDataForComplete, 'live_load_yard', ''),
      haular: _.get(orderDataForComplete, 'haular', ''),
      haularDetail: _.get(orderDataForComplete, 'haular', ''),
      orderid: _.get(orderDataForComplete, 'orderid', ''),
      dumpsite: _.get(orderDataForComplete, 'dump.id', ''),
      geoPlaceId: _.get(orderDataForComplete, 'geoPlaceId', ''),
      otherDebris: _.get(orderDataForComplete, 'otherDebris', []),
    }, () => {
      this.updateCustomer()
    })
    let divTag = []
    _.get(orderDataForComplete, 'otherDebris', []).map((other)=>{
      divTag.push({ otherDebris: other })
    })
    this.setState({ divTag })
    let data = {
      limit: undefined, by: undefined, page: undefined, sort_field: ''
    }
  }

  // closeModal() {
  //   this.props.closeModal()
  // }
  closeModal() {
    const tab = _.get(this.props, 'location.state.c', 'active')
    const customerid = this.props.match.params.id
    this.props.history.push(`/customer-orders/live/${customerid}`)
    this.props.closeModal()
  }

  isFloat(n){
      return Number(n) === n && n % 1 !== 0;
  }

  decimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
         0,
         // Number of digits right of decimal point.
         (match[1] ? match[1].length : 0)
         // Adjust for scientific notation.
         - (match[2] ? +match[2] : 0));
}
onchange(field, value) {
    const twodecimal = /^\d*\.?\d{0,2}$/;
    var isnum = /^\d+$/.test(value);
    const isdecimal=/^\d+(\.\d{2})?$/;
        switch (field) {
        case 'dumpsite':
            this.setState({ dumpsite: value });
            break;
        case 'weight':
            this.setState({ weight: value }, () => {
                this.calculateforall()
                this.forceUpdate()
            });
            break;
        case 'totalcost':
            let totalcost = value ? value.replace('$', "") : "";
            this.setState({ totalcost: totalcost.trim() });
            break;
        case 'cost':
            let cost = value ? value.replace('$', "") : "";
            this.setState({ cost: cost.trim() });
            break;
        case 'dumpticketnumber':
            this.setState({ dumpticketnumber: value});
            break;
        case 'waste':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ waste: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getResidualPercentage()
                    this.getWeightTotal()
                })
            }
            break;
        case 'brick':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ brick: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'dirt':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ dirt: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'concrete':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ concrete: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                });
            }
            break;
        case 'cleanwood':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ cleanwood: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                });
            }
            break;
        case 'metal':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ metal: value && value.match(twodecimal) ? value : ""}, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'paper_cardboard':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ paper_cardboard: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'plastic':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ plastic: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'drywall':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ drywall: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'glass':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ glass: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.calculateforall()
                    this.getWeightTotal()
                })
            }
            break;
        case 'asphalt':
            if(this.decimalPlaces(value) <= 2) {
                this.setState({ asphalt: value && value.match(twodecimal) ? value : "" }, () => {
                    this.getTotalPercentage()
                    this.getRecyclingPercentage()
                    this.getWeightTotal()
                    this.calculateforall()
                })
            }
            break;
    }
}
getContainerName(containerId) {
  let containerObj = this.props.containerList
  let containerLen = containerObj.length
  for (let i = 0; i < containerLen; i++) {
    if (containerObj[i]._id === containerId)
      return containerObj[i].size
  }
}
calculateforall() {
    const self = this
    const yardagecalculated = this.state.yardagecalculated
    const tonnagecalculated = this.state.tonnagecalculated
    let sum_of_all_tonnage = 0
    const arr = ['waste', 'brick', 'dirt', 'concrete', 'cleanwood','metal', 'paper_cardboard', 'plastic', 'drywall', 'glass' ,'asphalt']
    _.forEach(arr, function(item) {
        let calculationarray = calculationArray()
        let itemValue = self.state[item]
        const yard = self.getContainerValue(self.getContainerName(self.props.orderDataForComplete.container))
        let yardIndex = _.findIndex(yardagecalculated, function(y) {
            return y.key === item
        })
        let tonnageIndex = _.findIndex(tonnagecalculated, function(y) {
            return y.key === item
        })
        let calculationIndex = _.findIndex(calculationarray, function(y) {
            return y.key === item
        })
        if(itemValue === "") {
            itemValue = parseFloat(0)
        }
        if(yardIndex !== -1) {
            yardagecalculated[yardIndex].value = parseFloat((parseFloat(yard) * parseFloat(itemValue)) / 100)
        }
        if(tonnageIndex !== -1) {
            tonnagecalculated[tonnageIndex].value = parseFloat((parseFloat(yardagecalculated[yardIndex].value) * parseFloat(calculationarray[calculationIndex].tonnage)))
            sum_of_all_tonnage += parseFloat(tonnagecalculated[tonnageIndex].value)
        }
    })
    _.forEach(arr, function(a) {
        self.calculate(a, sum_of_all_tonnage, tonnagecalculated, yardagecalculated)
    })
}
getContainerValue(value) {
    const container = value
    if(container === "10 Yard") {
        return 10
    } else if(container === "15 Yard") {
        return 15
    } else if(container === "20 Yard") {
        return 20
    } else if(container === "30 Yard") {
        return 30
    } else if (container === "Live Load") {
        return parseFloat(this.props.orderDataForComplete.live_load_yard)
    } else if (container === "1/2 Yard") {
        return parseFloat(this.props.orderDataForComplete.half_yrd_qty)
    }
}
calculate(item, sum_of_all_tonnage, tonnagecalculated, yardagecalculated ) {
    let calculationarray = calculationArray()
    const tonnagepercentage = this.state.tonnagepercentage
    const tonnageweight = this.state.tonnageweight
    let itemValue = this.state[item]
    //const yard = 30 //this.getContainerValue(this.props.orderDataForComplete.container)
    // let calculationIndex = _.findIndex(calculationarray, function(y) {
    //     return y.key === item
    // })
    let tonnagepercentageIndex = _.findIndex(tonnagepercentage, function(y) {
        return y.key === item
    })
    let tonnageIndex = _.findIndex(tonnagecalculated, function(y) {
        return y.key === item
    })
    let tonnageweightIndex = _.findIndex(tonnageweight, function(y) {
        return y.key === item
    })
    if(itemValue === "") {
        itemValue = parseFloat(0)
    }
    if(tonnagepercentageIndex !== -1) {
        if(sum_of_all_tonnage !== 0) {
            sum_of_all_tonnage = parseFloat(sum_of_all_tonnage)
            const tonnage = tonnagecalculated[tonnageIndex].value
            const cal = tonnage / sum_of_all_tonnage
            tonnagepercentage[tonnagepercentageIndex].value = parseFloat(cal * 100)
        } else {
            tonnagepercentage[tonnagepercentageIndex].value = 0
        }
        if(isNaN(tonnagepercentage[tonnagepercentageIndex].value)) {
            tonnagepercentage[tonnagepercentageIndex].value = 0
        }
    }
    if(tonnageweightIndex !== -1) {
            tonnageweight[tonnageweightIndex].value = parseFloat((parseFloat(tonnagepercentage[tonnagepercentageIndex].value) * parseFloat(this.state.weight)) /100)
            tonnageweight[tonnageweightIndex].value = parseFloat((tonnageweight[tonnageweightIndex].value).toFixed(2))
            if(isNaN(tonnageweight[tonnageweightIndex].value)) {
                tonnageweight[tonnageweightIndex].value = 0
            }
    }
    this.setState({ yardagecalculated, tonnagecalculated, tonnagepercentage, tonnageweight }, () => {
        this.getTotalPercentage()
        this.getRecyclingPercentage()
        this.getResidualPercentage()
        this.getWeightTotal()
    })
}

getContainerSize(id) {
    if (this.props.containerList) {
        let master = this.props.containerList;
        for (let index = 0; index < master.length; index++) {
            let element = master[index];
            if (String(element._id) === String(id)) {
                return element.size;
            }
        }
    }
}

getTotalPercentage(){
    let sum = 0;
    const {waste, brick, dirt, concrete, plastic, glass,
           metal, cleanwood, paper_cardboard, drywall,
           asphalt} = this.state;
            sum = parseFloat(waste !== "" ? waste : 0 ) +  parseFloat(brick !== "" ? brick : 0 )
                + parseFloat(dirt !== "" ? dirt : 0 ) + parseFloat(concrete !== "" ? concrete : 0 )
                  + parseFloat(plastic !== "" ? plastic : 0 ) + parseFloat(glass !== "" ? glass : 0 ) +
                  parseFloat(metal !== "" ? metal : 0 ) + parseFloat(cleanwood !== "" ? cleanwood : 0 ) +
                  parseFloat(paper_cardboard !== "" ? paper_cardboard : 0 ) + parseFloat(drywall !== "" ? drywall : 0 )
                  + parseFloat(asphalt !== "" ? asphalt : 0 );

    if(sum > 0) {
        this.setState({ totalpercentage: Math.round(sum * 100) / 100})
    } else {
        this.setState({ totalpercentage: 0 })
    }
}

getWeightTotal() {
    let weight_total = 0
    const { tonnagepercentage } = this.state
    _.forEach(tonnagepercentage, function(tonnageper) {
        weight_total += Math.round(parseFloat(tonnageper.value))
    })
    this.setState({ weight_total: parseFloat(weight_total) })
}

getRecyclingPercentage(){
    let sum=0;
    const {tonnagepercentage} = this.state;
    if(tonnagepercentage.length !== 0) {
        this.setState({ recyclingpercentage: (parseFloat(this.state.totalpercentage) - parseFloat(tonnagepercentage[0].value)) })
    } else {
        this.setState({ recyclingpercentage: 0 })
    }
}

getResidualPercentage(){
    let sum=0;
    const {tonnagepercentage} = this.state;
    if(tonnagepercentage.length !== 0) {
        this.setState({ residualpercentage:  tonnagepercentage[0].value})
    }  else {
        this.setState({ residualpercentage: 0})
    }
}

checkForEmpty(value, fieldname, exceptionList) {
  if(fieldname === "Card Number") {
    if (value === "select" || value === "") {
      exceptionList.push(`Please select valid ${fieldname}`);
    }
  } else {
    if (!value || value === "" || value === "0" || value === 0) {
        exceptionList.push(`Please enter valid ${fieldname}`);
    }
  }
}

checkForNumber(value, fieldname, exceptionList) {
    if (isNaN(value)) {
        exceptionList.push(`Please enter valid ${fieldname} Number`);
    }
}

validate = async() => {
    const user = localStorage.loggedInUser ? JSON.parse(localStorage.loggedInUser) : null
    const timezoneOfUser = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
    let orderDate = moment().tz(timezoneOfUser).format('MM-DD-YYYY')
    let exception = [];
    const container = this.getContainerSize(this.state.containersize)
    this.checkForNumber(this.state.totalcost ? this.state.totalcost.toString().replace(/,/g, '') : '', "Total Cost", exception);
    this.checkForNumber(this.state.cost, "Cost", exception);
    this.checkForEmpty(this.state.dumpsite, "Dump site", exception);
    // if(container !== "1/2 Yard") {
      this.checkForEmpty(this.state.weight, "Weight (tons)", exception);
      this.checkForEmpty(this.state.dumpticketnumber, "Dump Ticket Number", exception);
    // }
    if(this.state.additionaltons !== 0 && this.state.additionaltons !== "") {
      this.checkForEmpty(this.state.cardId, "Card Number", exception);
    }
    if(!this.state.totalcost || this.state.totalcost == 0 || this.state.totalcost == "" || this.state.totalcost == "0") {
      this.checkForEmpty(this.state.totalcost, "Total Cost", exception);
    }
    const { completeOrder } = this.props
    let dumpticketnumber = ""
    // if(this.state.dumpticketnumber !== undefined) {
    //     dumpticketnumber = this.state.dumpticketnumber
    // }
    // if(dumpticketnumber === ""){
    //     exception.push(`Please enter valid dump ticket number`)
    // }
    if (exception.length > 0) {
        this.setState({ exception: { status: true, msg: exception } });
    } else {
        let status = "";
        let dump = {}
        this.props.statusList.forEach(function (element) {
            if (element.status === "Complete") {
                status = element._id;
            }
        }, this);
        this.props.dumps.forEach(function (element) {
            if (String(element.id) === String(this.state.dumpsite)) {
              dump = element;
            }
        }, this);
        //Remove Pickup and Completion date after Remove Db Validation
        let order = this.props.orderDataForComplete;
        let debrisArr = []
        let otherDebrisArray = []
        if (Array.isArray(_.get(this.state, 'typeofdebris', []))) {
          order.typeofdebris = this.state.typeofdebris
          order.otherDebris = this.state.otherDebris
        } else {
          debrisArr.push("Other")
          order.typeofdebris = debrisArr
          otherDebrisArray.push(this.state.typeofdebris)
          order.otherDebris = otherDebrisArray
        }
        order.dumpcost = this.state.cost;
        order.status = status;
        order.weight = this.state.weight;
        order.dump = dump;
        order.consumercost= this.state.totalcost ? this.state.totalcost.toString().replace(/,/g, '') : '';
        order.ctccost = parseInt(this.state.cost) + parseInt(this.state.totalcost);
        order.dumpticketnumber=this.state.dumpticketnumber;

        let completiondate = (new Date()).toISOString();
        //let completiondate = DateUtility.toISOLocal(new Date())
        order.completiondate = completiondate;
        let obj = {};
        obj.waste=this.state.waste !== "" ? parseFloat(this.state.waste) : 0;
        obj.brick=this.state.brick !== "" ? parseFloat(this.state.brick) : 0;
        obj.dirt=this.state.dirt !== "" ? parseFloat(this.state.dirt) : 0;
        obj.concrete=this.state.concrete !== "" ? parseFloat(this.state.concrete) : 0;
        obj.cleanwood=this.state.cleanwood !== "" ? parseFloat(this.state.cleanwood) : 0;
        obj.metal=this.state.metal !== "" ? parseFloat(this.state.metal) : 0;
        obj.paper_cardboard=this.state.paper_cardboard !== "" ? parseFloat(this.state.paper_cardboard) : 0;
        obj.plastic=this.state.plastic !== "" ? parseFloat(this.state.plastic) : 0;
        obj.drywall=this.state.drywall !== "" ? parseFloat(this.state.drywall) : 0;
        obj.glass=this.state.glass !== "" ? parseFloat(this.state.glass) : 0;
        obj.asphalt=this.state.asphalt !== "" ? parseFloat(this.state.asphalt) : 0;
        obj.weight_total=this.state.weight_total !== "" ? parseFloat(this.state.weight_total) : 0;
        obj.yardagecalculated=this.state.yardagecalculated
        obj.tonnagecalculated=this.state.tonnagecalculated;
        obj.tonnagepercentage=this.state.tonnagepercentage;
        obj.tonnageweight=this.state.tonnageweight;
        obj.totalpercentage=this.state.totalpercentage;
        obj.recyclingpercentage=this.state.recyclingpercentage;
        obj.residualpercentage=this.state.residualpercentage;
        order.sustainabilityinformation=obj;
        order.uploadedpdf = this.state.pdf.length !== 0 ? this.state.pdf : []
        order.ordereddate = orderDate
        order.additionaltons = this.state.additionaltons !== "" ? this.state.additionaltons : 0
        const data = {
          order: order,
          cardId: this.state.cardId,
          customerId: _.get(this.props.orderDataForComplete, 'customer', ''),
          orderId: order.id,
          amount: this.state.price,
          couponCode: this.state.couponCode
        }
        delete order.queue_exchange_orders
        delete order.queue_removal_orders
        delete order.connectedOrders
        const {value} = await completeOrder(data)
        if(value.statusCode !== 400) {
          this.closeModal();
        } else {
          this.setState({ errMessage: _.get(value, 'message', 'Error in processing request')})
        }

        //this.props.onpositiveclick(order);
        //this.close();
    }
}

getExceptionListItem() {
  return this.state.exception && this.state.exception.msg.map((node, index) => {
      return (<li className="text-danger" key={index}> {node} </li>);
  });
}
updateCardId(cardId, amount) {
  this.setState({ cardId, amount })
}
displayException() {
  if (this.state.exception && this.state.exception.status) {
      return (
          <ul className="error-msg ul_style">
              {this.getExceptionListItem()}
          </ul>
      );
  }
}

cancel() {
    this.setState({ confirm: true })
}


close() {
    this.setState({
        dumpsite: "",
        totalcost: "",
        cost: "",
        dumpticketnumber: "",
        waste: "",
        weight_total: 0,
        brick:  "",
        dirt:  "",
        concrete:  "",
        cleanwood:  "",
        metal:  "",
        paper_cardboard:  "",
        plastic:  "",
        drywall:  "",
        glass:  "",
        other:  "",
        asphalt:  "",
        totalpercentage: 0,
        recyclingpercentage: 0,
        residualpercentage: 0,
        weight: "",
        yardagecalculated : [
            {key: "waste" , value: 0},
            {key: "brick" ,value: 0},
            {key: "dirt" , value: 0},
            {key: "concrete" , value: 0},
            {key: "cleanwood" , value: 0},
            {key: "metal" , value: 0},
            {key: "paper_cardboard" , value: 0},
            {key: "plastic" ,value: 0},
            {key: "drywall" , value: 0},
            {key: "glass" ,value: 0},
            {key: "asphalt" , value: 0}],
        tonnagecalculated : [
            {key: "waste" , value: 0},
            {key: "brick" ,value: 0},
            {key: "dirt" , value: 0},
            {key: "concrete" , value: 0},
            {key: "cleanwood" , value: 0},
            {key: "metal" , value: 0},
            {key: "paper_cardboard" , value: 0},
            {key: "plastic" ,value: 0},
            {key: "drywall" , value: 0},
            {key: "glass" ,value: 0},
            {key: "asphalt" , value: 0}],
        tonnagepercentage : [
            {key: "waste" , value: 0},
            {key: "brick" ,value: 0},
            {key: "dirt" , value: 0},
            {key: "concrete" , value: 0},
            {key: "cleanwood" , value: 0},
            {key: "metal" , value: 0},
            {key: "paper_cardboard" , value: 0},
            {key: "plastic" ,value: 0},
            {key: "drywall" , value: 0},
            {key: "glass" ,value: 0},
            {key: "asphalt" , value: 0}],
        tonnageweight : [
            {key: "waste" , value: 0},
            {key: "brick" ,value: 0},
            {key: "dirt" , value: 0},
            {key: "concrete" , value: 0},
            {key: "cleanwood" , value: 0},
            {key: "metal" , value: 0},
            {key: "paper_cardboard" , value: 0},
            {key: "plastic" ,value: 0},
            {key: "drywall" , value: 0},
            {key: "glass" ,value: 0},
            {key: "asphalt" , value: 0}],
        exception: { status: false, msg: [] }
    })
    // this.setState({
    //     containersize: "", typeofdebris: "",
    //     totalcost: "", cost: "",
    //     haulercompany: "", dumpsite: "",
    //     weight: "", confirm: false,
    //     exception: { status: false, msg: [] }
    // });
    this.setState({ pdf: [], fileError: "" })
    this.props.close();
}

onDrop = async (files) => {
    const findIndex = _.findIndex(files, function(file) {
        return file.type !== "application/pdf"
    })
    if(findIndex === -1) {
        const pdf = []
        this.setState({loadervisible:true})
        const formdata = new FormData()
        _.forEach(files, (file, i) => {
            pdf.push(file)
            formdata.append(`files`, file)
        })
        const { value } = await this.props.uploadFile(formdata)
        if(value) {
          this.setState({pdf:_.get(value, 'data', []), fileError: "", loadervisible:false })
        }
        //this.setState({pdf:pdf, fileError: "" })
        //this.props.uploadFile(formdata)
    } else {
        this.setState({ fileError: "Please upload pdf file only.", pdf: [], loadervisible:false })
    }
}
focus(e) {
    if(e.target.value === "0") {
        this.setState({ [e.target.name] : ""})
    }
}
blur(e) {
    if(e.target.value === "") {
        this.setState({ [e.target.name] : "0"})
    }
}
openAddCard() {
  this.setState({ openCard: true })
}

updateCustomer = async() => {
  let data = {
    search_string: "",
    //limit: 20,
    by: 1,
    //page: 0,
    sort: ''
  }
  let { value } = await this.props.fetchCustomers(data)
  if (_.get(value, 'customers', []).length > 0) {
    let idx = _.get(value, 'customers', []).findIndex(obj => obj.customerid === this.props.customerId)
    let selectedCustomer =  value.customers[idx]
    this.setState({ selectedCustomer })
  }
}

closeCardModal() {
  this.setState({ openCard: false }, ()=> {
    this.updateCustomer()
  })
}

onHandleChange (e) {
  const twodecimal = /^\d*\.?\d{0,2}$/;
  if(e.target.name === "additionaltons") {
    this.setState({ [e.target.name]: e.target.value && e.target.value.match(twodecimal) ? e.target.value : ""  }, () => {
      this.calculateAdditional(this.state.additionaltons)
    })
  } else {
    this.setState({ [e.target.name]: e.target.value })
    //this.props.updateCardId(e.target.value, this.state.amount)
  }
}

calculateAdditional(tons) {
  const cont = this.getContainerSize(this.props.orderDataForComplete.container)
  const cal = calculatePrice(tons, cont)
  this.setState({ rate: cal.rate, price: cal.price})
}

applyCouponCode = async() => {
  const { couponCode } = this.state
  const { applyCoupon } = this.props
  const obj = {
    couponCode,
    customerId: this.state.selectedCustomer && this.state.selectedCustomer.id
  }
  try {
    this.calculateAdditional(this.state.additionaltons)
    const { value } = await applyCoupon(obj)
    if(value) {
      var discount = 0
      var price = this.state.price
      if(value && value.data.percent_off !== null) {
        discount = (value.data.percent_off * this.state.price)/100
        price = price - discount
      }
      if(value && value.data.amount_off !== null) {
        discount = value.data.amount_off
        price = price - discount
      }
      this.setState({ discount, price, errMessage: "" })
    }
  } catch (e){
    this.setState({ errMessage: _.get(e, 'error.message', 'Invalid Coupon')})
  }

}

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDataForComplete.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
  }

  handleChangeMoney(event, maskedvalue, floatvalue) {
    if (maskedvalue === '0' || maskedvalue === '') {
      this.setState({ [event.target.name]: '' }, () => {
       })
    } else {
      this.setState({ [event.target.name]: maskedvalue }, () => {
      })
    }
  }

  formatNumber(number) {
    const nfObject = new Intl.NumberFormat('en-US');
    const output = nfObject.format(number);
    return output
  }

  render() {
    const { isViewModalOpen, isEditModalOpen, err, pdf, selectedCustomer } = this.state
    const { orderDataForComplete, user } = this.props
    const container = this.getContainerSize(orderDataForComplete.container)
    const getallowedtons = getAllowedTons(container)
    let created = orderDataForComplete.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderDataForComplete.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderDataForComplete.createdat)
    return (
      <div>
        { this.state.loadervisible ?
          <div className="fullpage-loader">
            <span className="loaderimg">
                <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </span>
          </div> :
        "" }
        {/* order modal open */}
        <ReactModal
          isOpen={this.props.completeModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-full react-modal-dialog-centered">
            <div className="react-modal-header d-flex align-items-center">
              <div>
                <h5 className="react-modal-title">Complete</h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span> {_.get(orderDataForComplete, 'created.name', '') !== '' ? _.get(orderDataForComplete, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
              </div>
              <div className="marg-left-auto">
                {/* <button className="btn btn-dark btn-md mr-4 font-800">Draft</button> */}
                <button type="button" className="btn react-modal-close pos-static" onClick={this.closeModal}><CloseIcon /></button>
              </div>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">


              <div className="row">
                <div className="col-md-12">
                  <ul className="order-listing subs-list minuslist">
                    <li>
                      <div className="form-group material-textfield material-textfield-select">
                        <select name ="containersize" disabled value={this.state.containersize} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                          <option>Select Container Size</option>
                          { _.get(this.props, 'containerList', []).map((container, i)=>{
                              return (
                                <option key={i} value={container._id}>{container.size}</option>
                              )
                            })
                          }
                        </select>
                        <label className="material-textfield-label">Container Size <span className="text-danger">*</span></label>
                          <p className="text-danger">{err && err.containersize ? err.containersize : ""}</p>
                      </div>
                    </li>
                    {/* <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="typeofdebris"
                          value={this.state.typeofdebris}
                          onChange={this.onHandleChange.bind(this)}
                          required />
                        <label className="material-textfield-label">Type of Debris <span className="text-danger">*</span></label>
                          <p className="text-danger">{err && err.typeofdebris ? err.typeofdebris : ""}</p>
                      </div>
                    </li> */}
                    <li>
                      <div className="form-group material-textfield material-textfield-lg btn-multiselect">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="haulercompany"
                          value={this.state.haulercompany}
                          disabled
                          required />
                          <label className="material-textfield-label">Hauler <span className="text-danger">*</span></label>
                        {/* <label className="material-textfield-label">Type of Debris <span className="text-danger">*</span></label> */}
                        <p className="text-danger">{err && err.typeofdebris ? err.typeofdebris : ""}</p>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg btn-multiselect">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="typeofdebris"
                          value={this.state.typeofdebris}
                          disabled
                          required />
                        <label className="material-textfield-label">Type of Debris <span className="text-danger">*</span></label>
                        <p className="text-danger">{err && err.typeofdebris ? err.typeofdebris : ""}</p>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        {/* <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="totalcost"
                          value={this.state.totalcost}
                          onChange={(event) => this.onchange('totalcost', event.target.value)}
                          required /> */}
                          <CurrencyInput
                            precision={2}
                            className="form-control material-textfield-input h-66"
                            placeholder=''
                            name="totalcost"
                            value={this.state.totalcost}
                            onChangeEvent={this.handleChangeMoney.bind(this)}
                            required
                          />

                        <label className="material-textfield-label">Total Price <span className="text-danger">*</span> </label>
                        <p className="text-danger">{err && err.consumercost ? err.consumercost : ""}</p>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="cost"
                          value={this.state.cost}
                          onChange={(event) => this.onchange('cost', event.target.value)}
                          required />
                        <label className="material-textfield-label">Dump Cost <span className="text-danger">*</span> </label>
                        <p className="text-danger">{err && err.dumpcost ? err.dumpcost : ""}</p>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-select">
                        <select name="dumpsite" value= {this.state.dumpsite} onChange={(e) => this.onchange('dumpsite', e.target.value)} className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                          <option defaultValue="">Select Dump</option>
                          { _.get(this.props, "dumps", []).map((dump, i)=>{
                              return (
                                <option key={i} value={dump.id}>{dump.companyname}</option>
                              )
                            })
                          }
                        </select>
                        <label className="material-textfield-label">Dump site <span className="text-danger">*</span> </label>
                        <p className="text-danger">{err && err.dumpsite ? err.dumpsite : ""}</p>
                      </div>
                    </li>
                  </ul>
                  <h3 className="info-sustain">Sustainability Information</h3>
                  </div>
                </div>

              <div className="row">
                <div className="col-lg-4 col-md-12">
                  <div className="form-group material-textfield material-textfield-lg">
                    <input
                      type="text"
                      className="form-control material-textfield-input h-66"
                      name="dumpticketnumber"
                      value={this.state.dumpticketnumber}
                      onChange={(event) => this.onchange('dumpticketnumber', event.target.value)}
                      required />
                    <label className="material-textfield-label">Dump Ticket Number<span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.dumpcost ? err.dumpcost : ""}</p>
                  </div>
                </div>
              </div>
              {/* {container !== "1/2 Yard" ? */}
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <ul className="pdf-upload-list">
                      {this.state.pdf && this.state.pdf.length > 0 ? this.state.pdf.map((file, index) => {
                        return (
                          <li key={index}>{file.name}</li>
                        )
                      }) : ''}
                    </ul>
                    <Dropzone className="dropzone-droparea" onDrop={acceptedFiles => this.onDrop(acceptedFiles)} >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone-text" {...getRootProps()}><input {...getInputProps()} />Upload Dump Tickets </div>
                      )}
                    </Dropzone>
                    {this.state.fileError && <p className="text-danger">{this.state.fileError}</p>}
                  </div>
                </div>
              </div>
              {/* : "" } */}

                {/* {container !== "1/2 Yard" ? */}
                <div className="row">
                  <div className="col-md-12">
                  <ul className="order-listing subs-list minuslist">
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="totalpercentage"
                          value={this.state.totalpercentage}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Total % (yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="weight_total"
                          value={Math.round(this.state.weight_total)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Total % (tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="weight"
                          value={this.state.weight}
                          onChange={(event) => this.onchange('weight', event.target.value)}
                          required />
                        <label className="material-textfield-label">Weight(tons) <span className="text-danger">*</span></label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="waste"
                          value={this.state.waste}
                          onChange={(event) => this.onchange('waste', event.target.value)}
                          required />
                        <label className="material-textfield-label">Waste % (Yards)<span className="clr-red">*</span></label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          tabIndex={-1}
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[0].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Waste % (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          tabIndex={-1}
                          value={this.state.tonnageweight[0].value}
                          readOnly
                          required />
                        <label className="material-textfield-label">Waste Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type
                          ="text"
                          className="form-control material-textfield-input h-66"
                          name="brick"
                          value={this.state.brick}
                          onChange={(event) => this.onchange('brick', event.target.value)}
                          required />
                        <label className="material-textfield-label">Brick % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[1].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Brick % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[1].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Brick Weight (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="dirt"
                          value={this.state.dirt}
                          onChange={(event) => this.onchange('dirt', event.target.value)}
                          required />
                        <label className="material-textfield-label">Dirt % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[2].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Dirt % (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[2].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Dirt Weight (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="concrete"
                          value={this.state.concrete}
                          onChange={(event) => this.onchange('concrete', event.target.value)}
                          required />
                        <label className="material-textfield-label">Concrete % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[3].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Concrete % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[3].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Concrete Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="cleanwood"
                          value={this.state.cleanwood}
                          onChange={(event) => this.onchange('cleanwood', event.target.value)}
                          required />
                        <label className="material-textfield-label">Wood % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[4].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Wood % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[4].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Wood Weight (Tons) </label>
                      </div>
                    </li>

                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="metal"
                          value={this.state.metal}
                          onChange={(event) => this.onchange('metal', event.target.value)}
                          required />
                        <label className="material-textfield-label">Metal % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[5].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Metal % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[5].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Metal Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="paper_cardboard"
                          value={this.state.paper_cardboard}
                          onChange={(event) => this.onchange('paper_cardboard', event.target.value)}
                          required />
                        <label className="material-textfield-label">Paper/Cardboard % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[6].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Paper/Cardboard % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[6].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Paper/Cardboard Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="plastic"
                          value={this.state.plastic}
                          onChange={(event) => this.onchange('plastic', event.target.value)}
                          required />
                        <label className="material-textfield-label">Plastic % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[7].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Plastic % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[7].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Plastic Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="drywall"
                          value={this.state.drywall}
                          onChange={(event) => this.onchange('drywall', event.target.value)}
                          required />
                        <label className="material-textfield-label">Drywall % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[8].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Drywall % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[8].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Drywall Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="glass"
                          value={this.state.glass}
                          onChange={(event) => this.onchange('glass', event.target.value)}
                          required />
                        <label className="material-textfield-label">Glass % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[9].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Glass % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[9].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Glass Weight (Tons) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="asphalt"
                          value={this.state.asphalt}
                          onChange={(event) => this.onchange('asphalt', event.target.value)}
                          required />
                        <label className="material-textfield-label">Asphalt % (Yards) </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={Math.round(this.state.tonnagepercentage[10].value)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Asphalt % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66"
                          name="parking"
                          value={this.state.tonnageweight[10].value}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label">Asphalt Weight (Tons) </label>
                      </div>
                    </li>

                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66 transparent-field"
                          name="parking"
                          value={Math.round(this.state.recyclingpercentage)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label labelbold">Recycling % (Tons)</label>
                      </div>
                    </li>
                    <li>
                      <div className="form-group material-textfield material-textfield-lg">
                        <input
                          type="text"
                          className="form-control material-textfield-input h-66 transparent-field"
                          name="parking"
                          value={Math.round(this.state.residualpercentage)}
                          readOnly
                          tabIndex={-1}
                          required />
                        <label className="material-textfield-label labelbold">Residual Waste % (Tons) </label>
                      </div>
                    </li>

                  </ul>
                </div>
              </div>
              {/* : "" } */}
              {this.state.selectedCustomer && this.state.selectedCustomer.isHomeCustomer ?
                <div className="orders-form">
                  <div>
                    <h4>Additional Tons</h4>
                    <h6><span>Container Size:</span> {container}</h6>
                    <h6><span>Allowed Tons:</span> {_.get(getallowedtons, 'tons', '')}</h6>

                    <div className="form-group material-textfield material-textfield-lg mt-3">
                      <input
                        type="text"
                        className="form-control material-textfield-input h-66"
                        name="additionaltons"
                        value={this.state.additionaltons}
                        onChange={this.onHandleChange.bind(this)}
                        required />
                      <label className="material-textfield-label">Enter Additional Tons<span className="text-danger">*</span> </label>
                    </div>

                    {this.state.additionaltons !== 0 && this.state.additionaltons !== "0" && this.state.additionaltons !== "" ?
                    <div>
                    <h6><span>Additional Tons:</span> {this.state.additionaltons}</h6>
                    <h6><span>Additional Rate:</span> ${this.formatNumber(this.state.rate)}</h6>
                    {this.state.discount ? <h6><span>Discount</span> ${this.formatNumber(this.state.discount)}</h6> : "" }
                    <h6><span>Additional Price:</span> ${this.formatNumber(this.state.price)}</h6>
                    </div> : ""}
                  </div>

                  {this.state.additionaltons !== 0 && this.state.additionaltons !== "0" && this.state.additionaltons !== "" && (this.state.selectedCustomer && _.get(this.state.selectedCustomer, 'payment_info', []).length !== 0) &&
                    <select className="form-control custom-select h-66 w-100 font-16 material-textfield-input mt-2" onChange={this.onHandleChange.bind(this)} name="cardId" value={this.state.cardId}>
                    <option value="select">
                      Select
                    </option>
                    {_.get(this.state.selectedCustomer, 'payment_info', []).map((payment) => {
                        return (
                          <option value={_.get(payment.stripe, 'card.id', '')}>
                          {_.get(payment.stripe, 'card.brand', '')}****{_.get(payment.stripe, 'card.last4', '')}
                          </option>
                        )
                      })
                    }
                    </select>
                    }
                    <div>
                    {this.state.additionaltons !== 0 && this.state.additionaltons !== "0" && this.state.additionaltons !== ""? <button className="completed-btn-new-card btn-new-card" onClick={this.openAddCard.bind(this)}>Add a New Card </button> : "" }
                    </div>
                    {this.state.additionaltons !== 0 && this.state.additionaltons !== "0" && this.state.additionaltons !== "" ?
                    <div className="d-flex">
                    <div className="form-group material-textfield material-textfield-lg w-100">
                      <input
                        type="text"
                        className="form-control material-textfield-input h-66 border-radi-input"
                        name="couponCode"
                        value={this.state.couponCode}
                        onChange={this.onHandleChange.bind(this)}
                        required />
                      <label className="material-textfield-label">Coupon Code </label>
                    </div>
                    <button className="btn btn-dark btn-md w-180 font-600 h-66 border-radi-btn" onClick={this.applyCouponCode.bind(this)}>Apply</button>
                    </div>
                    : "" }
                </div>
                : "" }
              <div>
                {this.getExceptionListItem()}
              </div>
              <p className="text-danger">{this.state.errMessage}</p>
              <button onClick={this.validate.bind(this)} className="btn btn-dark btn-lg w-100 font-800 h-66">{this.state.price !== 0 ? `Charge $${this.state.price} & Complete Order` : "Save"}</button>
            </div>
          </div>
        </ReactModal>
        <AddCardModal
          openCardModal = {this.state.openCard}
          closeCardModal ={this.closeCardModal.bind(this)}
          customerid = {_.get(this.props.orderDataForComplete, 'customer', '')}
          {...this.props}
        />
      </div>
    )
  }
}

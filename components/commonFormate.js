import _ from 'lodash'
import moment from 'moment'

export const formatPhoneNumber = (s) => {
    var s2 = ("" + s).replace("-", "").replace(/\D/g, '');
    if (isNaN(s2)) {
        return "";
    } else {
        var length = s2.length;
        var m = null;

        if (length > 10) {
            s2 = s2.slice(0, 10);
            length = s2.length;
        }

        switch (length) {
            case 10:
                m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
                return (!m) ? s2 : + m[1] + "-" + m[2] + "-" + m[3];
            case 9:
                m = s2.match(/^(\d{3})(\d{3})(\d{3})$/);
                return (!m) ? s2 : + m[1] + "-" + m[2] + "-" + m[3];
            case 8:
                m = s2.match(/^(\d{3})(\d{3})(\d{2})$/);
                return (!m) ? s2 : + m[1] + "-" + m[2] + "-" + m[3];
            case 7:
                m = s2.match(/^(\d{3})(\d{3})(\d{1})$/);
                return (!m) ? s2 : + m[1] + "-" + m[2] + "-" + m[3];
            case 6:
                m = s2.match(/^(\d{3})(\d{3})$/);
                return (!m) ? s2 : + m[1] + "-" + m[2];
            case 5:
                m = s2.match(/^(\d{3})(\d{2})$/);
                return (!m) ? s2 : + m[1] + "-" + m[2];
            case 4:
                m = s2.match(/^(\d{3})(\d{1})$/);
                return (!m) ? s2 : + m[1] + "-" + m[2];
            case 3:
                m = s2.match(/^(\d{3})(\d)$/);
                return (!m) ? s2 : + m[1];
            default:
                return s2;
        }
    }
}

const weekdays = new Array(7);
  weekdays[0] = "Sunday"
  weekdays[1] = "Monday"
  weekdays[2] = "Tuesday"
  weekdays[3] = "Wednesday"
  weekdays[4] = "Thursday"
  weekdays[5] = "Friday"
  weekdays[6] = "Saturday"

export const getDay=(day)=>{
  return weekdays[day];
}

export const formatGeoAddressComponents = (gmaps, description) => {

    let geoDetails = {
        lat: "",
        lng: "",
        state: "",
        neighborhood: "",
        borough: "",
        zipcode: "",
        streetNo: "",
        route: "",
        floor: "",
        city: "",
        country: "",
        geoPlaceId: "",
        address: ""
    };

    gmaps.address_components.forEach(function (element) {
        element.types.forEach(function (type) {
            switch (type) {
                case 'administrative_area_level_1':
                    geoDetails.state = element.long_name;
                    break;
                case 'postal_code':
                    geoDetails.zipcode = element.long_name;
                    break;
                case 'neighborhood':
                    geoDetails.neighborhood = element.long_name;
                    break;
                case 'floor':
                    geoDetails.floor = element.long_name;
                    break;
                case 'route':
                    geoDetails.route = element.long_name;
                    break;
                case 'street_number':
                    geoDetails.streetNo = element.long_name;
                    break;
                case 'administrative_area_level_2':
                    geoDetails.city = element.long_name;
                    break;
                case 'sublocality_level_1':
                    geoDetails.borough = element.long_name;
                    break;
                case 'country':
                    geoDetails.country = element.long_name;
                    break;
            }
        }, this)
    }, this);
    let fullAddress = gmaps.formatted_address
    let streetAddress = []

    if (description) {
      streetAddress = description ? description.split(', ') : fullAddress.split(', ')
    } else {
      streetAddress = fullAddress.split(', ')
    }

    let addArr = [];
    addArr = fullAddress.split(', ')
    if(addArr.length > 0) {
        if(addArr.length === 4) {
          geoDetails.address = streetAddress[0].trim()
          geoDetails.city = addArr[1]
          geoDetails.state = addArr[2].split(' ')[0]
          geoDetails.zipcode = addArr[2].split(' ')[1]
        } else if(addArr.length === 5) {
          geoDetails.address = streetAddress[0].trim()
          geoDetails.city = addArr[2]
          geoDetails.state = addArr[3].split(' ')[0]
          geoDetails.zipcode = addArr[3].split(' ')[1]
        }
    }
    //geoDetails.address = gmaps.formatted_address; // (geoDetails.streetNo ? geoDetails.streetNo + ' ' : '') + (geoDetails.floor ? geoDetails.floor + ' ' : '') + (geoDetails.route ? geoDetails.route : '');

    return geoDetails;
}

export const formatOrderAddess = (item) => {
  let address = item.address && item.address !== "" ? item.address + ', ' : '';
  if (address === "" && (item.address && item.address !=="")) {
      address = item.address;
  }
  address += item.city && item.city !== "" ? item.city + ', ' :  item.borough && item.borough !== "" ? item.borough + ', ' : '';
  address += item.state && item.state !== "" ? item.state + ' ' : '';
  address += item.zipcode && item.zipcode !== "" ? item.zipcode  : '';
  return address;
}

export const getDayDate = (input) => {
  if (input) {
      return moment(input).utc().format("dddd")
      //return DateUtility.getDay(new Date(input).getDay());
  }
}

export const getContainerSize = (containerlist, id) => {
    const container = _.find(containerlist, (container) => {
      return container._id === id
    })
    if(container) {
      return container.size
    } else {
        return ""
    }
  }

  export const getDate = (input) => {
    if (input) {
        let date = new Date(input)
        return String(date.getUTCMonth()+1)+'/'+String(date.getUTCDate())+'/'+String(date.getUTCFullYear());
    }
}

export const getFormatedDateAndTimeWithoutUTC = (input, timezone, user) => {
    if(input !== "" && input !== null && input !== undefined) {
        const newdate = new Date()
        let clientoffset = newdate.getTimezoneOffset()
        const dateStr = String(input).split("T")[0];
        const timeStr = String(input).split("T")[1];
        const dateArr = dateStr.split('-');
        const timeArr = timeStr.split(":")
        let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
        const utc = created.getMinutes() + (timezone && timezone.clientoffset)
        created.setMinutes(created.getMinutes() + timezone.clientoffset)
        //created = new Date((created) + (timezone.clientoffset*60*1000))
        if(user && user.timezone && user.timezone.tzName ) {
            const timezone = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
            clientoffset = user && user.timezone ? moment.tz(moment(), timezone).utcOffset() : clientoffset
        } else {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            clientoffset = moment.tz(moment(), timezone).utcOffset()
        }
        created.setMinutes(created.getMinutes() + clientoffset)
        return created
    }
}

export const getDateMMDDYYYHHMM=(input)=>{
    let date=new Date(input);
    let hours = date.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let getMinutes = date.getMinutes()
    if(date.getMinutes().toString().length === 1) {
        getMinutes = '0' + getMinutes
    }
    return `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()} ${hours}:${getMinutes}${ampm}`
}

export const getTimeInDayAndHours=(input)=>{
    //console.log(moment(input).format('MM-DD-YYYY hh:mm a'), "input")
    return moment(input).format('MM-DD-YYYY hh:mm a')
    // const utcsting = Math.floor((new Date()).getTime() / 1000)
    // const dateStr = input.split("T")[0];
    // const timeStr = input.split("T")[1];
    // var ampm = timeStr[0] >= 12 ? 'pm' : 'am';
    // const dateArr = dateStr.split('-');
    // const timeArr = timeStr.split(":")
    // return `${dateArr[1]}-${dateArr[2]}-${dateArr[0]} ${timeArr[0]}:${timeArr[1]} ${ampm} `
}
export const getDateMMDDYYYHHMMForCustomer=(input)=>{
    let date=new Date(input);
    let hours = date.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let getMinutes = date.getMinutes()
    if(date.getMinutes().toString().length === 1) {
        getMinutes = '0' + getMinutes
    }
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} at ${hours}:${getMinutes} ${ampm}`
}

export const getTimeInDayAndHoursForCustomer=(input)=>{
  return `${moment(input).format('MM/DD/YYYY')} at ${moment(input).format('hh:mm a')}`
}

export const getFormatedDateAndTimeByUTC = (input, user) => {
    if(input !== "" && input !== null && input !== undefined) {
        const newdate = new Date()
        let clientoffset = newdate.getTimezoneOffset()
        const dateStr = String(input).split("T")[0];
        const timeStr = String(input).split("T")[1];
        const dateArr = dateStr.split('-');
        const timeArr = timeStr.split(":")
        let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
        //const utc = created.getMinutes() + (timezone && timezone.clientoffset)
        //created.setMinutes(created.getMinutes() + timezone.clientoffset)
        //created = new Date((created) + (timezone.clientoffset*60*1000))
        if(user && user.timezone && user.timezone.tzName ) {
            const timezone = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
            clientoffset = user && user.timezone ? moment.tz(moment(), timezone).utcOffset() : clientoffset
        } else {
            const timezone = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
            clientoffset = moment.tz(moment(), timezone).utcOffset()
        }
        created.setMinutes(created.getMinutes() + clientoffset)
        return moment(created).format('MM-DD-YYYY hh:mm a')
    }
}

export const getFormatedDateAndTimeLogin = (input ,driveroffset) => {
    if(input !== null && input !== "" && input !== undefined) {
      const newdate = new Date()
      const clientoffset = newdate.getTimezoneOffset()
      driveroffset = parseInt(driveroffset)
      if(driveroffset === 0) {
        driveroffset = clientoffset
      }
      const dateStr = input.split("T")[0];
      const timeStr = input.split("T")[1];
      const dateArr = dateStr.split('-');
      const timeArr = timeStr.split(":")
      let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
      const hoursFromMinutes = (driveroffset/60)
      created.setMinutes(created.getMinutes() + driveroffset)
      let timezone = this.state.user && this.state.user.timezone && this.state.user.timezone.tzName ? this.state.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
      const offset = moment.tz(moment(), timezone).utcOffset()
      created.setMinutes(created.getMinutes() + offset)
      return  moment(created).format('hh:mm A')
    }
  }

export const calculationArray =  () => {
    let arr = [
        {key: "waste" , lbs: 600, tonnage: 0.30},
        {key: "brick" , lbs: 3000, tonnage: 1.50},
        {key: "dirt" , lbs: 5000, tonnage: 2.50},
        {key: "concrete" , lbs: 4050, tonnage: 2.03},
        {key: "cleanwood" , lbs: 300, tonnage: 0.15},
        {key: "metal" , lbs: 1000, tonnage: 0.50},
        {key: "paper_cardboard" , lbs: 100, tonnage: 0.05},
        {key: "plastic" , lbs: 200, tonnage: 0.10},
        {key: "drywall" , lbs: 500, tonnage: 0.25},
        {key: "glass" , lbs: 700, tonnage: 0.35},
        {key: "asphalt" , lbs: 4140, tonnage: 2.07}
    ]
    return arr
}

export const getAddress = (order) => {
  if(order) {
    let address = order.new_address
    if(order.city !== '') {
      address += ", " + order.city
    }
    if(order.state !== '') {
      address += ", " + order.state
    }
    if(order.zipcode !== '') {
      address += " " + order.zipcode
    }
    return address
  }
}

export const getAllowedTons = (container) => {
    const arr = [
      {tons:'2', yard:'10 Yard', heavyPrice: 900, lowPrice: 600},
      {tons:'4', yard:'20 Yard', heavyPrice: 1400, lowPrice: 850},
      {tons:'6', yard:'30 Yard', heavyPrice: 950, lowPrice: 950},
      {tons:'3', yard:'15 Yard', heavyPrice: 1200, lowPrice: 750},
      {tons:'2', yard:'Live Load', heavyPrice: 85, lowPrice: 65}
    ]
    return _.find(arr, (a) => {
      return a.yard === container
    })
  }

  export const calculatePrice = (tons, yard) => {
    const arr = [
      {tons:'2', yard:'10 Yard', heavyPrice: 900, lowPrice: 600, price: 120},
      {tons:'4', yard:'20 Yard', heavyPrice: 1400, lowPrice: 850, price: 120},
      {tons:'6', yard:'30 Yard', heavyPrice: 950, lowPrice: 950, price: 120},
      {tons:'3', yard:'15 Yard', heavyPrice: 1200, lowPrice: 750, price: 120},
      {tons:'2', yard:'Live Load', heavyPrice: 85, lowPrice: 65, price: 120}
    ]
    let price = 0
    let rate = 0
    const container = _.find(arr, (a) => {
      return a.yard === yard
    })
    if(container) {
        price = tons * container.price
        rate = _.get(container, 'price', '')
    }
    return {
        rate : rate,
        price : price
    }

  }

  export const calculatePriceForExchange = (yard, debris, county) => {
    const hevaydebris = ['Roofing', 'Concrete', 'Brick', 'Dirt/Sand', 'Asphalt', 'Stone', 'Mixed Masonry', 'Tile', 'Glass']
    let arr = [
      {tons:'2', yard:'10 Yard', heavyPrice: 900, lowPrice: 600, price: 120},
      {tons:'4', yard:'20 Yard', heavyPrice: 1400, lowPrice: 850, price: 120},
      {tons:'6', yard:'30 Yard', heavyPrice: 950, lowPrice: 950, price: 120},
      {tons:'3', yard:'15 Yard', heavyPrice: 1200, lowPrice: 750, price: 120},
      {tons:'2', yard:'Live Load', heavyPrice: 50, lowPrice: 50, price: 120},
      {tons:'2', yard:'1/2 Yard', heavyPrice: 35, lowPrice: 28, price: 120}
    ]
    if(county === "New York" || county === 'Westchester') {
      arr = [
        {tons:'2', yard:'10 Yard', heavyPrice: 900, lowPrice: 600, price: 120},
        {tons:'4', yard:'20 Yard', heavyPrice: 1400, lowPrice: 850, price: 120},
        {tons:'6', yard:'30 Yard', heavyPrice: 950, lowPrice: 950, price: 120},
        {tons:'3', yard:'15 Yard', heavyPrice: 1200, lowPrice: 750, price: 120},
        {tons:'2', yard:'Live Load', heavyPrice: 50, lowPrice: 50, price: 120},
        {tons:'2', yard:'1/2 Yard', heavyPrice: 35, lowPrice: 28, price: 120}
      ]
    } else if (county === "Nassau") {
      arr = [
        {tons:'2', yard:'10 Yard', heavyPrice: 900, lowPrice: 475, price: 120},
        {tons:'4', yard:'20 Yard', heavyPrice: 1500, lowPrice: 675, price: 120},
        {tons:'5', yard:'30 Yard', heavyPrice: 775, lowPrice: 775, price: 120},
        {tons:'3', yard:'15 Yard', heavyPrice: 1100, lowPrice: 575, price: 120},
        {tons:'2', yard:'Live Load', heavyPrice: 50, lowPrice: 50, price: 120},
        {tons:'2', yard:'1/2 Yard', heavyPrice: 38, lowPrice: 28, price: 120}
      ]
    }
    let price = 0
    let rate = 0
    const container = _.find(arr, (a) => {
      return a.yard === yard
    })
    const b = debris.some((val) => hevaydebris.indexOf(val) !== -1);
    let type = 'lowPrice'
    if(b) {
        type = 'heavyPrice'
    }
    //if(_.includes(hevaydebris, debris))
    if(container) {
        rate = _.get(container, type, '')
    }
    return {
        base : rate,
        type: type
    }

  }
  export const formatNumber = (number) => {
    let n= String(number).replace(/\,/g,"")
    n = n !== '' ? parseFloat(n) : 0
    const nfObject = new Intl.NumberFormat('en-US');
    const output = nfObject.format(n);
    return `${output}`
  }

  export const formatPhoneNumberWithBrackets = (phoneNumberString) => {
    var phone = phoneNumberString.replace(/\-/g,"");
    var cleaned = ('' + phone).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
  }
//   export const getFormatedDateAndTimeWithoutUTC = (input, timezone) => {
//     if(input !== "" && input !== null && input !== undefined) {
//         const newdate = new Date()
//         let clientoffset = newdate.getTimezoneOffset()
//         const dateStr = String(input).split("T")[0];
//         const timeStr = String(input).split("T")[1];
//         const dateArr = dateStr.split('-');
//         const timeArr = timeStr.split(":")
//         let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
//         const utc = created.getMinutes() + (timezone && timezone.clientoffset)
//         created.setMinutes(created.getMinutes() + timezone.clientoffset)
//         //created = new Date((created) + (timezone.clientoffset*60*1000))
//         const user = localStorage.loggedInUser ? JSON.parse(localStorage.loggedInUser) : null
//         if(user && user.timezone ) {
//             const timezone = user && user.timezone ?  user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
//             clientoffset = user && user.timezone ? moment.tz(moment(), timezone).utcOffset() : clientoffset
//         }
//         created.setMinutes(created.getMinutes() + clientoffset)
//         return created
//     }
// }

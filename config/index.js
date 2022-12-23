/* eslint no-magic-numbers: 0 */
//import MobileDetect from 'mobile-detect'
import Moment from 'moment-timezone'
import _ from 'lodash'

const detectWebView = () => {
  const isUIwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

  if (isUIwebview) {
    return true
  } else {
    return false
  }
}

const getAccessibilityOptions = () => {
  const arr = [
    {key:"Please Select", value: "Select"},
    {key:"Next to driveway", value: "Next to driveway"},
    {key:"Next to hydrant", value: "Next to hydrant"},
    {key:"On corner", value: "On corner"},
    {key:"In Yard/Lot - Always Accessible", value: "In Yard/Lot - Always Accessible"},
    {key:"In Yard/Lot - Key/Passcode needed", value: "In Yard/Lot - Key/Passcode needed"},
    {key:"In Driveway ", value: "In Driveway"},
    {key:"During Alternate Side Only", value: "During Alternate Side Only"},
    {key:"Barricaded", value: "Barricaded"},
    {key:"Inside of Building", value: "Inside of Building"},
    {key:"Other: Manual entry", value: "Other: Manual entry"}
  ]
  return arr
}

const heavyDebris = () => {
  const hevaydebris = ['Roofing', 'Concrete', 'Brick', 'Dirt/Sand', 'Asphalt', 'Stone', 'Mixed Masonry', 'Tile', 'Glass']
  return hevaydebris
}

const debrisTypes = () => {
  const arr = ['Roofing', 'Cardboard/Paper','Furniture', 'Dirt/Sand',
    'Asphalt', 'Appliances', 'Concrete', 'Sheetrock',
   'Stone', 'Brick', 'Glass','Tile', 'Metal',
   'Putrescible Waste', 'Wood', 'Plastic','Mixed Masonry', 'Other', 'Mixed C&D',
   'Greens'
  ]
  return arr
}

const debrisTypes20 = () => {
  const arr = ['Roofing', 'Cardboard/Paper','Furniture',
    'Asphalt', 'Appliances', 'Concrete', 'Sheetrock',
   'Stone', 'Brick', 'Glass','Tile', 'Metal',
   'Putrescible Waste', 'Wood', 'Plastic','Mixed Masonry', 'Other', 'Mixed C&D',
   'Greens'
  ]
  return arr
}

const debrisTypes30 = () => {
  const arr = ['Roofing', 'Cardboard/Paper','Furniture','Appliances', 'Sheetrock','Metal',
   'Putrescible Waste', 'Wood', 'Plastic','Other', 'Mixed C&D',
   'Greens'
  ]
  return arr
}

const timeZoneArr = () => {
  let arr = [
    {id: "0", tzName: "Select Timezone", name: "Select Timezone", value: 0},
    {id: "1", tzName: "Pacific/Midway", name: "(UTC-11:00) Coordinated Universal Time-11", value: 660}
    ,{id: "2", tzName: "Pacific/Samoa", name: "(UTC-11:00) Samoa", value: 660}
    ,{id: "3", tzName: "Pacific/Honolulu", name: "(UTC-10:00) Hawaii", value: 600}
    ,{id: "4", tzName: "America/Anchorage", name: "(UTC-09:00) Alaska", value: 540}
    ,{id: "5", tzName: "America/Los_Angeles", name: "(UTC-08:00) Pacific Time (US & Canada)", value: 480}
    ,{id: "6", tzName: "America/Tijuana", name: "(UTC-08:00) Tijuana, Baja California", value: 480}
    ,{id: "7", tzName: "America/Denver", name: "(UTC-07:00) Mountain Time (US & Canada)", value: 420}
    ,{id: "8", tzName: "America/Chihuahua", name: "(UTC-07:00) Chihuahua, La Paz, Mazatlan", value: 420}
    ,{id: "9", tzName: "America/Mazatlan", name: "(UTC-07:00) Mazatlan", value: 420}
    ,{id: "10", tzName: "America/Phoenix", name: "(UTC-07:00) Arizona", value: 420}
    ,{id: "11", tzName: "America/Regina", name: "(UTC-06:00) Saskatchewan", value: 360}
    ,{id: "12", tzName: "America/Tegucigalpa", name: "(UTC-06:00) Central America", value: 360}
    ,{id: "13", tzName: "America/Chicago", name: "(UTC-06:00) Central Time (US & Canada)", value: 360}
    ,{id: "14", tzName: "America/Mexico_City", name: "(UTC-06:00) Mexico City", value: 360}
    ,{id: "15", tzName: "America/Monterrey", name: "(UTC-06:00) Monterrey", value: 360}
    ,{id: "16", tzName: "America/New_York", name: "(UTC-05:00) Eastern Time (US & Canada)", value: 300}
    ,{id: "17", tzName: "America/Bogota", name: "(UTC-05:00) Bogota, Lima, Quito", value: 300}
    ,{id: "18", tzName: "America/Lima", name: "(UTC-05:00) Lima", value: 300}
    ,{id: "19", tzName: "America/Rio_Branco", name: "(UTC-05:00) Rio Branco", value: 300}
    ,{id: "20", tzName: "America/Indiana/Indianapolis", name: "(UTC-05:00) Indiana (East)", value: 300}
    ,{id: "21", tzName: "America/Caracas", name: "(UTC-04:30) Caracas", value: 258}
    ,{id: "22", tzName: "America/Halifax", name: "(UTC-04:00) Atlantic Time (Canada)", value: 240}
    ,{id: "23", tzName: "America/Manaus", name: "(UTC-04:00) Manaus", value: 240}
    ,{id: "24", tzName: "America/Santiago", name: "(UTC-04:00) Santiago", value: 240}
    ,{id: "25", tzName: "America/La_Paz", name: "(UTC-04:00) La Paz", value: 240}
    ,{id: "26", tzName: "America/Cuiaba", name: "(UTC-04:00) Cuiaba", value: 240}
    ,{id: "27", tzName: "America/Asuncion", name: "(UTC-04:00) Asuncion", value: 240}
    ,{id: "28", tzName: "America/St_Johns", name: "(UTC-03:30) Newfoundland", value: 198}
    ,{id: "29", tzName: "America/Argentina/Buenos_Aires", name: "(UTC-03:00) Buenos Aires", value: 180}
    ,{id: "30", tzName: "America/Sao_Paulo", name: "(UTC-03:00) Brasilia", value: 180}
    ,{id: "31", tzName: "America/Godthab", name: "(UTC-03:00) Greenland", value: 180}
    ,{id: "32", tzName: "America/Montevideo", name: "(UTC-03:00) Montevideo", value: 180}
    ,{id: "33", tzName: "Atlantic/South_Georgia", name: "(UTC-02:00) Mid-Atlantic", value: 120}
    ,{id: "34", tzName: "Atlantic/Azores", name: "(UTC-01:00) Azores", value: 60}
    ,{id: "35", tzName: "Atlantic/Cape_Verde", name: "(UTC-01:00) Cape Verde Is.", value: 60}
    ,{id: "36", tzName: "Europe/London", name: "(UTC) London, Edinburgh, Dublin, Lisbon", value: 0}
    ,{id: "37", tzName: "UTC", name: "(UTC) Coordinated Universal Time, Greenwich Mean Time", value: 0}
    ,{id: "38", tzName: "Africa/Monrovia", name: "(UTC) Monrovia, Reykjavik", value: 0}
    ,{id: "39", tzName: "Africa/Casablanca", name: "(UTC) Casablanca", value: 0}
    ,{id: "40", tzName: "Europe/Belgrade", name: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", value: -60}
    ,{id: "41", tzName: "Europe/Sarajevo", name: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb", value: -60}
    ,{id: "42", tzName: "Europe/Brussels", name: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris", value: -60}
    ,{id: "43", tzName: "Africa/Algiers", name: "(UTC+01:00) West Central Africa", value: -60}
    ,{id: "44", tzName: "Europe/Amsterdam", name: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", value: -60}
    ,{id: "45", tzName: "Europe/Minsk", name: "(UTC+02:00) Minsk", value: -120}
    ,{id: "46", tzName: "Africa/Cairo", name: "(UTC+02:00) Cairo", value: -120}
    ,{id: "47", tzName: "Europe/Helsinki", name: "(UTC+02:00) Helsinki, Riga, Sofia, Tallinn, Vilnius", value: -120}
    ,{id: "48", tzName: "Europe/Athens", name: "(UTC+02:00) Athens, Bucharest", value: -120}
    ,{id: "49", tzName: "Europe/Istanbul", name: "(UTC+02:00) Istanbul", value: -120}
    ,{id: "50", tzName: "Asia/Jerusalem", name: "(UTC+02:00) Jerusalem", value: -120}
    ,{id: "51", tzName: "Asia/Amman", name: "(UTC+02:00) Amman", value: -120}
    ,{id: "52", tzName: "Asia/Beirut", name: "(UTC+02:00) Beirut", value: -120}
    ,{id: "53", tzName: "Africa/Windhoek", name: "(UTC+02:00) Windhoek", value: -120}
    ,{id: "54", tzName: "Africa/Harare", name: "(UTC+02:00) Harare", value: -120}
    ,{id: "55", tzName: "Asia/Kuwait", name: "(UTC+03:00) Kuwait, Riyadh", value: -180}
    ,{id: "56", tzName: "Asia/Baghdad", name: "(UTC+03:00) Baghdad", value: -180}
    ,{id: "57", tzName: "Africa/Nairobi", name: "(UTC+03:00) Nairobi", value: -180}
    ,{id: "58", tzName: "Asia/Tehran", name: "(UTC+03:30) Tehran", value: -198}
    ,{id: "59", tzName: "Asia/Tbilisi", name: "(UTC+04:00) Tbilisi", value: -240}
    ,{id: "60", tzName: "Europe/Moscow", name: "(UTC+04:00) Moscow, Volgograd", value: -240}
    ,{id: "61", tzName: "Asia/Muscat", name: "(UTC+04:00) Abu Dhabi, Muscat", value: -240}
    ,{id: "62", tzName: "Asia/Baku", name: "(UTC+04:00) Baku", value: -240}
    ,{id: "63", tzName: "Asia/Yerevan", name: "(UTC+04:00) Yerevan", value: -240}
    ,{id: "64", tzName: "Asia/Karachi", name: "(UTC+05:00) Islamabad, Karachi", value: -300}
    ,{id: "65", tzName: "Asia/Tashkent", name: "(UTC+05:00) Tashkent", value: -300}
    ,{id: "66", tzName: "Asia/Kolkata", name: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi", value: -318}
    ,{id: "67", tzName: "Asia/Colombo", name: "(UTC+05:30) Sri Jayawardenepura", value: -318}
    ,{id: "68", tzName: "Asia/Katmandu", name: "(UTC+05:45) Kathmandu", value: -327}
    ,{id: "69", tzName: "Asia/Dhaka", name: "(UTC+06:00) Dhaka", value: -360}
    ,{id: "70", tzName: "Asia/Almaty", name: "(UTC+06:00) Almaty", value: -360}
    ,{id: "71", tzName: "Asia/Yekaterinburg", name: "(UTC+06:00) Ekaterinburg", value: -360}
    ,{id: "72", tzName: "Asia/Rangoon", name: "(UTC+06:30) Yangon (Rangoon)", value: -378}
    ,{id: "73", tzName: "Asia/Novosibirsk", name: "(UTC+07:00) Novosibirsk", value: -420}
    ,{id: "74", tzName: "Asia/Bangkok", name: "(UTC+07:00) Bangkok, Jakarta", value: -420}
    ,{id: "75", tzName: "Asia/Brunei", name: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi", value: -480}
    ,{id: "76", tzName: "Asia/Krasnoyarsk", name: "(UTC+08:00) Krasnoyarsk", value: -480}
    ,{id: "77", tzName: "Asia/Ulaanbaatar", name: "(UTC+08:00) Ulaan Bataar", value: -480}
    ,{id: "78", tzName: "Asia/Kuala_Lumpur", name: "(UTC+08:00) Kuala Lumpur, Singapore", value: -480}
    ,{id: "79", tzName: "Asia/Taipei", name: "(UTC+08:00) Taipei", value: -480}
    ,{id: "80", tzName: "Australia/Perth", name: "(UTC+08:00) Perth", value: -480}
    ,{id: "81", tzName: "Asia/Irkutsk", name: "(UTC+09:00) Irkutsk", value: -540}
    ,{id: "82", tzName: "Asia/Seoul", name: "(UTC+09:00) Seoul", value: -540}
    ,{id: "83", tzName: "Asia/Tokyo", name: "(UTC+09:00) Tokyo", value: -540}
    ,{id: "84", tzName: "Australia/Darwin", name: "(UTC+09:30) Darwin", value: -558}
    ,{id: "85", tzName: "Australia/Adelaide", name: "(UTC+09:30) Adelaide", value: -558}
    ,{id: "86", tzName: "Australia/Canberra", name: "(UTC+10:00) Canberra, Melbourne, Sydney", value: -600}
    ,{id: "87", tzName: "Australia/Brisbane", name: "(UTC+10:00) Brisbane", value: -600}
    ,{id: "88", tzName: "Australia/Hobart", name: "(UTC+10:00) Hobart", value: -600}
    ,{id: "89", tzName: "Asia/Vladivostok", name: "(UTC+10:00) Vladivostok", value: -600}
    ,{id: "90", tzName: "Pacific/Guam", name: "(UTC+10:00) Guam, Port Moresby", value: -600}
    ,{id: "91", tzName: "Asia/Yakutsk", name: "(UTC+10:00) Yakutsk", value: -600}
    ,{id: "92", tzName: "Etc/GMT-11", name: "(UTC+11:00) Solomon Is., New Caledonia", value: -660}
    ,{id: "93", tzName: "Pacific/Fiji", name: "(UTC+12:00) Fiji", value: -720}
    ,{id: "94", tzName: "Asia/Kamchatka", name: "(UTC+12:00) Kamchatka", value: -720}
    ,{id: "95", tzName: "Pacific/Auckland", name: "(UTC+12:00) Auckland", value: -720}
    ,{id: "96", tzName: "Asia/Magadan", name: "(UTC+12:00) Magadan", value: -720}
    ,{id: "97", tzName: "Pacific/Tongatapu", name: "(UTC+13:00) Nukualofa", value: -780}]
  //  return arr.sort((a, b) => {
  //   return a.tzName.localeCompare(b.tzName)
  // });
    return arr;
}
const phoneNumberMask = () => {
  const format = [
    "(",
    /[1-9]/,
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ]
  return format
}

const cardNumberMask = () => {
  const format = [
    /[0-9]/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ]
  return format
}

const expDateMask = () => {
  const format = [
    /[0-9]/,
    /\d/,
    "/",
    /\d/,
    /\d/
  ]
  return format
}

const cvvMask = () => {
  const format = [
    /[0-9]/,
    /\d/,
    /\d/,
    /\d/
  ]
  return format
}

const plan = () => {
  var data = []
  data.push({
  package: "standard_yearly",
  packageName: "Standard (Yearly)",
  quantity:"1",
  priceMonth:"8.99",
  priceYear:"107.88",
  vat:"21.58",
  total: "107.88",
  totalYear: "107.88"},
  {
  package: "standard_monthly",
  packageName: "Standard (Monthly)",
  quantity:"1",
  priceMonth:"9.99",
  priceYear:"119.88",
  vat:"21.58",
  total: "9.99",
  totalYear: "119.47"},
  {
  package: "plus_yearly",
  packageName: "Plus (Yearly)",
  quantity:"1",
  priceMonth:"10.99",
  priceYear:"131.88",
  vat:"21.58",
  total: "131.88",
  totalYear: "131.88"},
  {
  package: "plus_monthly",
  packageName: "Plus (Monthly)",
  quantity:"1",
  priceMonth:"11.99",
  priceYear:"143.88",
  vat:"21.58",
  total: "11.99",
  totalYear: "143.88"})
  return data
}
const settings = () =>
 {
  const data = []
    for(var i=1 ; i<=100 ; i++ ){
      if( i == 100){
        data.push({label: i , value: i, disabled: false})
        return data
      }
      else{
        data.push({label: i , value: i, disabled: false})
      }
    }
 }
 const percent = () =>
 {
  const data = []
    for(var i=100 ; i>=0 ; i-- ){
      if( i == 0){
        data.push(i+"%")
        return data
      }
      else{
        data.push(i+"%")
      }
    }
 }
 const zeroSixty = () =>
 {
  const data = []
    for(var i=54 ; i>=0 ; i-- ){
      if(i == 0){
        data.push(`${i}`)
        return data
      }
      else{
        data.push(`${i}`)
      }
    }
 }
 const defaultGrades = () =>
 {
  const data = []
    for(var i=100 ; i>=1 ; i--){
      if(i == 1){
        data.push(`${i}`)
        //console.log("dataaaaa21212", data)
        return data
      }
      else{
        data.push(`${i}`)
      }
    }
 }
 const weightData = () =>
 {
  const data2 = []
  for(var j=1; j<=10; j++){
       const label = j
        data2.push({label: label , value: j})
    }
    return data2 ;
 }
//const mobileDetector = new MobileDetect(window.navigator.userAgent)
export default {
  Photo: {
    MaxWidth: 1080,
    MaxHeight: 633,
    PreviewWidth: 50,
    PreviewHeight: 50
  },
  timezone_api_key: {
    api_url: "https://maps.googleapis.com/maps/api/timezone/json",
    api_key: "AIzaSyBf9kfq8Rl33hHBB7-nkhakF4Vis74j45U"
  },
  //md: mobileDetector,
  //isMobile: !!mobileDetector.mobile(),
  isWebView: detectWebView(),
  LocalStorageKeys: {
    Authorization: 'Authorization',
    Credentials: 'credentials'
  },
  WeekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  stripe: {
    publish_key: ""
  },
  offset: offsets(),
  accessibilityOptions: getAccessibilityOptions(),
  timeZoneArr: timeZoneArr(),
  phoneNumberMask: phoneNumberMask(),
  cardNumberMask: cardNumberMask(),
  debrisTypes: debrisTypes(),
  debrisTypes20: debrisTypes20(),
  debrisTypes30: debrisTypes30(),
  heavyMaterials: heavyDebris(),
  expDateMask: expDateMask(),
  cvvMask: cvvMask(),
  mapStyles : [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]
}

export const USERTYPES = {
  postcard: 'postcard',
  BUSINESS: 'business',
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin'
}

 export const weight = weightData()
 export const settingsData = settings()

// eslint-disable-next-line complexity, max-statements
const getAllTimeZones = () => {
  const here = Moment.tz.guess()
  const aryTimeZones = []
  const aryNames = Moment.tz.names()
  // from moment-timezone/data/meta
  const USTimezoneNames = [
    'America/New_York',
    'America/Detroit',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Indiana/Indianapolis',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Vevay',
    'America/Chicago',
    'America/Indiana/Tell_City',
    'America/Indiana/Knox',
    'America/Menominee',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/North_Dakota/Beulah',
    'America/Denver',
    'America/Boise',
    'America/Phoenix',
    'America/Los_Angeles',
    'America/Anchorage',
    'America/Juneau',
    'America/Sitka',
    'America/Metlakatla',
    'America/Yakutat',
    'America/Nome',
    'America/Adak',
    'Pacific/Honolulu'
  ]
  for (const i in aryNames) {
    const name = aryNames[i]
    const tz = Moment.tz(name.toString())
    if (tz) {
      // only push _z is valid
      if (!isNaN(tz._offset) && tz._z) {
        aryTimeZones.push(tz)
      }
    }
  }
  const TimeZones = aryTimeZones
  const aryAutoTimezones = []
  for (let i = 0; i < TimeZones.length; i++) {
    const _z = TimeZones[i]._z
    /*if (_z && Array.isArray(_z.abbrs)) {
      for (let j = 0; j < _z.abbrs.length; j ++) {
        // Check if already exists
        const abbr = _z.abbrs[j]//`${_z.abbrs[j]} - ${_z.name}`
        const index = aryAutoTimezones.indexOf(abbr)
        if (index === -1) {
          aryAutoTimezones.push(abbr)
        }
      }
    }*/
    const name = _z.name
    const index = aryAutoTimezones.indexOf(name)
    if (index === -1) {
      aryAutoTimezones.push(name)
    }
  }

  return {
    TimeZones,
    TimeZoneNames: aryAutoTimezones,
    USTimezoneNames,
    CurrentTimezone: here
  }
}

export const TimeZoneInfo = getAllTimeZones()


//export const gradeCal = calculateGrade()
export function timeToDate(time) { // time: String returns Date()
  if (time && typeof time === 'string') {
    const aryElements = time.split(':')
    if (aryElements.length > 0) {
      const hr = parseInt(aryElements[0])
      const min = parseInt(aryElements[1])
      const date = new Date()
      date.setHours(hr)
      date.setMinutes(min)
      return date
    } else {
      return null
    }
  } else {
    return null
  }
}

export function dateToTime(date) { // time: String returns Date()
  if (!isDate(date)) {
    return null
  }

  const hr = date.getHours()
  const min = date.getMinutes()

  return `${hr < 10 ? 0 : ''}${hr}:${min < 10 ? 0 : ''}${min}`
}

/* eslint-disable  max-depth */
// fix Hours of Open and Close from MongoDB by replacing null to {}, string to Date
export const fixHours = (hours) => {

  const fixedHours = [
    {
      opens: false
    }, {
      opens: false
    }, {
      opens: false
    }, {
      opens: false
    }, {
      opens: false
    }, {
      opens: false
    }, {
      opens: false
    }
  ] // return 7 days

  if (Array.isArray(hours)) {
    // eslint-disable-next-line no-magic-numbers
    for (let i = 0; i < hours.length; i++) {

/*      const openingHours = {
        open: {
          day: -1,
          time: -1
        },
        close: {
          day: -1,
          time: -1
        }
      }*/
      const openingHours = hours[i]
      if (openingHours.open) {
        if (openingHours.open.day >= 0 && openingHours.open.day < 7
          && openingHours.open.time >= 0 && openingHours.open.time < 2400
        ) {
          fixedHours[openingHours.open.day].opens = true
          const startTime = new Date()
          startTime.setHours(Math.floor(openingHours.open.time / 100))
          fixedHours[openingHours.open.day].startTime = startTime
        } else {
          console.info('Invalid open time:', openingHours.open)
        }
      }

      if (openingHours.close) {
        if (openingHours.close.day >= 0 && openingHours.close.day < 7
          && openingHours.close.time >= 0 && openingHours.close.time < 2400
        ) {
          fixedHours[openingHours.close.day].opens = true
          const endTime = new Date()
          endTime.setHours(Math.floor(openingHours.close.time / 100))
          fixedHours[openingHours.open.day].endTime = endTime
        } else {
          console.info('Invalid close time:', openingHours.endTime)
        }
      }
    }
    return fixedHours
  } else {
    return fixedHours
  }
}
/* eslint-enable  max-depth */

export function fixPhotos(photos) {
  if (photos) {
    const newPhotos = { ...photos }
    for (const key in photos) {
      // newPhotos[key].isPrimary = newPhotos[key].isPrimary ? true : false
      newPhotos[key] = newPhotos[key]
    }
    return newPhotos
  } else {
    return {}
  }
}

// To generate shared url from AWS pre-signed url
export function getSharedURL(signedURL) {
  if (typeof signedURL === 'string' && signedURL) {
    let indexQuery = signedURL.indexOf('?')
    if (indexQuery < 0) {
      indexQuery = signedURL.length
    }
    return signedURL.substring(0, indexQuery)
  }
  return null
}

export function isDate(d) {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    // it is a date
    if (isNaN(d.getTime())) { // d.valueOf() could also work
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

export function isValidLatLng(loc) {
  if (Array.isArray(loc) && loc.length === 2) {
    const lat = loc[0]
    const lng = loc[1]
    if (isNaN(lat) || isNaN(lng)) {
      return false
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return false
    }
    return true
  } else {
    return false
  }
}

// Check if a valid google object
export function isValidGoogleObject(google) {
  if (typeof google === 'object' && google) {
    return !!google.id
  } else {
    return false
  }
}

// get URL parameters
// export function getUrlParameter(name) {
//   name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
//   const regex = new RegExp(`[\\?&]${name}=([^&#]*)`)
//   const results = regex.exec(location.search)
//   return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
// }

/*
* Convert legacy open/close hours to the latest Hours format
* */

export function topostcardHours(hours) {
  if (!Array.isArray(hours)) {
    return []
  }

  const newHours = []
  for (let i = 0; i < hours.length; i++) {
    const day = hours[i]
    const { startTime, endTime, opens } = day
    if (opens) {
      const openingHours = {
        open: {
          day: -1,
          time: -1
        },
        close: {
          day: -1,
          time: -1
        }
      }
      if (isDate(startTime) && isDate(endTime)) {
        // closing hour is on the next day
        if (startTime.getTime() > endTime.getTime()) {
          openingHours.open.day = i
          openingHours.close.day = i + 1
          openingHours.close.time = startTime.getHours() * 100 + startTime.getMinutes()
          openingHours.open.time = endTime.getHours() * 100 + endTime.getMinutes()
        } else {
          openingHours.open.day = i
          openingHours.close.day = i
          openingHours.open.time = startTime.getHours() * 100 + startTime.getMinutes()
          openingHours.close.time = endTime.getHours() * 100 + endTime.getMinutes()
        }
        newHours.push(openingHours)
      } else {
        console.info('Unexpected Opening Hours:', day)
      }
    }
  }
  return newHours
}

export function offsets() {
  return [
    {
      "offset": "GMT-12:00",
      "name": "Etc/GMT-12"
    },
    {
      "offset": "GMT-11:00",
      "name": "Etc/GMT-11"
    },
    {
      "offset": "GMT-11:00",
      "name": "Pacific/Midway"
    },
    {
      "offset": "GMT-10:00",
      "name": "America/Adak"
    },
    {
      "offset": "GMT-09:00",
      "name": "America/Anchorage"
    },
    {
      "offset": "GMT-09:00",
      "name": "Pacific/Gambier"
    },
    {
      "offset": "GMT-08:00",
      "name": "America/Dawson_Creek"
    },
    {
      "offset": "GMT-08:00",
      "name": "America/Ensenada"
    },
    {
      "offset": "GMT-08:00",
      "name": "America/Los_Angeles"
    },
    {
      "offset": "GMT-07:00",
      "name": "America/Chihuahua"
    },
    {
      "offset": "GMT-07:00",
      "name": "America/Denver"
    },
    {
      "offset": "GMT-06:00",
      "name": "America/Belize"
    },
    {
      "offset": "GMT-06:00",
      "name": "America/Cancun"
    },
    {
      "offset": "GMT-06:00",
      "name": "America/Chicago"
    },
    {
      "offset": "GMT-06:00",
      "name": "Chile/EasterIsland"
    },
    {
      "offset": "GMT-05:00",
      "name": "America/Bogota"
    },
    {
      "offset": "GMT-05:00",
      "name": "America/Havana"
    },
    {
      "offset": "GMT-05:00",
      "name": "America/New_York"
    },
    {
      "offset": "GMT-04:30",
      "name": "America/Caracas"
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Campo_Grande"
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Glace_Bay"
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Goose_Bay"
    },
    {
      "offset": "GMT-04:00",
      "name": "America/Santiago"
    },
    {
      "offset": "GMT-04:00",
      "name": "America/La_Paz"
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Argentina/Buenos_Aires"
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Montevideo"
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Araguaina"
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Godthab"
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Miquelon"
    },
    {
      "offset": "GMT-03:00",
      "name": "America/Sao_Paulo"
    },
    {
      "offset": "GMT-03:30",
      "name": "America/St_Johns"
    },
    {
      "offset": "GMT-02:00",
      "name": "America/Noronha"
    },
    {
      "offset": "GMT-01:00",
      "name": "Atlantic/Cape_Verde"
    },
    {
      "offset": "GMT",
      "name": "Europe/Belfast"
    },
    {
      "offset": "GMT",
      "name": "Africa/Abidjan"
    },
    {
      "offset": "GMT",
      "name": "Europe/Dublin"
    },
    {
      "offset": "GMT",
      "name": "Europe/Lisbon"
    },
    {
      "offset": "GMT",
      "name": "Europe/London"
    },
    {
      "offset": "UTC",
      "name": "UTC"
    },
    {
      "offset": "GMT+01:00",
      "name": "Africa/Algiers"
    },
    {
      "offset": "GMT+01:00",
      "name": "Africa/Windhoek"
    },
    {
      "offset": "GMT+01:00",
      "name": "Atlantic/Azores"
    },
    {
      "offset": "GMT+01:00",
      "name": "Atlantic/Stanley"
    },
    {
      "offset": "GMT+01:00",
      "name": "Europe/Amsterdam"
    },
    {
      "offset": "GMT+01:00",
      "name": "Europe/Belgrade"
    },
    {
      "offset": "GMT+01:00",
      "name": "Europe/Brussels"
    },
    {
      "offset": "GMT+02:00",
      "name": "Africa/Cairo"
    },
    {
      "offset": "GMT+02:00",
      "name": "Africa/Blantyre"
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Beirut"
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Damascus"
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Gaza"
    },
    {
      "offset": "GMT+02:00",
      "name": "Asia/Jerusalem"
    },
    {
      "offset": "GMT+03:00",
      "name": "Africa/Addis_Ababa"
    },
    {
      "offset": "GMT+03:00",
      "name": "Asia/Riyadh89"
    },
    {
      "offset": "GMT+03:00",
      "name": "Europe/Minsk"
    },
    {
      "offset": "GMT+03:30",
      "name": "Asia/Tehran"
    },
    {
      "offset": "GMT+04:00",
      "name": "Asia/Dubai"
    },
    {
      "offset": "GMT+04:00",
      "name": "Asia/Yerevan"
    },
    {
      "offset": "GMT+04:00",
      "name": "Europe/Moscow"
    },
    {
      "offset": "GMT+04:30",
      "name": "Asia/Kabul"
    },
    {
      "offset": "GMT+05:00",
      "name": "Asia/Tashkent"
    },
    {
      "offset": "GMT+05:30",
      "name": "Asia/Kolkata"
    },
    {
      "offset": "GMT+05:45",
      "name": "Asia/Katmandu"
    },
    {
      "offset": "GMT+06:00",
      "name": "Asia/Dhaka"
    },
    {
      "offset": "GMT+06:00",
      "name": "Asia/Yekaterinburg"
    },
    {
      "offset": "GMT+06:30",
      "name": "Asia/Rangoon"
    },
    {
      "offset": "GMT+07:00",
      "name": "Asia/Bangkok"
    },
    {
      "offset": "GMT+07:00",
      "name": "Asia/Novosibirsk"
    },
    {
      "offset": "GMT+08:00",
      "name": "Etc/GMT+8"
    },
    {
      "offset": "GMT+08:00",
      "name": "Asia/Hong_Kong"
    },
    {
      "offset": "GMT+08:00",
      "name": "Asia/Krasnoyarsk"
    },
    {
      "offset": "GMT+08:00",
      "name": "Australia/Perth"
    },
    {
      "offset": "GMT+08:45",
      "name": "Australia/Eucla"
    },
    {
      "offset": "GMT+09:00",
      "name": "Asia/Irkutsk"
    },
    {
      "offset": "GMT+09:00",
      "name": "Asia/Seoul"
    },
    {
      "offset": "GMT+09:00",
      "name": "Asia/Tokyo"
    },
    {
      "offset": "GMT+09:30",
      "name": "Australia/Adelaide"
    },
    {
      "offset": "GMT+09:30",
      "name": "Australia/Darwin"
    },
    {
      "offset": "GMT+09:30",
      "name": "Pacific/Marquesas"
    },
    {
      "offset": "GMT+10:00",
      "name": "Etc/GMT+10"
    },
    {
      "offset": "GMT+10:00",
      "name": "Australia/Brisbane"
    },
    {
      "offset": "GMT+10:00",
      "name": "Australia/Hobart"
    },
    {
      "offset": "GMT+10:00",
      "name": "Asia/Yakutsk"
    },
    {
      "offset": "GMT+10:30",
      "name": "Australia/Lord_Howe"
    },
    {
      "offset": "GMT+11:00",
      "name": "Asia/Vladivostok"
    },
    {
      "offset": "GMT+11:30",
      "name": "Pacific/Norfolk"
    },
    {
      "offset": "GMT+12:00",
      "name": "Etc/GMT+12"
    },
    {
      "offset": "GMT+12:00",
      "name": "Asia/Anadyr"
    },
    {
      "offset": "GMT+12:00",
      "name": "Asia/Magadan"
    },
    {
      "offset": "GMT+12:00",
      "name": "Pacific/Auckland"
    },
    {
      "offset": "GMT+12:45",
      "name": "Pacific/Chatham"
    },
    {
      "offset": "GMT+13:00",
      "name": "Pacific/Tongatapu"
    },
    {
      "offset": "GMT+14:00",
      "name": "Pacific/Kiritimati"
    }
  ]
}

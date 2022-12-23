import React, { PureComponent } from 'react'
import _ from 'lodash'
import {Map, Marker} from 'google-maps-react';
import TenYard from '../images/10yardb.png'
import TwentyYard from '../images/20yardb.png'
import FifYard from '../images/15yard_map.svg'
import ThirtyYard from '../images/30yardb.png'
import HalfYard from '../images/1_2yardb.png'
import LiveLoad from '../images/liveloads.png'
import YellowMark from '../images/map-yellow-icon.svg'

var mapStyles = [
  {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
          {
              color: "#444444"
          }
      ]
  },
  {
      featureType: "landscape",
      elementType: "all",
      stylers: [
          {
              color: "#f2f2f2"
          }
      ]
  },
  {
      featureType: "poi",
      elementType: "all",
      stylers: [
          {
              visibility: "off"
          }
      ]
  },
  {
      featureType: "road",
      elementType: "all",
      stylers: [
          {
              saturation: -100
          },
          {
              lightness: 45
          }
      ]
  },
  {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
          {
              visibility: "simplified"
          }
      ]
  },
  {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [
          {
              visibility: "off"
          }
      ]
  },
  {
      featureType: "transit",
      elementType: "all",
      stylers: [
          {
              visibility: "off"
          }
      ]
  },
  {
      featureType: "water",
      elementType: "all",
      stylers: [
          {
              color: "#d2d2d2"
          },
          {
              visibility: "on"
          }
      ]
  }

];
const icons = [
  {key: '10 Yard', value: TenYard},
  {key: '15 Yard', value: FifYard },
  {key: '20 Yard', value: TwentyYard },
  {key: '30 Yard', value: ThirtyYard},
  {key: '1/2 Yard', value: HalfYard},
  {key: 'Live Load', value: LiveLoad},
  {key: 'status mark', value: YellowMark}
]
const google = window.google
export default class EmptyComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }


  render() {    
    const iconpath = _.findIndex(icons, (i) => {
      return i.key === this.props.icon
    })
    // console.log(__dirname)
    return (
      <Map
        google={google}
        styles={mapStyles}
        initialCenter={this.props.position}
        zoom={17}
      >
      <Marker position={this.props.position}
       icon={{
          url: iconpath !== -1 ? icons[iconpath].value : TenYard,
          anchor: new google.maps.Point(32,32),
          //scaledSize: new google.maps.Size(32,32)
        }}
        name={'Current location'} />
    </Map>
    )
  }
}

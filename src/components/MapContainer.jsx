import React from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

export default class MapContainer extends React.Component {
  static propTypes = {
    geoObjInfo: PropTypes.object,
    geoObjInfoUpstream: PropTypes.func.isRequired,
    ymapsUpstream: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      mapCenter: [55.75, 37.57],
      coordinates: [
        [55.67894, 37.47896],
        [55.76984, 37.68166]
      ],
      passengerPlacemark: null,
    };
    this.ymaps = null;
    this.myMap = null;    
    this.setMyMapRef = elem => {
      this.myMap = elem;
    }
  }

  handleMapClick = e => {
    const coords = e.get('coords');

    this.putPlacemark(coords);
    this.getAddress(coords).then(geoObjInfo => 
    {
      this.props.geoObjInfoUpstream(geoObjInfo);
    });
  }

  handleAPIFinishedLoading = ymaps => {
    // Сохранили ссылку на экземпляр Yandex Maps API.
    this.ymaps = ymaps;

    // Подписались на событие "click" по карте.
    this.myMap.events.add('click', this.handleMapClick);

    // Передали ссылку на экземпляр Yandex Maps API в корневой компонент.
    this.props.ymapsUpstream(ymaps);
  }

  // Создание метки.
  createPlacemark(coords, placemarkType) {
    const stylePresets = {
      passenger: 'islands#yellowDotIcon',
      crew: 'islands#greenAutoIcon'
    };

    const iconCaptions = {
      passenger: 'Место посадки',
      crew: 'Экипаж'
    };

    return new this.ymaps.Placemark(coords, {
      iconCaption: iconCaptions[placemarkType]
    }, {
      preset: stylePresets[placemarkType]
    });
  }

  putPlacemark(coords) {
    const { passengerPlacemark } = this.state;

    if (passengerPlacemark) {
      passengerPlacemark.geometry.setCoordinates(coords);
    } else {
      const newPlacemark = this.createPlacemark(coords, 'passenger');
      this.myMap.geoObjects.add(newPlacemark);
      this.setState({passengerPlacemark: newPlacemark});
    }
  }

  // Определяем адрес по координатам (обратное геокодирование).
  getAddress(coords) {
    return this.ymaps.geocode(coords).then(res => {
      const firstGeoObject = res.geoObjects.get(0);

      // Возвращает путь сообщения (улица, шоссе, проезд и т.д.), которому принадлежит топоним (если применимо).
      const thoroughfare = firstGeoObject.getThoroughfare();

      // Возвращает номер здания (включая корпус, владение и прочие дополнительные признаки).
      const premiseNumber = firstGeoObject.getPremiseNumber();

      let isValid = !!(thoroughfare && premiseNumber);

      return { coords, thoroughfare, premiseNumber, isValid };
    })
  }

  componentDidUpdate() {
    console.log('MapContainer, componentDidUpdate');
    const { geoObjInfo } = this.props;

    if (geoObjInfo) {
      this.putPlacemark(geoObjInfo.coords);
    }
  }

  render() {
    return (
      <YMaps  
        query={{
        ns: 'use-load-option',
        load: 'Map,Placemark,GeoObject,geocode',
        apikey: 'f40f1a5b-ffc6-4eb7-a222-533b8233a663'
      }}>
        <Map 
          defaultState={{ center: this.state.mapCenter, zoom: 10 }} 
          width="490" 
          height="320px"
          instanceRef={this.setMyMapRef}
          onLoad={this.handleAPIFinishedLoading}
        >
          {/* {this.state.coordinates.map(coordinate => <Placemark key={coordinate.toString()} geometry={coordinate} />)} */}
        </Map> 
      </YMaps>
    )
  }
}

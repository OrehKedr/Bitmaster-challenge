import React from 'react';
// import Loader from './Loader';
import PropTypes from 'prop-types';
import { YMaps, Map } from 'react-yandex-maps';
import APIConnectorService from '../services/APIConnectorService';
import { YMAPS_KEY } from '../.env';


const STYLE_PRESETS = {
  crew: 'islands#greenAutoIcon',
  addressIsFound: 'islands#yellowDotIcon',
  addressNotFound: 'islands#redDotIcon'
};

const ICON_CAPTION = {
  crew: 'Экипаж',
  addressIsFound: 'Точка подачи',
  addressNotFound: 'Адрес не найден'
};

export default class MapContainer extends React.Component {
  // Все properties берём из Redux store.
  static propTypes = {
    ymaps: PropTypes.object,
    geoObjInfo: PropTypes.object,
    crewList: PropTypes.array.isRequired,
    initYMAPS: PropTypes.func.isRequired,
    clickMap: PropTypes.func.isRequired,
    storeCrews: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      mapCenter: [56.852790, 53.211670],
    };
    this.myMap = null;    
    this.setMyMapRef = elem => {
      this.myMap = elem;
    }
  }

  handleMapClick = e => {
    const coords = e.get('coords');

    this.props.storeCrews([]);
    
    this.getAddress(coords).then( geoObjInfo => {
      this.props.clickMap(geoObjInfo);
    });
  }

  handleAPIFinishedLoading = ymaps => {
    // Подписались на событие "click" по карте.
    this.myMap.events.add('click', this.handleMapClick);

    // Сохранили ссылку на экземпляр Yandex Maps API в Redux store.
    this.props.initYMAPS(ymaps);
  }

  createPlacemark({ coords, preset }) {
    return new this.props.ymaps.Placemark(coords, {
      iconCaption: ICON_CAPTION[preset]
    }, {
      preset: STYLE_PRESETS[preset]
    });
  }

  /**
   * Параметр: type
   * Принимает одно из двух значений: 'passenger' или 'crew'.
   * Параметр: isValid
   * Если геокодер посчитал координаты валидными, то true.
   */
  putPlacemarks({ coords, isValid }) {
    // 1. Добавляем метку точки посадки.
    let preset = isValid ? 'addressIsFound' : 'addressNotFound';
    let Placemark = this.createPlacemark({ coords, preset });
    
    this.myMap.geoObjects.add(Placemark);

    // 2. Добавляем метки экипажей.
    preset = 'crew';
    const { crewList } = this.props;

    if (crewList && isValid) {
      crewList.forEach( crew => {
        const options = {
          preset,
          coords: [crew.lat, crew.lon]
        };
  
        Placemark = this.createPlacemark(options);
        this.myMap.geoObjects.add(Placemark);
      });
    }   
  }

  wipePlacemarks() {
    this.myMap.geoObjects.removeAll();
  }

  // Определяем адрес по координатам (обратное геокодирование).
  getAddress(coords) {
    return this.props.ymaps.geocode(coords).then(res => {
      const firstGeoObject = res.geoObjects.get(0);

      // Возвращает путь сообщения (улица, шоссе, проезд и т.д.), которому принадлежит топоним (если применимо).
      const thoroughfare = firstGeoObject.getThoroughfare();

      // Возвращает номер здания (включая корпус, владение и прочие дополнительные признаки).
      const premiseNumber = firstGeoObject.getPremiseNumber();

      let isValid = !!(thoroughfare && premiseNumber);

      return { coords, thoroughfare, premiseNumber, isValid };
    })
  }
  
  componentDidUpdate(prevProps) {
    const { geoObjInfo } = this.props;
    let shouldCrewListUpdate = true;

    this.wipePlacemarks();

    if (geoObjInfo) {
      if (prevProps.geoObjInfo) {
        shouldCrewListUpdate = (prevProps.geoObjInfo.thoroughfare !== geoObjInfo.thoroughfare) || 
          (prevProps.geoObjInfo.premiseNumber !== geoObjInfo.premiseNumber);
      }

      if (geoObjInfo.isValid) {
        if (shouldCrewListUpdate) {
          Promise.resolve( APIConnectorService.getCrews(geoObjInfo) ).then( APIanswer => {
            if (APIanswer) {
              this.props.storeCrews(APIanswer.data.crews_info);
            }
          });
        }
      }

      this.putPlacemarks(geoObjInfo);
    }
    
  }

  render() {
    return (
      <YMaps  
        query={{
        ns: 'use-load-option',
        load: 'Map,Placemark,GeoObject,geocode',
        apikey: YMAPS_KEY
      }}>
        <Map 
          defaultState={{ center: this.state.mapCenter, zoom: 10 }} 
          width="490" 
          height="320px"
          instanceRef={this.setMyMapRef}
          onLoad={this.handleAPIFinishedLoading}
        >
        </Map> 
      </YMaps>
    )
  }
}

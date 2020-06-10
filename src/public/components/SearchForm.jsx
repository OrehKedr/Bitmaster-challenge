import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import CrewCard from './CrewCard';
import FormErrors from './FormErrors';
import Modal from './Modal';
import APIConnectorService from '../services/APIConnectorService';


export default class SearchForm extends React.PureComponent {
  static propTypes = {
    ymaps: PropTypes.object,
    geoObjInfo: PropTypes.object,
    crewList: PropTypes.array.isRequired,
    clickMap: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isAddressValid: false,
      isYandexAPIReady: false,
      formErrors: { 
        adressInput: 'Адрес указан неверно.'
      },
      isFormValid: true,
      isModalOpen: false,
      orderInfo: {}
    };
    this.addressInput = React.createRef();
    this.geocode = this.geocode.bind(this);
    this.toggleModalOpen = this.toggleModalOpen.bind(this);
  }

  handleChangeAddress = (e) => {
    const address = e.target.value;
    
    if (address.length > 6 && this.state.isYandexAPIReady) {
      const job = this.debounce(this.geocode, 500);

      job(address).then( geoObjInfo => {
        const { coords, thoroughfare, premiseNumber, isValid } = geoObjInfo;

        let errInfo = isValid ? '' : 'Адрес указан неверно.';

        this.setState({ isAddressValid: isValid, isFormValid: true, formErrors: {adressInput: errInfo} });

        // Метку (placemark) с валидным адресом можно нанести на карту.
        if (isValid) { 
          this.props.clickMap({ coords, thoroughfare, premiseNumber, isValid });
        }
      })
    }
  }

  // Определяем координаты по адресу (прямое геокодирование).
  async geocode(address) {
    const { ymaps } = this.props;
    let coords = null,
      firstGeoObject = null,
      thoroughfare = null,
      premiseNumber = null,
      isValid = false;

    await ymaps.geocode(address)
      .then( res => {
        firstGeoObject = res.geoObjects.get(0);
        coords = firstGeoObject.geometry.getCoordinates();

        // Возвращает путь сообщения (улица, шоссе, проезд и т.д.), которому принадлежит топоним (если применимо).
        thoroughfare = firstGeoObject.getThoroughfare();

        // Возвращает номер здания (включая корпус, владение и прочие дополнительные признаки).
        premiseNumber = firstGeoObject.getPremiseNumber();

        isValid = !!(thoroughfare && premiseNumber);
      }).catch( e => {
        console.warn('Возникла ошибка при обращении к сервису geocoding. Проверьте адрес.', e);
      });

      return { coords, thoroughfare, premiseNumber, isValid };
  }

  // Небольшая оптимизация
  debounce(inner, ms = 0) {
    let timer = null;
    let resolves = [];

    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const result = inner.apply(null, arguments);
        resolves.forEach(r => r(result));
        resolves = [];
      }, ms);

      return new Promise(resolve => resolves.push(resolve));
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    if ( this.validateForm() ) {
      let options = {
        geoObjInfo: this.props.geoObjInfo,
        crew_id: this.props.crewList[0]
      };

      Promise.resolve( APIConnectorService.makeOrder(options) ).then( APIanswer => {
        if (APIanswer) {
          this.setState({ orderInfo: APIanswer, isModalOpen: true });
        }
      });
    }
  }

  validateForm() {
    // При необходимости можно написать более сложную проверку.
    this.setState({ isFormValid: this.state.isAddressValid });

    return this.state.isAddressValid;
  }

  toggleModalOpen() {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  }

  componentDidUpdate(prevProps) {
    const { geoObjInfo } = this.props;
    let shouldInputValueUpdate = true;

    if (this.props.ymaps) {
      if (!this.state.isYandexAPIReady) {
        this.setState({ isYandexAPIReady: true });
      }
    }

    if (geoObjInfo) {
      if (prevProps.geoObjInfo) {
        shouldInputValueUpdate = (prevProps.geoObjInfo.thoroughfare !== geoObjInfo.thoroughfare) || 
          (prevProps.geoObjInfo.premiseNumber !== geoObjInfo.premiseNumber);
      }

      if (shouldInputValueUpdate) {
        const address = geoObjInfo.thoroughfare + ', ' + geoObjInfo.premiseNumber;

        // В state компонента будет храниться признак валидности координат метки на карте.
        // Но управлять содержимым поля ввода адреса будем через ref.
        this.addressInput.current.value = address;

        let errInfo = geoObjInfo.isValid ? '' : 'Адрес указан неверно.';

        this.setState({ isYandexAPIReady: true, isAddressValid: geoObjInfo.isValid, isFormValid: true, formErrors: {adressInput: errInfo} });
      }
    }
  }

  render() {
    return (
      <>
      <div style={ this.state.isFormValid ? { display: 'none'} : { display: 'block'} }>
        <FormErrors formErrors={this.state.formErrors} />
      </div>
      <form onSubmit={this.handleSubmit}>
        <Box 
          display="flex" 
          flexDirection="row" 
          flexWrap="wrap" 
          justifyContent="space-between" 
          p={1} 
          boxSizing="border-box"
        >
          <Box 
            width="100%" 
            p={1} 
            boxSizing="border-box"
          >
            <TextField 
              id="addressID" 
              name="adressInput"
              label="Откуда" 
              defaultValue="Улица, номер дома" 
              error={!this.state.isAddressValid} 
              helperText={this.state.isAddressValid ? "Улица, номер дома" : "Адрес не найден"} 
              inputRef={this.addressInput}
              onChange={this.handleChangeAddress} 
              variant="outlined" 
              fullWidth 
              required 
            />
          </Box>
          <Box minWidth="343px" p={1} boxSizing="border-box">
            <Typography variant="body1" gutterBottom>
              Подходящий экипаж:
            </Typography>
            <CrewCard crewList={this.props.crewList}/>
          </Box>
          <Box p={1} boxSizing="border-box">
            <Button
              variant="contained" 
              color="primary" 
              endIcon={<SendIcon />}
              type="submit"
              disabled={!this.state.isFormValid}
            >
              Заказать
            </Button>
          </Box>
        </Box>
      </form>
      { this.state.isModalOpen && (<Modal orderID={this.state.orderInfo.data.order_id} toggleOpen={this.toggleModalOpen}/>) }
      </>
    )
  }

}

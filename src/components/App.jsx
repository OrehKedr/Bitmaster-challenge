import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import CrewList from './CrewList';
import SearchForm from './SearchForm';
import MapContainer from './MapContainer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ymaps: null,
      geoObjInfo: null,
      crewList: [
        {id: 0, model: 'Chevrolet Lacetti', color: 'синий'},
        {id: 0, model: 'Hyundai Solaris', color: 'белый'},
        {id: 0, model: 'Lada Vesta', color: 'серебристый металлик'}
      ],
    };
    this.setGeoObjectInfo = this.setGeoObjectInfo.bind(this);
    this.setYandexMapsAPI = this.setYandexMapsAPI.bind(this);
  }
  
  setGeoObjectInfo(geoObjInfo) {
    this.setState({geoObjInfo});
  }

  setYandexMapsAPI(ymaps) {
    this.setState({ymaps});
  }

  componentDidUpdate() {
    console.log('App componentDidUpdate');
  }

  render() {
    return (
      <Container maxWidth="md" disableGutters={true}>
        <Box 
          borderBottom={1} 
          borderColor="text.secondary" 
          color="text.primary" 
          boxSizing="border-box"
        >
          <Typography variant="h6" component="h1" gutterBottom>
            Детали заказа
          </Typography>
        </Box>
        <SearchForm 
          ymaps={this.state.ymaps} 
          crewList={[this.state.crewList[0]]} 
          geoObjInfo={this.state.geoObjInfo} 
          geoObjInfoUpstream={this.setGeoObjectInfo}
        />
        <Box 
          display="flex" 
          flexDirection="row" 
          flexWrap="wrap" 
          justifyContent="space-between" 
          p={2} 
          boxSizing="border-box"
        >
          <Box 
            width="55%" 
            minWidth="490px" 
            minHeight="320px" 
            pt={1} 
            boxSizing="border-box"
          >
            <MapContainer 
              geoObjInfo={this.state.geoObjInfo} 
              geoObjInfoUpstream={this.setGeoObjectInfo} 
              ymapsUpstream={this.setYandexMapsAPI}
            />
          </Box>
          <Box width="40%" minWidth="327px" pt={1} boxSizing="border-box">
            <CrewList crewList={this.state.crewList} />
          </Box>
        </Box>
      </Container>
    )
  }
}
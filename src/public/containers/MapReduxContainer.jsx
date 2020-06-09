import { connect } from 'react-redux';
import { initYMAPS, clickMap, storeCrews } from '../redux/actions';
import MapContainer from '../components/MapContainer';

const mapStateToProps = ({ mapReducer }) => ({
  ymaps: mapReducer.ymaps,
  geoObjInfo: mapReducer.geoObjInfo,
  crewList: mapReducer.crewList
});

const mapDispatchToProps = (dispatch) => ({
  initYMAPS: ymaps => dispatch(initYMAPS(ymaps)),
  clickMap: geoObjInfo => dispatch(clickMap(geoObjInfo)),
  storeCrews: crewList => dispatch(storeCrews(crewList))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
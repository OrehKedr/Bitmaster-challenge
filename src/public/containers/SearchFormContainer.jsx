import { connect } from 'react-redux';
import { clickMap } from '../redux/actions';
import SearchForm from '../components/SearchForm';

const mapStateToProps = ({ mapReducer }) => ({
  ymaps: mapReducer.ymaps,
  geoObjInfo: mapReducer.geoObjInfo,
  crewList: mapReducer.crewList
});

const mapDispatchToProps = (dispatch) => ({
  clickMap: geoObjInfo => dispatch(clickMap(geoObjInfo))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm);
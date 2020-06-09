import { connect } from 'react-redux';
import CrewList from '../components/CrewList';

const mapStateToProps = ({ mapReducer }) => ({
  crewList: mapReducer.crewList
});

export default connect(
  mapStateToProps
)(CrewList);
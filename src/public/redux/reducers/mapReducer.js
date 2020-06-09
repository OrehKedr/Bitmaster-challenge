import { INIT_YMAPS, CLICK_MAP, STORE_CREWS } from '../actions';

const initialState = {
  ymaps: null,
  geoObjInfo: null,
  crewList: []
};

export default function mapReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_YMAPS: {
      return {
        ...state,
        ymaps: action.ymaps
      };
    }
    case CLICK_MAP: {
      return {
        ...state,
        geoObjInfo: action.geoObjInfo
      };
    }
    case STORE_CREWS: {
      return {
        ...state,
        crewList: action.crewList
      };
    }
    default:
      return state;
  }
};
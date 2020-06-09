export const INIT_YMAPS = '@@form/INIT_YMAPS';
export const CLICK_MAP = '@@map/CLICK_MAP';
export const STORE_CREWS = '@@map/STORE_CREWS';

export const initYMAPS = ymaps => ({
  type: INIT_YMAPS,
  ymaps
});

export const clickMap = geoObjInfo => ({
  type: CLICK_MAP,
  geoObjInfo
});

export const storeCrews = crewList => ({
  type: STORE_CREWS,
  crewList
});
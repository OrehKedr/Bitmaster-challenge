const dateFormat = require('dateformat');
const API_URL = 'http://localhost:3000/api/';

export default class APIConnectorService {
  static async getCrews(geoObjInfo) {
    const address = geoObjInfo.thoroughfare + ', ' + geoObjInfo.premiseNumber;
    let source_time = dateFormat(new Date(), "yyyymmddHHMMss");
    let crewList = null;

    let body = {
      // формат времени ГГГГММДДччммсс 
      source_time,
      addresses:[
        {
          address,
          lat: geoObjInfo.coords[0],
          lon: geoObjInfo.coords[1]
        }
      ]
    };

    const url = API_URL + 'crews';
    await _postData(url, body).then(res => {
      let updData = {
        data: {}
      };

      if (res) {
        updData.data.crews_info = _ascendingSort(res.data.crews_info);
        crewList = Object.assign(res, updData);
      }
    });

    return crewList;
  }

  static async makeOrder({ geoObjInfo, crewID }) {
    const address = geoObjInfo.thoroughfare + ', ' + geoObjInfo.premiseNumber;
    let source_time = dateFormat(new Date(), "yyyymmddHHMMss");
    let orderInfo = {};

    let body = {
      // формат времени ГГГГММДДччммсс 
      source_time,
      addresses: [
        {
          address,
          lat: geoObjInfo.coords[0],
          lon: geoObjInfo.coords[1]
        }
      ],
      crew_id: crewID
    };

    const url = API_URL + 'order';
    await _postData(url, body).then(res => {
      if (res) {
        orderInfo = res
      }
    });

    return orderInfo;
  }

}

function _ascendingSort(crews_info) {
  return crews_info.sort((a,b) => a.distance - b.distance);
}

function _postData(url, data) {
  return fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  })
  .then(res => res.json())
  .catch(err => {
    console.log('Ошибка при поиске подходящих экипажей.', err)
  })
}


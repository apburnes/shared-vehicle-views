const axios = require('axios');

class Coord {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.request = axios.create({
      baseURL: 'https://api.coord.co',
      params: {
        access_key: apiKey
      }
    });
  }

  async getSharedVehicles(latitude, longitude, radius_km = 1) {
    const url = `/v1/sv/location`;

    try {
      let response = await this.request({
        method: 'GET',
        url,
        responseType: 'json',
        params: {
          latitude,
          longitude,
          radius_km
        }
      });

      return response;
    } catch (err) {
      return err;
    }
  }
}

module.exports = Coord;

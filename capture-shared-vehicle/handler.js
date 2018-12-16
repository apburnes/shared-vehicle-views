'use strict';

const Coord = require('../lib/coord');
const uploadObject = require('../lib/utils').uploadObject;

module.exports.capture = async (event, context) => {
  const bucket = process.env.BUCKET;
  const datatype = process.env.DATA_TYPE;
  const place = process.env.PLACE;
  const client = new Coord(process.env.API_KEY);
  const key = `${datatype}/${place}`;
  const coords = JSON.parse(process.env.LOCATION);

  try {
    const response = await client.getSharedVehicles(coords.lat, coords.lon, 20);

    const results = response.data.features
      .map(i => {
        const { id, properties } = i;
        return { id, ...properties };
      })
      .filter(x => x);

    const upload = await uploadObject(bucket, key, results);
    return upload;
  } catch (err) {
    return err;
  }
};

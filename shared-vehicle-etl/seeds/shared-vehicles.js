'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

function readdir(dirpath) {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, dirpath), (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

function readFile(dirpath, fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, dirpath, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);

      return resolve(data);
    });
  });
}

function parseRaw(dataString, fileName) {
  const data = JSON.parse(dataString);
  const fileNameParsed = path.parse(fileName).name.replace('-', '');
  const year = fileNameParsed.substring(0, 4);
  const month = fileNameParsed.substring(4, 6);
  const day = fileNameParsed.substring(6, 8);
  const hour = fileNameParsed.substring(8, 10);
  const minute = fileNameParsed.substring(10, 12);
  const collected_at = new Date(year + '-' + month + '-' + day + 'T' + hour + ':' + minute);

  return data.map((d) => {
    return {
      vehicle_id: d.id,
      name: d.name,
      last_reported: d.last_reported,
      location_id: d.location_id,
      location_type: d.location_type,
      system_id: d.system_id,
      num_docks_available: d.num_docks_available,
      num_bikes_available: d.num_bikes_available,
      manual_bike: d.vehicles_available.manual_bike || 0,
      pedal_assist_bike: d.vehicles_available.pedal_assist_bike || 0,
      electric_scooter: d.vehicles_available.electric_scooter || 0,
      collected_at: collected_at,
      lon: d.lon,
      lat: d.lat
    };
  });
}

function formatData(dirpath, fileName) {
  return readFile(dirpath, fileName).then((data) => {
    return parseRaw(data, fileName);
  });
}

exports.seed = function(knex, Promise) {
  return knex('shared_vehicles')
    .del()
    .then(() => {
      return readdir('../../data');
    })
    .then((res) => {
      const etlFiles = res
        .map((fileName) => {
          if (path.extname(fileName) !== '.json') return null;

          return formatData('../../data', fileName);
        })
        .filter((x) => x);

      return Promise.each(etlFiles, (i) => {
        return knex('shared_vehicles').insert(i);
      });
    })
    .catch((err) => console.log(err));
};

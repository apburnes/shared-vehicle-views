'use strict';

const fs = require('fs');
const path = require('path');
const upSql = path.join(__dirname, '../sql/001_init_latest.sql');
const downSql = path.join(__dirname, '../sql/001_init_rollback.sql');

exports.up = function(knex, Promise) {
  return new Promise(function(resolve, reject) {
    fs.readFile(upSql, 'utf8', function(err, sql) {
      if (err) return reject(err);

      return knex.raw(sql).then(resolve).catch(reject);
    });
  });
};

exports.down = function(knex, Promise) {
  return new Promise(function(resolve, reject) {
    fs.readFile(downSql, 'utf8', function(err, sql) {
      if (err) return reject(err);

      return knex.raw(sql).then(resolve).catch(reject);
    });
  });
};

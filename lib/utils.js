const S3 = require('aws-sdk/clients/s3');
const format = require('date-fns/format');
const s3 = new S3();

const uploadObject = (bucket, key, jsonObj) => {
  const objString = JSON.stringify(jsonObj, null, 2);
  const name = `${key}/${createTimestamp()}.json`;
  const params = { Bucket: bucket, Key: name, Body: objString };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(err);

      return resolve(data);
    });
  });
};

module.exports.uploadObject = uploadObject;

const createTimestamp = () => {
  const date = new Date();
  return format(date, 'YYYYMMDD-HHmmss');
};

module.exports.createTimestamp = createTimestamp;

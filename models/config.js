const fs = require('fs');
const path = require('path');
const debug = require('debug');

const print = debug('sssr');

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, `../frontend/${fileName}`), {encoding: 'utf8'}, (err, data) => {
      if (err) {
        print(`${err.message} ${err.stack}`);
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

module.exports = {
  getConfigData() {
    return Promise.all([readFile('skin.json'), readFile('en.json')])
    .then(data => {
      return {
        skinConfig: data[0],
        localizableStrings: {en: data[1]}
      };
    })
    .catch(err => {
      print(`${err.message} ${err.stack}`);
    });
  }
};

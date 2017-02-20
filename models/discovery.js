const config = require('config');
const api = require('../util/ooyala');
const utils = require('../util/utils');

function buildFilters(filters) {
  const array = [];
  for (const propName in filters) {
    if (utils.hasOwnProp(filters, propName)) {
      array.push([propName, JSON.stringify(filters[propName])].join('=='));
    }
  }
  return array.join('+AND+');
}

module.exports = {
  getTrends() {
    const filters = {
      'labels.name': 'Movie'
    };
    return api.get('/personalization/v1/trending', {limit: 5, filters: buildFilters(filters)}, {accountId: config.api.key, secure: true, subdomain: 'player'})
    .then(response => {
      return response.payload.data;
    });
  }
};

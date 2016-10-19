const api = require('../util/ooyala');

module.exports = {
  getTrends() {
    return api.get('/v2/discover/trending/momentum', {window: 'week', limit: 5, filter_by: 'Movie'}, {recursive: true});
  }
};

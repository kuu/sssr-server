const fetch = require('node-fetch');
const debug = require('debug');
const api = require('../util/ooyala');
const utils = require('../util/utils');

const print = debug('sssr');

module.exports = {
  getAssetData(embedCode) {
    const requestURL = `/v2/assets/${embedCode}`;
    print(`[assets.getAssetData] Request: ${requestURL}`);
    return api.get(requestURL)
    .then(data => {
      print(`[assets.getAssetData] Response: ${data}`);
      return data;
    });
  },

  getThumbnails(embedCode) {
    const requestURL = `https://player.ooyala.com/api/v1/thumbnail_images/${embedCode}`;
    print(`[assets.getThumbnails] Request: ${requestURL}`);
    return fetch(requestURL)
    .then(res => {
      print(`${res.status} ${res.statusText}`);
      if (res.status === 200) {
        return res.json();
      }
      utils.THROW(new Error(`fetch failed: ${res.status} ${res.statusText}`));
    })
    .then(data => {
      print(`[assets.getThumbnails] Response: ${data}`);
      return data;
    });
  },

  getContentTree(pcode, embedCode) {
    const requestURL = `https://player.ooyala.com/player_api/v1/content_tree/embed_code/${pcode}/${embedCode}?`;
    print(`[assets.getContentTree] Request: ${requestURL}`);
    return fetch(requestURL)
    .then(res => {
      print(`${res.status} ${res.statusText}`);
      if (res.status === 200) {
        return res.json();
      }
      utils.THROW(new Error(`fetch failed: ${res.status} ${res.statusText}`));
    })
    .then(data => {
      if (data.content_tree && data.content_tree[embedCode]) {
        const result = data.content_tree[embedCode];
        print(`[assets.getContentTree] Response: ${result}`);
        return result;
      }
      utils.THROW(new Error(`fetch failed: invalid data ${data}`));
    });
  }
};

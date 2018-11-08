'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    {\n      materials {\n        id,\n        tag,\n        name,\n        description,\n        style,\n        photo{\n          fileName,\n          handle,\n          url\n        }\n    }\n  }\n'], ['\n    {\n      materials {\n        id,\n        tag,\n        name,\n        description,\n        style,\n        photo{\n          fileName,\n          handle,\n          url\n        }\n    }\n  }\n']);

var _apolloClient = require('apollo-client');

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _apolloLinkHttp = require('apollo-link-http');

var _apolloCacheInmemory = require('apollo-cache-inmemory');

var _graphqlTag = require('graphql-tag');

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var GRAPHCMS_API = 'https://api-euwest.graphcms.com/v1/cjlqmvcyy0zny01gppvg11ts2/master';


var client = new _apolloClient2.default({
  link: new _apolloLinkHttp.createHttpLink({ uri: GRAPHCMS_API, fetch: _nodeFetch2.default }),
  cache: new _apolloCacheInmemory.InMemoryCache()
});

var GET_MATERIALS = (0, _graphqlTag2.default)(_templateObject);

module.exports = {

  downloadMaterials: function downloadMaterials() {
    client.query({
      query: GET_MATERIALS
    }).then(function (result) {
      var materials = result.data.materials;

      var _loop = function _loop() {
        console.log(materials[i]);
        var uri = materials[i].photo[0].url;
        var name = materials[i].photo[0].fileName;
        download(uri, 'pictures/' + name, function () {
          console.log('Downloaded: ' + name);
        });
      };

      for (var i = 0; i < materials.length; i++) {
        _loop();
      }
    });
  }
};

var download = function download(uri, filename, callback) {
  _request2.default.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    (0, _request2.default)(uri).pipe(_fs2.default.createWriteStream(filename)).on('close', callback);
  });
};

import ApolloClient from 'apollo-client';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
const GRAPHCMS_API = 'https://api-euwest.graphcms.com/v1/cjlqmvcyy0zny01gppvg11ts2/master';
import gql from 'graphql-tag';
import fs from 'fs';
import request from 'request';


const client = new ApolloClient({
  link: new createHttpLink({ uri: GRAPHCMS_API , fetch: fetch}),
 cache: new InMemoryCache()
})

const GET_MATERIALS = gql`
    {
      materials {
        id,
        tag,
        name,
        description,
        style,
        photo{
          fileName,
          handle,
          url
        }
    }
  }
`

module.exports = {

  downloadMaterials : function() {
    client.query({
      query: GET_MATERIALS
    }).then((result) => {
      const materials = result.data.materials;
      for (var i = 0; i < materials.length; i++) {
        console.log(materials[i]);
        const uri = materials[i].photo[0].url;
        const name = materials[i].photo[0].fileName;
        download(uri, 'pictures/' + name, function(){
          console.log('Downloaded: ' + name);
        });
      }
    });
  }
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

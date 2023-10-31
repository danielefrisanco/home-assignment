require('dotenv').config()
const axios = require('axios')
const client = axios.create({
  baseURL: `https://vault.immudb.io/ics/api/v1/ledger/${process.env.IMMUDB_VAULT_LEDGER}/collection`,
  json: true
})
async function execute (method, resource, data) {
  return client({
    method,
    url: resource,
    data,
    headers: {
      'X-API-Key': process.env.IMMUDB_VAULT_API_KEY
    }
  }).then(req => {
    return req.data
  }).catch(function (error) {
    console.log('error.toJSON()');
    // console.log(error);
    return false
  })

}

const immudbCreateCollection = async function(collection, fields) {
  let exists_already = await execute('get', `/readings`)
  if(exists_already == false) {
    return await execute('put', `/readings`, fields)
  }

}
let fields =  [
  {
  "name": "reading_time"
  },
  {
  "name": "requested_by_user_id"
  },
  {
  "name": "read_by_user_id"
  },
  {
  "name": "value"
  }
]
let indexes =  [
  {"fields": [
  "requested_by_user_id"
  ],
  "isUnique": true
  }
]
// I think the fre versio ncannot do this
immudbCreateCollection('readings', {idFieldName: "documentId", fields: fields, indexes: indexes})





// Examples
// documentId: Sequelize.STRING,
//   transactionId: Sequelize.STRING,
//   value: Sequelize.INTEGER,
//   reading_time: Sequelize.TIME,
//   requested_by_user_id: Sequelize.STRING,
//   read_by_user_id: Sequelize.STRING

// get collection
// curl -X 'GET'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' 


// // // // delete collection
// curl -X 'DELETE'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' 


// create collection
//   curl -X 'PUT'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' \
//   -d '{
// "idFieldName": "documentId",
// "fields": [
//   {
//   "name": "reading_time"
//   },
//   {
//   "name": "requested_by_user_id"
//   },
//   {
//   "name": "read_by_user_id"
//   },
//   {
//   "name": "value"
//   }
// ],
// "indexes": [
// {"fields": [
// "requested_by_user_id"
// ],
// "isUnique": true
// }
// ]}
// ]
// }'


 

// insert
curl -X 'PUT'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings/document' \
  -H 'accept: application/json' \
  -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
  -H 'Content-Type: application/json' \
  -d '{
    "requested_by_user_id": "requested_by_user_id",
    "reading_time": "2023-05-10T12:00:00Z",
    "read_by_user_id": "read_by_user_idread_by_user_idread_by_user_id",
    "value": "valuessssssst"
  }'

// curl -X 'PUT'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings/document' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' \
//   -d '{"requested_by_user_id":"google-oauth2|108855239449338150246","reading_time":"1698655392127","read_by_user_id":"google-oauth2|108855239449338150246","value":"55392"}'
// replace doc

// curl -X 'POST'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings/document' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' \
//   -d '{"document": {
//     "requested_by_user_id": "requested_by_user_id",
//     "reading_time": "2023-05-10T12:00:00Z",
//     "read_by_user_id": "aaaaaaaaaaaaaaaaaaaaaaa",
//     "value": "nuovo"
//   },
//   "query": {
//     "expressions": [{
//       "fieldComparisons": [{
//         "field": "requested_by_user_id",
//         "operator": "EQ",
//         "value": "requested_by_user_id"
//       }]
//     }]
//   }
// }'

//  versions
// curl -X 'POST'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings/document/653f69740000000000000024350e2a4b/audit' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' \
//   -d '{
//     "desc": true,
//     "page": 1,
//     "perPage": 10
//     }'
 





// curl -X 'POST'  'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings/documents/search' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: defaultro.CUH38O5PB-bPajYAZ4T0yg.7d1xkGG2tS7y293rNRDoULc-sxUxrZvxrQ55HKGf87LNjPpu' \
//   -H 'Content-Type: application/json' \
//   -d '{"keepOpen":false,"query":{"expressions":[{"fieldComparisons":[{"field":"requested_by_user_id","operator":"EQ","value":"google-oauth2|108855239449338150246"}]}]},"page":1,"perPage":100}',
    


// Replace
// curl -X 'POST'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings/document' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' \
//   -d '{"document": {
//     "requested_by_user_id": "daniele",
//     "reading_time": "2023-05-10T12:00:00Z",
//     "read_by_user_id": "daniele",
//     "value": "daniele"
//   },
//   "query": {
//     "expressions": [{
//       "fieldComparisons": [{
//         "field": "documentId",
//         "operator": "EQ",
//         "value": "653f69740000000000000024350e2a4b"
//       }]
//     }]
//   }
// }'

// curl -X 'POST'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/readings/document/653f69740000000000000024350e2a4b/audit' \
//   -H 'accept: application/json' \
//   -H 'X-API-Key: default.VlxvkhjZEpwY-O0nHKLrHw.RoE55gWwrQXxDHTSTNjDEKPOZGnxou-eKgXHuBdtO9uTACbo' \
//   -H 'Content-Type: application/json' \
//   -d '{
//     "desc": true,
//     "page": 1,
//     "perPage": 10
//     }'









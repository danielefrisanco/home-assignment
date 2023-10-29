const axios = require('axios')

const client = axios.create({
  baseURL: `https://vault.immudb.io/ics/api/v1/ledger/${process.env.IMMUDB_VAULT_LEDGER}/collection/${process.env.IMMUDB_VAULT_COLLECTION}`,
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
    console.log(error.toJSON());
    return false
  })

}

const write = async function(userId, data) {
  if(await read(userId)) {
    return replace(userId, data)
  } else {
    return execute('put', `/document`, data)
  }
}

const writeWithDocumentId = async function(documentId, data) {
  let new_data = {
    "document": data,
    "query": {
      "expressions": [{
        "fieldComparisons": [{
          "field": "documentId",
          "operator": "EQ",
          "value": documentId
        }]
      }]
    }
  }
  return execute('POST', `/document`, new_data)
}
const read = async function(userId) {
  let data = {
              "keepOpen": false,
              "query": {
                "expressions": [{
                  "fieldComparisons": [{
                    "field": "requested_by_user_id",
                    "operator": "EQ",
                    "value": userId
                  }]
                }]
              },
              "page": 1,
              "perPage": 1
            }
  return execute('post', `/documents/search`, data)
}


const replace = async function(userId, data) {
  let new_data = {
    "document": data,
    "query": {
      "expressions": [{
        "fieldComparisons": [{
          "field": "requested_by_user_id",
          "operator": "EQ",
          "value": userId
        }]
      }]
    }
  }
  return execute('POST', `/document`, new_data)
}
const versions = async function(documentId) {
  return execute('POST', `/document/${documentId}/audit`, { "desc": true, "page": 1, "perPage": 100 }) 
}
module.exports = { write, read, versions, writeWithDocumentId };




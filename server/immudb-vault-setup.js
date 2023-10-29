require('dotenv').config()
const axios = require('axios')

const client = axios.create({
  baseURL: `https://vault.immudb.io/ics/api/v1/ledger/${process.env.IMMUDB_VAULT_LEDGER}/collection/readings`,
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
    console.log(error);
    return false
  })

}

const immudbCreateCollection = async function(collection, fields) {
  console.log(fields)
  let exists_already = execute('get', `/`)
  console.log('exists_already?')
  if(!exists_already) {
    return execute('put', `/`, fields)
  }

}

// I think the fre versio ncannot do this
immudbCreateCollection('readings', {idFieldName: "id", fields: [{name: 'id', type: "STRING"}, {name: 'value', type: "STRING"}, {name: 'reading_time', type: "STRING"}]})

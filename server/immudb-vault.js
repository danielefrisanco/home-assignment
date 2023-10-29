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
    console.log('error.toJSON()');
    console.log(error.toJSON());
    return false
  })

}

const write = async function(data) {

  return execute('put', `/document`, data)

  // curl -X 'PUT'   'https://vault.immudb.io/ics/api/v1/ledger/default/collection/default/document' \
  // -H 'accept: application/json' \
  // -H 'X-API-Key: IMMUDB_VAULT_API_KEY' \
  // -H 'Content-Type: application/json' \
  // -d '{
  //   "name": "John Doe",
  //   "id": 1,
  //   "timestamp": "2023-05-10T12:00:00Z",
  //   "email": "johndoe@example.com",
  //   "age": 30,
  //   "address": "123 Main Street",
  //   "city": "New York",
  //   "country": "USA",
  //   "phone": "+1-123-456-7890",
  //   "is_active": true
  // }'

}
const read = async function() {
  // curl -X 'POST'  'https://vault.immudb.io/ics/api/v1/ledger/default/collection/default/documents/search' \
  // -H 'accept: application/json' \
  // -H 'X-API-Key: IMMUDB_VAULT_API_KEY_READ_ONLY' \
  // -H 'Content-Type: application/json' \
  // -d '{"page":1,"perPage":100}'
  return execute('get', `/documents/search`, {"page":1,"perPage":100})
}


module.exports = { write, read };

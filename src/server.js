/**
 * Run with:
 *
 * ```sh
 * npx ts-node --esm .\immudb-node-showcase\src\sql-showcase.ts
 * ```
 */
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
// const OktaJwtVerifier = require('@okta/jwt-verifier')

// const oktaJwtVerifier = new OktaJwtVerifier({
//   clientId: '0oacxman6qNc03DxC5d7',
//   issuer: 'https://dev-25906436.okta.com/oauth2/default/oauth2/default'
// })

let app = express()

app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
// app.use((req, res, next) => {
//   // require every request to have an authorization header
//   if (!req.headers.authorization) {
//     return next(new Error('Authorization header is required'))
//   }
//   let parts = req.headers.authorization.trim().split(' ')
//   let accessToken = parts.pop()
//   oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default')
//     .then(jwt => {
//       req.user = {
//         uid: jwt.claims.uid,
//         email: jwt.claims.sub
//       }
//       next()
//     })
//     .catch(next) // jwt did not verify!
// })

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite'
})

// Define our Reading model
// id, createdAt, and updatedAt are added by sequelize automatically
let Reading = database.define('readings', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
})

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Reading model
let readindResource = finale.resource({
  model: Reading,
  endpoints: ['/readings', '/readings/:id']
})

// var expressWs = require('express-ws')(app)
// // Get the /ws websocket route
// app.ws('/ws', async function (ws, req) {
//   ws.on('message', async function (msg) {
//     console.log(msg)
//     ws.send(JSON.stringify({ 'message': 'hello' }))

//     // Start listening for messages
//   })
// })
// Resets the database and launches the express app on :8082
database
  .sync({ force: true })
  .then(() => {
    console.log('8082 usare env')
    app.listen(8082, () => {
      console.log('listening to port localhost:8082')
    })
  })

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();
wss.on('connection', (ws) => {
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);
}

// const immudbClient = require('immudb-node')
app.get('/request_new_reading', function (req, res) {
  console.log('aaaaaaaaaaaaaaaaa')
  res.json({key: 'value'})
})

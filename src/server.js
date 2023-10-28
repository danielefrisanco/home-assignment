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
const { v4: uuidv4 } = require('uuid')
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

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 7071 })
const maxClients = 3
let rooms = {}
wss.on('connection', function connection (ws) {
  ws.on('message', function message (data) {
    const obj = JSON.parse(data)
    const type = obj.type
    const params = obj.params

    switch (type) {
      case 'create_or_join':
        create_or_join(params)
        break
      case 'join':
        join(params) // not used
        break
      case 'leave':
        leave(params) // not used
        break
      case 'new_reading':
        newReading(obj.room, params)
        break
      default:
        console.warn(`Type: ${type} unknown`)
        break
    }
  })
  function newReading (room, params) {
    // with the room shared it is possible to change page and still receive the  updates

    rooms[room].forEach(cl => cl.send(JSON.stringify(params)))
  }
  function create_or_join (params) {
    const room = params.room
    if (Object.keys(rooms).includes(room)) {
      console.warn(`Room ${room} already exists!`)
      // join if already exists
      rooms[room].push(ws)
      ws['room'] = room
      generalInformation(ws, 'joined')
      return
    }
    rooms[room] = [ws]
    ws['room'] = room

    generalInformation(ws, 'created')
  }
  function join (params) {
    console.log('join')
    // console.log(params)
    const room = params.code
    if (!Object.keys(rooms).includes(room)) {
      console.warn(`Room ${room} does not exist!`)
      return
    }

    if (rooms[room].length >= maxClients) {
      console.warn(`Room ${room} is full!`)
      return
    }

    rooms[room].push(ws)
    ws['room'] = room

    generalInformation(ws)
  }
  function leave (params) {
    console.log('leave')
    // console.log(params)
    const room = ws.room
    rooms[room] = rooms[room].filter(so => so !== ws)
    ws['room'] = undefined

    if (rooms[room].length === 0) { close(room) }
  }
  function close (room) {
    console.log('close')
    // console.log(room)
    rooms = rooms.filter(key => key !== room)
  }
  function generalInformation (ws, type = 'info') {
    let obj
    if (ws['room'] !== undefined) {
      obj = {
        'type': type,
        'params': {
          'room': ws['room'],
          'no-clients': rooms[ws['room']].length
        }
      }
    } else {
      obj = {
        'type': type,
        'params': {
          'room': 'no room'
        }
      }
    }

    ws.send(JSON.stringify(obj))
  }
})

// const immudbClient = require('immudb-node')
app.post('/request_new_reading', async function (req, res) {
  console.log('aaaaaaaaaaaaaaaaa')
  console.log(req.body.room)
  let type = 'new_reading'
  const job = {jobType: 'reading', jobId: uuidv4(), wsData: {'type': type, 'room': req.body.room, 'params': { type: type, status: 'ok', message: 'reading.completed' }}}

  await readingJobsQueue.add(job)
  console.log(`scheduled job: ${job.jobId}`)

  res.json({jobId: job.jobId})
})

const Queue = require('bull')

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = process.env.REDIS_PORT || 6379
const queueName = 'reading_jobs'

// A queue for the jobs scheduled based on a reading without any external requests
const readingJobsQueue = new Queue(queueName, { redis: { port: redisPort, host: redisHost } })

readingJobsQueue.process(async function (job, done) {
  console.log('process')
  const jobData = job.data
  await new Promise(resolve => setTimeout(resolve, 3000))

  // here read and write into immudb

  console.log(`processing job ${jobData.jobId}`)
  done(null, job.data)
})

readingJobsQueue.on('completed', function (job, result) {
  console.log('completed')
  const jobData = job.data
  var ws = new WebSocket('ws://localhost:7071')
  ws.onopen = function (event) {
    console.log('onopen')
    ws.send(JSON.stringify(jobData.wsData))
  }
  console.log(`job ${jobData.jobId} completed with result: ${JSON.stringify(result)}`)
})
console.log('reorder and refactor code, maybe separate ws and queue in two different files to import')
console.log('make sure to have a good readme or them to understand, comment and document code ')

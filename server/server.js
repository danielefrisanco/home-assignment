require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
const immudbVaultApi = require('./immudb-vault')

const { v4: uuidv4 } = require('uuid')

let app = express()

app.use(cors())
app.use(bodyParser.json())

const { auth } = require('express-oauth2-jwt-bearer');

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
})

app.use(
  checkJwt
);

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite'
})

// Define our Reading model
// id, createdAt, and updatedAt are added by sequelize automatically
let Reading = database.define('readings', {
  documentId: Sequelize.STRING,
  transactionId: Sequelize.STRING,
  value: Sequelize.INTEGER,
  reading_time: Sequelize.TIME,
  requested_by_user_id: Sequelize.STRING,
  read_by_user_id: Sequelize.STRING
})

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Reading model
// let readindResource = finale.resource({
//   model: Reading,
//   endpoints: ['/readings', '/readings/:id']
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
  
// WEBSOCKET
// TODO move to another file
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
    // with the room shared it is possible to change page and still receive the updates
    if(rooms[room]) {
      rooms[room].forEach(cl => cl.send(JSON.stringify(params)))
    }
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
    // not used now
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
    // not used now
    const room = ws.room
    rooms[room] = rooms[room].filter(so => so !== ws)
    ws['room'] = undefined

    if (rooms[room].length === 0) { close(room) }
  }
  function close (room) {
    // not used now
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
app.post('/request_new_reading/:user_id', async function (req, res) {
  // the user requested a reading
  let type = 'new_reading'
  let userId = req.params.user_id
  const job = {jobType: 'request_new_reading', jobId: uuidv4(), userId: userId, wsData: {'type': type, 'room': req.body.room, 'params': { type: type }}}
  var ws = new WebSocket('ws://localhost:7071')
  ws.onopen = function (event) {
    // send a messge to say that I am working on the request
    // TODO: refactor
    let working = job.wsData
    working.params['message'] = 'working'
    ws.send(JSON.stringify(working))
    ws.close()
  }

  // schedule a job that will make the reading happen
  await readingJobsQueue.add(job)
  console.log(`scheduled job: ${job.jobId}`)

  res.json({jobId: job.jobId})
})
// const immudbClient = require('immudb-node')
app.post('/new_reading/:user_id', async function (req, res) {
  // the user requested a reading
  let type = 'new_reading'
  let userId = req.params.user_id
  let reading = req.body.reading
  const job = {jobType: type, jobId: uuidv4(), userId: userId, wsData: {'type': type, 'room': req.body.room, 'params': { type: type, value: reading.value, documentId: reading.documentId}}}
  
  var ws = new WebSocket('ws://localhost:7071')
  ws.onopen = function (event) {
    // send a messge to say that I am working on the request
    // TODO: refactor
    let working = job.wsData
    working.params['message'] = 'working'
    ws.send(JSON.stringify(working))
    ws.close()
  }

  // schedule a job that will make the reading happen
  await readingJobsQueue.add(job)
  console.log(`scheduled job: ${job.jobId}`)

  res.json({jobId: job.jobId})
})

app.get('/readings/:user_id', async function (req, res) {
  // the user requested a reading
  let userId = req.params.user_id
  let response = await immudbVaultApi.read(userId)
  // TODO save documentId in db, if not found in db than call read
  let documentId = response.revisions[0]['document'].documentId
  let result = await immudbVaultApi.versions(documentId)
  let rows = []
  for(const revision of result.revisions) {
    rows.push({
      transactionId: revision.transactionId,
      documentId: revision.document.documentId,
      read_by_user_id: revision.document.read_by_user_id,
      reading_time: revision.document.reading_time,
      requested_by_user_id: revision.document.requested_by_user_id,
      value: revision.document.value,
      revision: revision.revision
    })
  }
  res.json(rows)
})




// JOB
const Queue = require('bull')
const { revokeToken } = require('@okta/okta-auth-js')

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = process.env.REDIS_PORT || 6379
const queueName = 'reading_jobs'

// A queue for the jobs scheduled based on a reading without any external requests
const readingJobsQueue = new Queue(queueName, { redis: { port: redisPort, host: redisHost } })
readingJobsQueue.process(async function (job, done) {
  const jobData = job.data
  console.log(`processing job ${jobData.jobId} ${jobData.type}`)
  if (jobData.jobType == 'request_new_reading') {
    // simulate a reading from the meter
    let fakeData = await fakeNewReading(jobData.userId)
    jobData.wsData.params = {
      ...jobData.wsData.params,
      ...fakeData
    }
  } else if (jobData.jobType == 'new_reading') {
    let new_reading = {value: jobData.wsData.params.value, reading_time: Date.now().valueOf().toString(), read_by_user_id: jobData.userId, requested_by_user_id: jobData.userId}
    let response = await immudbVaultApi.writeWithDocumentId(jobData.wsData.params.documentId, new_reading)
    // TODO refactor response handling
  if(!response) {
    jobData.wsData.params['status'] = 'failed'
    jobData.wsData.params['message'] = 'failed'
  } else {
    jobData.wsData.params['status'] = 'ok'
    jobData.wsData.params['message'] = 'completed'
    jobData.wsData.params['transactionId'] = response.transactionId
    jobData.wsData.params['documentId'] = response.documentId
    // insert into sql readings???? it is needed?
  } 
  }
  done(null, jobData)
})

readingJobsQueue.on('completed', function (job, result) {
  // job done, now we send a message ith the result through the websocket
  const jobData = job.data
  var ws = new WebSocket('ws://localhost:7071')
  ws.onopen = function (event) {
    ws.send(JSON.stringify(jobData.wsData))
  }
  console.log(`job ${jobData.jobId} completed with result: ${JSON.stringify(result)}`)
})
console.log(' style, user AUTH, reports ')

const fakeNewReading = async function(userId) {
  let data = {}
  await new Promise(resolve => setTimeout(resolve, 3000))
  // here we should call the meter to have a reading
  // it will reply/call a webhook to insert its reading into immudb, and then write on websocket

  let response = await immudbVaultApi.write(userId, {value: Date.now().valueOf().toString().slice(-8,-3), reading_time: Date.now().valueOf().toString(), read_by_user_id: 'fake-meter', requested_by_user_id: userId})
  // TODO refactor response handling
  if(!response) {
    data['status'] = 'failed'
    data['message'] = 'failed'
  } else {
    data['status'] = 'ok'
    data['message'] = 'completed'
    data['transactionId'] = response.transactionId
    data['documentId'] = response.documentId
    // insert into sql readings???? it is needed?
  }
  return data
}




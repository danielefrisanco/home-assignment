require('dotenv').config()
  
// WEBSOCKET

const WebSocket = require('ws')
const startWS = function() {
  const wss = new WebSocket.Server({ port: process.env.WS_PORT })
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
}

module.exports = { startWS };

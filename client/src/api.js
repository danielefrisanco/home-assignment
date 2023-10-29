// import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8082/',
  json: true
})

export default {
  async execute (accessToken, method, resource, data) {
    // inject the accessToken for each request
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  // getReadings (accessToken) {
  //   return this.execute(accessToken, 'get', '/readings')
  // },
  // getReading (accessToken, id) {
  //   return this.execute(accessToken, 'get', `/readings/${id}`)
  // },
  // createReading (accessToken, data) {
  //   return this.execute(accessToken, 'post', '/readings', data)
  // },
  // updateReading (accessToken, id, data) {
  //   return this.execute(accessToken, 'put', `/readings/${id}`, data)
  // },
  // deleteReading (accessToken, id) {
  //   return this.execute(accessToken, 'delete', `/readings/${id}`)
  // },
  getRequestNewReading (accessToken, room, userId) {
    return this.execute(accessToken, 'post', `/request_new_reading/${userId}`, {room: room})
  },
  getReadings (accessToken, userId) {
    return this.execute(accessToken, 'get', `/readings/${userId}`)
  },
  createNewReading (accessToken, room, reading, userId) {
    return this.execute(accessToken, 'post', `/new_reading/${userId}`, {room: room, reading: reading})
  }
}

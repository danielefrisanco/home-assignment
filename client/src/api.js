// import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8082/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    let accessToken = ''// await Vue.prototype.$auth.getAccessToken()
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
  getReadings () {
    return this.execute('get', '/readings')
  },
  getReading (id) {
    return this.execute('get', `/readings/${id}`)
  },
  createReading (data) {
    return this.execute('post', '/readings', data)
  },
  updateReading (id, data) {
    return this.execute('put', `/readings/${id}`, data)
  },
  deleteReading (id) {
    return this.execute('delete', `/readings/${id}`)
  },
  getRequestNewReading (room) {
    return this.execute('post', '/request_new_reading', {room: room})
  }
}

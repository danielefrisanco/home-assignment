<template>
  <div class="container-fluid mt-4">
    <h2>{{ message }}</h2>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ws: null,
      message: null
    }
  },
  props: {
    wsRoom: String
  },
  mounted: function () {
    this.ws = new WebSocket('ws://localhost:7071')
    var self = this
    this.ws.onopen = function (event) {
      self.createOrJoin()
    }

    this.ws.onmessage = function (event) {
      let data = JSON.parse(event.data)
      if (data.type === 'new_reading') {
        if (data.documentId) {
          self.message = `${self.$t(`reading.${data.message}`)}: ${data.documentId}`
        } else {
          self.message = `${self.$t(`reading.${data.message}`)}`
        }
        self.cleanMessage()
      } else {
        console.log(`Other: ${data}`)
      }
    }
  },
  methods: {
    createOrJoin () {
      // create or join
      const obj = {'type': 'create_or_join', 'params': { 'room': this.wsRoom }}
      this.ws.send(JSON.stringify(obj))
    },
    async cleanMessage () {
      await new Promise(resolve => setTimeout(resolve, 5000))
      this.message = null
    }
  }
}
</script>
<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">{{ $t("reading.manager") }}</h1>
    <b-alert :show="loading" variant="info">{{ $t("loading") }}...</b-alert>
    <b-row>
      <b-col>
        <b-btn :show="!connectedWs" variant="primary" @click.prevent="requestNewReading()">{{ $t("reading.request_new") }}</b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ $t("reading.documentId") }}</th>
              <th>{{ $t("reading.transactionId") }}</th>
              <th>{{ $t("reading.value") }}</th>
              <th>{{ $t("reading.reading_time") }}</th>
              <th>{{ $t("reading.requested_by_user_id") }}</th>
              <th>{{ $t("reading.read_by_user_id") }}</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reading in readings" :key="reading.id">
              <td>{{ reading.id }}</td>
              <td>{{ reading.documentId }}</td>
              <td>{{ reading.transactionId }}</td>
              <td>{{ reading.value }}</td>
              <td>{{ $d(new Date(reading.reading_time), 'short') }}</td>
              <td>{{ reading.requested_by_user_id }}</td>
              <td>{{ reading.read_by_user_id }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateReadingToEdit(reading)">{{ $t("edit") }}</a> -
                <a href="#" @click.prevent="deleteReading(reading.id)">{{ $t("delete") }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model.id ? $t('new') + ' ' + $t('reading.reading') + ' ID#' + model.id : $t('new') + ' ' + $t('reading.reading') )">
          <form @submit.prevent="saveReading">
            <b-form-group :label="$t('reading.documentId')">
              <b-form-input type="text" v-model="model.documentId"></b-form-input>
            </b-form-group>
            <b-form-group :label="$t('reading.value')">
              <b-form-textarea rows="4" v-model="model.value"></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">{{ $t("save") }} {{ $t("reading.reading") }}</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    let uid = null
    if (this.activeUser) {
      uid = this.activeUser.uid
    }
    return {
      loading: false,
      connectedWs: false,
      readings: [],
      model: {
        read_by_user_id: uid,
        requested_by_user_id: uid
      },
      ws: null,
      room: null
    }
  },
  props: {
    wsRoom: String,
    activeUser: Object
  },
  async created () {
    this.refreshReadings()
  },
  mounted: function () {
    console.log(this.wsRoom)
    this.ws = new WebSocket('ws://localhost:7071')
    var self = this
    this.ws.onopen = function (event) {
      self.createOrJoin()
      self.connectedWs = true
    }

    this.ws.onmessage = function (event) {
      let data = JSON.parse(event.data)
      if (data.type === 'new_reading') {
        self.refreshReadings()
      }
    }
  },
  methods: {
    createOrJoin () {
      // create or join
      const obj = {'type': 'create_or_join', 'params': { 'room': this.wsRoom }}
      this.ws.send(JSON.stringify(obj))
    },
    // join (code) {
    //   const obj = {'type': 'join', 'params': { 'code': code }}
    //   this.ws.send(JSON.stringify(obj))
    // },
    // leave () {
    //   this.ws.send('{ "type": "leave" }')
    // },
    async refreshReadings () {
      this.loading = true
      this.readings = await api.getReadings()
      this.loading = false
    },
    async populateReadingToEdit (reading) {
      this.model = Object.assign({}, reading)
    },
    async requestNewReading () {
      await api.getRequestNewReading(this.wsRoom)
    },
    async saveReading () {
      if (this.model.id) {
        await api.updateReading(this.model.id, this.model)
      } else {
        await api.createReading(this.model)
      }
      this.model = {} // reset form
      await this.refreshReadings()
    },
    async deleteReading (id) {
      if (confirm('Are you sure you want to delete this reading?')) {
        // if we are editing a reading we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deleteReading(id)
        await this.refreshReadings()
      }
    }
  }
}
</script>
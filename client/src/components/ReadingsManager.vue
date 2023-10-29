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
        <b-table striped hover :items="readings" :fields="fields">
          <template v-slot:cell(actions)="{ item }">
            <span>
              <!-- <b-btn variant="primary" @click.prevent="populateReadingToEdit(item)">{{ $t("edit") }}</b-btn>
              <b-btn variant="danger" @click.prevent="deleteReading(item.documentId)">{{ $t("delete") }}</b-btn> -->
            </span>
          </template>
        </b-table>
      </b-col>
      <b-col lg="3">
        <b-card :title="(model.documentId ? $t('edit') + ' ' + $t('reading.reading') + ' ID#' + model.documentId : $t('new') + ' ' + $t('reading.reading') )">
          <form @submit.prevent="saveReading">
            <b-form-group :label="$t('reading.documentId')">
              <b-form-input type="text" v-model="model.documentId" disabled="disabled"></b-form-input>
            </b-form-group>

            <b-form-group v-if="model.revision" :label="$t('reading.revision')">
              {{ model.revision }}
            </b-form-group>
            <b-form-group :label="$t('reading.value')">
              <b-form-input type="text" v-model="model.value"></b-form-input>
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
      uid = this.activeUser.sub
    }
    return {
      loading: false,
      connectedWs: false,
      readings: [],
      fields: [
        'ID',
        {key: 'revision', label: this.$t('reading.revision')},
        {key: 'documentId', label: this.$t('reading.documentId')},
        {key: 'transactionId', label: this.$t('reading.transactionId')},
        {key: 'value', label: this.$t('reading.value')},
        {key: 'reading_time', label: this.$t('reading.reading_time')},
        {key: 'requested_by_user_id', label: this.$t('reading.requested_by_user_id')},
        {key: 'read_by_user_id', label: this.$t('reading.read_by_user_id')},
        {key: 'actions', label: ''}
      ],
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
    // console.log(this.wsRoom)
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
      const accessToken = await this.$auth0.getAccessTokenSilently()
      this.readings = await api.getReadings(accessToken, this.activeUser.sub)
      // this.readings = await api.getReadings(accessToken)
      if (this.readings.length > 0) {
        // find another solution, like saving the docid in db or something
        this.model = Object.assign({}, {documentId: this.readings[0].documentId})
      }

      this.loading = false
    },
    populateReadingToEdit (reading) {
      this.model = Object.assign({}, reading)
    },
    async requestNewReading () {
      const accessToken = await this.$auth0.getAccessTokenSilently()
      await api.getRequestNewReading(accessToken, this.wsRoom, this.activeUser.sub)
    },
    async saveReading () {
      // TODO add the missing fields to the form
      const accessToken = await this.$auth0.getAccessTokenSilently()
      await api.createNewReading(accessToken, this.wsRoom, this.model, this.activeUser.sub)
      this.model = {} // reset form
      await this.refreshReadings()
    }
    // async saveReadingDb () {
    //   const accessToken = await this.$auth0.getAccessTokenSilently()
    //   if (this.model.documentId) {
    //     await api.updateReading(accessToken, this.model.documentId, this.model)
    //   } else {
    //     await api.createReading(accessToken, this.model)
    //   }
    //   this.model = {} // reset form
    //   await this.refreshReadings()
    // },
    // async deleteReading (documentId) {
    //   if (confirm('Are you sure you want to delete this reading?')) {
    //     // if we are editing a reading we deleted, remove it from the form
    //     if (this.model.documentId === documentId) {
    //       this.model = {}
    //     }
    //     const accessToken = await this.$auth0.getAccessTokenSilently()
    //     await api.deleteReading(accessToken, documentId)
    //     await this.refreshReadings()
    //   }
    // }
  }
}
</script>
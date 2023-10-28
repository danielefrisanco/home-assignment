<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">{{ $t("reading.manager") }}</h1>
    <b-alert :show="loading" variant="info">{{ $t("loading") }}...</b-alert>
    <b-row>
      <b-col>
        <b-btn variant="primary" @click.prevent="requestNewReading()">{{ $t("reading.request_new") }}</b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Updated At</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reading in readings" :key="reading.id">
              <td>{{ reading.id }}</td>
              <td>{{ reading.title }}</td>
              <td>{{ $d(new Date(reading.updatedAt), 'short') }}</td>
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
            <b-form-group :label="$t('title')">
              <b-form-input type="text" v-model="model.title"></b-form-input>
            </b-form-group>
            <b-form-group :label="$t('body')">
              <b-form-textarea rows="4" v-model="model.body"></b-form-textarea>
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
    return {
      loading: false,
      readings: [],
      model: {}
    }
  },
  async created () {
    this.refreshReadings()
  },
  methods: {
    async refreshReadings () {
      this.loading = true
      this.readings = await api.getReadings()
      this.loading = false
    },
    async populateReadingToEdit (reading) {
      this.model = Object.assign({}, reading)
    },
    async requestNewReading () {
      await api.getRequestNewReading()
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
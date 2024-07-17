import axios from '@axios'
import { defineStore } from 'pinia'

export const useCityDaysStore = defineStore('CityDaysStore', {
  actions: {
    getAll(params) {
      return axios.get('city-days', { params })
    },

    getOne(id) {
      return axios.get(`city-days/${id}`)
    },

    store(data) {
      return axios.post(`city-days`, data)
    },

    update(data) {
      return axios.put(`city-days/${data.id}`, data)
    },

    delete(data) {
      return axios.delete(`city-days/${data.id}`)
    },
  },
})

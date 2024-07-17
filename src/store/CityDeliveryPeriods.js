import axios from '@axios'
import { defineStore } from 'pinia'

export const useCityDeliveryPeriodsStore = defineStore('CityDeliveryPeriodsStore', {
  actions: {
    getAll(params) {
      return axios.get('city-delivery-periods', { params })
    },

    getOne(id) {
      return axios.get(`city-delivery-periods/${id}`)
    },

    store(data) {
      return axios.post(`city-delivery-periods`, data)
    },

    update(data) {
      return axios.put(`city-delivery-periods/${data.id}`, data)
    },

    delete(data) {
      return axios.delete(`city-delivery-periods/${data.id}`)
    },
  },
})

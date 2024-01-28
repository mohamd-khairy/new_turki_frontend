import axios from '@axios'
import { defineStore } from 'pinia'

export const useBanksStore = defineStore('BanksStore', {
  actions: {
    getAll(params) {
      return axios.get('banks', { params })
    },

    getOne(id) {
      return axios.get(`banks/${id}`)
    },

    store(data) {
      return axios.post(`banks`, data)
    },

    update(data) {
      return axios.put(`banks/${data.id}`, data)
    },

    delete(data) {
      return axios.delete(`banks/${data.id}`)
    },
  },
})

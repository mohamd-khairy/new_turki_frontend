import axios from '@axios'
import { defineStore } from 'pinia'

export const useStoresStore = defineStore('StoresStore', {
  actions: {
    getAll(params) {
      return axios.get('stores', { params })
    },

    getOne(id) {
      return axios.get(`stores/${id}`)
    },

    store(data) {
      return axios.post(`stores`, data)
    },

    update(data) {
      return axios.put(`stores/${data.id}`, data)
    },

    delete(data) {
      return axios.delete(`stores/${data.id}`)
    },
  },
})

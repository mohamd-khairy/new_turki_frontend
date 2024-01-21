import axios from '@axios'
import { defineStore } from 'pinia'

export const useSuppliersStore = defineStore('SuppliersStore', {
  actions: {
    getAll(params) {
      return axios.get('suppliers', { params })
    },

    getOne(id) {
      return axios.get(`suppliers/${id}`)
    },

    store(data) {
      return axios.post(`suppliers`, data)
    },

    update(data) {
      return axios.put(`suppliers/${data.id}`, data)
    },

    delete(data) {
      return axios.delete(`suppliers/${data.id}`)
    },
  },
})

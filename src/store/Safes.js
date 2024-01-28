import axios from '@axios'
import { defineStore } from 'pinia'

export const useSafesStore = defineStore('SafesStore', {
  actions: {
    getAll(params) {
      return axios.get('money-safes', { params })
    },

    getOne(id) {
      return axios.get(`money-safes/${id}`)
    },

    store(data) {
      return axios.post(`money-safes`, data)
    },

    update(data) {
      return axios.put(`money-safes/${data.id}`, data)
    },

    delete(data) {
      return axios.delete(`money-safes/${data.id}`)
    },
  },
})

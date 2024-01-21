import axios from '@axios'
import { defineStore } from 'pinia'

export const useStocksStore = defineStore('StocksStore', {
  actions: {
    getAll(params) {
      return axios.get('stocks', { params })
    },

    getOne(id) {
      return axios.get(`stocks/${id}`)
    },

    store(data) {
      return axios.post(`stocks` , data)
    },

    update(data) {
      return axios.post(`stocks/${data.id}`, data)
    },
    
    delete(data) {
      return axios.delete(`stocks/${data.id}`)
    },
  },
})

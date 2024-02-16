import axios from '@axios'
import { defineStore } from 'pinia'

export const useInvoicesStore = defineStore('InvoicesStore', {
  actions: {
    getAll(params) {
      return axios.get('invoices', { params })
    },

    getOne(id) {
      return axios.get(`invoices/${id}`)
    },

    store(data) {
      return axios.post(`invoices`, data)
    },

    update(data) {
      return axios.put(`invoices/${data.id}`, data)
    },

    pay(data) {
      return axios.post(`pay-invoice`, data)
    },

    delete(data) {
      return axios.delete(`invoices/${data.id}`)
    },
  },
})

import axios from '@axios'
import { defineStore } from 'pinia'

export const useCashbackStore = defineStore('CashbackStore', {
  actions: {
    // 👉 Fetch all Countries
    fetchCashbacks(params) {
      return axios.get('cashback', { params })
    },

    // 👉 Fetch Single Country
    fetchCashback(id) {
      return axios.get(`/cashback/${id}`)
    },
    updateCashbackStatus(id, data) {
      return axios.post(`update-cashback-status/${id}` , data)
    },
    storeCashback(data) {
      return axios.post(`cashback` , data)
    },
    editCashback(data) {
      return axios.put(`cashback/${data.id}` , data)
    },
    deleteCashback(data) {
      return axios.delete(`cashback/${data.id}`)
    },
  },
})

import axios from '@axios'
import { defineStore } from 'pinia'

export const usePaymentTypesStore = defineStore('PaymentTypesStore', {
  actions: {
    getAll(params) {
      return axios.get('payment-types', { params })
    },
  },
})

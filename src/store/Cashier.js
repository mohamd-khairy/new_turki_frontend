import axios from '@axios'
import { defineStore } from 'pinia'

export const useCashierStore = defineStore('cashier', {
  actions: {
    async getAllCategories () {
      const response = await axios.get(`/cashier-categories`)
      
      return response.data.data
    },
    async getAllSubCategories (id) {
      const response = await axios.get(`/cashier-subcategories/${id}`)
      
      return response.data.data
    },
    async getAllProducts (id) {
      const response = await axios.get(`/cashier-products/${id}`)
      
      return response.data.data
    },
  },
})
